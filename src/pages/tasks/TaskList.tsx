import { useState, useEffect, useCallback } from "react";
import { ButtonLink, TaskCard } from "../../components/ui";
import type { ITodo, ITodoFilters } from "../../interfaces";
import { useFilterableList } from "../../hooks";
import { todoservice } from "../../services/todoService";
import FilterableList from "../../components/FilterableList";

const ITEMS_PER_PAGE = 5;

export default function TaskList() {
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

  const renderTaskItem = (task: ITodo) => (
    <TaskCard
      key={task._id}
      id={task._id}
      title={task.title}
      goalTitle={task.goalTitle}
      completed={getTaskCompleted(task)}
      onToggleComplete={handleToggleComplete}
    />
  );

  return (
    <div className="flex flex-col gap-11 justify-center">
      <div className="flex flex-col gap-6 justify-center">
        <h2 className="font-heading font-bold text-tertiary">
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
