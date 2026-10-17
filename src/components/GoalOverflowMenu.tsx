import { useEffect, useRef, useState } from "react";
import type { GoalStatus } from "../interfaces";
import { moreVertical } from "../assets/svg-icons";

interface GoalOverflowMenuProps {
  status: GoalStatus;
  disabled?: boolean;
  onPause: () => void;
  onResume: () => void;
}

/**
 * Pausar/Reanudar junto a editar y borrar. Completar no vive acá.
 */
export default function GoalOverflowMenu({
  status,
  disabled = false,
  onPause,
  onResume,
}: GoalOverflowMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (status === "completed") return null;

  const isPaused = status === "paused";
  const actionLabel = isPaused ? "Reanudar" : "Pausar";

  const handleAction = () => {
    if (isPaused) {
      onResume();
    } else {
      onPause();
    }
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        disabled={disabled}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-60"
        aria-label="Más acciones de la meta"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <img
          src={moreVertical}
          alt=""
          aria-hidden="true"
          className="w-5 h-5 shrink-0"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg bg-white py-2 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleAction}
            disabled={disabled}
            className="w-full px-4 py-2 text-left font-body text-sm text-tertiary hover:bg-gray-100 disabled:opacity-60"
          >
            {actionLabel}
          </button>
          <p className="px-4 pt-1 text-xs text-tertiary/70">
            {isPaused
              ? "Volvé a verla en curso y a recibir recordatorios."
              : "Sigue existiendo, no te la recordamos."}
          </p>
        </div>
      )}
    </div>
  );
}
