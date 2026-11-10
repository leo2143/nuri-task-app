/**
 * Interface para el modelo de UserAchievement (Progreso Individual)
 * Representa el progreso de un usuario en un logro específico
 */

import type { IAchievement } from ".";

/**
 * Estado del progreso del logro
 */
export type AchievementStatus = "locked" | "unlocked" | "completed";

export interface IUserProgress {
  currentCount: number;
  status: AchievementStatus;
  unlockedAt: Date;
  completedAt: Date;
}
/**
 * Interface para el progreso individual de un logro de usuario.
 * isAccessible indica si el usuario puede desbloquearlo:
 * false cuando el logro es premium y el usuario no tiene suscripción activa.
 */
export interface IUserAchievement extends IAchievement {
  userProgress: IUserProgress;
  isAccessible: boolean;
}

/**
 * Estadísticas de logros del usuario autenticado.
 * Para un usuario free, `total`, `notStarted` y `completionRate` cuentan solo los logros básicos;
 * `premiumLocked` es cuántos logros premium activos quedan por descubrir.
 */
export interface IUserAchievementStats {
  total: number;
  notStarted: number;
  locked: number;
  unlocked: number;
  completed: number;
  premiumLocked: number;
  completionRate: number | string;
}
