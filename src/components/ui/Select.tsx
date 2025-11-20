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
}: SelectProps) {
  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-tertiary mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-colors duration-200
          ${error ? "border-red-500 focus:ring-red-500" : "border-neutral"}
        `}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
      >
        <option value="">{placeholder}</option>

        {options.map((option, index) => (
          <option key={option.id || index} value={option.id || ""}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  );
}
