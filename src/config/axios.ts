import axios from "axios";
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, API_TIMEOUT } from "../config/env";

declare module "axios" {
  interface AxiosRequestConfig {
    skipUnauthorizedHandler?: boolean;
  }
}

let unauthorizedHandler: (() => void) | null = null;
let sessionExpiredHandler: (() => void) | null = null;

/** Conecta el 401 al navigate del router (main.tsx). Evita importar el router acá. */
export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

/** Limpia el estado de AuthContext cuando la cookie ya no vale. */
export function setSessionExpiredHandler(handler: () => void) {
  sessionExpiredHandler = handler;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      sessionExpiredHandler?.();

      const skipRedirect = (error.config as InternalAxiosRequestConfig | undefined)
        ?.skipUnauthorizedHandler;
      if (!skipRedirect) {
        if (unauthorizedHandler) {
          unauthorizedHandler();
        } else {
          window.location.href = "/login";
        }
      }
    }

    if (error.response?.status === 403) {
      console.error("Acceso denegado");
    }

    if (error.response?.status === 404) {
      const isGet = error.config?.method === "get";
      const isApiResponse =
        (error.response?.data as Record<string, unknown>)?.success !== undefined;

      if (isGet && isApiResponse) {
        return error.response;
      }
      console.error("Recurso no encontrado");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
