import React from 'react';

import { DashboardWidget } from './DashboardWidget';

interface MapCardProps {
  title: string;
  loading?: boolean;
  error?: boolean;
  children?: React.ReactNode; // For future Leaflet maps
  subtitle?: string;
}

export const MapCard = ({ title, loading, error, children, subtitle }: MapCardProps) => {
  if (loading) {
    return (
      <DashboardWidget className="h-[500px] animate-pulse">
        <div className="bg-muted mb-6 h-4 w-1/4 rounded"></div>
        <div className="bg-muted/50 w-full flex-1 rounded"></div>
      </DashboardWidget>
    );
  }

  if (error) {
    return (
      <DashboardWidget title={title} className="h-[500px]">
        <div className="text-destructive flex h-full items-center justify-center text-sm">
          Failed to load map data
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget title={title} description={subtitle} className="min-h-[500px]">
      {children || (
        <div className="text-muted-foreground bg-muted/20 flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed text-sm">
          Map Placeholder
        </div>
      )}
    </DashboardWidget>
  );
};
