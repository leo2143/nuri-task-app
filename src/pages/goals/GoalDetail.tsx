import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ButtonLink,
  ProgressBar,
  ConfirmModal,
  TaskCard,
  GoalCard,
} from "../../components/ui";
import type { IGoal, ITodo } from "../../interfaces";
import { useFetchById, useFormatDate } from "../../hooks";
import { goalService } from "../../services/goalService";
import { todoservice } from "../../services/todoService"; // Solo para updateTodoState
import Loading from "../../components/Loading";
import FilterableList from "../../components/FilterableList";
import { lapiz, calendar, chevronDown } from "../../assets/svg-icons";

type TabType = "tasks" | "subgoals";

export default function GoalDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("tasks");
  const [tasks, setTasks] = useState<ITodo[]>([]);
  const [subGoals, setSubGoals] = useState<IGoal[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingSubGoals, setLoadingSubGoals] = useState(false);
  const [isFirstLoadTasks, setIsFirstLoadTasks] = useState(true);
  const [isFirstLoadSubGoals, setIsFirstLoadSubGoals] = useState(true);
  const [taskSearchTerm, setTaskSearchTerm] = useState("");
  const [subGoalSearchTerm, setSubGoalSearchTerm] = useState("");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [localGoal, setLocalGoal] = useState<IGoal | null>(null);

  const {
    data: fetchedGoal,
    loading,
    errorMessage,
  } = useFetchById<IGoal>({
    fetchFn: goalService.getGoalById,
  });

  // Sincronizar localGoal cuando se obtienen los datos
  useEffect(() => {
    if (fetchedGoal) {
      setLocalGoal(fetchedGoal);
    }
  }, [fetchedGoal]);

  const goal = localGoal;

  const dueDate = useFormatDate(goal?.dueDate);

  // Cargar tareas relacionadas
  useEffect(() => {
    const fetchTasks = async () => {
      if (!goal?._id) return;
      setLoadingTasks(true);
      try {
        const tasksData = await goalService.getGoalTodos(goal._id);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoadingTasks(false);
        setIsFirstLoadTasks(false);
      }
    };

    if (activeTab === "tasks" && goal?._id) {
      fetchTasks();
    }
  }, [goal?._id, activeTab]);

  // Cargar submetas
  useEffect(() => {
    const fetchSubGoals = async () => {
      if (!goal?._id) return;
      setLoadingSubGoals(true);
      try {
        const subGoalsData = await goalService.getSubGoals(goal._id);
        setSubGoals(subGoalsData);
      } catch (error) {
        console.error("Error fetching subgoals:", error);
      } finally {
        setLoadingSubGoals(false);
        setIsFirstLoadSubGoals(false);
      }
    };

    if (activeTab === "subgoals" && goal?._id) {
      fetchSubGoals();
    }
  }, [goal?._id, activeTab]);

  const handleToggleTaskComplete = useCallback(
    async (taskId: string, currentCompleted: boolean) => {
      try {
        const newStatus = !currentCompleted;
        await todoservice.updateTodoState(taskId, newStatus);
        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? { ...task, completed: newStatus } : task,
          ),
        );
      } catch (error) {
        console.error("Error toggling task:", error);
      }
    },
    [],
  );

  // Filtrar tareas localmente
  const filteredTasks = useMemo(() => {
    if (!taskSearchTerm) return tasks;
    const searchLower = taskSearchTerm.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower),
    );
  }, [tasks, taskSearchTerm]);

  // Filtrar submetas localmente
  const filteredSubGoals = useMemo(() => {
    if (!subGoalSearchTerm) return subGoals;
    const searchLower = subGoalSearchTerm.toLowerCase();
    return subGoals.filter(
      (subGoal) =>
        subGoal.title.toLowerCase().includes(searchLower) ||
        subGoal.description?.toLowerCase().includes(searchLower),
    );
  }, [subGoals, subGoalSearchTerm]);

  // Render functions para FilterableList
  const renderTaskItem = useCallback(
    (task: ITodo) => (
      <TaskCard
        key={task._id}
        id={task._id}
        title={task.title}
        description={task.description}
        completed={task.completed}
        onToggleComplete={handleToggleTaskComplete}
      />
    ),
    [handleToggleTaskComplete],
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
      const updatedGoal = await goalService.updateGoal(goal._id, {
        title: goal.title,
        description: goal.description,
        reason: goal.reason,
        status: newStatus,
        priority: goal.priority,
        dueDate: goal.dueDate,
      });
      setLocalGoal(updatedGoal);
      setIsStatusOpen(false);
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activa";
      case "paused":
        return "Pausada";
      case "completed":
        return "Completada";
      default:
        return status;
    }
  };

  const statusOptions = [
    { id: "active", title: "Activa" },
    { id: "paused", title: "Pausada" },
    { id: "completed", title: "Completada" },
  ];

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
      <article className="bg-secondary-dark rounded-2xl p-5 text-white">
        {/* Título y botón editar */}
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-heading font-bold text-brand flex items-center gap-2">
            {goal.title}
          </h2>
          <Link
            to={`/goals/${goal._id}/edit`}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Editar meta"
          >
            <img
              src={lapiz}
              alt=""
              aria-hidden="true"
              className="w-5 h-5 invert brightness-0"
            />
          </Link>
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
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            disabled={updatingStatus}
            className={`
              w-full px-4 py-3 pr-12
              bg-primary text-tertiary font-bold text-base
              text-center cursor-pointer outline-none
              ${isStatusOpen ? "rounded-t-lg" : "rounded-lg"}
              ${updatingStatus ? "opacity-60 cursor-not-allowed" : ""}
              transition-all duration-200
            `}
            aria-haspopup="listbox"
            aria-expanded={isStatusOpen}
          >
            {updatingStatus ? "Actualizando..." : getStatusLabel(goal.status)}
          </button>

          <img
            src={chevronDown}
            alt=""
            aria-hidden="true"
            className={`
              absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none
              transition-transform duration-200
              ${isStatusOpen ? "rotate-180" : ""}
            `}
          />

          {isStatusOpen && !updatingStatus && (
            <ul
              role="listbox"
              className="absolute z-50 w-full bg-primary rounded-b-lg overflow-hidden"
            >
              {statusOptions.map((option) => (
                <li
                  key={option.id}
                  role="option"
                  aria-selected={goal.status === option.id}
                  onClick={() =>
                    handleStatusChange(
                      option.id as "active" | "paused" | "completed",
                    )
                  }
                  className={`
                    px-4 py-3 cursor-pointer text-center
                    font-body text-base text-tertiary
                    ${goal.status === option.id ? "bg-primary/80 font-bold" : ""}
                    hover:bg-primary/70
                    transition-colors duration-150
                  `}
                >
                  {option.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

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
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("tasks")}
          className={`
            flex-1 py-3 px-4 font-body font-bold text-base transition-colors rounded-lg shadow-brand-glow
            ${activeTab === "tasks" ? "bg-brand text-tertiary" : "bg-white text-brand"}
          `}
        >
          Tareas
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("subgoals")}
          className={`
            flex-1 py-3 px-4 font-body font-bold text-base transition-colors rounded-lg shadow-brand-glow
            ${activeTab === "subgoals" ? "bg-brand text-tertiary" : "bg-white text-brand"}
          `}
        >
          Metas Asociadas
        </button>
      </div>

      {/* Contenido de Tabs */}
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
