import { useState, useRef, useEffect } from "react";

type StatusType = "active" | "paused" | "completed";

interface StatusSelectProps {
  value: StatusType;
  onChange: (status: StatusType) => void;
  disabled?: boolean;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string; iconColor: string }> = {
  active: {
    label: "Activa",
    className: "bg-greenCheap-light text-greenCheap-dark",
    iconColor: "text-greenCheap-dark",
  },
  paused: {
    label: "Pausada",
    className: "bg-yellowCheap text-yellow-800",
    iconColor: "text-yellow-800",
  },
  completed: {
    label: "Completada",
    className: "bg-blue-100 text-blue-800",
    iconColor: "text-blue-800",
  },
};

const statusOptions: { id: StatusType; title: string }[] = [
  { id: "active", title: "Activa" },
  { id: "paused", title: "Pausada" },
  { id: "completed", title: "Completada" },
];

export default function StatusSelect({
  value,
  onChange,
  disabled = false,
  className = "",
}: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const config = statusConfig[value];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusChange = (newStatus: StatusType) => {
    onChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full py-3 font-bold text-base
          text-center cursor-pointer outline-none
          ${config.className}
          ${isOpen ? "rounded-t-lg" : "rounded-lg"}
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          transition-all duration-200
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {disabled ? "Actualizando..." : config.label}
      </button>

      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`
          absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none
          transition-transform duration-200
          ${config.iconColor}
          ${isOpen ? "rotate-180" : ""}
        `}
        aria-hidden="true"
      >
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {isOpen && !disabled && (
        <ul
          role="listbox"
          className="absolute z-50 w-full bg-gray-100 rounded-b-lg overflow-hidden"
        >
          {statusOptions
            .filter((option) => option.id !== value)
            .map((option) => (
              <li
                key={option.id}
                role="option"
                onClick={() => handleStatusChange(option.id)}
                className=" py-3 cursor-pointer text-center font-body text-base text-tertiary hover:bg-gray-200 transition-colors duration-150"
              >
                {option.title}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

