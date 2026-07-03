import { formatAxis } from './formatAxis';

export const formatTooltip = (
  label: string,
  value: number,
  format?: 'number' | 'thousands' | 'percentage' | 'kilograms' | 'amount' | 'none',
  seriesName?: string,
): string[] => {
  const formattedValue = formatAxis(value, format);
  if (seriesName) {
    return [seriesName, `${label}: ${formattedValue}`];
  }
  return [label, formattedValue];
};
