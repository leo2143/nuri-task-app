import type { ITodo } from "../interfaces";

/**
 * Instante en que se completó una tarea, para mostrarlo en la zona del usuario (useFormatDate, kind "instant").
 * Las tareas legacy no tienen `completedAt`: se cae a `updatedAt`. Una tarea pendiente devuelve null.
 */
export function getTaskCompletionInstant(
  todo: Pick<ITodo, "completed" | "completedAt" | "updatedAt">,
): Date | string | null {
  if (!todo.completed) return null;
  return todo.completedAt ?? todo.updatedAt ?? null;
}
