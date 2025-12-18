import { useNavigate } from "react-router-dom";
import { Avatar, Button, ButtonLink, InfoCard } from "../../components/ui";
import { useAuth, useFetchData, useFormatDate } from "../../hooks";
import { userService } from "../../services/userService";
import type { IUserProfile } from "../../interfaces";
import Loading from "../../components/Loading";

export default function UserProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Obtener perfil del usuario autenticado
  const { data: user, loading } = useFetchData<IUserProfile>({
    fetchFn: userService.getProfile,
  });

  const subscriptionStartDate = useFormatDate(user?.subscription?.startDate);
  const subscriptionEndDate = useFormatDate(user?.subscription?.endDate);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const hasActiveSubscription = user.subscription?.isActive;

  return (
    <section className="flex flex-col gap-5">
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
      <div className="flex flex-col gap-8">
        <div className="flex gap-5 items-center justify-between">
          <h2 className="text-2xl font-heading">Tus Datos</h2>
        </div>

        <div className="flex flex-col items-center gap-5">
          <Avatar
            imageUrl={user.profileImageUrl ?? undefined}
            name={user.name}
            size="lg"
          />

          <InfoCard
            items={[
              { label: "Nombre", value: user.name },
              { label: "Correo electrónico", value: user.email },
            ]}
          />

          {hasActiveSubscription ? (
            <InfoCard
              items={[
                {
                  label: "Estado de suscripción",
                  value: "Activa",
                },
                {
                  label: "Fecha de inicio",
                  value: subscriptionStartDate.formatted || "—",
                },
                {
                  label: "Fecha de vencimiento",
                  value: subscriptionEndDate.formatted || "—",
                },
              ]}
            />
          ) : (
            <article className="w-full bg-gradient-to-r from-brand/20 to-primary/20 rounded-xl p-6 text-center">
              <h3 className="text-lg font-heading font-semibold text-tertiary mb-2">
                ¡Desbloquea todo el potencial!
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                Suscríbete para acceder a funciones premium y llevar tu
                productividad al siguiente nivel.
              </p>
              <ButtonLink to="/" variant="primary">
                Suscribirme ahora
              </ButtonLink>
            </article>
          )}

          <div className="w-full max-w-md">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
