import { ChartTheme } from '../types/ChartTheme';

import { chartAnimations } from './chartAnimations';
import { chartColors } from './chartColors';
import { chartMargins } from './chartMargins';
import { chartTypography } from './chartTypography';

export const chartThemeConfig: ChartTheme = {
  colors: chartColors.palette,
  typography: {
    fontFamily: chartTypography.fontFamily,
    fontSize: chartTypography.fontSize.base,
    fontWeight: chartTypography.fontWeight.normal,
  },
};

export { chartColors, chartTypography, chartMargins, chartAnimations };
