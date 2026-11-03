import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import {
  badgeLogro,
  badgeMeta,
  badgeRacha,
  badgeTarea,
  nuriToastLogro,
  nuriToastMeta,
  nuriToastRacha,
  nuriToastTarea,
} from "../../assets/ilustrations/toast";
import type { ToastItem, ToastKind } from "../../utils/toastQueue";

interface ToastVariant {
  eyebrow: string;
  cardClass: string;
  bubbleClass: string;
  ringClass: string;
  badgeClass: string;
  eyebrowClass: string;
  trackClass: string;
  progressClass: string;
  image: string;
  badgeIcon: string;
}

const SWIPE_DISMISS_PX = 40;
const TAP_MAX_MOVE_PX = 8;

const VARIANTS: Record<ToastKind, ToastVariant> = {
  achievement: {
    eyebrow: "LOGRO DESBLOQUEADO",
    cardClass:
      "border-[#F2C879] shadow-[0_0_8px_#F2C8798C,0_8px_20px_rgba(58,37,29,0.12)]",
    bubbleClass: "bg-[#FCECC9]",
    ringClass: "border-[#F2C879]",
    badgeClass: "border-[#F2C879]",
    eyebrowClass: "text-[#905734]",
    trackClass: "bg-[#F2C87940]",
    progressClass: "bg-[#905734]",
    image: nuriToastLogro,
    badgeIcon: badgeLogro,
  },
  goal: {
    eyebrow: "META CUMPLIDA",
    cardClass:
      "border-[#75BDC9] shadow-[0_0_8px_#75BDC98C,0_8px_20px_rgba(58,37,29,0.12)]",
    bubbleClass: "bg-[#DCF0F3]",
    ringClass: "border-[#75BDC9]",
    badgeClass: "border-[#75BDC9]",
    eyebrowClass: "text-[#257D6F]",
    trackClass: "bg-[#75BDC940]",
    progressClass: "bg-[#257D6F]",
    image: nuriToastMeta,
    badgeIcon: badgeMeta,
  },
  streak: {
    eyebrow: "RACHA EN MARCHA",
    cardClass:
      "border-[#F4A06B] shadow-[0_0_8px_#F4A06B8C,0_8px_20px_rgba(58,37,29,0.12)]",
    bubbleClass: "bg-[#FDE8DC]",
    ringClass: "border-[#F4A06B]",
    badgeClass: "border-[#F4A06B]",
    eyebrowClass: "text-[#D0411F]",
    trackClass: "bg-[#F4A06B40]",
    progressClass: "bg-[#D0411F]",
    image: nuriToastRacha,
    badgeIcon: badgeRacha,
  },
  task: {
    eyebrow: "TAREA COMPLETADA",
    cardClass:
      "border-[#BEE6DB] shadow-[0_0_8px_#2F96858C,0_8px_20px_rgba(58,37,29,0.12)]",
    bubbleClass: "bg-[#E3F4EE]",
    ringClass: "border-[#2F9685]",
    badgeClass: "border-[#2F9685]",
    eyebrowClass: "text-[#1D5E52]",
    trackClass: "bg-[#2F968540]",
    progressClass: "bg-[#1D5E52]",
    image: nuriToastTarea,
    badgeIcon: badgeTarea,
  },
};

interface NuriToastProps {
  toast: ToastItem;
  version: number;
  onExitStart: () => void;
  onDismiss: () => void;
}

export default function NuriToast({
  toast,
  version,
  onExitStart,
  onDismiss,
}: NuriToastProps) {
  const variant = VARIANTS[toast.kind];
  const [leaving, setLeaving] = useState(false);
  const [held, setHeld] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ startY: number; moved: number } | null>(null);

  const requestExit = () => {
    if (leaving) return;
    setLeaving(true);
    onExitStart();
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    gesture.current = { startY: event.clientY, moved: 0 };
    setHeld(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current) return;
    const deltaY = event.clientY - current.startY;
    current.moved = Math.max(current.moved, Math.abs(deltaY));
    if (cardRef.current) {
      cardRef.current.style.translate = deltaY < 0 ? `0 ${deltaY}px` : "";
    }
  };

  const finishGesture = (
    event: PointerEvent<HTMLDivElement>,
    cancelled: boolean,
  ) => {
    const current = gesture.current;
    gesture.current = null;
    setHeld(false);
    if (cardRef.current) cardRef.current.style.translate = "";
    if (!current || cancelled) return;

    const swipedUp = current.startY - event.clientY > SWIPE_DISMISS_PX;
    const tapped = current.moved <= TAP_MAX_MOVE_PX;
    if (swipedUp || tapped) requestExit();
  };

  return (
    <div
      ref={cardRef}
      data-held={held}
      className={`nuri-toast relative w-full cursor-pointer touch-none select-none overflow-hidden rounded-2xl border-[1.5px] bg-white font-body ${
        variant.cardClass
      } ${leaving ? "nuri-toast-exit" : "nuri-toast-enter"}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => finishGesture(event, false)}
      onPointerCancel={(event) => finishGesture(event, true)}
      onAnimationEnd={(event) => {
        if (leaving && event.target === event.currentTarget) onDismiss();
      }}
    >
      <div className="flex items-center gap-3.5 py-3.5 pr-4 pl-3.5">
        <div className="relative h-16 w-16 shrink-0">
          <div
            className={`relative h-16 w-16 overflow-hidden rounded-full ${variant.bubbleClass}`}
          >
            <img
              src={variant.image}
              alt=""
              width={64}
              height={64}
              className="block h-16 w-16 max-w-none"
              draggable={false}
            />
            <span
              className={`pointer-events-none absolute inset-0 rounded-full border-2 ${variant.ringClass}`}
              aria-hidden="true"
            />
          </div>
          <span
            className={`absolute left-11 top-11 flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] bg-white ${variant.badgeClass}`}
          >
            <img
              src={variant.badgeIcon}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-[1.5px] -top-[1.5px] h-6 w-6 max-w-none"
            />
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-0.5">
          <span
            className={`text-[11px] font-extrabold uppercase tracking-[0.8px] ${variant.eyebrowClass}`}
          >
            {variant.eyebrow}
          </span>
          <span className="text-[17px] font-extrabold leading-tight text-[#3A251D] break-words">
            {toast.title}
          </span>
          <span className="text-[13px] font-semibold leading-[18px] text-[#6B564C]">
            {toast.message}
          </span>
        </div>
      </div>

      <div
        className={`h-1 w-full ${variant.trackClass}`}
        aria-hidden="true"
      >
        <div
          key={`${toast.id}-${version}`}
          className={`nuri-toast-progress h-full w-full origin-left ${variant.progressClass}`}
          onAnimationEnd={requestExit}
        />
      </div>
    </div>
  );
}
