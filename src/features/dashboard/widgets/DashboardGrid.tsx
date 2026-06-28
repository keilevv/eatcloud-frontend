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
}

export const DashboardGrid = ({ children, columns }: DashboardGridProps) => {
  return <ResponsiveGrid columns={columns}>{children}</ResponsiveGrid>;
};
