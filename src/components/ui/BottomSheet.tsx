import { useEffect, useRef, useState } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let openTimer: ReturnType<typeof setTimeout> | undefined;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    if (isOpen) {
      setShouldRender(true);
      openTimer = setTimeout(() => {
        dialogRef.current?.showModal();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsAnimating(true));
        });
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
      className="nuri-dialog nuri-dialog-sheet"
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <button
        type="button"
        className="nuri-dialog-backdrop"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        className={`relative z-10 transform transition-transform duration-300 ease-out ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
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
              type="button"
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
    </dialog>
  );
}
