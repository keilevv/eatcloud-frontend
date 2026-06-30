import React from 'react';

import { DashboardWidget } from './DashboardWidget';

interface KpiCardProps {
  title: string | React.ReactNode;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  loading?: boolean;
  error?: boolean;
}

export const KpiCard = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  loading,
  error,
}: KpiCardProps) => {
  if (loading) {
    return (
      <DashboardWidget className="animate-pulse">
        <div className="bg-muted mb-4 h-4 w-1/2 rounded"></div>
        <div className="bg-muted mb-2 h-8 w-3/4 rounded"></div>
        <div className="bg-muted h-3 w-1/3 rounded"></div>
      </DashboardWidget>
    );
  }

  if (error) {
    return (
      <DashboardWidget>
        <div className="text-destructive flex h-full items-center justify-center text-sm">
          Failed to load KPI
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget title={title} headerRight={icon}>
      <div className="mt-2">
        <div className="text-3xl font-bold">{value}</div>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center text-sm">
            {trend && (
              <span
                className={`mr-2 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {trend.isPositive ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
            )}
            {subtitle && (
              <span className="text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
};
