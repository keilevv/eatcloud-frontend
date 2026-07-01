import React from 'react';
import { VictoryScatter } from 'victory';

import { createChartTooltip } from '../components/ChartTooltip';
import { chartThemeConfig } from '../config/chartTheme';
import { ChartConfig } from '../types/ChartConfig';
import { ChartSeries } from '../types/ChartSeries';

interface VictoryScatterWrapperProps {
  dataset: ChartSeries[];
  config?: ChartConfig;
}

export const VictoryScatterWrapper: React.FC<VictoryScatterWrapperProps> = ({
  dataset,
  config,
}) => {
  return (
    <>
      {dataset.map((series, index) => {
        const color =
          series.color ||
          chartThemeConfig.colors[index % chartThemeConfig.colors.length];

        return (
          <VictoryScatter
            key={series.id}
            data={series.data}
            size={5}
            style={{
              data: { fill: color },
            }}
            labelComponent={createChartTooltip({ tooltipFormat: config?.tooltipFormat })}
            labels={() => ''}
            animate={{
              duration: 500,
              onLoad: { duration: 500 },
            }}
          />
        );
      })}
    </>
  );
};
