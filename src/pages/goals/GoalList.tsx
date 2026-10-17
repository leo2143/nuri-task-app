import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ButtonLink, GoalCard } from "../../components/ui";
import type { IGoal, IGoalFilters, FilterValues, GoalStatus, GoalPriority } from "../../interfaces";
import { useFilterableList, useAuth } from "../../hooks";
import { goalService } from "../../services/goalService";
import FilterableList from "../../components/FilterableList";
import { goalFilterConfig } from "../../utils/goalFilterConfig";

const ITEMS_PER_PAGE = 5;
const FREE_GOALS_LIMIT = 2;

export default function GoalList() {
  const { isPremium } = useAuth();
  const [searchParams] = useSearchParams();

  const initialFilters = useMemo(() => {
    const filters: FilterValues = {};
    const dueDateFrom = searchParams.get("dueDateFrom");
    const dueDateTo = searchParams.get("dueDateTo");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    if (dueDateFrom) filters.dueDateFrom = dueDateFrom;
    if (dueDateTo) filters.dueDateTo = dueDateTo;
    if (status === "active" || status === "paused" || status === "completed") {
      filters.status = status as GoalStatus;
    }
    if (priority === "low" || priority === "medium" || priority === "high") {
      filters.priority = priority as GoalPriority;
    }

    return filters;
  }, [searchParams]);

  const filterableList = useFilterableList<IGoal, IGoalFilters>({
    fetchFn: goalService.getAllGoals,
    buildFilters: (searchTerm, pagination, activeFilters) => ({
      search: searchTerm || undefined,
      status: activeFilters?.status as IGoalFilters["status"],
      priority: activeFilters?.priority as IGoalFilters["priority"],
      dueDateFrom: activeFilters?.dueDateFrom as string | undefined,
      dueDateTo: activeFilters?.dueDateTo as string | undefined,
      limit: pagination?.limit,
      cursor: pagination?.cursor,
    }),
    pagination: { enabled: true, limit: ITEMS_PER_PAGE },
    initialFilters,
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
    <div className="flex flex-col gap-11 justify-center pt-6">
      <div className="flex flex-col gap-6 justify-center">
        <h2 className="font-heading font-bold text-tertiary">
          Mis Metas
        </h2>

        {reachedFreeLimit ? (
          <div className="flex flex-col gap-3 rounded-xl bg-brand/10 border border-brand/30 p-4 text-center">
            <p className="text-sm text-tertiary font-body">
              Llegaste al límite de <strong>{FREE_GOALS_LIMIT} metas</strong> del plan gratuito.
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
        filterConfig={goalFilterConfig}
        activeFilters={filterableList.activeFilters}
        onFiltersChange={filterableList.setActiveFilters}
      />
    </div>
  );
}
