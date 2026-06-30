import React from 'react';
import { VictoryLegend } from 'victory';

import { chartThemeConfig } from '../config/chartTheme';
import { ChartSeries } from '../types/ChartSeries';

interface ChartLegendProps {
  dataset: ChartSeries[];
  width?: number;
  [key: string]: any;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ dataset, width, ...props }) => {
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
      {...props}
      x={(width || 600) / 2 - 150} // Approximate center
      y={10}
      centerTitle
      orientation="horizontal"
      gutter={20}
      data={legendData}
    />
  );
};

Object.assign(ChartLegend, VictoryLegend);
