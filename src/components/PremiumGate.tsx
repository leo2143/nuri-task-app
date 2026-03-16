import { useAuth } from "../hooks";
import { ButtonLink } from "./ui";
import { nuriLentes } from "../assets/ilustrations";

interface PremiumGateProps {
  children: React.ReactNode;
  featureName?: string;
}

export default function PremiumGate({ children, featureName = "esta funcionalidad" }: PremiumGateProps) {
  const { isPremium } = useAuth();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <section className="flex flex-col items-center justify-center gap-6 text-center py-12 px-4">
      <img
        src={nuriLentes}
        alt="Nuri con lentes"
        className="w-36 h-36"
      />

      <h2 className="font-heading font-bold text-tertiary text-xl">
        Funcionalidad Premium
      </h2>
      <p className="text-gray-700 text-sm max-w-sm">
        Necesitas una suscripcion activa para acceder a {featureName}.
        Desbloqueala y llevá tu productividad al siguiente nivel.
      </p>

      <ButtonLink to="/subscription" variant="primary">
        Ver planes
      </ButtonLink>
    </section>
  );
}
