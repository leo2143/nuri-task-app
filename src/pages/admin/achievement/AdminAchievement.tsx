import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Avatar, ButtonLink } from "../../../components/ui";
import { useFilterableList } from "../../../hooks";
import type { IAchievement, AchievementFilters, FilterConfig } from "../../../interfaces";
import { achievementService } from "../../../services/achievementService";
import FilterableList from "../../../components/FilterableList";

export default function AdminAchievement() {
  const achievementFilterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: "type",
        label: "Tipo",
        type: "chips",
        options: [
          { value: "task", label: "Tarea" },
          { value: "goal", label: "Meta" },
          { value: "metric", label: "Métrica" },
          { value: "streak", label: "Racha" },
        ],
      },
      { key: "isActive", label: "Activo", type: "toggle" },
    ],
    []
  );

  const filterableList = useFilterableList<IAchievement, AchievementFilters>({
    fetchFn: achievementService.getAllAchievements,
    buildFilters: (searchTerm, pagination, activeFilters) => ({
      search: searchTerm || undefined,
      type: activeFilters?.type as AchievementFilters["type"],
      isActive: activeFilters?.isActive as boolean | undefined,
      sortBy: "title",
      sortOrder: "asc",
      limit: pagination?.limit,
      cursor: pagination?.cursor,
    }),
    pagination: { enabled: true, limit: 5 },
  });

  const renderAchievementItem = (achievement: IAchievement) => (
    <div
      key={achievement._id}
      className="flex w-full gap-4 p-5 justify-between items-center rounded-lg bg-white shadow-brand-glow"
    >
      <div className="flex gap-5 items-center">
        <Avatar
          imageUrl={achievement.imageUrl}
          name={achievement.title}
          size="sm"
        />

        <div>
          <p className="text-tertiary font-semibold text-base">
            {achievement.title}
          </p>
          <p className="text-tertiary/70 text-sm line-clamp-1">
            {achievement.description}
          </p>
          <span className="text-tertiary/50 text-sm">
            Tipo: {achievement.type} • Meta: {achievement.targetCount} •{" "}
            {achievement.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>
      <Link
        to={`/admin/achievements/${achievement._id}`}
        className="text-primary font-bold hover:text-primary-light transition-colors"
      >
        Ver
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col gap-11 justify-center">
      <div className="flex flex-col gap-6 justify-center">
        <h2 className="font-heading font-bold text-tertiary">
          Logros del Sistema
        </h2>

        <ButtonLink
          to="/admin/achievements/new"
          variant="primary"
          fullWidth
          icon="add"
        >
          Crear Logro
        </ButtonLink>
      </div>

      <FilterableList
        {...filterableList}
        onSearchChange={filterableList.setSearchTerm}
        searchPlaceholder="Buscar logros"
        renderItem={renderAchievementItem}
        emptyStateName="Logros"
        filterConfig={achievementFilterConfig}
        activeFilters={filterableList.activeFilters}
        onFiltersChange={filterableList.setActiveFilters}
      />
    </div>
  );
}
