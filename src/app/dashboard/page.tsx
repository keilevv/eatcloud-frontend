'use client';

import { useMemo } from 'react';
import { ProtectedLayout } from '@/features/auth/components/ProtectedLayout';
import { DonationPointAdapter } from '@/features/dashboard/charts/adapters/DonationPointAdapter';
import { DonorChartAdapter } from '@/features/dashboard/charts/adapters/DonorChartAdapter';
import { RiskDonorAdapter } from '@/features/dashboard/charts/adapters/RiskDonorAdapter';
import { RiskPointAdapter } from '@/features/dashboard/charts/adapters/RiskPointAdapter';
import { ScatterAdapter } from '@/features/dashboard/charts/adapters/ScatterAdapter';
import { BarChart } from '@/features/dashboard/charts/components/BarChart';
import { ClusterMarkerMap } from '@/features/dashboard/charts/components/ClusterMarkerMap';
import {
  HeatMapChart,
  MapPoint,
} from '@/features/dashboard/charts/components/HeatMapChart';
import { ScatterChart } from '@/features/dashboard/charts/components/ScatterChart';
import { SemaphoreMap } from '@/features/dashboard/charts/components/SemaphoreMap';
import { ChartConfig } from '@/features/dashboard/charts/types/ChartConfig';
import { dashboardConfig } from '@/features/dashboard/config/dashboard.config';
import { useCancellationAnalysis } from '@/features/dashboard/hooks/useCancellationAnalysis';
import { usePredictiveAnalysis } from '@/features/dashboard/hooks/usePredictiveAnalysis';
import { useWindowWidth } from '@/features/dashboard/hooks/useWindowWidth';
import { DashboardContent } from '@/features/dashboard/layouts/DashboardContent';
import { DashboardLayout } from '@/features/dashboard/layouts/DashboardLayout';
import { DashboardFilters } from '@/features/dashboard/services/dashboard.service';
import { ChartCard } from '@/features/dashboard/widgets/ChartCard';
import { DashboardGrid } from '@/features/dashboard/widgets/DashboardGrid';
import { LazySection } from '@/features/dashboard/widgets/LazySection';
import { KpiCard } from '@/features/dashboard/widgets/KpiCard';
import { MapCard } from '@/features/dashboard/widgets/MapCard';
import { formatNumber } from '@/utils';
import { DashboardSection } from '@/features/dashboard/widgets/DashboardSection';

const CHART_SINGLE_COL_BREAKPOINT = 1000;

