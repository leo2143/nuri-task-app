interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  className?: string;
}

export default function CustomCheckbox({
  id,
  checked,
  onChange,
  onClick,
  ariaLabel,
  className = "",
}: CustomCheckboxProps) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      onClick={onClick}
      className={`appearance-none cursor-pointer ${className}`}
      aria-label={ariaLabel}
    />
  );
}
