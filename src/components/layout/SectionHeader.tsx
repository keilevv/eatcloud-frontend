import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      <h2 className="text-lg font-medium">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      ) : null}
    </div>
  );
}

interface ContentCardProps {
  children: ReactNode;
  className?: string;
}

export function ContentCard({ children, className }: ContentCardProps) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-lg border p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
