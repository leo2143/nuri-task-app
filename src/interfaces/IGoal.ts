/**
 * Interface para el modelo de Goal (Metas)
 * Representa una meta del usuario
 */

/**
 * Estados posibles de una meta
 */
export type GoalStatus = "active" | "paused" | "completed";

/**
 * Niveles de prioridad para las metas
 */
export type GoalPriority = "low" | "medium" | "high";

/**
 * Interface para catalogo en una meta
 */
export interface IGoalCatalog {
  id?: string;
  title: string;
  status: GoalStatus;
}

/**
 * Cupo de metas del usuario (GET /api/goals/quota)
 * - limit: null cuando el usuario es Premium/admin (sin límite)
 * - used: metas que cuentan hacia el límite (cualquier estado, submetas incluidas)
 */
export interface IGoalQuota {
  limit: number | null;
  used: number;
  canCreate: boolean;
}

/**
 * Parámetros del catálogo de metas
 * - excludeCompleted: oculta las metas completadas
 * - excludeRelatedTo: oculta esa meta, sus ancestros y sus descendientes
 */
export interface IGoalCatalogParams {
  excludeCompleted?: boolean;
  excludeRelatedTo?: string;
}

/**
 * Resultado de reabrir una meta completada
 * cascaded lista los IDs de los ancestros completados que también se reabrieron
 */
export interface IReopenGoalResult {
  goal: IGoal;
  cascaded: string[];
}

/**
 * Interface para datos básicos del usuario en el populate
 */
export interface IGoalUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Meta padre poblada por el backend: GET /api/goals (lista) trae { _id, title } y
 * GET /api/goals/:id (detalle) trae { _id, description }
 */
export interface IGoalParent {
  _id: string;
  title?: string;
  description?: string;
}

/**
 * Interface para el modelo de Goal
 * NOTA: userId puede venir como string (lista) o como objeto poblado (detalle)
 * NOTA: parentGoalId viene poblado (IGoalParent) en lista y detalle; en el resto de
 * respuestas (crear, actualizar, estado, reabrir) llega como id. null si no tiene padre
 */
export interface IGoal {
  _id?: string;
  title: string; // 3-50 caracteres
  description: string; // max 100 caracteres
  reason?: string; // max 50 caracteres
  status: GoalStatus;
  priority: GoalPriority;
  dueDate: Date | string | null;
  parentGoalId?: string | IGoalParent | null;
  totalSubGoals: number;
  completedSubGoals: number;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  calculatedProgress?: number;
  userId: string | IGoalUser;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  __v?: number;
}

/**
 * Interface para crear una nueva meta
 * NOTA: userId se obtiene automáticamente del token JWT en el backend
 * NOTA: status se establece automáticamente en 'active' en el backend
 */
export interface ICreateGoal {
  title: string;
  description?: string;
  reason?: string;
  priority?: GoalPriority;
  dueDate?: Date | string | null;
  parentGoalId?: string | null;
}

/**
 * Interface para actualizar una meta
 */
export interface IUpdateGoal {
  title: string; // requerido
  description?: string;
  reason?: string;
  status?: GoalStatus;
  priority?: GoalPriority;
  dueDate?: Date | string | null;
  parentGoalId?: string | null;
}

/**
 * Interface para actualizar estado de una meta
 */
export interface IUpdateGoalState {
  status: GoalStatus;
}

/**
 * Interface para agregar una submeta
 */
export interface IAddSubGoal {
  subgoalId: string;
}

/**
 * Interface para filtros de búsqueda de metas
 */
export interface IGoalFilters {
  search?: string;
  status?: GoalStatus;
  priority?: GoalPriority;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: "createdAt" | "dueDate" | "priority" | "progress";
  sortOrder?: "asc" | "desc";
  limit?: number;
  cursor?: string;
}
