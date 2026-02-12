import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { cloudinary } from '../config/cloudinary';

interface CloudinaryImageProps {
  publicId?: string;
  imageUrl?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function CloudinaryImage({
  publicId,
  imageUrl,
  alt,
  width = 300,
  height = 300,
  className = ''
}: CloudinaryImageProps) {
  // Si tenemos publicId, usamos el SDK para optimizaciones
  if (publicId) {
    const img = cloudinary
      .image(publicId)
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()).width(width).height(height));

    return (
      <AdvancedImage
        cldImg={img}
        alt={alt}
        className={className}
      />
    );
  }

  // Si solo tenemos URL directa, usamos img normal
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        loading="lazy"
      />
    );
  }

  return null;
}
