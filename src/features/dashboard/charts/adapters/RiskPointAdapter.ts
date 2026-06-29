import { ChartPoint } from '../types/ChartPoint';
import { ChartSeries } from '../types/ChartSeries';
import { buildSeries } from '../utils/buildSeries';
import { sortSeriesDesc } from '../utils/sortSeries';

export interface RiskPointDTO {
  id: string;
  name: string;
  riskPercentage: number;
}

export const RiskPointAdapter = (
  dtoData: RiskPointDTO[],
  limit: number = 15,
): ChartSeries<RiskPointDTO>[] => {
  const points: ChartPoint<RiskPointDTO>[] = dtoData.map((item) => ({
    x: item.name,
    y: item.riskPercentage,
    label: item.name,
    meta: item,
  }));

  const sorted = sortSeriesDesc(points).slice(0, limit);
  return [buildSeries('risk-points', 'Risk Points', sorted)];
};
