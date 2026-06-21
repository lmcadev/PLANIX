import { httpClient } from "./httpClient";

export const notificationsApi = {
  list: () => httpClient.get("/notifications/"),
  markAsRead: (id) => httpClient.patch(`/notifications/${id}/read/`),
};
