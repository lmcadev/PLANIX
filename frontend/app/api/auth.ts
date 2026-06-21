import { apiClient } from '~/lib/apiClient';
import type { AuthTokens, User } from '~/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const authApi = {
  login: (payload: LoginPayload) => apiClient.post<AuthTokens>('/auth/login/', payload),

  register: (payload: RegisterPayload) => apiClient.post<User>('/auth/register/', payload),

  logout: (refresh: string) => apiClient.post('/auth/logout/', { refresh }),
};
