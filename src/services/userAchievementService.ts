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
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching achievements:", error);
      throw error;
    }
  },

  /**
   * Incrementa manualmente el progreso en un logro (útil para testing o casos edge).
   * En el flujo normal el backend lo hace automáticamente vía processEvent.
   * POST /api/user/achievements/:id/progress
   */
  incrementProgress: async (
    achievementId: string,
    amount: number = 1,
  ): Promise<IUserAchievement> => {
    try {
      const response = await apiClient.post<ISuccessResponse<IUserAchievement>>(
        `${API_BASE_URL}/api/user/achievements/${achievementId}/progress`,
        { amount },
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error incrementing progress for achievement ${achievementId}:`, error);
      throw error;
    }
  },
};
