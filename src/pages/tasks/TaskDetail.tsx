import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Badge } from "../../components/ui";
import { useEffect, useState } from "react";
import { todoservice } from "../../services/todoService";
import { useHttpError, useFormatDate } from "../../hooks";
import type { ITodo } from "../../interfaces";
import Loading from "../../components/Loading";

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<ITodo | null>(null);
  const { errorMessage, handleError, clearError } = useHttpError();
  const [loading, setLoading] = useState(true);

  // Formatear fechas usando el hook personalizado
  const createdDate = useFormatDate(task?.createdAt);
  const dueDate = useFormatDate(task?.dueDate);

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const taskId = id || "";

    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await todoservice.getTodoById(taskId);
        setTask(data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetail();
  }, [id, clearError, handleError]);

  const handleDeleteTask = async () => {
    if (!task?._id) {
      handleError(new Error("ID de tarea no disponible"));
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar la tarea "${task.title}"?\n\nEsta acción no se puede deshacer.`,
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      clearError();
      await todoservice.deleteTodo(task._id);

      // Redirigir a la lista después de eliminar
      navigate("/tasks", {
        replace: true,
        state: { message: "Tarea eliminada exitosamente" },
      });
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (!task) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-heading font-bold text-tertiary mb-4">
          Tarea no encontrada
        </h1>
        <Button
          type="button"
          onClick={handleGoBack}
          variant="secondary"
          size="md"
        >
          ← Volver a Tareas
        </Button>
      </div>
    );
  }
  if (errorMessage) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-body text-red-600">{errorMessage}</p>
        </div>
        <Button
          type="button"
          onClick={handleGoBack}
          variant="secondary"
          size="md"
        >
          ← Volver a Tareas
        </Button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <nav className="mb-4">
          <Button
            type="button"
            onClick={handleGoBack}
            variant="secondary"
            size="sm"
          >
            ← Volver a Tareas
          </Button>
        </nav>

        <h1 className="text-3xl font-heading font-bold text-tertiary mb-2">
          {task.title}
        </h1>

        <div className="flex items-center gap-4 text-sm font-body text-tertiary">
          {createdDate.isValid && (
            <time
              dateTime={createdDate.iso}
              className="flex items-center gap-1"
            >
              <span className="font-semibold">Creada:</span>{" "}
              {createdDate.formatted}
            </time>
          )}
          <Badge variant="priority" priority={task.priority} />
          {dueDate.isValid && (
            <time dateTime={dueDate.iso} className="flex items-center gap-1">
              <span className="font-semibold">Vence:</span> {dueDate.formatted}
            </time>
          )}
        </div>
      </header>

      <section className="bg-white p-6 rounded-lg shadow border border-neutral mb-6">
        <h2 className="text-xl font-heading font-semibold text-tertiary mb-4">
          Descripción
        </h2>
        <p className="font-body text-tertiary leading-relaxed">
          {task.description || (
            <em className="text-tertiary opacity-60">Sin descripción</em>
          )}
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow border border-neutral mb-6">
        <h2 className="text-xl font-heading font-semibold text-tertiary mb-4">
          Estado
        </h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="task-completed"
            checked={task.completed}
            readOnly
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer"
            aria-label="Estado de completitud de la tarea"
          />
          <label
            htmlFor="task-completed"
            className="text-lg font-body text-tertiary cursor-pointer"
          >
            {task.completed ? (
              <span>
                <strong className="text-tertiary">Completada</strong> ✓
              </span>
            ) : (
              <span> No completada</span>
            )}
          </label>
        </div>
      </section>

      <footer className="flex flex-wrap gap-4">
        <Link to={`/tasks/${task._id}/edit`}>
          <Button type="button" variant="primary" size="md">
            Editar Tarea
          </Button>
        </Link>

        <Button
          type="button"
          variant="danger"
          size="md"
          onClick={handleDeleteTask}
        >
          Eliminar Tarea
        </Button>
        <Link to="/tasks">
          <Button type="button" variant="secondary" size="md">
            Volver a la Lista
          </Button>
        </Link>
      </footer>
    </article>
  );
}
