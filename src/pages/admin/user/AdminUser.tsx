import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, ButtonLink } from "../../../components/ui";
import { useFilterableList } from "../../../hooks";
import type { IUser, UserFilters } from "../../../interfaces";
import { userService } from "../../../services/userService";
import FilterableList from "../../../components/FilterableList";

export default function AdminUser() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const filterableList = useFilterableList<IUser, UserFilters>({
    fetchFn: userService.getAllUsers,
    buildFilters: (searchTerm, pagination) => ({
      search: searchTerm || undefined,
      limit: pagination?.limit,
      cursor: pagination?.cursor,
    }),
    pagination: { enabled: true, limit: 5 },
  });

  const renderUserItem = (user: IUser) => (
    <div
      key={user._id}
      className="flex w-full flex-wrap gap-4 p-5 justify-between items-center rounded-lg bg-white shadow-brand-glow"
    >
      <div className="flex gap-5 items-center">
        <Avatar imageUrl={user?.profileImageUrl} name={user?.name} size="sm" />

        <div>
          <p className="flex text-tertiary font-semibold text-base">
            {user.name}
          </p>
          <p className="flex text-tertiary/70 text-sm">{user.email}</p>
          <span className="text-tertiary/50 text-sm">
            {user.isAdmin ? "Admin" : "Usuario"} • Suscripto:{" "}
            {user.subscription?.isActive ? "Si" : "No"}
          </span>
        </div>
      </div>
      <Link
        to={`/admin/users/${user._id}`}
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
          Usuarios Registrados
        </h2>

        <ButtonLink
          to="/admin/users/new"
          variant="primary"
          fullWidth
          icon="add"
        >
          Crear Usuario
        </ButtonLink>
      </div>

      <FilterableList
        {...filterableList}
        onSearchChange={filterableList.setSearchTerm}
        searchPlaceholder="Buscar usuario"
        renderItem={renderUserItem}
        emptyStateName="Usuarios"
      />
    </div>
  );
}
