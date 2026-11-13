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
 * Logro que el usuario puede desbloquear: llega completo.
 */
export type IAccessibleUserAchievement = IAchievement & {
  isAccessible: true;
  userProgress: IUserProgress;
};

/**
 * Logro premium bloqueado (usuario sin suscripción activa): la API no envía título, descripción ni reglas.
 */
export type ILockedUserAchievement = Pick<
  IAchievement,
  "_id" | "tier" | "imageUrl" | "isActive"
> & {
  isAccessible: false;
  userProgress: IUserProgress;
};

/**
 * Progreso individual de un logro de usuario, discriminado por isAccessible.
 */
export type IUserAchievement =
  | IAccessibleUserAchievement
  | ILockedUserAchievement;

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
