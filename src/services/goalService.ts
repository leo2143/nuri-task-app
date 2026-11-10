import apiClient from "../config/axios";
import type {
  IGoal,
  IUpdateGoal,
  ISuccessResponse,
  ICreateGoal,
  IGoalCatalog,
  IGoalQuota,
  IGoalCatalogParams,
  IReopenGoalResult,
  IAddSubGoal,
  IGoalFilters,
  ITodo,
  ICompletionEvents,
  IWithCompletionEvents,
} from "../interfaces";
import { EMPTY_COMPLETION_EVENTS } from "../interfaces";
import { API_BASE_URL } from "../config/env";

/**
 * Servicio para operaciones relacionadas con metas (Goals)
 * Rutas sincronizadas con el backend Express
 */
export const goalService = {
  /**
   * Crear una nueva meta
   * POST /api/goals
   * @requires Bearer Token
   */
  createGoal: async (goalData: ICreateGoal): Promise<IGoal> => {
    try {
      const response = await apiClient.post<ISuccessResponse<IGoal>>(
        `${API_BASE_URL}/api/goals`,
        goalData,
      );
      return response.data.data!;
    } catch (error) {
      console.error("Error creating goal:", error);
      throw error;
    }
  },

  /**
   * Obtener todas las metas del usuario con filtros y paginación
   * GET /api/goals?search=&status=&priority=&sortBy=&sortOrder=&limit=&cursor=
   * @requires Bearer Token
   */
  getAllGoals: async (
    filters?: IGoalFilters,
  ): Promise<ISuccessResponse<IGoal[]>> => {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append("search", filters.search);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.priority) params.append("priority", filters.priority);
      if (filters?.dueDateFrom) params.append("dueDateFrom", filters.dueDateFrom);
      if (filters?.dueDateTo) params.append("dueDateTo", filters.dueDateTo);
      if (filters?.sortBy) params.append("sortBy", filters.sortBy);
      if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
      if (filters?.limit) params.append("limit", String(filters.limit));
      if (filters?.cursor) params.append("cursor", filters.cursor);

      const queryString = params.toString();
      const url = queryString
        ? `${API_BASE_URL}/api/goals?${queryString}`
        : `${API_BASE_URL}/api/goals`;

      const response = await apiClient.get<ISuccessResponse<IGoal[]>>(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching goals:", error);
      throw error;
    }
  },

  /**
   * Obtener todas las metas activas
   * GET /api/goals/active
   * @requires Bearer Token
   */
  getActiveGoals: async (): Promise<IGoal[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IGoal[]>>(
        `${API_BASE_URL}/api/goals/active`,
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching active goals:", error);
      throw error;
    }
  },

  /**
   * Obtener todas las metas pausadas
   * GET /api/goals/paused
   * @requires Bearer Token
   */
  getPausedGoals: async (): Promise<IGoal[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IGoal[]>>(
        `${API_BASE_URL}/api/goals/paused`,
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching paused goals:", error);
      throw error;
    }
  },

  /**
   * Obtener todas las metas completadas
   * GET /api/goals/completed
   * @requires Bearer Token
   */
  getCompletedGoals: async (): Promise<IGoal[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IGoal[]>>(
        `${API_BASE_URL}/api/goals/completed`,
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching completed goals:", error);
      throw error;
    }
  },

  /**
   * Obtener una meta por ID
   * GET /api/goals/:id
   * @requires Bearer Token
   * NOTA: userId viene poblado con datos del usuario (name, email, avatar)
   */
  getGoalById: async (id: string): Promise<IGoal | null> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IGoal>>(
        `${API_BASE_URL}/api/goals/${id}`,
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching goal ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener el cupo de metas del usuario
   * GET /api/goals/quota
   * @requires Bearer Token
   */
  getGoalQuota: async (): Promise<IGoalQuota> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IGoalQuota>>(
        `${API_BASE_URL}/api/goals/quota`,
      );
      return response.data.data!;
    } catch (error) {
      console.error("Error fetching goal quota:", error);
      throw error;
    }
  },

  /**
   * Obtener las submetas de una meta padre
   * GET /api/goals/:id/parent
   * @requires Bearer Token
   */
  getSubGoals: async (parentGoalId: string): Promise<IGoal[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IGoal[]>>(
        `${API_BASE_URL}/api/goals/${parentGoalId}/parent`,
      );
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching subgoals for goal ${parentGoalId}:`, error);
      throw error;
    }
  },

  /**
   * Obtener las tareas de una meta
   * GET /api/goals/:id/todos
   * @requires Bearer Token
   */
  getGoalTodos: async (goalId: string): Promise<ITodo[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<ITodo[]>>(
        `${API_BASE_URL}/api/goals/${goalId}/todos`,
      );
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching todos for goal ${goalId}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar una meta existente
   * PUT /api/goals/:id
   * @requires Bearer Token
   */
  updateGoal: async (id: string, goalData: IUpdateGoal): Promise<IGoal> => {
    try {
      const response = await apiClient.put<ISuccessResponse<IGoal>>(
        `${API_BASE_URL}/api/goals/${id}`,
        goalData,
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error updating goal ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar solo el estado de una meta
   * PATCH /api/goals/:id/status
   * @requires Bearer Token
   */
  updateGoalStatus: async (
    id: string,
    status: "active" | "paused" | "completed",
  ): Promise<IWithCompletionEvents<IGoal>> => {
    try {
      const response = await apiClient.patch<
        ISuccessResponse<IGoal> & {
          meta: { events?: ICompletionEvents } | null;
        }
      >(`${API_BASE_URL}/api/goals/${id}/status`, { status });
      return {
        data: response.data.data!,
        events: response.data.meta?.events ?? EMPTY_COMPLETION_EVENTS,
      };
    } catch (error) {
      console.error(`Error updating goal status ${id}:`, error);
      throw error;
    }
  },
  /**
   * Reabrir una meta completada (reabre también los ancestros completados)
   * POST /api/goals/:id/reopen
   * @requires Bearer Token
   * Responde 409 si la meta no está completada
   */
  reopenGoal: async (id: string): Promise<IReopenGoalResult> => {
    try {
      const response = await apiClient.post<
        ISuccessResponse<IReopenGoalResult>
      >(`${API_BASE_URL}/api/goals/${id}/reopen`);
      return response.data.data!;
    } catch (error) {
      console.error(`Error reopening goal ${id}:`, error);
      throw error;
    }
  },

  /**
   * Agrega una submeta a una meta padre
   * patch /api/goals/:id
   * @requires Bearer Token
   */
  addSubgoal: async (id: string, goalData: IAddSubGoal): Promise<IGoal> => {
    try {
      const response = await apiClient.patch<ISuccessResponse<IGoal>>(
        `${API_BASE_URL}/api/goals/${id}/subgoals`,
        goalData,
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error añadiendo submeta a la meta ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar una meta
   * DELETE /api/goals/:id
   * @requires Bearer Token
   */
  deleteGoal: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE_URL}/api/goals/${id}`);
    } catch (error) {
      console.error(`Error deleting goal ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener todas los catalogos de metas
   * GET /api/goals/catalogs?excludeCompleted=&excludeRelatedTo=
   * @requires Bearer Token
   */
  getCatalogGoals: async (
    params?: IGoalCatalogParams,
  ): Promise<IGoalCatalog[]> => {
    try {
      const query = new URLSearchParams();
      if (params?.excludeCompleted) query.append("excludeCompleted", "true");
      if (params?.excludeRelatedTo) {
        query.append("excludeRelatedTo", params.excludeRelatedTo);
      }

      const queryString = query.toString();
      const url = queryString
        ? `${API_BASE_URL}/api/goals/catalogs?${queryString}`
        : `${API_BASE_URL}/api/goals/catalogs`;

      const response =
        await apiClient.get<ISuccessResponse<IGoalCatalog[]>>(url);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching goal catalog:", error);
      throw error;
    }
  },
};
