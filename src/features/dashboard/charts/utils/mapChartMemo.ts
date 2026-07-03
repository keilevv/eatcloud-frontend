const CONFIG_KEYS = [
  'xAxisLabel',
  'yAxisLabel',
  'xAxisFormat',
  'yAxisFormat',
  'y2AxisLabel',
  'y2AxisFormat',
  'showLegend',
  'tooltipFormat',
] as const;

type ChartConfigLike = Partial<Record<(typeof CONFIG_KEYS)[number], unknown>>;

function areChartConfigsEqual(
  prev?: ChartConfigLike,
  next?: ChartConfigLike,
): boolean {
  if (prev === next) return true;
  if (!prev || !next) return !prev && !next;

  return CONFIG_KEYS.every((key) => prev[key] === next[key]);
}

export function areMapPointChartPropsEqual<
  T extends { points: unknown[]; mode?: string; height?: number },
>(prev: T, next: T): boolean {
  return (
    prev.points === next.points &&
    prev.mode === next.mode &&
    prev.height === next.height
  );
}

export function areSemaphoreMapPropsEqual<
  T extends {
    semaphorePoints?: unknown[];
    beneficiaryPoints?: unknown[];
    height?: number;
  },
>(prev: T, next: T): boolean {
  return (
    prev.semaphorePoints === next.semaphorePoints &&
    prev.beneficiaryPoints === next.beneficiaryPoints &&
    prev.height === next.height
  );
}

export function areScatterChartPropsEqual<
  T extends {
    dataset?: unknown;
    loading?: boolean;
    error?: boolean;
    height?: number;
    title?: string;
    subtitle?: string;
    config?: ChartConfigLike;
  },
>(prev: T, next: T): boolean {
  return (
    prev.dataset === next.dataset &&
    prev.loading === next.loading &&
    prev.error === next.error &&
    prev.height === next.height &&
    prev.title === next.title &&
    prev.subtitle === next.subtitle &&
    areChartConfigsEqual(prev.config, next.config)
  );
}
