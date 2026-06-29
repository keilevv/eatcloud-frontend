import { ChartPoint } from '../types/ChartPoint';
import { ChartSeries } from '../types/ChartSeries';
import { buildSeries } from '../utils/buildSeries';

export interface ScatterDTO {
  id: string;
  name: string;
  announcements: number;
  cancellationProbability: number;
}

export const ScatterAdapter = (
  dtoData: ScatterDTO[],
): ChartSeries<ScatterDTO>[] => {
  const points: ChartPoint<ScatterDTO>[] = dtoData.map((item) => ({
    x: item.announcements,
    y: item.cancellationProbability,
    label: item.name,
    meta: item,
  }));

  return [buildSeries('scatter-analysis', 'Scatter Analysis', points)];
};
