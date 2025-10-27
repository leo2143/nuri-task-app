/**
 * Interface para el modelo de User (Usuario)
 * Basado en el esquema de Mongoose userModel.js
 */

/**
 * Interface para el modelo de Usuario
 * Sincronizada con el esquema de Mongoose
 */
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface para crear un nuevo usuario
 */
export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

/**
 * Interface para actualizar un usuario
 */
export interface IUpdateUser {
  name?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
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
 * @deprecated Use IUser instead
 * Mantenido por compatibilidad con código existente
 */
  
