import { useState } from "react";
import { useAuth } from "../../hooks";
import { subscriptionService } from "../../services/subscriptionService";
import { nuriAlegre } from "../../assets/ilustrations";
import { Button } from "../../components/ui";

const FREE_FEATURES = [
  "Crear tareas",
  "Crear hasta 2 metas",
  "Logros basicos",
];

const PREMIUM_FEATURES = [
  "Submetas ilimitadas",
  "Metas ilimitadas",
  "Metricas",
  "Moodboard",
  "Logros avanzados",
];

export default function Subscription() {
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

  return (
    <section className="flex flex-col gap-8 items-center">
      <div className="text-center">
        <h2 className="font-heading font-bold text-tertiary">
          Elegí tu plan
        </h2>
        <p className="text-gray-700 text-sm mt-2">
          Desbloqueá funcionalidades premium para potenciar tu productividad.
        </p>
      </div>

      <div className="w-full flex flex-col gap-6 max-w-md">
        <article className="rounded-2xl bg-brand/20 p-6 border-2 border-brand/30">
          <h3 className="font-heading font-bold text-tertiary text-lg mb-4">
            Acceso Gratis
          </h3>
          <ul className="flex flex-col gap-2">
            {FREE_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-tertiary font-body"
              >
                <span className="text-primary font-bold">&#10003;</span>
                {feature}
              </li>
            ))}
          </ul>

          {!isPremium && (
            <p className="mt-4 text-xs text-gray-500 font-body text-center">
              Plan actual
            </p>
          )}
        </article>

        <article className="rounded-2xl bg-primary/10 p-6 border-2 border-primary shadow-brand-glow relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-heading font-bold text-tertiary text-lg">
                Suscripcion mensual
              </h3>
              <p className="text-3xl font-heading font-bold text-primary mt-1">
                USD $15
                <span className="text-sm font-normal text-gray-500">
                  /mes
                </span>
              </p>
            </div>
            <img
              src={nuriAlegre}
              alt="Nuri alegre"
              className="w-20 h-20 -mt-2 -mr-2"
            />
          </div>

          <ul className="flex flex-col gap-2 mt-4">
            {PREMIUM_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-tertiary font-body"
              >
                <span className="text-primary font-bold">&#10003;</span>
                {feature}
              </li>
            ))}
          </ul>

          {isPremium ? (
            <p className="mt-5 text-center text-sm font-heading font-semibold text-primary">
              Ya sos premium
            </p>
          ) : (
            <div className="mt-5 flex flex-col gap-2">
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={handleActivate}
                disabled={isActivating}
              >
                {isActivating ? "Redirigiendo a MercadoPago..." : "Suscribirme ahora"}
              </Button>
              {error && (
                <p className="text-red-500 text-xs text-center font-body">
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
