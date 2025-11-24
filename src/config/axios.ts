import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import { API_BASE_URL, API_TIMEOUT } from "../config/env";

/**
 * Instancia configurada de Axios
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor de peticiones
 * Agrega el token de autenticación si existe
 */
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Interceptor de respuestas
 * Maneja errores globales
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Manejo de errores comunes
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    //todo: Generar las vistas de error
    if (error.response?.status === 403) {
      console.error("Acceso denegado");
    }

    //todo: Generar las vistas de error
    if (error.response?.status === 404) {
      console.error("Recurso no encontrado");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
