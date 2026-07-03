'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
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
import { useBeneficiaries } from '@/features/dashboard/hooks/useBeneficiaries';
import { useWindowWidth } from '@/features/dashboard/hooks/useWindowWidth';
import { DashboardContent } from '@/features/dashboard/layouts/DashboardContent';
import { DashboardLayout } from '@/features/dashboard/layouts/DashboardLayout';
import { DashboardFilters } from '@/features/dashboard/services/dashboard.service';
import { ChartCard } from '@/features/dashboard/widgets/ChartCard';
import { DashboardGrid } from '@/features/dashboard/widgets/DashboardGrid';
import { LazySection } from '@/features/dashboard/widgets/LazySection';
import { LazyWidget } from '@/features/dashboard/widgets/LazyWidget';
import { KpiCard } from '@/features/dashboard/widgets/KpiCard';
import { FilterWidget } from '@/features/dashboard/widgets/FilterWidget';
import { MapCard } from '@/features/dashboard/widgets/MapCard';
import { formatNumber } from '@/utils';

const CHART_SINGLE_COL_BREAKPOINT = 1000;

export default function DashboardPage() {
  const [filters] = [{} as DashboardFilters];
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
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

  const {
    data: beneficiariesData,
    isLoading: beneficiariesLoading,
  } = useBeneficiaries(filters);

  // Extract filter options from beneficiaries data
  const typeFilterOptions = useMemo(() => {
    const byType = beneficiariesData?.visualization?.byType ?? {};
    return Object.entries(byType).map(([label, count]) => ({
      label,
      value: label,
      count: count as number,
      selected: selectedTypes.includes(label),
    }));
  }, [beneficiariesData, selectedTypes]);

  const statusFilterOptions = useMemo(() => {
    const byStatus = beneficiariesData?.visualization?.byStatus ?? {};
    return Object.entries(byStatus).map(([label, count]) => ({
      label,
      value: label,
      count: count as number,
      selected: selectedStatuses.includes(label),
    }));
  }, [beneficiariesData, selectedStatuses]);

  const beneficiaryLocations = useMemo(
    () => beneficiariesData?.locations ?? [],
    [beneficiariesData],
  );

  // Initialize filter states with all values when data loads
  useEffect(() => {
    if (beneficiariesData?.visualization) {
      const allTypes = Object.keys(beneficiariesData.visualization.byType);
      const allStatuses = Object.keys(beneficiariesData.visualization.byStatus);
      
      if (selectedTypes.length === 0 && allTypes.length > 0) {
        setSelectedTypes(allTypes);
      }
      if (selectedStatuses.length === 0 && allStatuses.length > 0) {
        setSelectedStatuses(allStatuses);
      }
    }
  }, [beneficiariesData]);

  // Filter beneficiary locations based on selected filters
  const filteredBeneficiaryLocations = useMemo(() => {
    return beneficiaryLocations.filter((loc: any) => {
      const typeMatch = selectedTypes.includes(loc.type);
      const statusMatch = selectedStatuses.includes(loc.status);
      return typeMatch && statusMatch;
    });
  }, [beneficiaryLocations, selectedTypes, selectedStatuses]);

  // Pre-compute beneficiary points for the semaphore map (was inline inside renderWidget)
  const beneficiarySemaphorePoints = useMemo(
    () =>
      filteredBeneficiaryLocations.map((loc: any) => ({
        id: loc.name,
        label: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        type: loc.type,
        status: loc.status,
        phone: loc.phone,
        city: loc.city,
        department: loc.department,
        riskLevel: loc.riskLevel,
      })),
    [filteredBeneficiaryLocations],
  );

  const handleToggleType = useCallback((value: string) => {
    setSelectedTypes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    );
  }, []);

  const handleToggleStatus = useCallback((value: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    );
  }, []);

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

  const scatterSeries = useMemo(
    () =>
      scatterDataset &&
      typeof scatterDataset === 'object' &&
      'series' in scatterDataset
        ? scatterDataset.series
        : scatterDataset,
    [scatterDataset],
  );

  const scatterChartConfig = useMemo((): ChartConfig => {
    if (
      scatterDataset &&
      typeof scatterDataset === 'object' &&
      'xAxisLabel' in scatterDataset
    ) {
      return {
        xAxisLabel: scatterDataset.xAxisLabel,
        yAxisLabel: scatterDataset.yAxisLabel,
        xAxisFormat: scatterDataset.xAxisFormat,
        yAxisFormat: scatterDataset.yAxisFormat,
        y2AxisLabel: scatterDataset.y2AxisLabel,
        y2AxisFormat: scatterDataset.y2AxisFormat,
      };
    }

    return {};
  }, [scatterDataset]);

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
              dataset={scatterSeries}
              config={{
                ...scatterChartConfig,
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
            <LazyWidget>
              <HeatMapChart
                points={rawMapPoints}
                mode={(typedWidget.mode as 'quantity' | 'totalKg') ?? 'quantity'}
              />
            </LazyWidget>
          </MapCard>
        );
      case 'semaphoreMap':
        return (
          <MapCard
            key={widget.id as string}
            title={widget.title as string}
            subtitle={widget.subtitle as string}
            loading={widget.id === 'beneficiaries-map' ? beneficiariesLoading : predictiveLoading}
          >
            <LazyWidget>
              <SemaphoreMap
                semaphorePoints={semaphoreMapData}
                beneficiaryPoints={beneficiarySemaphorePoints}
              />
            </LazyWidget>
          </MapCard>
        );
      case 'filter':
        if (widget.id === 'filter-1') {
          return (
            <FilterWidget
              key={widget.id as string}
              title={widget.title as string}
              subtitle={widget.subtitle as string}
              options={typeFilterOptions}
              onToggle={handleToggleType}
            />
          );
        }
        if (widget.id === 'filter-2') {
          return (
            <FilterWidget
              key={widget.id as string}
              title={widget.title as string}
              subtitle={widget.subtitle as string}
              options={statusFilterOptions}
              onToggle={handleToggleStatus}
            />
          );
        }
        return null;
      case 'clusterMap':
        return (
          <MapCard
            key={widget.id as string}
            title={widget.title as string}
            loading={isLoading}
          >
            <LazyWidget>
              <ClusterMarkerMap
                points={rawMapPoints}
                mode={(typedWidget.mode as 'quantity' | 'totalKg') ?? 'quantity'}
              />
            </LazyWidget>
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

  // ── Memoize each config-driven section so it only re-renders when its domain data changes ──
  const section0Config = dashboardConfig[0];
  const section1Config = dashboardConfig[1];
  const section2Config = dashboardConfig[2];

  // renderGrid omitted intentionally — it changes every render, and we want
  // the useMemo to freeze the element tree when the section's domain data hasn't changed.
  /* eslint-disable react-hooks/exhaustive-deps */
  const cancellationSection = useMemo(
    () =>
      renderGrid(
        section0Config.widgets as {
          itemSpacing?: number;
          rowSpacing?: number;
          items: Record<string, unknown>[];
        }[],
      ),
    [cancellationData, cancellationLoading, cancellationError, rawMapPoints, isLoading, error, windowWidth],
  );

  const predictiveSection = useMemo(
    () =>
      renderGrid(
        section1Config.widgets as {
          itemSpacing?: number;
          rowSpacing?: number;
          items: Record<string, unknown>[];
        }[],
      ),
    [
      predictiveData,
      predictiveLoading,
      predictiveError,
      scatterSeries,
      scatterChartConfig,
      isLoading,
      error,
      windowWidth,
    ],
  );

  const beneficiariesSection = useMemo(
    () =>
      renderGrid(
        section2Config.widgets as {
          itemSpacing?: number;
          rowSpacing?: number;
          items: Record<string, unknown>[];
        }[],
      ),
    [beneficiariesData, semaphoreMapData, filteredBeneficiaryLocations, beneficiarySemaphorePoints, typeFilterOptions, statusFilterOptions, handleToggleType, handleToggleStatus, beneficiariesLoading, isLoading, error, windowWidth],
  );
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <ProtectedLayout>
      <DashboardLayout>
        <DashboardContent>
          {error && (
            <div className="p-4 text-red-500">
              Failed to load dashboard data.
            </div>
          )}
          <LazySection
            title={section0Config.title}
            description={section0Config.description}
            placeholderHeight={200}
          >
            {cancellationSection}
          </LazySection>
          <LazySection
            title={section1Config.title}
            description={section1Config.description}
            placeholderHeight={200}
          >
            {predictiveSection}
          </LazySection>
          <LazySection
            title={section2Config.title}
            description={section2Config.description}
            placeholderHeight={200}
          >
            {beneficiariesSection}
          </LazySection>
        </DashboardContent>
      </DashboardLayout>
    </ProtectedLayout>
  );
}
