import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Button, Input } from "../../components/ui";
import type {
  ICreateGoal,
  IGoal,
  GoalStatus,
  GoalPriority,
  ISmartCriteria,
} from "../../interfaces";
import { useHttpError, useField } from "../../hooks";
import { goalService } from "../../services/goalService";
import { validateField } from "../../utils/validations";

export default function GoalForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { errorMessage, handleError, clearError } = useHttpError();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [goal, setGoal] = useState<IGoal | null>(null);
  const isEditMode = !!id;

  const pageTitle = isEditMode ? "Editar Meta" : "Crear Nueva Meta";
  const pageDescription = isEditMode
    ? "Modifica los campos que desees actualizar"
    : "Completa los campos para agregar una nueva meta";
  const submitButtonText = isEditMode ? "Guardar Cambios" : "Crear Meta";
  const loadingButtonText = isEditMode ? "Guardando..." : "Creando...";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<GoalStatus>("active");
  const [priority, setPriority] = useState<GoalPriority>("medium");
  const [dueDate, setDueDate] = useState("");

  const smartSpecific = useField("text");
  const smartMeasurable = useField("text");
  const smartAchievable = useField("text");
  const smartRelevant = useField("text");
  const smartTimeBound = useField("text");

  const [titleError, setTitleError] = useState("");
  const [smartSpecificError, setSmartSpecificError] = useState("");
  const [smartMeasurableError, setSmartMeasurableError] = useState("");
  const [smartAchievableError, setSmartAchievableError] = useState("");
  const [smartRelevantError, setSmartRelevantError] = useState("");
  const [smartTimeBoundError, setSmartTimeBoundError] = useState("");
  const [smartError, setSmartError] = useState("");

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
          setStatus(data.status);
          setPriority(data.priority);

          if (data.dueDate) {
            const date = new Date(data.dueDate);
            const formattedDate = date.toISOString().split("T")[0];
            setDueDate(formattedDate);
          }

          if (data.smart) {
            smartSpecific.onChange({
              target: { value: data.smart.specific || "" },
            } as ChangeEvent<HTMLInputElement>);
            smartMeasurable.onChange({
              target: { value: data.smart.measurable || "" },
            } as ChangeEvent<HTMLInputElement>);
            smartAchievable.onChange({
              target: { value: data.smart.achievable || "" },
            } as ChangeEvent<HTMLInputElement>);
            smartRelevant.onChange({
              target: { value: data.smart.relevant || "" },
            } as ChangeEvent<HTMLInputElement>);
            smartTimeBound.onChange({
              target: { value: data.smart.timeBound || "" },
            } as ChangeEvent<HTMLInputElement>);
          }
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoalDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleTitleBlur = () => {
    const error = validateField("El título", title);
    setTitleError(error || "");
  };

  const handleSmartSpecificBlur = () => {
    const error = validateField("Específico", smartSpecific.value);
    setSmartSpecificError(error || "");
  };

  const handleSmartMeasurableBlur = () => {
    const error = validateField("Medible", smartMeasurable.value);
    setSmartMeasurableError(error || "");
  };

  const handleSmartAchievableBlur = () => {
    const error = validateField("Alcanzable", smartAchievable.value);
    setSmartAchievableError(error || "");
  };

  const handleSmartRelevantBlur = () => {
    const error = validateField("Relevante", smartRelevant.value);
    setSmartRelevantError(error || "");
  };

  const handleSmartTimeBoundBlur = () => {
    const error = validateField("Con límite de tiempo", smartTimeBound.value);
    setSmartTimeBoundError(error || "");
  };

  // Valida todos los campos del formulario
  const validateAllFields = (): boolean => {
    // Limpiar errores anteriores
    setTitleError("");
    setSmartSpecificError("");
    setSmartMeasurableError("");
    setSmartAchievableError("");
    setSmartRelevantError("");
    setSmartTimeBoundError("");

    // Validar título
    const titleValidation = validateField("El título", title);
    if (titleValidation) {
      setTitleError(titleValidation);
      return false;
    }

    // Validar cada campo SMART individualmente
    const smartSpecificValidation = validateField(
      "Específico",
      smartSpecific.value,
    );
    if (smartSpecificValidation) {
      setSmartSpecificError(smartSpecificValidation);
      return false;
    }

    const smartMeasurableValidation = validateField(
      "Medible",
      smartMeasurable.value,
    );
    if (smartMeasurableValidation) {
      setSmartMeasurableError(smartMeasurableValidation);
      return false;
    }

    const smartAchievableValidation = validateField(
      "Alcanzable",
      smartAchievable.value,
    );
    if (smartAchievableValidation) {
      setSmartAchievableError(smartAchievableValidation);
      return false;
    }

    const smartRelevantValidation = validateField(
      "Relevante",
      smartRelevant.value,
    );
    if (smartRelevantValidation) {
      setSmartRelevantError(smartRelevantValidation);
      return false;
    }

    const smartTimeBoundValidation = validateField(
      "Con límite de tiempo",
      smartTimeBound.value,
    );
    if (smartTimeBoundValidation) {
      setSmartTimeBoundError(smartTimeBoundValidation);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");
    setSmartError("");

    // Validar todos los campos
    if (!validateAllFields()) {
      return;
    }

    try {
      setLoading(true);

      const goalData: ICreateGoal = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      };

      // Agregar SMART criteria al goalData
      const smart: ISmartCriteria = {
        specific: smartSpecific.value.trim(),
        measurable: smartMeasurable.value.trim(),
        achievable: smartAchievable.value.trim(),
        relevant: smartRelevant.value.trim(),
        timeBound: smartTimeBound.value.trim(),
      };
      goalData.smart = smart;

      if (isEditMode) {
        await goalService.updateGoal(id!, goalData);
        setSuccessMessage("¡Meta actualizada exitosamente!");
      } else {
        await goalService.createGoal(goalData);
        setSuccessMessage("¡Meta creada exitosamente!");

        setTitle("");
        setDescription("");
        setStatus("active");
        setPriority("medium");
        setDueDate("");
        smartSpecific.onChange({
          target: { value: "" },
        } as ChangeEvent<HTMLInputElement>);
        smartMeasurable.onChange({
          target: { value: "" },
        } as ChangeEvent<HTMLInputElement>);
        smartAchievable.onChange({
          target: { value: "" },
        } as ChangeEvent<HTMLInputElement>);
        smartRelevant.onChange({
          target: { value: "" },
        } as ChangeEvent<HTMLInputElement>);
        smartTimeBound.onChange({
          target: { value: "" },
        } as ChangeEvent<HTMLInputElement>);
      }

      setTimeout(() => {
        navigate("/goals");
      }, 1500);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !goal) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="font-body text-tertiary">Cargando meta...</p>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-tertiary mb-2">
          {pageTitle}
        </h2>
        <p className="font-body text-tertiary">{pageDescription}</p>
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

      {smartError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-body text-yellow-700">{smartError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              type="text"
              id="title"
              name="title"
              label="Título de la Meta"
              placeholder="Ej: Aprender React"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              required
              disabled={loading}
              error={titleError}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-tertiary mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe tu meta en detalle..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-tertiary mb-2"
            >
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as GoalStatus)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="active">Activa</option>
              <option value="paused">Pausada</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-tertiary mb-2"
            >
              Prioridad
            </label>
            <select
              id="priority"
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as GoalPriority)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Input
              type="date"
              id="dueDate"
              name="dueDate"
              label="Fecha límite"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-heading font-semibold text-tertiary mb-2">
              Criterios SMART
            </h3>
            <p className="text-sm text-tertiary opacity-75 mb-4">
              Si decides completar los criterios SMART, debes llenar todos los
              campos
            </p>

            <div className="space-y-4">
              <Input
                {...smartSpecific}
                id="smart-specific"
                name="smart-specific"
                label="Específico"
                placeholder="¿Qué quiero lograr exactamente?"
                disabled={loading}
                onBlur={handleSmartSpecificBlur}
                error={smartSpecificError}
              />

              <Input
                {...smartMeasurable}
                id="smart-measurable"
                name="smart-measurable"
                label="Medible"
                placeholder="¿Cómo voy a medir mi progreso?"
                disabled={loading}
                onBlur={handleSmartMeasurableBlur}
                error={smartMeasurableError}
              />

              <Input
                {...smartAchievable}
                id="smart-achievable"
                name="smart-achievable"
                label="Alcanzable"
                placeholder="¿Es realista con mis recursos?"
                disabled={loading}
                onBlur={handleSmartAchievableBlur}
                error={smartAchievableError}
              />

              <Input
                {...smartRelevant}
                id="smart-relevant"
                name="smart-relevant"
                label="Relevante"
                placeholder="¿Por qué es importante esta meta?"
                disabled={loading}
                onBlur={handleSmartRelevantBlur}
                error={smartRelevantError}
              />

              <Input
                {...smartTimeBound}
                id="smart-timebound"
                name="smart-timebound"
                label="Con límite de tiempo"
                placeholder="¿Cuándo quiero lograrlo?"
                disabled={loading}
                onBlur={handleSmartTimeBoundBlur}
                error={smartTimeBoundError}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="flex-1"
          >
            {loading ? loadingButtonText : submitButtonText}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={loading}
            onClick={() => navigate("/goals")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
