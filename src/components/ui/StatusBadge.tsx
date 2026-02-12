type StatusType = "active" | "paused" | "completed";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: {
    label: "Activa",
    className: "bg-greenCheap-light text-greenCheap-dark",
  },
  paused: {
    label: "Pausada",
    className: "bg-yellowCheap text-yellow-800",
  },
  completed: {
    label: "Completada",
    className: "bg-blue-100 text-blue-800",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`px-4 py-1 rounded-full text-xs font-bold ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}

