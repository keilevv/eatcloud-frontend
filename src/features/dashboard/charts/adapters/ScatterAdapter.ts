import { ChartPoint } from '../types/ChartPoint';
import { ChartAdapterResult } from '../types/ChartSeries';
import { buildSeries } from '../utils/buildSeries';

export interface ScatterDTO {
  id: string;
  name: string;
  announcements: number;
  cancellationProbability: number;
  donor: string;
}

export const ScatterAdapter = (
  dtoData: ScatterDTO[],
): ChartAdapterResult<ScatterDTO> => {

  const probabilityPoints: ChartPoint<ScatterDTO>[] = dtoData.map((item) => ({
    x: item.announcements,
    y: item.cancellationProbability,
    label: item.name,
    meta: item,
  }));

  return {
    series: [
      buildSeries('probability', 'Prob. Cancelación', probabilityPoints, '#ef4444'),
    ],
    xAxisLabel: 'Anuncios',
    yAxisLabel: 'Probabilidad de Cancelación',
    xAxisFormat: 'thousands',
    yAxisFormat: 'percentage',
  };
};

export const scatterTooltipFormatter = (datum: any): string[] => {
  const meta = datum.meta;
  if (!meta) return [datum.label, `${datum.y}%`];
  
  return [
    `${meta.name} (${meta.donor})`,
    `${meta.announcements} anuncios`,
    `Probabilidad de cancelación: ${Math.round(meta.cancellationProbability)}%`
  ];
};
