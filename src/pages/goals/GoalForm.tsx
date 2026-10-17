import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import {
  Button,
  Input,
  Select,
  TextArea,
  ConfirmModal,
  GoalCard,
} from "../../components/ui";
import type {
  ICreateGoal,
  IGoal,
  GoalStatus,
  GoalPriority,
  IUpdateGoal,
} from "../../interfaces";
import { useAppNavigate, useHttpError, useUnsavedChanges } from "../../hooks";
import { goalService } from "../../services/goalService";
import { validateMinLength } from "../../utils/validations";
import Loading from "../../components/Loading";

export default function GoalForm() {
  const navigate = useAppNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { handleError, clearError } = useHttpError();
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState<IGoal | null>(null);
  const [parentGoal, setParentGoal] = useState<IGoal | null>(null);
  const isEditMode = !!id;
  const parentGoalId = !isEditMode ? searchParams.get("parentGoalId") : null;

  // Estados para modales
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const pageTitle = isEditMode
    ? "Editar tu meta"
    : parentGoalId
      ? "Crea una meta asociada"
      : "Crea tu meta";

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<GoalStatus>("active");
  const [priority, setPriority] = useState<GoalPriority>("medium");
  const [dueDate, setDueDate] = useState("");

  // Valores iniciales para detectar cambios
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    reason: "",
    status: "active" as GoalStatus,
    priority: "medium" as GoalPriority,
    dueDate: "",
  });

  // Valores actuales del formulario
  const currentValues = useMemo(
    () => ({
      title,
      description,
      reason,
      status,
      priority,
      dueDate,
    }),
    [title, description, reason, status, priority, dueDate]
  );

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

  // Estados de errores de campos
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [dueDateError, setDueDateError] = useState("");

  // Opciones para los selects
  const statusOptions = [
    { id: "active", title: "Activa" },
    { id: "paused", title: "Pausada" },
  ];

  const priorityOptions = [
    { id: "low", title: "Baja" },
    { id: "medium", title: "Media" },
    { id: "high", title: "Alta" },
  ];

  useEffect(() => {
    if (!isEditMode) return;

    let cancelled = false;
    const fetchGoalDetail = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await goalService.getGoalById(id!);

        if (cancelled) return;
        if (data) {
          setGoal(data);
          setTitle(data.title);
          setDescription(data.description || "");
          setReason(data.reason || "");
          setStatus(data.status);
          setPriority(data.priority);

          let formattedDate = "";
          if (data.dueDate) {
            const date = new Date(data.dueDate);
            formattedDate = date.toISOString().split("T")[0];
            setDueDate(formattedDate);
          }

          setInitialValues({
            title: data.title,
            description: data.description || "",
            reason: data.reason || "",
            status: data.status,
            priority: data.priority,
            dueDate: formattedDate,
          });
        }
      } catch (err) {
        if (cancelled) return;
        handleError(err);
        setModalMessage("No pudimos cargar la meta, intentá de nuevo");
        setIsErrorModalOpen(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetchGoalDetail();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (isEditMode || !parentGoalId) return;

    let cancelled = false;
    const fetchParentGoal = async () => {
      try {
        const data = await goalService.getGoalById(parentGoalId);
        if (!cancelled && data) setParentGoal(data);
      } catch (error) {
        if (!cancelled) {
          console.error("Error al cargar la meta padre:", error);
        }
      }
    };

    void fetchParentGoal();
    return () => {
      cancelled = true;
    };
  }, [isEditMode, parentGoalId]);

  // Validaciones
  const handleTitleBlur = () => {
    const minError = validateMinLength(title, 3, "El nombre de tu meta");
    if (minError) {
      setTitleError(minError);
      return;
    }
    if (title.length > 50) {
      setTitleError("El nombre no puede superar los 50 caracteres");
      return;
    }
    if (!title.trim()) {
      setTitleError("Dale un nombre a tu meta");
      return;
    }
    setTitleError("");
  };

  const handleDescriptionBlur = () => {
    if (description.length > 100) {
      setDescriptionError("La descripción no puede superar los 100 caracteres");
      return;
    }
    setDescriptionError("");
  };

  const handleReasonBlur = () => {
    if (reason.length > 50) {
      setReasonError("Este campo no puede superar los 50 caracteres");
      return;
    }
    setReasonError("");
  };

  const handleDueDateBlur = () => {
    if (!dueDate) {
      setDueDateError("Elegí una fecha para tu meta");
      return;
    }
    setDueDateError("");
  };

  // Handlers para modales
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate(parentGoalId ? `/goals/${parentGoalId}` : "/goals");
  };

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
  };

  // Valida todos los campos del formulario
  const validateAllFields = (): boolean => {
    setTitleError("");
    setDescriptionError("");
    setReasonError("");
    setDueDateError("");

    if (!title.trim()) {
      setTitleError("Dale un nombre a tu meta");
      return false;
    }
    const minError = validateMinLength(title, 3, "El nombre de tu meta");
    if (minError) {
      setTitleError(minError);
      return false;
    }
    if (title.length > 50) {
      setTitleError("El nombre no puede superar los 50 caracteres");
      return false;
    }

    if (description.length > 100) {
      setDescriptionError("La descripción no puede superar los 100 caracteres");
      return false;
    }

    if (reason.length > 50) {
      setReasonError("Este campo no puede superar los 50 caracteres");
      return false;
    }

    if (!dueDate) {
      setDueDateError("Elegí una fecha para tu meta");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!validateAllFields()) {
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        const updateData: IUpdateGoal = {
          title: title.trim(),
          description: description.trim() || undefined,
          reason: reason.trim() || undefined,
          priority,
          dueDate: dueDate ? `${dueDate}T12:00:00.000Z` : undefined,
        };
        if (goal?.status !== "completed") {
          updateData.status = status;
        }
        await goalService.updateGoal(id!, updateData);
        setModalMessage("¡Meta actualizada exitosamente!");
      } else {
        // En creación NO enviamos status (se establece automáticamente)
        const createData: ICreateGoal = {
          title: title.trim(),
          description: description.trim() || undefined,
          reason: reason.trim() || undefined,
          priority,
          dueDate: dueDate ? `${dueDate}T12:00:00.000Z` : undefined,
          ...(parentGoalId ? { parentGoalId } : {}),
        };
        await goalService.createGoal(createData);
        setModalMessage("¡Meta creada exitosamente!");

        // Limpiar formulario
        setTitle("");
        setDescription("");
        setReason("");
        setStatus("active");
        setPriority("medium");
        setDueDate("");
      }

      markAsSaved();
      setIsSuccessModalOpen(true);
    } catch (err) {
      handleError(err);
      setModalMessage("Algo salió mal, ¿podés intentar de nuevo?");
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !goal) {
    return <Loading />;
  }

  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="font-heading font-bold text-tertiary mb-2">
          {pageTitle}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        method="post"
        noValidate
      >
        {parentGoal && (
          <>
            <div>
              <p className="font-body text-sm text-tertiary mb-2">Se asocia a</p>
              <GoalCard
                id={parentGoal._id}
                title={parentGoal.title}
                status={parentGoal.status}
              />
            </div>
            <div className="border-brand rounded-lg border" aria-hidden="true" />
          </>
        )}

        {/* Título */}
        <Input
          type="text"
          id="title"
          name="title"
          label="¿Qué querés lograr?"
          placeholder="Hacer un portfolio"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          required
          disabled={loading}
          error={titleError}
          withDivider
        />

        {/* Descripción */}
        <TextArea
          id="description"
          name="description"
          label="Contame un poco más"
          placeholder="Quiero avanzar en mi carrera profesional"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleDescriptionBlur}
          disabled={loading}
          error={descriptionError}
          rows={3}
          withDivider
        />

        {/* Reason - ¿Por qué es importante? */}
        <Input
          type="text"
          id="reason"
          name="reason"
          label="¿Por qué es importante?"
          placeholder="Quiero avanzar en mi carrera profesional"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onBlur={handleReasonBlur}
          disabled={loading}
          error={reasonError}
          withDivider
        />

        {/* Estado (pausa/reanudar) y Prioridad. Completar no vive acá. */}
        <div className="grid grid-cols-2 gap-4">
          {isEditMode && goal?.status !== "completed" && (
            <Select
              id="status"
              name="status"
              label="Estado"
              value={status === "completed" ? "active" : status}
              onChange={(e) => setStatus(e.target.value as GoalStatus)}
              options={statusOptions}
              disabled={loading}
            />
          )}

          <Select
            id="priority"
            name="priority"
            label="Prioridad"
            value={priority}
            onChange={(e) => setPriority(e.target.value as GoalPriority)}
            options={priorityOptions}
            disabled={loading}
            className={!isEditMode || goal?.status === "completed" ? "col-span-2" : ""}
          />
        </div>
        <div className="border-brand rounded-lg border" aria-hidden="true" />

        {/* Fecha límite */}
        <Input
          type="date"
          id="dueDate"
          name="dueDate"
          label="¿Para cuándo te gustaría lograrlo?"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          onBlur={handleDueDateBlur}
          disabled={loading}
          error={dueDateError}
          required
          withDivider
        />

        {/* Botón de envío */}
        <div className="pt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>

      {/* Modal de confirmación de navegación (cambios sin guardar) */}
      <ConfirmModal
        isOpen={isBlocked}
        onClose={handleCancelNavigation}
        onConfirm={handleConfirmNavigation}
        title="Tenés cambios sin guardar"
        message="Si salís ahora, vas a perder lo que escribiste. ¿Querés salir igual?"
        confirmText="Salir"
        cancelText="Quedarme"
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
        title="¡Ups!"
        message={modalMessage}
        confirmText="Aceptar"
        cancelText=""
        variant="danger"
        loading={false}
      />
    </section>
  );
}
