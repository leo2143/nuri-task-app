import { nenufar } from "../../assets/svg-icons";

interface AvatarProps {
  imageUrl?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
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
      className={`bg-brand rounded-full flex items-center justify-center ${sizeClass}`}
      role="img"
      aria-label={name || "Sin imagen"}
    >
      <img src={nenufar} alt="" className="w-[62.5%] h-[62.5%]" />
    </div>
  );
}
