import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userService } from "../../services/userService";
import { useField, useHttpError } from "../../hooks";
import { Button, ButtonLink, Input } from "../../components/ui";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import {
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validations";
import TramaBlue from "../../assets/icons/trama-blue.svg";

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

  if (!tokenValid) {
    return (
      <section className="min-h-screen flex flex-col bg-secondary">
        <div className="relative flex items-center justify-center pt-8 overflow-hidden">
          <img
            src={TramaBlue}
            alt=""
            aria-hidden="true"
            className="max-w-none z-10"
          />
        </div>

        <div className="relative flex-1 px-8 pt-6 pb-10 flex flex-col items-center justify-center">
          <svg
            className="w-20 h-20 mx-auto text-danger mb-6"
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

          <h1 className="text-2xl font-heading font-bold text-neutral mb-4 text-center">
            Token Inválido o Expirado
          </h1>

          <div className="mb-6 w-full">
            <Alert msg={errorMessage} />
          </div>

          <p className="text-neutral/80 font-body mb-8 text-center text-sm">
            El enlace de recuperación puede haber expirado o ya fue usado. Los
            enlaces son válidos por 1 hora.
          </p>

          <div className="flex flex-col gap-4 w-full">
            <ButtonLink to="/forgot-password" variant="primary" size="md" fullWidth>
              Solicitar Nuevo Enlace
            </ButtonLink>
            <ButtonLink to="/login" variant="secondary" size="md" fullWidth>
              Volver al Login
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

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
        {!success ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-heading font-bold text-neutral mb-2">
                Restablecer Contraseña
              </h1>
              <p className="text-neutral font-bold text-sm">
                {userEmail && (
                  <>
                    Cambiando contraseña para:{" "}
                    <strong className="text-primary">{userEmail}</strong>
                  </>
                )}
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5" method="post">
              <Input
                {...newPassword}
                id="newPassword"
                name="newPassword"
                label="Nueva Contraseña"
                placeholder="**********"
                required
                autoComplete="new-password"
                disabled={loading}
                error={newPasswordError}
                onBlur={handleNewPasswordBlur}
                helperText="Mínimo 8 caracteres"
                darkMode
              />

              <Input
                {...confirmPassword}
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar Contraseña"
                placeholder="**********"
                required
                autoComplete="new-password"
                disabled={loading}
                error={confirmPasswordError}
                onBlur={handleConfirmPasswordBlur}
                darkMode
              />

              {error && !newPasswordError && !confirmPasswordError && (
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
                {loading ? "Actualizando" : "Restablecer Contraseña"}
              </Button>
            </form>
          </>
        ) : (
          <div className="space-y-6 text-center">
            <svg
              className="w-20 h-20 mx-auto text-primary"
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

            <h2 className="font-heading font-bold text-neutral text-2xl">
              ¡Contraseña Actualizada!
            </h2>

            <p className="text-neutral/80 font-body">
              Tu contraseña ha sido cambiada exitosamente. Ahora puedes
              iniciar sesión con tu nueva contraseña.
            </p>

            <div className="bg-neutral/10 border border-neutral/30 p-4 rounded-lg">
              <p className="font-body text-sm text-neutral/80">
                Serás redirigido al login en unos segundos...
              </p>
            </div>

            <ButtonLink to="/login" variant="primary" size="md" fullWidth>
              Ir al Login Ahora
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
