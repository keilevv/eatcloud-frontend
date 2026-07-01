'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';

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

export const HeatMapChartInner: React.FC<HeatMapChartInnerProps> = ({
  points,
  mode,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialise map once
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: [4.5709, -74.2973], // Colombia centroid
        zoom: 5,
        zoomControl: true,
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
    };
  }, []);

  // Update heat layer when data or mode changes
  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;

    const validPoints = points.filter(
      (p) => p.latitude !== 0 && p.longitude !== 0,
    );

    if (validPoints.length === 0) return;

    const maxVal = Math.max(...validPoints.map((p) => (mode === 'quantity' ? p.quantity : p.totalKg)), 1);

    const heatData: [number, number, number][] = validPoints.map((p) => [
      p.latitude,
      p.longitude,
      (mode === 'quantity' ? p.quantity : p.totalKg) / maxVal, // normalise 0–1
    ]);

    // Remove old heat layer
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
    }

    // Dynamically import leaflet.heat (no @types needed, just attach)
    import('leaflet.heat').then(() => {
      if (!mapRef.current) return;
      heatLayerRef.current = (L as any).heatLayer(heatData, {
        radius: 35,
        blur: 25,
        maxZoom: 10,
        gradient: {
          0.0: '#3b00ff',
          0.2: '#00aaff',
          0.4: '#00ffaa',
          0.6: '#aaff00',
          0.8: '#ffaa00',
          1.0: '#ff0000',
        },
      }).addTo(mapRef.current);
    });
  }, [points, mode]);

  return <div ref={containerRef} style={{ height, width: '100%' }} />;
};
