import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ButtonLink, TaskCard, ConfirmModal } from "../../components/ui";
import type { ITodo, ITodoFilters, FilterConfig, FilterValues, TodoPriority } from "../../interfaces";
import { useFilterableList } from "../../hooks";
import { todoservice } from "../../services/todoService";
import FilterableList from "../../components/FilterableList";

const ITEMS_PER_PAGE = 5;

export default function TaskList() {
  const [searchParams] = useSearchParams();
  const { id: pathTaskId } = useParams<{ id: string }>();
  const isCompletedView = searchParams.get("completed") === "true";
  const highlightedTaskId = searchParams.get("task") || pathTaskId || null;

  const initialFilters = useMemo(() => {
    const filters: FilterValues = {};
    const dueDateFrom = searchParams.get("dueDateFrom");
    const dueDateTo = searchParams.get("dueDateTo");
    const priority = searchParams.get("priority");

    if (dueDateFrom) filters.dueDateFrom = dueDateFrom;
    if (dueDateTo) filters.dueDateTo = dueDateTo;
    if (priority === "low" || priority === "medium" || priority === "high") {
      filters.priority = priority as TodoPriority;
    }

    return filters;
  }, [searchParams]);

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
    initialFilters,
  });

  const [localTaskStates, setLocalTaskStates] = useState<
    Record<string, boolean>
  >({});
  const [lockedTasks, setLockedTasks] = useState<Record<string, boolean>>({});
  const [taskToConfirm, setTaskToConfirm] = useState<ITodo | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [deletedIds, setDeletedIds] = useState<Record<string, true>>({});
  const [pinnedTask, setPinnedTask] = useState<ITodo | null>(null);

  useEffect(() => {
    setLocalTaskStates({});
  }, [filterableList.data]);

  useEffect(() => {
    if (!highlightedTaskId) {
      setPinnedTask(null);
      return;
    }

    if (filterableList.loading) return;

    const alreadyVisible = filterableList.data.some(
      (task) => task._id === highlightedTaskId,
    );
    if (alreadyVisible) {
      setPinnedTask(null);
      return;
    }

    let cancelled = false;
    const fetchPinnedTask = async () => {
      try {
        const task = await todoservice.getTodoById(highlightedTaskId);
        if (!cancelled && task) setPinnedTask(task);
      } catch {
        if (!cancelled) setPinnedTask(null);
      }
    };

    void fetchPinnedTask();
    return () => {
      cancelled = true;
    };
  }, [highlightedTaskId, filterableList.loading, filterableList.data]);

  const visibleTasks = useMemo(() => {
    const filtered = filterableList.data.filter(
      (task) => !task._id || !deletedIds[task._id],
    );

    if (
      pinnedTask?._id &&
      !deletedIds[pinnedTask._id] &&
      !filtered.some((task) => task._id === pinnedTask._id)
    ) {
      return [pinnedTask, ...filtered];
    }

    return filtered;
  }, [filterableList.data, deletedIds, pinnedTask]);

  const handleToggleComplete = useCallback(
    (taskId: string, currentCompleted: boolean) => {
      if (!currentCompleted) {
        const task = visibleTasks.find((item) => item._id === taskId);
        if (task) setTaskToConfirm(task);
      }
    },
    [visibleTasks],
  );

  const handleConfirmComplete = useCallback(async () => {
    if (!taskToConfirm?._id) return;
    setIsConfirming(true);
    try {
      await todoservice.updateTodoState(taskToConfirm._id, true);
      setLocalTaskStates((prev) => ({ ...prev, [taskToConfirm._id!]: true }));
      setLockedTasks((prev) => ({ ...prev, [taskToConfirm._id!]: true }));
    } catch (err) {
      console.error("Error al completar tarea:", err);
    } finally {
      setIsConfirming(false);
      setTaskToConfirm(null);
    }
  }, [taskToConfirm]);

  const getTaskCompleted = (task: ITodo): boolean => {
    return localTaskStates[task._id!] ?? task.completed;
  };

  const getTaskLocked = (task: ITodo): boolean => {
    return lockedTasks[task._id!] ?? task.isLocked ?? false;
  };

  const renderTaskItem = (task: ITodo) => (
    <TaskCard
      key={task._id}
      id={task._id}
      title={task.title}
      description={task.description}
      goalTitle={task.goalTitle}
      dueDate={task.dueDate}
      priority={task.priority}
      completed={getTaskCompleted(task)}
      isLocked={getTaskLocked(task)}
      defaultExpanded={task._id === highlightedTaskId}
      onToggleComplete={handleToggleComplete}
      onDeleted={(taskId) =>
        setDeletedIds((prev) => ({ ...prev, [taskId]: true }))
      }
    />
  );

  return (
    <div className="flex flex-col gap-11 justify-center pt-6">
      <div className="flex flex-col gap-6 justify-center">
        <h2 className="font-heading font-bold text-tertiary">
          {isCompletedView ? "Tareas Completadas" : "Mis Tareas"}
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
        data={visibleTasks}
        isEmpty={visibleTasks.length === 0 && !filterableList.loading}
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
          Ver Historial de Tareas Completadas
        </ButtonLink>
      )}

      <ConfirmModal
        isOpen={!!taskToConfirm}
        onClose={() => setTaskToConfirm(null)}
        onConfirm={handleConfirmComplete}
        title="¡Genial!"
        message="¿Completaste esta tarea? ¡Eso es un gran paso!"
        confirmText="¡Sí, la hice!"
        cancelText="Todavía no"
        variant="success"
        loading={isConfirming}
      />
    </div>
  );
}
