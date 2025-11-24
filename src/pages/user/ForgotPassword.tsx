import { useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../../services/userService";
import { useField, useHttpError } from "../../hooks";
import { Button, Input } from "../../components/ui";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import { validateEmail } from "../../utils/validations";
import NuriTriste from "../../assets/illustrations/nuri-triste.svg";
import Trama from "../../assets/icons/trama-white.svg";

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
    <main className="min-h-screen flex items-center justify-center md:px-4 md:py-12">
      {loading && <Loading />}

      <section className="w-full md:max-w-6xl grid md:grid-cols-2 gap-0 items-stretch overflow-hidden md:rounded-3xl md:shadow-2xl h-screen md:h-auto">
        {/* Sección del Dibujo - Oculta en móvil */}
        <div className="hidden md:flex relative bg-secondary flex-col items-center justify-center h-full px-8 py-12">
          <div className="text-center flex flex-col justify-center items-center gap-10 z-10">
            <h2 className="text-5xl font-heading font-bold text-white drop-shadow-lg">
              ¿Olvidaste tu Contraseña?
            </h2>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <img
                className="w-64"
                src={NuriTriste}
                alt="Nuri mascota triste"
              />
            </div>
          </div>

          {/* Textura decorativa */}
          <div className="absolute bottom-0 left-0 right-0 opacity-20">
            <img
              className="w-full h-auto"
              src={Trama}
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Formulario de Forgot Password */}
        <div className="bg-secondary md:bg-neutral md:rounded-r-3xl p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-heading font-bold text-neutral md:text-tertiary mb-2">
              Recuperar Contraseña
            </h1>
            <p className="text-neutral/60 md:text-tertiary/60 font-body">
              Ingresa tu email y te enviaremos instrucciones para recuperar tu
              contraseña
            </p>
          </div>

          {!success ? (
            <form onSubmit={onSubmit} className="space-y-6" method="post">
              {/* Campo Email */}
              <Input
                {...email}
                id="email"
                name="email"
                label="Correo Electrónico"
                placeholder="tu.correo@ejemplo.com"
                required
                autoComplete="email"
                disabled={loading}
                error={emailError}
                onBlur={handleEmailBlur}
                helperText="Ingresa el email con el que te registraste"
                responsiveDarkMode
              />

              {/* Error Alert - Solo mostrar errores del servidor */}
              {error && !emailError && (
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
                {loading ? "Enviando" : "Enviar Instrucciones"}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-neutral/20">
                <p className="text-neutral/70 md:text-tertiary/70 font-body">
                  ¿Recordaste tu contraseña?{" "}
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
          ) : (
            // Mensaje de éxito
            <div className="space-y-6">
              <div className="bg-green-50 border-2 border-green-500 text-green-800 px-6 py-4 rounded-lg">
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
                    <h3 className="font-heading font-bold text-lg mb-2">
                      ¡Email Enviado!
                    </h3>
                    <p className="font-body text-sm">{successMessage}</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/10 border border-secondary p-4 rounded-lg">
                <h4 className="font-heading font-semibold text-neutral mb-2">
                  📬 Revisa tu bandeja de entrada
                </h4>
                <ul className="font-body text-sm text-neutral space-y-1 list-disc list-inside">
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

              <div className="text-center pt-4 border-t border-neutral/20">
                <Link
                  to="/login"
                  className="text-neutral hover:text-primary font-semibold font-body
                    transition-colors duration-200 focus:outline-none focus:ring-2
                    focus:ring-primary/50 rounded px-1"
                >
                  ← Volver al Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
