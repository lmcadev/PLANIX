import { httpClient } from "./httpClient";

export const usersApi = {
  list: () => httpClient.get("/users/"),
  getById: (id) => httpClient.get(`/users/${id}/`),
  create: (payload) => httpClient.post("/users/", payload),
  update: (id, payload) => httpClient.put(`/users/${id}/`, payload),
  remove: (id) => httpClient.delete(`/users/${id}/`),
};
