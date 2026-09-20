interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  ariaLabel: string;
}

/**
 * Switch 53×28 alineado a Figma: track cream + thumb primary apagado,
 * track primary + thumb cream encendido.
 */
export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onChange}
      className={`
        relative inline-flex items-center shrink-0
        w-[53px] h-7 rounded-full border
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/40
        disabled:opacity-50 disabled:cursor-not-allowed
        ${checked ? "bg-primary border-primary" : "bg-neutral border-primary"}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block w-6 h-6 rounded-full
          transition-transform duration-200
          ${checked ? "translate-x-[25px] bg-neutral" : "translate-x-0.5 bg-primary"}
        `}
      />
    </button>
  );
}
