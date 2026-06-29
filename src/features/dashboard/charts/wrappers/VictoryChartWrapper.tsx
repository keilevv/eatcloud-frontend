import React from 'react';
import { VictoryChart } from 'victory';

import { chartMargins } from '../config/chartMargins';
import { victoryTheme } from '../styles/victoryTheme';

interface VictoryChartWrapperProps {
  children: React.ReactNode;
  width: number;
  height: number;
  horizontal?: boolean;
  domainPadding?:
    number | { x?: number | [number, number]; y?: number | [number, number] };
}

export const VictoryChartWrapper: React.FC<VictoryChartWrapperProps> = ({
  children,
  width,
  height,
  horizontal,
  domainPadding = 20,
}) => {
  const padding = horizontal ? chartMargins.horizontalBar : chartMargins.base;

  return (
    <VictoryChart
      theme={victoryTheme}
      width={width}
      height={height}
      padding={padding}
      domainPadding={domainPadding}
    >
      {children}
    </VictoryChart>
  );
};
