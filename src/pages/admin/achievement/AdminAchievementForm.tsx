import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import {
  Button,
  ConfirmModal,
  CustomCheckbox,
  Input,
  Select,
  TextArea,
} from "../../../components/ui";
import { ImageUploadSlot } from "../../../components/ImageUploadSlot";
import type {
  ICreateAchievement,
  IUpdateAchievement,
  IAchievement,
  AchievementType,
  AchievementTier,
  AchievementTriggerEvent,
  IAchievementCatalog,
  IAchievementConditions,
} from "../../../interfaces";
import { useHttpError, useCloudinaryUpload, useUnsavedChanges, useAppNavigate } from "../../../hooks";
import { achievementService } from "../../../services/achievementService";
import Loading from "../../../components/Loading";
import { validateField } from "../../../utils/validations";

const ACHIEVEMENT_TYPE_OPTIONS = [
  { id: "task", title: "Tarea" },
  { id: "goal", title: "Meta" },
  { id: "metric", title: "Métrica" },
  { id: "streak", title: "Racha" },
];

// Los eventos disponibles vienen del catálogo del backend; esto solo les pone nombre.
// Un evento sin nombre acá se muestra con su id hasta que se apruebe el texto.
const ACHIEVEMENT_TRIGGER_LABELS: Record<string, string> = {
  "task:completed": "Tarea completada",
  "goal:completed": "Meta completada",
  "streak:updated": "Racha actualizada",
  "task:goal-changed": "Mover una tarea a otra meta",
};

const ACHIEVEMENT_TIER_OPTIONS = [
  { id: "basic", title: "Basic — visible para todos" },
  { id: "premium", title: "Premium — solo suscriptores" },
];

