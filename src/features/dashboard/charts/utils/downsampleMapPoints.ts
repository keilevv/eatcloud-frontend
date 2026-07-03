import { MapPoint } from '../components/HeatMapChart';

const DEFAULT_MAX_POINTS = 500;
const DEFAULT_CLUSTER_MAX_POINTS = 350;
const GRID_PRECISION = 3;

function geoCellKey(latitude: number, longitude: number, cellSize: number): string {
  const latCell = Math.round(latitude / cellSize);
  const lngCell = Math.round(longitude / cellSize);
  return `${latCell}:${lngCell}`;
}

function strideSample<T>(points: T[], maxPoints: number): T[] {
  if (points.length <= maxPoints) return points;

  const stride = Math.ceil(points.length / maxPoints);
  return points.filter((_, index) => index % stride === 0);
}

/**
 * Spatially deduplicates geo points by keeping one point per grid cell.
 */
export function downsampleGeoPoints<T extends { latitude: number; longitude: number }>(
  points: T[],
  maxPoints = DEFAULT_MAX_POINTS,
): T[] {
  if (points.length <= maxPoints) return points;

  const cellSize = 10 ** -GRID_PRECISION;
  const buckets = new Map<string, T>();

  for (const point of points) {
    const key = geoCellKey(point.latitude, point.longitude, cellSize);
    if (!buckets.has(key)) {
      buckets.set(key, point);
    }
  }

  return strideSample(Array.from(buckets.values()), maxPoints);
}

/**
 * Spatially buckets nearby map points so heat/cluster layers stay responsive
 * with large datasets. Points in the same cell are merged by summing values.
 */
export function downsampleMapPoints(
  points: MapPoint[],
  maxPoints = DEFAULT_MAX_POINTS,
): MapPoint[] {
  if (points.length <= maxPoints) return points;

  const cellSize = 10 ** -GRID_PRECISION;
  const buckets = new Map<string, MapPoint>();

  for (const point of points) {
    const key = geoCellKey(point.latitude, point.longitude, cellSize);
    const existing = buckets.get(key);

    if (!existing) {
      buckets.set(key, { ...point });
      continue;
    }

    existing.quantity += point.quantity;
    existing.totalKg += point.totalKg;
  }

  return strideSample(Array.from(buckets.values()), maxPoints);
}

export function downsampleClusterMapPoints(
  points: MapPoint[],
  maxPoints = DEFAULT_CLUSTER_MAX_POINTS,
): MapPoint[] {
  return downsampleMapPoints(points, maxPoints);
}
