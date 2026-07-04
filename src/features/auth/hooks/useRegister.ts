import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import type { NormalizedApiError } from '@/types';

import { authService } from '../services/auth.service';
import { RegisterCredentials } from '../types/auth.types';

export const useRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const executeRegister = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await authService.register(credentials);
      setSuccess(true);
      toast.success('User registered successfully');
      router.push('/login');
    } catch (err) {
      const apiError = err as NormalizedApiError;
      const message = apiError?.message || 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { register: executeRegister, isLoading, error, success };
};
