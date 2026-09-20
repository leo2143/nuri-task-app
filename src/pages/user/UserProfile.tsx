import { useState } from "react";
import { Button, ButtonLink, InfoCard, Input, ToggleSwitch } from "../../components/ui";
import { ImageUploadSlot } from "../../components/ImageUploadSlot";
import { useAppNavigate, useAuth, useFetchData, useFormatDate, useCloudinaryUpload, useNotifications } from "../../hooks";
import { userService } from "../../services/userService";
import { subscriptionService } from "../../services/subscriptionService";
import type { IUserProfile } from "../../interfaces";
import Loading from "../../components/Loading";
import { validatePassword, validateConfirmPassword } from "../../utils/validations";

export default function UserProfile() {
  const navigate = useAppNavigate();
  const { logout, refreshSubscription } = useAuth();
  const { upload, isUploading } = useCloudinaryUpload();
  const { isSupported, permission, isSubscribed, isLoading: pushLoading, subscribe, unsubscribe } = useNotifications();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { data: user, loading, refetch } = useFetchData<IUserProfile>({
    fetchFn: userService.getProfile,
  });

  const subscriptionStartDate = useFormatDate(user?.subscription?.startDate);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCancelSubscription = async () => {
    try {
      setIsCancelling(true);
      await subscriptionService.cancel();
      await refreshSubscription();
      await refetch();
    } catch (error) {
      console.error("Error al cancelar suscripcion:", error);
    } finally {
      setIsCancelling(false);
    }
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
            variant="avatar"
            className="w-24 h-24 rounded-full"
          />

          <InfoCard
            items={[
              { label: "Nombre", value: user.name },
              { label: "Correo electrónico", value: user.email },
            ]}
          />

          {isSupported && (
            <article className="w-full bg-white rounded-lg p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading font-bold text-tertiary text-sm">
                    Notificaciones
                  </h3>
                  <p className="font-body text-xs text-gray-500 mt-1">
                    {permission === "denied"
                      ? "Bloqueadas en el navegador. Habilitá las notificaciones desde la configuración del sitio."
                      : isSubscribed
                        ? "Recibirás alertas al completar tareas, metas y logros."
                        : "Activá para recibir alertas de tareas y logros."}
                  </p>
                </div>
                <ToggleSwitch
                  checked={isSubscribed}
                  onChange={isSubscribed ? unsubscribe : subscribe}
                  disabled={pushLoading || permission === "denied"}
                  ariaLabel="Activar notificaciones push"
                />
              </div>
            </article>
          )}

          {hasActiveSubscription ? (
            <>
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
                    label: "Renovación",
                    value: "Automática mensual",
                  },
                ]}
              />
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={handleCancelSubscription}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelando..." : "Cancelar suscripción"}
              </Button>
            </>
          ) : (
            <article className="w-full bg-brand/15 rounded-xl p-6 text-center">
              <h3 className="text-lg font-heading font-semibold text-tertiary mb-2">
                ¡Desbloquea todo el potencial!
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                Suscríbete para acceder a funciones premium y llevar tu
                productividad al siguiente nivel.
              </p>
              <ButtonLink to="/subscription" variant="primary">
                Suscribirme ahora
              </ButtonLink>
            </article>
          )}

          {user.googleId && !user.hasPassword && (
            <SetPasswordSection onSuccess={refetch} />
          )}

          <div className="w-full max-w-md">
            <Button
              type="button"
              variant="outline"
              fullWidth
              className="font-black"
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

function SetPasswordSection({ onSuccess }: { onSuccess: () => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmError("");
    setErrorMessage("");

    const passErr = validatePassword(newPassword);
    const confirmErr = validateConfirmPassword(newPassword, confirmPassword);
    if (passErr) { setPasswordError(passErr); return; }
    if (confirmErr) { setConfirmError(confirmErr); return; }

    setLoading(true);
    try {
      const result = await userService.setPassword(newPassword);
      setSuccessMessage(result.message);
      setNewPassword("");
      setConfirmPassword("");
      onSuccess();
    } catch {
      setErrorMessage("No pudimos establecer la contraseña, intentá de nuevo");
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <article className="w-full bg-primary/10 rounded-xl p-5 border border-primary/30">
        <p className="text-sm font-body font-semibold text-primary text-center">
          {successMessage}
        </p>
      </article>
    );
  }

  return (
    <article className="w-full bg-white rounded-xl p-5 shadow border border-neutral">
      <h3 className="font-heading font-semibold text-tertiary text-sm mb-3">
        Agregar contraseña
      </h3>
      <p className="font-body text-xs text-gray-500 mb-4">
        Tu cuenta usa Google. Agregá una contraseña para también poder iniciar sesión con email.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          id="set-new-password"
          name="newPassword"
          type="password"
          label="Nueva contraseña"
          placeholder="Mínimo 5 caracteres"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={passwordError}
          helperText="Mínimo 5 caracteres"
        />
        <Input
          id="set-confirm-password"
          name="confirmPassword"
          type="password"
          label="Confirmar contraseña"
          placeholder="Repetí la contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={confirmError}
        />
        {errorMessage && (
          <p className="text-xs text-red-500 font-body">{errorMessage}</p>
        )}
        <Button type="submit" variant="primary" fullWidth loading={loading} disabled={loading}>
          Guardar contraseña
        </Button>
      </form>
    </article>
  );
}
