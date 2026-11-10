/**
 * Interface para el modelo de Achievement (Logros Globales)
 * Representa plantillas de logros que aplican a todos los usuarios
 */

export type AchievementType = "task" | "goal" | "metric" | "streak";

/**
 * Evento que dispara el progreso automático del logro.
 * Los eventos válidos los define el catálogo del backend (`GET /api/achievements/catalog`), no el cliente.
 */
export type AchievementTriggerEvent = string;

/** Claves de condición que el admin puede configurar en un logro */
export type AchievementConditionKey =
  | "timeWindow"
  | "sameWindow"
  | "maxDurationHours";

/** Franja horaria local del usuario en formato HH:mm; el fin no se incluye */
export interface IAchievementTimeWindow {
  start: string;
  end: string;
}

/** Condiciones que el evento debe cumplir para sumar progreso */
export interface IAchievementConditions {
  timeWindow?: IAchievementTimeWindow;
  sameWindow?: boolean;
  maxDurationHours?: number;
}

/** Evento del catálogo con las condiciones que admite */
export interface IAchievementCatalogTrigger {
  triggerEvent: AchievementTriggerEvent;
  allowedConditions: AchievementConditionKey[];
}

/** Respuesta de GET /api/achievements/catalog */
export interface IAchievementCatalog {
  triggers: IAchievementCatalogTrigger[];
  types: AchievementType[];
  conditionKeys: AchievementConditionKey[];
}

/** Respuesta de GET /api/achievements/:id/in-progress-count */
export interface IAchievementInProgressCount {
  inProgressCount: number;
}

/** basic: visible y desbloqueable por todos — premium: solo suscriptores */
export type AchievementTier = "basic" | "premium";

export interface IAchievement {
  _id?: string;
  title: string;
  description: string;
  targetCount: number;
  type: AchievementType;
  triggerEvent: AchievementTriggerEvent;
  conditions?: IAchievementConditions;
  tier: AchievementTier;
  isActive: boolean;
  imageUrl: string;
  reward?: string;
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
  conditions?: IAchievementConditions;
  tier?: AchievementTier;
  isActive?: boolean;
  imageUrl: string;
  reward?: string;
}

/**
 * Interface para actualizar un logro (solo admin).
 * No lleva `tier`: el nivel de acceso es inmutable y el backend rechaza cualquier valor.
 */
export interface IUpdateAchievement {
  title?: string;
  description?: string;
  targetCount?: number;
  type?: AchievementType;
  triggerEvent?: AchievementTriggerEvent;
  conditions?: IAchievementConditions;
  isActive?: boolean;
  imageUrl?: string;
  reward?: string;
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
