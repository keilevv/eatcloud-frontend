import apiClient from '@/services/api/api';
import { ApiResponse } from '@/types';

import { UpdateProfileData, User } from '../types/settings.types';

export const settingsService = {
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const { data: response } = await apiClient.patch<ApiResponse<User>>(
      '/user/profile',
      data,
    );
    return response.data;
  },
};
