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
  padding?: { top?: number; bottom?: number; left?: number; right?: number };
  minWidth?: number;
}

export const VictoryChartWrapper: React.FC<VictoryChartWrapperProps> = ({
  children,
  width,
  height,
  horizontal,
  domainPadding = 20,
  padding: customPadding,
  minWidth,
}) => {
  const defaultPadding = horizontal ? chartMargins.horizontalBar : chartMargins.base;
  const padding = customPadding ? { ...defaultPadding, ...customPadding } : defaultPadding;

  const finalWidth = minWidth ? Math.max(width, minWidth) : width;

  return (
    <VictoryChart
      theme={victoryTheme}
      width={finalWidth}
      height={height}
      padding={padding}
      domainPadding={domainPadding}
    >
      {children}
    </VictoryChart>
  );
};