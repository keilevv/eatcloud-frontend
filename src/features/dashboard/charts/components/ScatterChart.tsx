import React from 'react';
import { VictoryAxis, VictoryLegend, VictoryScatter } from 'victory';

import { ChartProps } from '../types/ChartProps';
import { ChartSeries } from '../types/ChartSeries';
import { chartThemeConfig } from '../config/chartTheme';
import { VictoryChartWrapper } from '../wrappers/VictoryChartWrapper';

import { createChartTooltip } from './ChartTooltip';
import { ChartContainer } from './ChartContainer';
import { formatAxis } from '../utils/formatAxis';
import { formatLabels } from '../utils/formatLabels';

const X_LABEL_HIDE_THRESHOLD = 450;

function niceStep(maxVal: number): number {
  const rough = maxVal / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const normalized = rough / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

function niceTicks(maxVal: number): number[] {
  const step = niceStep(maxVal);
  const ticks: number[] = [];
  for (let v = 0; v <= maxVal + step; v += step) {
    ticks.push(v);
    if (ticks.length >= 7) break;
  }
  return ticks;
}

function normalizeDualAxis(dataset: ChartSeries[]): {
  normalizedDataset: ChartSeries[];
  scaleRatio: number;
  rightAxisTicks: number[];
} {
  const firstSeries = dataset[0];
  const secondSeries = dataset[1];

  const maxFirst = Math.max(...firstSeries.data.map((d) => Number(d.y)), 1);
  const maxSecond = Math.max(...secondSeries.data.map((d) => Number(d.y)), 1);
  const scaleRatio = maxSecond / maxFirst;

  const normalizedDataset = dataset.map((series, index) => {
    if (index === 0) return series;
    return {
      ...series,
      data: series.data.map((d) => ({
        ...d,
        y: Number(d.y) / scaleRatio,
      })),
    };
  });

  const rightAxisTicks = niceTicks(maxSecond).map((v) => v / scaleRatio);

  return { normalizedDataset, scaleRatio, rightAxisTicks };
}

const getColor = (series: ChartSeries, index: number) =>
  series.color ?? chartThemeConfig.colors[index % chartThemeConfig.colors.length];

export const ScatterChart: React.FC<ChartProps> = ({
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

  const isDualAxis = !!dataset && dataset.length === 2;

  const defaultMinWidth =
    dataset && dataset[0]?.data.length > 10 ? 800 : undefined;
  const finalMinWidth = minWidth || defaultMinWidth;

  const { normalizedDataset, scaleRatio, rightAxisTicks } =
    isDualAxis && !isEmpty
      ? normalizeDualAxis(dataset)
      : {
          normalizedDataset: dataset ?? [],
          scaleRatio: 1,
          rightAxisTicks: [],
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
        const effectiveWidth = finalMinWidth
          ? Math.max(width, finalMinWidth)
          : width;
        const hideXLabels = effectiveWidth < X_LABEL_HIDE_THRESHOLD;

        const chartPadding = {
          top: 40,
          bottom: 100,
          left: 60,
          right: isDualAxis ? 55 : 30,
        };

        const legendData = dataset
          ? dataset.map((series, index) => ({
              name: series.name,
              symbol: {
                fill: getColor(series, index),
              },
            }))
          : [];

        return (
          <VictoryChartWrapper
            width={width}
            height={height}
            domainPadding={{ x: 20, y: 20 }}
            padding={{
              ...chartPadding,
              bottom: hideXLabels ? 50 : chartPadding.bottom,
            }}
            minWidth={finalMinWidth}
          >
            {config?.showLegend !== false && dataset && dataset.length > 1 && (
              <VictoryLegend
                x={effectiveWidth / 2 - 120}
                y={10}
                centerTitle
                orientation="horizontal"
                gutter={20}
                data={legendData}
              />
            )}

            <VictoryAxis
              key="axis-x"
              tickFormat={
                hideXLabels
                  ? () => ''
                  : (t: any) => formatLabels(String(t))
              }
              label={config?.xAxisLabel}
              style={{
                tickLabels: hideXLabels
                  ? { opacity: 0 }
                  : {
                      angle: -45,
                      textAnchor: 'end',
                      padding: 15,
                      fontSize: 16,
                    },
                axisLabel: { padding: 40 },
              }}
            />

            <VictoryAxis
              key="axis-left"
              dependentAxis
              tickFormat={(t: any) => formatAxis(t, config?.yAxisFormat)}
              label={config?.yAxisLabel}
              style={{
                tickLabels: { fontSize: 12 },
                axisLabel: { padding: 40 },
              }}
            />

            {isDualAxis && (
              <VictoryAxis
                key="axis-right"
                dependentAxis
                orientation="right"
                tickValues={rightAxisTicks}
                tickFormat={(t: any) =>
                  formatAxis(Number(t) * scaleRatio, config?.yAxisFormat)
                }
                style={{
                  tickLabels: { fill: '#9ca3af', fontSize: 12 },
                }}
              />
            )}

            {normalizedDataset.map((series, index) => {
              const color = getColor(series, index);
              const isNormalized = isDualAxis && index === 1;
              return (
                <VictoryScatter
                  key={series.id}
                  data={series.data}
                  size={5}
                  style={{
                    data: {
                      fill: color,
                      stroke: '#0f172a',
                      strokeWidth: 1.5,
                      cursor: 'pointer',
                    },
                  }}
                  labelComponent={createChartTooltip({
                    color,
                    tooltipFormat: config?.tooltipFormat,
                    valueGetter: isNormalized
                      ? (datum: any) => {
                          if (
                            datum.meta?.cancellationProbability !== undefined
                          )
                            return datum.meta.cancellationProbability;
                          return Number(datum.y) * scaleRatio;
                        }
                      : undefined,
                  })}
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
