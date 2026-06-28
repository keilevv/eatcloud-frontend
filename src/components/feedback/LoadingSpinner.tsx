import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  className,
  label = 'Loading',
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner label="Loading application..." />
    </div>
  );
}
