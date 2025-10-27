/**
 * Interface para el modelo de UserAchievement (Progreso Individual)
 * Representa el progreso de un usuario en un logro específico
 */

/**
 * Estado del progreso del logro
 */
export type AchievementStatus = 'locked' | 'unlocked' | 'completed';

/**
 * Interface para el progreso individual de un logro de usuario
 */
export interface IUserAchievement {
  _id?: string;
  userId: string;
  achievementId: string;
  currentCount: number;
  status: AchievementStatus;
  unlockedAt: Date | null;
  completedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface para crear un nuevo progreso de logro
 */
export interface ICreateUserAchievement {
  userId: string;
  achievementId: string;
  currentCount?: number;
  status?: AchievementStatus;
  unlockedAt?: Date | null;
  completedAt?: Date | null;
}

/**
 * Interface para actualizar un progreso de logro
 */
export interface IUpdateUserAchievement {
  currentCount?: number;
  status?: AchievementStatus;
  unlockedAt?: Date | null;
  completedAt?: Date | null;
}

