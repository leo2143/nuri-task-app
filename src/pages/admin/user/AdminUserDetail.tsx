import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  ButtonLink,
  ConfirmModal,
  InfoCard,
} from "../../../components/ui";
import { useFetchById, useFormatDate } from "../../../hooks";
import type { IUser } from "../../../interfaces";
import { userService } from "../../../services/userService";
import Loading from "../../../components/Loading";
import StateMessage from "../../../components/StateMessage";

export default function AdminUserDetail() {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
  console.log(user);
  const createdDate = useFormatDate(user?.createdAt);
  const subscriptionEndDate = useFormatDate(user?.subscription?.endDate);
  const subscriptionDueDate = useFormatDate(user?.subscription?.startDate);

  const handleDeleteUser = async () => {
    if (!user?._id) {
      return;
    }

    setIsDeleting(true);

    try {
      await userService.deleteUser(user._id);

      // Redirigir a la lista después de eliminar
      navigate("/admin/users", {
        replace: true,
        state: { message: "Usuario eliminado exitosamente" },
      });
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("Error al eliminar el usuario. Por favor, intenta de nuevo.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };
  if (loading) {
    return <Loading />;
  }
  if (errorMessage) {
    return <StateMessage itemName="usuario" variant="notFound" />;
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
            to={`/admin/users/${user?._id}/edit`}
            size="ro"
            ariaLabel="Editar usuario"
          >
            {""}
          </ButtonLink>

          <Button
            variant="danger"
            icon="trash"
            size="ro"
            onClick={() => setIsDeleteModalOpen(true)}
          ></Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-5">
        <Avatar imageUrl={user?.profileImageUrl} name={user?.name} size="lg" />
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
              value: user?.subscription?.isActive
                ? "Suscripción activa"
                : "Sin suscripción",
            },
            ...(user?.subscription?.isActive
              ? [
                  {
                    label: "Fecha de inicio",
                    value: subscriptionDueDate.formatted,
                  },
                  {
                    label: "Fecha de vencimiento",
                    value: subscriptionEndDate.formatted,
                  },
                ]
              : []),
          ]}
        />
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Cuidado"
        message="¿Estás seguro de que quieres eliminar el usuario?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="warning"
        loading={isDeleting}
      />
    </div>
  );
}
