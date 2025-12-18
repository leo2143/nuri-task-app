/**
 * Interface para el modelo de User (Usuario)
 * Basado en el esquema de Mongoose userModel.js
 */

/**
 * Interface para el modelo de Usuario
 * Sincronizada con el esquema de Mongoose
 */
export interface ISubscription {
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  subscription?: ISubscription;
  password: string;
  isAdmin: boolean;
  profileImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CreateAdminUserDto {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  isSubscribed?: boolean;
  profileImageUrl?: string | null;
}

export interface UpdateAdminUserDto {
  name?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
  isSubscribed?: boolean;
  profileImageUrl?: string | null;
}

/**
 * Interface para crear un nuevo usuario
 */
export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

/**
 * Interface para actualizar un usuario
 */
export interface IUpdateUser {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * Interface para login de usuario
 */
export interface ILoginUser {
  email: string;
  password: string;
}

/**
 * Interface para registro de usuario
 */
export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
}

/**
 * Interface para el perfil del usuario autenticado
 * GET /api/user/profile
 */
export interface IUserProfile {
  name: string;
  email: string;
  subscription: {
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
  };
  profileImageUrl: string | null;
}

/**
 * Interface para usuario autenticado (sin password)
 * Usado después del login para no exponer la contraseña
 */
export interface IAuthUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface para respuesta de autenticación
 */
export interface IAuthResponse {
  user: IAuthUser;
  token: string;
  message?: string;
}
/**
 * Interface para cambiar contraseña
 */
export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

/**
 * Interface para resetear contraseña (Admin)
 */
export interface IResetPassword {
  newPassword: string;
}

/**
 * Interface para filtros de usuarios
 * Usada en GET /api/users con query params
 */
export interface UserFilters {
  search?: string;
  isAdmin?: boolean;
  isSubscribed?: boolean;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}
