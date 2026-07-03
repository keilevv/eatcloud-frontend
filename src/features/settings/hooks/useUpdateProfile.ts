import { useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { normalizeApiError } from '@/services/api/api';

import { UpdateProfileData, User } from '../types/settings.types';

import { settingsService } from '../services/settings.service';

export const useUpdateProfile = () => {
  const { checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateProfile = async (data: UpdateProfileData): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await settingsService.updateProfile(data);
      await checkAuth();
      setSuccess(true);
      return updatedUser;
    } catch (err) {
      const normalizedError = normalizeApiError(err);
      setError(normalizedError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading, error, success, setSuccess, setError };
};
