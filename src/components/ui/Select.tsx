import { useState, useRef, useEffect, useId } from "react";
import type { ComponentProps } from "react";
import { chevronDown } from "../../assets/svg-icons";

export interface SelectOption {
  id?: string;
  title: string;
}

export interface SelectProps
  extends Omit<ComponentProps<"select">, "size"> {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  darkMode?: boolean;
  withDivider?: boolean;
  hideLabel?: boolean;
}

export default function Select({
  id: externalId,
  name,
  label,
  value,
  onChange,
  options,
  placeholder = "Selecciona una opción",
  disabled = false,
  required,
  error = "",
  helperText = "",
  className = "",
  darkMode = false,
  withDivider = false,
  hideLabel = false,
  ref,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const id = externalId ?? autoId;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasError = !!error;

  const selectedOption = options.find((opt) => opt.id === value);
  const displayValue = selectedOption?.title || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleOptionClick = (optionId: string) => {
    const syntheticEvent = {
      target: { value: optionId, name },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange?.(syntheticEvent);
    setIsOpen(false);
  };

  const sharedButtonStyles = `
    w-full px-4 py-3 pr-12 border-2
    text-left outline-none
    font-body text-sm
    ${isOpen ? "rounded-t-lg border-b-transparent" : "rounded-lg"}
    ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
  `;

  const lightModeStyles = `
    border-brand/50
    ${value ? "bg-white font-bold" : "bg-white"}
    ${!isOpen ? "shadow-brand-glow" : ""}
    disabled:bg-brand/5
  `;

  const darkModeStyles = `
    border-white/20
    ${value ? "bg-white/10 border-[#3C6973] font-bold" : "bg-white/5"}
    disabled:bg-white/5
  `;

  const stateStyles = hasError
    ? darkMode
      ? "!border-red-400 !bg-red-500/20"
      : "!border-red-500 !bg-red-50"
    : "";

  const buttonClasses = [
    sharedButtonStyles,
    darkMode ? darkModeStyles : lightModeStyles,
    stateStyles,
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const dropdownStyles = darkMode
    ? "absolute z-50 w-full -mt-0.5 bg-white/10 border-2 border-t-transparent border-white/20 rounded-b-lg max-h-60 overflow-auto"
    : "absolute z-50 w-full -mt-0.5 bg-white border-2 border-t-transparent border-brand/50 rounded-b-lg shadow-brand-glow max-h-60 overflow-auto";

  const optionStyles = (isSelected: boolean) =>
    darkMode
      ? `px-4 py-3 cursor-pointer font-body text-sm text-white ${isSelected ? "bg-white/10 font-bold" : ""} hover:bg-white/5 transition-colors duration-150`
      : `px-4 py-3 cursor-pointer font-body text-sm ${isSelected ? "bg-brand/10 font-bold text-tertiary" : "text-tertiary"} hover:bg-brand/5 transition-colors duration-150`;

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
      <div className={`space-y-2 ${className}`} ref={containerRef}>
        <label
          htmlFor={id}
          id={`${id}-label`}
          className={hideLabel ? "sr-only" : labelStyles}
        >
          {label}
          {required && <span className="ml-1">*</span>}
        </label>

        <select
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={option.id || index} value={option.id || ""}>
              {option.title}
            </option>
          ))}
        </select>

        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={buttonClasses}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={`${id}-label`}
            aria-required={required}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
          >
            <span
              className={
                value
                  ? darkMode
                    ? "text-white"
                    : "text-tertiary"
                  : darkMode
                    ? "text-white/50"
                    : "text-brand"
              }
            >
              {displayValue}
            </span>
          </button>

          <img
            src={chevronDown}
            alt=""
            aria-hidden="true"
            className={`
              absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none
              transition-transform duration-200
              ${isOpen ? "rotate-180" : ""}
            `}
          />

          {isOpen && !disabled && (
            <ul
              role="listbox"
              aria-labelledby={`${id}-label`}
              className={dropdownStyles}
            >
              <li
                role="option"
                aria-selected={!value}
                onClick={() => handleOptionClick("")}
                className={optionStyles(!value)}
              >
                {placeholder}
              </li>

              {options.map((option, index) => (
                <li
                  key={option.id || index}
                  role="option"
                  aria-selected={value === option.id}
                  onClick={() => handleOptionClick(option.id || "")}
                  className={optionStyles(value === option.id)}
                >
                  {option.title}
                </li>
              ))}
            </ul>
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
