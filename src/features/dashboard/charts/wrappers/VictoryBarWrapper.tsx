import React from 'react';
import { VictoryBar, VictoryGroup } from 'victory';

import { createChartTooltip } from '../components/ChartTooltip';
import { chartThemeConfig } from '../config/chartTheme';
import { ChartConfig } from '../types/ChartConfig';
import { ChartSeries } from '../types/ChartSeries';

interface VictoryBarWrapperProps {
  dataset: ChartSeries[];
  horizontal?: boolean;
  config?: ChartConfig;
  [key: string]: any; // Allow Victory injected props
}

export const VictoryBarWrapper: React.FC<VictoryBarWrapperProps> = ({
  dataset,
  horizontal,
  config,
  ...props
}) => {
  
  return (
    <VictoryGroup offset={horizontal ? 15 : 20} horizontal={horizontal} {...props}>
      {dataset.map((series, index) => {
        const color =
          series.color ||
          chartThemeConfig.colors[index % chartThemeConfig.colors.length];

        return (
          <VictoryBar
            key={series.id}
            data={series.data}
            style={{
              data: { fill: color },
            }}
            labelComponent={createChartTooltip({ tooltipFormat: config?.tooltipFormat })}
            labels={() => ''} // Required to trigger labelComponent
            animate={{
              duration: 500,
              onLoad: { duration: 500 },
            }}
          />
        );
      })}
    </VictoryGroup>
  );
};

// Required for VictoryChart to recognize this as a group and pass down scales
Object.assign(VictoryBarWrapper, VictoryGroup);
