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
    <div className="relative flex flex-col items-center h-full bg-secondary gap-10 overflow-hidden">
      <div className="onboarding-trama-bg w-full h-32 overflow-x-visible" />

      <div className="text-center">
        <h1 className="text-[40px] leading-tight font-heading font-bold text-neutral">
          Bienvenido
        </h1>
        <h1 className="text-[48px] leading-tight font-heading font-bold text-neutral">
          a Nuri Task
        </h1>
      </div>

      <div className="flex items-center justify-center">
        <img
          src={nuriCompleto}
          alt="Nuri mascota dándote la bienvenida"
          className="w-52 h"
        />
      </div>

      <p className="text-center font-body font-bold text-base text-white px-8">
        Organizá tus metas, avanzá a tu ritmo y dejá que Nuri te acompañe en
        el camino.
      </p>
    </div>
  );
}

function Step2() {
  return (
    <div className="relative flex flex-col items-center min-h-screen bg-neutral overflow-visible">
      <div className="flex justify-center mb-10">
        <img
          src={plantDecoration}
          alt=""
          className=""
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-4 px-5 flex-1 w-full">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className={`${feature.bg} rounded-lg shadow-[0px_4px_5px_0px_rgba(0,0,0,0.25)] overflow-hidden flex items-center h-[138px]`}
          >
            <div className="w-[130px] shrink-0 flex items-center justify-center self-stretch">
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
    <div className="relative flex flex-col items-center min-h-screen bg-neutral overflow-hidden">
      <div className="onboarding-trama-bg w-full pt-36 overflow-x-visible" />
      <div className="relative flex-1 flex flex-col items-center justify-center w-full">
        <img
          src={nenuDeco}
          alt=""
          className="absolute top-16 right-0"
          aria-hidden="true"
        />

        <div className="text-center mb-6 px-6">
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
          className="absolute bottom-14 left-0  "
          aria-hidden="true"
        />
      </div>

      <div className="w-full flex justify-center -mt-8">
        <img
          src={nuriHappy}
          alt="Nuri feliz celebrando"
          className="relative bottom-20 w-72 h-auto"
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
    <section className="relative h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden min-h-0">
        <CurrentStep />
      </div>

      <div
        className={`sticky bottom-0 px-5 pb-8 pt-4 ${
          step === 0 ? "bg-secondary" : "bg-neutral"
        }`}
      >
        <StepIndicator total={STEPS.length} current={step} />
        <div className="mt-4">
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
