/**
 * Interface para el modelo de Todo (Tareas)
 * Representa una tarea individual del usuario
 */

/**
 * Niveles de prioridad para las tareas
 */
export type TodoPriority = "low" | "medium" | "high";

/**
 * Interface para comentarios en una tarea
 */
export interface ITodoComment {
  _id?: string;
  text: string;
  author: string;
  date: Date;
}

/**
 * Interface para datos básicos del usuario en el populate
 */
export interface ITodoUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Interface para el modelo de Todo
 * NOTA: userId puede venir como string (lista) o como objeto poblado (detalle)
 */
export interface ITodo {
  _id?: string;
  title: string;
  description?: string;
  comments: ITodoComment[];
  completed: boolean;
  userId: string | ITodoUser;
  GoalId?: string | null;
  priority: TodoPriority;
  dueDate?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  __v?: number;
}

/**
 * Interface para crear una nueva tarea
 * NOTA: userId se obtiene automáticamente del token JWT
 */
export interface ICreateTodo {
  title: string;
  description?: string;
  GoalId?: string;
  priority?: TodoPriority;
  dueDate?: Date | string | null;
}

/**
 * Interface para actualizar una tarea
 */
export interface IUpdateTodo {
  title?: string;
  description?: string;
  completed?: boolean;
  GoalId?: string | null;
  priority?: TodoPriority;
  dueDate?: Date | string | null;
}

/**
 * Interface para filtros de búsqueda de tareas
 */
export interface ITodoFilters {
  search?: string;
  completed?: boolean;
  priority?: TodoPriority;
  sortBy?: "createdAt" | "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
}

/**
 * Interface para agregar un comentario a una tarea
 */
export interface IAddTodoComment {
  text: string;
  author: string;
}
