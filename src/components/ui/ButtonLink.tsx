import { Link } from "react-router-dom";
import { useClassNames } from "../../hooks";
import { add, lapiz } from "../../assets/svg-icons/index";

// Mapa de íconos disponibles - agregar nuevos íconos aquí
const iconMap = {
  add,
  lapiz,
} as const;

type IconName = keyof typeof iconMap;

interface ButtonLinkProps {
  to: string;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "ro";
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  icon?: IconName;
}

export default function ButtonLink({
  to,
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  ariaLabel,
  icon,
}: ButtonLinkProps) {
  // Estilos base (mismos que Button)
  const baseStyles = `
    relative font-body font-semibold  shadow-lg hover:shadow-xl
    focus:outline-none focus:ring-4
    transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
    inline-flex items-center justify-center gap-2
  `;

  const variantStyles = {
    primary: `
      bg-primary hover:bg-primary-light text-white
      focus:ring-primary/50
    `,
    secondary: `
      bg-secondary hover:bg-secondary-dark hover:text-neutral text-white
      focus:ring-secondary/50
    `,
    danger: `
      bg-red-600 hover:bg-red-700 text-white
      focus:ring-red-500/50
    `,
    success: `
      bg-green-600 hover:bg-green-700 text-white
      focus:ring-green-500/50
    `,
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-lg",
    lg: "px-8 py-4 text-lg rounded-lg",
    ro: "rounded-full p-3",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const widthImageStyle = fullWidth ? "absolute left-6" : "";

  const linkClasses = useClassNames(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyle,
    className,
  );
  const linkImageClasses = `w-5 h-5 ${widthImageStyle}`;

  return (
    <Link to={to} className={linkClasses} aria-label={ariaLabel}>
      {icon && (
        <img src={iconMap[icon]} alt={icon} className={linkImageClasses} />
      )}
      {children}
    </Link>
  );
}
