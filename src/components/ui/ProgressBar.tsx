interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  height?: "sm" | "md" | "lg" | "xl" | "2xl";
  color?: string;
  bgColor?: string;
  labelClassName?: string;
  percentageClassName?: string;
  className?: string;
  variant?: "default" | "inline";
}

export default function ProgressBar({
  progress,
  label = "Progreso",
  showPercentage = true,
  height = "sm",
  color = "bg-primary",
  bgColor = "bg-gray-300",
  labelClassName = "text-sm font-medium text-tertiary",
  percentageClassName = "text-sm font-bold text-primary",
  className = "",
  variant = "default",
}: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress || 0, 0), 100);

  const heightClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
    xl: "h-5",
    "2xl": "h-7",
  };

  if (variant === "inline") {
    return (
      <div className={className}>
        <div className={`relative w-full ${bgColor} rounded-full ${heightClasses[height]}`}>
          <div
            className={`${color} ${heightClasses[height]} rounded-full transition-all duration-300 flex items-center justify-center`}
            style={{ width: `${safeProgress}%` }}
          >
            {showPercentage && safeProgress > 0 && (
              <span className={`text-xs font-bold text-tertiary ${safeProgress < 15 ? 'hidden' : ''}`}>
                {safeProgress}%
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className={labelClassName}>{label}</span>
          )}
          {showPercentage && (
            <span className={percentageClassName}>
              {safeProgress}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${bgColor} rounded-full ${heightClasses[height]}`}>
        <div
          className={`${color} ${heightClasses[height]} rounded-full transition-all duration-300`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}
