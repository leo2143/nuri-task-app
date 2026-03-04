import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ButtonLink, InfoCard } from "../../components/ui";
import { ImageUploadSlot } from "../../components/ImageUploadSlot";
import { useAuth, useFetchData, useFormatDate, useCloudinaryUpload, useNotifications } from "../../hooks";
import { userService } from "../../services/userService";
import type { IUserProfile } from "../../interfaces";
import Loading from "../../components/Loading";

export default function UserProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { upload, isUploading } = useCloudinaryUpload();
  const { isSupported, permission, isSubscribed, isLoading: pushLoading, subscribe, unsubscribe } = useNotifications();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: user, loading, refetch } = useFetchData<IUserProfile>({
    fetchFn: userService.getProfile,
  });

  const subscriptionStartDate = useFormatDate(user?.subscription?.startDate);
  const subscriptionEndDate = useFormatDate(user?.subscription?.endDate);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUpdating(true);
      const result = await upload(file);
      if (result?.secure_url) {
        await userService.updateProfileImage(result.secure_url);
        await refetch();
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageRemove = async () => {
    try {
      setIsUpdating(true);
      await userService.updateProfileImage("");
      await refetch();
    } catch (error) {
      console.error("Error removing profile image:", error);
    } finally {
      setIsUpdating(false);
    }
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
      <div className="flex flex-col gap-8">
        <div className="flex gap-5 items-center justify-between">
          <h2 className="font-heading">Tus Datos</h2>
        </div>

        <div className="flex flex-col items-center gap-5">
          <ImageUploadSlot
            imageUrl={user.profileImageUrl ?? undefined}
            imageAlt={`Foto de perfil de ${user.name}`}
            onImageSelect={handleImageUpload}
            onImageEdit={handleImageUpload}
            onImageRemove={handleImageRemove}
            isUploading={isUploading || isUpdating}
            className="w-24 h-24 rounded-full"
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

          {isSupported && (
            <article className="w-full bg-white rounded-xl p-5 shadow border border-neutral">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-tertiary text-sm">
                    Notificaciones push
                  </h3>
                  <p className="font-body text-xs text-gray-500 mt-1">
                    {permission === "denied"
                      ? "Bloqueadas en el navegador. Habilitá las notificaciones desde la configuración del sitio."
                      : isSubscribed
                        ? "Recibirás alertas al completar tareas, metas y logros."
                        : "Activá para recibir alertas de tareas y logros."}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={pushLoading || permission === "denied"}
                  onClick={isSubscribed ? unsubscribe : subscribe}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${isSubscribed ? "bg-primary" : "bg-gray-300"}`}
                  role="switch"
                  aria-checked={isSubscribed}
                  aria-label="Activar notificaciones push"
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isSubscribed ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
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
