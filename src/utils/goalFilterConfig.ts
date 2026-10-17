import type { FilterConfig, FilterValues } from "../interfaces";

/** Filtros compartidos para listados de metas (Mis Metas y Metas Asociadas). */
export const goalFilterConfig: FilterConfig[] = [
  {
    key: "status",
    label: "Estado",
    type: "chips",
    options: [
      { value: "active", label: "Activa" },
      { value: "paused", label: "Pausada" },
      { value: "completed", label: "Completada" },
    ],
  },
  {
    key: "priority",
    label: "Prioridad",
    type: "chips",
    options: [
      { value: "low", label: "Baja" },
      { value: "medium", label: "Media" },
      { value: "high", label: "Alta" },
    ],
  },
  { key: "dueDateFrom", label: "Fecha desde", type: "date" },
  { key: "dueDateTo", label: "Fecha hasta", type: "date" },
];

/**
 * Compara la fecha de la meta contra dueDateFrom / dueDateTo (YYYY-MM-DD).
 */
export function matchesGoalDateFilters(
  dueDate: Date | string | null | undefined,
  filters: FilterValues,
): boolean {
  const from = typeof filters.dueDateFrom === "string" ? filters.dueDateFrom : "";
  const to = typeof filters.dueDateTo === "string" ? filters.dueDateTo : "";
  if (!from && !to) return true;

  const dueKey = toDateKey(dueDate);
  if (!dueKey) return false;
  if (from && dueKey < from) return false;
  if (to && dueKey > to) return false;
  return true;
}

function toDateKey(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "string") {
    const key = value.slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(key) ? key : null;
  }
  if (Number.isNaN(value.getTime())) return null;
  return value.toISOString().slice(0, 10);
}
