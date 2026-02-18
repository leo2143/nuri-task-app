import { ButtonLink, GoalCard } from "../../components/ui";
import type { IGoal, IGoalFilters } from "../../interfaces";
import { useFilterableList } from "../../hooks";
import { goalService } from "../../services/goalService";
import FilterableList from "../../components/FilterableList";

const ITEMS_PER_PAGE = 5;

export default function GoalList() {
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
