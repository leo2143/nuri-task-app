import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { close } from "../../assets/svg-icons";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="bg-neutral rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl">
          <div className="flex flex-col items-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-tertiary/20" />
          </div>

          <div className="flex items-center justify-between px-6 pb-4">
            {title && (
              <h2 className="font-heading text-tertiary text-xl font-bold">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="ml-auto p-2 text-tertiary hover:text-secondary transition-colors duration-200 focus:outline-none rounded-lg"
              aria-label="Cerrar"
            >
              <img src={close} alt="cerrar" className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto px-6 pb-6 flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
