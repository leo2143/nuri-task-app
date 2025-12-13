/**
 * Interface para el modelo de Achievement (Logros Globales)
 * Representa plantillas de logros que aplican a todos los usuarios
 */

/**
 * Tipos de logros disponibles
 */
export type AchievementType = "task" | "goal" | "metric" | "streak";

/**
 * Interface para el modelo de Achievement (Plantilla Global)
 */
export interface IAchievement {
  _id?: string;
  title: string;
  description: string;
  targetCount: number;
  type: AchievementType;
  isActive: boolean;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface para estadísticas de logros
 */
export interface IAchievementStats {
  total: number;
  byType: {
    task: number;
    goal: number;
    metric: number;
    streak: number;
  };
  active: number;
  inactive: number;
}

/**
 * Interface para crear un nuevo logro (solo admin)
 */
export interface ICreateAchievement {
  title: string;
  description: string;
  targetCount: number;
  type: AchievementType;
  isActive?: boolean;
  imageUrl: string;
}

/**
 * Interface para actualizar un logro (solo admin)
 */
export interface IUpdateAchievement {
  title?: string;
  description?: string;
  targetCount?: number;
  type?: AchievementType;
  isActive?: boolean;
  imageUrl?: string;
}

export interface AchievementFilters {
  search?: string;
  type?: AchievementType;
  isActive?: boolean;
  sortBy?: "title" | "type" | "targetCount" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}
