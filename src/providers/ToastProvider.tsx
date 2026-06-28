'use client';

import type { ReactNode } from 'react';

import { Toaster } from '@/components/ui/sonner';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}
