import apiClient from "../config/axios";
import type { IAdminDashboardStats, ISuccessResponse } from "../interfaces";
import { API_BASE_URL } from "../config/env";

/**
 * Servicio para operaciones relacionadas con el dashboard de administrador
 */
export const metricsService = {
  /**
   * Obtiene estadísticas generales del sistema
   * GET /api/admin/dashboard/stats
   * @requires validarAdminToken
   */
  getAdminStats: async (): Promise<IAdminDashboardStats> => {
    try {
      const response = await apiClient.get<
        ISuccessResponse<IAdminDashboardStats>
      >(`${API_BASE_URL}/api/admin/dashboard`);
      return response.data.data!;
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
      throw error;
    }
  },
};
