import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import type { ITodo, ITodoFilters } from "../../interfaces";
import { useFetchList } from "../../hooks";
import { todoservice } from "../../services/todoService";
import Loading from "../../components/Loading";

export default function TaskList() {
  const {
    data: tasks,
    loading,
    errorMessage,
  } = useFetchList<ITodo, ITodoFilters>({
    fetchFn: todoservice.gettodos,
  });

  const [localTasks, setLocalTasks] = useState<ITodo[]>([]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleToggleComplete = async (
    taskId: string,
    currentCompleted: boolean,
  ) => {
    try {
      setLocalTasks(
        localTasks.map((task) =>
          task._id === taskId
            ? { ...task, completed: !currentCompleted }
            : task,
        ),
      );

      await todoservice.updateTodoState(taskId, !currentCompleted);
    } catch (err) {
      setLocalTasks(
        localTasks.map((task) =>
          task._id === taskId ? { ...task, completed: currentCompleted } : task,
        ),
      );
      console.error("Error al actualizar estado de tarea:", err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-tertiary mb-2">
          Mis Tareas
        </h2>
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
        <Link to="/tasks/new">
          <Button type="button" variant="primary" size="md">
            Agregar Nueva Tarea
          </Button>
        </Link>
      </section>

      <section>
        <h3 className="text-xl font-heading font-semibold text-tertiary mb-4">
          Lista de Tareas
        </h3>

        {localTasks.length > 0 ? (
          <ul className="space-y-3">
            {localTasks.map((task) => (
              <li key={task._id}>
                <div className="block bg-white p-4 rounded-lg shadow border border-neutral hover:shadow-md hover:border-secondary transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div></div>
                      <input
                        type="checkbox"
                        id={`task-${task._id}`}
                        checked={task.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(task._id!, task.completed);
                        }}
                        className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer"
                        aria-label={`Marcar tarea "${task.title}" como ${task.completed ? "incompleta" : "completa"}`}
                      />
                      <Link to={`/tasks/${task._id}`}>
                        <label
                          htmlFor={`task-${task._id}`}
                          className={`w-100 text-lg font-body cursor-pointer ${task.completed ? "line-through text-neutral-dark" : "text-tertiary"}`}
                        >
                          {task.title}
                        </label>
                      </Link>
                    </div>
                  </div>
                </div>
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
    </div>
  );
}
