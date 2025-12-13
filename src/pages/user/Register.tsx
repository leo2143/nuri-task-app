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
import NuriAlegre from "../../assets/ilustrations/nuri-alegre.svg";
import Trama from "../../assets/icons/trama-white.svg";

export default function Register() {
  const navigate = useNavigate();

  // Hook para manejar errores HTTP
  const { error, errorMessage, clearError, setError, setErrorMessage } =
    useHttpError();

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
      const newUser = await userService.createUser(userData);

      // 5. Registro exitoso
      console.log("Usuario creado exitosamente:", newUser);

      // 6. Redirigir al login
      navigate("/login");
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

      setError(true);
      setErrorMessage(mensajeError);
    } finally {
      // 8. SIEMPRE desactivar loading
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center md:px-4 md:py-12">
      {loading && <Loading />}

      <section className="w-full md:max-w-6xl grid md:grid-cols-2 gap-0 items-stretch overflow-hidden md:rounded-3xl md:shadow-2xl h-screen md:h-auto">
        {/* Sección del Dibujo - Oculta en móvil */}
        <div className="hidden md:flex relative bg-secondary flex-col items-center justify-center h-full px-8 py-12">
          <div className="text-center flex flex-col justify-center items-center gap-10 z-10">
            <h2 className="text-5xl font-heading font-bold text-white drop-shadow-lg">
              ¡Únete a Nosotros!
            </h2>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <img
                className="w-64"
                src={NuriAlegre}
                alt="Nuri mascota alegre"
              />
            </div>
          </div>

          {/* Textura decorativa */}
          <div className="absolute bottom-0 left-0 right-0 opacity-20">
            <img
              className="w-full h-auto"
              src={Trama}
              alt="trama de la marca"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Formulario de Registro */}
        <div className="bg-secondary md:bg-neutral md:rounded-r-3xl p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-heading font-bold text-neutral md:text-tertiary mb-2">
              Crear Cuenta
            </h1>
            <p className="text-neutral/60 md:text-tertiary/60 font-body">
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
              responsiveDarkMode
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
              responsiveDarkMode
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
              responsiveDarkMode
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
              responsiveDarkMode
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
              <p className="text-neutral/70 md:text-tertiary/70 font-body">
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
