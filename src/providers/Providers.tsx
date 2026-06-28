'use client';

import type { ReactNode } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import { SessionProvider } from '@/features/auth/components/SessionProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ToastProvider } from '@/providers/ToastProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider>
          <SessionProvider>
            <ToastProvider>{children}</ToastProvider>
          </SessionProvider>
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
