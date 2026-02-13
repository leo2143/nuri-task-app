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
import TramaBlue from "../../assets/icons/trama-blue.svg";

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
    <section className="min-h-screen flex flex-col bg-secondary">
      {loading && <Loading />}

      <div className="relative flex items-center justify-center pt-8 overflow-hidden">
        <img
          src={TramaBlue}
          alt=""
          aria-hidden="true"
          className="max-w-none z-10"
        />
      </div>

      <div className="relative flex-1 px-8 pt-6 pb-10 flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-heading font-bold text-neutral mb-2">
            Crear Cuenta
          </h1>
          <p className="text-neutral font-bold text-sm">
            Ingresa tus datos para registrarte
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" method="post">
          <Input
            {...name}
            id="name"
            name="name"
            label="Nombre Completo"
            placeholder="Jose Duarte"
            required
            autoComplete="name"
            disabled={loading}
            error={nameError}
            onBlur={handleNameBlur}
            darkMode
          />

          <Input
            {...email}
            id="email"
            name="email"
            label="Correo electrónico"
            placeholder="tuemail@email.com"
            required
            autoComplete="username email"
            disabled={loading}
            error={emailError}
            onBlur={handleEmailBlur}
            darkMode
          />

          <Input
            {...password}
            id="password"
            name="password"
            label="Contraseña"
            placeholder="**********"
            required
            autoComplete="new-password"
            disabled={loading}
            error={passwordError}
            onBlur={handlePasswordBlur}
            helperText="Mínimo 8 caracteres"
            darkMode
          />

          <Input
            {...confirmPassword}
            id="confirm_password"
            name="confirm_password"
            label="Confirmar Contraseña"
            placeholder="**********"
            required
            autoComplete="new-password"
            disabled={loading}
            error={confirmPasswordError}
            onBlur={handleConfirmPasswordBlur}
            darkMode
          />

          {error &&
            !nameError &&
            !emailError &&
            !passwordError &&
            !confirmPasswordError && (
              <div className="animate-shake">
                <Alert msg={errorMessage} />
              </div>
            )}

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            variant="primary"
            size="md"
            fullWidth
          >
            {loading ? "Creando cuenta" : "Iniciar Sesión"}
          </Button>

          <div className="text-center mt-4">
            <p className="text-neutral font-bold text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-primary text-sm font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
