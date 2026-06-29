export const formatAxis = (
  value: number | string,
  format?: 'thousands' | 'percentage' | 'kilograms' | 'none',
): string => {
  if (typeof value !== 'number') return String(value);
  if (format === 'none') return String(value);

  if (format === 'percentage') {
    return `${value.toFixed(1)}%`;
  }

  if (format === 'kilograms') {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K kg`;
    }
    return `${value} kg`;
  }

  if (format === 'thousands' || !format) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return String(value);
  }

  return String(value);
};
