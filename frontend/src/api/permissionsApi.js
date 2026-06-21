import { httpClient } from "./httpClient";

export const permissionsApi = {
  list: () => httpClient.get("/permissions/"),
  getById: (id) => httpClient.get(`/permissions/${id}/`),
  create: (payload) => httpClient.post("/permissions/", payload),
  update: (id, payload) => httpClient.put(`/permissions/${id}/`, payload),
  remove: (id) => httpClient.delete(`/permissions/${id}/`),
};
