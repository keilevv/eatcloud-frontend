'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useMemo, useRef } from 'react';

import { loadLeafletHeat } from '../utils/loadLeafletHeat';
import { downsampleMapPoints } from '../utils/downsampleMapPoints';
import { areMapPointChartPropsEqual } from '../utils/mapChartMemo';

import { HeatMapMode, MapPoint } from './HeatMapChart';

// Fix Leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface HeatMapChartInnerProps {
  points: MapPoint[];
  mode: HeatMapMode;
  height: number;
}

const HeatMapChartInnerComponent: React.FC<HeatMapChartInnerProps> = ({
  points,
  mode,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<L.Layer | null>(null);

  const sampledPoints = useMemo(
    () => downsampleMapPoints(points),
    [points],
  );

  const validPoints = useMemo(
    () =>
      sampledPoints.filter(
        (point) => point.latitude !== 0 && point.longitude !== 0,
      ),
    [sampledPoints],
  );

  const heatData = useMemo((): [number, number, number][] => {
    if (validPoints.length === 0) return [];

    const maxVal = Math.max(
      ...validPoints.map((point) =>
        mode === 'quantity' ? point.quantity : point.totalKg,
      ),
      1,
    );

    const INTENSITY_EXPONENT = 0.2;

    return validPoints.map((point) => [
      point.latitude,
      point.longitude,
      Math.pow(
        (mode === 'quantity' ? point.quantity : point.totalKg) / maxVal,
        INTENSITY_EXPONENT,
      ),
    ]);
  }, [validPoints, mode]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: [4.5709, -74.2973],
        zoom: 5,
        zoomControl: true,
        preferCanvas: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      heatLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || heatData.length === 0) return;

    let cancelled = false;

    loadLeafletHeat().then(() => {
      if (!mapRef.current || cancelled) return;

      if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
      }

      heatLayerRef.current = (L as any).heatLayer(heatData, {
        radius: 30,
        blur: 20,
        maxZoom: 10,
        gradient: {
          0.0: '#000011',
          0.2: '#0033ff',
          0.4: '#00ff88',
          0.6: '#88ff00',
          0.8: '#ffee00',
          1.0: '#ff2200',
        },
      }).addTo(mapRef.current);
    });

    return () => {
      cancelled = true;
    };
  }, [heatData]);

  return <div ref={containerRef} style={{ height, width: '100%' }} />;
};

export const HeatMapChartInner = React.memo(
  HeatMapChartInnerComponent,
  areMapPointChartPropsEqual,
);

HeatMapChartInner.displayName = 'HeatMapChartInner';
