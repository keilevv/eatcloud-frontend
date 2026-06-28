import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveContainer({
  children,
  className,
}: ResponsiveContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4', className)}>
      {children}
    </div>
  );
}

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn('bg-background min-h-screen', className)}>
      {children}
    </div>
  );
}

interface ProtectedLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ProtectedLayout({ children, className }: ProtectedLayoutProps) {
  return (
    <div className={cn('bg-background min-h-screen', className)}>
      {children}
    </div>
  );
}
