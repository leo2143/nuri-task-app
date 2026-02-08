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
import type { IAchievement } from "../../../interfaces";
import { achievementService } from "../../../services/achievementService";
import Loading from "../../../components/Loading";
import StateMessage from "../../../components/StateMessage";

export default function AdminAchievementDetail() {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: achievement,
    loading,
    errorMessage,
  } = useFetchById<IAchievement>({
    fetchFn: achievementService.getAchievementById,
  });

  const createdDate = useFormatDate(achievement?.createdAt);
  const updatedDate = useFormatDate(achievement?.updatedAt);

  const handleDeleteAchievement = async () => {
    if (!achievement?._id) {
      return;
    }

    setIsDeleting(true);

    try {
      await achievementService.deleteAchievement(achievement._id);

      // Redirigir a la lista después de eliminar
      navigate("/admin/achievements", {
        replace: true,
        state: { message: "Logro eliminado exitosamente" },
      });
    } catch (err) {
      console.error("Error al eliminar logro:", err);
      alert("Error al eliminar el logro. Por favor, intenta de nuevo.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };
  if (loading) {
    return <Loading />;
  }
  if (errorMessage) {
    return <StateMessage itemName="logro" variant="notFound" />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5 items-center justify-between">
        <h2>Datos del logro</h2>
        <div className="flex gap-2">
          <ButtonLink
            variant="secondary"
            icon="lapiz"
            to={`/admin/achievements/${achievement?._id}/edit`}
            size="ro"
            ariaLabel="Editar logro"
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
        <Avatar
          imageUrl={achievement?.imageUrl || ""}
          name={achievement?.title || "Logro"}
          size="lg"
        />

        <InfoCard
          items={[
            { label: "Título", value: achievement?.title },
            { label: "Descripción", value: achievement?.description },
            { label: "Tipo", value: achievement?.type },
            {
              label: "Meta/Objetivo",
              value: achievement?.targetCount.toString(),
            },
            {
              label: "Estado",
              value: achievement?.isActive ? "Activo" : "Inactivo",
            },
          ]}
        />

        <InfoCard
          items={[
            {
              label: "Fecha de creación",
              value: createdDate.formatted || "N/A",
            },
            {
              label: "Última actualización",
              value: updatedDate.formatted || "N/A",
            },
          ]}
        />
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAchievement}
        title="Cuidado"
        message="¿Estás seguro de que quieres eliminar este logro?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="warning"
        loading={isDeleting}
      />
    </div>
  );
}
