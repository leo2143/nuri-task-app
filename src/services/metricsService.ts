import apiClient from "../config/axios";
import type { IAdminDashboardStats, IUserMetrics, ISuccessResponse } from "../interfaces";
import { API_BASE_URL } from "../config/env";

/**
 * Servicio para operaciones relacionadas con métricas
 */
export const metricsService = {
  /**
   * Obtiene estadísticas generales del sistema (admin)
   * GET /api/admin/dashboard
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

  /**
   * Obtiene métricas del usuario autenticado
   * GET /api/metrics
   * @requires validarToken
   */
  getUserMetrics: async (): Promise<IUserMetrics> => {
    try {
      const response = await apiClient.get<
        ISuccessResponse<IUserMetrics>
      >(`${API_BASE_URL}/api/metrics`);
      return response.data.data!;
    } catch (error) {
      console.error("Error fetching user metrics:", error);
      throw error;
    }
  },
};
