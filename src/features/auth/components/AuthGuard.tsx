'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

import { useSession } from '../hooks/useSession';

import { SessionLoading } from './Loading';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return <SessionLoading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
