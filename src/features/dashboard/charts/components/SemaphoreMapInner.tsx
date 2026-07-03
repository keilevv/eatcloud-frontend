'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import React, { useEffect, useRef } from 'react';

import { SemaphorePoint } from './SemaphoreMap';

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
  const riskValues = points.map((p) => {
    switch (p.riskLevel) {
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
  points.forEach((p) => {
    const type = p.type || '';
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

export const SemaphoreMapInner: React.FC<SemaphoreMapInnerProps> = ({
  semaphorePoints,
  beneficiaryPoints,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const semaphoreClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const beneficiaryClusterRef = useRef<L.MarkerClusterGroup | null>(null);

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

      // Create semaphore cluster group with custom icon function
      semaphoreClusterRef.current = L.markerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 20,
        iconCreateFunction: (cluster) => {
          const markers = cluster.getAllChildMarkers();
          const points = markers.map((m) => (m as any).pointData);
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

      // Create beneficiary cluster group with distinct styling based on majority type
      beneficiaryClusterRef.current = L.markerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 50,
        iconCreateFunction: (cluster) => {
          const markers = cluster.getAllChildMarkers();
          const points = markers.map((m) => (m as any).pointData);
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
    if (!mapRef.current || !semaphoreClusterRef.current || !beneficiaryClusterRef.current) return;

    // Clear existing markers from both cluster groups
    semaphoreClusterRef.current.clearLayers();
    beneficiaryClusterRef.current.clearLayers();

    // Process semaphore points (donation points) - add to semaphore cluster
    const validSemaphorePoints = semaphorePoints.filter(
      (p) => p.latitude !== 0 && p.longitude !== 0,
    );

    if (validSemaphorePoints.length > 0) {
      const donationValues = validSemaphorePoints.map((p) => p.value ?? 0);
      const maxVal = Math.max(...donationValues, 1);

      validSemaphorePoints.forEach((p) => {
        const marker = L.marker([p.latitude, p.longitude], {
          icon: makeDonationPointIcon(p, maxVal),
        });

        // Store point data for cluster icon calculation
        (marker as any).pointData = p;

        marker.bindPopup(`
          <div style="min-width:50px">
           <span>Punto de donación: <strong>${p.label}</strong></span><br/>
            <span>Donante: <strong>${p.donor}</strong></span><br/>
            <div style="margin-top:6px;font-size:13px">
              <span>Total: <strong>${(p.value ?? 0).toLocaleString()}</strong></span><br/>
              <span>Riesgo: <strong>${((p.probability ?? 0) * 100).toFixed(2).toLocaleString()}%</strong></span>
            </div>
          </div>
        `);

        semaphoreClusterRef.current!.addLayer(marker);
      });
    }

    // Process beneficiary points - add to beneficiary cluster
    const validBeneficiaryPoints = beneficiaryPoints.filter(
      (p) => p.latitude !== 0 && p.longitude !== 0,
    );

    validBeneficiaryPoints.forEach((p) => {
      const marker = L.marker([p.latitude, p.longitude], {
        icon: makeBeneficiaryIcon(p.type),
      });

      // Store point data for cluster icon calculation
      (marker as any).pointData = p;

      marker.bindPopup(`
        <div style="min-width:50px">
          <span>Beneficiario: <strong>${p.label}</strong></span><br/>
          <span>Tipo: <strong>${formatType(p.type) + ` (${p.type})`}</strong></span><br/>
          <span>Estado: <strong>${p.status}</strong></span><br/>
          ${p.phone ? `<span>Teléfono: <strong>${p.phone}</strong></span><br/>` : ''}
        </div>
      `);

      beneficiaryClusterRef.current!.addLayer(marker);
    });

    // Fit bounds to show all markers from both cluster groups
    const allLayers = [
      ...semaphoreClusterRef.current.getLayers(),
      ...beneficiaryClusterRef.current.getLayers(),
    ];
    if (allLayers.length > 0) {
      const group = L.featureGroup(allLayers);
      mapRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  }, [semaphorePoints, beneficiaryPoints]);

  return <div ref={containerRef} style={{ height, width: '100%' }} />;
};
