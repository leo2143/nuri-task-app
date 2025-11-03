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
  text: string;
  author: string;
  date: Date;
}

/**
 * Interface para el modelo de Goal
 */
export interface IGoal {
  _id?: string;
  title: string;
  description: string;
  status: GoalStatus;
  priority: GoalPriority;
  dueDate: Date | null;
  smart: ISmartCriteria;
  parentGoalId: string | null;
  metricsId?: string;
  comments: IGoalComment[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface para crear una nueva meta
 */
export interface ICreateGoal {
  title: string;
  description?: string;
  status?: GoalStatus;
  priority?: GoalPriority;
  dueDate?: Date | null;
  smart: ISmartCriteria;
  parentGoalId?: string | null;
  userId: string;
}

/**
 * Interface para actualizar una meta
 */
export interface IUpdateGoal {
  title?: string;
  description?: string;
  status?: GoalStatus;
  priority?: GoalPriority;
  dueDate?: Date | null;
  smart?: Partial<ISmartCriteria>;
  parentGoalId?: string | null;
  metricsId?: string;
}

/**
 * Interface para agregar un comentario a una meta
 */
export interface IAddGoalComment {
  text: string;
  author: string;
}
