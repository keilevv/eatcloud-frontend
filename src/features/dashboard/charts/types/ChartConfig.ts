export interface ChartConfig {
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisFormat?: 'thousands' | 'percentage' | 'none';
  yAxisFormat?: 'thousands' | 'percentage' | 'kilograms' | 'none';
  y2AxisLabel?: string;
  y2AxisFormat?: 'thousands' | 'percentage' | 'kilograms' | 'none';
  tooltipFormat?: 'thousands' | 'percentage' | 'kilograms' | 'none';
  showLegend?: boolean;
}
