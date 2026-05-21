import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ButtonLink, TaskCard } from "../../components/ui";
import type { ITodo, ITodoFilters, FilterConfig } from "../../interfaces";
import { useFilterableList } from "../../hooks";
import { todoservice } from "../../services/todoService";
import FilterableList from "../../components/FilterableList";

const ITEMS_PER_PAGE = 5;

export default function TaskList() {
  const [searchParams] = useSearchParams();
  const isCompletedView = searchParams.get("completed") === "true";

  const taskFilterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: "priority",
        label: "Prioridad",
        type: "chips",
        options: [
          { value: "low", label: "Baja" },
          { value: "medium", label: "Media" },
          { value: "high", label: "Alta" },
        ],
      },
      { key: "dueDateFrom", label: "Fecha desde", type: "date" },
      { key: "dueDateTo", label: "Fecha hasta", type: "date" },
    ],
    []
  );

  const filterableList = useFilterableList<ITodo, ITodoFilters>({
    fetchFn: todoservice.gettodos,
    buildFilters: (searchTerm, pagination, activeFilters) => ({
      search: searchTerm || undefined,
      completed: isCompletedView ? true : false,
      priority: activeFilters?.priority as ITodoFilters["priority"],
      dueDateFrom: activeFilters?.dueDateFrom as string | undefined,
      dueDateTo: activeFilters?.dueDateTo as string | undefined,
      limit: pagination?.limit,
      cursor: pagination?.cursor,
    }),
    pagination: { enabled: true, limit: ITEMS_PER_PAGE },
    extraDependencies: [isCompletedView],
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
    <div className="flex flex-col gap-11 justify-center pt-6">
      <div className="flex flex-col gap-6 justify-center">
        <h2 className="font-heading font-bold text-tertiary">
          {isCompletedView ? "Tareas Realizadas" : "Mis Tareas"}
        </h2>

        {!isCompletedView && (
          <ButtonLink
            to="/tasks/new"
            variant="primary"
            fullWidth
            icon="add"
          >
            Agregar Nueva Tarea
          </ButtonLink>
        )}
      </div>

      <FilterableList
        {...filterableList}
        onSearchChange={filterableList.setSearchTerm}
        searchPlaceholder="Buscar tarea..."
        renderItem={renderTaskItem}
        emptyStateName="Tareas"
        loadMoreText="Cargar más tareas"
        loadingMoreText="Cargando más tareas..."
        filterConfig={taskFilterConfig}
        activeFilters={filterableList.activeFilters}
        onFiltersChange={filterableList.setActiveFilters}
      />

      {!isCompletedView && (
        <ButtonLink
          to="/tasks?completed=true"
          variant="secondary"
          fullWidth
        >
          Ver Historial de Tareas Realizadas
        </ButtonLink>
      )}
    </div>
  );
}
