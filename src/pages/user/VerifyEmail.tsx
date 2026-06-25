import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui";
import { useAppNavigate } from "../../hooks";
import { userService } from "../../services/userService";
import { nuriAlegre, nuriTriste } from "../../assets/ilustrations";
import TramaBlue from "../../assets/icons/trama-blue.svg";

type VerifyState = "loading" | "success" | "error";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useAppNavigate();
  const [state, setState] = useState<VerifyState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setState("error");
      setErrorMessage("No se encontró el token de verificación");
      return;
    }

    const verify = async () => {
      try {
        await userService.verifyEmail(token);
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
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <img
        src={TramaBlue}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full gap-6">
        {state === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-body text-tertiary">
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
            <h1 className="text-3xl font-heading font-bold text-tertiary">
              ¡Email verificado!
            </h1>
            <p className="text-lg font-body text-tertiary/80">
              Tu cuenta está activa. Ya podés iniciar sesión y empezar a usar
              Nuri Task.
            </p>
            <Button
              onClick={() => navigate("/login")}
              variant="primary"
              fullWidth
            >
              Ir a iniciar sesión
            </Button>
          </>
        )}

        {state === "error" && (
          <>
            <img
              src={nuriTriste}
              alt="Nuri triste"
              className="w-40 h-40 object-contain"
            />
            <h1 className="text-3xl font-heading font-bold text-tertiary">
              No pudimos verificar
            </h1>
            <p className="text-lg font-body text-tertiary/80">
              {errorMessage}
            </p>
            <Button
              onClick={() => navigate("/login")}
              variant="primary"
              fullWidth
            >
              Volver al inicio
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
