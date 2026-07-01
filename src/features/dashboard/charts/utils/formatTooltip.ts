import { formatAxis } from './formatAxis';

export const formatTooltip = (
  label: string,
  value: number,
  format?: 'number' | 'thousands' | 'percentage' | 'kilograms' | 'amount' | 'none',
): string => {
  const formattedValue = formatAxis(value, format);
  return `${label}\n${formattedValue}`;
};
