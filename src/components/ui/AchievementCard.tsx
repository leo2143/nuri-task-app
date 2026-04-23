import ProgressBar from "./ProgressBar";
import type { IUserAchievement } from "../../interfaces";

interface AchievementCardProps {
  achievement: IUserAchievement;
}

/**
 * Tarjeta de logro con tres estados:
 * - inaccessible (premium + usuario free): saturado-0 + overlay PRO
 * - en progreso (locked/unlocked): saturado-0 + barra de progreso
 * - completado: color completo
 */
export default function AchievementCard({ achievement }: AchievementCardProps) {
  const { userProgress, isAccessible, imageUrl, title, description, targetCount } = achievement;
  const isCompleted = isAccessible && userProgress.status === "completed";
  const progressPercent =
    isAccessible && targetCount > 0
      ? Math.min(Math.round((userProgress.currentCount / targetCount) * 100), 100)
      : 0;

  return (
    <article
      className={`relative flex flex-col gap-3 items-center shadow-brand-achievement pt-5 pb-8 px-2 bg-white rounded-xl overflow-hidden
        ${!isCompleted ? "saturate-0" : ""}`}
    >
      {!isAccessible && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 z-10 gap-1">
          <svg
            className="w-7 h-7 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            PRO
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1 items-center">
        <img
          className="w-[80px] h-[80px] rounded-full"
          src={imageUrl}
          alt={title}
        />
        <h3 className="text-base text-center">{title}</h3>
      </div>

      <p className="text-center font-bold text-xs">{description}</p>

      {isAccessible && !isCompleted && (
        <div className="w-full px-2">
          <ProgressBar
            variant="inline"
            progress={progressPercent}
            showPercentage={false}
            height="sm"
          />
          <p className="text-center text-[10px] text-gray-400 mt-1">
            {userProgress.currentCount} / {targetCount}
          </p>
        </div>
      )}
    </article>
  );
}
