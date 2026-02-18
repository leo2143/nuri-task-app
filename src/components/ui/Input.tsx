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
  darkMode?: boolean;
  responsiveDarkMode?: boolean;
  withDivider?: boolean;
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
  darkMode = false,
  responsiveDarkMode = false,
  withDivider = false,
}: InputProps) {
  // Determinar si hay error
  const hasError = !!error;

  // Estilos base del contenedor
  const containerStyles = "space-y-2";

  // Estilos del label
  const labelStyles = responsiveDarkMode
    ? "block text-base font-medium text-white md:text-brand font-body"
    : darkMode
      ? "block text-base font-medium text-white font-body"
      : "block text-base font-medium text-tertiary font-body";

  // Estilos del input - Modo Light
  const lightModeStyles = `
  w-full px-4 py-3 rounded-lg border-2  shadow-brand-glow
  ${value ? "bg-white border-brand/50 font-bold" : "bg-white"}
  focus:bg-white
  focus:outline-none
  focus:border-transparent
  disabled:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-60
  font-body text-tertiary text-sm
  placeholder:text-brand placeholder:font-semibold
  [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgba(47,150,133,0.1)]
  [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(58,37,29)]
  [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_rgba(47,150,133,0.2)]
  [&:-webkit-autofill:active]:shadow-[inset_0_0_0_1000px_rgba(47,150,133,0.2)]
`;

  // Estilos del input - Modo Dark
  const darkModeStyles = `
  w-full px-4 py-3 rounded-lg border-2 border-white/20
  ${value ? "bg-white/10 border-primary/60" : "bg-white/5"}
  focus:bg-white/15
  focus:outline-none
  focus:border-transparent
  disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60
  font-body text-white
  placeholder:text-white/50
  [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.1)]
  [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(255,255,255)]
  [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.15)]
  [&:-webkit-autofill:active]:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.15)]
`;

  // Estilos responsive: Dark en mobile, Light en desktop
  const responsiveDarkModeStyles = `
  w-full px-4 py-3 rounded-lg border-2
  border-white/20 md:border-tertiary/50
  ${value ? "bg-white/10 md:bg-primary/10 border-primary/60 md:border-primary/50" : "bg-white/5 md:bg-primary/0"}
  focus:bg-white/15 md:focus:bg-primary/20
  focus:outline-none
  focus:border-transparent
  disabled:bg-white/5 md:disabled:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60
  font-body
  text-white md:text-tertiary
  placeholder:text-white/50 md:placeholder:text-tertiary/40
  [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(58,37,29)]
`;

  const baseInputStyles = responsiveDarkMode
    ? responsiveDarkModeStyles
    : darkMode
      ? darkModeStyles
      : lightModeStyles;

  // Estilos condicionales basados en estado
  const stateStyles = hasError
    ? responsiveDarkMode
      ? "!border-red-400 md:!border-red-500 !bg-red-500/20 md:!bg-red-50 focus:!border-transparent focus:ring-2 focus:ring-red-400/30 md:focus:ring-red-500/20"
      : darkMode
        ? "!border-red-400 !bg-red-500/20 focus:!border-transparent focus:ring-2 focus:ring-red-400/30"
        : "!border-red-500 !bg-red-50 focus:!border-transparent focus:ring-2 focus:ring-red-500/20"
    : responsiveDarkMode
      ? "focus:ring-2 focus:ring-white/30 md:focus:ring-primary/50"
      : darkMode
        ? "focus:ring-2 focus:ring-white/30"
        : "focus:ring-2 focus:ring-primary/50";

  // Combinar estilos
  const inputClasses = `
    ${baseInputStyles}
    ${stateStyles}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  // Estilos del texto de ayuda
  const helperTextStyles = responsiveDarkMode
    ? "text-xs text-white/70 md:text-tertiary mt-1"
    : darkMode
      ? "text-xs text-white/70 mt-1"
      : "text-xs text-tertiary mt-1";

  // Estilos del mensaje de error
  const errorStyles = responsiveDarkMode
    ? "text-xs text-red-400 md:text-red-500 font-medium mt-1 flex items-center gap-1"
    : darkMode
      ? "text-xs text-red-400 font-medium mt-1 flex items-center gap-1"
      : "text-xs text-red-500 font-medium mt-1 flex items-center gap-1";

  return (
    <>
      <div className={containerStyles}>
        <label htmlFor={id} className={labelStyles}>
          {label}
          {required && <span className=" ml-1">*</span>}
        </label>

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

        {helperText && !error && (
          <p id={`${id}-helper`} className={helperTextStyles}>
            {helperText}
          </p>
        )}

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
      {withDivider && <div className="border-brand rounded-lg border" />}
    </>
  );
}
