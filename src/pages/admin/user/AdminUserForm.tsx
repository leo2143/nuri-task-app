import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import Button from "../../../components/ui/Button";
import { ConfirmModal } from "../../../components/ui";
import { ImageUploadSlot } from "../../../components/ImageUploadSlot";
import type {
  CreateAdminUserDto,
  UpdateAdminUserDto,
  IUser,
} from "../../../interfaces";
import { useHttpError, useCloudinaryUpload, useUnsavedChanges } from "../../../hooks";
import { userService } from "../../../services/userService";
import { Input } from "../../../components/ui";
import Loading from "../../../components/Loading";
import {
  validateField,
  validateEmail,
  validatePassword,
  validateMinLength,
} from "../../../utils/validations";

export default function AdminUserForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { errorMessage, handleError, clearError } = useHttpError();
  const { upload, isUploading: isImageUploading } = useCloudinaryUpload();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  // Estados para modales
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const isEditMode = !!id;

  const pageTitle = isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario";
  const pageDescription = isEditMode
    ? "Modifica los campos que desees actualizar"
    : "Completa los campos para agregar un nuevo usuario";
  const submitButtonText = isEditMode ? "Guardar Cambios" : "Crear Usuario";
  const loadingButtonText = isEditMode ? "Guardando..." : "Creando...";

  // Estados del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  // Valores iniciales para detectar cambios
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
    isSubscribed: false,
    profileImageUrl: "",
  });

  // Valores actuales del formulario
  const currentValues = useMemo(() => ({
    name,
    email,
    password,
    isAdmin,
    isSubscribed,
    profileImageUrl,
  }), [name, email, password, isAdmin, isSubscribed, profileImageUrl]);

  // URL de imagen pendiente (nueva imagen que no existía originalmente)
  const pendingImageUrl = profileImageUrl && profileImageUrl !== initialValues.profileImageUrl
    ? profileImageUrl
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
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Cargar usuario en modo edición
  useEffect(() => {
    if (!isEditMode) return;

    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await userService.getUserById(id!);

        if (data) {
          setUser(data);
          setName(data.name);
          setEmail(data.email);
          setIsAdmin(data.isAdmin);
          setIsSubscribed(data.subscription?.isActive || false);
          setProfileImageUrl(data.profileImageUrl || "");

          setInitialValues({
            name: data.name,
            email: data.email,
            password: "",
            isAdmin: data.isAdmin,
            isSubscribed: data.subscription?.isActive || false,
            profileImageUrl: data.profileImageUrl || "",
          });
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Validación del nombre
  const handleNameBlur = () => {
    const error = validateField("El nombre", name);
    setNameError(error || "");
  };

  // Validación del email
  const handleEmailBlur = () => {
    const error = validateEmail(email);
    setEmailError(error || "");
  };

  // Validación de la contraseña
  const handlePasswordBlur = () => {
    if (isEditMode && !password.trim()) {
      setPasswordError("");
      return;
    }

    if (!isEditMode || password.trim()) {
      const error = validatePassword(password);
      setPasswordError(error || "");
    }
  };

  // Manejador del submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    let hasErrors = false;

    const nameValidationError = validateField("El nombre", name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      hasErrors = true;
    }

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      hasErrors = true;
    }

    if (!isEditMode) {
      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
        setPasswordError(passwordValidationError);
        hasErrors = true;
      }
    } else if (password.trim()) {
      const passwordValidationError = validateMinLength(
        password,
        5,
        "La contraseña",
      );
      if (passwordValidationError) {
        setPasswordError(passwordValidationError);
        hasErrors = true;
      }
    }

    if (hasErrors) return;

    try {
      setLoading(true);

      if (isEditMode) {
        const updateData: UpdateAdminUserDto = {
          name: name.trim(),
          email: email.trim(),
          isAdmin,
          isSubscribed,
          profileImageUrl: profileImageUrl.trim() || null,
        };

        if (password.trim()) {
          updateData.password = password.trim();
        }

        await userService.adminUpdateUser(id!, updateData);
        markAsSaved();
        setModalMessage("El usuario ha sido actualizado exitosamente");
        setIsSuccessModalOpen(true);
      } else {
        const userData: CreateAdminUserDto = {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          isAdmin,
          isSubscribed,
          profileImageUrl: profileImageUrl.trim() || null,
        };

        await userService.adminCreateUser(userData);
        markAsSaved();
        setModalMessage("El usuario ha sido creado exitosamente");
        setIsSuccessModalOpen(true);

        setName("");
        setEmail("");
        setPassword("");
        setIsAdmin(false);
        setIsSubscribed(false);
        setProfileImageUrl("");
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
    navigate("/admin/users");
  };

  // Manejador para cerrar modal de error
  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
  };

  // Manejadores de imagen de perfil
  const handleImageUpload = async (file: File) => {
    try {
      const result = await upload(file);
      if (result?.secure_url) {
        setProfileImageUrl(result.secure_url);
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleImageRemove = () => {
    setProfileImageUrl("");
  };

  if (loading && isEditMode && !user) {
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
        {/* Nombre */}
        <Input
          type="text"
          id="name"
          name="name"
          label="Nombre Completo"
          placeholder="Ej: Juan Pérez"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
          required
          disabled={loading}
          error={nameError}
          helperText="Campo obligatorio"
        />

        {/* Email */}
        <Input
          type="email"
          id="email"
          name="email"
          label="Email"
          placeholder="usuario@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailBlur}
          required
          disabled={loading}
          error={emailError}
          helperText="Campo obligatorio"
        />

        {/* Contraseña */}
        <Input
          type="password"
          id="password"
          name="password"
          label={
            isEditMode
              ? "Contraseña (dejar vacío para no cambiar)"
              : "Contraseña"
          }
          placeholder={
            isEditMode
              ? "Dejar vacío si no deseas cambiarla"
              : "Mínimo 6 caracteres"
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={handlePasswordBlur}
          required={!isEditMode}
          disabled={loading}
          error={passwordError}
          helperText={
            isEditMode ? "Opcional en modo edición" : "Mínimo 6 caracteres"
          }
        />

        {/* IsAdmin - Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isAdmin"
            name="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            disabled={loading}
            className="w-5 h-5 text-primary bg-neutral border-tertiary rounded focus:ring-primary focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
          />
          <label
            htmlFor="isAdmin"
            className="text-sm font-medium text-tertiary cursor-pointer"
          >
            Usuario Administrador
          </label>
        </div>

        {/* IsSubscribed - Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isSubscribed"
            name="isSubscribed"
            checked={isSubscribed}
            onChange={(e) => setIsSubscribed(e.target.checked)}
            disabled={loading}
            className="w-5 h-5 text-primary bg-neutral border-tertiary rounded focus:ring-primary focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
          />
          <label
            htmlFor="isSubscribed"
            className="text-sm font-medium text-tertiary cursor-pointer"
          >
            Usuario con Suscripción Activa
          </label>
        </div>

        {/* Profile Image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-tertiary">
            Imagen de Perfil
          </label>
          <ImageUploadSlot
            imageUrl={profileImageUrl || undefined}
            imageAlt="Imagen de perfil del usuario"
            onImageSelect={handleImageUpload}
            onImageEdit={handleImageUpload}
            onImageRemove={handleImageRemove}
            isUploading={isImageUploading}
            className="w-24 h-24 rounded-full mx-auto"
          />
          <p className="text-xs text-gray-500 text-center">
            Opcional: Imagen de perfil del usuario
          </p>
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
            onClick={() => navigate("/admin/users")}
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
