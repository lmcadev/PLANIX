import { apiClient } from '~/lib/apiClient';
import type { Paginated, User, UserPayload } from '~/types';

export const usersApi = {
  list: () => apiClient.get<Paginated<User> | User[]>('/users/'),

  get: (id: number) => apiClient.get<User>(`/users/${id}/`),

  create: (payload: UserPayload) => apiClient.post<User>('/users/', payload),

  update: (id: number, payload: Partial<UserPayload>) => apiClient.patch<User>(`/users/${id}/`, payload),

  remove: (id: number) => apiClient.delete(`/users/${id}/`),
};
