import { httpClient } from "./httpClient";

export const authApi = {
  register: (payload) => httpClient.post("/auth/register/", payload),
  login: (payload) => httpClient.post("/auth/login/", payload),
  refresh: (refreshToken) => httpClient.post("/auth/refresh/", { refresh: refreshToken }),
  logout: (refreshToken) => httpClient.post("/auth/logout/", { refresh: refreshToken }),
};
