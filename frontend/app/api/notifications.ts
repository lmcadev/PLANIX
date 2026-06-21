import { apiClient } from '~/lib/apiClient';
import type { Notification, Paginated } from '~/types';

export const notificationsApi = {
  list: () => apiClient.get<Paginated<Notification> | Notification[]>('/notifications/'),
  markRead: (id: number) => apiClient.patch<Notification>(`/notifications/${id}/read/`),
};
