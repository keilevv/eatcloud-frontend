import React from 'react';
import { VictoryLegend } from 'victory';

import { chartThemeConfig } from '../config/chartTheme';
import { ChartSeries } from '../types/ChartSeries';

interface ChartLegendProps {
  dataset: ChartSeries[];
  width?: number;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ dataset }) => {
  if (dataset.length <= 1) return null;

  const legendData = dataset.map((series, index) => ({
    name: series.name,
    symbol: {
      fill:
        series.color ||
        chartThemeConfig.colors[index % chartThemeConfig.colors.length],
    },
  }));

  return (
    <VictoryLegend
      x={20}
      y={10}
      centerTitle
      orientation="horizontal"
      gutter={20}
      data={legendData}
    />
  );
};
