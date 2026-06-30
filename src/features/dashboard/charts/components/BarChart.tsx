import React from 'react';
import { VictoryLine, VictoryBar, VictoryAxis, VictoryLegend, VictoryTooltip } from 'victory';

import { ChartProps } from '../types/ChartProps';
import { VictoryChartWrapper } from '../wrappers/VictoryChartWrapper';

import { ChartContainer } from './ChartContainer';
import { chartThemeConfig } from '../config/chartTheme';
import { formatAxis } from '../utils/formatAxis';
import { formatLabels } from '../utils/formatLabels';
import { formatTooltip } from '../utils/formatTooltip';

export const BarChart: React.FC<ChartProps> = ({
  title,
  subtitle,
  dataset,
  loading,
  error,
  emptyMessage,
  config,
  height,
  minWidth,
}) => {
  const isEmpty =
    !dataset ||
    dataset.length === 0 ||
    dataset.every((s) => s.data.length === 0);

  const isDualAxis =
    dataset &&
    dataset.length === 2 &&
    dataset.some((s) => s.type === 'bar') &&
    dataset.some((s) => s.type === 'line');

  const defaultMinWidth = dataset && dataset[0]?.data.length > 10 ? 800 : undefined;
  const finalMinWidth = minWidth || defaultMinWidth;

  let normalizedDataset = dataset;
  let lineScaleRatio = 1;

  if (isDualAxis && !isEmpty) {
    const barSeries = dataset.find((s) => s.type === 'bar')!;
    const lineSeries = dataset.find((s) => s.type === 'line')!;

    const maxBar = Math.max(...barSeries.data.map((d) => Number(d.y)), 1);
    const maxLine = Math.max(...lineSeries.data.map((d) => Number(d.y)), 1);

    lineScaleRatio = maxLine / maxBar;

    normalizedDataset = dataset.map((series) => {
      if (series.type === 'line') {
        return {
          ...series,
          data: series.data.map((d) => ({
            ...d,
            y: Number(d.y) / (lineScaleRatio || 1),
          })),
        };
      }
      return series;
    });
  }

  const tooltipComponent = (
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

  const chartPadding = {
    top: 40,
    bottom: 100, // Increase to fit angled X-axis labels
    left: 60,
    right: isDualAxis ? 50 : 30, // Increase right margin if dual axis to fit right Y-axis labels
  };

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      empty={isEmpty}
      emptyMessage={emptyMessage}
      height={height}
      minWidth={finalMinWidth}
    >
      {({ width, height }) => {
        const legendData = dataset ? dataset.map((series, index) => ({
          name: series.name,
          symbol: {
            fill:
              series.color ||
              chartThemeConfig.colors[index % chartThemeConfig.colors.length],
          },
        })) : [];

        const finalWidth = finalMinWidth ? Math.max(width, finalMinWidth) : width;

        return (
          <VictoryChartWrapper
            width={width}
            height={height}
            domainPadding={{ x: 20, y: 20 }}
            padding={chartPadding}
            minWidth={finalMinWidth}
          >
            {config?.showLegend !== false && dataset && dataset.length > 1 && (
              <VictoryLegend
                x={finalWidth / 2 - 120}
                  y={10}
                centerTitle
                orientation="horizontal"
                gutter={20}
                data={legendData}
              />
            )}

            {/* X Axis */}
            <VictoryAxis
              tickFormat={(t) => formatLabels(String(t))}
              label={config?.xAxisLabel}
              style={{
                tickLabels: { angle: -45, textAnchor: 'end', padding: 15, fontSize: 16 },
                axisLabel: { padding: 40 },
              }}
            />

            {/* Left Y Axis */}
            <VictoryAxis
              dependentAxis
              orientation="left"
              tickFormat={(t) => formatAxis(t, config?.yAxisFormat)}
              label={config?.yAxisLabel}
              style={{
                tickLabels: { fontSize: 12 },
                axisLabel: { padding: 40 },
                
              }}
            />
            
            {/* Right Y Axis */}
            {isDualAxis && (
              <VictoryAxis
                dependentAxis
                orientation="right"
                tickFormat={(t: any) =>
                  formatAxis(Number(t) * lineScaleRatio, config?.yAxisFormat)
                }
                style={{
                  tickLabels: { fill: '#9ca3af',  fontSize: 12 },
                }}
              />
            )}

            {normalizedDataset.map((series, index) => {
              const color =
                series.color ||
                chartThemeConfig.colors[index % chartThemeConfig.colors.length];

              if (series.type === 'line') {
                return (
                  <VictoryLine
                    key={series.id}
                    data={series.data}
                    style={{
                      data: { stroke: color, strokeWidth: 3 },
                    }}
                    labelComponent={tooltipComponent}
                    labels={() => ''}
                    animate={{
                      duration: 500,
                      onLoad: { duration: 500 },
                    }}
                  />
                );
              }

              return (
                <VictoryBar
                  key={series.id}
                  data={series.data}
                  style={{
                    data: { fill: color },
                  }}
                  
                  labelComponent={tooltipComponent}
                  labels={() => ''}
                  animate={{
                    duration: 500,
                    onLoad: { duration: 500 },
                  }}
                />
              );
            })}
          </VictoryChartWrapper>
        );
      }}
    </ChartContainer>
  );
};
