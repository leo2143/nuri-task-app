import apiClient from "../config/axios";
import type { ISuccessResponse, IUserAchievement } from "../interfaces";
import { API_BASE_URL } from "../config/env";

/**
 * Servicio para obtener logros del usuario
 * Todas las rutas requieren token de administrador
 */
export const userAchievementService = {
  /**
   * Obtiene todos los logros del usuario
   * GET /api/user/achievements
   */
  getAllAchievements: async (): Promise<ISuccessResponse<IUserAchievement[]>> => {
    try {
      const url = `${API_BASE_URL}/api/user/achievements`;

      const response =
        await apiClient.get<ISuccessResponse<IUserAchievement[]>>(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching achievements:", error);
      throw error;
    }
  },
};
