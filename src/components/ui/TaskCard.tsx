import { useAppNavigate } from "../../hooks";
import { CustomCheckbox } from "./index";

interface TaskCardProps {
  id?: string;
  title: string;
  description?: string;
  goalTitle?: string | null;
  completed: boolean;
  onToggleComplete: (id: string, currentCompleted: boolean) => void;
  className?: string;
}

export function TaskCard({
  id,
  title,
  description,
  goalTitle,
  completed,
  onToggleComplete,
  className = "",
}: TaskCardProps) {
  const navigate = useAppNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/tasks/${id}`);
    }
  };

  return (
    <article
      className={`flex items-center justify-between bg-white p-5 rounded-lg shadow-brand-glow cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="flex flex-col gap-1 flex-1 min-w-0 mr-4">
        <span className="font-body font-bold text-base text-tertiary truncate">
          {title}
        </span>
        {description && (
          <span className="font-body text-sm text-tertiary/70 line-clamp-2">
            {description}
          </span>
        )}
        {goalTitle && (
          <span className="w-fit mt-2 bg-secondary-dark rounded-lg text-center py-2 px-3 text-xs font-bold text-white truncate max-w-full">
            {goalTitle}
          </span>
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
      />
    </article>
  );
}

