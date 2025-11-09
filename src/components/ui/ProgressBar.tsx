interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  height?: "sm" | "md" | "lg";
  color?: string;
  bgColor?: string;
}

export default function ProgressBar({
  progress,
  label = "Progreso",
  showPercentage = true,
  height = "md",
  color = "bg-primary",
  bgColor = "bg-gray-300",
}: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress || 0, 0), 100);

  const heightClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className="mb-4">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-tertiary">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-bold text-primary">
              {safeProgress}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${bgColor} rounded-full ${heightClasses[height]}`}
      >
        <div
          className={`${color} ${heightClasses[height]} rounded-full transition-all duration-300`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}
