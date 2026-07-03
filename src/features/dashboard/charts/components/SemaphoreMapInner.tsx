'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { downsampleGeoPoints } from '../utils/downsampleMapPoints';
import { areSemaphoreMapPropsEqual } from '../utils/mapChartMemo';

import { SemaphorePoint } from './SemaphoreMap';

const MAX_BENEFICIARY_POINTS = 400;

const formatType = (type: string | undefined) => {
  switch (type) {
    case 'T1':
      return 'Banco';
    case 'T2':
      return 'Fundación';
    case 'T3':
      return 'Otro';
    default:
      return 'Otro';
  }
};

// Fix Leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface SemaphoreMapInnerProps {
  semaphorePoints: SemaphorePoint[];
  beneficiaryPoints: SemaphorePoint[];
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

/** Returns color based on mean risk value (0-1) */
function colorForMeanRisk(meanRisk: number): string {
  if (meanRisk < 0.33) return '#22c55e'; // green
  if (meanRisk < 0.66) return '#eab308'; // yellow
  return '#ef4444'; // red
}

/** Calculate mean risk level from an array of points */
function calculateMeanRisk(points: SemaphorePoint[]): number {
  if (points.length === 0) return 0;
  const riskValues = points.map((point) => {
    switch (point.riskLevel) {
      case 'LOW': return 0;
      case 'MEDIUM': return 0.5;
      case 'HIGH': return 1;
      default: return 0;
    }
  });
  return riskValues.reduce((sum: number, val) => sum + val, 0) / riskValues.length;
}

/** Returns size based on value (min 20px, max 60px) */
function sizeForValue(value: number, max: number): number {
  const ratio = max > 0 ? value / max : 0;
  const minSize = 20;
  const maxSize = 60;
  return minSize + (maxSize - minSize) * ratio;
}

/** Creates a circular div icon for donation points (risk semaphore) */
function makeDonationPointIcon(point: SemaphorePoint, max: number): L.DivIcon {
  const color = colorForRiskLevel(point.riskLevel ?? 'LOW');
  const size = sizeForValue(point.value ?? 0, max);
  const label = point.value && point.value >= 1000 
    ? `${(point.value / 1000).toFixed(1)}K` 
    : point.value 
      ? 'DOP'
      : '';
  
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

/** Returns color based on beneficiary type */
function colorForBeneficiaryType(type: string): string {
  switch (type) {
    case 'T1':
      return '#3b82f6'; // blue for Banks
    case 'T2':
      return '#a855f7'; // purple for Foundations
    case 'T3':
      return '#f97316'; // orange for Others
    default:
      return '#9ca3af'; // gray for unknown
  }
}

/** Calculate majority type from an array of points */
function calculateMajorityType(points: SemaphorePoint[]): string {
  if (points.length === 0) return '';
  const typeCounts: Record<string, number> = {};
  points.forEach((point) => {
    const type = point.type || '';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  
  let maxCount = 0;
  let majorityType = '';
  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count;
      majorityType = type;
    }
  });
  
  return majorityType;
}

