import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import {
  Button,
  Input,
  Select,
  TextArea,
  ConfirmModal,
} from "../../components/ui";
import type {
  ICreateGoal,
  IGoal,
  GoalStatus,
  GoalPriority,
  IUpdateGoal,
} from "../../interfaces";
import { useHttpError, useUnsavedChanges } from "../../hooks";
import { goalService } from "../../services/goalService";
import { validateField, validateMinLength } from "../../utils/validations";
import Loading from "../../components/Loading";

export default function GoalForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { handleError, clearError } = useHttpError();
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState<IGoal | null>(null);
  const isEditMode = !!id;

  // Estados para modales
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const pageTitle = isEditMode ? "Editar tu meta" : "Crea tu meta";

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

  // Opciones para los selects
  const statusOptions = [
    { id: "active", title: "Activa" },
    { id: "paused", title: "Pausada" },
    { id: "completed", title: "Completada" },
  ];

  const priorityOptions = [
    { id: "low", title: "Baja" },
    { id: "medium", title: "Media" },
    { id: "high", title: "Alta" },
  ];

  useEffect(() => {
    if (!isEditMode) return;

    const fetchGoalDetail = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await goalService.getGoalById(id!);

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
        handleError(err);
        setModalMessage("Error al cargar la meta");
        setIsErrorModalOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchGoalDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Validaciones
  const handleTitleBlur = () => {
    const minError = validateMinLength(title, 3, "El título");
    if (minError) {
      setTitleError(minError);
      return;
    }
    if (title.length > 50) {
      setTitleError("El título no puede exceder 50 caracteres");
      return;
    }
    const error = validateField("El título", title);
    setTitleError(error || "");
  };

  const handleDescriptionBlur = () => {
    if (description.length > 100) {
      setDescriptionError("La descripción no puede exceder 100 caracteres");
      return;
    }
    setDescriptionError("");
  };

  const handleReasonBlur = () => {
    if (reason.length > 50) {
      setReasonError("Este campo no puede exceder 50 caracteres");
      return;
    }
    setReasonError("");
  };

  // Handlers para modales
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate("/goals");
  };

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
  };

  // Valida todos los campos del formulario
  const validateAllFields = (): boolean => {
    setTitleError("");
    setDescriptionError("");
    setReasonError("");

    // Validar título (requerido, min 3, max 50)
    const minError = validateMinLength(title, 3, "El título");
    if (minError) {
      setTitleError(minError);
      return false;
    }
    if (title.length > 50) {
      setTitleError("El título no puede exceder 50 caracteres");
      return false;
    }
    const titleValidation = validateField("El título", title);
    if (titleValidation) {
      setTitleError(titleValidation);
      return false;
    }

    // Validar descripción (max 100)
    if (description.length > 100) {
      setDescriptionError("La descripción no puede exceder 100 caracteres");
      return false;
    }

    // Validar reason (max 50)
    if (reason.length > 50) {
      setReasonError("Este campo no puede exceder 50 caracteres");
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
        // En edición sí enviamos status
        const updateData: IUpdateGoal = {
          title: title.trim(),
          description: description.trim() || undefined,
          reason: reason.trim() || undefined,
          status,
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        };
        await goalService.updateGoal(id!, updateData);
        setModalMessage("¡Meta actualizada exitosamente!");
      } else {
        // En creación NO enviamos status (se establece automáticamente)
        const createData: ICreateGoal = {
          title: title.trim(),
          description: description.trim() || undefined,
          reason: reason.trim() || undefined,
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
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
      setModalMessage("Error al procesar la solicitud. Por favor, intenta de nuevo.");
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
        className="space-y-6"
        method="post"
        noValidate
      >
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

        {/* Estado y Prioridad en grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Estado - Solo visible en modo edición */}
          {isEditMode && (
            <Select
              id="status"
              name="status"
              label="Estado"
              value={status}
              onChange={(e) => setStatus(e.target.value as GoalStatus)}
              options={statusOptions}
              disabled={loading}
            />
          )}

          {/* Prioridad */}
          <Select
            id="priority"
            name="priority"
            label="Prioridad"
            value={priority}
            onChange={(e) => setPriority(e.target.value as GoalPriority)}
            options={priorityOptions}
            disabled={loading}
            className={!isEditMode ? "col-span-2" : ""}
          />
        </div>

        {/* Fecha límite */}
        <Input
          type="date"
          id="dueDate"
          name="dueDate"
          label="¿Para cuándo te gustaría lograrlo?"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
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
