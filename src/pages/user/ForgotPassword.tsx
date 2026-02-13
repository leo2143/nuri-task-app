import { useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../../services/userService";
import { useField, useHttpError } from "../../hooks";
import { Button, Input } from "../../components/ui";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import { validateEmail } from "../../utils/validations";
import TramaBlue from "../../assets/icons/trama-blue.svg";

export default function ForgotPassword() {
  // Hook para manejar errores HTTP
  const { error, errorMessage, handleError, clearError } = useHttpError();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [emailError, setEmailError] = useState("");

  // Usar el custom hook useField
  const email = useField("email");

  const validar = (): { email?: string } | null => {
    const errors: { email?: string } = {};

    const emailValidation = validateEmail(email.value);
    if (emailValidation) errors.email = emailValidation;

    return Object.keys(errors).length > 0 ? errors : null;
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email.value) || "");
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 1. VALIDAR formulario
    const errorValidacion = validar();
    if (errorValidacion) {
      setEmailError(errorValidacion.email || "");
      setSuccess(false);
      return;
    }

    // Limpiar errores si la validación pasa
    setEmailError("");
    clearError();

    // 2. ACTIVAR loading
    setLoading(true);
    setSuccess(false);

    try {
      // 3. LLAMAR al servicio de forgot password
      const response = await userService.forgotPassword(email.value);

      // 4. Mostrar mensaje de éxito
      console.log("Solicitud de recuperación enviada:", response);
      setSuccess(true);
      setSuccessMessage(
        "Si el email existe en nuestro sistema, recibirás un correo con instrucciones para recuperar tu contraseña.",
      );

      // En desarrollo, mostrar el token en consola
      if (response.devToken) {
        console.log("🔑 Token de desarrollo:", response.devToken);
        console.log(
          `🔗 Link directo: /reset-password?token=${response.devToken}`,
        );
      }
    } catch (error: unknown) {
      console.error("Error en forgot password:", error);
      handleError(error);
    } finally {
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
            Recuperar Contraseña
          </h1>
          <p className="text-neutral font-bold text-sm">
            Ingresa tu email para recibir las instrucciones para recuperar tu contraseña
          </p>
        </div>

        {!success ? (
          <form onSubmit={onSubmit} className="space-y-5" method="post">
            <Input
              {...email}
              id="email"
              name="email"
              label="Correo electronico"
              placeholder="juanperez@email.com"
              required
              autoComplete="email"
              disabled={loading}
              error={emailError}
              onBlur={handleEmailBlur}
              helperText="Ingresa el email con que te registraste"
              darkMode
            />

            {error && !emailError && (
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
              {loading ? "Enviando" : "Recibir instrucciones"}
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
        ) : (
          <div className="space-y-6">
            <div className="bg-primary/20 border-2 border-primary text-neutral px-6 py-4 rounded-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h2 className="font-heading font-bold text-lg mb-2">
                    ¡Email Enviado!
                  </h2>
                  <p className="font-body text-sm">{successMessage}</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral/10 border border-neutral/30 p-4 rounded-lg">
              <h3 className="font-heading font-semibold text-neutral mb-2">
                📬 Revisa tu bandeja de entrada
              </h3>
              <ul className="font-body text-sm text-neutral/80 space-y-1 list-disc list-inside">
                <li>El email puede tardar unos minutos en llegar</li>
                <li>Revisa tu carpeta de spam o correo no deseado</li>
                <li>El enlace es válido por 1 hora</li>
              </ul>
            </div>

            <Button
              type="button"
              onClick={() => setSuccess(false)}
              variant="primary"
              size="md"
              fullWidth
            >
              Enviar Otro Email
            </Button>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-primary font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
              >
                ← Volver al Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
