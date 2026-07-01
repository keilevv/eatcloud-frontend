'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import React, { useEffect, useRef } from 'react';

import { ClusterMode } from './ClusterMarkerMap';
import { MapPoint } from './HeatMapChart';

// Fix Leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface ClusterMarkerMapInnerProps {
  points: MapPoint[];
  mode: ClusterMode;
  height: number;
}

/** Returns a colour based on the relative magnitude of the value (green→yellow→red) */
function colorForValue(value: number, max: number): string {
  const ratio = max > 0 ? value / max : 0;
  if (ratio < 0.25) return '#22c55e'; // green
  if (ratio < 0.5) return '#eab308';  // yellow
  if (ratio < 0.75) return '#f97316'; // orange
  return '#ef4444';                    // red
}

/** Creates a circular div icon styled like the reference screenshots */
function makeCircleIcon(value: number, max: number): L.DivIcon {
  const color = colorForValue(value, max);
  const label = value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value);
  return L.divIcon({
    html: `
      <div style="
        background:${color};
        color:#fff;
        width:44px;
        height:44px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:12px;
        font-weight:700;
        border:2px solid rgba(255,255,255,0.7);
        box-shadow:0 2px 6px rgba(0,0,0,0.35);
      ">${label}</div>
    `,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export const ClusterMarkerMapInner: React.FC<ClusterMarkerMapInnerProps> = ({
  points,
  mode,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);

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

    const values = validPoints.map((p) => (mode === 'quantity' ? p.quantity : p.totalKg));
    const maxVal = Math.max(...values, 1);

    // Remove old cluster group
    if (clusterGroupRef.current) {
      mapRef.current.removeLayer(clusterGroupRef.current);
    }

    const clusterGroup = (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 60,
      iconCreateFunction: (cluster: any) => {
        const total = cluster
          .getAllChildMarkers()
          .reduce((sum: number, m: any) => sum + (m.options.value ?? 0), 0);
        return makeCircleIcon(total, maxVal);
      },
    });

    validPoints.forEach((p) => {
      const value = mode === 'quantity' ? p.quantity : p.totalKg;
      const marker = L.marker([p.latitude, p.longitude], {
        icon: makeCircleIcon(value, maxVal),
        // store value so cluster can sum it
        ...(({ value } as any)),
      } as any);

      // Store value directly on the options object
      (marker.options as any).value = value;

      marker.bindPopup(`
        <div style="min-width:160px">
          <strong>${p.donationPoint}</strong><br/>
          <span style="color:#666;font-size:12px">${p.city ?? ''} • ${p.donor}</span><br/>
          <div style="margin-top:6px;font-size:13px">
            <span>Cantidad: <strong>${p.quantity.toLocaleString()}</strong></span><br/>
            <span>KG: <strong>${p.totalKg.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</strong></span>
          </div>
        </div>
      `);

      clusterGroup.addLayer(marker);
    });

    mapRef.current.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
  }, [points, mode]);

  return <div ref={containerRef} style={{ height, width: '100%' }} />;
};
