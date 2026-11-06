import { useMemo } from "react";
import { formatMediumDate } from "../utils/formatDateInZone";
import type { DateKind } from "../utils/formatDateInZone";
import { useAuthState } from "./useAuth";

/**
 * Resultado del hook useFormatDate
 */
export interface FormattedDateResult {
  formatted: string; // Fecha formateada para mostrar (ej: "1 ene 2024")
  iso: string; // Fecha en formato ISO para atributos HTML
  isValid: boolean; // Indica si la fecha es válida
}

/**
 * Hook para formatear fechas de manera consistente
 *
 * Por defecto la fecha es un instante (createdAt, completedAt) y se muestra en la zona horaria del usuario.
 * Para una fecha de calendario (dueDate) pasá `{ kind: "calendarDate" }`: se muestra el día guardado, sin corrimiento.
 *
 * @example
 * const { formatted, iso, isValid } = useFormatDate(task.createdAt);
 * const due = useFormatDate(task.dueDate, { kind: "calendarDate" });
 * if (isValid) {
 *   return <time dateTime={iso}>{formatted}</time>
 * }
 */
export function useFormatDate(
  dateInput: Date | string | null | undefined,
  { kind = "instant" }: { kind?: DateKind } = {},
): FormattedDateResult {
  const { user } = useAuthState();
  const timeZone = user?.timezone;

  return useMemo(() => {
    if (!dateInput) {
      return {
        formatted: "",
        iso: "",
        isValid: false,
      };
    }

    try {
      const date =
        typeof dateInput === "string" ? new Date(dateInput) : dateInput;

      if (Number.isNaN(date.getTime())) {
        return {
          formatted: "",
          iso: "",
          isValid: false,
        };
      }

      const formatted = formatMediumDate(date, "es-AR", { kind, timeZone });

      return {
        formatted,
        iso: date.toISOString(),
        isValid: true,
      };
    } catch {
      return {
        formatted: "",
        iso: "",
        isValid: false,
      };
    }
  }, [dateInput, kind, timeZone]);
}
