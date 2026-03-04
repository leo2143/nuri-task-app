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

// Clave pública VAPID para Web Push
export const VAPID_PUBLIC_KEY: string =
  import.meta.env.VITE_VAPID_PUBLIC_KEY ||
  "BK2rwGaLxZj1I734DpT7Ocd9x7mjAy1S-oah86DPfn6Rhb45s2fYaEaq3pKn-iBdyb29KHpnhwq8O8u_-jBw4a4";
