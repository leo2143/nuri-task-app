import React from "react";
import { useClassNames } from "../../hooks";

type Priority = "high" | "medium" | "low";
type BadgeVariant = "priority" | "status" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  priority?: Priority;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function Badge({
  variant = "default",
  priority,
  label,
  className = "",
  children,
}: BadgeProps) {
  const getPriorityStyles = (priorityLevel: Priority) => {
    switch (priorityLevel) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-neutral text-tertiary border-neutral";
    }
  };

  const getPriorityLabel = (priorityLevel: Priority) => {
    switch (priorityLevel) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return "";
    }
  };

  const getVariantStyles = () => {
    if (variant === "priority" && priority) {
      return getPriorityStyles(priority);
    }
    return "bg-secondary bg-opacity-30 text-tertiary border-secondary";
  };

  const baseStyles =
    "px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1";

  const badgeClasses = useClassNames(baseStyles, getVariantStyles(), className);

  const content =
    children ||
    (variant === "priority" && priority
      ? `${label || "Prioridad"} ${getPriorityLabel(priority)}`
      : label);

  return <span className={badgeClasses}>{content}</span>;
}
