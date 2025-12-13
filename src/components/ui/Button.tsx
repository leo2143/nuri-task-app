import React from "react";
import { useClassNames } from "../../hooks";
import { add, lapiz, trash, filter } from "../../assets/svg-icons/index";

// Mapa de íconos disponibles - agregar nuevos íconos aquí
const iconMap = {
  add,
  lapiz,
  trash,
  filter,
} as const;

type IconName = keyof typeof iconMap;

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success" | "brand" | "ghost";
  size?: "sm" | "md" | "lg" | "ro";
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  icon?: IconName;
}

export default function Button({
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  ariaLabel,
  icon,
}: ButtonProps) {
  // Estilos base
  const baseStyles = `
    relative font-body font-semibold
    transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
    inline-flex items-center justify-center gap-2
  `;

  // Estilos por variante
  const variantStyles = {
    primary: `
      bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-xl
      focus:outline-none focus:ring-4
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:ring-primary/50
      disabled:hover:bg-primary
    `,
    secondary: `
      bg-secondary hover:bg-secondary-dark hover: text-neutral shadow-lg hover:shadow-xl
      focus:outline-none focus:ring-4
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:ring-secondary/50
      disabled:hover:bg-secondary
    `,
    danger: `
      bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl
      focus:outline-none focus:ring-4
      disabled:opacity-50 disabled:cursor-not-allowed

      focus:ring-red-500/50
      disabled:hover:bg-red-600
    `,
    success: `
      bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl
      focus:outline-none focus:ring-4
      disabled:opacity-50 disabled:cursor-not-allowed

      focus:ring-green-500/50
      disabled:hover:bg-green-600
    `,
    brand: `
      bg-brand hover:bg-brand/80 text-white shadow-lg hover:shadow-xl
      focus:outline-none focus:ring-4
      disabled:opacity-50 disabled:cursor-not-allowed

      focus:ring-brand/50
      disabled:hover:bg-brand
    `,
    ghost: `
      bg-none text-gray-500 hover:text-gray-700
     `,
  };

  //tamaños
  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-lg",
    lg: "px-8 py-4 text-lg rounded-lg",
    ro: "rounded-full p-3",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const widthImageStyle = fullWidth ? "absolute left-6" : "";

  const buttonClasses = useClassNames(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyle,
    className,
  );
  const linkImageClasses = `w-5 h-5 ${widthImageStyle}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {typeof children === "string" ? `${children}...` : children}
        </>
      ) : (
        <>
          {icon && (
            <img src={iconMap[icon]} alt={icon} className={linkImageClasses} />
          )}
          {children}
        </>
      )}
    </button>
  );
}
