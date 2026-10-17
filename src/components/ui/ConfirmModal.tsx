import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { nuriAlegreOjos, nuriError, nuriWarning } from "../../assets/ilustrations";
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
  success: nuriAlegreOjos,
} as const;

const borderColorMap = {
  danger: "border-[#962F2F]",
  warning: "border-[#FFDB25]",
  success: "border-primary",
} as const;

const glowMap = {
  danger: "shadow-[inset_0_0_20px_8px_rgba(150,47,47,0.2)]",
  warning: "shadow-[inset_0_0_20px_8px_rgba(255,219,37,0.2)]",
  success: "shadow-[inset_0_0_20px_8px_rgba(47,150,133,0.2)]",
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const illustration = illustrationMap[variant];
  const hasCancel = Boolean(cancelText) && (variant === "warning" || variant === "success");
  const isSuccessPrompt = variant === "success" && hasCancel;
  const borderColor = isSuccessPrompt ? "border-[#2A9D8F]" : borderColorMap[variant];
  const glow = isSuccessPrompt
    ? "shadow-[inset_0_0_20px_8px_rgba(255,219,37,0.2)]"
    : glowMap[variant];

  useEffect(() => {
    let openTimer: ReturnType<typeof setTimeout> | undefined;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    if (isOpen) {
      setShouldRender(true);
      openTimer = setTimeout(() => {
        dialogRef.current?.showModal();
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      closeTimer = setTimeout(() => {
        dialogRef.current?.close();
        setShouldRender(false);
      }, 300);
    }

    return () => {
      if (openTimer !== undefined) clearTimeout(openTimer);
      if (closeTimer !== undefined) clearTimeout(closeTimer);
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <dialog
      ref={dialogRef}
      className="nuri-dialog nuri-dialog-center"
      aria-labelledby="modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <button
        type="button"
        className="nuri-dialog-backdrop"
        aria-label="Cerrar modal"
        onClick={onClose}
      />
      <div
        className={`
          relative z-10
          bg-neutral max-w-md w-full px-5 pb-5
          rounded-[20px] border-[3px] ${borderColor} ${glow}
          transform transition-all duration-300 ease-out
          ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-[30px] right-8 text-tertiary hover:text-secondary
                   transition-colors duration-200 focus:outline-none"
          aria-label="Cerrar modal"
        >
          <img src={close} alt="cerrar" className="w-6 h-6" />
        </button>

        <div className="flex justify-center mt-[49px] mb-6">
          <img
            src={illustration}
            alt="Nuri"
            className="w-[146px] h-[171px] object-contain"
          />
        </div>

        <h2
          id="modal-title"
          className="text-3xl font-heading font-bold text-tertiary text-center mb-[14px]"
        >
          {title}
        </h2>

        <p className="text-tertiary text-center mb-7 font-body text-lg">
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

          {hasCancel && (
            <Button
              onClick={onClose}
              disabled={loading}
              variant="ghost"
              fullWidth
              className="text-tertiary/50 font-body font-bold hover:text-tertiary"
            >
              {cancelText}
            </Button>
          )}
        </div>
      </div>
    </dialog>
  );
}
