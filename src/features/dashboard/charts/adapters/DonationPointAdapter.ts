import { ChartPoint } from '../types/ChartPoint';
import { ChartSeries } from '../types/ChartSeries';
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
  limit: number = 10,
): ChartSeries<DonationPointDTO>[] => {
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
 
  return [
    { ...buildSeries('quantity', 'Cant. Canceladas', sortSeriesDesc(quantityPoints)), type: 'bar', color: '#ef4444' },
    { ...buildSeries('kg', 'KG Cancelados', sortSeriesDesc(kgPoints)), type: 'line', color: '#3b82f6' }
  ];
};
