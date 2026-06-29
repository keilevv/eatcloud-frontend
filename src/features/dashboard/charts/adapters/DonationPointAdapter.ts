import { ChartPoint } from '../types/ChartPoint';
import { ChartSeries } from '../types/ChartSeries';
import { buildSeries } from '../utils/buildSeries';
import { sortSeriesDesc } from '../utils/sortSeries';

export interface DonationPointDTO {
  id: string;
  name: string;
  count: number;
}

export const DonationPointAdapter = (
  dtoData: DonationPointDTO[],
  limit: number = 10,
): ChartSeries<DonationPointDTO>[] => {
  const points: ChartPoint<DonationPointDTO>[] = dtoData.map((item) => ({
    x: item.name,
    y: item.count,
    label: item.name,
    meta: item,
  }));

  const sorted = sortSeriesDesc(points).slice(0, limit);
  return [buildSeries('donation-points', 'Donation Points', sorted)];
};
