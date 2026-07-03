import { ChartPoint } from '../types/ChartPoint';
import { ChartAdapterResult } from '../types/ChartSeries';
import { buildSeries } from '../utils/buildSeries';
import { sortSeriesDesc } from '../utils/sortSeries';

export interface DonorDTO {
  id: string;
  name: string;
  totalKg: number;
  quantity: number;
}

export const DonorChartAdapter = (
  dtoData: DonorDTO[],
): ChartAdapterResult<DonorDTO> => {
  const quantityPoints: ChartPoint<DonorDTO>[] = dtoData.map((item) => ({
    x: item.name,
    y: item.quantity,
    label: item.name,
    meta: item,
  }));

  const kgPoints: ChartPoint<DonorDTO>[] = dtoData.map((item) => ({
    x: item.name,
    y: item.totalKg,
    label: item.name,
    meta: item,
  }));

  return {
    series: [
      { ...buildSeries('quantity', 'Cant. Canceladas', sortSeriesDesc(quantityPoints)), type: 'bar', color: '#ef4444' },
      { ...buildSeries('kg', 'KG Cancelados', sortSeriesDesc(kgPoints)), type: 'line', color: '#3b82f6' }
    ],
    xAxisLabel: 'Donante',
    yAxisLabel: 'Cantidad',
    yAxisFormat: 'thousands',
    y2AxisLabel: 'KG Cancelados',
    y2AxisFormat: 'kilograms',
  };
};
