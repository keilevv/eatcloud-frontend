import { ChartPoint } from './ChartPoint';

export interface ChartSeries<T = unknown> {
  id: string;
  name: string;
  data: ChartPoint<T>[];
  color?: string;
}
