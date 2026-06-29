export const formatLabels = (label: string, maxLength: number = 15): string => {
  if (label.length <= maxLength) return label;
  return `${label.substring(0, maxLength)}...`;
};
