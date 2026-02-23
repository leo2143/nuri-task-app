import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { nuriCorazonCortado } from "../assets/ilustrations";
import { GoalCard, TaskCard, ButtonLink, Spinner } from "../components/ui";
import TabGroup from "../components/ui/TabGroup";
import { goalService } from "../services/goalService";
import { todoservice } from "../services/todoService";
import { useAuth } from "../hooks";
import type { IGoal, ITodo } from "../interfaces";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("goals");

  // Estado para metas
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);

  // Estado para tareas recientes
  const [recentTasks, setRecentTasks] = useState<ITodo[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [localTaskStates, setLocalTaskStates] = useState<Record<string, boolean>>({});

  // Fetch metas (max 5)
  useEffect(() => {
    if (activeTab !== "goals") return;
    const fetchGoals = async () => {
      setLoadingGoals(true);
      try {
        const response = await goalService.getAllGoals({ limit: 5, sortOrder: "desc" });
        setGoals(response.data || []);
      } catch {
        setGoals([]);
      } finally {
        setLoadingGoals(false);
      }
    };
    fetchGoals();
  }, [activeTab]);

  // Fetch tareas recientes (ultimos 30 dias)
  useEffect(() => {
    if (activeTab !== "tasks") return;
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const response = await todoservice.gettodos({ limit: 10, sortOrder: "desc" });
        setRecentTasks(response.data || []);
        setLocalTaskStates({});
      } catch {
        setRecentTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, [activeTab]);

  // Filtrar tareas de los ultimos 30 dias
  const filteredRecentTasks = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return recentTasks.filter((task) => {
      const createdAt = task.createdAt ? new Date(task.createdAt) : null;
      return createdAt && createdAt >= thirtyDaysAgo;
    });
  }, [recentTasks]);

  // Toggle completado con optimistic update
  const handleToggleComplete = useCallback(
    async (taskId: string, currentCompleted: boolean) => {
      setLocalTaskStates((prev) => ({ ...prev, [taskId]: !currentCompleted }));
      try {
        await todoservice.updateTodoState(taskId, !currentCompleted);
      } catch {
        setLocalTaskStates((prev) => ({ ...prev, [taskId]: currentCompleted }));
      }
    },
    [],
  );

  const getTaskCompleted = (task: ITodo): boolean =>
    localTaskStates[task._id!] ?? task.completed;

  return (
    <section className="max-w-4xl mx-auto py-12 flex flex-col gap-8">
      <div className=" home-trama-bg w-full  border rounded-lg bg-white overflow-hidden shadow-brand-glow relative">
        <div className="flex justify-center gap-4 relative z-10">
          <div className="flex flex-col justify-center">
            <h2 className="font-bold text-2xl font-body text-tertiary leading-tight">
              {user?.name ?? ""},
            </h2>
            <h2 className="font-bold text-2xl font-body text-tertiary leading-tight">
              ¡Tú Puedes!
            </h2>
          </div>
          <img className="relative top-2 h-36 w-auto" src={nuriCorazonCortado} alt="nuri con corazon en la mano" />
        </div>
        <div
          className="absolute bottom-0 left-0 w-full max-h-[50px] home-trama-bg"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-5">
        <TabGroup
          tabs={[
            { id: "goals", label: "Metas" },
            { id: "tasks", label: "Tareas" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "goals" && (
          <div className="flex flex-col gap-4">
            {loadingGoals ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : goals.length > 0 ? (
              goals.map((goal) => (
                <GoalCard
                  key={goal._id}
                  id={goal._id}
                  title={goal.title}
                  description={goal.description}
                  status={goal.status}
                  progress={goal.progress}
                />
              ))
            ) : (
              <p className="text-center text-tertiary/60 font-body py-8">
                No tienes metas aún
              </p>
            )}
            <ButtonLink to="/goals" variant="primary" fullWidth>
              Ver todas las metas
            </ButtonLink>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-6 items-stretch justify-center">
              <Link to="/tasks" className="flex-1 py-20 rounded-lg bg-primary text-white font-heading font-bold text-center">
                Lista de Tareas
              </Link>
              <Link to="/tasks?completed=true" className="flex-1 py-20 rounded-lg bg-secondary text-white font-heading font-bold text-center">
                Tareas Finalizadas
              </Link>
            </div>

            <h3 className="font-heading font-bold text-tertiary">
              Agregadas Recientemente
            </h3>

            {loadingTasks ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : filteredRecentTasks.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filteredRecentTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    id={task._id}
                    title={task.title}
                    goalTitle={task.goalTitle}
                    completed={getTaskCompleted(task)}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-tertiary/60 font-body py-8">
                No hay tareas recientes
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
