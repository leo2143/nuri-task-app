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
