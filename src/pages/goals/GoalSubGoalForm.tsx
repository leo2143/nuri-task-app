import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import { Select, Button, ConfirmModal, GoalCard } from "../../components/ui";
import type { IGoal, IGoalCatalog, IAddSubGoal } from "../../interfaces";
import { useHttpError, useUnsavedChanges } from "../../hooks";
import { goalService } from "../../services/goalService";
import { arrowsUpDown } from "../../assets/svg-icons";

export default function GoalSubGoalForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { handleError, clearError } = useHttpError();
  const [loading, setLoading] = useState(false);
  const [goalCatalogs, setGoalCatalogs] = useState<IGoalCatalog[]>([]);

  // Estados para modales
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const pageTitle = "Asociar Metas";

  const [goalId, setGoalId] = useState("");
  const [parentGoal, setParentGoal] = useState<IGoal | null>(null);

  // Valores iniciales para detectar cambios
  const initialValues = useMemo(() => ({
    goalId: "",
  }), []);

  // Valores actuales del formulario
  const currentValues = useMemo(() => ({
    goalId,
  }), [goalId]);

  // Hook para detectar cambios sin guardar
  const {
    isBlocked,
    handleConfirmNavigation,
    handleCancelNavigation,
    markAsSaved,
  } = useUnsavedChanges({
    initialValues,
    currentValues,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        clearError();

        const [parentGoalData, catalogData] = await Promise.all([
          id ? goalService.getGoalById(id) : Promise.resolve(null),
          goalService.getCatalogGoals(),
        ]);

        if (parentGoalData) {
          setParentGoal(parentGoalData);
        }

        const filteredData = id ? catalogData.filter((goal) => goal.id !== id) : catalogData;
        setGoalCatalogs(filteredData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handlers para modales
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate(`/goals/${id}`);
  };

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!goalId) {
      setModalMessage("Debes seleccionar una meta para asociar");
      setIsErrorModalOpen(true);
      return;
    }

    try {
      setLoading(true);

      // Crear el body con el id de la submeta
      const body: IAddSubGoal = {
        subgoalId: goalId!,
      };

      await goalService.addSubgoal(id!, body);

      markAsSaved();
      setModalMessage("¡Metas asociadas exitosamente!");
      setIsSuccessModalOpen(true);
    } catch (err) {
      handleError(err);
      setModalMessage("Error al asociar las metas. Por favor, intenta de nuevo.");
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="font-heading font-bold text-tertiary mb-2">
          {pageTitle}
        </h2>

        {parentGoal && (
          <GoalCard
            id={parentGoal._id}
            title={parentGoal.title}
            status={parentGoal.status}
          />
        )}
      </div>

      <div className="flex justify-center py-5">
        <img src={arrowsUpDown} alt="flechas arriba abajo" />
      </div>

      <form onSubmit={handleSubmit} noValidate method="post">
        <div>
          <Select
            id="goalId"
            name="goalId"
            label="Elegí la meta que querés asociar"
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            options={goalCatalogs}
            placeholder="Sin meta asociada"
            disabled={loading}
          />
        </div>

        <Button
          className="mt-8"
          fullWidth
          variant="primary"
          type="submit"
          ariaLabel="Asociar"
        >
          Asociar
        </Button>
      </form>

      {/* Modal de confirmación de navegación (cambios sin guardar) */}
      <ConfirmModal
        isOpen={isBlocked}
        onClose={handleCancelNavigation}
        onConfirm={handleConfirmNavigation}
        title="Cambios sin guardar"
        message="Tienes cambios sin guardar. Si sales, se perderán. ¿Deseas continuar?"
        confirmText="Salir"
        cancelText="Quedarse"
        variant="warning"
        loading={false}
      />

      {/* Modal de éxito */}
      <ConfirmModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        onConfirm={handleSuccessModalClose}
        title="¡Éxito!"
        message={modalMessage}
        confirmText="Aceptar"
        cancelText=""
        variant="success"
        loading={false}
      />

      {/* Modal de error */}
      <ConfirmModal
        isOpen={isErrorModalOpen}
        onClose={handleErrorModalClose}
        onConfirm={handleErrorModalClose}
        title="Error"
        message={modalMessage}
        confirmText="Aceptar"
        cancelText=""
        variant="danger"
        loading={false}
      />
    </section>
  );
}
