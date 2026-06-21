import { apiClient } from '~/lib/apiClient';
import type { DashboardKPIs } from '~/types';

export const dashboardApi = {
  kpis: () => apiClient.get<DashboardKPIs>('/dashboard/kpis/'),
};
