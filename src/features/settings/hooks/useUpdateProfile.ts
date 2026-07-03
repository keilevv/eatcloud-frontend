import { useState } from 'react';

import { UpdateProfileData } from '../types/settings.types';

import { settingsService } from '../services/settings.service';

export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateProfile = async (data: UpdateProfileData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await settingsService.updateProfile(data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading, error, success };
};
