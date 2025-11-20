import apiClient from "../config/axios";
import type {
  IGoal,
  IUpdateGoal,
  ISuccessResponse,
  ICreateGoal,
  IAddGoalComment,
  IGoalCatalog,
  IAddSubGoal,
} from "../interfaces";
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
   * Obtener todas las metas del usuario
   * GET /api/goals
   * @requires Bearer Token
   */
  getAllGoals: async (): Promise<IGoal[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IGoal[]>>(
        `${API_BASE_URL}/api/goals`,
      );
      return response.data.data || [];
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
   * Agregar un comentario a una meta
   * POST /api/goals/:id/comments
   * @requires Bearer Token
   */
  addComment: async (
    id: string,
    commentData: IAddGoalComment,
  ): Promise<IGoal> => {
    try {
      const response = await apiClient.post<ISuccessResponse<IGoal>>(
        `${API_BASE_URL}/api/goals/${id}/comments`,
        commentData,
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error adding comment to goal ${id}:`, error);
      throw error;
    }
  },
  /**
   * Obtener todas los catalogos de metas
   * GET /api/goals/catalogs
   * @requires Bearer Token
   */
  getCatalogGoals: async (): Promise<IGoalCatalog[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IGoalCatalog[]>>(
        `${API_BASE_URL}/api/goals/catalogs`,
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching paused goals:", error);
      throw error;
    }
  },
};
