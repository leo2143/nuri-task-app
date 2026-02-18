import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import Button from "../../components/ui/Button";
import { ConfirmModal } from "../../components/ui";
import type {
  ICreateTodo,
  IGoalCatalog,
  ITodo,
  TodoPriority,
} from "../../interfaces";
import { useHttpError, useUnsavedChanges } from "../../hooks";
import { todoservice } from "../../services/todoService";
import { Input, Select, TextArea } from "../../components/ui";
import Loading from "../../components/Loading";
import { goalService } from "../../services/goalService";

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { errorMessage, handleError, clearError } = useHttpError();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [task, setTask] = useState<ITodo | null>(null);
  const [goalCatalogs, setGoalCatalogs] = useState<IGoalCatalog[]>([]);

  const isEditMode = !!id;

  const pageTitle = isEditMode ? "Editar Tarea" : "Crear Nueva Tarea";
  const submitButtonText = isEditMode ? "Guardar Cambios" : "Guardar";
  const loadingButtonText = isEditMode ? "Guardando..." : "Creando...";

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [goalId, setGoalId] = useState("");

  // Valores iniciales para detectar cambios
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    priority: "medium" as TodoPriority,
    dueDate: "",
    goalId: "",
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

  useEffect(() => {
    const fetchGoalCatalog = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await goalService.getCatalogGoals();

        if (data) {
          setGoalCatalogs(data);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoalCatalog();

    if (!isEditMode) return;

    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await todoservice.getTodoById(id!);

        if (data) {
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
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Validación del título
  const handleTitleBlur = () => {
    if (!title.trim()) {
      setTitleError("El título es requerido");
    } else {
      setTitleError("");
    }
  };

  // Manejador del submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    // Validación
    if (!title.trim()) {
      setTitleError("El título es requerido");
      return;
    }

    try {
      setLoading(true);

      const taskData: ICreateTodo = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        GoalId: goalId || undefined,
      };

      if (isEditMode) {
        await todoservice.updateTodo(id!, taskData);
        setSuccessMessage("¡Tarea actualizada exitosamente!");
      } else {
        await todoservice.createTodo(taskData);
        setSuccessMessage("¡Tarea creada exitosamente!");

        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
        setGoalId("");
      }

      markAsSaved();

      setTimeout(() => {
        navigate("/tasks");
      }, 1500);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !task) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Loading />
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-heading font-bold text-tertiary mb-2">
          {pageTitle}
        </h2>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-body text-red-600">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="font-body text-green-600">{successMessage}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        method="post"
        noValidate
      >
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
          disabled={loading}
          withDivider
        />

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
        title="Cambios sin guardar"
        message="Tienes cambios sin guardar. Si sales, se perderán. ¿Deseas continuar?"
        confirmText="Salir"
        cancelText="Quedarse"
        variant="warning"
        loading={false}
      />
    </section>
  );
}
