/**
 * Interface para el modelo de Todo (Tareas)
 * Representa una tarea individual del usuario
 */

/**
 * Niveles de prioridad para las tareas
 */
export type TodoPriority = 'low' | 'medium' | 'high';

/**
 * Interface para comentarios en una tarea
 */
export interface ITodoComment {
  text: string;
  author: string;
  date: Date;
}

/**
 * Interface para el modelo de Todo
 */
export interface ITodo {
  _id?: string;
  title: string;
  description: string;
  comments: ITodoComment[];
  completed: boolean;
  userId: string;
  GoalId?: string | null;
  priority: TodoPriority;
  dueDate: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface para crear una nueva tarea
 */
export interface ICreateTodo {
  title: string;
  description?: string;
  userId: string;
  GoalId?: string;
  priority?: TodoPriority;
  dueDate?: Date | null;
  completed?: boolean;
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
  dueDate?: Date | null;
}

/**
 * Interface para agregar un comentario a una tarea
 */
export interface IAddTodoComment {
  text: string;
  author: string;
}

