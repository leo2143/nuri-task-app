import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import ProgressBar from "./ProgressBar";

type GoalStatus = "active" | "paused" | "completed";

interface GoalCardProps {
  id?: string;
  title: string;
  description?: string;
  status: GoalStatus;
  progress: number;
  className?: string;
}

export function GoalCard({
  id,
  title,
  description,
  status,
  progress,
  className = "",
}: GoalCardProps) {
  return (
    <Link to={id ? `/goals/${id}` : "#"} className={className}>
      <article className="block bg-white p-5 rounded-lg shadow-brand-glow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-body font-bold text-tertiary">
            {title}
          </span>
          <StatusBadge status={status} />
        </div>
        {description && (
          <p className="mb-3 text-sm text-tertiary opacity-75">{description}</p>
        )}
        <ProgressBar
          progress={progress}
          variant="inline"
          height="lg"
          color="bg-brand"
          bgColor="bg-gray-300"
        />
      </article>
    </Link>
  );
}

