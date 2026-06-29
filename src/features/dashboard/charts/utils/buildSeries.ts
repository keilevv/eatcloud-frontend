import { ChartPoint } from '../types/ChartPoint';
import { ChartSeries } from '../types/ChartSeries';

export const buildSeries = <T>(
  id: string,
  name: string,
  data: ChartPoint<T>[],
  color?: string,
): ChartSeries<T> => {
  return {
    id,
    name,
    data,
    color,
  };
};
