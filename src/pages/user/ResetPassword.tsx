import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { userService } from "../../services/userService";
import { useAppNavigate, useField, useHttpError } from "../../hooks";
import { Button, ButtonLink, Input, TramaHeader } from "../../components/ui";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import {
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validations";
import { nuriAlegreOjos, nuriError } from "../../assets/ilustrations";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useAppNavigate();
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
            "El enlace no es válido. Usá el link que te enviamos por email.",
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
            new Error(response.message || "El enlace expiró o ya fue usado"),
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
      handleError(new Error("El enlace no es válido"));
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
        <TramaHeader />

        <div className="relative flex-1 px-8 pt-6 pb-10 flex flex-col items-center justify-center gap-5">
          <img src={nuriError} alt="nuri con cartel de error" />

          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-heading font-bold text-neutral text-center">
              Enlace inválido o expirado
            </h1>

            <p className="text-neutral/80 font-body text-center text-sm">
              El enlace que usaste pudo haber expirado o ya fue utilizado. Los
              enlaces son válidos por{" "}
              <strong className="text-neutral"> 1 hora.</strong>
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <ButtonLink
              to="/forgot-password"
              variant="primary"
              size="md"
              fullWidth
            >
              Solicitar Nuevo Enlace
            </ButtonLink>

            <div className="text-center">
              <Link
                to="/login"
                className="text-primary font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
              >
                Volver al Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col bg-secondary">
      {loading && <Loading />}

      <TramaHeader />

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
                helperText="Mínimo 5 caracteres"
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
          <div className="relative flex-1 px-8 pt-6 pb-10 flex flex-col items-center justify-center gap-5">
            <img src={nuriAlegreOjos} alt="Nuri alegre" className="max-w-48" />

            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-heading font-bold text-neutral  text-center">
                ¡Contraseña Actualizada!
              </h1>

              <p className="text-neutral/80 font-body  text-center text-sm">
                Tu contraseña ha sido cambiada exitosamente. Ahora podés iniciar
                sesión con tu nueva contraseña.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <ButtonLink to="/login" variant="primary" size="md" fullWidth>
                Ir al Login Ahora
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
