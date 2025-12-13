import apiClient from "../config/axios";
import type {
  IAchievement,
  IAchievementStats,
  ICreateAchievement,
  IUpdateAchievement,
  ISuccessResponse,
  AchievementFilters,
} from "../interfaces";
import { API_BASE_URL } from "../config/env";

/**
 * Servicio para operaciones relacionadas con logros (achievements)
 * Todas las rutas requieren token de administrador
 */
export const achievementService = {
  /**
   * Obtiene todos los logros
   * GET /api/achievements
   * @requires validarAdminToken
   */
  getAllAchievements: async (
    filters?: AchievementFilters,
  ): Promise<IAchievement[]> => {
    try {
      const params = new URLSearchParams();

      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.type) {
        params.append("type", filters.type);
      }
      if (filters?.isActive !== undefined) {
        params.append("isActive", String(filters.isActive));
      }
      if (filters?.sortBy) {
        params.append("sortBy", filters.sortBy);
      }
      if (filters?.sortOrder) {
        params.append("sortOrder", filters.sortOrder);
      }

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/achievements${queryString ? `?${queryString}` : ""}`;

      const response =
        await apiClient.get<ISuccessResponse<IAchievement[]>>(url);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching achievements:", error);
      throw error;
    }
  },

  /**
   * Obtiene estadísticas globales de logros
   * GET /api/achievements/stats
   * @requires validarAdminToken
   */
  getAchievementStats: async (): Promise<IAchievementStats> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IAchievementStats>>(
        `${API_BASE_URL}/api/achievements/stats`,
      );
      return response.data.data!;
    } catch (error) {
      console.error("Error fetching achievement stats:", error);
      throw error;
    }
  },

  /**
   * Obtiene logros filtrados por tipo
   * GET /api/achievements/type/:type
   * @requires validarAdminToken
   * @param type - Tipo de logro ('task', 'goal', 'metric', 'streak')
   */
  getAchievementsByType: async (
    type: "task" | "goal" | "metric" | "streak",
  ): Promise<IAchievement[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IAchievement[]>>(
        `${API_BASE_URL}/api/achievements/type/${type}`,
      );
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching achievements by type ${type}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene un logro por ID
   * GET /api/achievements/:id
   * @requires validarAdminToken
   */
  getAchievementById: async (id: string): Promise<IAchievement | null> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IAchievement>>(
        `${API_BASE_URL}/api/achievements/${id}`,
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching achievement ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo logro
   * POST /api/achievements
   * @requires validarAdminToken
   */
  createAchievement: async (
    achievementData: ICreateAchievement,
  ): Promise<IAchievement> => {
    try {
      const response = await apiClient.post<ISuccessResponse<IAchievement>>(
        `${API_BASE_URL}/api/achievements`,
        achievementData,
      );
      return response.data.data!;
    } catch (error) {
      console.error("Error creating achievement:", error);
      throw error;
    }
  },

  /**
   * Actualiza un logro existente
   * PUT /api/achievements/:id
   * @requires validarAdminToken
   */
  updateAchievement: async (
    id: string,
    achievementData: IUpdateAchievement,
  ): Promise<IAchievement> => {
    try {
      const response = await apiClient.put<ISuccessResponse<IAchievement>>(
        `${API_BASE_URL}/api/achievements/${id}`,
        achievementData,
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error updating achievement ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un logro
   * DELETE /api/achievements/:id
   * @requires validarAdminToken
   */
  deleteAchievement: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE_URL}/api/achievements/${id}`);
    } catch (error) {
      console.error(`Error deleting achievement ${id}:`, error);
      throw error;
    }
  },

  /**
   * Resetea el progreso de un logro de un usuario
   * DELETE /api/admin/users/:userId/achievements/:achievementId
   * @requires validarAdminToken
   */
  resetUserAchievementProgress: async (
    userId: string,
    achievementId: string,
  ): Promise<void> => {
    try {
      await apiClient.delete(
        `${API_BASE_URL}/api/admin/users/${userId}/achievements/${achievementId}`,
      );
    } catch (error) {
      console.error(
        `Error resetting achievement progress for user ${userId}, achievement ${achievementId}:`,
        error,
      );
      throw error;
    }
  },
};
