'use client';

import dynamic from 'next/dynamic';
import React from 'react';

export interface MapPoint {
  latitude: number;
  longitude: number;
  donationPoint: string;
  donor: string;
  city?: string;
  department?: string;
  quantity: number;
  totalKg: number;
}

export type HeatMapMode = 'quantity' | 'totalKg';

interface HeatMapChartProps {
  points: MapPoint[];
  mode?: HeatMapMode;
  height?: number;
}

// ─── Inner map (client-only, no SSR) ────────────────────────────────────────
const HeatMapInner = dynamic(
  () => import('./HeatMapChartInner').then((m) => m.HeatMapChartInner),
  { ssr: false, loading: () => <div className="bg-muted h-full w-full animate-pulse rounded" /> },
);

export const HeatMapChart: React.FC<HeatMapChartProps> = ({
  points,
  mode = 'quantity',
  height = 420,
}) => {
  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-lg">
      <HeatMapInner points={points} mode={mode} height={height} />
    </div>
  );
};
