import { apiClient } from '~/lib/apiClient';
import type { OperationalStatus, Paginated, Schedule, SchedulePayload } from '~/types';

export const schedulesApi = {
  list: () => apiClient.get<Paginated<Schedule> | Schedule[]>('/schedules/'),

  get: (id: number) => apiClient.get<Schedule>(`/schedules/${id}/`),

  create: (payload: SchedulePayload) => apiClient.post<Schedule>('/schedules/', payload),

  update: (id: number, payload: Partial<SchedulePayload>) => apiClient.patch<Schedule>(`/schedules/${id}/`, payload),

  remove: (id: number) => apiClient.delete(`/schedules/${id}/`),

  setOperationalStatus: (id: number, operational_status: OperationalStatus) =>
    apiClient.patch<Schedule>(`/schedules/${id}/operational-status/`, { operational_status }),
};
