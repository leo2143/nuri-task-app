import { useState, useRef, useEffect, useCallback, cloneElement, isValidElement } from "react";
import { useAppNavigate } from "../../hooks";
import { metricWhite, lapizWrite } from "../../assets/svg-icons";
import type { ReactNode } from "react";

export interface ActionOption {
  id: string;
  title: string;
  icon: string;
  path: string;
}

const defaultOptions: ActionOption[] = [
  {
    id: "goal",
    title: "Crear meta",
    icon: metricWhite,
    path: "/goals/new",
  },
  {
    id: "task",
    title: "Crear Tarea",
    icon: lapizWrite,
    path: "/tasks/new",
  },
];

interface ActionSelectProps {
  children: ReactNode;
  options?: ActionOption[];
}

export default function ActionSelect({ children, options = defaultOptions }: ActionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const navigate = useAppNavigate();

  const open = useCallback(() => {
    setIsOpen(true);
    setIsMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsMounted(false);
      setIsOpen(false);
    }, 200);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, close]);

  const handleActionClick = (path: string) => {
    close();
    setTimeout(() => navigate(path), 200);
  };

  const handleTriggerClick = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  const triggerElement = isValidElement(children) ? (
    cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
      onClick: (e: React.MouseEvent) => {
        handleTriggerClick();
        const originalOnClick = (children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props?.onClick;
        if (originalOnClick) {
          originalOnClick(e);
        }
      },
    })
  ) : (
    <div onClick={handleTriggerClick} className="cursor-pointer">
      {children}
    </div>
  );

  return (
    <div ref={selectRef} className="relative inline-block">
      {triggerElement}
      {isMounted && (
        <div
          className={`fixed bottom-[5.2rem] left-0 right-0 mx-5 bg-primary-dark rounded-2xl overflow-hidden shadow-lg z-50
            transition-all duration-200 ease-out origin-bottom ${
            isVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2"
          }`}
        >
          {options.map((option, index) => (
            <div key={option.id}>
              {index > 0 && <div className="h-px bg-white/20" />}
              <button
                type="button"
                onClick={() => handleActionClick(option.path)}
                className="w-full flex items-center gap-3 px-5 py-6 text-white hover:bg-white/10 transition-colors duration-150"
              >
                <img src={option.icon} alt="" aria-hidden="true" className="max-w-6 max-h-6 shrink-0 object-contain" />
                <span className="font-body text-base">{option.title}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

