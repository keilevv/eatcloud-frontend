import React from 'react';

import { ChartProps } from '../types/ChartProps';
import { VictoryBarWrapper } from '../wrappers/VictoryBarWrapper';
import { VictoryChartWrapper } from '../wrappers/VictoryChartWrapper';

import { ChartAxis } from './ChartAxis';
import { ChartContainer } from './ChartContainer';
import { ChartLegend } from './ChartLegend';

export const BarChart: React.FC<ChartProps> = ({
  title,
  subtitle,
  dataset,
  loading,
  error,
  emptyMessage,
  config,
  height,
}) => {
  const isEmpty =
    !dataset ||
    dataset.length === 0 ||
    dataset.every((s) => s.data.length === 0);

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      empty={isEmpty}
      emptyMessage={emptyMessage}
      height={height}
    >
      {({ width, height }) => (
        <>
          <VictoryChartWrapper
            width={width}
            height={height}
            domainPadding={{ x: 30 }}
          >
            <ChartAxis config={config} />
            <ChartAxis dependentAxis config={config} />
            <VictoryBarWrapper dataset={dataset} config={config} />
          </VictoryChartWrapper>
          {config?.showLegend && (
            <ChartLegend dataset={dataset} width={width} />
          )}
        </>
      )}
    </ChartContainer>
  );
};
