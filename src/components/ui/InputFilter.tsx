import React from "react";
import { filter, search } from "../../assets/svg-icons/index";

interface InputFilterProps {
  id: string;
  name: string;
  type?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  error?: string;
  className?: string;
  helperText?: string;
}

export default function InputFilter({
  id,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder = "Buscar",
  required = false,
  disabled = false,
  autoComplete,
  error,
  className = "",
  helperText,
}: InputFilterProps) {
  // Determinar si hay error
  const hasError = !!error;

  // Estilos base del contenedor
  const containerStyles = "flex items-center";

  // Estilos del input - Modo Light con espacio para el icono izquierdo
  const lightModeStyles = `
  w-4/5 pl-12 pr-4 py-3 rounded-lg  shadow-brand-glow
  ${value ? "bg-brand/10 border-brand/50 border-2" : "bg-white"}
  focus:bg-brand/20
  focus:outline-none
  focus:border-transparent
  disabled:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-60
  font-body text-tertiary
  placeholder:text-brand font-bold
`;

  // Combinar estilos
  const inputClasses = `
    ${lightModeStyles}
    ${hasError}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className={containerStyles}>
      {/* Input con icono de búsqueda */}
      <div className="relative flex-1">
        <img
          src={search}
          alt="icono de búsqueda"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-30 h-30 pointer-events-none"
        />
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          className={inputClasses}
        />
      </div>

      <img src={filter} alt="icono de filtro" className="cursor-pointer" />
    </div>
  );
}
