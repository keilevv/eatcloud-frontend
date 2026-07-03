import React from 'react';
import { VictoryAxis } from 'victory';

import { ChartConfig } from '../types/ChartConfig';
import { formatAxis } from '../utils/formatAxis';
import { formatLabels } from '../utils/formatLabels';

interface BarChartAxesProps {
  config?: ChartConfig;
  hideXLabels: boolean;
  hideCategoryLabels?: boolean;
  isDualAxis: boolean;
  lineScaleRatio: number;
  rightAxisTicks?: number[];
  horizontal?: boolean;
}

/**
 * Returns an array of Victory axis elements to be spread as direct children
 * of VictoryChart. React components cannot be used here because VictoryChart
 * relies on static methods (role, getAxis) present only on native Victory elements.
 */
export function renderBarChartAxes({
  config,
  hideXLabels,
  hideCategoryLabels = false,
  isDualAxis,
  lineScaleRatio,
  rightAxisTicks,
  horizontal = false,
}: BarChartAxesProps): React.ReactElement[] {
  const axes: React.ReactElement[] = [
    // X Axis (bottom in vertical, left in horizontal — category labels)
    <VictoryAxis
      key="axis-x"
      orientation={horizontal ? 'left' : undefined}
      tickFormat={
        horizontal && hideCategoryLabels
          ? () => ''
          : hideXLabels
            ? () => ''
            : (t: any) => formatLabels(String(t))
      }
      label={config?.xAxisLabel}
      style={{
        tickLabels:
          hideXLabels || (horizontal && hideCategoryLabels)
            ? { opacity: 0 }
            : {
                angle: horizontal ? 0 : -45,
                textAnchor: 'end',
                padding: horizontal ? 8 : 15,
                fontSize: horizontal ? 12 : 16,
              },
        axisLabel: {
          padding: horizontal ? 20 : 20,
          opacity: hideXLabels || (horizontal && hideCategoryLabels) ? 100 : 0,
        },
      }}
    />,

    // Left Y Axis (left in vertical, bottom in horizontal)
    <VictoryAxis
      key="axis-left"
      dependentAxis
      orientation={horizontal ? 'bottom' : 'left'}
      tickFormat={(t: any) => formatAxis(t, config?.yAxisFormat)}
      label={config?.yAxisLabel}
      style={{
        tickLabels: { fontSize: 12 },
        axisLabel: { padding: horizontal ? 40 : 50 },
      }}
    />,
  ];

  // Right Axis — only in dual-axis mode (top in horizontal, right in vertical)
  if (isDualAxis) {
    axes.push(
      <VictoryAxis
        key="axis-right"
        dependentAxis
        orientation={horizontal ? 'top' : 'right'}
        tickValues={rightAxisTicks}
        tickFormat={(t: any) =>
          formatAxis(
            Number(t) * lineScaleRatio,
            config?.y2AxisFormat || config?.yAxisFormat,
          )
        }
        label={config?.y2AxisLabel}
        style={{
          tickLabels: { fill: '#9ca3af', fontSize: 12 },
          axisLabel: { padding: 70 },
          grid: { stroke: 'none' },
        }}
      />,
    );
  }

  return axes;
}
