import { Link } from "react-router-dom";
import { ButtonLink, ProgressBar } from "../../components/ui";
import type { IGoal } from "../../interfaces";
import { useFetchList } from "../../hooks";
import { goalService } from "../../services/goalService";
import Loading from "../../components/Loading";
import StateMessage from "../../components/StateMessage";

export default function GoalList() {
  const {
    data: goals,
    loading,
    errorMessage,
    isEmpty,
  } = useFetchList<IGoal>({
    fetchFn: goalService.getAllGoals,
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-tertiary mb-2">
          Mis Metas
        </h2>
        <p className="font-body text-tertiary">
          Gestiona tus metas y objetivos para alcanzar el éxito
        </p>
      </div>

      <div className="mb-6">
        <ButtonLink to="/goals/new" variant="primary" size="md">
          Agregar Nueva Meta
        </ButtonLink>
      </div>

      <section>
        <h3 className="text-xl font-heading font-bold text-tertiary mb-4">
          Lista de Metas
        </h3>

        {errorMessage ? (
          <StateMessage itemName="las metas" variant="error" />
        ) : !isEmpty ? (
          <ul className="space-y-3">
            {goals.map((goal) => (
              <li key={goal._id}>
                <Link to={`/goals/${goal._id}`}>
                  <div className="block bg-gray-100 p-4 rounded-lg shadow-lg shadow-tertiary-dark-500/50 border border-gray-100 hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-body font-semibold text-tertiary">
                        {goal.title}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          goal.status === "active"
                            ? "bg-greenCheap-light text-greenCheap-dark"
                            : goal.status === "paused"
                              ? "bg-yellowCheap text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {goal.status === "active"
                          ? "Activa"
                          : goal.status === "paused"
                            ? "Pausada"
                            : "Completada"}
                      </span>
                    </div>
                    {goal.description && (
                      <p className="mb-3 text-sm text-tertiary opacity-75">
                        {goal.description}
                      </p>
                    )}
                    <ProgressBar
                      progress={goal.progress}
                      label=""
                      height="sm"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <StateMessage itemName="Metas" variant="notFoundList" />
        )}
      </section>
    </section>
  );
}
