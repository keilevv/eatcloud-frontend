import React from 'react';
import { VictoryBar, VictoryLine, VictoryScatter } from 'victory';

import { ChartSeries } from '../types/ChartSeries';
import { chartThemeConfig } from '../config/chartTheme';
import { createChartTooltip } from './ChartTooltip';

interface BarChartSeriesProps {
  normalizedDataset: ChartSeries[];
  lineScaleRatio: number;
  tooltipFormat?: string;
  horizontal?: boolean;
}

const getColor = (series: ChartSeries, index: number) =>
  series.color ?? chartThemeConfig.colors[index % chartThemeConfig.colors.length];

/**
 * Returns a flat array of Victory series elements (VictoryBar, VictoryLine,
 * VictoryScatter) to be spread as direct children of VictoryChart.
 *
 * VictoryChart inspects static methods (role, getAxis) on its direct children
 * to configure scales — custom React component wrappers break this, so we use
 * a render function that returns native Victory elements instead.
 */
export function renderBarChartSeries({
  normalizedDataset,
  lineScaleRatio,
  tooltipFormat,
  horizontal = false,
}: BarChartSeriesProps): React.ReactElement[] {
  const elements: React.ReactElement[] = [];

  // ── Bar series ──────────────────────────────────────────────────────────────
  normalizedDataset
    .filter((s) => s.type !== 'line')
    .forEach((series, index) => {
      const color = getColor(series, index);
      elements.push(
        <VictoryBar
          key={series.id}
          data={series.data}
          horizontal={horizontal}
          style={{ data: { fill: color } }}
          labelComponent={createChartTooltip({ color, tooltipFormat })}
          labels={() => ''}
          animate={{ duration: 500, onLoad: { duration: 500 } }}
        />,
      );
    });

  // ── Line series — visual path only (no hover events) ────────────────────────
  normalizedDataset
    .filter((s) => s.type === 'line')
    .forEach((series) => {
      const index = normalizedDataset.findIndex((s) => s.id === series.id);
      const color = getColor(series, index);
      elements.push(
        <VictoryLine
          key={`line-${series.id}`}
          data={series.data}
          style={{ data: { stroke: color, strokeWidth: 3 } }}
          animate={{ duration: 500, onLoad: { duration: 500 } }}
          labelComponent={createChartTooltip({ color, tooltipFormat })}
          labels={() => ''}
        />,
      );
    });

  // ── Scatter overlay — carries hover/click events + correct tooltip ───────────
  normalizedDataset
    .filter((s) => s.type === 'line')
    .forEach((series) => {
      const index = normalizedDataset.findIndex((s) => s.id === series.id);
      const color = getColor(series, index);

      // Read the original un-scaled value from meta if available,
      // otherwise reverse the normalization as a fallback
      const lineValueGetter = (datum: any): number => {
        if (datum.meta?.totalKg !== undefined) return datum.meta.totalKg;
        return Number(datum.y) * lineScaleRatio;
      };

      elements.push(
        <VictoryScatter
          key={`scatter-${series.id}`}
          data={series.data}
          size={5}
          style={{
            data: {
              fill: color,
              stroke: '#0f172a',
              strokeWidth: 1.5,
              cursor: 'pointer',
            },
          }}
          labelComponent={createChartTooltip({
            color,
            tooltipFormat,
            valueGetter: lineValueGetter,
          })}
          labels={() => ''}
          animate={{ duration: 500, onLoad: { duration: 500 } }}
        />,
      );
    });

  return elements;
}
