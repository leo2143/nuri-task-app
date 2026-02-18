import { useNavigate } from "react-router-dom";
import { CustomCheckbox } from "./index";

interface TaskCardProps {
  id?: string;
  title: string;
  goalTitle?: string | null;
  completed: boolean;
  onToggleComplete: (id: string, currentCompleted: boolean) => void;
  className?: string;
}

export function TaskCard({
  id,
  title,
  goalTitle,
  completed,
  onToggleComplete,
  className = "",
}: TaskCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/tasks/${id}`);
    }
  };

  return (
    <article
      className={`flex flex-col gap-2 bg-white p-5 rounded-lg shadow-brand-glow cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-3">
            <span className="flex-1 text-base font-bold font-body">
              {title}
            </span>
            {goalTitle && (
              <span className="w-auto bg-secondary-dark rounded-lg text-center py-2 text-xs font-bold text-white">{goalTitle}</span>
            )}
          </div>
          <CustomCheckbox
            id={`task-${id}`}
            checked={completed}
            onChange={(e) => {
              e.stopPropagation();
              if (id) {
                onToggleComplete(id, completed);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            ariaLabel={`Marcar tarea "${title}" como ${completed ? "incompleta" : "completa"}`}
            size="md"
          />
        </div>
      </div>
    </article>
  );
}

