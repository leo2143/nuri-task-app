import apiClient from "../config/axios";
import type { ISuccessResponse, IUserAchievement } from "../interfaces";
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
};
