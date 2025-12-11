import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  ButtonLink,
  EmptyState,
  InputFilter,
} from "../../../components/ui";
import { useFetchList } from "../../../hooks";
import type { IUser } from "../../../interfaces";
import { userService } from "../../../services/userService";
import Loading from "../../../components/Loading";

export default function AdminUser() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const {
    data: users,
    loading,
    errorMessage,
    isEmpty,
  } = useFetchList<IUser>({
    fetchFn: userService.getAllUsers,
  });

  if (loading) {
    return <Loading />;
  }

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

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-body text-red-600">{errorMessage}</p>
          </div>
        )}

        <ButtonLink
          to="/admin/users/new"
          variant="primary"
          fullWidth
          icon="add"
        >
          Crear Usuario
        </ButtonLink>
      </div>
      {!isEmpty ? (
        <div className="flex flex-col gap-4">
          <InputFilter id="filter" name="filtro" />
          {users.map((user) => (
            <div
              key={user._id}
              className="flex w-full gap-4 p-5 justify-between items-center rounded-lg bg-white  shadow-brand-glow"
            >
              <div className="flex gap-5 items-center">
                <Avatar imageUrl={user?.imageUrl} name={user?.name} size="sm" />

                <div>
                  <p className="text-tertiary font-semibold text-xl">
                    {user.name}
                  </p>
                  <p className="text-tertiary/70 text-sm">{user.email}</p>
                  <span className="text-tertiary/50 text-sm">
                    {user.isAdmin ? "Admin" : "Usuario"} • Suscripto: No
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
          ))}
        </div>
      ) : (
        <EmptyState itemName="Usuarios" />
      )}
    </div>
  );
}
