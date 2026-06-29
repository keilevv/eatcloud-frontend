import apiClient from '@/services/api/api';
import { ApiResponse, User } from '@/types';

import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials,
    );
    return data.data;
  },

  register: async (
    credentials: RegisterCredentials,
  ): Promise<{ id: string; name: string; email: string }> => {
    const { data } = await apiClient.post<
      ApiResponse<{ id: string; name: string; email: string }>
    >('/auth/register', credentials);
    return data.data;
  },

  logout: async (): Promise<void> => {
    // Assuming backend might have a logout endpoint, or we just clear locally
    // If backend has it: await apiClient.post('/api/auth/logout');
    // The prompt says "Clear session immediately on logout" and mentions available endpoints: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me. So no backend logout endpoint.
    return Promise.resolve();
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } =
      await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    const responseData = data.data as unknown as { user?: User };
    return responseData.user || (data.data as unknown as User);
  },
};
