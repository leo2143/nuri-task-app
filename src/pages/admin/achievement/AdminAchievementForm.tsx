import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "../../../components/ui/Button";
import { ConfirmModal } from "../../../components/ui";
import type {
  ICreateAchievement,
  IUpdateAchievement,
  IAchievement,
  AchievementType,
} from "../../../interfaces";
import { useHttpError } from "../../../hooks";
import { achievementService } from "../../../services/achievementService";
import { Input } from "../../../components/ui";
import Loading from "../../../components/Loading";
import { validateField } from "../../../utils/validations";

export default function AdminAchievementForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { errorMessage, handleError, clearError } = useHttpError();
  const [loading, setLoading] = useState(false);
  const [achievement, setAchievement] = useState<IAchievement | null>(null);

  // Estados para modales
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  // Estados de error
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [targetCountError, setTargetCountError] = useState("");

  // Cargar logro en modo edición
  useEffect(() => {
    if (!isEditMode) return;

    const fetchAchievementDetail = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await achievementService.getAchievementById(id!);

        if (data) {
          setAchievement(data);
          setTitle(data.title);
          setDescription(data.description);
          setTargetCount(data.targetCount.toString());
          setType(data.type);
          setIsActive(data.isActive);
          setImageUrl(data.imageUrl);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievementDetail();
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
      setTargetCountError("El objetivo es requerido");
      return;
    }

    const numericValue = parseInt(targetCount, 10);
    if (isNaN(numericValue) || numericValue <= 0) {
      setTargetCountError("Debe ser un número mayor a 0");
    } else {
      setTargetCountError("");
    }
  };

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
      setTargetCountError("El objetivo es requerido");
      hasErrors = true;
    } else {
      const numericValue = parseInt(targetCount, 10);
      if (isNaN(numericValue) || numericValue <= 0) {
        setTargetCountError("Debe ser un número mayor a 0");
        hasErrors = true;
      }
    }

    if (hasErrors) return;

    try {
      setLoading(true);

      if (isEditMode) {
        const updateData: IUpdateAchievement = {
          title: title.trim(),
          description: description.trim(),
          targetCount: parseInt(targetCount, 10),
          type,
          isActive,
          imageUrl: imageUrl.trim(),
        };

        await achievementService.updateAchievement(id!, updateData);
        setModalMessage("El logro ha sido actualizado exitosamente");
        setIsSuccessModalOpen(true);
      } else {
        const achievementData: ICreateAchievement = {
          title: title.trim(),
          description: description.trim(),
          targetCount: parseInt(targetCount, 10),
          type,
          isActive,
          imageUrl: imageUrl.trim(),
        };

        await achievementService.createAchievement(achievementData);
        setModalMessage("El logro ha sido creado exitosamente");
        setIsSuccessModalOpen(true);

        setTitle("");
        setDescription("");
        setTargetCount("");
        setType("task");
        setIsActive(true);
        setImageUrl("");
      }
    } catch (err) {
      handleError(err);
      setModalMessage(
        errorMessage ||
          "Hubo un error al procesar la solicitud. Por favor, intenta de nuevo.",
      );
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
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

  if (loading && isEditMode && !achievement) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Loading />
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto">
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

        {/* Descripción */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-tertiary"
          >
            Descripción *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            placeholder="Describe el logro..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            disabled={loading}
            required
          />
          {descriptionError && (
            <p className="text-sm text-red-600">{descriptionError}</p>
          )}
        </div>

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

        {/* Tipo */}
        <div className="space-y-2">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-tertiary"
          >
            Tipo de Logro *
          </label>
          <select
            id="type"
            name="type"
            className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={type}
            onChange={(e) => setType(e.target.value as AchievementType)}
            disabled={loading}
            required
          >
            <option value="task">Tarea</option>
            <option value="goal">Meta</option>
            <option value="metric">Métrica</option>
            <option value="streak">Racha</option>
          </select>
        </div>

        {/* Image URL */}
        <Input
          type="url"
          id="imageUrl"
          name="imageUrl"
          label="URL de Icono/Imagen"
          placeholder="https://ejemplo.com/icono.png"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={loading}
          helperText="URL de la imagen o emoji que representa el logro"
        />

        {/* IsActive - Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            disabled={loading}
            className="w-5 h-5 text-primary bg-neutral border-tertiary rounded focus:ring-primary focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
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
