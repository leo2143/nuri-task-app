import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import Button from "../../components/ui/Button";
import { ConfirmModal, GoalCard } from "../../components/ui";
import type {
  ICreateTodo,
  IGoal,
  IGoalCatalog,
  ITodo,
  TodoPriority,
} from "../../interfaces";
import { useAppNavigate, useHttpError, useUnsavedChanges } from "../../hooks";
import { todoservice } from "../../services/todoService";
import { Input, Select, TextArea } from "../../components/ui";
import Loading from "../../components/Loading";
import { goalService } from "../../services/goalService";
import { validateMinLength, validateMaxLength } from "../../utils/validations";

export default function TaskForm() {
  const navigate = useAppNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { handleError, clearError } = useHttpError();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<ITodo | null>(null);
  const [goalCatalogs, setGoalCatalogs] = useState<IGoalCatalog[]>([]);
  const [associatedGoal, setAssociatedGoal] = useState<IGoal | null>(null);

  // Estados para modales
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const isEditMode = !!id;
  const preselectedGoalId = !isEditMode ? (searchParams.get("goalId") || "") : "";

  const pageTitle = isEditMode
    ? "Editar Tarea"
    : preselectedGoalId
      ? "Crea una tarea asociada"
      : "Crear Nueva Tarea";
  const submitButtonText = isEditMode ? "Guardar Cambios" : "Guardar";
  const loadingButtonText = isEditMode ? "Guardando..." : "Creando...";

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [goalId, setGoalId] = useState(preselectedGoalId);

  // Valores iniciales para detectar cambios
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    priority: "medium" as TodoPriority,
    dueDate: "",
    goalId: preselectedGoalId,
  });

  // Valores actuales del formulario
  const currentValues = useMemo(() => ({
    title,
    description,
    priority,
    dueDate,
    goalId,
  }), [title, description, priority, dueDate, goalId]);

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

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchGoalCatalog = async () => {
      if (preselectedGoalId) return;

      try {
        setLoading(true);
        clearError();
        const data = await goalService.getCatalogGoals();

        if (cancelled) return;
        if (data) {
          setGoalCatalogs(data);
        }
      } catch (err) {
        if (cancelled) return;
        // No mostrar error si no hay metas, es una opción válida
        console.error("Error fetching goal catalogs:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetchGoalCatalog();

    if (!isEditMode) {
      return () => {
        cancelled = true;
      };
    }

    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await todoservice.getTodoById(id!);

        if (cancelled) return;
        if (data) {
          if (data.completed || data.isLocked) {
            navigate("/tasks");
            return;
          }

          setTask(data);
          setTitle(data.title);
          setDescription(data.description || "");
          setPriority(data.priority);
          setGoalId(data.GoalId || "");

          let formattedDate = "";
          if (data.dueDate) {
            const date = new Date(data.dueDate);
            formattedDate = date.toISOString().split("T")[0];
            setDueDate(formattedDate);
          }

          setInitialValues({
            title: data.title,
            description: data.description || "",
            priority: data.priority,
            dueDate: formattedDate,
            goalId: data.GoalId || "",
          });
        }
      } catch (err) {
        if (cancelled) return;
        handleError(err);
        setModalMessage("No pudimos cargar la tarea, intentá de nuevo");
        setIsErrorModalOpen(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchTaskDetail();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (isEditMode || !preselectedGoalId) return;

    let cancelled = false;
    const fetchAssociatedGoal = async () => {
      try {
        const data = await goalService.getGoalById(preselectedGoalId);
        if (!cancelled && data) setAssociatedGoal(data);
      } catch (error) {
        if (!cancelled) {
          console.error("Error al cargar la meta asociada:", error);
        }
      }
    };

    void fetchAssociatedGoal();
    return () => {
      cancelled = true;
    };
  }, [isEditMode, preselectedGoalId]);

  const validateTitle = (value: string): string => {
    if (!value.trim()) return "Dale un nombre a tu tarea";
    const minError = validateMinLength(value, 3, "El nombre");
    if (minError) return minError;
    const maxError = validateMaxLength(value, 50, "El nombre");
    if (maxError) return maxError;
    return "";
  };

  const handleTitleBlur = () => {
    setTitleError(validateTitle(title));
  };

  const handleDescriptionBlur = () => {
    if (description.length > 100) {
      setDescriptionError("La descripción no puede superar los 100 caracteres");
      return;
    }
    setDescriptionError("");
  };

  // Handlers para modales
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    if (!isEditMode && preselectedGoalId) {
      navigate(`/goals/${preselectedGoalId}`);
      return;
    }
    navigate("/tasks");
  };

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
  };

  // Manejador del submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    const titleValidationError = validateTitle(title);
    if (titleValidationError) {
      setTitleError(titleValidationError);
      return;
    }

    if (description.length > 100) {
      setDescriptionError("La descripción no puede superar los 100 caracteres");
      return;
    }

    try {
      setLoading(true);

      const taskData: ICreateTodo = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate ? `${dueDate}T12:00:00.000Z` : undefined,
        GoalId: goalId || undefined,
      };

      if (isEditMode) {
        await todoservice.updateTodo(id!, taskData);
        setModalMessage("¡Tarea actualizada exitosamente!");
      } else {
        await todoservice.createTodo(taskData);
        setModalMessage("¡Tarea creada exitosamente!");

        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
        if (!preselectedGoalId) {
          setGoalId("");
        }
      }

      markAsSaved();
      setIsSuccessModalOpen(true);
    } catch (err) {
      setModalMessage(handleError(err));
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !task) {
    return <Loading />;
  }

  return (
    <section className="max-w-2xl mx-auto">
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
        {associatedGoal && (
          <>
            <div>
              <p className="font-body text-sm text-tertiary mb-2">Se asocia a</p>
              <GoalCard
                id={associatedGoal._id}
                title={associatedGoal.title}
                status={associatedGoal.status}
              />
            </div>
            <div className="border-brand rounded-lg border" aria-hidden="true" />
          </>
        )}

        <Input
          type="text"
          id="title"
          name="title"
          label="¿Qué tenes que hacer?"
          placeholder="Ej: Completar informe mensual"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          required
          disabled={loading}
          error={titleError}
          withDivider
        />

        <TextArea
          id="description"
          name="description"
          label="Contame un poco más (Opcional)"
          rows={4}
          placeholder="Describe los detalles de la tarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleDescriptionBlur}
          disabled={loading}
          error={descriptionError}
          withDivider
        />

        {!preselectedGoalId && (
          <Select
            id="goalId"
            name="goalId"
            label="Meta relacionada (Opcional)"
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            options={goalCatalogs}
            placeholder="Sin meta asociada"
            disabled={loading}
            withDivider
          />
        )}

        <Select
          id="priority"
          name="priority"
          label="Prioridad"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TodoPriority)}
          options={[
            { id: "low", title: "Baja" },
            { id: "medium", title: "Media" },
            { id: "high", title: "Alta" },
          ]}
          placeholder="Selecciona prioridad"
          disabled={loading}
          withDivider
        />

        <Input
          type="date"
          id="dueDate"
          name="dueDate"
          label="¿Para cuándo te gustaría lograrla?"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
          withDivider
        />


        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            className="flex-1"
          >
            {loading ? loadingButtonText : submitButtonText}
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
