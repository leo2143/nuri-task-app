import { check } from "../../assets/svg-icons";

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLLabelElement>) => void;
  ariaLabel: string;
  className?: string;
  locked?: boolean;
  disabled?: boolean;
}

/**
 * Checkbox 20×20 alineado a Figma (NONE-CHECK): radio 4, borde 1px.
 * Locked marca y deshabilita. Disabled solo bloquea interacción.
 */
export default function CustomCheckbox({
  id,
  checked,
  onChange,
  onClick,
  ariaLabel,
  className = "",
  locked = false,
  disabled = false,
}: CustomCheckboxProps) {
  const isChecked = checked || locked;
  const isDisabled = locked || disabled;

  return (
    <label
      htmlFor={id}
      className={`relative inline-flex items-center justify-center ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
      onClick={onClick}
    >
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        disabled={isDisabled}
        onChange={onChange}
        className="sr-only peer"
        aria-label={ariaLabel}
        aria-disabled={isDisabled}
      />
      <span
        className={`w-5 h-5 flex items-center justify-center rounded border bg-neutral border-primary-dark transition-colors duration-200 ${
          isChecked ? "bg-primary border-primary" : ""
        }`}
      >
        {isChecked && (
          <img
            src={check}
            alt=""
            aria-hidden="true"
            className="w-2 h-[7px]"
          />
        )}
      </span>
    </label>
  );
}
