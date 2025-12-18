import apiClient from "../config/axios";
import type {
  IUser,
  IUserProfile,
  ICreateUser,
  IUpdateUser,
  ILoginUser,
  IAuthResponse,
  ISuccessResponse,
  IChangePassword,
  IResetPassword,
  CreateAdminUserDto,
  UpdateAdminUserDto,
  UserFilters,
} from "../interfaces";
import { API_BASE_URL } from "../config/env";

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
        credentials,
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
        userData,
      );
      return response.data.data!;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // ==========================================
  // RUTAS DE RECUPERACIÓN DE CONTRASEÑA
  // ==========================================

  /**
   * Solicitar recuperación de contraseña (Envía email con token)
   * POST /api/users/forgot-password
   * @public
   */
  forgotPassword: async (
    email: string,
  ): Promise<{ message: string; devToken?: string }> => {
    try {
      const response = await apiClient.post<
        ISuccessResponse<{ message: string; devToken?: string }>
      >(`${API_BASE_URL}/api/users/forgot-password`, { email });
      return response.data.data!;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      throw error;
    }
  },

  /**
   * Verificar si un token de recuperación es válido
   * GET /api/users/verify-reset-token/:token
   * @public
   */
  verifyResetToken: async (
    token: string,
  ): Promise<{ valid: boolean; email?: string; message: string }> => {
    try {
      const response = await apiClient.get<
        ISuccessResponse<{ valid: boolean; email?: string; message: string }>
      >(`${API_BASE_URL}/api/users/verify-reset-token/${token}`);
      return response.data.data!;
    } catch (error) {
      console.error("Error verifying reset token:", error);
      throw error;
    }
  },

  /**
   * Resetear contraseña con token
   * POST /api/users/reset-password
   * @public
   */
  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<{ message: string; email: string }> => {
    try {
      const response = await apiClient.post<
        ISuccessResponse<{ message: string; email: string }>
      >(`${API_BASE_URL}/api/users/reset-password`, { token, newPassword });
      return response.data.data!;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },

  // ==========================================
  // RUTAS PROTEGIDAS (Requieren token válido)
  // ==========================================

  /**
   * Obtener perfil del usuario autenticado
   * GET /api/user/profile
   * @requires validarToken
   */
  getProfile: async (): Promise<IUserProfile> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IUserProfile>>(
        `${API_BASE_URL}/api/user/profile`,
      );
      return response.data.data!;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Cambiar contraseña del usuario actual
   * PUT /api/users/change-password
   * @requires validarToken
   */
  changePassword: async (passwordData: IChangePassword): Promise<void> => {
    try {
      await apiClient.put(
        `${API_BASE_URL}/api/users/change-password`,
        passwordData,
      );
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  /**
   * Logout de usuario (Local)
   * Elimina el token del localStorage
   * NOTA: Usar el contexto AuthContext.logout() en lugar de este método
   * @deprecated Usar useAuth().logout() para mejor manejo de estado
   */
  logout: (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  // ==========================================
  // RUTAS DE ADMIN (Requieren token de admin)
  // ==========================================

  /**
   * Obtener todos los usuarios
   * GET /api/users
   * @requires validarAdminToken
   */
  getAllUsers: async (filters?: UserFilters): Promise<IUser[]> => {
    try {
      // Construir query params
      const params = new URLSearchParams();

      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.isAdmin !== undefined) {
        params.append("isAdmin", String(filters.isAdmin));
      }
      if (filters?.isSubscribed !== undefined) {
        params.append("isSubscribed", String(filters.isSubscribed));
      }
      if (filters?.createdFrom) {
        params.append("createdFrom", filters.createdFrom);
      }
      if (filters?.createdTo) {
        params.append("createdTo", filters.createdTo);
      }
      if (filters?.sortBy) {
        params.append("sortBy", filters.sortBy);
      }
      if (filters?.sortOrder) {
        params.append("sortOrder", filters.sortOrder);
      }

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/users${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get<ISuccessResponse<IUser[]>>(url);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  /**
   * Obtener un usuario por ID
   * GET /api/users/:id
   * @requires validarAdminToken
   */
  getUserById: async (id: string): Promise<IUser | null> => {
    try {
      const response = await apiClient.get<ISuccessResponse<IUser>>(
        `${API_BASE_URL}/api/users/${id}`,
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
        userData,
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar un usuario existente desde el admin
   * PUT /api/users/:id
   * @requires validarAdminToken
   */
  adminUpdateUser: async (
    id: string,
    userData: UpdateAdminUserDto,
  ): Promise<IUser> => {
    try {
      const response = await apiClient.put<ISuccessResponse<IUser>>(
        `${API_BASE_URL}/api/admin/users/${id}`,
        userData,
      );
      return response.data.data!;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo usuario desde el admin
   * POST /api/users
   * @public
   */
  adminCreateUser: async (userData: CreateAdminUserDto): Promise<IUser> => {
    try {
      const response = await apiClient.post<ISuccessResponse<IUser>>(
        `${API_BASE_URL}/api/admin/users`,
        userData,
      );
      return response.data.data!;
    } catch (error) {
      console.error("Error creating user:", error);
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
    passwordData: IResetPassword,
  ): Promise<void> => {
    try {
      await apiClient.put(
        `${API_BASE_URL}/api/admin/users/${userId}/reset-password`,
        passwordData,
      );
    } catch (error) {
      console.error(`Error resetting password for user ${userId}:`, error);
      throw error;
    }
  },
};
