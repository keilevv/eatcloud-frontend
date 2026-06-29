import { BarChart2 } from 'lucide-react';
import React from 'react';

interface ChartEmptyStateProps {
  message?: string;
}

export const ChartEmptyState: React.FC<ChartEmptyStateProps> = ({
  message = 'No data available',
}) => {
  return (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <BarChart2 className="h-8 w-8 opacity-20" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
};
