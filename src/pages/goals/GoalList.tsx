import { Link, useNavigate } from "react-router-dom";
import { Button, ButtonLink, ProgressBar } from "../../components/ui";
import type { IGoal, IGoalFilters } from "../../interfaces";
import { useFilterableList } from "../../hooks";
import { goalService } from "../../services/goalService";
import FilterableList from "../../components/FilterableList";

const ITEMS_PER_PAGE = 5;

export default function GoalList() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const filterableList = useFilterableList<IGoal, IGoalFilters>({
    fetchFn: goalService.getAllGoals,
    buildFilters: (searchTerm, pagination) => ({
      search: searchTerm || undefined,
      limit: pagination?.limit,
      cursor: pagination?.cursor,
    }),
    pagination: { enabled: true, limit: ITEMS_PER_PAGE },
  });

  const renderGoalItem = (goal: IGoal) => (
    <Link key={goal._id} to={`/goals/${goal._id}`}>
      <div className="block bg-white p-5 rounded-lg shadow-brand-glow">
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
        <ProgressBar progress={goal.progress} label="" height="sm" />
      </div>
    </Link>
  );

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
          Mis Metas
        </h2>

        <ButtonLink
          to="/goals/new"
          variant="primary"
          fullWidth
          icon="add"
        >
          Agregar Nueva Meta
        </ButtonLink>
      </div>

      <FilterableList
        {...filterableList}
        onSearchChange={filterableList.setSearchTerm}
        searchPlaceholder="Buscar meta..."
        renderItem={renderGoalItem}
        emptyStateName="Metas"
        loadMoreText="Cargar más metas"
        loadingMoreText="Cargando más metas..."
      />
    </div>
  );
}
