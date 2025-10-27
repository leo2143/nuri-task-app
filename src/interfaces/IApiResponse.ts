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
export interface ISuccessResponse<T = any> extends IBaseResponse {
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
export interface ICreatedResponse<T = any> extends IBaseResponse {
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
 * Tipo unión para todas las posibles respuestas de la API
 */
export type ApiResponse<T = any> = 
  | ISuccessResponse<T>
  | IErrorResponse
  | INotFoundResponse
  | ICreatedResponse<T>
  | IValidationErrorResponse;

