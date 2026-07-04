import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import type { NormalizedApiError } from '@/types';

import { LoginCredentials } from '../types/auth.types';

import { useAuth } from './useAuth';

export const useLogin = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const executeLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await login(credentials);
      setSuccess(true);
      toast.success('Login successful');
      router.push('/dashboard');
    } catch (err) {
      const apiError = err as NormalizedApiError;
      const message = apiError?.message || 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { login: executeLogin, isLoading, error, success };
};
