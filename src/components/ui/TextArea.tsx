import { useId } from "react";
import type { ComponentProps } from "react";

export interface TextAreaProps extends ComponentProps<"textarea"> {
  name: string;
  label: string;
  error?: string;
  helperText?: string;
  darkMode?: boolean;
  withDivider?: boolean;
  hideLabel?: boolean;
  resize?: boolean;
}

export default function TextArea({
  id: externalId,
  name,
  label,
  value,
  error,
  className = "",
  helperText,
  darkMode = false,
  withDivider = false,
  hideLabel = false,
  resize = false,
  disabled,
  required,
  rows = 4,
  ref,
  ...rest
}: TextAreaProps) {
  const autoId = useId();
  const id = externalId ?? autoId;
  const hasError = !!error;

  const sharedStyles = `
    w-full px-4 py-3 rounded-lg border-2
    focus:outline-none focus:border-transparent
    disabled:cursor-not-allowed disabled:opacity-60
    font-body text-sm
    ${!resize ? "resize-none" : ""}
  `;

  const lightModeStyles = `
    shadow-brand-glow
    ${value ? "bg-white border-brand/50 font-bold" : "bg-white"}
    focus:bg-white
    disabled:bg-brand/5
    text-tertiary
    placeholder:text-brand placeholder:font-semibold
  `;

  const darkModeStyles = `
    border-white/20
    ${value ? "bg-white/10 border-[#3C6973]" : "bg-white/5"}
    focus:bg-white/15
    disabled:bg-white/5
    text-white
    placeholder:text-white/50
  `;

  const stateStyles = hasError
    ? darkMode
      ? "!border-red-400 !bg-red-500/20 focus:!border-transparent focus:ring-2 focus:ring-red-400/30"
      : "!border-red-500 !bg-red-50 focus:!border-transparent focus:ring-2 focus:ring-red-500/20"
    : darkMode
      ? "focus:ring-2 focus:ring-[#3C6973]"
      : "focus:ring-2 focus:ring-primary/50";

  const textareaClasses = [
    sharedStyles,
    darkMode ? darkModeStyles : lightModeStyles,
    stateStyles,
    className,
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const labelStyles = darkMode
    ? "block text-base font-medium text-white font-body"
    : "block text-base font-medium text-tertiary font-body";

  const helperTextStyles = darkMode
    ? "text-xs text-white/70 mt-1"
    : "text-xs text-tertiary mt-1";

  const errorStyles = darkMode
    ? "text-xs text-red-400 font-medium mt-1 flex items-center gap-1"
    : "text-xs text-red-500 font-medium mt-1 flex items-center gap-1";

  return (
    <>
      <div className="space-y-2">
        <label htmlFor={id} className={hideLabel ? "sr-only" : labelStyles}>
          {label}
          {required && <span className="ml-1">*</span>}
        </label>

        <textarea
          ref={ref}
          id={id}
          name={name}
          rows={rows}
          value={value}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          className={textareaClasses}
          {...rest}
        />

        {helperText && !hasError && (
          <p id={`${id}-helper`} className={helperTextStyles}>
            {helperText}
          </p>
        )}

        {hasError && (
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
