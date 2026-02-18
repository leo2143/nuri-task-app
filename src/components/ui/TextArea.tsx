import React from "react";

interface TextAreaProps {
  id: string;
  name: string;
  label: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  helperText?: string;
  resize?: boolean;
  withDivider?: boolean;
}

export default function TextArea({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  error,
  className = "",
  helperText,
  resize = false,
  withDivider = false,
}: TextAreaProps) {
  const hasError = !!error;

  const labelStyles = "block text-base font-medium text-tertiary font-body";

  const textareaStyles = `
    w-full px-4 py-3 rounded-lg border-2 shadow-brand-glow
    ${value ? "bg-white border-brand/50 font-bold" : "bg-white"}
    focus:bg-white
    focus:outline-none
    focus:border-transparent
    focus:ring-2 focus:ring-primary/50
    disabled:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-60
    font-body text-tertiary text-sm
    placeholder:text-brand placeholder:font-semibold
    transition-colors duration-200
    ${!resize ? "resize-none" : ""}
    ${hasError ? "!border-red-500 !bg-red-50 focus:!border-transparent focus:ring-2 focus:ring-red-500/20" : ""}
  `;

  // Estilos del texto de ayuda
  const helperTextStyles = "text-xs text-tertiary mt-1";

  // Estilos del mensaje de error
  const errorStyles = "text-xs text-red-500 font-medium mt-1 flex items-center gap-1";

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        <label htmlFor={id} className={labelStyles}>
          {label}
          {required && <span className="ml-1">*</span>}
        </label>

        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          className={textareaStyles}
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

