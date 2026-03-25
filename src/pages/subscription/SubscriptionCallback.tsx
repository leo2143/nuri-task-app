import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { ButtonLink } from "../../components/ui";
import Loading from "../../components/Loading";
import { nuriLentes } from "../../assets/ilustrations";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export default function SubscriptionCallback() {
  const { refreshSubscription, isPremium } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let retries = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    async function checkStatus() {
      await refreshSubscription();
      retries++;
    }

    async function poll() {
      await checkStatus();

      if (retries >= MAX_RETRIES) {
        setChecking(false);
        setFailed(true);
        return;
      }

      timeoutId = setTimeout(poll, RETRY_DELAY_MS);
    }

    poll();

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (isPremium && checking) {
      setChecking(false);
      navigate("/subscription/success", { replace: true });
    }
  }, [isPremium, checking, navigate]);

  if (checking) {
    return (
      <section className="flex flex-col items-center justify-center gap-6 text-center py-12">
        <Loading />
        <p className="text-sm text-gray-600 font-body">
          Estamos verificando tu pago con MercadoPago...
        </p>
      </section>
    );
  }

  if (failed) {
    return (
      <section className="flex flex-col items-center justify-center gap-6 text-center py-12 px-4">
        <img
          src={nuriLentes}
          alt="Nuri procesando"
          className="w-32 h-32"
        />
        <h2 className="font-heading font-bold text-tertiary text-xl">
          Tu pago esta siendo procesado
        </h2>
        <p className="text-gray-700 text-sm max-w-sm font-body">
          MercadoPago puede tardar unos minutos en confirmar el pago. Una vez
          confirmado, las funcionalidades premium se activaran automaticamente.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <ButtonLink to="/" variant="primary" fullWidth>
            Ir al inicio
          </ButtonLink>
          <ButtonLink to="/subscription" variant="secondary" fullWidth>
            Ver planes
          </ButtonLink>
        </div>
      </section>
    );
  }

  return null;
}
