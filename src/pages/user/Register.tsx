import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import type { ICreateUser } from "../../interfaces/IUser";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import { useField, useHttpError } from "../../hooks";
import { Button, Input } from "../../components/ui";
import {
  isConflictResponse,
  isBadRequestResponse,
  isValidationErrorResponse,
} from "../../utils/typeGuards";
import {
  validateField,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validations";

export default function Register() {
  const navigate = useNavigate();

  // Hook para manejar errores HTTP
  const { error, errorMessage, clearError, setErrorMessage } = useHttpError();

  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Usar el custom hook useField para cada campo
  const name = useField("text");
  const email = useField("email");
  const password = useField("password");
  const confirmPassword = useField("password");

  const validar = (): {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  } | null => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const nameValidation = validateField("El nombre", name.value, 2);
    if (nameValidation) errors.name = nameValidation;

    const emailValidation = validateEmail(email.value);
    if (emailValidation) errors.email = emailValidation;

    const passwordValidation = validatePassword(password.value);
    if (passwordValidation) errors.password = passwordValidation;

    const confirmPasswordValidation = validateConfirmPassword(
      password.value,
      confirmPassword.value,
    );
    if (confirmPasswordValidation)
      errors.confirmPassword = confirmPasswordValidation;

    return Object.keys(errors).length > 0 ? errors : null;
  };

  const handleNameBlur = () => {
    setNameError(validateField("El nombre", name.value, 2) || "");
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email.value) || "");
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password.value) || "");
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordError(
      validateConfirmPassword(password.value, confirmPassword.value) || "",
    );
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 1. VALIDAR formulario
    const errorValidacion = validar();
    if (errorValidacion) {
      setNameError(errorValidacion.name || "");
      setEmailError(errorValidacion.email || "");
      setPasswordError(errorValidacion.password || "");
      setConfirmPasswordError(errorValidacion.confirmPassword || "");
      return;
    }

    // Limpiar errores si la validación pasa
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    clearError();

    // 2. ACTIVAR loading
    setLoading(true);

    try {
      // 3. Preparar datos del usuario
      const userData: ICreateUser = {
        name: name.value,
        email: email.value,
        password: password.value,
      };

      // 4. LLAMAR al servicio de registro
      const newUser = await userService.register(userData);

      // 5. Registro exitoso
      console.log("Usuario creado exitosamente:", newUser);

      // 6. Redirigir al login
      navigate("/user/login");
    } catch (error: unknown) {
      // 7. MANEJAR errores con type guards
      console.error("Error en registro:", error);

      let mensajeError = "Error al crear la cuenta";

      // Usar type guards para manejar errores de forma type-safe
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        const errorData = axiosError.response?.data;

        // Conflicto (409) - Email o recurso duplicado
        if (isConflictResponse(errorData)) {
          const field = errorData.meta?.conflict.field;
          if (field === "email") {
            mensajeError =
              "Este email ya está registrado. ¿Deseas iniciar sesión?";
          } else {
            mensajeError = errorData.message || "El recurso ya existe";
          }
        }
        // Error de validación (400) - Errores de validación del backend
        else if (isValidationErrorResponse(errorData)) {
          const errors = errorData.meta?.errors;
          if (errors) {
            // Tomar el primer error de validación
            const firstError = Object.values(errors)[0];
            mensajeError =
              firstError?.[0] || errorData.message || "Datos inválidos";
          } else {
            mensajeError = errorData.message || "Datos inválidos";
          }
        }
        // Solicitud incorrecta (400) - Errores generales de solicitud
        else if (isBadRequestResponse(errorData)) {
          mensajeError =
            errorData.message ||
            "Datos inválidos. Verifica la información ingresada";
        }
        // Mensaje genérico del backend
        else if (
          errorData &&
          typeof errorData === "object" &&
          "message" in errorData
        ) {
          mensajeError = (errorData as { message: string }).message;
        }
      }

      setErrorMessage(mensajeError);
    } finally {
      // 8. SIEMPRE desactivar loading
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary via-neutral to-secondary/20 flex items-center justify-center px-4 py-12">
      {loading && <Loading />}

      <section className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Ilustración / Imagen lateral */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl">
          <div className="text-center">
            <svg
              className="w-64 h-64 mx-auto text-primary opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-3xl font-heading font-bold text-tertiary mt-6 mb-3">
              ¡Únete a Nosotros!
            </h2>
            <p className="text-lg text-tertiary/70 font-body">
              Crea tu cuenta y comienza a gestionar tus tareas de manera
              eficiente
            </p>
          </div>
        </div>

        {/* Formulario de Registro */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-tertiary mb-2">
              Crear Cuenta
            </h1>
            <p className="text-tertiary/60 font-body">
              Ingresa tus datos para registrarte
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6" method="post">
            {/* Campo Nombre */}
            <Input
              {...name}
              id="name"
              name="name"
              label="Nombre Completo"
              placeholder="Juan Pérez"
              required
              autoComplete="name"
              disabled={loading}
              error={nameError}
              onBlur={handleNameBlur}
            />

            {/* Campo Email */}
            <Input
              {...email}
              id="email"
              name="email"
              label="Correo Electrónico"
              placeholder="tu.correo@ejemplo.com"
              required
              autoComplete="username email"
              disabled={loading}
              error={emailError}
              onBlur={handleEmailBlur}
            />

            {/* Campo Password */}
            <Input
              {...password}
              id="password"
              name="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              required
              autoComplete="new-password"
              disabled={loading}
              error={passwordError}
              onBlur={handlePasswordBlur}
              helperText="Mínimo 4 caracteres"
            />

            {/* Campo Confirmar Password */}
            <Input
              {...confirmPassword}
              id="confirm_password"
              name="confirm_password"
              label="Confirmar Contraseña"
              placeholder="Confirma tu contraseña"
              required
              autoComplete="new-password"
              disabled={loading}
              error={confirmPasswordError}
              onBlur={handleConfirmPasswordBlur}
            />

            {/* Error Alert - Solo mostrar errores del servidor */}
            {error &&
              !nameError &&
              !emailError &&
              !passwordError &&
              !confirmPasswordError && (
                <div className="animate-shake">
                  <Alert msg={errorMessage} />
                </div>
              )}

            {/* Botón Submit */}
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              variant="primary"
              size="lg"
              fullWidth
            >
              {loading ? "Creando cuenta" : "Crear Cuenta"}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-neutral/20">
              <p className="text-tertiary/70 font-body">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-secondary font-semibold 
                    transition-colors duration-200 focus:outline-none focus:ring-2 
                    focus:ring-primary/50 rounded px-1"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
