interface StreakCardProps {
  label: string;
  value: number;
  icon: string;
  iconAlt?: string;
  textColor?: string;
}

export function StreakCard({
  label,
  value,
  icon,
  iconAlt = "",
  textColor = "text-tertiary"
}: StreakCardProps) {
  return (
    <div className="relative overflow-hidden w-full bg-white rounded-lg shadow-lg shadow-tertiary-dark/25 flex flex-col items-center gap-5">
      <span className="text-base font-bold pt-5">{label}</span>
      <div className="w-full flex items-start justify-between">
        <img src={icon} alt={iconAlt} className="block h-[80px]" />
        <strong className={`text-6xl mr-4 ${textColor}`}>{value}</strong>
      </div>
    </div>
  );
}

