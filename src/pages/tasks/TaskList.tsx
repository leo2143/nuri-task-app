import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ButtonLink } from "../../components/ui";
import type { ITodo, ITodoFilters } from "../../interfaces";
import { useFetchList } from "../../hooks";
import { todoservice } from "../../services/todoService";
import Loading from "../../components/Loading";
import StateMessage from "../../components/StateMessage";

export default function TaskList() {
  const navigate = useNavigate();
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
    <section className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-tertiary mb-2">
          Mis Tareas
        </h2>
        <p className="font-body text-tertiary">
          Gestiona tus tareas diarias y mantente productivo
        </p>
      </div>

      <div className="mb-6">
        <ButtonLink to="/tasks/new" variant="primary" size="md">
          Agregar Nueva Tarea
        </ButtonLink>
      </div>

      <section>
        <h3 className="text-xl font-heading font-semibold text-tertiary mb-4">
          Lista de Tareas
        </h3>

        {errorMessage ? (
          <StateMessage itemName="las tareas" variant="error" />
        ) : localTasks.length > 0 ? (
          <ul className="space-y-3">
            {localTasks.map((task) => (
              <li key={task._id}>
                <div
                  className="block bg-white p-4 rounded-lg shadow border border-neutral hover:shadow-md hover:border-secondary transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/tasks/${task._id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`task-${task._id}`}
                        checked={task.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(task._id!, task.completed);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 text-primary rounded cursor-pointer bg-primary"
                        aria-label={`Marcar tarea "${task.title}" como ${task.completed ? "incompleta" : "completa"}`}
                      />
                      <span
                        className={`flex-1 text-lg font-body ${task.completed ? "line-through text-neutral-dark" : "text-tertiary"}`}
                      >
                        {task.title}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <StateMessage itemName="Tareas" variant="notFoundList" />
        )}
      </section>
    </section>
  );
}
