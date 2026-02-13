import apiClient from "../config/axios";
import { API_BASE_URL } from "../config/env";

/**
 * Servicio para operaciones relacionadas con Cloudinary
 */
export const cloudinaryService = {
  /**
   * Eliminar imagen de Cloudinary directamente
   * DELETE /api/cloudinary/image
   * @requires validarToken
   * Útil para limpiar imágenes huérfanas
   */
  deleteImage: async (imageUrl: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE_URL}/api/cloudinary/image`, {
        data: { imageUrl },
      });
    } catch (error) {
      console.error("Error deleting Cloudinary image:", error);
      throw error;
    }
  },
};

