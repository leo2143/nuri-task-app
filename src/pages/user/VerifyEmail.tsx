import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, TramaHeader } from "../../components/ui";
import { useAppNavigate, useAuth } from "../../hooks";
import { userService } from "../../services/userService";
import { nuriAlegre, nuriTriste } from "../../assets/ilustrations";

type VerifyState = "loading" | "success" | "error";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useAppNavigate();
  const { login } = useAuth();
  const [state, setState] = useState<VerifyState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;

    const token = searchParams.get("token");
    if (!token) {
      setState("error");
      setErrorMessage("No se encontró el token de verificación");
      return;
    }

    hasVerified.current = true;

    const verify = async () => {
      try {
        const result = await userService.verifyEmail(token);
        if (result.token && result.user) {
          login(result.user, result.token);
        }
        setState("success");
      } catch (error: unknown) {
        setState("error");
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          setErrorMessage(
            axiosError.response?.data?.message || "Token inválido o expirado",
          );
        } else {
          setErrorMessage("Ocurrió un error al verificar tu email");
        }
      }
    };

    verify();
  }, [searchParams, login]);

  return (
    <section className="min-h-screen flex flex-col bg-secondary">
      <TramaHeader />

      <div className="relative flex-1 px-8 pt-6 pb-10 flex flex-col items-center justify-center gap-5">
        {state === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-body text-sm text-neutral/80 text-center">
              Verificando tu email...
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <img
              src={nuriAlegre}
              alt="Nuri alegre"
              className="w-40 h-40 object-contain"
            />
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-heading font-bold text-neutral text-center">
                ¡Email verificado!
              </h1>
              <p className="text-neutral/80 font-body text-center text-sm">
                Tu cuenta está activa. ¡Bienvenido a Nuri Task!
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <Button
                onClick={() => navigate("/", { replace: true })}
                variant="primary"
                size="md"
                fullWidth
              >
                Empezar a usar Nuri
              </Button>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <img
              src={nuriTriste}
              alt="Nuri triste"
              className="w-40 h-40 object-contain"
            />
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-heading font-bold text-neutral text-center">
                No pudimos verificar
              </h1>
              <p className="text-neutral/80 font-body text-center text-sm">
                {errorMessage}
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <Button
                onClick={() => navigate("/login")}
                variant="primary"
                size="md"
                fullWidth
              >
                Volver al inicio
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
