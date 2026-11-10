import apiClient from "../config/axios";
import type {
  ISuccessResponse,
  IUserAchievement,
  IUserAchievementStats,
} from "../interfaces";
import { API_BASE_URL } from "../config/env";

/**
 * Servicio para obtener y operar con logros del usuario autenticado
 */
export const userAchievementService = {
  /**
   * Trae todos los logros con el progreso del usuario.
   * Los logros premium aparecen con isAccessible: false si el usuario es free.
   * GET /api/user/achievements
   */
  getAllAchievements: async (): Promise<ISuccessResponse<IUserAchievement[]>> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IUserAchievement[]>>(
        `${API_BASE_URL}/api/user/achievements`,
        { params: { limit: 100 } },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching achievements:", error);
      throw error;
    }
  },

  /**
   * Trae las estadísticas de logros del usuario, incluido `premiumLocked`.
   * GET /api/user/achievements/stats
   */
  fetchAchievementStats: async (): Promise<IUserAchievementStats> => {
    try {
      const response = await apiClient.get<
        ISuccessResponse<IUserAchievementStats>
      >(`${API_BASE_URL}/api/user/achievements/stats`);
      return response.data.data!;
    } catch (error) {
      console.error("Error fetching achievement stats:", error);
      throw error;
    }
  },
};
