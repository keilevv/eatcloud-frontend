import { DashboardWidget } from './DashboardWidget';

export const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <DashboardSkeleton />
  </div>
);

export const CardSkeleton = () => (
  <DashboardWidget className="animate-pulse">
    <div className="bg-muted mb-4 h-4 w-1/3 rounded"></div>
    <div className="bg-muted h-10 w-full rounded"></div>
  </DashboardWidget>
);

export const GridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const SectionSkeleton = () => (
  <div className="mb-10 space-y-4">
    <div className="bg-muted h-8 w-1/4 animate-pulse rounded"></div>
    <div className="bg-muted h-40 w-full animate-pulse rounded"></div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-10">
    <div>
      <div className="bg-muted mb-6 h-8 w-1/4 animate-pulse rounded"></div>
      <GridSkeleton count={4} />
    </div>
    <SectionSkeleton />
    <SectionSkeleton />
  </div>
);
