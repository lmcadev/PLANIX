import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const httpClient = axios.create({ baseURL });

export const AUTH_LOGOUT_EVENT = "planix:auth-logout";

let refreshPromise = null;

const requestNewAccessToken = async () => {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error("No hay refresh token disponible.");
  const response = await axios.post(`${baseURL}/auth/refresh/`, { refresh: refreshToken });
  tokenStorage.setAccessToken(response.data.access);
  return response.data.access;
};

httpClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");
    if (error.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;
    try {
      refreshPromise = refreshPromise || requestNewAccessToken();
      const accessToken = await refreshPromise;
      refreshPromise = null;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return httpClient(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      tokenStorage.clear();
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
      return Promise.reject(refreshError);
    }
  },
);
