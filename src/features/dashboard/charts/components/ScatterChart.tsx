import React, { useMemo } from 'react';
import { VictoryAxis, VictoryLegend, VictoryScatter } from 'victory';

import { ChartProps } from '../types/ChartProps';
import { ChartSeries } from '../types/ChartSeries';
import { chartThemeConfig } from '../config/chartTheme';
import { VictoryChartWrapper } from '../wrappers/VictoryChartWrapper';

import { createChartTooltip } from './ChartTooltip';
import { ChartContainer } from './ChartContainer';
import { formatAxis } from '../utils/formatAxis';
import { formatLabels } from '../utils/formatLabels';
import { scatterTooltipFormatter } from '../adapters/ScatterAdapter';

const X_LABEL_HIDE_THRESHOLD = 450;
const MAX_SCATTER_POINTS = 200;

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

function downsampleArray<T>(arr: T[], max: number): T[] {
  if (arr.length <= max) return arr;
  
  // Find edge points (min and max x values)
  const getX = (item: T) => (item as any).x;
  let minXIndex = 0;
  let maxXIndex = 0;
  
  for (let i = 1; i < arr.length; i++) {
    if (getX(arr[i]) < getX(arr[minXIndex])) {
      minXIndex = i;
    }
    if (getX(arr[i]) > getX(arr[maxXIndex])) {
      maxXIndex = i;
    }
  }
  
  // Always include edge points
  const edgeIndices = new Set([minXIndex, maxXIndex]);
  const result: T[] = [arr[minXIndex], arr[maxXIndex]];
  
  // Calculate how many elements we can sample in between
  const remainingSlots = max - 2;
  if (remainingSlots <= 0) return result;
  
  // Create array of indices excluding edge points
  const middleIndices: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (!edgeIndices.has(i)) {
      middleIndices.push(i);
    }
  }
  
  // Sample evenly from middle elements
  const stride = Math.ceil(middleIndices.length / remainingSlots);
  for (let i = 0; i < middleIndices.length; i += stride) {
    result.push(arr[middleIndices[i]]);
  }
  
  return result;
}

interface NormalizedResult {
  normalizedDataset: ChartSeries[];
  scaleRatio: number;
  rightAxisTicks: number[];
}

function normalizeDualAxis(dataset: ChartSeries[]): NormalizedResult {
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

const ScatterChartInner: React.FC<ChartProps> = ({
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

  const isDualAxis = !!dataset && dataset.length === 2;

  const downsampledDataset = useMemo(() => {
    if (!dataset) return dataset;
    return dataset.map((series) => ({
      ...series,
      data: downsampleArray(series.data, MAX_SCATTER_POINTS),
    }));
  }, [dataset]);

  const { normalizedDataset, scaleRatio, rightAxisTicks } = useMemo(() => {
    if (isDualAxis && !isEmpty && downsampledDataset) {
      return normalizeDualAxis(downsampledDataset);
    }
    return {
      normalizedDataset: downsampledDataset ?? [],
      scaleRatio: 1,
      rightAxisTicks: [],
    };
  }, [isDualAxis, isEmpty, downsampledDataset]);

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
      {({ width, height }) => {
        const hideXLabels = width < X_LABEL_HIDE_THRESHOLD;

        const chartPadding = {
          top: 40,
          bottom: 80,
          left: 100,
          right: isDualAxis ? 55 : 30,
        };

        const legendData = normalizedDataset.map((series, index) => ({
          name: series.name,
          symbol: { fill: getColor(series, index) },
        }));

        return (
          <VictoryChartWrapper
            width={width}
            height={height}
            domainPadding={{ x: 100, y: 20 }}
            padding={{
              ...chartPadding,
              bottom: hideXLabels ? 50 : chartPadding.bottom,
            }}
          >
            {config?.showLegend !== false && normalizedDataset && (
                <VictoryLegend
                  x={width / 2 - (legendData.length * 60)}
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
                axisLabel: { padding: 60 },
              }}
            />

            <VictoryAxis
              key="axis-left"
              dependentAxis
              tickFormat={(t: any) => formatAxis(t, config?.yAxisFormat)}
              label={config?.yAxisLabel}
              style={{
                tickLabels: { fontSize: 12 },
                axisLabel: { padding: 70 },
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
                    seriesName: series.name,
                    customFormatter: scatterTooltipFormatter,
                  })}
                  labels={() => ''}
                />
              );
            })}
          </VictoryChartWrapper>
        );
      }}
    </ChartContainer>
  );
};

export const ScatterChart = React.memo(ScatterChartInner);
