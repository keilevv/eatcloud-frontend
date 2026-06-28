'use client';

import { ErrorMessage } from '@/components/feedback/ErrorMessage';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md space-y-4">
        <ErrorMessage message={error.message} />
        <button
          type="button"
          onClick={reset}
          className="text-primary text-sm underline"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
