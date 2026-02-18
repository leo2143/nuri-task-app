import { useState, useRef, useEffect } from "react";
import { chevronDown } from "../../assets/svg-icons";

interface SelectOption {
  id?: string;
  title: string;
}

interface SelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  withDivider?: boolean;
}

export default function Select({
  id,
  name,
  label,
  value,
  onChange,
  options,
  placeholder = "Selecciona una opción",
  disabled = false,
  required = false,
  error = "",
  helperText = "",
  className = "",
  withDivider = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const hiddenSelectRef = useRef<HTMLSelectElement>(null);

  const hasError = !!error;

  // Encontrar la opción seleccionada
  const selectedOption = options.find((opt) => opt.id === value);
  const displayValue = selectedOption?.title || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // selección de opción
  const handleOptionClick = (optionId: string) => {
    const syntheticEvent = {
      target: { value: optionId, name },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
    setIsOpen(false);
  };

  const labelStyles = "block text-base font-medium text-tertiary font-body";

  const buttonStyles = `
    w-full px-4 py-3 pr-12 border-2 border-brand/50
    text-left cursor-pointer outline-none
    ${value ? "bg-white font-bold" : "bg-white"}
    ${isOpen ? "rounded-t-lg border-b-transparent" : "rounded-lg shadow-brand-glow"}
    ${disabled ? "bg-brand/5 cursor-not-allowed opacity-60" : ""}
    ${hasError ? "!border-red-500 !bg-red-50" : ""}
    font-body text-sm
  `;

  const dropdownStyles = `
    absolute z-50 w-full -mt-0.5
    bg-white border-2 border-t-transparent border-brand/50 rounded-b-lg shadow-brand-glow
    max-h-60 overflow-auto
  `;

  const optionStyles = (isSelected: boolean) => `
    px-4 py-3 cursor-pointer
    font-body text-sm
    ${isSelected ? "bg-brand/10 font-bold text-tertiary" : "text-tertiary"}
    hover:bg-brand/5
    transition-colors duration-150
  `;

  const helperTextStyles = "text-xs text-tertiary mt-1";
  const errorStyles = "text-xs text-red-500 font-medium mt-1 flex items-center gap-1";

  return (
    <>
      <div className={`space-y-2 ${className}`} ref={selectRef}>
        <label htmlFor={id} className={labelStyles}>
          {label}
          {required && <span className="ml-1">*</span>}
        </label>

        <select
          ref={hiddenSelectRef}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
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
            className={buttonStyles}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={`${id}-label`}
            aria-required={required}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
          >
            <span className={value ? "text-tertiary" : "text-brand"}>
              {displayValue}
            </span>
          </button>

          <img
            src={chevronDown}
            alt=""
            aria-hidden="true"
            className={`
              absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none
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
