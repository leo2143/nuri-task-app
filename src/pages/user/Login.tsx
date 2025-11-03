import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import type { ILoginUser } from "../../interfaces/IUser";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import { useField, useHttpError } from "../../hooks";
import { Button, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { validateEmail, validatePassword } from "../../utils/validations";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Hook para manejar errores HTTP
  const { error, errorMessage, handleError, clearError } = useHttpError();

  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const email = useField("email");
  const password = useField("password");

  const validar = (): { email?: string; password?: string } | null => {
    const errors: { email?: string; password?: string } = {};

    const emailValidation = validateEmail(email.value);
    if (emailValidation) errors.email = emailValidation;

    const passwordValidation = validatePassword(password.value);
    if (passwordValidation) errors.password = passwordValidation;

    return Object.keys(errors).length > 0 ? errors : null;
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email.value) || "");
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password.value) || "");
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // validar formulario
    const errorValidacion = validar();
    if (errorValidacion) {
      setEmailError(errorValidacion.email || "");
      setPasswordError(errorValidacion.password || "");
      return;
    }

    // Limpiar errores si la validación pasa
    setEmailError("");
    setPasswordError("");
    clearError();

    // activo loading
    setLoading(true);

    try {
      const loginData: ILoginUser = {
        email: email.value,
        password: password.value,
      };
      const authResponse = await userService.login(loginData);

      login(authResponse.user, authResponse.token);

      // 6. Redirigir al home o dashboard
      navigate("/");
    } catch (error: unknown) {
      console.error("Error en login:", error);
      handleError(error);
    } finally {
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
              ¡Bienvenido de Nuevo!
            </h2>
            <p className="text-lg text-tertiary/70 font-body">
              Gestiona tus tareas de manera eficiente y aumenta tu productividad
            </p>
          </div>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-tertiary mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-tertiary/60 font-body">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-6"
            method="post"
            noValidate
          >
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
            />

            {/* Campo Password */}
            <Input
              {...password}
              id="password"
              name="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              required
              autoComplete="current-password"
              disabled={loading}
              error={passwordError}
              onBlur={handlePasswordBlur}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-secondary font-medium 
                  transition-colors duration-200 focus:outline-none focus:ring-2 
                  focus:ring-primary/50 rounded px-1"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Error Alert - Solo mostrar errores del servidor */}
            {error && !emailError && !passwordError && (
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
              {loading ? "Iniciando sesión" : "Iniciar Sesión"}
            </Button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-neutral/20">
              <p className="text-tertiary/70 font-body">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-secondary font-semibold 
                    transition-colors duration-200 focus:outline-none focus:ring-2 
                    focus:ring-primary/50 rounded px-1"
                >
                  Créala aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
