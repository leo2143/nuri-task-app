import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_TIMEOUT, devLog } from '../config/env';

/**
 * Instancia configurada de Axios
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de peticiones
 * Agrega el token de autenticación si existe
 */
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    devLog('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    devLog('API Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas
 * Maneja errores globales
 */
apiClient.interceptors.response.use(
  (response) => {
    devLog('API Response:', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    devLog('API Response Error:', error.response?.status, error.config?.url);
    
    // Manejo de errores comunes
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('Acceso denegado');
    }
    
    if (error.response?.status === 404) {
      console.error('Recurso no encontrado');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

