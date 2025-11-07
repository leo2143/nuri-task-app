import { useMemo } from "react";

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
 * @example
 * const { formatted, iso, isValid } = useFormatDate(task.createdAt);
 * if (isValid) {
 *   return <time dateTime={iso}>{formatted}</time>
 * }
 */
export function useFormatDate(
  dateInput: Date | string | null | undefined,
): FormattedDateResult {
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

      if (isNaN(date.getTime())) {
        return {
          formatted: "",
          iso: "",
          isValid: false,
        };
      }

      const formatted = new Intl.DateTimeFormat("es-ES", {
        dateStyle: "medium",
      }).format(date);

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
  }, [dateInput]);
}
