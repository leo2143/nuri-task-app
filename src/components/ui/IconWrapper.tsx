interface IconWrapperProps {
  src: string;
  alt: string;
  className?: string;
}
// quizas para evitar tener tantosa svg como archivos solo por el color
//sea mejor tenerlos todos quemados en un archivo osea aca, y ponerlos en variables con sus nombres
//asi en el componente lo llamo facil y si requiero le mando un nuevo bg para que cambie el color
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
