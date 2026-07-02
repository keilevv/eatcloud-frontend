import { ChartPoint } from '../types/ChartPoint';
import { ChartSeries } from '../types/ChartSeries';
import { buildSeries } from '../utils/buildSeries';
import { sortSeriesDesc } from '../utils/sortSeries';

export interface RiskDonorDTO {
  id: string;
  name: string;
  riskPercentage: number;
}

export const RiskDonorAdapter = (
  dtoData: RiskDonorDTO[],
  limit: number = 15,
): ChartSeries<RiskDonorDTO>[] => {

  const points: ChartPoint<RiskDonorDTO>[] = dtoData.map((item) => ({
    x: item.name,
    y: item.riskPercentage,
    label: item.name,
    meta: item,
  }));

  // Deduplicate by x (name) before sorting
  const uniquePoints = points.filter(
    (point, index, self) =>
      index === self.findIndex((p) => p.x === point.x)
  );

  const sorted = sortSeriesDesc(uniquePoints).slice(0, limit);
  return [buildSeries('risk-donors', 'Risk Donors', sorted)];
};
