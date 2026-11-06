import { formatMediumDate } from "./formatDateInZone";
import type { DateDisplayOptions } from "./formatDateInZone";

const MINUTE = 60_000;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

/**
 * Devuelve un string con tiempo relativo legible ("Hace 5 min", "Hace 3h", etc.)
 * Para fechas mayores a 7 días muestra la fecha formateada.
 * El tiempo relativo solo aplica a instantes; una fecha de calendario (`kind: "calendarDate"`)
 * se muestra siempre como su día guardado, sin corrimiento por zona horaria.
 * @param options.timeZone Zona del usuario para la fecha formateada de los instantes
 */
export function formatRelativeTime(
  dateStr: string,
  options: DateDisplayOptions = {},
): string {
  const date = new Date(dateStr);

  if (options.kind === "calendarDate") {
    return formatMediumDate(date, "es-ES", options);
  }

  const diff = Date.now() - date.getTime();

  if (diff < MINUTE) return "Ahora";
  if (diff < HOUR) return `Hace ${Math.floor(diff / MINUTE)} min`;
  if (diff < DAY) return `Hace ${Math.floor(diff / HOUR)}h`;
  if (diff < WEEK) return `Hace ${Math.floor(diff / DAY)}d`;

  return formatMediumDate(date, "es-ES", options);
}
