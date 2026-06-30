import { ChartConfig } from './ChartConfig';
import { ChartSeries } from './ChartSeries';

export interface ChartProps<T = unknown> {
  title?: string;
  subtitle?: string;
  dataset: ChartSeries<T>[];
  loading?: boolean;
  error?: boolean;
  height?: number;
  width?: number;
  emptyMessage?: string;
  config?: ChartConfig;
  onClick?: (point: unknown) => void;
  minWidth?: number;
}
