import React from 'react';
import { VictoryTooltip } from 'victory';

import { chartThemeConfig } from '../config/chartTheme';
import { ChartConfig } from '../types/ChartConfig';
import { formatTooltip } from '../utils/formatTooltip';

interface ChartTooltipProps {
  config?: ChartConfig;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ config }) => {
  return (
    <VictoryTooltip
      flyoutPadding={10}
      cornerRadius={4}
      flyoutStyle={{
        fill: '#0f172a',
        stroke: 'none',
        opacity: 0.9,
      }}
      style={{
        fill: '#f8fafc',
        fontSize: chartThemeConfig.typography.fontSize,
        fontFamily: chartThemeConfig.typography.fontFamily,
      }}
      text={({ datum }) => {
        const xVal = typeof datum.xName !== 'undefined' ? datum.xName : datum.x;
        return formatTooltip(xVal, datum.y, config?.tooltipFormat);
      }}
    />
  );
};

Object.assign(ChartTooltip, VictoryTooltip);
