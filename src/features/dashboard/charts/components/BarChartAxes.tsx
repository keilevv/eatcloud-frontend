import React from 'react';
import { VictoryAxis } from 'victory';

import { ChartConfig } from '../types/ChartConfig';
import { formatAxis } from '../utils/formatAxis';
import { formatLabels } from '../utils/formatLabels';

interface BarChartAxesProps {
  config?: ChartConfig;
  hideXLabels: boolean;
  isDualAxis: boolean;
  lineScaleRatio: number;
  rightAxisTicks?: number[];
}

/**
 * Returns an array of Victory axis elements to be spread as direct children
 * of VictoryChart. React components cannot be used here because VictoryChart
 * relies on static methods (role, getAxis) present only on native Victory elements.
 */
export function renderBarChartAxes({
  config,
  hideXLabels,
  isDualAxis,
  lineScaleRatio,
  rightAxisTicks,
}: BarChartAxesProps): React.ReactElement[] {
  const axes: React.ReactElement[] = [
    // X Axis
    <VictoryAxis
      key="axis-x"
      tickFormat={hideXLabels ? () => '' : (t) => formatLabels(String(t))}
      label={config?.xAxisLabel}
      style={{
        tickLabels: hideXLabels
          ? { opacity: 0 }
          : { angle: -45, textAnchor: 'end', padding: 15, fontSize: 16 },
        axisLabel: { padding: 40 },
      }}
    />,

    // Left Y Axis
    <VictoryAxis
      key="axis-left"
      dependentAxis
      orientation="left"
      tickFormat={(t) => formatAxis(t, config?.yAxisFormat)}
      label={config?.yAxisLabel}
      style={{
        tickLabels: { fontSize: 12 },
        axisLabel: { padding: 40 },
      }}
    />,
  ];

  // Right Y Axis — only in dual-axis mode
  if (isDualAxis) {
    axes.push(
      <VictoryAxis
        key="axis-right"
        dependentAxis
        orientation="right"
        tickValues={rightAxisTicks}
        tickFormat={(t: any) =>
          formatAxis(Number(t) * lineScaleRatio, config?.yAxisFormat)
        }
        style={{
          tickLabels: { fill: '#9ca3af', fontSize: 12 },
        }}
      />,
    );
  }

  return axes;
}
