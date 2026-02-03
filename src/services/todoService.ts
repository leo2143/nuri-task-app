import apiClient from "../config/axios";
import type {
  ITodo,
  IUpdateTodo,
  ISuccessResponse,
  ICreateTodo,
  ITodoFilters,
  IAddTodoComment,
  IUpdateTodoState,
} from "../interfaces";
import { API_BASE_URL } from "../config/env";

/**
 * Servicio para operaciones relacionadas con tareas (Todos)
 * Rutas sincronizadas con el backend Express
 */
export const todoservice = {
  /**
   * Crear una nueva tarea
   * POST /api/todos
   * @requires Bearer Token
   */
  createTodo: async (TodoData: ICreateTodo): Promise<ITodo> => {
    try {
      const response = await apiClient.post<ISuccessResponse<ITodo>>(
        `${API_BASE_URL}/api/todos`,
        TodoData,
      );
      return response.data.data!;
    } catch (error) {
      console.error("Error creating Todo:", error);
      throw error;
    }
  },

  /**
   * Obtener todas las tareas con filtros opcionales y paginación
   * GET /api/todos?search=&completed=&priority=&sortBy=&sortOrder=&limit=&cursor=
   * @requires Bearer Token
   */
  gettodos: async (
    filters?: ITodoFilters,
  ): Promise<ISuccessResponse<ITodo[]>> => {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append("search", filters.search);
      if (filters?.completed !== undefined)
        params.append("completed", String(filters.completed));
      if (filters?.priority) params.append("priority", filters.priority);
      if (filters?.sortBy) params.append("sortBy", filters.sortBy);
      if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
      if (filters?.limit) params.append("limit", String(filters.limit));
      if (filters?.cursor) params.append("cursor", filters.cursor);

      const queryString = params.toString();
      const url = queryString
        ? `${API_BASE_URL}/api/todos?${queryString}`
        : `${API_BASE_URL}/api/todos`;

      const response = await apiClient.get<ISuccessResponse<ITodo[]>>(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  },

  /**
   * Alias para gettodos
   */
  getAlltodos: async (
    filters?: ITodoFilters,
  ): Promise<ISuccessResponse<ITodo[]>> => {
    return todoservice.gettodos(filters);
  },

  /**
   * Obtener una tarea por ID
   * GET /api/todos/:id
   * @requires Bearer Token
   * NOTA: userId viene poblado con datos del usuario (name, email, avatar)
   */
  getTodoById: async (id: string): Promise<ITodo | null> => {
    try {
      const response = await apiClient.get<ISuccessResponse<ITodo>>(
        `${API_BASE_URL}/api/todos/${id}`,
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching Todo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener una tarea por título exacto
   * GET /api/todos/title/:title
   * @requires Bearer Token
   */
  getTodoByTitle: async (title: string): Promise<ITodo | null> => {
    try {
      const encodedTitle = encodeURIComponent(title);
      const response = await apiClient.get<ISuccessResponse<ITodo>>(
        `${API_BASE_URL}/api/todos/title/${encodedTitle}`,
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching Todo by title "${title}":`, error);
      throw error;
    }
  },

  /**
   * Obtener todas las tareas completadas
   * GET /api/todos/completed
   * @requires Bearer Token
   */
  getCompletedTodos: async (): Promise<ITodo[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<ITodo[]>>(
        `${API_BASE_URL}/api/todos/completed`,
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching completed todos:", error);
      throw error;
    }
  },

  /**
   * Obtener todas las tareas pendientes
   * GET /api/todos/pending
   * @requires Bearer Token
   */
  getPendingTodos: async (): Promise<ITodo[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<ITodo[]>>(
        `${API_BASE_URL}/api/todos/pending`,
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching pending todos:", error);
      throw error;
    }
  },

  /**
   * Obtener todas las tareas de un goal específico
   * GET /api/todos/goal/:goalId
   * @requires Bearer Token
   */
  getTodosByGoal: async (goalId: string): Promise<ITodo[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<ITodo[]>>(
        `${API_BASE_URL}/api/todos/goal/${goalId}`,
      );
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching todos for goal ${goalId}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar una tarea existente
   * PUT /api/todos/:id
   * @requires Bearer Token
   */
  updateTodo: async (id: string, TodoData: IUpdateTodo): Promise<ITodo> => {
    try {
      const response = await apiClient.put<ISuccessResponse<ITodo>>(
        `${API_BASE_URL}/api/todos/${id}`,
        TodoData,
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error updating Todo ${id}:`, error);
      throw error;
    }
  },
  /**
   * Actualizar estado de una tarea
   * PUT /api/todos/:id
   * @requires Bearer Token
   */
  updateTodoState: async (id: string, status: boolean): Promise<ITodo> => {
    try {
      const body: IUpdateTodoState = { completed: status };
      const response = await apiClient.patch<ISuccessResponse<ITodo>>(
        `${API_BASE_URL}/api/todos/${id}/state`,
        body,
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error updating Todo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar una tarea
   * DELETE /api/todos/:id
   * @requires Bearer Token
   */
  deleteTodo: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE_URL}/api/todos/${id}`);
    } catch (error) {
      console.error(`Error deleting Todo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Agregar un comentario a una tarea
   * POST /api/todos/:id/comments
   * @requires Bearer Token
   */
  addComment: async (
    id: string,
    commentData: IAddTodoComment,
  ): Promise<ITodo> => {
    try {
      const response = await apiClient.post<ISuccessResponse<ITodo>>(
        `${API_BASE_URL}/api/todos/${id}/comments`,
        commentData,
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error adding comment to Todo ${id}:`, error);
      throw error;
    }
  },
};
