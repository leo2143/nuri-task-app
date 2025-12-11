interface InfoItem {
  label: string;
  value: React.ReactNode;
}

interface InfoCardProps {
  items: InfoItem[];
}

export function InfoCard({ items }: InfoCardProps) {
  const getPosition = (index: number, total: number) => {
    if (total === 1) return "rounded-lg";
    if (index === 0) return "rounded-t-lg";
    if (index === total - 1) return "rounded-b-lg";
    return "";
  };

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div
          key={index}
          className={`p-8 bg-white border-b-2 border-brand ${getPosition(index, items.length)}`}
        >
          <div className="font-semibold text-sm">{item.label}</div>
          <div>
            <strong className="font-bold text-xl">{item.value}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
