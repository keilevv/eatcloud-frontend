'use client';

import { AuthGuard } from './AuthGuard';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
}) => {
  return <AuthGuard>{children}</AuthGuard>;
};
