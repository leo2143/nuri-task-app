import { useRef } from 'react';
import { translusentAdd } from '../assets/svg-icons';
import { CloudinaryImage } from './CloudinaryImage';

interface ImageUploadSlotProps {
  imageUrl?: string;
  imageAlt?: string;
  onImageSelect: (file: File) => void;
  onImageEdit?: (file: File) => void;
  onImageRemove?: () => void;
  isUploading?: boolean;
  isDeleting?: boolean;
  className?: string;
  variant?: "slot" | "avatar";
  labelledBy?: string;
}

export function ImageUploadSlot({
  imageUrl,
  imageAlt = 'Imagen del moodboard',
  onImageSelect,
  onImageEdit,
  onImageRemove,
  isUploading = false,
  isDeleting = false,
  className = '',
  variant = 'slot',
  labelledBy,
}: ImageUploadSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
    event.target.value = '';
  };

  const handleEditClick = () => {
    editInputRef.current?.click();
  };

  const handleEditFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageEdit) {
      onImageEdit(file);
    }
    event.target.value = '';
  };

  const isLoading = isUploading || isDeleting;
  const frameClass = `
    group relative flex items-center justify-center
    aspect-square shrink-0
    bg-white
    overflow-hidden
    transition-all duration-200
    ${variant === "avatar"
      ? "border-0 hover:bg-primary/5"
      : "border border-primary/20 hover:border-primary/60 hover:bg-primary/10"}
    ${className}
  `;

  return (
    <div className={frameClass}>
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-primary">
            {isDeleting ? 'Eliminando...' : 'Subiendo...'}
          </span>
        </div>
      ) : imageUrl ? (
        <>
          <CloudinaryImage
            imageUrl={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onImageEdit && (
              <button
                type="button"
                onClick={handleEditClick}
                className="
                  w-6 h-6 rounded-full
                  bg-primary text-white
                  flex items-center justify-center
                  hover:bg-primary/80
                  transition-colors duration-200
                "
                aria-label="Editar imagen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                </svg>
              </button>
            )}

            {onImageRemove && (
              <button
                type="button"
                onClick={onImageRemove}
                className="
                  w-6 h-6 rounded-full
                  bg-red-500 text-white
                  flex items-center justify-center
                  hover:bg-red-600
                  transition-colors duration-200
                "
                aria-label="Eliminar imagen"
              >
                ×
              </button>
            )}
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-full w-full items-center justify-center cursor-pointer"
          aria-label={imageAlt ? `Agregar ${imageAlt}` : "Agregar imagen"}
          aria-labelledby={labelledBy}
        >
          <img
            src={translusentAdd}
            alt=""
            className="w-10 h-10"
          />
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      <input
        ref={editInputRef}
        type="file"
        accept="image/*"
        onChange={handleEditFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
