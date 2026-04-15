import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";
import { useAuth } from "../../hooks";
import { userService } from "../../services/userService";

import { nuriCompleto } from "../../assets/ilustrations";
import cardNuri from "../../assets/ilustrations/onboarding/card-nuri.svg";
import cardGoals from "../../assets/ilustrations/onboarding/card-goals.svg";
import cardTasks from "../../assets/ilustrations/onboarding/card-tasks.svg";
import cardBoard from "../../assets/ilustrations/onboarding/card-board.svg";
import nuriHappy from "../../assets/ilustrations/onboarding/nuri-happy.svg";
import nenuDeco from "../../assets/ilustrations/onboarding/nenu-deco.svg";
import flowerIcon from "../../assets/ilustrations/onboarding/flower-icon.svg";
import plantDecoration from "../../assets/ilustrations/onboarding/plant-decoration.svg";

const FEATURES = [
  {
    title: "Nuri",
    description: "te va a acompañar con frases motivacionales.",
    image: cardNuri,
    bg: "bg-primary-dark",
    textColor: "text-white",
    imgClass: "w-[110px] -mb-9",
  },
  {
    title: "Crea metas claras",
    description:
      "Definí objetivos simples, medibles y realistas para construir el camino hacia lo que quieres.",
    image: cardGoals,
    bg: "bg-brand",
    textColor: "text-tertiary",
    imgClass: "w-[93px] h-[88px] object-contain",
  },
  {
    title: "Organiza tareas",
    description: "Dividí tus metas en pasos pequeños.",
    image: cardTasks,
    bg: "bg-[#EDCBB1]",
    textColor: "text-tertiary",
    imgClass: "w-[81px] h-[81px] object-contain",
  },
  {
    title: "Diseñá tu Visual Board",
    description: "Visualiza tus metas.",
    image: cardBoard,
    bg: "bg-secondary-dark",
    textColor: "text-white",
    imgClass: "w-[87px] h-[91px] object-contain",
  },
] as const;

function StepIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === current ? "w-8 bg-primary" : "w-2 bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function Step1() {
  return (
    <div className="h-full bg-secondary overflow-y-auto">
      <div className="onboarding-trama-bg w-full h-28 overflow-x-visible" />

      <div className="text-center mt-4">
        <h1 className="text-[clamp(2rem,8vw,2.5rem)] leading-tight font-heading font-bold text-neutral">
          Bienvenido
        </h1>
        <h1 className="text-[clamp(2.5rem,10vw,3rem)] leading-tight font-heading font-bold text-neutral">
          a Nuri Task
        </h1>
      </div>

      <div className="flex justify-center pt-4 pr-5">
        <img
          src={nuriCompleto}
          alt="Nuri mascota dándote la bienvenida"
          className="w-52 "
        />
      </div>

      <p className="text-center font-body font-bold text-base text-white px-8 pt-4 pb-2">
        Organizá tus metas, avanzá a tu ritmo y dejá que Nuri te acompañe en
        el camino.
      </p>
    </div>
  );
}

function Step2() {
  return (
    <div className="h-full bg-neutral overflow-y-auto">
      <div className="flex justify-center">
        <img
          src={plantDecoration}
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-5 px-5 pb-4 pt-10">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className={`${feature.bg} rounded-lg shadow-[0px_4px_5px_0px_rgba(0,0,0,0.25)] overflow-hidden flex items-center shrink-0 min-h-[120px]`}
          >
            <div className="w-[120px] shrink-0 flex items-center justify-center self-stretch">
              <img
                src={feature.image}
                alt={feature.title}
                className={feature.imgClass}
              />
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <h3
                className={`font-heading font-bold text-base ${feature.textColor} mb-1`}
              >
                {feature.title}
              </h3>
              <p
                className={`font-body text-sm ${feature.textColor} leading-snug`}
              >
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="flex flex-col items-center h-full bg-neutral overflow-hidden">
      <div className="onboarding-trama-bg w-full shrink-0 h-[20%] overflow-x-visible" />

      <div className="relative flex-1 flex flex-col items-center justify-center w-full min-h-0 px-6">
        <img
          src={nenuDeco}
          alt=""
          className="absolute top-1 right-0"
          aria-hidden="true"
        />

        <div className="text-center mb-4">
          <h2 className="text-2xl font-heading font-bold text-tertiary mb-4">
            Ya conocés lo esencial
          </h2>
          <p className="text-2xl font-heading font-extrabold text-brand leading-snug">
            ¡Estás listo para empezar a construir tus metas!
          </p>
        </div>

        <img
          src={flowerIcon}
          alt=""
          className="absolute bottom-4 left-0"
          aria-hidden="true"
        />
      </div>

      <div className="w-full flex justify-center shrink-0 max-h-[40%]">
        <img
          src={nuriHappy}
          alt="Nuri feliz celebrando"
          className="max-h-full w-auto object-contain"
        />
      </div>
    </div>
  );
}

const STEPS = [Step1, Step2, Step3] as const;

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const isLastStep = step === STEPS.length - 1;
  const CurrentStep = STEPS[step];

  const handleNext = async () => {
    if (isLastStep) {
      setLoading(true);
      try {
        await userService.completeOnboarding();
        if (user) {
          updateUser({ ...user, onboardingCompleted: true });
        }
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Error al completar onboarding:", error);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <section className="relative flex flex-col overflow-hidden h-[100dvh]">
      <div className="flex-1 overflow-hidden min-h-0">
        <CurrentStep />
      </div>

      <div
        className={`shrink-0 px-5 pb-safe-bottom pt-3 ${
          step === 0 ? "bg-secondary" : "bg-neutral"
        }`}
      >
        <StepIndicator total={STEPS.length} current={step} />
        <div className="mt-3 pb-4">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleNext}
            loading={loading}
            disabled={loading}
          >
            {isLastStep ? "Comencemos" : "Siguiente"}
          </Button>
        </div>
      </div>
    </section>
  );
}
