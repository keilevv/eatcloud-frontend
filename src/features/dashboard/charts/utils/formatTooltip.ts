import { formatAxis } from './formatAxis';

export const formatTooltip = (
  label: string,
  value: number,
  format?: 'thousands' | 'percentage' | 'kilograms' | 'none',
): string => {
  const formattedValue = formatAxis(value, format);
  return `${label}\n${formattedValue}`;
};
