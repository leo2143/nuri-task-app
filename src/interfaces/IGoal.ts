/**
 * Interface para el modelo de Goal (Metas)
 * Representa una meta SMART del usuario
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
 * Interface para los criterios SMART de una meta
 */
export interface ISmartCriteria {
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
}

/**
 * Interface para comentarios en una meta
 */
export interface IGoalComment {
  _id?: string;
  text: string;
  author: string;
  date: Date | string;
}
/**
 * Interface para catalogo en una meta
 */
export interface IGoalCatalog {
  id?: string;
  title: string;
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
 * Interface para el modelo de Goal
 * NOTA: userId puede venir como string (lista) o como objeto poblado (detalle)
 */
export interface IGoal {
  _id?: string;
  title: string;
  description: string;
  status: GoalStatus;
  priority: GoalPriority;
  dueDate: Date | string | null;
  smart?: ISmartCriteria;
  parentGoalId?: string | null;
  totalSubGoals: number;
  completedSubGoals: number;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  calculatedProgress?: number;
  comments: IGoalComment[];
  userId: string | IGoalUser;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  __v?: number;
}

/**
 * Interface para crear una nueva meta
 * NOTA: userId se obtiene automáticamente del token JWT en el backend
 */
export interface ICreateGoal {
  title: string;
  description?: string;
  status?: GoalStatus;
  priority?: GoalPriority;
  dueDate?: Date | string | null;
  smart?: ISmartCriteria;
  parentGoalId?: string | null;
}

/**
 * Interface para actualizar una meta
 */
export interface IUpdateGoal {
  title?: string;
  description?: string;
  status?: GoalStatus;
  priority?: GoalPriority;
  dueDate?: Date | string | null;
  smart?: Partial<ISmartCriteria>;
  parentGoalId?: string | null;
  totalSubGoals?: number;
  completedSubGoals?: number;
  totalTasks?: number;
  completedTasks?: number;
  progress?: number;
}

/**
 * Interface para actualizar estado de una meta
 */
export interface IUpdateGoalState {
  status: GoalStatus;
}

/**
 * Interface para agregar un comentario a una meta
 */
export interface IAddGoalComment {
  text: string;
  author: string;
}
/**
 * Interface para agregar un comentario a una meta
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
  sortBy?: "createdAt" | "dueDate" | "priority" | "progress";
  sortOrder?: "asc" | "desc";
  limit?: number;
  cursor?: string;
}
