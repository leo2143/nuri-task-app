import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ButtonLink,
  ProgressBar,
  ConfirmModal,
  TaskCard,
  GoalCard,
  StatusSelect,
  TabGroup,
} from "../../components/ui";
import type { IGoal, ITodo, ITodoFilters, IGoalFilters, FilterConfig, ISuccessResponse } from "../../interfaces";
import { useFetchByIdOffline, useFormatDate, useFilterableList } from "../../hooks";
import { goalService } from "../../services/goalService";
import { todoservice } from "../../services/todoService";
import Loading from "../../components/Loading";
import FilterableList from "../../components/FilterableList";
import { lapiz, calendar, trash } from "../../assets/svg-icons";

type TabType = "tasks" | "subgoals";

export default function GoalDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("tasks");

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [localGoal, setLocalGoal] = useState<IGoal | null>(null);

  const {
    data: fetchedGoal,
    loading,
    errorMessage,
  } = useFetchByIdOffline<IGoal>({
    fetchFn: goalService.getGoalById,
    cacheKey: "goal",
  });

  // Sincronizar localGoal cuando se obtienen los datos
  useEffect(() => {
    if (fetchedGoal) {
      setLocalGoal(fetchedGoal);
    }
  }, [fetchedGoal]);

  const goal = localGoal;

  const dueDate = useFormatDate(goal?.dueDate);

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
    [],
  );

  const filterableList = useFilterableList<ITodo, ITodoFilters>({
    fetchFn: useCallback(
      async (filters?: ITodoFilters) => {
        if (!goal?._id) {
          return { data: [], meta: null, success: true, status: 200, message: null } as ISuccessResponse<ITodo[]>;
        }
        return goalService.getGoalTodos(goal._id, filters);
      },
      [goal?._id],
    ),
    buildFilters: (searchTerm, pagination, activeFilters) => ({
      search: searchTerm || undefined,
      priority: activeFilters?.priority as ITodoFilters["priority"],
      dueDateFrom: activeFilters?.dueDateFrom as string | undefined,
      dueDateTo: activeFilters?.dueDateTo as string | undefined,
      limit: pagination?.limit,
      cursor: pagination?.cursor,
    }),
    pagination: { enabled: true, limit: 5 },
    extraDependencies: [goal?._id],
  });

  const [localTaskStates, setLocalTaskStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalTaskStates({});
  }, [filterableList.data]);

  const subGoalFilterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: "status",
        label: "Estado",
        type: "chips",
        options: [
          { value: "active", label: "Activa" },
          { value: "paused", label: "Pausada" },
          { value: "completed", label: "Completada" },
        ],
      },
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
    [],
  );

  const subFilterableList = useFilterableList<IGoal, IGoalFilters>({
    fetchFn: useCallback(
      async (filters?: IGoalFilters) => {
        if (!goal?._id) {
          return { data: [], meta: null, success: true, status: 200, message: null } as ISuccessResponse<IGoal[]>;
        }
        return goalService.getSubGoals(goal._id, filters);
      },
      [goal?._id],
    ),
    buildFilters: (searchTerm, pagination, activeFilters) => ({
      search: searchTerm || undefined,
      status: activeFilters?.status as IGoalFilters["status"],
      priority: activeFilters?.priority as IGoalFilters["priority"],
      dueDateFrom: activeFilters?.dueDateFrom as string | undefined,
      dueDateTo: activeFilters?.dueDateTo as string | undefined,
      limit: pagination?.limit,
      cursor: pagination?.cursor,
    }),
    pagination: { enabled: true, limit: 5 },
    extraDependencies: [goal?._id],
  });

  const handleToggleTaskComplete = useCallback(
    async (taskId: string, currentCompleted: boolean) => {
      setLocalTaskStates((prev) => ({
        ...prev,
        [taskId]: !currentCompleted,
      }));

      try {
        await todoservice.updateTodoState(taskId, !currentCompleted);
      } catch (err) {
        setLocalTaskStates((prev) => ({
          ...prev,
          [taskId]: currentCompleted,
        }));
        console.error("Error toggling task:", err);
      }
    },
    [],
  );

  const getTaskCompleted = (task: ITodo): boolean => {
    return localTaskStates[task._id!] ?? task.completed;
  };

  // Render functions para FilterableList
  const renderTaskItem = useCallback(
    (task: ITodo) => (
      <TaskCard
        key={task._id}
        id={task._id}
        title={task.title}
        description={task.description}
        goalTitle={goal?.title}
        completed={getTaskCompleted(task)}
        onToggleComplete={handleToggleTaskComplete}
      />
    ),
    [handleToggleTaskComplete, goal?.title, localTaskStates],
  );

  const renderSubGoalItem = useCallback(
    (subGoal: IGoal) => (
      <GoalCard
        key={subGoal._id}
        id={subGoal._id}
        title={subGoal.title}
        description={subGoal.description}
        status={subGoal.status}
        progress={subGoal.progress}
      />
    ),
    [],
  );

  const handleStatusChange = async (
    newStatus: "active" | "paused" | "completed",
  ) => {
    if (!goal?._id || !goal) return;
    setUpdatingStatus(true);
    try {
      const updatedGoal = await goalService.updateGoalStatus(goal._id, newStatus);
      setLocalGoal(updatedGoal);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!goal?._id) return;

    try {
      await goalService.deleteGoal(goal._id);
      navigate("/goals", {
        replace: true,
        state: { message: "Meta eliminada exitosamente" },
      });
    } catch (err) {
      console.error("Error al eliminar meta:", err);
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return priority;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!goal) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="font-heading font-bold text-tertiary mb-4">
          Meta no encontrada
        </h2>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-body text-red-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto space-y-4">
      {/* Card Principal */}
      <div className="bg-secondary-dark rounded-2xl p-5 text-white">
        {/* Título y botón editar */}
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-heading font-bold text-brand flex items-center gap-2">
            {goal.title}
          </h2>
          <div className="flex items-center gap-1">
            <Link
              to={`/goals/${goal._id}/edit`}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Editar meta"
            >
              <img src={lapiz} alt="" aria-hidden="true" className="w-5 h-5 invert brightness-0" />
            </Link>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              aria-label="Eliminar meta"
            >
              <img src={trash} alt="" aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-base text-white mb-1 leading-relaxed">
          {goal.description || "Sin descripción"}
        </p>

        {/* Reason */}
        {goal.reason && (
          <p className="text-base text-white mb-4 leading-relaxed">
            {goal.reason}
          </p>
        )}

        {/* Fecha y Prioridad */}
        <div className="flex items-center justify-between mb-4">
          {dueDate.isValid && (
            <div className="flex items-center gap-2">
              <img
                src={calendar}
                alt=""
                aria-hidden="true"
                className="w-5 h-5"
              />
              <time dateTime={dueDate.iso} className="text-sm font-bold text-brand">
                {dueDate.formatted}
              </time>
            </div>
          )}
          <span className="text-sm font-bold text-brand">
            Prioridad: {getPriorityLabel(goal.priority)}
          </span>
        </div>

        {/* Barra de Progreso */}
        <div className="mb-4">
          <ProgressBar
            progress={goal.progress}
            variant="inline"
            height="2xl"
            color="bg-brand"
            bgColor="bg-[#D2D2D2]"
          />
        </div>

        {/* Select de Estado */}
        <StatusSelect
          value={goal.status}
          onChange={handleStatusChange}
          disabled={updatingStatus}
        />
      </div>

      {/* Botón Asociar Meta */}
      <ButtonLink
        to={`/goals/${goal._id}/new/subgoal`}
        variant="primary"
        size="md"
        className="w-full flex items-center justify-center gap-2"
        icon="add"
      >

        Asociar Meta
      </ButtonLink>

      {/* Tabs */}
      <TabGroup
        tabs={[
          { id: "tasks", label: "Tareas" },
          { id: "subgoals", label: "Metas Asociadas" },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as TabType)}
      />

      {/* Contenido de Tabs */}
      {activeTab === "tasks" && (
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
      )}

      {activeTab === "subgoals" && (
        <FilterableList
          {...subFilterableList}
          onSearchChange={subFilterableList.setSearchTerm}
          searchPlaceholder="Buscar meta..."
          renderItem={renderSubGoalItem}
          emptyStateName="Metas"
          loadMoreText="Cargar más metas"
          loadingMoreText="Cargando más metas..."
          filterConfig={subGoalFilterConfig}
          activeFilters={subFilterableList.activeFilters}
          onFiltersChange={subFilterableList.setActiveFilters}
        />
      )}


      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="¿Eliminar meta?"
        message={`¿Estás seguro de que quieres eliminar la meta "${goal.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        onConfirm={handleDeleteGoal}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </section>
  );
}
