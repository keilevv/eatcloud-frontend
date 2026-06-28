'use client';

import { ErrorMessage } from '@/components/feedback/ErrorMessage';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="max-w-md space-y-4">
            <ErrorMessage title="Application error" message={error.message} />
            <button type="button" onClick={reset}>
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
