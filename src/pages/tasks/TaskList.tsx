import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import type { ITodo } from "../../interfaces";
import { useHttpError } from "../../hooks";
import { todoservice } from "../../services/todoService";
import Loading from "../../components/Loading";

export default function TaskList() {
  const [tasks, setTasks] = useState<ITodo[]>([]);
  const { errorMessage, handleError, clearError } = useHttpError();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await todoservice.gettodos();
        setTasks(data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo queremos ejecutar esto al montar el componente

  // Estado de carga
  if (loading) {
    return <Loading />;
  }

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-tertiary mb-2">
          Mis Tareas
        </h1>
        <p className="font-body text-tertiary">
          Gestiona tus tareas diarias y mantente productivo
        </p>
      </header>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-body text-red-600">{errorMessage}</p>
        </div>
      )}

      <section className="mb-6">
        <Link to="/tasks/create">
          <Button type="button" variant="primary" size="md">
            Agregar Nueva Tarea
          </Button>
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-heading font-semibold text-tertiary mb-4">
          Lista de Tareas
        </h2>

        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task._id}>
                <Link
                  to={`/tasks/${task._id}`}
                  className="block bg-white p-4 rounded-lg shadow border border-neutral hover:shadow-md hover:border-secondary transition-all duration-200"
                >
                  <article className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`task-${task._id}`}
                        checked={task.completed}
                        readOnly
                        onClick={(e) => e.preventDefault()}
                        className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer"
                        aria-label={`Marcar tarea "${task.title}" como ${task.completed ? "incompleta" : "completa"}`}
                      />
                      <label
                        htmlFor={`task-${task._id}`}
                        className={`text-lg font-body cursor-pointer ${task.completed ? "line-through text-neutral-dark" : "text-tertiary"}`}
                      >
                        {task.title}
                      </label>
                    </div>

                    <span className="px-4 py-2 text-sm font-body text-primary group-hover:underline">
                      Ver Detalles
                    </span>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 bg-secondary bg-opacity-10 rounded-lg border border-secondary">
            <p className="font-body text-tertiary text-lg">
              <em>No hay tareas aún. ¡Crea tu primera tarea para comenzar!</em>
            </p>
          </div>
        )}
      </section>
    </article>
  );
}
