import { useState, useEffect } from 'react';
import { VisualBoard } from '../../components/VisualBoard';
import type { IMoodboardImage } from '../../interfaces';
import { moodboardService } from '../../services/moodboardService';

export default function Moodboard() {
  const [images, setImages] = useState<IMoodboardImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar moodboard al montar el componente
  useEffect(() => {
    loadMoodboard();
  }, []);

  const loadMoodboard = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setError(null);
      const moodboard = await moodboardService.getMoodboard();
      if (moodboard) {
        setImages(moodboard.images || []);
      }
    } catch (err) {
      console.error('Error loading moodboard:', err);
      setError('Error al cargar el moodboard. Por favor, intenta de nuevo.');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const handleImageAdd = async (image: IMoodboardImage) => {
    try {
      setError(null);
      await moodboardService.addImage({
        imageUrl: image.imageUrl,
        imageAlt: image.imageAlt,
        imagePositionNumber: image.imagePositionNumber,
      });
      await loadMoodboard(false);
    } catch (err) {
      console.error('Error adding image:', err);
      setError('Error al agregar la imagen. Por favor, intenta de nuevo.');
    }
  };

  const handleImageEdit = async (imageId: string, newImage: IMoodboardImage) => {
    try {
      setError(null);
      await moodboardService.updateImage(imageId, {
        imageUrl: newImage.imageUrl,
        imageAlt: newImage.imageAlt,
        imagePositionNumber: newImage.imagePositionNumber,
      });
      await loadMoodboard(false);
    } catch (err) {
      console.error('Error updating image:', err);
      setError('Error al actualizar la imagen. Por favor, intenta de nuevo.');
    }
  };

  const handleImageRemove = async (imageId: string) => {
    try {
      setError(null);
      await moodboardService.deleteImage(imageId);
      await loadMoodboard(false);
    } catch (err) {
      console.error('Error removing image:', err);
      setError('Error al eliminar la imagen. Por favor, intenta de nuevo.');
    }
  };

  return (
    <section className="bg-background">
      <div className="">
        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-4 p-4 rounded-lg bg-red-100 text-red-700 text-sm"
          >
            <strong>Error:</strong> {error}
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
              aria-label="Cerrar mensaje de error"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-tertiary/70">Cargando moodboard...</p>
          </div>
        ) : (
          <>
            <VisualBoard
              images={images}
              onImageAdd={handleImageAdd}
              onImageEdit={handleImageEdit}
              onImageRemove={handleImageRemove}
            />
        </>
        )}
      </div >
    </section>
  );
}
