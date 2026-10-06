import apiClient from "../config/axios";
import { API_BASE_URL } from "../config/env";

/**
 * Servicio para operaciones relacionadas con Cloudinary
 */
export const cloudinaryService = {
  /**
   * Registra una URL recién subida para poder borrarla si el usuario cancela.
   * POST /api/cloudinary/pending
   */
  registerPendingImage: async (imageUrl: string): Promise<void> => {
    try {
      await apiClient.post(`${API_BASE_URL}/api/cloudinary/pending`, { imageUrl });
    } catch (error) {
      console.error("Error registering pending Cloudinary image:", error);
      throw error;
    }
  },

  /**
   * Eliminar imagen de Cloudinary del usuario autenticado
   * DELETE /api/cloudinary/image
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

