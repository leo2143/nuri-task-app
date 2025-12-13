import { useEffect, useState } from "react";
import Button from "./Button";
import { nuriAlegre, nuriError, nuriWarning } from "../../assets/ilustrations";
import { close } from "../../assets/svg-icons";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success";
  loading?: boolean;
}

const illustrationMap = {
  danger: nuriError,
  warning: nuriWarning,
  success: nuriAlegre,
} as const;

const borderColorMap = {
  danger: "border-[#DC2626]",
  warning: "border-[#F4D03F]",
  success: "border-[#2A9D8F]",
} as const;

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const illustration = illustrationMap[variant];
  const borderColor = borderColorMap[variant];

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  // Bloquear scroll del body cuando el modal está abierto
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

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`
          fixed inset-0 bg-black z-40
          transition-opacity duration-300
          ${isAnimating ? "opacity-50" : "opacity-0"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className={`
          bg-gradient-to-b from-[#FFF9E6] to-[#FFFBF0]
          rounded-3xl shadow-2xl max-w-md w-full p-5
          border-4 ${borderColor} relative
          transform transition-all duration-300 ease-out
          ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
        >
          {/* Botón de cerrar (X) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-tertiary hover:text-secondary
                     transition-colors duration-200 focus:outline-none"
            aria-label="Cerrar modal"
          >
            <img src={close} alt="cerrar" className="w-6 h-6" />
          </button>

          {/* Ilustración de Nuri */}
          <div className="flex justify-center mb-6">
            <img
              src={illustration}
              alt="Nuri"
              className="w-32 h-32 object-contain"
            />
          </div>

          <h2
            id="modal-title"
            className="text-3xl font-heading font-bold text-tertiary text-center mb-3"
          >
            {title}
          </h2>

          <p className="text-tertiary text-center mb-8 font-body text-lg">
            {message}
          </p>

          <div className="flex flex-col">
            <Button
              onClick={onConfirm}
              loading={loading}
              disabled={loading}
              variant="primary"
              fullWidth
            >
              {confirmText}
            </Button>

            {cancelText && variant === "warning" && (
              <Button
                onClick={onClose}
                disabled={loading}
                variant="ghost"
                fullWidth
              >
                {cancelText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
