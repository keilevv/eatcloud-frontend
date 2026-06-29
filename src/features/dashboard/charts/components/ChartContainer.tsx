import React from 'react';

import { ErrorState } from '../../widgets/ErrorState';
import { useChartDimensions } from '../hooks/useChartDimensions';

import { ChartEmptyState } from './ChartEmptyState';
import { ChartLoadingState } from './ChartLoadingState';

interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  children: (props: { width: number; height: number }) => React.ReactNode;
  height?: number | string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  loading,
  error,
  empty,
  emptyMessage,
  children,
  height = 400,
}) => {
  const { ref, dimensions } = useChartDimensions();

  if (error) {
    return (
      <div style={{ height }}>
        <ErrorState
          title="Failed to load chart"
          description="An error occurred while fetching data."
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col" style={{ height }}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h4 className="text-sm font-semibold">{title}</h4>}
          {subtitle && (
            <p className="text-muted-foreground text-xs">{subtitle}</p>
          )}
        </div>
      )}

      <div className="relative w-full flex-1" ref={ref}>
        {loading && <ChartLoadingState />}
        {!loading && empty && <ChartEmptyState message={emptyMessage} />}
        {!loading &&
          !empty &&
          dimensions.width > 0 &&
          dimensions.height > 0 && (
            <div className="absolute inset-0">
              {children({ width: dimensions.width, height: dimensions.height })}
            </div>
          )}
      </div>
    </div>
  );
};
