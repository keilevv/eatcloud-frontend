'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import { MapPoint } from './HeatMapChart';

export type ClusterMode = 'quantity' | 'totalKg';

interface ClusterMarkerMapProps {
  points: MapPoint[];
  mode?: ClusterMode;
  height?: number;
}

const ClusterMarkerMapInner = dynamic(
  () => import('./ClusterMarkerMapInner').then((m) => m.ClusterMarkerMapInner),
  { ssr: false, loading: () => <div className="bg-muted h-full w-full animate-pulse rounded" /> },
);

export const ClusterMarkerMap: React.FC<ClusterMarkerMapProps> = ({
  points,
  mode = 'quantity',
  height = 420,
}) => {
  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-lg">
      <ClusterMarkerMapInner points={points} mode={mode} height={height} />
    </div>
  );
};
