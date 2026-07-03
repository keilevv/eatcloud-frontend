import { formatNumber } from '@/utils';
export const formatAxis = (
  value: number | string,
  format?:
    'number' | 'thousands' | 'percentage' | 'kilograms' | 'amount' | 'none',
): string => {
  if (typeof value !== 'number') return String(value);
  if (format === 'none') return String(value);

  if (format === 'percentage') {
    return `${value}%`;
  }

  if (format === 'kilograms') {
    if (value >= 1000) {
      return `${formatNumber(value / 1000)}K kg`;
    }
    return `${formatNumber(value)} kg`;
  }

  if (format === 'thousands' || !format) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return String(value);
  }
  if (format === 'amount') {
    return `$${value.toFixed(2)}`;
  }
  
  if (format === 'number') {
    return formatNumber(value);
  }

  return String(value);
};
