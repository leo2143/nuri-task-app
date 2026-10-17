import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  ButtonLink,
  ProgressBar,
  ConfirmModal,
  TaskCard,
  GoalCard,
  StatusBadge,
  TabGroup,
} from "../../components/ui";
import type { IGoal, ITodo, FilterConfig, FilterValues } from "../../interfaces";
import { useAppNavigate, useFetchByIdOffline, useFormatDate, useHttpError } from "../../hooks";
import { goalService } from "../../services/goalService";
import { todoservice } from "../../services/todoService";
import Loading from "../../components/Loading";
import FilterableList from "../../components/FilterableList";
import GoalOverflowMenu from "../../components/GoalOverflowMenu";
import { canCloseGoal } from "../../utils/canCloseGoal";
import { goalFilterConfig, matchesGoalDateFilters } from "../../utils/goalFilterConfig";
import { lapiz, calendar, trash, addButtonBrand } from "../../assets/svg-icons";

type TabType = "tasks" | "subgoals";

export default function GoalDetail() {
  const navigate = useAppNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("tasks");
  const [tasks, setTasks] = useState<ITodo[]>([]);
  const [subGoals, setSubGoals] = useState<IGoal[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingSubGoals, setLoadingSubGoals] = useState(false);
  const [isFirstLoadTasks, setIsFirstLoadTasks] = useState(true);
  const [isFirstLoadSubGoals, setIsFirstLoadSubGoals] = useState(true);
  const [taskSearchTerm, setTaskSearchTerm] = useState("");
  const [subGoalSearchTerm, setSubGoalSearchTerm] = useState("");
  const [activeTaskFilters, setActiveTaskFilters] = useState<FilterValues>({});
  const [activeSubGoalFilters, setActiveSubGoalFilters] = useState<FilterValues>({});
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [localGoal, setLocalGoal] = useState<IGoal | null>(null);
  const [taskToConfirm, setTaskToConfirm] = useState<ITodo | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isClosingGoal, setIsClosingGoal] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const { handleError } = useHttpError();

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
      {
        key: "completed",
        label: "Estado",
        type: "chips",
        options: [{ value: "true", label: "Completada" }],
      },
    ],
    []
  );

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

  const goalId = fetchedGoal?._id;

  /**
   * Vuelve a pedir la meta para sincronizar progress tras completar o borrar una tarea.
   */
  const refreshGoal = useCallback(async () => {
    if (!goalId) return;
    try {
      const updatedGoal = await goalService.getGoalById(goalId);
      if (updatedGoal) setLocalGoal(updatedGoal);
    } catch (error) {
      console.error("Error al actualizar la meta:", error);
    }
  }, [goalId]);

  // Cargar tareas relacionadas
  useEffect(() => {
    if (activeTab !== "tasks" || !goalId) return;

    let cancelled = false;
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const tasksData = await goalService.getGoalTodos(goalId);
        if (cancelled) return;
        setTasks(tasksData);
      } catch (error) {
        if (cancelled) return;
        console.error("Error fetching tasks:", error);
      } finally {
        if (!cancelled) {
          setLoadingTasks(false);
          setIsFirstLoadTasks(false);
        }
      }
    };

    void fetchTasks();
    return () => {
      cancelled = true;
    };
  }, [goalId, activeTab]);

  // Cargar submetas
  useEffect(() => {
    if (activeTab !== "subgoals" || !goalId) return;

    let cancelled = false;
    const fetchSubGoals = async () => {
      setLoadingSubGoals(true);
      try {
        const subGoalsData = await goalService.getSubGoals(goalId);
        if (cancelled) return;
        setSubGoals(subGoalsData);
      } catch (error) {
        if (cancelled) return;
        console.error("Error fetching subgoals:", error);
      } finally {
        if (!cancelled) {
          setLoadingSubGoals(false);
          setIsFirstLoadSubGoals(false);
        }
      }
    };

    void fetchSubGoals();
    return () => {
      cancelled = true;
    };
  }, [goalId, activeTab]);

  const handleToggleTaskComplete = useCallback(
    (taskId: string, currentCompleted: boolean) => {
      if (!currentCompleted) {
        const task = tasks.find((t) => t._id === taskId);
        if (task) setTaskToConfirm(task);
      }
    },
    [tasks],
  );

  const handleConfirmTaskComplete = useCallback(async () => {
    if (!taskToConfirm?._id) return;
    setIsConfirming(true);
    try {
      await todoservice.updateTodoState(taskToConfirm._id, true);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskToConfirm._id
            ? { ...task, completed: true, isLocked: true }
            : task,
        ),
      );
      await refreshGoal();
    } catch (error) {
      console.error("Error al completar tarea:", error);
    } finally {
      setIsConfirming(false);
      setTaskToConfirm(null);
    }
  }, [taskToConfirm, refreshGoal]);

  // Filtrar tareas localmente (búsqueda + filtros)
  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (taskSearchTerm) {
      const searchLower = taskSearchTerm.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower),
      );
    }

    if (activeTaskFilters.priority) {
      result = result.filter(
        (task) => task.priority === activeTaskFilters.priority,
      );
    }

    if (String(activeTaskFilters.completed) === "true") {
      result = result.filter((task) => task.completed === true);
    }

    return result;
  }, [tasks, taskSearchTerm, activeTaskFilters]);

  // Filtrar submetas localmente (búsqueda + filtros)
  const filteredSubGoals = useMemo(() => {
    let result = subGoals;

    if (subGoalSearchTerm) {
      const searchLower = subGoalSearchTerm.toLowerCase();
      result = result.filter(
        (subGoal) =>
          subGoal.title.toLowerCase().includes(searchLower) ||
          subGoal.description?.toLowerCase().includes(searchLower),
      );
    }

    if (activeSubGoalFilters.status) {
      result = result.filter(
        (subGoal) => subGoal.status === activeSubGoalFilters.status,
      );
    }

    if (activeSubGoalFilters.priority) {
      result = result.filter(
        (subGoal) => subGoal.priority === activeSubGoalFilters.priority,
      );
    }

    result = result.filter((subGoal) =>
      matchesGoalDateFilters(subGoal.dueDate, activeSubGoalFilters),
    );

    return result;
  }, [subGoals, subGoalSearchTerm, activeSubGoalFilters]);

  // Render functions para FilterableList
  const renderTaskItem = useCallback(
    (task: ITodo) => (
      <TaskCard
        key={task._id}
        id={task._id}
        title={task.title}
        description={task.description}
        goalTitle={goal?.title}
        dueDate={task.dueDate}
        priority={task.priority}
        completed={task.completed}
        isLocked={task.isLocked}
        onToggleComplete={handleToggleTaskComplete}
        onDeleted={(taskId) => {
          setTasks((prev) => prev.filter((item) => item._id !== taskId));
          void refreshGoal();
        }}
      />
    ),
    [handleToggleTaskComplete, goal?.title, refreshGoal],
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

  const handleStatusChange = async (newStatus: "active" | "paused" | "completed") => {
    if (!goal?._id) return;
    setUpdatingStatus(true);
    try {
      const updatedGoal = await goalService.updateGoalStatus(goal._id, newStatus);
      setLocalGoal(updatedGoal);
    } catch (error) {
      setErrorModalMessage(handleError(error));
      setIsErrorModalOpen(true);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleConfirmCloseGoal = async () => {
    if (!goal?._id) return;
    setIsClosingGoal(true);
    try {
      const updatedGoal = await goalService.updateGoalStatus(goal._id, "completed");
      setLocalGoal(updatedGoal);
      setIsCloseModalOpen(false);
    } catch (error) {
      setIsCloseModalOpen(false);
      setErrorModalMessage(handleError(error));
      setIsErrorModalOpen(true);
    } finally {
      setIsClosingGoal(false);
    }
  };

  const showCloseCta = canCloseGoal(goal);

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

  const createChildPath =
    activeTab === "tasks"
      ? `/tasks/new?goalId=${goal._id}`
      : `/goals/new?parentGoalId=${goal._id}`;
  const createChildLabel =
    activeTab === "tasks" ? "Crear tarea" : "Crear meta asociada";
  const createChildAction = (
    <Link
      to={createChildPath}
      className="shrink-0 inline-flex items-center justify-center w-11 h-11 hover:opacity-80 transition-opacity"
      aria-label={createChildLabel}
    >
      <img
        src={addButtonBrand}
        alt=""
        aria-hidden="true"
        className="w-11 h-11"
      />
    </Link>
  );

  return (
    <section className="max-w-4xl mx-auto flex flex-col pt-6">
      <div className="bg-secondary-dark rounded-lg p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <StatusBadge status={goal.status} />
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={`/goals/${goal._id}/edit`}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Editar meta"
            >
              <img src={lapiz} alt="" aria-hidden="true" className="w-5 h-5 shrink-0 invert brightness-0" />
            </Link>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              aria-label="Eliminar meta"
            >
              <img src={trash} alt="" aria-hidden="true" className="w-5 h-5 shrink-0" />
            </button>
            <GoalOverflowMenu
              status={goal.status}
              disabled={updatingStatus}
              onPause={() => void handleStatusChange("paused")}
              onResume={() => void handleStatusChange("active")}
            />
          </div>
        </div>

        <h2 className="mt-5 text-xl font-heading font-bold text-brand min-w-0 break-words">
          {goal.title}
        </h2>

        <p className="mt-4 text-base text-white leading-relaxed min-w-0 break-words">
          {goal.description || "Sin descripción"}
        </p>

        {goal.reason && (
          <p className="mt-4 text-base text-white leading-relaxed min-w-0 break-words">
            {goal.reason}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
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

        <div className="mt-4 -mx-2.5">
          <ProgressBar
            progress={goal.progress}
            variant="inline"
            height="xl"
            color="bg-brand"
            bgColor="bg-[#D2D2D2]"
          />
        </div>

        {showCloseCta && (
          <div className="mt-2 -mx-2.5">
            <Button
              type="button"
              variant="onDark"
              size="sm"
              fullWidth
              className="text-base h-10 shadow-none hover:scale-100"
              disabled={updatingStatus || isClosingGoal}
              onClick={() => setIsCloseModalOpen(true)}
            >
              Cerrar meta
            </Button>
          </div>
        )}
      </div>

      <ButtonLink
        to={`/goals/${goal._id}/new/subgoal`}
        variant="primary"
        fullWidth
        icon="add"
        className="mt-3"
      >
        Asociar Meta
      </ButtonLink>

      <div className="flex flex-col gap-5 mt-5">
        <TabGroup
          tabs={[
            { id: "tasks", label: "Tareas" },
            { id: "subgoals", label: "Metas Asociadas" },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabType)}
        />

        {activeTab === "tasks" && (
          <FilterableList
            data={filteredTasks}
            loading={loadingTasks}
            errorMessage=""
            isEmpty={filteredTasks.length === 0}
            searchTerm={taskSearchTerm}
            onSearchChange={setTaskSearchTerm}
            searchPlaceholder="Buscar tarea..."
            renderItem={renderTaskItem}
            emptyStateName="Tareas"
            isFirstLoad={isFirstLoadTasks}
            filterConfig={taskFilterConfig}
            activeFilters={activeTaskFilters}
            onFiltersChange={setActiveTaskFilters}
            headerAction={createChildAction}
          />
        )}

        {activeTab === "subgoals" && (
          <FilterableList
            data={filteredSubGoals}
            loading={loadingSubGoals}
            errorMessage=""
            isEmpty={filteredSubGoals.length === 0}
            searchTerm={subGoalSearchTerm}
            onSearchChange={setSubGoalSearchTerm}
            searchPlaceholder="Buscar meta..."
            renderItem={renderSubGoalItem}
            emptyStateName="Metas"
            isFirstLoad={isFirstLoadSubGoals}
            filterConfig={goalFilterConfig}
            activeFilters={activeSubGoalFilters}
            onFiltersChange={setActiveSubGoalFilters}
            headerAction={createChildAction}
          />
        )}
      </div>


      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="¿Eliminar meta?"
        message={`¿Querés eliminar la meta "${goal.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        onConfirm={handleDeleteGoal}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <ConfirmModal
        isOpen={!!taskToConfirm}
        onClose={() => setTaskToConfirm(null)}
        onConfirm={handleConfirmTaskComplete}
        title="¡Genial!"
        message="¿Completaste esta tarea? ¡Eso es un gran paso!"
        confirmText="¡Sí, la hice!"
        cancelText="Todavía no"
        variant="success"
        loading={isConfirming}
      />

      <ConfirmModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirm={handleConfirmCloseGoal}
        title="¿Cerrar meta?"
        message="Completaste los pasos. ¿La damos por cerrada?"
        confirmText="Cerrar meta"
        cancelText="Todavía no"
        variant="success"
        loading={isClosingGoal}
      />

      <ConfirmModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        onConfirm={() => setIsErrorModalOpen(false)}
        title="¡Ups!"
        message={errorModalMessage}
        confirmText="Aceptar"
        cancelText=""
        variant="danger"
        loading={false}
      />
    </section>
  );
}
