const MINUTE = 60_000;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

/**
 * Devuelve un string con tiempo relativo legible ("Hace 5 min", "Hace 3h", etc.)
 * Para fechas mayores a 7 días muestra la fecha formateada.
 */
export function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();

  if (diff < MINUTE) return "Ahora";
  if (diff < HOUR) return `Hace ${Math.floor(diff / MINUTE)} min`;
  if (diff < DAY) return `Hace ${Math.floor(diff / HOUR)}h`;
  if (diff < WEEK) return `Hace ${Math.floor(diff / DAY)}d`;

  return dateFormatter.format(new Date(dateStr));
}
