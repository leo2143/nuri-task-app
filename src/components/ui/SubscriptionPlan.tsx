import { useState } from "react";
import { useAuth } from "../../hooks";
import { subscriptionService } from "../../services/subscriptionService";
import { nuriPatas, nuriPremium } from "../../assets/ilustrations";
import { SUBSCRIPTION_PRICE } from "../../config/env";
import Button from "./Button";
import { checkGreen, flowerCutRight } from "../../assets/svg-icons";

const PREMIUM_FEATURES = [
  "Submetas ilimitadas",
  "Metas ilimitadas",
  "Métricas",
  "Moodboard",
  "Logros avanzados",
];

interface SubscriptionPlanProps {
  featureName?: string;
}

export default function SubscriptionPlan({
  featureName,
}: SubscriptionPlanProps) {
  const { isPremium } = useAuth();
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    try {
      setIsActivating(true);
      setError(null);
      const { init_point } = await subscriptionService.activate();
      window.location.href = init_point;
    } catch (err) {
      console.error("Error al iniciar suscripcion:", err);
      setError("No pudimos iniciar el pago, ¿podés intentar de nuevo?");
      setIsActivating(false);
    }
  };

  const subtitle = featureName
    ? `¡Descubrí tu potencial con ${featureName} y seguí avanzando!`
    : "¡Descubrí tu potencial y seguí avanzando!";

  return (
    <section className="flex flex-col items-center gap-6 text-center px-4 py-8">
      <div>
        <h2 className="font-heading font-bold text-tertiary text-2xl">
          Funcionalidad Premium
        </h2>
        <p className="text-brand font-heading font-bold text-base mt-2">
          {subtitle}
        </p>
      </div>

      <div className="w-full max-w-sm relative mt-48 items-center justify-center">
        <div className="absolute h-full w-full -top-[10.5rem]">
          <img
            src={nuriPremium}
            alt="Nuri con corona premium"
            className=" h-auto mx-auto relative z-0 "
          />

          <img
            src={nuriPatas}
            alt=""
            aria-hidden="true"
            className=" h-auto mx-auto relative z-30 -top-[9.8rem]"
          />
        </div>
        <article className="relative z-10 rounded-2xl bg-secondary p-6 pt-8 text-left">
          <h3 className="font-heading font-bold text-neutral text-xl mb-4 text-center">
            Suscripción Mensual
          </h3>
          <img
            src={flowerCutRight}
            alt="Flor cortada a la derecha"
            className="absolute top-1/3 right-0"
          />
          <ul className="flex flex-col gap-3 mb-5">
            {PREMIUM_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-neutral font-body font-bold"
              >
                <img src={checkGreen} alt="" aria-hidden="true" className="flex-shrink-0 w-5 h-5" />
                {feature}
              </li>
            ))}
          </ul>

          <p className="text-brand font-body font-bold text-xl text-center mb-4">
            USD ${SUBSCRIPTION_PRICE}
          </p>

          {isPremium ? (
            <p className="text-center text-sm font-heading font-semibold text-brand">
              Ya sos premium
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={handleActivate}
                disabled={isActivating}
              >
                {isActivating ? "Redirigiendo a MercadoPago..." : "Obtener"}
              </Button>
              {error && (
                <p className="text-red-400 text-xs text-center font-body">
                  {error}
                </p>
              )}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
