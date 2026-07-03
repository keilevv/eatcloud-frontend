import React from 'react';
import { VictoryAxis } from 'victory';

import { ChartConfig } from '../types/ChartConfig';
import { formatAxis } from '../utils/formatAxis';
import { formatLabels } from '../utils/formatLabels';

interface ChartAxisProps {
  dependentAxis?: boolean;
  config?: ChartConfig;
  horizontal?: boolean;
  [key: string]: any; // Allow Victory injected props
}

export const ChartAxis: React.FC<ChartAxisProps> = ({
  dependentAxis,
  config,
  ...props
}) => {
  // When horizontal=true, the dependentAxis (Y values) is actually drawn on the X axis physically
  // and the independentAxis (X labels) is drawn on the Y axis physically.
  // We need to swap the formats.
  const format = dependentAxis ? config?.yAxisFormat : config?.xAxisFormat;

  return (
    <VictoryAxis
      {...props}
      dependentAxis={dependentAxis}
      tickFormat={(t: any) => {
        if (props.tickFormat) {
          return props.tickFormat(t);
        }
        if (dependentAxis) {
          return formatAxis(t, format);
        }
        return formatLabels(String(t));
      }}
      label={dependentAxis ? config?.yAxisLabel : config?.xAxisLabel}
      style={{
        tickLabels: { padding: 5 },
        axisLabel: { padding: 40 },
        ...props.style,
      }}
    />
  );
};

// Required for VictoryChart to recognize this as an axis and pass down scale/domain
Object.assign(ChartAxis, VictoryAxis);
