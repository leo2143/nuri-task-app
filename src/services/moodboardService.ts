import apiClient from "../config/axios";
import type {
  IMoodboard,
  IMoodboardImage,
  IAddMoodboardImage,
  ISuccessResponse,
} from "../interfaces";
import { API_BASE_URL } from "../config/env";

/**
 * Servicio para operaciones relacionadas con el Moodboard (Visual Board)
 * Todas las rutas requieren token de autenticación (Bearer Token)
 */
export const moodboardService = {
  /**
   * Obtiene el moodboard del usuario autenticado
   * GET /api/moodboard
   * @requires Bearer Token
   */
  getMoodboard: async (): Promise<IMoodboard | null> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IMoodboard>>(
        `${API_BASE_URL}/api/moodboard`,
      );
      return response.data.data ?? null;
    } catch (error) {
      console.error("Error fetching moodboard:", error);
      throw error;
    }
  },

  /**
   * Actualiza el moodboard completo (batch de imágenes)
   * PUT /api/moodboard
   * @requires Bearer Token
   * @param images - Array de imágenes para actualizar
   */
  updateMoodboard: async (images: IMoodboardImage[]): Promise<IMoodboard> => {
    try {
      const response = await apiClient.put<ISuccessResponse<IMoodboard>>(
        `${API_BASE_URL}/api/moodboard`,
        { images },
      );
      return response.data.data!;
    } catch (error) {
      console.error("Error updating moodboard:", error);
      throw error;
    }
  },

  /**
   * Agrega una imagen al moodboard
   * POST /api/moodboard/images
   * @requires Bearer Token
   * @param imageData - Datos de la imagen a agregar
   */
  addImage: async (imageData: IAddMoodboardImage): Promise<IMoodboardImage> => {
    try {
      const response = await apiClient.post<ISuccessResponse<IMoodboardImage>>(
        `${API_BASE_URL}/api/moodboard/images`,
        imageData,
      );
      return response.data.data!;
    } catch (error) {
      console.error("Error adding image to moodboard:", error);
      throw error;
    }
  },

  /**
   * Actualiza una imagen del moodboard
   * PUT /api/moodboard/images/:imageId
   * @requires Bearer Token
   * @param imageId - ID de la imagen a actualizar
   * @param imageData - Datos actualizados de la imagen
   */
  updateImage: async (
    imageId: string,
    imageData: Partial<IAddMoodboardImage>,
  ): Promise<IMoodboardImage> => {
    try {
      const response = await apiClient.put<ISuccessResponse<IMoodboardImage>>(
        `${API_BASE_URL}/api/moodboard/images/${imageId}`,
        imageData,
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error updating image ${imageId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una imagen del moodboard
   * DELETE /api/moodboard/images/:imageId
   * @requires Bearer Token
   * @param imageId - ID de la imagen a eliminar
   */
  deleteImage: async (imageId: string): Promise<void> => {
    try {
      await apiClient.delete(
        `${API_BASE_URL}/api/moodboard/images/${imageId}`,
      );
    } catch (error) {
      console.error(`Error deleting image ${imageId}:`, error);
      throw error;
    }
  },
};
