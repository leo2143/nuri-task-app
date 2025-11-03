import React from "react";

interface InputProps {
  id: string;
  name: string;
  label: string;
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

export default function Input({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  error,
  className = "",
  helperText,
}: InputProps) {
  // Determinar si hay error
  const hasError = !!error;

  // Estilos base del contenedor
  const containerStyles = "space-y-2";

  // Estilos del label
  const labelStyles = "block text-sm font-medium text-tertiary font-body";

  // Estilos del input
  const baseInputStyles = `
    w-full px-4 py-3 rounded-lg border-2 
    focus:outline-none
    disabled:bg-neutral/10 disabled:cursor-not-allowed
    transition-all duration-200 font-body text-tertiary
    placeholder:text-tertiary/40
  `;

  // Estilos condicionales basados en estado
  const stateStyles = hasError
    ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
    : "border-neutral/30 focus:border-primary focus:ring-2 focus:ring-primary/20";

  // Combinar estilos
  const inputClasses = `
    ${baseInputStyles}
    ${stateStyles}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  // Estilos del texto de ayuda
  const helperTextStyles = "text-xs text-tertiary mt-1";

  // Estilos del mensaje de error
  const errorStyles =
    "text-xs text-red-500 font-medium mt-1 flex items-center gap-1";

  return (
    <div className={containerStyles}>
      {/* Label */}
      <label htmlFor={id} className={labelStyles}>
        {label}
        {required && <span className=" ml-1">*</span>}
      </label>

      {/* Input */}
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

      {/* Texto de ayuda */}
      {helperText && !error && (
        <p id={`${id}-helper`} className={helperTextStyles}>
          {helperText}
        </p>
      )}

      {/* Mensaje de error */}
      {error && (
        <p id={`${id}-error`} className={errorStyles} role="alert">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
