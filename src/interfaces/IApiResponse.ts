/**
 * Interfaces para las respuestas de la API
 * Define la estructura de las respuestas exitosas y de error
 * Actualizado para coincidir con el formato del backend usando 'meta'
 */

/**
 * Interface base para respuestas de la API
 */
export interface IBaseResponse {
  message: string | null;
  status: number;
  success: boolean;
  data: unknown;
  meta: unknown;
}

/**
 * Interface para metadata de paginación basada en cursor
 */
export interface IPaginationMeta {
  count: number;
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

/**
 * Interface para respuestas exitosas con datos
 * @property {T | null} data - Datos de la respuesta
 * @property {Object | null} meta - Metadatos adicionales (count, pagination, etc.)
 */
export interface ISuccessResponse<T = unknown> extends IBaseResponse {
  data: T | null;
  meta: IPaginationMeta | null;
  success: true;
  status: 200;
}

/**
 * Interface para respuestas de error genéricas
 * @property {null} data - Siempre null en errores
 * @property {null} meta - Siempre null en errores genéricos
 */
export interface IErrorResponse extends IBaseResponse {
  data: null;
  meta: null;
  success: false;
  status: number;
}

/**
 * Interface para respuestas de recurso no encontrado (404)
 * @property {null} data - Siempre null
 * @property {null} meta - Siempre null
 */
export interface INotFoundResponse extends IBaseResponse {
  data: null;
  meta: null;
  status: 404;
  success: false;
}

/**
 * Interface para respuestas de recurso creado exitosamente (201)
 * @property {T} data - Datos del recurso creado
 * @property {null} meta - Siempre null para recursos creados
 */
export interface ICreatedResponse<T = unknown> extends IBaseResponse {
  data: T;
  meta: null;
  status: 201;
  success: true;
}

/**
 * Interface para errores de validación (400)
 * @property {null} data - Siempre null
 * @property {Object | null} meta - Metadatos con los errores de validación
 */
export interface IValidationErrorResponse extends IBaseResponse {
  data: null;
  meta: { errors: Record<string, string[]> } | null;
  status: 400;
  success: false;
}

/**
 * Interface para respuestas de conflicto (409)
 * Usado cuando un recurso ya existe (ej: email duplicado)
 * @property {null} data - Siempre null
 * @property {Object | null} meta - Metadatos con información del conflicto
 * @example
 * // Uso típico: email duplicado, username duplicado, etc.
 * const response: IConflictResponse = {
 *   success: false,
 *   status: 409,
 *   message: 'El email ya está registrado',
 *   data: null,
 *   meta: { conflict: { field: 'email', value: 'user@example.com' } }
 * };
 */
export interface IConflictResponse extends IBaseResponse {
  data: null;
  meta: {
    conflict: {
      field: string | null;
      value: unknown;
    };
  } | null;
  status: 409;
  success: false;
}

/**
 * Interface para solicitudes incorrectas (400)
 * Usado para errores generales de solicitud (parámetros faltantes, formato incorrecto, etc.)
 * @property {null} data - Siempre null
 * @property {Object | null} meta - Metadatos con detalles adicionales del error
 * @example
 * // Uso típico: parámetros faltantes, formato incorrecto, etc.
 * const response: IBadRequestResponse = {
 *   success: false,
 *   status: 400,
 *   message: 'El campo email es requerido',
 *   data: null,
 *   meta: { details: { field: 'email', reason: 'required' } }
 * };
 */
export interface IBadRequestResponse extends IBaseResponse {
  data: null;
  meta: { details: unknown } | null;
  status: 400;
  success: false;
}

export type ApiResponse<T = unknown> =
  | ISuccessResponse<T>
  | IErrorResponse
  | INotFoundResponse
  | ICreatedResponse<T>
  | IValidationErrorResponse
  | IConflictResponse
  | IBadRequestResponse;
