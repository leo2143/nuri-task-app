import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Button, ButtonLink } from "../../components/ui";
import type { ITodo, ITodoFilters } from "../../interfaces";
import { useFilterableList } from "../../hooks";
import { todoservice } from "../../services/todoService";
import FilterableList from "../../components/FilterableList";

const ITEMS_PER_PAGE = 5;

export default function TaskList() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const filterableList = useFilterableList<ITodo, ITodoFilters>({
    fetchFn: todoservice.gettodos,
    buildFilters: (searchTerm, pagination) => ({
      search: searchTerm || undefined,
      limit: pagination?.limit,
      cursor: pagination?.cursor,
    }),
    pagination: { enabled: true, limit: ITEMS_PER_PAGE },
  });

  // Estado local para optimistic updates del checkbox
  const [localTaskStates, setLocalTaskStates] = useState<
    Record<string, boolean>
  >({});

  // Reset local states cuando cambian los datos
  useEffect(() => {
    setLocalTaskStates({});
  }, [filterableList.data]);

  const handleToggleComplete = useCallback(
    async (taskId: string, currentCompleted: boolean) => {
      // Optimistic update
      setLocalTaskStates((prev) => ({
        ...prev,
        [taskId]: !currentCompleted,
      }));

      try {
        await todoservice.updateTodoState(taskId, !currentCompleted);
      } catch (err) {
        // Revert on error
        setLocalTaskStates((prev) => ({
          ...prev,
          [taskId]: currentCompleted,
        }));
        console.error("Error al actualizar estado de tarea:", err);
      }
    },
    [],
  );

  const getTaskCompleted = (task: ITodo): boolean => {
    return localTaskStates[task._id!] ?? task.completed;
  };

  const renderTaskItem = (task: ITodo) => {
    const isCompleted = getTaskCompleted(task);

    return (
      <div
        key={task._id}
        className="block bg-white p-5 rounded-lg shadow-brand-glow cursor-pointer"
        onClick={() => navigate(`/tasks/${task._id}`)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id={`task-${task._id}`}
              checked={isCompleted}
              onChange={(e) => {
                e.stopPropagation();
                handleToggleComplete(task._id!, task.completed);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 text-primary rounded cursor-pointer bg-primary"
              aria-label={`Marcar tarea "${task.title}" como ${isCompleted ? "incompleta" : "completa"}`}
            />
            <span
              className={`flex-1 text-lg font-body ${isCompleted ? "line-through text-neutral-dark" : "text-tertiary"}`}
            >
              {task.title}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-11 justify-center">
      <div className="flex flex-col gap-6 justify-center">
        <div className="mb-4">
          <Button
            type="button"
            onClick={handleGoBack}
            variant="secondary"
            size="sm"
          >
            ← Volver
          </Button>
        </div>

        <h2 className="text-3xl font-heading font-bold text-tertiary">
          Mis Tareas
        </h2>

        <ButtonLink
          to="/tasks/new"
          variant="primary"
          fullWidth
          icon="add"
        >
          Agregar Nueva Tarea
        </ButtonLink>
      </div>

      <FilterableList
        {...filterableList}
        onSearchChange={filterableList.setSearchTerm}
        searchPlaceholder="Buscar tarea..."
        renderItem={renderTaskItem}
        emptyStateName="Tareas"
        loadMoreText="Cargar más tareas"
        loadingMoreText="Cargando más tareas..."
      />
    </div>
  );
}
