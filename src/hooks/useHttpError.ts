import type { AxiosError } from "axios";
import { useState, useCallback } from "react";

/**
 * Hook para manejar errores HTTP de forma centralizada
 * Prioriza mensajes del backend sobre mensajes genéricos
 */
export function useHttpError() {
  // Estado para indicar si hay error activo
  const [error, setError] = useState(false);
  // Mensaje de error a mostrar al usuario
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Procesa un error y extrae el mensaje apropiado
   * @param err - Error capturado en try/catch
   * @returns Mensaje de error formateado
   */
  const handleError = useCallback((err: unknown): string => {
    let message = "Error inesperado";

    // Verificar si es un error de Axios (petición HTTP)
    if (err && typeof err === "object" && "response" in err) {
      const axiosError = err as AxiosError<{ message?: string }>;

      //Usar mensaje del backend si existe
      if (axiosError.response?.data?.message) {
        message = axiosError.response.data.message;
      }
    }
    // Error genérico de JavaScript
    else if (err instanceof Error && err.message) {
      message = err.message;
    }

    // Activar estado de error y guardar mensaje
    setError(true);
    setErrorMessage(message);
    return message;
  }, []);

  /**
   * Limpia el estado de error
   */
  const clearError = useCallback(() => {
    setError(false);
    setErrorMessage("");
  }, []);

  return {
    error,
    errorMessage,
    handleError,
    clearError,
    setError,
    setErrorMessage,
  };
}
