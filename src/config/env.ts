/**
 * Configuración de variables de entorno
 * En Vite, las variables deben empezar con VITE_ para ser expuestas al cliente
 */

// Obtener la URL base del API desde las variables de entorno
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Timeout para las peticiones (en milisegundos)
export const API_TIMEOUT = parseInt(
  import.meta.env.VITE_API_TIMEOUT || "10000",
);
