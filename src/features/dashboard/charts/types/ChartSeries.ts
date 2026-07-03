import { ChartPoint } from './ChartPoint';

export interface ChartSeries<T = unknown> {
  id: string;
  name: string;
  data: ChartPoint<T>[];
  color?: string;
  type?: 'bar' | 'line';
}

export interface ChartAdapterResult<T = unknown> {
  series: ChartSeries<T>[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisFormat?: 'thousands' | 'percentage' | 'none';
  yAxisFormat?: 'thousands' | 'percentage' | 'kilograms' | 'none';
  y2AxisLabel?: string;
  y2AxisFormat?: 'thousands' | 'percentage' | 'kilograms' | 'none';
}
