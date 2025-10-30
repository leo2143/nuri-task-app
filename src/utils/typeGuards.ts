/**
 * Type Guards para verificar tipos de respuestas de la API
 * Facilita el manejo de errores y respuestas con TypeScript
 */

import type {
  IConflictResponse,
  IBadRequestResponse,
  IValidationErrorResponse,
  ISuccessResponse,
  ICreatedResponse,
  INotFoundResponse,
  IErrorResponse
} from '../interfaces';

/**
 * Verifica si la respuesta es un error de conflicto (409)
 */
export function isConflictResponse(data: unknown): data is IConflictResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    (data as IConflictResponse).status === 409 &&
    'success' in data &&
    (data as IConflictResponse).success === false &&
    'conflict' in data
  );
}

/**
 * Verifica si la respuesta es una solicitud incorrecta genérica (400)
 */
export function isBadRequestResponse(data: unknown): data is IBadRequestResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    (data as IBadRequestResponse).status === 400 &&
    'success' in data &&
    (data as IBadRequestResponse).success === false &&
    'details' in data &&
    !('errors' in data) // No es un ValidationError
  );
}

/**
 * Verifica si la respuesta es un error de validación (400)
 */
export function isValidationErrorResponse(data: unknown): data is IValidationErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    (data as IValidationErrorResponse).status === 400 &&
    'success' in data &&
    (data as IValidationErrorResponse).success === false &&
    'errors' in data
  );
}

/**
 * Verifica si la respuesta es exitosa con datos (200)
 */
export function isSuccessResponse<T = unknown>(data: unknown): data is ISuccessResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as ISuccessResponse<T>).success === true &&
    'data' in data
  );
}

/**
 * Verifica si la respuesta es de recurso creado (201)
 */
export function isCreatedResponse<T = unknown>(data: unknown): data is ICreatedResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    (data as ICreatedResponse<T>).status === 201 &&
    'success' in data &&
    (data as ICreatedResponse<T>).success === true &&
    'data' in data
  );
}

/**
 * Verifica si la respuesta es de recurso no encontrado (404)
 */
export function isNotFoundResponse(data: unknown): data is INotFoundResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    (data as INotFoundResponse).status === 404 &&
    'success' in data &&
    (data as INotFoundResponse).success === false
  );
}

/**
 * Verifica si la respuesta es un error genérico
 */
export function isErrorResponse(data: unknown): data is IErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as IErrorResponse).success === false &&
    'status' in data
  );
}

/**
 * Extrae el mensaje de error de cualquier tipo de respuesta de error
 */
export function extractErrorMessage(error: unknown): string {
  // Si es un error de Axios
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: unknown } };
    const data = axiosError.response?.data;
    
    // Conflicto (409)
    if (isConflictResponse(data)) {
      return data.message || 'Conflicto: el recurso ya existe';
    }
    
    // Solicitud incorrecta (400)
    if (isBadRequestResponse(data)) {
      return data.message || 'Solicitud incorrecta';
    }
    
    // Error de validación (400)
    if (isValidationErrorResponse(data)) {
      // Tomar el primer error de validación
      const errors = data.errors;
      if (errors) {
        const firstError = Object.values(errors)[0];
        return firstError?.[0] || data.message || 'Error de validación';
      }
      return data.message || 'Error de validación';
    }
    
    // No encontrado (404)
    if (isNotFoundResponse(data)) {
      return data.message || 'Recurso no encontrado';
    }
    
    // Error genérico
    if (isErrorResponse(data)) {
      return data.message || 'Error en la solicitud';
    }
    
    // Si tiene mensaje directamente
    if (data && typeof data === 'object' && 'message' in data) {
      return (data as { message: string }).message;
    }
  }
  
  // Si es un Error de JavaScript
  if (error instanceof Error) {
    return error.message;
  }
  
  // Mensaje por defecto
  return 'Ha ocurrido un error';
}

/**
 * Extrae detalles adicionales de un error para debugging
 */
export function extractErrorDetails(error: unknown): Record<string, unknown> | null {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: unknown } };
    const data = axiosError.response?.data;
    
    if (isConflictResponse(data)) {
      return {
        type: 'conflict',
        field: data.conflict.field,
        value: data.conflict.value,
        message: data.message
      };
    }
    
    if (isBadRequestResponse(data)) {
      return {
        type: 'bad_request',
        details: data.details,
        message: data.message
      };
    }
    
    if (isValidationErrorResponse(data)) {
      return {
        type: 'validation',
        errors: data.errors,
        message: data.message
      };
    }
  }
  
  return null;
}

