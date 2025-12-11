import { useNavigate } from "react-router-dom";
import { Avatar, Button, ButtonLink, InfoCard } from "../../../components/ui";
import { useFetchById, useFormatDate } from "../../../hooks";
import type { IUser } from "../../../interfaces";
import { userService } from "../../../services/userService";
import Loading from "../../../components/Loading";

export default function AdminUserDetail() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const {
    data: user,
    loading,
    errorMessage,
  } = useFetchById<IUser>({
    fetchFn: userService.getUserById,
  });

  const createdDate = useFormatDate(user?.createdAt);
  const suscriptionEndDate = useFormatDate(user?.suscription?.endDate);
  const suscriptionDueDate = useFormatDate(user?.suscription?.startDate);

  if (loading) {
    return <Loading />;
  }
  if (errorMessage) {
    return (
      <div>Lo siento, no encontramos el usuario con el id especificado</div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
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
      <div className="flex gap-5 items-center justify-between">
        <h2 className="text-2xl">Datos del usuario</h2>
        <div className="flex gap-2">
          <ButtonLink
            variant="secondary"
            icon="lapiz"
            to=""
            size="ro"
          ></ButtonLink>

          <Button variant="danger" icon="trash" size="ro"></Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-5">
        <Avatar imageUrl={user?.imageUrl} name={user?.name} size="md" />
        <InfoCard
          items={[
            {
              label: "Fecha de ingreso",
              value: createdDate.formatted || "22/02/2025",
            },
            { label: "Nombre", value: user?.name },
            { label: "Correo electrónico", value: user?.email },
            {
              label: "Rol",
              value: user?.isAdmin ? "Administrador" : "Usuario",
            },
          ]}
        />

        <InfoCard
          items={[
            {
              label: "Estado de suscripción",
              value: user?.suscription?.isActive
                ? "Suscripción activa"
                : "Sin suscripción",
            },
            ...(user?.suscription?.isActive
              ? [
                  {
                    label: "Fecha de inicio",
                    value: suscriptionDueDate.formatted,
                  },
                  {
                    label: "Fecha de vencimiento",
                    value: suscriptionEndDate.formatted,
                  },
                ]
              : []),
          ]}
        />
      </div>
    </div>
  );
}
