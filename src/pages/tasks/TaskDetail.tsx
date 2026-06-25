import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Badge, CustomCheckbox, ConfirmModal } from "../../components/ui";
import StateMessage from "../../components/StateMessage";
import { todoservice } from "../../services/todoService";
import { useAppNavigate, useFetchByIdOffline, useFormatDate } from "../../hooks";
import type { ITodo } from "../../interfaces";
import Loading from "../../components/Loading";
import { lapiz, calendar, trash } from "../../assets/svg-icons";

export default function TaskDetail() {
  const navigate = useAppNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localCompleted, setLocalCompleted] = useState<boolean | null>(null);
  const [localLocked, setLocalLocked] = useState<boolean | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    data: task,
    loading,
    errorMessage,
  } = useFetchByIdOffline<ITodo>({
    fetchFn: todoservice.getTodoById,
    cacheKey: "task",
  });

  const createdDate = useFormatDate(task?.createdAt);
  const dueDate = useFormatDate(task?.dueDate);
  const isCompleted = localCompleted ?? task?.completed ?? false;
  const isLocked = localLocked ?? task?.isLocked ?? false;

  const handleToggleComplete = useCallback(() => {
    if (!task?._id || isLocked) return;
    if (!isCompleted) {
      setIsConfirmModalOpen(true);
    }
  }, [task?._id, isCompleted, isLocked]);

  const handleConfirmComplete = useCallback(async () => {
    if (!task?._id) return;
    setIsConfirming(true);
    try {
      await todoservice.updateTodoState(task._id, true);
      setLocalCompleted(true);
      setLocalLocked(true);
    } catch {
      console.error("Error al completar tarea");
    } finally {
      setIsConfirming(false);
      setIsConfirmModalOpen(false);
    }
  }, [task?._id]);

  const handleDeleteTask = async () => {
    if (!task?._id) return;

    setIsDeleting(true);
    try {
      await todoservice.deleteTodo(task._id);
      navigate("/tasks", {
        replace: true,
        state: { message: "Tarea eliminada exitosamente" },
      });
    } catch {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) return <Loading />;

  if (errorMessage) {
    return (
      <div className="max-w-4xl mx-auto">
        <StateMessage itemName="la tarea" variant="error" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto">
        <StateMessage itemName="tarea" variant="notFound" />
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto space-y-4 pt-6">
      {/* Card Principal */}
      <div className="bg-secondary-dark rounded-2xl p-5 text-white">
        {/* Título y botón editar */}
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-heading font-bold text-brand flex items-center gap-2">
            {task.title}
          </h2>
          <div className="flex items-center gap-1">
            <Link
              to={`/tasks/${task._id}/edit`}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Editar tarea"
            >
              <img src={lapiz} alt="" aria-hidden="true" className="w-5 h-5 invert brightness-0" />
            </Link>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              aria-label="Eliminar tarea"
            >
              <img src={trash} alt="" aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-base text-white mb-4 leading-relaxed">
          {task.description || "Sin descripción"}
        </p>

        {/* Fecha y Prioridad */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            {createdDate.isValid && (
              <div className="flex items-center gap-1.5">
                <img src={calendar} alt="" aria-hidden="true" className="w-5 h-5" />
                <time dateTime={createdDate.iso} className="text-sm font-bold text-brand">
                  {createdDate.formatted}
                </time>
              </div>
            )}
            {dueDate.isValid && (
              <div className="flex items-center gap-1.5">
                <img src={calendar} alt="" aria-hidden="true" className="w-5 h-5" />
                <time dateTime={dueDate.iso} className="text-sm text-brand">
                  Vence: <span className="font-bold">{dueDate.formatted}</span>
                </time>
              </div>
            )}
          </div>
          <Badge variant="priority" priority={task.priority} />
        </div>

        {/* Estado completado */}
        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
          {isLocked ? (
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/30">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <CustomCheckbox
              id="task-completed"
              checked={isCompleted}
              onChange={handleToggleComplete}
              ariaLabel="Marcar tarea como completada"
            />
          )}
          <span className="text-sm font-body font-semibold text-white">
            {isLocked ? "¡Completada!" : isCompleted ? "Completada" : "Pendiente"}
          </span>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="¿Eliminar tarea?"
        message={`¿Querés eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="warning"
        loading={isDeleting}
        onConfirm={handleDeleteTask}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmComplete}
        title="¡Genial!"
        message="¿Completaste esta tarea? ¡Eso es un gran paso!"
        confirmText="¡Sí, la hice!"
        cancelText="Todavía no"
        variant="success"
        loading={isConfirming}
      />
    </section>
  );
}
