/**
 * Configuración de variables de entorno
 * En Vite, las variables deben empezar con VITE_ para ser expuestas al cliente
 */

// Obtener la URL base del API desde las variables de entorno
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Obtener el entorno actual (development, production)
export const NODE_ENV = import.meta.env.MODE;

// Verificar si estamos en producción
export const IS_PRODUCTION = import.meta.env.PROD;

// Verificar si estamos en desarrollo
export const IS_DEVELOPMENT = import.meta.env.DEV;

// Timeout para las peticiones (en milisegundos)
export const API_TIMEOUT = parseInt(
  import.meta.env.VITE_API_TIMEOUT || "10000",
);

// Configuración para logging
export const ENABLE_LOGGING = IS_DEVELOPMENT;

/**
 * Log en consola solo en desarrollo
 */
export function devLog(...args: unknown[]) {
  if (ENABLE_LOGGING) {
    console.log("[DEV]", ...args);
  }
}

/**
 * Variables de entorno disponibles en Vite:
 *
 * import.meta.env.MODE           - 'development' o 'production'
 * import.meta.env.BASE_URL       - base URL configurada
 * import.meta.env.PROD           - boolean (true en producción)
 * import.meta.env.DEV            - boolean (true en desarrollo)
 * import.meta.env.SSR            - boolean (true en server-side)
 * import.meta.env.VITE_*         - variables personalizadas
 */
