interface MetricCardProps {
  label: string;
  value: number;
  textColor: string;
  icon: string;
  iconAlt?: string;
}

export function MetricCard({ label, value, icon, iconAlt = "icono de métrica", textColor = "text-tertiary" }: MetricCardProps) {
  return (
    <div className="w-full bg-white p-4 gap-4 rounded-lg flex justify-between items-center shadow-lg shadow-tertiary-dark/25">
      <span className="text-base font-bold flex-1 max-w-[50%]">{label}</span>
      <div className="flex items-center gap-6 flex-shrink-0">
        <span className={`text-6xl font-bold ${textColor}`}>{value}</span>
        <img className="h-14 w-14 object-contain" src={icon} alt={iconAlt} />
      </div>
    </div>
  );
}

