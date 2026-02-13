import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import type { ILoginUser } from "../../interfaces/IUser";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import { useField, useHttpError, useAuth } from "../../hooks";
import { Button, Input } from "../../components/ui";
import { validateEmail, validatePassword } from "../../utils/validations";
import GoogleIcon from "../../assets/icons/google.svg";
import TramaBlue from "../../assets/icons/trama-blue.svg";
import { nuriConNenu } from "../../assets/ilustrations/index";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

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

    const errorValidacion = validar();
    if (errorValidacion) {
      setEmailError(errorValidacion.email || "");
      setPasswordError(errorValidacion.password || "");
      return;
    }

    setEmailError("");
    setPasswordError("");
    clearError();

    setLoading(true);

    try {
      const loginData: ILoginUser = {
        email: email.value,
        password: password.value,
      };
      const authResponse = await userService.login(loginData);

      login(authResponse.user, authResponse.token);

      navigate("/");
    } catch (error: unknown) {
      console.error("Error en login:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col bg-background">
      {loading && <Loading />}

      <div className="relative flex items-center justify-center pt-40 overflow-x-hidden overflow-x-visible">
        <img
          src={TramaBlue}
          alt=""
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 max-w-none  z-10"
        />

        <img
          src={nuriConNenu}
          alt="Nuri mascota"
          className="absolute w-52 h-auto z-10 top-5  mx-auto"
        />
      </div>

      <div className="relative flex-1 bg-secondary rounded-t-[2.5rem] px-8 pt-20 pb-10 flex flex-col">

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-heading font-bold text-neutral mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-neutral font-bold text-sm">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 w-full"
          method="post"
          noValidate
        >
          <Input
            {...email}
            id="email"
            name="email"
            label="Correo electrónico"
            placeholder="tuemail@email.com"
            required
            autoComplete="email"
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
            autoComplete="current-password"
            disabled={loading}
            error={passwordError}
            onBlur={handlePasswordBlur}
            darkMode
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-primary font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
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
            size="md"
            fullWidth
          >
            {loading ? "Iniciando sesión" : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-neutral font-bold text-sm">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-primary text-sm font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
            >
              Créala aquí
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 my-4">
          <div className="bg-primary h-1 flex-1 rounded"></div>
          <p className="text-neutral font-bold font-body text-sm">O continúa con</p>
          <div className="bg-primary h-1 flex-1 rounded"></div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-white shadow-lg w-14 h-14 hover:shadow-xl transition-shadow duration-200 cursor-pointer">
            <img
              className="w-7 h-7"
              src={GoogleIcon}
              alt="Continuar con Google"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