/** Creates a circular div icon for beneficiaries */
function makeBeneficiaryIcon(type?: string): L.DivIcon {
  const size = 30; // fixed size for beneficiaries
  const color = colorForBeneficiaryType(type || '');
  const label =  'B';
  
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

const SemaphoreMapInnerComponent: React.FC<SemaphoreMapInnerProps> = ({
  semaphorePoints,
  beneficiaryPoints,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const semaphoreClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const beneficiaryClusterRef = useRef<L.MarkerClusterGroup | null>(null);

  const validSemaphorePoints = useMemo(
    () =>
      semaphorePoints.filter(
        (point) => point.latitude !== 0 && point.longitude !== 0,
      ),
    [semaphorePoints],
  );

  const validBeneficiaryPoints = useMemo(
    () =>
      downsampleGeoPoints(
        beneficiaryPoints.filter(
          (point) => point.latitude !== 0 && point.longitude !== 0,
        ),
        MAX_BENEFICIARY_POINTS,
      ),
    [beneficiaryPoints],
  );

  const semaphoreMaxVal = useMemo(() => {
    if (validSemaphorePoints.length === 0) return 1;

    return Math.max(
      ...validSemaphorePoints.map((point) => point.value ?? 0),
      1,
    );
  }, [validSemaphorePoints]);

  const fitMapBounds = useCallback(() => {
    if (
      !mapRef.current ||
      !semaphoreClusterRef.current ||
      !beneficiaryClusterRef.current
    ) {
      return;
    }

    const allLayers = [
      ...semaphoreClusterRef.current.getLayers(),
      ...beneficiaryClusterRef.current.getLayers(),
    ];

    if (allLayers.length === 0) return;

    const group = L.featureGroup(allLayers);
    mapRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
  }, []);

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

      semaphoreClusterRef.current = L.markerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 50,
        iconCreateFunction: (cluster) => {
          const markers = cluster.getAllChildMarkers();
          const points = markers.map((marker) => (marker as any).pointData);
          const meanRisk = calculateMeanRisk(points);
          const color = colorForMeanRisk(meanRisk);
          const count = markers.length;
          
          return L.divIcon({
            html: `<div style="
              background:${color};
              color:#fff;
              width:40px;
              height:40px;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:14px;
              font-weight:700;
              border:2px solid rgba(255,255,255,0.7);
              opacity:0.8;
            ">${count}</div>`,
            className: '',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });
        },
      }).addTo(mapRef.current);

      beneficiaryClusterRef.current = L.markerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 50,
        iconCreateFunction: (cluster) => {
          const markers = cluster.getAllChildMarkers();
          const points = markers.map((marker) => (marker as any).pointData);
          const majorityType = calculateMajorityType(points);
          const color = colorForBeneficiaryType(majorityType);
          const count = cluster.getChildCount();
          
          return L.divIcon({
            html: `<div style="
              background:${color};
              color:#fff;
              width:40px;
              height:40px;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:14px;
              font-weight:700;
              border:2px solid rgba(255,255,255,0.7);
              opacity:0.8;
            ">${count}</div>`,
            className: '',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });
        },
      }).addTo(mapRef.current);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      semaphoreClusterRef.current = null;
      beneficiaryClusterRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !semaphoreClusterRef.current) return;

    semaphoreClusterRef.current.clearLayers();

    validSemaphorePoints.forEach((point) => {
      const marker = L.marker([point.latitude, point.longitude], {
        icon: makeDonationPointIcon(point, semaphoreMaxVal),
      });

      (marker as any).pointData = point;

      marker.bindPopup(`
        <div style="min-width:50px">
         <span>Punto de donación: <strong>${point.label}</strong></span><br/>
          <span>Donante: <strong>${point.donor}</strong></span><br/>
          <div style="margin-top:6px;font-size:13px">
            <span>Total: <strong>${(point.value ?? 0).toLocaleString()}</strong></span><br/>
            <span>Riesgo: <strong>${((point.probability ?? 0) * 100).toFixed(2).toLocaleString()}%</strong></span>
          </div>
        </div>
      `);

      semaphoreClusterRef.current!.addLayer(marker);
    });

    fitMapBounds();
  }, [validSemaphorePoints, semaphoreMaxVal, fitMapBounds]);

  useEffect(() => {
    if (!mapRef.current || !beneficiaryClusterRef.current) return;

    beneficiaryClusterRef.current.clearLayers();

    validBeneficiaryPoints.forEach((point) => {
      const marker = L.marker([point.latitude, point.longitude], {
        icon: makeBeneficiaryIcon(point.type),
      });

      (marker as any).pointData = point;

      marker.bindPopup(`
        <div style="min-width:50px">
          <span>Beneficiario: <strong>${point.label}</strong></span><br/>
          <span>Tipo: <strong>${formatType(point.type) + ` (${point.type})`}</strong></span><br/>
          <span>Estado: <strong>${point.status}</strong></span><br/>
          ${point.phone ? `<span>Teléfono: <strong>${point.phone}</strong></span><br/>` : ''}
        </div>
      `);

      beneficiaryClusterRef.current!.addLayer(marker);
    });

    fitMapBounds();
  }, [validBeneficiaryPoints, fitMapBounds]);

  return <div ref={containerRef} style={{ height, width: '100%' }} />;
};

export const SemaphoreMapInner = React.memo(
  SemaphoreMapInnerComponent,
  areSemaphoreMapPropsEqual,
);

SemaphoreMapInner.displayName = 'SemaphoreMapInner';
