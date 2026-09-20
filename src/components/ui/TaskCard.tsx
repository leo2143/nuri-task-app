import { useState } from "react";
import { Link } from "react-router-dom";
import CustomCheckbox from "./CustomCheckbox";
import Button from "./Button";
import ConfirmModal from "./ConfirmModal";
import { lapizBlue, calendar, trashBlue } from "../../assets/svg-icons";
import { todoservice } from "../../services/todoService";
import { useAuth, useFormatDate } from "../../hooks";
import type { TodoPriority } from "../../interfaces";

const priorityLabels: Record<TodoPriority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

interface TaskCardProps {
  id?: string;
  title: string;
  description?: string;
  goalTitle?: string | null;
  completed: boolean;
  isLocked?: boolean;
  dueDate?: Date | string | null;
  priority?: TodoPriority;
  onToggleComplete: (id: string, currentCompleted: boolean) => void;
  onDeleted?: (id: string) => void;
  className?: string;
}

export function TaskCard({
  id,
  title,
  description,
  goalTitle,
  completed,
  isLocked = false,
  dueDate,
  priority,
  onToggleComplete,
  onDeleted,
  className = "",
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const formattedDueDate = useFormatDate(dueDate);
  const isDone = completed || isLocked;
  const canEdit = Boolean(id) && !isDone;
  const canDelete = Boolean(id) && (!isDone || Boolean(user?.isAdmin));

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await todoservice.deleteTodo(id);
      onDeleted?.(id);
    } catch {
      console.error("Error al eliminar tarea");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <article className={`bg-white rounded-lg shadow-brand-glow overflow-hidden min-w-0 ${className}`}>
      {!isExpanded ? (
        <div
          className="flex items-center justify-between p-5 cursor-pointer min-w-0"
          onClick={handleToggleExpand}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleToggleExpand();
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={false}
          aria-label={`Expandir tarea ${title}`}
        >
          <div className="flex flex-col gap-1 flex-1 min-w-0 mr-4">
            <span className="font-body font-bold text-base text-tertiary truncate">
              {title}
            </span>
            {description && (
              <span className="font-body text-sm text-tertiary/70 line-clamp-2 break-words">
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
            className="shrink-0"
            checked={completed}
            locked={isLocked}
            onChange={(e) => {
              e.stopPropagation();
              if (id) onToggleComplete(id, completed);
            }}
            onClick={(e) => e.stopPropagation()}
            ariaLabel={
              isLocked
                ? `Tarea "${title}" completada`
                : `Marcar tarea "${title}" como ${completed ? "incompleta" : "completa"}`
            }
          />
        </div>
      ) : (
        <div className="p-5 flex flex-col gap-3 min-w-0">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <button
              type="button"
              className="font-body font-bold text-base text-tertiary text-left flex-1 min-w-0 break-words"
              onClick={handleToggleExpand}
              aria-expanded={true}
              aria-label={`Contraer tarea ${title}`}
            >
              {title}
            </button>
            <div className="flex items-center shrink-0">
              {canEdit && (
                <Link
                  to={`/tasks/${id}/edit`}
                  className="p-2 hover:bg-brand/10 rounded-lg transition-colors"
                  aria-label="Editar tarea"
                >
                  <img
                    src={lapizBlue}
                    alt=""
                    aria-hidden="true"
                  />
                </Link>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  aria-label="Eliminar tarea"
                >
                  <img src={trashBlue} alt="" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {description && (
            <p className="font-body text-sm text-tertiary leading-relaxed min-w-0 break-words">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 min-w-0">
            {formattedDueDate.isValid && (
              <div className="flex items-center gap-1.5 min-w-0">
                <img
                  src={calendar}
                  alt=""
                  aria-hidden="true"
                  className="w-5 h-5 shrink-0"
                />
                <time
                  dateTime={formattedDueDate.iso}
                  className="text-sm font-bold text-primary whitespace-nowrap"
                >
                  {formattedDueDate.formatted}
                </time>
              </div>
            )}
            {priority && (
              <p className="text-sm font-body font-bold text-primary whitespace-nowrap shrink-0">
                Prioridad: {priorityLabels[priority]}
              </p>
            )}
          </div>

          {!isDone && id && (
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={() => onToggleComplete(id, completed)}
            >
              Hecho
            </Button>
          )}
        </div>
      )}

      {canDelete && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="¿Eliminar tarea?"
          message={`¿Querés eliminar la tarea "${title}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          variant="warning"
          loading={isDeleting}
          onConfirm={handleDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </article>
  );
}
