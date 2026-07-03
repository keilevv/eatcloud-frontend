'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import { formatNumber } from '@/utils';

import { SemaphorePoint } from './SemaphoreMap';

// Fix Leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface SemaphoreMapInnerProps {
  points: SemaphorePoint[];
  height: number;
}

/** Returns color based on risk level */
function colorForRiskLevel(riskLevel: string): string {
  switch (riskLevel) {
    case 'LOW':
      return '#22c55e'; // green
    case 'MEDIUM':
      return '#eab308'; // yellow
    case 'HIGH':
      return '#ef4444'; // red
    default:
      return '#9ca3af'; // gray
  }
}

/** Returns size based on value (min 20px, max 60px) */
function sizeForValue(value: number, max: number): number {
  const ratio = max > 0 ? value / max : 0;
  const minSize = 20;
  const maxSize = 60;
  return minSize + (maxSize - minSize) * ratio;
}

/** Creates a circular div icon styled for semaphore map */
function makeCircleIcon(point: SemaphorePoint, max: number): L.DivIcon {
  const color = colorForRiskLevel(point.riskLevel);
  const size = sizeForValue(point.value, max);
  const label = point.value >= 1000 ? `${(point.value / 1000).toFixed(1)}K` : String(point.value);
  
  return L.divIcon({
    html: `
      <div style="
        background:${color};
        color:#fff;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:${size * 0.35}px;
        font-weight:700;
        border:2px solid rgba(255,255,255,0.7);
        opacity:0.7;
      ">${label}</div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export const SemaphoreMapInner: React.FC<SemaphoreMapInnerProps> = ({
  points,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: [4.5709, -74.2973],
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

  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;

    const validPoints = points.filter(
      (p) => p.latitude !== 0 && p.longitude !== 0,
    );
    if (validPoints.length === 0) return;

    const values = validPoints.map((p) => p.value);
    const maxVal = Math.max(...values, 1);

    // Remove old markers
    markersRef.current.forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    validPoints.forEach((p) => {
      const marker = L.marker([p.latitude, p.longitude], {
        icon: makeCircleIcon(p, maxVal),
      });

      marker.bindPopup(`
        <div style="min-width:50px">
          <strong>${p.label}</strong><br/>
          <span> Donante: ${p.donor}</span><br/>
          <div style="margin-top:6px;font-size:13px">
            <span>Total: <strong>${p.value.toLocaleString()}</strong></span><br/>
            <span>Riesgo: <strong>${(p.probability * 100).toFixed(2).toLocaleString()}%</strong></span>
          </div>
        </div>
      `);

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  }, [points]);

  return <div ref={containerRef} style={{ height, width: '100%' }} />;
};