export default function AdminAchievementForm() {
  const navigate = useAppNavigate();
  const { id } = useParams<{ id: string }>();
  const { errorMessage, handleError, clearError } = useHttpError();
  const { upload, isUploading: isImageUploading } = useCloudinaryUpload();
  const [loading, setLoading] = useState(false);
  const [achievement, setAchievement] = useState<IAchievement | null>(null);

  // Estados para modales
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [inProgressCount, setInProgressCount] = useState<number | null>(null);

  const isEditMode = !!id;

  const pageTitle = isEditMode ? "Editar Logro" : "Crear Nuevo Logro";
  const pageDescription = isEditMode
    ? "Modifica los campos que desees actualizar"
    : "Completa los campos para agregar un nuevo logro";
  const submitButtonText = isEditMode ? "Guardar Cambios" : "Crear Logro";
  const loadingButtonText = isEditMode ? "Guardando..." : "Creando...";

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetCount, setTargetCount] = useState("");
  const [type, setType] = useState<AchievementType>("task");
  const [triggerEvent, setTriggerEvent] = useState<AchievementTriggerEvent>("task:completed");
  const [tier, setTier] = useState<AchievementTier>("basic");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [catalog, setCatalog] = useState<IAchievementCatalog | null>(null);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [sameWindow, setSameWindow] = useState(false);
  const [maxDurationHours, setMaxDurationHours] = useState("");

  // Valores iniciales para detectar cambios
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    targetCount: "",
    type: "task" as AchievementType,
    triggerEvent: "task:completed" as AchievementTriggerEvent,
    tier: "basic" as AchievementTier,
    isActive: true,
    imageUrl: "",
    timeStart: "",
    timeEnd: "",
    sameWindow: false,
    maxDurationHours: "",
  });

  // Valores actuales del formulario
  const currentValues = useMemo(() => ({
    title,
    description,
    targetCount,
    type,
    triggerEvent,
    tier,
    isActive,
    imageUrl,
    timeStart,
    timeEnd,
    sameWindow,
    maxDurationHours,
  }), [title, description, targetCount, type, triggerEvent, tier, isActive, imageUrl, timeStart, timeEnd, sameWindow, maxDurationHours]);

  const triggerOptions = useMemo(
    () =>
      (catalog?.triggers ?? []).map(({ triggerEvent: eventId }) => ({
        id: eventId,
        title: ACHIEVEMENT_TRIGGER_LABELS[eventId] ?? eventId,
      })),
    [catalog],
  );

  // Condiciones que admite el evento elegido; el resto no se muestra ni se envía
  const allowedConditions = useMemo(
    () =>
      catalog?.triggers.find((trigger) => trigger.triggerEvent === triggerEvent)
        ?.allowedConditions ?? [],
    [catalog, triggerEvent],
  );
  const allowsTimeWindow = allowedConditions.includes("timeWindow");
  const allowsSameWindow = allowedConditions.includes("sameWindow");
  const allowsMaxDuration = allowedConditions.includes("maxDurationHours");

  // URL de imagen pendiente (nueva imagen que no existía originalmente)
  const pendingImageUrl = imageUrl && imageUrl !== initialValues.imageUrl
    ? imageUrl
    : undefined;

  // Hook para detectar cambios sin guardar
  const {
    isBlocked,
    handleConfirmNavigation,
    handleCancelNavigation,
    markAsSaved,
  } = useUnsavedChanges({
    initialValues,
    currentValues,
    pendingImageUrl,
  });

  // Estados de error
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [targetCountError, setTargetCountError] = useState("");

  // Cargar el catálogo de eventos y condiciones
  useEffect(() => {
    let cancelled = false;
    const fetchCatalog = async () => {
      try {
        const data = await achievementService.getCatalog();
        if (!cancelled) setCatalog(data);
      } catch (err) {
        if (!cancelled) handleError(err);
      }
    };

    void fetchCatalog();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cargar logro en modo edición
  useEffect(() => {
    if (!isEditMode) return;

    let cancelled = false;
    const fetchAchievementDetail = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await achievementService.getAchievementById(id!);

        if (cancelled) return;
        if (data) {
          setAchievement(data);
          setTitle(data.title);
          setDescription(data.description);
          setTargetCount(data.targetCount.toString());
          setType(data.type);
          setTriggerEvent(data.triggerEvent);
          setTier(data.tier);
          setIsActive(data.isActive);
          setImageUrl(data.imageUrl);
          setTimeStart(data.conditions?.timeWindow?.start ?? "");
          setTimeEnd(data.conditions?.timeWindow?.end ?? "");
          setSameWindow(data.conditions?.sameWindow ?? false);
          setMaxDurationHours(
            data.conditions?.maxDurationHours?.toString() ?? "",
          );

          setInitialValues({
            title: data.title,
            description: data.description,
            targetCount: data.targetCount.toString(),
            type: data.type,
            triggerEvent: data.triggerEvent,
            tier: data.tier,
            isActive: data.isActive,
            imageUrl: data.imageUrl,
            timeStart: data.conditions?.timeWindow?.start ?? "",
            timeEnd: data.conditions?.timeWindow?.end ?? "",
            sameWindow: data.conditions?.sameWindow ?? false,
            maxDurationHours:
              data.conditions?.maxDurationHours?.toString() ?? "",
          });
        }
      } catch (err) {
        if (cancelled) return;
        handleError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchAchievementDetail();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Validación del título
  const handleTitleBlur = () => {
    const error = validateField("El título", title);
    setTitleError(error || "");
  };

  // Validación de la descripción
  const handleDescriptionBlur = () => {
    const error = validateField("La descripción", description);
    setDescriptionError(error || "");
  };

  // Validación del targetCount
  const handleTargetCountBlur = () => {
    if (!targetCount.trim()) {
      setTargetCountError("Ingresá un objetivo numérico");
      return;
    }

    const numericValue = Number.parseInt(targetCount, 10);
    if (Number.isNaN(numericValue) || numericValue <= 0) {
      setTargetCountError("El objetivo debe ser mayor a 0");
    } else {
      setTargetCountError("");
    }
  };

  // Cambiar el evento o las condiciones reinicia el progreso en curso de los usuarios
  const changesProgressMeaning =
    triggerEvent !== initialValues.triggerEvent ||
    timeStart !== initialValues.timeStart ||
    timeEnd !== initialValues.timeEnd ||
    sameWindow !== initialValues.sameWindow ||
    maxDurationHours !== initialValues.maxDurationHours;

  // Manejador del submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    let hasErrors = false;

    const titleValidationError = validateField("El título", title);
    if (titleValidationError) {
      setTitleError(titleValidationError);
      hasErrors = true;
    }

    const descriptionValidationError = validateField(
      "La descripción",
      description,
    );
    if (descriptionValidationError) {
      setDescriptionError(descriptionValidationError);
      hasErrors = true;
    }

    if (!targetCount.trim()) {
      setTargetCountError("Ingresá un objetivo numérico");
      hasErrors = true;
    } else {
      const numericValue = Number.parseInt(targetCount, 10);
      if (Number.isNaN(numericValue) || numericValue <= 0) {
        setTargetCountError("El objetivo debe ser mayor a 0");
        hasErrors = true;
      }
    }

    if (hasErrors) return;

    if (isEditMode && changesProgressMeaning) {
      try {
        setLoading(true);
        const count = await achievementService.getInProgressCount(id!);
        if (count > 0) {
          setInProgressCount(count);
          return;
        }
      } catch (err) {
        setModalMessage(handleError(err));
        setIsErrorModalOpen(true);
        return;
      } finally {
        setLoading(false);
      }
    }

    await saveAchievement();
  };

  // Condiciones a enviar: solo las que admite el evento elegido
  const buildConditions = (): IAchievementConditions => {
    const conditions: IAchievementConditions = {};
    if (allowsTimeWindow && (timeStart || timeEnd)) {
      // Si falta una hora se envía vacía y el backend responde con el motivo
      conditions.timeWindow = { start: timeStart, end: timeEnd };
    }
    if (allowsSameWindow) {
      conditions.sameWindow = sameWindow;
    }
    if (allowsMaxDuration && maxDurationHours.trim()) {
      // Un valor no numérico llega como NaN (null en JSON) y el backend responde con el motivo
      conditions.maxDurationHours = Number(maxDurationHours);
    }
    return conditions;
  };

  const saveAchievement = async () => {
    try {
      setLoading(true);

      if (isEditMode) {
        const updateData: IUpdateAchievement = {
          title: title.trim(),
          description: description.trim(),
          targetCount: Number.parseInt(targetCount, 10),
          type,
          triggerEvent,
          conditions: buildConditions(),
          isActive,
          imageUrl: imageUrl.trim(),
        };

        await achievementService.updateAchievement(id!, updateData);
        markAsSaved();
        setModalMessage("El logro ha sido actualizado exitosamente");
        setIsSuccessModalOpen(true);
      } else {
        const achievementData: ICreateAchievement = {
          title: title.trim(),
          description: description.trim(),
          targetCount: Number.parseInt(targetCount, 10),
          type,
          triggerEvent,
          conditions: buildConditions(),
          tier,
          isActive,
          imageUrl: imageUrl.trim(),
        };

        await achievementService.createAchievement(achievementData);
        markAsSaved();
        setModalMessage("El logro ha sido creado exitosamente");
        setIsSuccessModalOpen(true);

        setTitle("");
        setDescription("");
        setTargetCount("");
        setType("task");
        setTriggerEvent("task:completed");
        setTier("basic");
        setIsActive(true);
        setImageUrl("");
        setTimeStart("");
        setTimeEnd("");
        setSameWindow(false);
        setMaxDurationHours("");
      }
    } catch (err) {
      setModalMessage(handleError(err));
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressWarningConfirm = () => {
    setInProgressCount(null);
    void saveAchievement();
  };

  const handleProgressWarningClose = () => {
    setInProgressCount(null);
  };

  // Manejador para cerrar modal de éxito y redirigir
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate("/admin/achievements");
  };

  // Manejador para cerrar modal de error
  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
  };

  // Manejadores de imagen del logro
  const handleImageUpload = async (file: File) => {
    try {
      const result = await upload(file);
      if (result?.secure_url) {
        setImageUrl(result.secure_url);
      }
    } catch (error) {
      console.error("Error uploading achievement image:", error);
    }
  };

  const handleImageRemove = () => {
    setImageUrl("");
  };

  if (loading && isEditMode && !achievement) {
    return <Loading />;
  }

  return (
    <section className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-heading font-bold text-tertiary mb-2">
          {pageTitle}
        </h2>
        <p className="font-body text-tertiary">{pageDescription}</p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-body text-red-600">{errorMessage}</p>
        </div>
      )}

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
          label="Título del Logro"
          placeholder="Ej: Maestro de Tareas"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          required
          disabled={loading}
          error={titleError}
          helperText="Campo obligatorio"
        />

        <TextArea
          id="description"
          name="description"
          label="Descripción"
          rows={4}
          placeholder="Describe el logro..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleDescriptionBlur}
          required
          disabled={loading}
          error={descriptionError}
        />

        {/* Target Count */}
        <Input
          type="number"
          id="targetCount"
          name="targetCount"
          label="Objetivo/Meta (número)"
          placeholder="Ej: 100"
          value={targetCount}
          onChange={(e) => setTargetCount(e.target.value)}
          onBlur={handleTargetCountBlur}
          required
          disabled={loading}
          error={targetCountError}
          helperText="Número de veces que debe completarse para obtener el logro"
        />

        <Select
          id="type"
          name="type"
          label="Tipo de Logro"
          value={type}
          onChange={(e) => setType(e.target.value as AchievementType)}
          options={ACHIEVEMENT_TYPE_OPTIONS}
          required
          disabled={loading}
        />

        <Select
          id="triggerEvent"
          name="triggerEvent"
          label="Evento que activa el progreso"
          value={triggerEvent}
          onChange={(e) =>
            setTriggerEvent(e.target.value as AchievementTriggerEvent)
          }
          options={triggerOptions}
          required
          disabled={loading}
          helperText="Define qué acción del usuario incrementa el contador de este logro"
        />

        {(allowsTimeWindow || allowsSameWindow || allowsMaxDuration) && (
          <fieldset className="space-y-4">
            <legend className="font-heading font-bold text-tertiary mb-2">
              Condiciones
            </legend>

            {allowsTimeWindow && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="time"
                    id="timeStart"
                    name="timeStart"
                    label="Desde"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    disabled={loading}
                  />
                  <Input
                    type="time"
                    id="timeEnd"
                    name="timeEnd"
                    label="Hasta"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Hora local de cada usuario. El fin no se incluye.
                </p>
              </div>
            )}

            {allowsSameWindow && (
              <div className="flex items-center gap-3">
                <CustomCheckbox
                  id="sameWindow"
                  checked={sameWindow}
                  onChange={(e) => setSameWindow(e.target.checked)}
                  disabled={loading}
                  ariaLabel="Tienen que ser en la misma franja"
                />
                <label
                  htmlFor="sameWindow"
                  className="text-sm font-medium text-tertiary cursor-pointer"
                >
                  Tienen que ser en la misma franja
                </label>
              </div>
            )}

            {allowsMaxDuration && (
              <Input
                type="number"
                id="maxDurationHours"
                name="maxDurationHours"
                label="Tiempo máximo (horas)"
                value={maxDurationHours}
                onChange={(e) => setMaxDurationHours(e.target.value)}
                min={1}
                disabled={loading}
                helperText="Horas desde que se creó la meta hasta completarla."
              />
            )}
          </fieldset>
        )}

        <Select
          id="tier"
          name="tier"
          label="Nivel de acceso"
          value={tier}
          onChange={(e) => setTier(e.target.value as AchievementTier)}
          options={ACHIEVEMENT_TIER_OPTIONS}
          required
          disabled={loading || isEditMode}
          helperText={
            isEditMode
              ? "El tier de un logro no se puede cambiar. Desactivalo y creá uno nuevo."
              : undefined
          }
        />

        {/* Achievement Image */}
        <div className="space-y-2">
          <p id="admin-achievement-image" className="block text-sm font-medium text-tertiary">
            Icono/Imagen del Logro
          </p>
          <ImageUploadSlot
            imageUrl={imageUrl || undefined}
            imageAlt="Imagen del logro"
            labelledBy="admin-achievement-image"
            onImageSelect={handleImageUpload}
            onImageEdit={handleImageUpload}
            onImageRemove={handleImageRemove}
            isUploading={isImageUploading}
            className="w-24 h-24 rounded-full mx-auto"
          />
          <p className="text-xs text-gray-500 text-center">
            Imagen o icono que representa el logro
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CustomCheckbox
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            disabled={loading}
            ariaLabel="Logro Activo"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-tertiary cursor-pointer"
          >
            Logro Activo
          </label>
        </div>

        {/* Botones */}
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
            onClick={() => navigate("/admin/achievements")}
          >
            Cancelar
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

      {/* Aviso: cambiar el evento o las condiciones reinicia el progreso en curso */}
      <ConfirmModal
        isOpen={inProgressCount !== null}
        onClose={handleProgressWarningClose}
        onConfirm={handleProgressWarningConfirm}
        title="¿Cambiamos cómo se gana este logro?"
        message={
          inProgressCount === 1
            ? "1 usuario lo tiene en progreso. Si guardás este cambio, su avance vuelve a cero. Quienes ya lo ganaron lo conservan."
            : `${inProgressCount} usuarios lo tienen en progreso. Si guardás este cambio, su avance vuelve a cero. Quienes ya lo ganaron lo conservan.`
        }
        confirmText="Guardar igual"
        cancelText="Cancelar"
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
