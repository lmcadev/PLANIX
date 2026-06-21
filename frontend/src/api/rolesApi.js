import { httpClient } from "./httpClient";

export const rolesApi = {
  list: () => httpClient.get("/roles/"),
  getById: (id) => httpClient.get(`/roles/${id}/`),
  create: (payload) => httpClient.post("/roles/", payload),
  update: (id, payload) => httpClient.put(`/roles/${id}/`, payload),
  remove: (id) => httpClient.delete(`/roles/${id}/`),
};
