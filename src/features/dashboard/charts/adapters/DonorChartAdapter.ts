import { ChartPoint } from '../types/ChartPoint';
import { ChartSeries } from '../types/ChartSeries';
import { buildSeries } from '../utils/buildSeries';
import { sortSeriesDesc } from '../utils/sortSeries';

export interface DonorDTO {
  id: string;
  name: string;
  totalKg: number;
}

export const DonorChartAdapter = (
  dtoData: DonorDTO[],
): ChartSeries<DonorDTO>[] => {
  const points: ChartPoint<DonorDTO>[] = dtoData.map((item) => ({
    x: item.name,
    y: item.totalKg,
    label: item.name,
    meta: item,
  }));

  return [buildSeries('donors', 'Donors', sortSeriesDesc(points))];
};
