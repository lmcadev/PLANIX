import { httpClient } from "./httpClient";

export const schedulesApi = {
  list: () => httpClient.get("/schedules/"),
  getById: (id) => httpClient.get(`/schedules/${id}/`),
  create: (payload) => httpClient.post("/schedules/", payload),
  update: (id, payload) => httpClient.put(`/schedules/${id}/`, payload),
  remove: (id) => httpClient.delete(`/schedules/${id}/`),
  updateOperationalStatus: (id, operationalStatus) =>
    httpClient.patch(`/schedules/${id}/operational-status/`, {
      operational_status: operationalStatus,
    }),
};
