/**
 * Tipo de fecha a mostrar:
 * - instant: un momento (createdAt, completedAt); se muestra en la zona del usuario.
 * - calendarDate: un día de calendario (dueDate, guardada como YYYY-MM-DDT12:00:00Z); se muestra como el Y-M-D
 *   guardado, sin corrimiento por zona horaria.
 */
export type DateKind = "instant" | "calendarDate";

export interface DateDisplayOptions {
  kind?: DateKind;
  /** Zona del usuario; si falta o `Intl` la rechaza, se usa la del dispositivo */
  timeZone?: string | null;
}

/**
 * Fecha flotante → instante de mediodía UTC del día de calendario guardado (primeros 10 caracteres).
 * Formatearlo en UTC muestra siempre el mismo día, en cualquier zona.
 */
function toCalendarDateInstant(date: Date): Date {
  return new Date(`${date.toISOString().slice(0, 10)}T12:00:00Z`);
}

/**
 * Formatea una fecha en formato medio ("1 ene 2024") según su tipo.
 * @param date Fecha válida
 */
export function formatMediumDate(
  date: Date,
  locale: string,
  { kind = "instant", timeZone }: DateDisplayOptions = {},
): string {
  if (kind === "calendarDate") {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(toCalendarDateInstant(date));
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeZone: timeZone ?? undefined,
    }).format(date);
  } catch {
    // Zona rechazada por Intl: se cae a la del dispositivo
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
      date,
    );
  }
}
