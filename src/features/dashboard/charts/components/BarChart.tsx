import React from 'react';
import { VictoryLegend } from 'victory';

import { ChartProps } from '../types/ChartProps';
import { ChartSeries } from '../types/ChartSeries';
import { chartThemeConfig } from '../config/chartTheme';
import { chartMargins } from '../config/chartMargins';
import { VictoryChartWrapper } from '../wrappers/VictoryChartWrapper';

import { renderBarChartAxes } from './BarChartAxes';
import { renderBarChartSeries } from './BarChartSeries';
import { ChartContainer } from './ChartContainer';

// Hide X-axis tick labels when the chart is narrower than this threshold
const X_LABEL_HIDE_THRESHOLD = 450;

/** Compute a clean step size so we get ~5-6 round ticks on the right axis */
function niceStep(maxVal: number): number {
  const rough = maxVal / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const normalized = rough / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

/** Build up to 7 evenly spaced ticks that are multiples of a nice step */
function niceTicks(maxVal: number): number[] {
  const step = niceStep(maxVal);
  const ticks: number[] = [];
  for (let v = 0; v <= maxVal + step; v += step) {
    ticks.push(v);
    if (ticks.length >= 7) break;
  }
  return ticks;
}

/** Normalize a dual-axis dataset so both bar and line share the same Y scale */
function normalizeDualAxis(dataset: ChartSeries[]): {
  normalizedDataset: ChartSeries[];
  lineScaleRatio: number;
  rightAxisTicks: number[];
} {
  const barSeries = dataset.find((s) => s.type === 'bar')!;
  const lineSeries = dataset.find((s) => s.type === 'line')!;

  const maxBar = Math.max(...barSeries.data.map((d) => Number(d.y)), 1);
  const maxLine = Math.max(...lineSeries.data.map((d) => Number(d.y)), 1);
  const lineScaleRatio = maxLine / maxBar;

  const normalizedDataset = dataset.map((series) => {
    if (series.type !== 'line') return series;
    return {
      ...series,
      data: series.data.map((d) => ({
        ...d,
        y: Number(d.y) / lineScaleRatio,
      })),
    };
  });

  // Build right axis ticks in original KG space → convert to normalized scale
  const rightAxisTicks = niceTicks(maxLine).map((v) => v / lineScaleRatio);

  return { normalizedDataset, lineScaleRatio, rightAxisTicks };
}

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
  horizontal = false,
}) => {
  const isEmpty =
    !dataset ||
    dataset.length === 0 ||
    dataset.every((s) => s.data.length === 0);

  const isDualAxis =
    !!dataset &&
    dataset.length === 2 &&
    dataset.some((s) => s.type === 'bar') &&
    dataset.some((s) => s.type === 'line');

  const defaultMinWidth =
    dataset && dataset[0]?.data.length > 10 ? 800 : undefined;
  const finalMinWidth = minWidth || defaultMinWidth;

  // Normalize dataset for dual-axis rendering
  const { normalizedDataset, lineScaleRatio, rightAxisTicks } =
    isDualAxis && !isEmpty
      ? normalizeDualAxis(dataset)
      : {
          normalizedDataset: dataset ?? [],
          lineScaleRatio: 1,
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
        const hideCategoryLabels =
          horizontal && effectiveWidth < X_LABEL_HIDE_THRESHOLD;

        const chartPadding = horizontal
          ? {
              ...chartMargins.horizontalBar,
              left: hideCategoryLabels ? 40 : chartMargins.horizontalBar.left,
            }
          : {
              top: 40,
              bottom: 100,
              left: 70,
              right: isDualAxis ? 90 : 20,
            };

        const legendData = dataset
          ? dataset.map((series, index) => ({
              name: series.name,
              symbol: {
                fill:
                  series.color ??
                  chartThemeConfig.colors[
                    index % chartThemeConfig.colors.length
                  ],
              },
            }))
          : [];

        return (
          <VictoryChartWrapper
            width={width}
            height={height}
            horizontal={horizontal}
            domainPadding={{
              x: 20,
              y: 20,
            }}
            padding={
              horizontal
                ? chartPadding
                : {
                    ...chartPadding,
                    bottom: hideXLabels ? 50 : chartPadding.bottom,
                  }
            }
            minWidth={finalMinWidth}
          >
            {/* Legend */}
            {config?.showLegend !== false && dataset && (
              <VictoryLegend
                x={effectiveWidth / 2 - legendData.length * 60}
                y={10}
                centerTitle
                orientation="horizontal"
                gutter={20}
                data={legendData}
              />
            )}

            {/* Axes */}
            {renderBarChartAxes({
              config,
              hideXLabels: horizontal ? false : hideXLabels,
              hideCategoryLabels,
              isDualAxis,
              lineScaleRatio,
              rightAxisTicks,
              horizontal,
            })}

            {/* Series (bars, lines, scatter overlays) */}
            {renderBarChartSeries({
              normalizedDataset,
              lineScaleRatio,
              tooltipFormat: config?.tooltipFormat,
              horizontal,
            })}
          </VictoryChartWrapper>
        );
      }}
    </ChartContainer>
  );
};
