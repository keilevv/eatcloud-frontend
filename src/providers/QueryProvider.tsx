'use client';

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

import { QUERY_DEFAULTS } from '@/constants';
import type { NormalizedApiError } from '@/types';

const handleQueryError = (error: unknown): void => {
  const normalizedError = error as NormalizedApiError;
  console.error(normalizedError.message);
};

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleQueryError,
        }),
        mutationCache: new MutationCache({
          onError: handleQueryError,
        }),
        defaultOptions: {
          queries: {
            staleTime: QUERY_DEFAULTS.STALE_TIME,
            gcTime: QUERY_DEFAULTS.GC_TIME,
            retry: QUERY_DEFAULTS.RETRY,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
