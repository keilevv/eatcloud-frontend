import { ChartPoint } from '../types/ChartPoint';
import { ChartAdapterResult } from '../types/ChartSeries';
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
): ChartAdapterResult<RiskPointDTO> => {
  const points: ChartPoint<RiskPointDTO>[] = dtoData.map((item) => ({
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
  return {
    series: [{ ...buildSeries('risk-points', 'Top 15 Puntos de Riesgo ', sorted), type: 'bar', color: '#DC2626' }],
    xAxisLabel: 'Punto de Donación',
    yAxisLabel: 'Porcentaje de Riesgo',
    yAxisFormat: 'percentage',
  };
};
