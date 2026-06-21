import { apiClient } from '~/lib/apiClient';
import type { Paginated, Permission, Role } from '~/types';

export interface RolePayload {
  name: string;
  description?: string;
  permission_ids?: number[];
}

export const rolesApi = {
  list: () => apiClient.get<Paginated<Role> | Role[]>('/roles/'),
  create: (payload: RolePayload) => apiClient.post<Role>('/roles/', payload),
  update: (id: number, payload: Partial<RolePayload>) => apiClient.patch<Role>(`/roles/${id}/`, payload),
  remove: (id: number) => apiClient.delete(`/roles/${id}/`),
};

export const permissionsApi = {
  list: () => apiClient.get<Paginated<Permission> | Permission[]>('/permissions/'),
};
