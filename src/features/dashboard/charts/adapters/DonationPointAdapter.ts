import { ChartPoint } from '../types/ChartPoint';
import { ChartAdapterResult } from '../types/ChartSeries';
import { buildSeries } from '../utils/buildSeries';
import { sortSeriesDesc } from '../utils/sortSeries';

export interface DonationPointDTO {
  id: string;
  name: string;
  quantity: number;
  totalKg: number;
}


export const DonationPointAdapter = (
  dtoData: DonationPointDTO[],
): ChartAdapterResult<DonationPointDTO> => {
  const quantityPoints: ChartPoint<DonationPointDTO>[] = dtoData.map((item) => ({
    x: item.name,
    y: item.quantity,
    label: item.name,
    meta: item,
  }));
  
  const kgPoints: ChartPoint<DonationPointDTO>[] = dtoData.map((item) => ({
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
    xAxisLabel: 'Punto de Donación',
    yAxisLabel: 'Cantidad',
    yAxisFormat: 'thousands',
    y2AxisLabel: 'KG Cancelados',
    y2AxisFormat: 'kilograms',
  };
};
