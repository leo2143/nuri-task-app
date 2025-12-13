import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, ButtonLink } from "../../../components/ui";
import { useFilterableList } from "../../../hooks";
import type { IAchievement, AchievementFilters } from "../../../interfaces";
import { achievementService } from "../../../services/achievementService";
import FilterableList from "../../../components/FilterableList";

export default function AdminAchievement() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const filterableList = useFilterableList<IAchievement, AchievementFilters>({
    fetchFn: achievementService.getAllAchievements,
    buildFilters: (searchTerm) =>
      searchTerm
        ? { search: searchTerm, sortBy: "title", sortOrder: "asc" }
        : { sortBy: "title", sortOrder: "asc" },
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
          size="md"
        />

        <div>
          <p className="text-tertiary font-semibold text-xl">
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
      />
    </div>
  );
}
