import { useState } from 'react';
import { VisualBoard } from '../../components/VisualBoard';
import type { IMoodboardImage } from '../../interfaces';
import { backArrow } from '../../assets/svg-icons';
import { Link } from 'react-router-dom';

export default function Moodboard() {
  // Estado local para las imágenes (después conectar con backend)
  const [images, setImages] = useState<IMoodboardImage[]>([]);

  const handleImageAdd = (image: IMoodboardImage) => {
    setImages((prev) => {
      // Reemplazar si ya existe una imagen en esa posición
      const filtered = prev.filter(
        (img) => img.imagePositionNumber !== image.imagePositionNumber
      );
      return [...filtered, image];
    });

    // TODO: Enviar al backend
    console.log('Imagen agregada:', image);
  };

  const handleImageRemove = (position: number) => {
    setImages((prev) =>
      prev.filter((img) => img.imagePositionNumber !== position)
    );

    // TODO: Eliminar del backend
    console.log('Imagen eliminada en posición:', position);
  };

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-opacity"
          >
            <img src={backArrow} alt="" className="w-5 h-5" />
            <span>Atrás</span>
          </Link>
        </nav>
      </header>

      {/* Content */}
      <section className="px-4 mt-4">
        <VisualBoard
          images={images}
          onImageAdd={handleImageAdd}
          onImageRemove={handleImageRemove}
        />

        {/* Info adicional */}
        {images.length > 0 && (
          <aside className="mt-6 p-4 bg-primary/5 rounded-lg">
            <h3 className="text-sm font-medium text-tertiary mb-2">
              📊 Estadísticas
            </h3>
            <p className="text-xs text-tertiary/70">
              {images.length} de 11 imágenes agregadas
            </p>
          </aside>
        )}
      </section>
    </main>
  );
}

