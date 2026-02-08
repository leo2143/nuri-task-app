import { useState } from 'react';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';

interface UploadedImage {
  url: string;
  publicId: string;
}

export default function TestUpload() {
  const { upload, isUploading, error } = useCloudinaryUpload();
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mostrar preview local
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const file = formData.get('image') as File;

    if (!file || file.size === 0) {
      alert('Por favor selecciona una imagen');
      return;
    }

    const result = await upload(file);

    if (result) {
      setUploadedImage({
        url: result.secure_url,
        publicId: result.public_id,
      });
      setPreview(null);
    }
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-tertiary mb-2">
            Test Upload Cloudinary
          </h1>
          <p className="text-tertiary/70">
            Prueba subir una imagen para verificar la integración.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-tertiary"
            >
              Seleccionar imagen
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="
                block w-full text-sm text-tertiary
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-white
                hover:file:bg-primary/90
                file:cursor-pointer
                cursor-pointer
              "
              required
              aria-describedby="image-help"
            />
            <p id="image-help" className="text-xs text-tertiary/50">
              Formatos: JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* Preview local */}
          {preview && (
            <figure className="rounded-lg overflow-hidden border border-primary/20">
              <img
                src={preview}
                alt="Preview de la imagen seleccionada"
                className="w-full h-48 object-cover"
              />
              <figcaption className="p-2 text-xs text-tertiary/50 bg-primary/5">
                Preview (aún no subida)
              </figcaption>
            </figure>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="
              w-full py-3 px-4 rounded-lg
              bg-primary text-white font-medium
              hover:bg-primary/90
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              flex items-center justify-center gap-2
            "
          >
            {isUploading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Subiendo...
              </>
            ) : (
              'Subir imagen'
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-4 p-4 rounded-lg bg-red-100 text-red-700 text-sm"
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Resultado */}
        {uploadedImage && (
          <section className="mt-8 space-y-4" aria-labelledby="result-title">
            <h2 id="result-title" className="text-lg font-semibold text-tertiary">
              ✅ Imagen subida exitosamente
            </h2>

            <figure className="rounded-lg overflow-hidden border border-green-300">
              <img
                src={uploadedImage.url}
                alt="Imagen subida a Cloudinary"
                className="w-full h-48 object-cover"
              />
            </figure>

            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium text-tertiary">URL:</dt>
                <dd className="text-tertiary/70 break-all bg-primary/5 p-2 rounded">
                  {uploadedImage.url}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-tertiary">Public ID:</dt>
                <dd className="text-tertiary/70 bg-primary/5 p-2 rounded">
                  {uploadedImage.publicId}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(uploadedImage.url)}
              className="
                w-full py-2 px-4 rounded-lg
                bg-tertiary/10 text-tertiary font-medium
                hover:bg-tertiary/20
                transition-colors duration-200
              "
            >
              📋 Copiar URL
            </button>
          </section>
        )}
      </div>
    </main>
  );
}