export default function DashboardPage() {
  const [filters] = [{} as DashboardFilters];
  const {
    data: cancellationData,
    isLoading: cancellationLoading,
    error: cancellationError,
  } = useCancellationAnalysis(filters);
  const {
    data: predictiveData,
    isLoading: predictiveLoading,
    error: predictiveError,
  } = usePredictiveAnalysis(filters);
  const windowWidth = useWindowWidth();

  const donorDataset = useMemo(
    () =>
      cancellationData?.donorsChart
        ? DonorChartAdapter(
            cancellationData.donorsChart
              .map((d: Record<string, unknown>) => ({
                id: d.donor as string,
                name: d.donor as string,
                totalKg: d.totalKg as number,
                quantity: d.quantity as number,
              }))
              .slice(0, 15),
          )
        : [],
    [cancellationData],
  );

  const topDonationPointDataset = useMemo(
    () =>
      cancellationData?.topDonationPoints
        ? DonationPointAdapter(
            cancellationData.topDonationPoints.map(
              (dp: Record<string, unknown>) => ({
                id: dp.donationPoint as string,
                name: dp.donationPoint as string,
                totalKg: dp.totalKg as number,
                quantity: dp.quantity as number,
              }),
            ),
          )
        : { series: [], xAxisLabel: undefined, yAxisLabel: undefined },
    [cancellationData],
  );

  const rawMapPoints: MapPoint[] = useMemo(
    () =>
      cancellationData?.mapPoints
        ? cancellationData.mapPoints.map((mp: Record<string, unknown>) => ({
            latitude: mp.latitude as number,
            longitude: mp.longitude as number,
            donationPoint: mp.donationPoint as string,
            donor: mp.donor as string,
            city: mp.city as string | undefined,
            department: mp.department as string | undefined,
            quantity: mp.quantity as number,
            totalKg: mp.totalKg as number,
          }))
        : [],
    [cancellationData],
  );

  const riskDonorDataset = useMemo(
    () =>
      predictiveData?.topRiskDonors
        ? RiskDonorAdapter(
            predictiveData.topRiskDonors.map((rd: Record<string, unknown>) => ({
              id: rd.donor as string,
              name: rd.donor as string,
              riskPercentage: Number(rd.probability) * 100,
            })),
            15,
          )
        : { series: [], xAxisLabel: undefined, yAxisLabel: undefined },
    [predictiveData],
  );

  const riskPointDataset = useMemo(
    () =>
      predictiveData?.topRiskDonationPoints
        ? RiskPointAdapter(
            predictiveData.topRiskDonationPoints.map(
              (rp: Record<string, unknown>) => ({
                id: rp.donationPoint as string,
                name: rp.donationPoint as string,
                riskPercentage: Number(rp.probability) * 100,
              }),
            ),
          )
        : { series: [], xAxisLabel: undefined, yAxisLabel: undefined },
    [predictiveData],
  );

  const scatterDataset = useMemo(
    () =>
      predictiveData?.scatterPlot
        ? ScatterAdapter(
            predictiveData.scatterPlot.map((sp: Record<string, unknown>) => ({
              id: sp.name as string,
              name: sp.name as string,
              announcements: sp.announcements as number,
              cancellationProbability: Math.round(
                Number(sp.cancellationProbability) * 100,
              ),
              donor: sp.donor as string,
            })),
          )
        : { series: [], xAxisLabel: undefined, yAxisLabel: undefined },
    [predictiveData],
  );

  const semaphoreMapData = useMemo(
    () => (predictiveData?.semaphoreMap ? predictiveData.semaphoreMap : []),
    [predictiveData],
  );

  const isLoading = cancellationLoading || predictiveLoading;
  const error = cancellationError || predictiveError;

  const getKpiValue = (id: string) => {
    switch (id) {
      case 'kpi-1':
        return cancellationData?.kpis
          ? formatNumber(cancellationData.kpis.totalCancelled)
          : 'Loading...';
      case 'kpi-2':
        return cancellationData?.kpis
          ? formatNumber(cancellationData.kpis.totalKgCancelled)
          : 'Loading...';
      case 'kpi-3':
        return cancellationData?.kpis
          ? formatNumber(cancellationData.kpis.cancellationProbability * 100) +
              '%'
          : 'Loading...';
      case 'kpi-4':
        return cancellationData?.kpis
          ? formatNumber(cancellationData.kpis.totalGeneral)
          : 'Loading...';
      case 'kpi-5':
        return predictiveData?.highestRiskPoint?.donationPoint || 'Loading...';
      case 'kpi-6':
        return predictiveData?.highestRiskDonor?.donor || 'Loading...';
      case 'kpi-7':
        return predictiveData?.excellentPoints !== undefined
          ? formatNumber(predictiveData.excellentPoints)
          : 'Loading...';
      default:
        return '';
    }
  };

  const getDataset = (id: string) => {
    const result = (() => {
      switch (id) {
        case 'chart-1':
          return donorDataset;
        case 'chart-2':
          return topDonationPointDataset;
        case 'chart-3':
          return riskDonorDataset;
        case 'chart-4':
          return riskPointDataset;
        default:
          return [];
      }
    })();

    // Handle ChartAdapterResult type by extracting series
    if (result && typeof result === 'object' && 'series' in result) {
      return result.series;
    }
    return result;
  };

  const getChartConfig = (id: string): ChartConfig => {
    const result = (() => {
      switch (id) {
        case 'chart-1':
          return donorDataset;
        case 'chart-2':
          return topDonationPointDataset;
        case 'chart-3':
          return riskDonorDataset;
        case 'chart-4':
          return riskPointDataset;
        case 'scatter-1':
          return scatterDataset;
        default:
          return null;
      }
    })();

    // Handle ChartAdapterResult type by extracting axis labels
    if (result && typeof result === 'object' && 'xAxisLabel' in result) {
      return {
        xAxisLabel: result.xAxisLabel,
        yAxisLabel: result.yAxisLabel,
        xAxisFormat: result.xAxisFormat,
        yAxisFormat: result.yAxisFormat,
        y2AxisLabel: result.y2AxisLabel,
        y2AxisFormat: result.y2AxisFormat,
      };
    }
    return {};
  };

  const renderWidget = (widget: Record<string, unknown>) => {
    const typedWidget = widget as Record<string, unknown>;
    switch (widget.type) {
      case 'kpi':
        return (
          <KpiCard
            key={widget.id as string}
            title={widget.title as string}
            value={getKpiValue(widget.id as string)}
            loading={isLoading}
            textColor={widget.textColor as string}
            subtitle={widget.subtitle as string}
          />
        );
      case 'bar':
        return (
          <ChartCard
            key={widget.id as string}
            title={widget.title as string}
            subtitle={typedWidget.subtitle as string}
          >
            <BarChart
              dataset={getDataset(widget.id as string)}
              config={{
                ...getChartConfig(widget.id as string),
                ...(typedWidget.config as ChartConfig),
              }}
              loading={isLoading}
              error={!!error}
              minWidth={250}
              horizontal={false}
            />
          </ChartCard>
        );
      case 'horizontalBar':
        return (
          <ChartCard
            key={widget.id as string}
            title={widget.title as string}
            subtitle={typedWidget.subtitle as string}
          >
            <BarChart
              dataset={getDataset(widget.id as string)}
              config={{
                ...getChartConfig(widget.id as string),
                ...(typedWidget.config as ChartConfig),
              }}
              loading={isLoading}
              error={!!error}
              minWidth={250}
              horizontal={true}
            />
          </ChartCard>
        );
      case 'scatter':
        return (
          <ChartCard
            key={widget.id as string}
            title={widget.title as string}
            subtitle={typedWidget.subtitle as string}
          >
            <ScatterChart
              dataset={
                scatterDataset &&
                typeof scatterDataset === 'object' &&
                'series' in scatterDataset
                  ? scatterDataset.series
                  : scatterDataset
              }
              config={{
                ...getChartConfig(widget.id as string),
                ...(typedWidget.config as ChartConfig),
              }}
              loading={predictiveLoading}
              error={!!predictiveError}
            />
          </ChartCard>
        );
      case 'heatMap':
        return (
          <MapCard
            key={widget.id as string}
            title={widget.title as string}
            loading={isLoading}
          >
            <HeatMapChart
              points={rawMapPoints}
              mode={(typedWidget.mode as 'quantity' | 'totalKg') ?? 'quantity'}
            />
          </MapCard>
        );
      case 'semaphoreMap':
        return (
          <MapCard
            key={widget.id as string}
            title={widget.title as string}
            subtitle={widget.subtitle as string}
            loading={predictiveLoading}
          >
            <SemaphoreMap points={semaphoreMapData} />
          </MapCard>
        );
      case 'clusterMap':
        return (
          <MapCard
            key={widget.id as string}
            title={widget.title as string}
            loading={isLoading}
          >
            <ClusterMarkerMap
              points={rawMapPoints}
              mode={(typedWidget.mode as 'quantity' | 'totalKg') ?? 'quantity'}
            />
          </MapCard>
        );
      default:
        return null;
    }
  };

  const renderGrid = (
    rows: {
      itemSpacing?: number;
      rowSpacing?: number;
      items: Record<string, unknown>[];
    }[],
  ) =>
    rows.map((row, rowIndex) => {
      const { items, itemSpacing, rowSpacing } = row;
      const isKpiRow = items.every((w) => w.type === 'kpi');

      const chartCols =
        windowWidth > 0 && windowWidth < CHART_SINGLE_COL_BREAKPOINT
          ? 1
          : items.length > 1
            ? 2
            : 1;

      const columns = isKpiRow
        ? {
            sm: 1,
            md: 2,
            lg: items.length as 1 | 2 | 3 | 4,
          }
        : {
            sm: 1,
            md: chartCols as 1 | 2,
            lg: items.length > 1 ? 2 : 1,
          };

      return (
        <div
          key={rowIndex}
          style={{
            marginBottom: rowSpacing ? `${rowSpacing * 4}px` : undefined,
          }}
        >
          <DashboardGrid
            columns={columns}
            gap={itemSpacing ? String(itemSpacing) : undefined}
          >
            {items.map(renderWidget)}
          </DashboardGrid>
        </div>
      );
    });

  return (
    <ProtectedLayout>
      <DashboardLayout>
        <DashboardContent>
          {error && (
            <div className="p-4 text-red-500">
              Failed to load dashboard data.
            </div>
          )}
          {dashboardConfig.map((section) => {
            const sectionKey = section.id;
            const sectionConfig = section;

            return (
              <LazySection
                key={sectionKey}
                title={sectionConfig.title}
                description={sectionConfig.description}
                placeholderHeight={200}
              >
                {renderGrid(
                  sectionConfig.widgets as {
                    itemSpacing?: number;
                    rowSpacing?: number;
                    items: Record<string, unknown>[];
                  }[],
                )}
              </LazySection>
            );
          })}
        </DashboardContent>
      </DashboardLayout>
    </ProtectedLayout>
  );
}
