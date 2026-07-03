import { ChartPoint } from '../types/ChartPoint';
import { ChartAdapterResult } from '../types/ChartSeries';
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
): ChartAdapterResult<RiskDonorDTO> => {

  const points: ChartPoint<RiskDonorDTO>[] = dtoData.map((item) => ({
    x: item.name,
    y: item.riskPercentage,
    label: item.name,
    meta: item,
  }));

  const sorted = sortSeriesDesc(points).slice(0, limit);
  return {
    series: [{ ...buildSeries('risk-donors', 'Top 10 Donantes Riesgosos', sorted), type: 'bar', color: '#F97316' }],
    xAxisLabel: 'Donante',
    yAxisLabel: 'Porcentaje de Riesgo',
    yAxisFormat: 'percentage',
  };
};
