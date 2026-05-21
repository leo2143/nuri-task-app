import { useEffect, useState } from "react";
import { close } from "../assets/svg-icons";
import nuriLentes from "../assets/ilustrations/nuri-lentes.svg";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}

export default function SideDrawer({
  isOpen,
  onClose,
  children,
  ariaLabel = "Menú de navegación",
}: SideDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => setIsMounted(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timeout);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full bg-neutral shadow-2xl z-50 md:w-80 overflow-y-auto
          transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label={ariaLabel}
      >
        <div className="py-6 flex flex-col gap-20 min-h-full">
          <div>
            <div className="flex items-center justify-end mb-6 px-6">
              <h2 className="sr-only">{ariaLabel}</h2>

              <button
                onClick={onClose}
                className="text-tertiary transition-colors duration-200 focus:outline-none p-2"
                aria-label="Cerrar menú"
              >
                <img
                  src={close}
                  alt="ícono de cerrar"
                  className="h-6 w-6"
                />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {children}
            </div>
          </div>

          <div className="flex justify-center mt-auto">
            <img
              src={nuriLentes}
              alt="Nuri con lentes"
              className="w-48 h-auto"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
