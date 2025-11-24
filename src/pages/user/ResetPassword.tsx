import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { userService } from "../../services/userService";
import { useField, useHttpError } from "../../hooks";
import { Button, Input } from "../../components/ui";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import {
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validations";
import NuriCorazon from "../../assets/illustrations/nuri-corazon.svg";
import Trama from "../../assets/icons/trama-white.svg";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // Hook para manejar errores HTTP
  const { error, errorMessage, handleError, clearError } = useHttpError();

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Usar el custom hook useField
  const newPassword = useField("password");
  const confirmPassword = useField("password");

  // Verificar token al cargar la página
  useEffect(() => {
    if (success) return;
    const verifyToken = async () => {
      if (!token) {
        handleError(
          new Error(
            "Token no proporcionado. Por favor, usa el enlace del email.",
          ),
        );
        setVerifying(false);
        return;
      }

      try {
        const response = await userService.verifyResetToken(token);

        if (response.valid) {
          setTokenValid(true);
          setUserEmail(response.email || "");
        } else {
          handleError(
            new Error(response.message || "Token inválido o expirado"),
          );
        }
      } catch (error: unknown) {
        console.error("Error verificando token:", error);
        handleError(error);
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, handleError]);

  const validar = (): {
    newPassword?: string;
    confirmPassword?: string;
  } | null => {
    const errors: {
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    const newPasswordValidation = validatePassword(newPassword.value);
    if (newPasswordValidation) errors.newPassword = newPasswordValidation;

    const confirmPasswordValidation = validateConfirmPassword(
      newPassword.value,
      confirmPassword.value,
    );
    if (confirmPasswordValidation)
      errors.confirmPassword = confirmPasswordValidation;

    return Object.keys(errors).length > 0 ? errors : null;
  };

  const handleNewPasswordBlur = () => {
    setNewPasswordError(validatePassword(newPassword.value) || "");
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordError(
      validateConfirmPassword(newPassword.value, confirmPassword.value) || "",
    );
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      handleError(new Error("Token no proporcionado"));
      return;
    }

    // 1. VALIDAR formulario
    const errorValidacion = validar();
    if (errorValidacion) {
      setNewPasswordError(errorValidacion.newPassword || "");
      setConfirmPasswordError(errorValidacion.confirmPassword || "");
      return;
    }

    // Limpiar errores si la validación pasa
    setNewPasswordError("");
    setConfirmPasswordError("");
    clearError();

    // 2. ACTIVAR loading
    setLoading(true);

    try {
      // 3. LLAMAR al servicio de reset password
      const response = await userService.resetPassword(
        token,
        newPassword.value,
      );

      // 4. Mostrar éxito y redirigir
      console.log("Contraseña reseteada exitosamente:", response);
      setSuccess(true);

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: unknown) {
      console.error("Error en reset password:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras verifica el token
  if (verifying) {
    return <Loading />;
  }

  // Si el token no es válido, mostrar error
  if (!tokenValid) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full mx-4">
          <div className="text-center">
            <svg
              className="w-24 h-24 mx-auto text-danger mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>

            <h1 className="text-3xl font-heading font-bold text-tertiary mb-4">
              Token Inválido o Expirado
            </h1>

            <div className="mb-6">
              <Alert msg={errorMessage} />
            </div>

            <p className="text-tertiary/70 font-body mb-8">
              El enlace de recuperación puede haber expirado o ya fue usado. Los
              enlaces son válidos por 1 hora.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/forgot-password">
                <Button variant="primary" size="md">
                  Solicitar Nuevo Enlace
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="md">
                  Volver al Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Si todo está bien, mostrar formulario o mensaje de éxito
  return (
    <main className="min-h-screen flex items-center justify-center md:px-4 md:py-12">
      {loading && <Loading />}

      <section className="w-full md:max-w-6xl grid md:grid-cols-2 gap-0 items-stretch overflow-hidden md:rounded-3xl md:shadow-2xl h-screen md:h-auto">
        {/* Sección del Dibujo - Oculta en móvil */}
        <div className="hidden md:flex relative bg-secondary flex-col items-center justify-center h-full px-8 py-12">
          <div className="text-center flex flex-col justify-center items-center gap-10 z-10">
            <h2 className="text-5xl font-heading font-bold text-white drop-shadow-lg">
              Nueva Contraseña
            </h2>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <img
                className="w-64"
                src={NuriCorazon}
                alt="Nuri mascota con corazón"
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

        {/* Formulario de Reset Password */}
        <div className="bg-secondary md:bg-neutral md:rounded-r-3xl p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          {!success ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-heading font-bold text-neutral md:text-tertiary mb-2">
                  Restablecer Contraseña
                </h1>
                <p className="text-neutral/60 md:text-neutral/60 font-body">
                  {userEmail && (
                    <>
                      Cambiando contraseña para:{" "}
                      <strong className="text-neutral">{userEmail}</strong>
                    </>
                  )}
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6" method="post">
                {/* Campo Nueva Contraseña */}
                <Input
                  {...newPassword}
                  id="newPassword"
                  name="newPassword"
                  label="Nueva Contraseña"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  error={newPasswordError}
                  onBlur={handleNewPasswordBlur}
                  helperText="Mínimo 6 caracteres"
                  responsiveDarkMode
                />

                {/* Campo Confirmar Contraseña */}
                <Input
                  {...confirmPassword}
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  placeholder="Confirma tu nueva contraseña"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  error={confirmPasswordError}
                  onBlur={handleConfirmPasswordBlur}
                  responsiveDarkMode
                />

                {/* Error Alert - Solo mostrar errores del servidor */}
                {error && !newPasswordError && !confirmPasswordError && (
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
                  {loading
                    ? "Actualizando contraseña"
                    : "Restablecer Contraseña"}
                </Button>
              </form>
            </>
          ) : (
            // Mensaje de éxito
            <div className="space-y-6 text-center">
              <svg
                className="w-24 h-24 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <h2 className="text-3xl font-heading font-bold text-neutral">
                ¡Contraseña Actualizada!
              </h2>

              <p className="text-neutral/70 font-body text-lg">
                Tu contraseña ha sido cambiada exitosamente. Ahora puedes
                iniciar sesión con tu nueva contraseña.
              </p>

              <div className="bg-secondary/10 border border-secondary p-4 rounded-lg">
                <p className="font-body text-sm text-neutral">
                  Serás redirigido al login en unos segundos...
                </p>
              </div>

              <Link to="/login">
                <Button variant="primary" size="lg" fullWidth>
                  Ir al Login Ahora
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
