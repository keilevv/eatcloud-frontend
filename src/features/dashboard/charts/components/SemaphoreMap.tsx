'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import { areSemaphoreMapPropsEqual } from '../utils/mapChartMemo';

export interface SemaphorePoint {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  value?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  probability?: number;
  donor?: string;
  category?: string;
  // Beneficiary-specific fields
  phone?: string;
  status?: string;
  type?: string;
  city?: string;
  department?: string;
}

interface SemaphoreMapProps {
  semaphorePoints?: SemaphorePoint[];
  beneficiaryPoints?: SemaphorePoint[];
  height?: number;
}

const SemaphoreMapInner = dynamic(
  () => import('./SemaphoreMapInner').then((m) => m.SemaphoreMapInner),
  { ssr: false, loading: () => <div className="bg-muted h-full w-full animate-pulse rounded" /> },
);

const SemaphoreMapInnerComponent = ({
  semaphorePoints = [],
  beneficiaryPoints = [],
  height = 420,
}: SemaphoreMapProps) => {
  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-lg">
      <SemaphoreMapInner 
        semaphorePoints={semaphorePoints} 
        beneficiaryPoints={beneficiaryPoints} 
        height={height} 
      />
    </div>
  );
};

export const SemaphoreMap = React.memo(
  SemaphoreMapInnerComponent,
  areSemaphoreMapPropsEqual,
);
SemaphoreMap.displayName = 'SemaphoreMap';
