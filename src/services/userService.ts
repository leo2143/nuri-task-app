import apiClient from "../config/axios";
import type {
  IUser,
  ICreateUser,
  IUpdateUser,
  ILoginUser,
  IAuthResponse,
  ISuccessResponse,
  IChangePassword,
  IResetPassword,
} from "../interfaces";
import { API_BASE_URL } from "../config/env";

;

/**
 * Servicio para operaciones relacionadas con usuarios
 * Rutas sincronizadas con el backend Express
 */
export const userService = {
  /**
   * Login de usuario
   * POST /api/users/login
   * @public
   */
  login: async (credentials: ILoginUser): Promise<IAuthResponse> => {
    try {
      const response = await apiClient.post<ISuccessResponse<IAuthResponse>>(
        `${API_BASE_URL}/api/users/login`,
        credentials
      );

      // Guardar token en localStorage
      if (response.data.data?.token) {
        localStorage.setItem("authToken", response.data.data.token);
      }

      return response.data.data!;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  /**
   * Crear un nuevo usuario (Registro)
   * POST /api/users
   * @public
   */
  createUser: async (userData: ICreateUser): Promise<IUser> => {
    try {
      const response = await apiClient.post<ISuccessResponse<IUser>>(
        `${API_BASE_URL}/api/users`,
        userData
      );
      return response.data.data!;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  /**
   * Alias para registro de usuario
   */
  register: async (userData: ICreateUser): Promise<IUser> => {
    return userService.createUser(userData);
  },

  // ==========================================
  // RUTAS PROTEGIDAS (Requieren token válido)
  // ==========================================

  /**
   * Cambiar contraseña del usuario actual
   * PUT /api/users/change-password
   * @requires validarToken
   */
  changePassword: async (passwordData: IChangePassword): Promise<void> => {
    try {
      await apiClient.put(`${API_BASE_URL}/api/users/change-password`, passwordData);
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  /**
   * Logout de usuario (Local)
   * Elimina el token del localStorage
   */
  logout: (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // Opcional: redirigir al login
    window.location.href = `/login`;
  },

  // ==========================================
  // RUTAS DE ADMIN (Requieren token de admin)
  // ==========================================

  /**
   * Obtener todos los usuarios
   * GET /api/users
   * @requires validarAdminToken
   */
  getUsers: async (): Promise<IUser[]> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IUser[]>>(
        `${API_BASE_URL}/api/users`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  /**
   * Alias para getUsers
   */
  getAllUsers: async (): Promise<IUser[]> => {
    return userService.getUsers();
  },

  /**
   * Obtener un usuario por ID
   * GET /api/users/:id
   * @requires validarAdminToken
   */
  getUserById: async (id: string): Promise<IUser | null> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IUser>>(
        `${API_BASE_URL}/api/users/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar un usuario existente
   * PUT /api/users/:id
   * @requires validarAdminToken
   */
  updateUser: async (id: string, userData: IUpdateUser): Promise<IUser> => {
    try {
      const response = await apiClient.put<ISuccessResponse<IUser>>(
        `${API_BASE_URL}/api/users/${id}`,
        userData
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un usuario
   * DELETE /api/users/:id
   * @requires validarAdminToken
   */
  deleteUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE_URL}/api/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Resetear contraseña de un usuario (Solo Admin)
   * PUT /api/admin/users/:id/reset-password
   * @requires validarAdminToken
   */
  resetUserPassword: async (
    userId: string,
    passwordData: IResetPassword
  ): Promise<void> => {
    try {
      await apiClient.put(
        `${API_BASE_URL}/api/admin/users/${userId}/reset-password`,
        passwordData
      );
    } catch (error) {
      console.error(`Error resetting password for user ${userId}:`, error);
      throw error;
    }
  },
};
