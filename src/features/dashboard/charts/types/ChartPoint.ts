export interface ChartPoint<T = unknown> {
  x: string | number | Date;
  y: number;
  label?: string;
  meta?: T;
}
