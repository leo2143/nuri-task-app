import { useState } from 'react';
import { ImageUploadSlot } from './ImageUploadSlot';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';
import type { IMoodboardImage } from '../interfaces';

// Definición del grid (posiciones y tamaños)
const GRID_LAYOUT = [
  { position: 1, colSpan: 1, rowSpan: 1 },
  { position: 2, colSpan: 1, rowSpan: 1 },
  { position: 3, colSpan: 1, rowSpan: 1 },
  { position: 4, colSpan: 1, rowSpan: 1 },
  { position: 5, colSpan: 1, rowSpan: 1 },
  { position: 6, colSpan: 1, rowSpan: 1 },
  { position: 7, colSpan: 1, rowSpan: 1 },
  { position: 8, colSpan: 1, rowSpan: 1 },
  { position: 9, colSpan: 1, rowSpan: 1 },
  { position: 10, colSpan: 1, rowSpan: 1 },
  { position: 11, colSpan: 1, rowSpan: 1 },
];

interface VisualBoardProps {
  images: IMoodboardImage[];
  onImageAdd: (image: IMoodboardImage) => void;
  onImageRemove?: (position: number) => void;
}

export function VisualBoard({ images, onImageAdd, onImageRemove }: VisualBoardProps) {
  const { upload, isUploading } = useCloudinaryUpload();
  const [uploadingPosition, setUploadingPosition] = useState<number | null>(null);

  const getImageAtPosition = (position: number) => {
    return images.find(img => img.imagePositionNumber === position);
  };

  const handleImageSelect = async (file: File, position: number) => {
    setUploadingPosition(position);

    const result = await upload(file);

    if (result) {
      onImageAdd({
        imageUrl: result.secure_url,
        imageAlt: file.name,
        imagePositionNumber: position,
      });
    }

    setUploadingPosition(null);
  };

  return (
    <section aria-labelledby="visual-board-title">
      <h2 id="visual-board-title" className="text-2xl font-bold text-tertiary mb-2">
        Visual Board
      </h2>
      <p className="text-tertiary/70 mb-6">
        Agrega imágenes para inspirarte a alcanzar tus Metas.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 bg-white rounded-xl overflow-hidden shadow-sm">
        {GRID_LAYOUT.map((slot) => {
          const image = getImageAtPosition(slot.position);

          return (
            <ImageUploadSlot
              key={slot.position}
              imageUrl={image?.imageUrl}
              imageAlt={image?.imageAlt}
              onImageSelect={(file) => handleImageSelect(file, slot.position)}
              onImageRemove={onImageRemove ? () => onImageRemove(slot.position) : undefined}
              isUploading={isUploading && uploadingPosition === slot.position}
              className="aspect-square"
            />
          );
        })}
      </div>
    </section>
  );
}
