import { useState, useRef, useEffect, cloneElement, isValidElement } from "react";
import { useNavigate } from "react-router-dom";
import { metricWhite, lapizWrite } from "../../assets/svg-icons";
import type { ReactNode } from "react";

interface ActionOption {
  id: string;
  title: string;
  icon: string;
  path: string;
}

const actionOptions: ActionOption[] = [
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
}

export default function ActionSelect({ children }: ActionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleActionClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
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
      {isOpen && (
        <div className="fixed bottom-[5.2rem] left-0 right-0 mx-5 bg-primary-dark rounded-2xl overflow-hidden shadow-lg z-50">
          {actionOptions.map((option, index) => (
            <div key={option.id}>
              {index > 0 && <div className="h-px bg-white/20" />}
              <button
                type="button"
                onClick={() => handleActionClick(option.path)}
                className="w-full flex items-center gap-3 px-5 py-6 text-white hover:bg-white/10 transition-colors duration-150"
              >
                <img src={option.icon} alt=""  aria-hidden="true" />
                <span className="font-body text-base">{option.title}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

