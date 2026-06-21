import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '~/store/authStore';
import type { AuthTokens } from '~/types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Instancia "limpia" sin interceptores, solo para pedir el refresh
// (evita que un 401 del propio refresh dispare un loop infinito).
const refreshClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const { access } = useAuthStore.getState();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refresh, setTokens, logout } = useAuthStore.getState();
  if (!refresh) return null;

  try {
    const { data } = await refreshClient.post<AuthTokens>('/auth/refresh/', { refresh });
    setTokens(data);
    return data.access;
  } catch {
    logout();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // Si ya hay un refresh en curso, todas las peticiones que lleguen
      // mientras tanto reutilizan la misma promesa en lugar de disparar
      // un /auth/refresh/ por cada una.
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccess = await refreshPromise;
      if (newAccess) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(originalRequest);
      }

      if (window.location.pathname !== '/login') {
        globalThis.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

export function extractErrorMessage(error: unknown, fallback = 'Ocurrio un error inesperado.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string') return data;
    if (data?.detail) return data.detail;
    if (data && typeof data === 'object') {
      const firstKey = Object.keys(data)[0];
      const firstValue = data[firstKey];
      if (Array.isArray(firstValue)) return `${firstKey}: ${firstValue[0]}`;
      if (typeof firstValue === 'string') return firstValue;
    }
  }
  return fallback;
}
