import { useClassNames } from "../../hooks";
import { nuriConNenu } from "../../assets/ilustrations";

type TramaHeaderVariant = "default" | "white";

interface TramaHeaderProps {
  variant?: TramaHeaderVariant;
  className?: string;
}

/**
 * Encabezado decorativo con trama repetida para pantallas de autenticación.
 * default usa trama negra; "white" usa trama blanca y muestra a Nuri.
 */
export default function TramaHeader({
  variant = "default",
  className = "",
}: TramaHeaderProps) {
  const isWhite = variant === "white";
  const headerClasses = useClassNames(
    isWhite ? "trama-white-bg" : "trama-black-bg",
    "relative flex items-center justify-center pt-40",
    isWhite ? "overflow-x-visible" : "overflow-x-hidden",
    className,
  );

  return (
    <header className={headerClasses}>
      {variant === "white" && (
        <img
          src={nuriConNenu}
          alt="Nuri mascota"
          className="absolute w-52 h-auto z-10 top-5 mx-auto"
        />
      )}
    </header>
  );
}
