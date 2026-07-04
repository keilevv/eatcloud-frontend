'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import type { NormalizedApiError } from '@/types';

import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { authStorage } from '../services/auth.storage';
import { AuthState, LoginCredentials } from '../types/auth.types';

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    const token = authStorage.getToken();
    if (!token) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      }));
      return;
    }

    try {
      const user = await authService.getCurrentUser();
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch {
      authStorage.removeToken();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired. Please login again.',
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleUnauthorized = () => {
      authStorage.removeToken();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired',
      });
      router.push('/login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () =>
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [router]);

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { token, user } = await authService.login(credentials);
      authStorage.setToken(token);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const apiError = error as NormalizedApiError;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: apiError?.message || 'Login failed',
      }));
      throw error;
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
    } finally {
      if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'LOGOUT' }),
        );
      }
      authStorage.removeToken();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
