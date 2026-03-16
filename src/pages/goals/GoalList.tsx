import { ButtonLink, GoalCard } from "../../components/ui";
import type { IGoal, IGoalFilters } from "../../interfaces";
import { useFilterableList, useAuth } from "../../hooks";
import { goalService } from "../../services/goalService";
import FilterableList from "../../components/FilterableList";

const ITEMS_PER_PAGE = 5;
const FREE_GOALS_LIMIT = 2;

export default function GoalList() {
  const { isPremium } = useAuth();

  const filterableList = useFilterableList<IGoal, IGoalFilters>({
    fetchFn: goalService.getAllGoals,
    buildFilters: (searchTerm, pagination) => ({
      search: searchTerm || undefined,
      limit: pagination?.limit,
      cursor: pagination?.cursor,
    }),
    pagination: { enabled: true, limit: ITEMS_PER_PAGE },
  });

  const totalGoals = filterableList.data?.length ?? 0;
  const reachedFreeLimit = !isPremium && totalGoals >= FREE_GOALS_LIMIT;

  const renderGoalItem = (goal: IGoal) => (
    <GoalCard
      key={goal._id}
      id={goal._id}
      title={goal.title}
      description={goal.description}
      status={goal.status}
      progress={goal.progress}
    />
  );

  return (
    <div className="flex flex-col gap-11 justify-center">
      <div className="flex flex-col gap-6 justify-center">
        <h2 className="font-heading font-bold text-tertiary">
          Mis Metas
        </h2>

        {reachedFreeLimit ? (
          <div className="flex flex-col gap-3 rounded-xl bg-brand/10 border border-brand/30 p-4 text-center">
            <p className="text-sm text-tertiary font-body">
              Alcanzaste el limite de <strong>{FREE_GOALS_LIMIT} metas</strong> del plan gratuito.
            </p>
            <ButtonLink to="/subscription" variant="primary" fullWidth>
              Desbloquear metas ilimitadas
            </ButtonLink>
          </div>
        ) : (
          <ButtonLink
            to="/goals/new"
            variant="primary"
            fullWidth
            icon="add"
          >
            Agregar Nueva Meta
          </ButtonLink>
        )}
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
