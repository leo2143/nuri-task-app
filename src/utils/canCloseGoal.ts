import type { IGoal } from "../interfaces";

/**
 * El CTA de cierre solo aplica si la meta está active, tiene hijos
 * y todas las tareas y submetas están hechas.
 */
export function canCloseGoal(goal: IGoal | null | undefined): boolean {
  if (!goal || goal.status !== "active") return false;

  const totalTasks = goal.totalTasks || 0;
  const totalSubGoals = goal.totalSubGoals || 0;
  const totalChildren = totalTasks + totalSubGoals;
  if (totalChildren === 0) return false;

  const allTasksDone = (goal.completedTasks || 0) === totalTasks;
  const allSubGoalsDone = (goal.completedSubGoals || 0) === totalSubGoals;
  return allTasksDone && allSubGoalsDone;
}
