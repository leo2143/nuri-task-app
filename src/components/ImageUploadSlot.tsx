import { useRef } from 'react';
import { add } from '../assets/svg-icons';
import { CloudinaryImage } from './CloudinaryImage';

interface ImageUploadSlotProps {
  imageUrl?: string;
  imageAlt?: string;
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  isUploading?: boolean;
  className?: string;
}

export function ImageUploadSlot({
  imageUrl,
  imageAlt = 'Imagen del moodboard',
  onImageSelect,
  onImageRemove,
  isUploading = false,
  className = ''
}: ImageUploadSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!imageUrl) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
    // Reset input para permitir seleccionar la misma imagen
    event.target.value = '';
  };

  return (
    <div
      className={`
        group relative flex items-center justify-center
        bg-primary/5 border border-primary/20 rounded-lg
        cursor-pointer overflow-hidden
        transition-all duration-200
        hover:border-primary/40 hover:bg-primary/10
        ${className}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={imageUrl ? imageAlt : 'Agregar imagen'}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-primary">Subiendo...</span>
        </div>
      ) : imageUrl ? (
        <>
          <CloudinaryImage
            imageUrl={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
          {onImageRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onImageRemove();
              }}
              className="
                absolute top-2 right-2
                w-6 h-6 rounded-full
                bg-red-500 text-white
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                hover:bg-red-600
              "
              aria-label="Eliminar imagen"
            >
              ×
            </button>
          )}
        </>
      ) : (
        <img
          src={add}
          alt=""
          className="w-10 h-10 text-primary opacity-60"
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
