interface AvatarProps {
  imageUrl?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-12 h-12 text-xl",
  md: "w-20 h-20 text-4xl",
  lg: "w-32 h-32 text-6xl",
};

export function Avatar({ imageUrl, name, size = "md" }: AvatarProps) {
  const sizeClass = sizeClasses[size];

  if (imageUrl) {
    return (
      <img
        className={`rounded-full object-cover ${sizeClass}`}
        src={imageUrl}
        alt={name}
      />
    );
  }

  return (
    <div
      className={`bg-brand rounded-full flex items-center justify-center text-white font-bold ${sizeClass}`}
    >
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}
