import { useState } from 'react';
import { ImageUploadSlot } from './ImageUploadSlot';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';
import type { IMoodboardImage } from '../interfaces';

const GRID_LAYOUT = [
  { position: 1, colSpan: 3 },
  { position: 2, colSpan: 3 },
  { position: 3, colSpan: 3 },
  { position: 4, colSpan: 3 },
  { position: 5, colSpan: 2 },
  { position: 6, colSpan: 2 },
  { position: 7, colSpan: 2 },
  { position: 8, colSpan: 3 },
  { position: 9, colSpan: 3 },
  { position: 10, colSpan: 3 },
  { position: 11, colSpan: 3 },
];

interface VisualBoardProps {
  images: IMoodboardImage[];
  onImageAdd: (image: IMoodboardImage) => Promise<void>;
  onImageEdit?: (imageId: string, image: IMoodboardImage) => Promise<void>;
  onImageRemove?: (imageId: string) => Promise<void>;
}

export function VisualBoard({ images, onImageAdd, onImageEdit, onImageRemove }: VisualBoardProps) {
  const { upload } = useCloudinaryUpload();
  const [uploadingPosition, setUploadingPosition] = useState<number | null>(null);
  const [editingPosition, setEditingPosition] = useState<number | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const getImageAtPosition = (position: number) => {
    return images.find(img => img.imagePositionNumber === position);
  };

  const handleImageSelect = async (file: File, position: number) => {
    setUploadingPosition(position);

    const result = await upload(file);

    if (result) {
      await onImageAdd({
        imageUrl: result.secure_url,
        imageAlt: file.name,
        imagePositionNumber: position,
      });
    }

    setUploadingPosition(null);
  };

  const handleImageEdit = async (file: File, position: number, imageId: string) => {
    setEditingPosition(position);

    const result = await upload(file);

    if (result && onImageEdit) {
      await onImageEdit(imageId, {
        imageUrl: result.secure_url,
        imageAlt: file.name,
        imagePositionNumber: position,
      });
    }

    setEditingPosition(null);
  };

  const handleImageRemove = async (imageId: string) => {
    setDeletingImageId(imageId);
    if (onImageRemove) {
      await onImageRemove(imageId);
    }
    setDeletingImageId(null);
  };

  return (
    <section aria-labelledby="visual-board-title">
      <h2 id="visual-board-title" className="text-xl font-bold text-tertiary mb-2">
        Visual Board
      </h2>
      <p className="font-medium text-base text-tertiary/70 mb-6">
        Agrega imágenes para inspirarte a alcanzar tus Metas.
      </p>

      <div className="grid grid-cols-6 bg-white rounded-xl overflow-hidden shadow-sm">
        {GRID_LAYOUT.map((slot) => {
          const image = getImageAtPosition(slot.position);
          const isCurrentUploading = uploadingPosition === slot.position;
          const isCurrentEditing = editingPosition === slot.position;
          const colSpanClass = slot.colSpan === 2 ? 'col-span-2' : 'col-span-3';

          return (
            <ImageUploadSlot
              key={slot.position}
              imageUrl={image?.imageUrl}
              imageAlt={image?.imageAlt}
              onImageSelect={(file) => handleImageSelect(file, slot.position)}
              onImageEdit={
                image?._id && onImageEdit
                  ? (file) => handleImageEdit(file, slot.position, image._id!)
                  : undefined
              }
              onImageRemove={
                image?._id && onImageRemove
                  ? () => handleImageRemove(image._id!)
                  : undefined
              }
              isUploading={isCurrentUploading || isCurrentEditing}
              isDeleting={deletingImageId === image?._id}
              className={`aspect-square ${colSpanClass}`}
            />
          );
        })}
      </div>
    </section>
  );
}
