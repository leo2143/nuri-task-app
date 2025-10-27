/**
 * Interface para el modelo de Achievement (Logros Globales)
 * Representa plantillas de logros que aplican a todos los usuarios
 */

/**
 * Tipos de logros disponibles
 */
export type AchievementType = 'task' | 'goal' | 'metric' | 'streak' | 'comment';

/**
 * Interface para el modelo de Achievement (Plantilla Global)
 */
export interface IAchievement {
  _id?: string;
  title: string;
  description: string;
  targetCount: number;
  reward: string;
  type: AchievementType;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface para crear un nuevo logro (solo admin)
 */
export interface ICreateAchievement {
  title: string;
  description: string;
  targetCount: number;
  reward?: string;
  type: AchievementType;
  isActive?: boolean;
}

/**
 * Interface para actualizar un logro (solo admin)
 */
export interface IUpdateAchievement {
  title?: string;
  description?: string;
  targetCount?: number;
  reward?: string;
  type?: AchievementType;
  isActive?: boolean;
}

