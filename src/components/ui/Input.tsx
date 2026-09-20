import { useId, useRef } from "react";
import type { ComponentProps, Ref } from "react";
import { calendar, chevronDown } from "../../assets/svg-icons";

export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  name: string;
  label: string;
  error?: string;
  helperText?: string;
  darkMode?: boolean;
  withDivider?: boolean;
  hideLabel?: boolean;
}

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(node);
    return;
  }
  ref.current = node;
}

export default function Input({
  id: externalId,
  name,
  label,
  type = "text",
  error,
  className = "",
  helperText,
  darkMode = false,
  withDivider = false,
  hideLabel = false,
  disabled,
  required,
  value,
  onClick,
  ref,
  ...rest
}: InputProps) {
  const autoId = useId();
  const id = externalId ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const isDate = type === "date";
  const hasError = !!error;

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    assignRef(ref, node);
  };

  const handleDateClick = () => {
    if (!isDate || disabled) return;
    try {
      inputRef.current?.showPicker?.();
    } catch {
      // El picker nativo ya está abierto o el browser no lo soporta
    }
  };

  const sharedInputStyles = `
    w-full px-4 py-3 rounded-lg border-2
    focus:outline-none focus:border-transparent
    disabled:cursor-not-allowed disabled:opacity-60
    font-body text-sm
  `;

  const lightModeStyles = `
    shadow-brand-glow
    ${value ? "bg-white border-brand/50 font-bold" : "bg-white"}
    focus:bg-white
    disabled:bg-brand/5
    text-tertiary
    placeholder:text-brand placeholder:font-semibold
    [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgba(47,150,133,0.1)]
    [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(58,37,29)]
    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_rgba(47,150,133,0.2)]
    [&:-webkit-autofill:active]:shadow-[inset_0_0_0_1000px_rgba(47,150,133,0.2)]
  `;

  const darkModeStyles = `
    border-white/20
    ${value ? "bg-white/10 border-[#3C6973]" : "bg-white/5"}
    focus:bg-white/15
    disabled:bg-white/5
    text-white
    placeholder:text-white/50
    [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgb(0,56,68)]
    [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(255,255,255)]
    [&:-webkit-autofill]:border-[#3C6973]
    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_rgb(0,70,85)]
    [&:-webkit-autofill:focus]:border-[#3C6973]
    [&:-webkit-autofill:active]:shadow-[inset_0_0_0_1000px_rgb(0,70,85)]
  `;

  const stateStyles = hasError
    ? darkMode
      ? "!border-red-400 !bg-red-500/20 focus:!border-transparent focus:ring-2 focus:ring-red-400/30"
      : "!border-red-500 !bg-red-50 focus:!border-transparent focus:ring-2 focus:ring-red-500/20"
    : darkMode
      ? "focus:ring-2 focus:ring-[#3C6973]"
      : "focus:ring-2 focus:ring-primary/50";

  const dateFieldStyles = isDate
    ? "pl-11 pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
    : "";

  const inputClasses = [
    sharedInputStyles,
    darkMode ? darkModeStyles : lightModeStyles,
    stateStyles,
    dateFieldStyles,
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

        <div className="relative">
          {isDate && (
            <img
              src={calendar}
              alt=""
              aria-hidden="true"
              className="absolute left-3 top-1/2 z-[1] w-5 h-5 -translate-y-1/2 pointer-events-none"
            />
          )}

          <input
            ref={setRefs}
            id={id}
            name={name}
            type={type}
            value={value}
            disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            className={inputClasses}
            {...rest}
            onClick={(event) => {
              handleDateClick();
              onClick?.(event);
            }}
          />

          {isDate && (
            <img
              src={chevronDown}
              alt=""
              aria-hidden="true"
              className="absolute right-0 top-1/2 z-[1] -translate-y-1/2 pointer-events-none"
            />
          )}
        </div>

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
