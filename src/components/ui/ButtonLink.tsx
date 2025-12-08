import React from "react";
import { Link } from "react-router-dom";
import { useClassNames } from "../../hooks";

interface ButtonLinkProps {
  to: string;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export default function ButtonLink({
  to,
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  ariaLabel,
}: ButtonLinkProps) {
  // Estilos base (mismos que Button)
  const baseStyles = `
    font-body font-semibold rounded-lg shadow-lg hover:shadow-xl
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

  // Tamaños (mismos que Button)
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  const linkClasses = useClassNames(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyle,
    className,
  );

  return (
    <Link to={to} className={linkClasses} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
