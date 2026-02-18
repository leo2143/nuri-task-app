import { check } from "../../assets/svg-icons";

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CustomCheckbox({
  id,
  checked,
  onChange,
  onClick,
  ariaLabel,
  size = "md",
  className = "",
}: CustomCheckboxProps) {




  return (
    <label
      htmlFor={id}
      className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
        aria-label={ariaLabel}
      />
      <span
        className={`
          w-5 h-5
          flex items-center justify-center
          rounded-lg border-2 border-gray-300 bg-white
          peer-checked:bg-primary peer-checked:border-primary
          transition-colors duration-200
        `}
      >
        {checked && (
          <img
            src={check}
            alt=""
            aria-hidden="true"
            className="h-3 w-3"
          />
        )}
      </span>
    </label>
  );
}
