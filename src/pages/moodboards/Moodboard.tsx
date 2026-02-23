import { useState, useEffect } from 'react';
import { VisualBoard } from '../../components/VisualBoard';
import type { IMoodboardImage } from '../../interfaces';
import { moodboardService } from '../../services/moodboardService';
import StateMessage from '../../components/StateMessage';
import { ConfirmModal, Spinner } from '../../components/ui';

export default function Moodboard() {
  const [images, setImages] = useState<IMoodboardImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  useEffect(() => {
    loadMoodboard();
  }, []);

  const loadMoodboard = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setLoadError(false);
      const moodboard = await moodboardService.getMoodboard();
      if (moodboard) {
        setImages(moodboard.images || []);
      }
    } catch (err) {
      console.error('Error loading moodboard:', err);
      setLoadError(true);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const handleImageAdd = async (image: IMoodboardImage) => {
    try {
      await moodboardService.addImage({
        imageUrl: image.imageUrl,
        imageAlt: image.imageAlt,
        imagePositionNumber: image.imagePositionNumber,
      });
      await loadMoodboard(false);
    } catch (err) {
      console.error('Error adding image:', err);
      setOperationError('Error al agregar la imagen. Por favor, intenta de nuevo.');
    }
  };

  const handleImageEdit = async (imageId: string, newImage: IMoodboardImage) => {
    try {
      await moodboardService.updateImage(imageId, {
        imageUrl: newImage.imageUrl,
        imageAlt: newImage.imageAlt,
        imagePositionNumber: newImage.imagePositionNumber,
      });
      await loadMoodboard(false);
    } catch (err) {
      console.error('Error updating image:', err);
      setOperationError('Error al actualizar la imagen. Por favor, intenta de nuevo.');
    }
  };

  const handleImageRemove = async (imageId: string) => {
    try {
      await moodboardService.deleteImage(imageId);
      await loadMoodboard(false);
    } catch (err) {
      console.error('Error removing image:', err);
      setOperationError('Error al eliminar la imagen. Por favor, intenta de nuevo.');
    }
  };

  if (loadError) {
    return (
      <section className="bg-background">
        <StateMessage itemName="el moodboard" variant="error" />
      </section>
    );
  }

  return (
    <section className="bg-background">
      <ConfirmModal
        isOpen={!!operationError}
        onClose={() => setOperationError(null)}
        onConfirm={() => setOperationError(null)}
        title="Error"
        message={operationError || ''}
        confirmText="Cerrar"
        variant="danger"
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner size="xl" />
          <p className="mt-4 text-tertiary/70">Cargando moodboard...</p>
        </div>
      ) : (
        <VisualBoard
          images={images}
          onImageAdd={handleImageAdd}
          onImageEdit={handleImageEdit}
          onImageRemove={handleImageRemove}
        />
      )}
    </section>
  );
}
