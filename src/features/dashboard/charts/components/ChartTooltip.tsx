import React from 'react';
import { VictoryTooltip } from 'victory';

import { chartThemeConfig } from '../config/chartTheme';
import { formatTooltip } from '../utils/formatTooltip';

export interface ChartTooltipOptions {
  /** Series color — used as the flyout border to identify which series is hovered */
  color?: string;
  /** Optional format string for the displayed value */
  tooltipFormat?: string;
  /**
   * If the chart normalizes Y values (e.g. dual-axis scaling), provide this
   * to extract the *real* display value from the raw datum instead of datum.y
   */
  valueGetter?: (datum: any) => number;
  /** Series name to display in tooltip */
  seriesName?: string;
  /** Custom formatter for tooltip text */
  customFormatter?: (datum: any) => string[];
}

/**
 * Creates a configured VictoryTooltip element ready to be passed as
 * `labelComponent` to any Victory series component.
 *
 * Usage:
 *   labelComponent={createChartTooltip({ color, tooltipFormat, seriesName })}
 */
export function createChartTooltip({
  color,
  tooltipFormat,
  valueGetter,
  seriesName,
  customFormatter,
}: ChartTooltipOptions = {}): React.ReactElement {
  return (
    <VictoryTooltip
      flyoutPadding={{ top: 8, bottom: 8, left: 12, right: 12 }}
      cornerRadius={4}
      flyoutStyle={{
        fill: '#0f172a',
        stroke: color ?? 'transparent',
        strokeWidth: color ? 2 : 0,
        opacity: 0.95,
      }}
      style={{
        fill: '#f8fafc',
        fontSize: chartThemeConfig.typography.fontSize,
        fontFamily: chartThemeConfig.typography.fontFamily,
      }}
      text={({ datum }) => {
        if (customFormatter) {
          return customFormatter(datum);
        }

        const xVal = typeof datum.xName !== 'undefined' ? datum.xName : datum.label;
        const yVal = valueGetter ? valueGetter(datum) : datum.y;
        return formatTooltip(xVal, yVal, tooltipFormat as any, seriesName) as any;
      }}
    />
  );
}
