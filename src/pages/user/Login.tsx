import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import type { ILoginUser } from "../../interfaces/IUser";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import { useField, useHttpError, useAuth } from "../../hooks";
import { Button, Input } from "../../components/ui";
import { validateEmail, validatePassword } from "../../utils/validations";
import Nuri from "../../assets/ilustrations/nuri-completo.svg";
import GoogleIcon from "../../assets/icons/google.svg";
import Trama from "../../assets/icons/trama-white.svg";

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
    <section className="min-h-screen flex items-center justify-center lg:px-4 lg:py-12">
      {loading && <Loading />}

      <div className="w-full md:max-w-6xl grid md:grid-cols-2 gap-0 items-stretch overflow-hidden md:rounded-3xl md:shadow-2xl h-screen md:h-auto">
        {/* Sección del Dibujo - Oculta en móvil */}
        <div className="hidden md:flex relative bg-secondary flex-col items-center justify-center h-full px-8 py-12">
          <div className="text-center flex flex-col justify-center items-center gap-10 z-10">
            <h1 className="text-5xl font-heading font-bold text-white drop-shadow-lg">
              Bienvenido a Nuri Task
            </h1>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <img className="w-64" src={Nuri} alt="Nuri mascota" />
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

        {/* Sección del Formulario - Visible en móvil y desktop */}
        <div className=" bg-secondary md:bg-neutral lg:rounded-r-3xl p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-heading font-bold  md:text-tertiary text-neutral mb-2">
              Iniciar Sesión
            </h2>
            <p className=" md:text-tertiary/60 text-neutral/60 font-body">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-6 w-full"
            method="post"
            noValidate
          >
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
              responsiveDarkMode
            />

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
              responsiveDarkMode
            />

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

            {error && !emailError && !passwordError && (
              <div className="animate-shake">
                <Alert msg={errorMessage} />
              </div>
            )}

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
          </form>
          {/* Sección de Registro */}
          <div className="text-center pt-4 border-t border-neutral/20">
            <p className=" md:text-tertiary/70 text-neutral/70 font-body">
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

          {/* Divider */}
          <div className="flex items-center justify-center gap-2 m-2">
            <div className="bg-primary h-1 w-2/12 sm:w-2/5 rounded"></div>
            <p className="md:text-tertiary/70 text-neutral/70 font-body text-xs sm:text-sm">
              O continúa con
            </p>
            <div className="bg-primary h-1 w-2/12 sm:w-2/5 rounded"></div>
          </div>

          {/* Botón de Google */}
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center justify-center rounded-full bg-white shadow-lg w-14 h-14 hover:shadow-xl transition-shadow duration-200 cursor-pointer">
              <img
                className="w-7 h-7"
                src={GoogleIcon}
                alt="Continuar con Google"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
