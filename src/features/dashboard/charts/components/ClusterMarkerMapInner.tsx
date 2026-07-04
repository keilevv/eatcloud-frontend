'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import React, { useEffect, useMemo, useRef } from 'react';
import { formatNumber } from '@/utils';

import { downsampleClusterMapPoints } from '../utils/downsampleMapPoints';
import { areMapPointChartPropsEqual } from '../utils/mapChartMemo';

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
  const label = formatNumber(value);
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

const ClusterMarkerMapInnerComponent: React.FC<ClusterMarkerMapInnerProps> = ({
  points,
  mode,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);

  const sampledPoints = useMemo(
    () => downsampleClusterMapPoints(points),
    [points],
  );

  const validPoints = useMemo(
    () =>
      sampledPoints.filter(
        (point) => point.latitude !== 0 && point.longitude !== 0,
      ),
    [sampledPoints],
  );

  const maxVal = useMemo(() => {
    if (validPoints.length === 0) return 1;

    return Math.max(
      ...validPoints.map((point) =>
        mode === 'quantity' ? point.quantity : point.totalKg,
      ),
      1,
    );
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
      clusterGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || validPoints.length === 0) return;

    if (clusterGroupRef.current) {
      mapRef.current.removeLayer(clusterGroupRef.current);
    }

    const clusterGroup = (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 60,
      iconCreateFunction: (cluster: any) => {
        const total = cluster
          .getAllChildMarkers()
          .reduce((sum: number, marker: any) => sum + (marker.options.value ?? 0), 0);
        return makeCircleIcon(total, maxVal);
      },
    });

    validPoints.forEach((point) => {
      const value = mode === 'quantity' ? point.quantity : point.totalKg;
      const marker = L.marker([point.latitude, point.longitude], {
        icon: makeCircleIcon(value, maxVal),
      } as L.MarkerOptions);

      (marker.options as any).value = value;

      marker.bindPopup(`
        <div style="min-width:160px">
          <strong>${point.donationPoint}</strong><br/>
          <span style="color:#666;font-size:12px">${point.city ?? ''} • ${point.donor}</span><br/>
          <div style="margin-top:6px;font-size:13px">
            <span>Cantidad: <strong>${point.quantity.toLocaleString()}</strong></span><br/>
            <span>KG: <strong>${point.totalKg.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</strong></span>
          </div>
        </div>
      `);

      clusterGroup.addLayer(marker);
    });

    mapRef.current.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
  }, [validPoints, mode, maxVal]);

  return <div ref={containerRef} style={{ height, width: '100%' }} />;
};

export const ClusterMarkerMapInner = React.memo(
  ClusterMarkerMapInnerComponent,
  areMapPointChartPropsEqual,
);

ClusterMarkerMapInner.displayName = 'ClusterMarkerMapInner';
