import React from "react";

type IconName =
  | "check"
  | "close"
  | "menu"
  | "user"
  | "edit"
  | "delete"
  | "add"
  | "arrow-right"
  | "arrow-left";

interface IconProps {
  name: IconName;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  ariaLabel?: string;
}

export default function Icon({
  name,
  className = "",
  size = "md",
  color,
  ariaLabel,
}: IconProps) {
  // Mapeo de tamaños a clases de Tailwind
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const icons: Record<IconName, string> = {
    check: "/path/to/check.svg",
    close: "/path/to/close.svg",
    menu: "/path/to/menu.svg",
    user: "/path/to/user.svg",
    edit: "/path/to/edit.svg",
    delete: "/path/to/delete.svg",
    add: "/path/to/add.svg",
    "arrow-right": "/path/to/arrow-right.svg",
    "arrow-left": "/path/to/arrow-left.svg",
  };

  const iconSrc = icons[name];

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const combinedClasses = `
    inline-block
    ${sizeClasses[size]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <img
      src={iconSrc}
      alt={ariaLabel || ""}
      className={combinedClasses}
      style={color ? { color } : undefined}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    />
  );
}

/**
 * ALTERNATIVA: SVG Inline Component
 *
 * Para mejor rendimiento y control, puedes crear componentes
 * individuales para cada icono:
 */
export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
