import { ButtonLink } from "../../components/ui";
import { nuriCorazon } from "../../assets/ilustrations";

export default function SubscriptionSuccess() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 text-center py-12">
      <img
        src={nuriCorazon}
        alt="Nuri celebrando"
        className="w-40 h-40"
      />

      <h2 className="font-heading font-bold text-tertiary text-2xl">
        ¡Bienvenido a Premium!
      </h2>
      <p className="text-gray-700 text-sm max-w-sm">
        Tu suscripcion fue activada correctamente. Ahora tenes acceso a todas
        las funcionalidades: moodboard, metricas completas, logros avanzados y
        metas ilimitadas.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <ButtonLink to="/" variant="primary" fullWidth>
          Ir al inicio
        </ButtonLink>
        <ButtonLink to="/moodboard" variant="secondary" fullWidth>
          Explorar moodboard
        </ButtonLink>
      </div>
    </section>
  );
}
