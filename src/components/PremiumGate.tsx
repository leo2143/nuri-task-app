import { useAuth } from "../hooks";
import SubscriptionPlan from "./ui/SubscriptionPlan";

interface PremiumGateProps {
  children: React.ReactNode;
  featureName?: string;
}

export default function PremiumGate({ children, featureName = "esta funcionalidad" }: PremiumGateProps) {
  const { isPremium } = useAuth();

  if (isPremium) {
    return <>{children}</>;
  }

  return <SubscriptionPlan featureName={featureName} />;
}
