import React from 'react';
import { VictoryBar } from 'victory';

import { ChartTooltip } from '../components/ChartTooltip';
import { chartThemeConfig } from '../config/chartTheme';
import { ChartConfig } from '../types/ChartConfig';
import { ChartSeries } from '../types/ChartSeries';

interface VictoryBarWrapperProps {
  dataset: ChartSeries[];
  horizontal?: boolean;
  config?: ChartConfig;
}

export const VictoryBarWrapper: React.FC<VictoryBarWrapperProps> = ({
  dataset,
  horizontal,
  config,
}) => {
  return (
    <>
      {dataset.map((series, index) => {
        const color =
          series.color ||
          chartThemeConfig.colors[index % chartThemeConfig.colors.length];

        return (
          <VictoryBar
            key={series.id}
            data={series.data}
            horizontal={horizontal}
            style={{
              data: { fill: color },
            }}
            labelComponent={<ChartTooltip config={config} />}
            labels={() => ''} // Required to trigger labelComponent
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
