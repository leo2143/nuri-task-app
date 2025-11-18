interface IconWrapperProps {
  src: string;
  alt: string;
  className?: string;
}

export default function IconWrapper({
  src,
  alt,
  className = "",
}: IconWrapperProps) {
  return (
    <div className={`p-4 w-[50px] h-[50px] ${className}`}>
      <img src={src} alt={alt} />
    </div>
  );
}
