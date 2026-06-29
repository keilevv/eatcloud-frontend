import { VictoryThemeDefinition } from 'victory';

import { chartColors } from '../config/chartColors';
import { chartTypography } from '../config/chartTypography';

const baseLabelStyles = {
  fontFamily: chartTypography.fontFamily,
  fontSize: chartTypography.fontSize.sm,
  letterSpacing: 'normal',
  padding: 8,
  fill: chartColors.textLight,
  stroke: 'transparent',
  strokeWidth: 0,
};

export const victoryTheme: VictoryThemeDefinition = {
  axis: {
    style: {
      axis: {
        fill: 'transparent',
        stroke: chartColors.gridLine,
        strokeWidth: 1,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      axisLabel: { ...baseLabelStyles, padding: 30 },
      grid: {
        fill: 'none',
        stroke: chartColors.gridLine,
        strokeDasharray: '4, 4',
        pointerEvents: 'painted',
      },
      ticks: {
        fill: 'transparent',
        size: 5,
        stroke: chartColors.gridLine,
      },
      tickLabels: baseLabelStyles,
    },
  },
  bar: {
    style: {
      data: {
        fill: chartColors.primary,
        strokeWidth: 0,
      },
      labels: baseLabelStyles,
    },
  },
  scatter: {
    style: {
      data: {
        fill: chartColors.primary,
        stroke: 'transparent',
        strokeWidth: 0,
      },
      labels: baseLabelStyles,
    },
  },
  chart: {
    padding: 50,
  },
  tooltip: {
    style: {
      ...baseLabelStyles,
      fill: chartColors.tooltipText,
      padding: 10,
    },
    flyoutStyle: {
      stroke: 'none',
      strokeWidth: 0,
      fill: chartColors.tooltipBg,
      pointerEvents: 'none',
    },
    flyoutPadding: 10,
    cornerRadius: 4,
  },
  legend: {
    style: {
      labels: { ...baseLabelStyles, padding: 8 },
      title: { ...baseLabelStyles, padding: 5 },
    },
    gutter: 20,
    orientation: 'horizontal',
  },
};
