import { useId } from "react";
import type { ComponentProps } from "react";
import { search } from "../../assets/svg-icons/index";
import { Button } from ".";

export interface InputFilterProps
  extends Omit<ComponentProps<"input">, "size"> {
  name: string;
  error?: string;
  helperText?: string;
  onFilterPress?: () => void;
  activeFilterCount?: number;
}

export default function InputFilter({
  id: externalId,
  name,
  type = "text",
  value,
  error,
  className = "",
  helperText,
  onFilterPress,
  activeFilterCount = 0,
  disabled,
  required,
  placeholder = "Buscar",
  ref,
  ...rest
}: InputFilterProps) {
  const autoId = useId();
  const id = externalId ?? autoId;
  const hasError = !!error;

  const sharedInputStyles = `
    w-4/5 pl-12 pr-4 py-3 rounded-lg
    focus:outline-none focus:border-transparent
    disabled:cursor-not-allowed disabled:opacity-60
    font-body text-tertiary
    placeholder:text-brand font-bold
  `;

  const lightModeStyles = `
    shadow-brand-glow
    ${value ? "bg-brand/10 border-brand/50 border-2" : "bg-white"}
    focus:bg-brand/20
    disabled:bg-brand/5
  `;

  const stateStyles = hasError
    ? "!border-red-500 !bg-red-50 border-2 focus:ring-2 focus:ring-red-500/20"
    : "";

  const inputClasses = [sharedInputStyles, lightModeStyles, stateStyles, className]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="w-full">
      <div className="flex items-center">
        <div className="relative flex-1">
          <img
            src={search}
            alt=""
            aria-hidden="true"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 pointer-events-none"
          />
          <input
            ref={ref}
            type={type}
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            className={inputClasses}
            {...rest}
          />
        </div>

        <div className="relative shrink-0">
          <Button
            variant="brand"
            icon="filter"
            size="ro"
            onClick={onFilterPress}
            disabled={disabled}
          />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
              {activeFilterCount}
            </span>
          )}
        </div>
      </div>

      {helperText && !hasError && (
        <p id={`${id}-helper`} className="text-xs text-tertiary mt-1">
          {helperText}
        </p>
      )}

      {hasError && (
        <p
          id={`${id}-error`}
          className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1"
          role="alert"
        >
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
