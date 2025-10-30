/**
 * Interfaces para las respuestas de la API
 * Define la estructura de las respuestas exitosas y de error
 */

/**
 * Interface base para respuestas de la API
 */
export interface IBaseResponse {
  message: string | null;
  status: number;
  success: boolean;
}

/**
 * Interface para respuestas exitosas con datos
 */
export interface ISuccessResponse<T = unknown> extends IBaseResponse {
  data: T | null;
  count: number | null;
  success: true;
}

/**
 * Interface para respuestas de error
 */
export interface IErrorResponse extends IBaseResponse {
  success: false;
}

/**
 * Interface para respuestas de recurso no encontrado (404)
 */
export interface INotFoundResponse extends IBaseResponse {
  status: 404;
  success: false;
}

/**
 * Interface para respuestas de recurso creado exitosamente (201)
 */
export interface ICreatedResponse<T = unknown> extends IBaseResponse {
  data: T;
  status: 201;
  success: true;
}

/**
 * Interface para errores de validación (400)
 */
export interface IValidationErrorResponse extends IBaseResponse {
  status: 400;
  errors: Record<string, string[]> | null;
  success: false;
}

/**
 * Interface para respuestas de conflicto (409)
 * Usado cuando un recurso ya existe (ej: email duplicado)
 */
export interface IConflictResponse extends IBaseResponse {
  status: 409;
  success: false;
  conflict: {
    field: string | null;
    value: unknown;
  };
}

/**
 * Interface para solicitudes incorrectas (400)
 * Usado para errores generales de solicitud (parámetros faltantes, formato incorrecto, etc.)
 */
export interface IBadRequestResponse extends IBaseResponse {
  status: 400;
  success: false;
  details: unknown;
}

/**
 * Tipo unión para todas las posibles respuestas de la API
 */
export type ApiResponse<T = unknown> = 
  | ISuccessResponse<T>
  | IErrorResponse
  | INotFoundResponse
  | ICreatedResponse<T>
  | IValidationErrorResponse
  | IConflictResponse
  | IBadRequestResponse;

