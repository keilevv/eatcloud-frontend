import React from 'react';

import { DashboardWidget } from './DashboardWidget';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: boolean;
  children?: React.ReactNode; // For future Victory charts
}

export const ChartCard = ({
  title,
  subtitle,
  loading,
  error,
  children,
}: ChartCardProps) => {
  if (loading) {
    return (
      <DashboardWidget className="h-[400px] animate-pulse">
        <div className="bg-muted mb-6 h-4 w-1/4 rounded"></div>
        <div className="bg-muted/50 w-full flex-1 rounded"></div>
      </DashboardWidget>
    );
  }

  if (error) {
    return (
      <DashboardWidget
        title={title}
        description={subtitle}
        className="h-[400px]"
      >
        <div className="text-destructive flex h-full items-center justify-center text-sm">
          Failed to load chart data
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget
      title={title}
      description={subtitle}
      className="min-h-[400px]"
    >
      {children || (
        <div className="text-muted-foreground flex h-full min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed text-sm">
          Chart Placeholder
        </div>
      )}
    </DashboardWidget>
  );
};
