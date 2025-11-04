import { useMemo } from "react";

/**
 * Custom hook para combinar y limpiar múltiples clases CSS
 *
 * @description
 * Este hook toma múltiples strings de clases CSS y las combina en un solo string,
 * eliminando espacios múltiples y espacios al inicio/final.
 *
 * @param classes - Array de strings con clases CSS (pueden incluir strings vacíos, null o undefined)
 * @returns String limpio con todas las clases combinadas
 *
 * @example
 * ```tsx
 * const buttonClasses = useClassNames(
 *   'px-4 py-2',
 *   isActive && 'bg-blue-500',
 *   disabled && 'opacity-50',
 *   className
 * );
 * // Resultado: "px-4 py-2 bg-blue-500 opacity-50 custom-class"
 * ```
 *
 * @example
 * ```tsx
 * const badgeClasses = useClassNames(
 *   baseStyles,
 *   getVariantStyles(),
 *   className
 * );
 * ```
 */
export function useClassNames(
  ...classes: (string | boolean | null | undefined)[]
): string {
  return useMemo(() => {
    return classes
      .filter(Boolean) // Elimina valores falsy (false, null, undefined, '')
      .join(" ") // Une con espacios
      .trim() // Elimina espacios al inicio/final
      .replace(/\s+/g, " "); // Reemplaza múltiples espacios con uno solo
  }, [classes]);
}
