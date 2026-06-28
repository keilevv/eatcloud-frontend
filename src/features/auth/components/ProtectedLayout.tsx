'use client';

import React from 'react';

import { AuthGuard } from './AuthGuard';
import { UserMenu } from './UserMenu';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
}) => {
  return (
    <AuthGuard>
      <div className="bg-background flex min-h-screen flex-col">
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 w-full border-b backdrop-blur">
          <div className="container flex h-14 items-center justify-between">
            <div className="text-primary text-lg font-bold">
              EatCloud Dashboard
            </div>
            <UserMenu />
          </div>
        </header>
        <main className="container flex-1 py-6">{children}</main>
      </div>
    </AuthGuard>
  );
};
