import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, TramaHeader } from "../../components/ui";
import Loading from "../../components/Loading";
import { useAppNavigate, useAuthActions } from "../../hooks";
import { userService } from "../../services/userService";
import { nuriAlegre, nuriTriste } from "../../assets/ilustrations";

type VerifyState = "loading" | "success" | "error";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useAppNavigate();
  const { login } = useAuthActions();
  const [state, setState] = useState<VerifyState>("loading");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;

    const token = searchParams.get("token");
    if (!token) {
      setState("error");
      return;
    }

    hasVerified.current = true;

    const verify = async () => {
      try {
        const result = await userService.verifyEmail(token);
        if (result.user) {
          login(result.user);
        }
        setState("success");
      } catch {
        setState("error");
      }
    };

    verify();
  }, [searchParams, login]);

  if (state === "loading") return <Loading />;

  return (
    <section className="min-h-screen flex flex-col bg-secondary">
      <TramaHeader />

      <div className="relative flex-1 px-8 pt-6 pb-10 flex flex-col items-center justify-center gap-5">
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
                Este enlace ya no es válido
              </h1>
              <p className="text-neutral/80 font-body text-center text-sm">
                El enlace de verificación expiró o ya fue usado. Son válidos por
                1 hora. Pedí uno nuevo e intentá otra vez.
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
