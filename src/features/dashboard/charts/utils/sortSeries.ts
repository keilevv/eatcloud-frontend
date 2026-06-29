import { ChartPoint } from '../types/ChartPoint';

export const sortSeriesDesc = <T>(data: ChartPoint<T>[]): ChartPoint<T>[] => {
  return [...data].sort((a, b) => b.y - a.y);
};

export const sortSeriesAsc = <T>(data: ChartPoint<T>[]): ChartPoint<T>[] => {
  return [...data].sort((a, b) => a.y - b.y);
};
