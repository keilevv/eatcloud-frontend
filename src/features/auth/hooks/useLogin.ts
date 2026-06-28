import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { login: executeLogin, isLoading, error, success };
};
