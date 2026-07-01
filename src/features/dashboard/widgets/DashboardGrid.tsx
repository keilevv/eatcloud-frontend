import React from 'react';

import { ResponsiveGrid } from '../components/ResponsiveGrid';

interface DashboardGridProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
}

export const DashboardGrid = ({ children, columns, gap }: DashboardGridProps) => {
  return <ResponsiveGrid columns={columns} gap={gap}>{children}</ResponsiveGrid>;
};
