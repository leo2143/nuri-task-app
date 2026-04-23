/**
 * Interface para el modelo de Achievement (Logros Globales)
 * Representa plantillas de logros que aplican a todos los usuarios
 */

export type AchievementType = "task" | "goal" | "metric" | "streak";

/** Evento que dispara el progreso automático del logro */
export type AchievementTriggerEvent =
  | "task:completed"
  | "goal:completed"
  | "streak:updated";

/** basic: visible y desbloqueable por todos — premium: solo suscriptores */
export type AchievementTier = "basic" | "premium";

export interface IAchievement {
  _id?: string;
  title: string;
  description: string;
  targetCount: number;
  type: AchievementType;
  triggerEvent: AchievementTriggerEvent;
  tier: AchievementTier;
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
  triggerEvent: AchievementTriggerEvent;
  tier?: AchievementTier;
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
  triggerEvent?: AchievementTriggerEvent;
  tier?: AchievementTier;
  isActive?: boolean;
  imageUrl?: string;
}

export interface AchievementFilters {
  search?: string;
  type?: AchievementType;
  isActive?: boolean;
  sortBy?: "title" | "type" | "targetCount" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  limit?: number;
  cursor?: string;
}
