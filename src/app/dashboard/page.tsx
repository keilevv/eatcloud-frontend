'use client';

import { useState } from 'react';
import { ProtectedLayout } from '@/features/auth/components/ProtectedLayout';
import { DonationPointAdapter } from '@/features/dashboard/charts/adapters/DonationPointAdapter';
import { DonorChartAdapter } from '@/features/dashboard/charts/adapters/DonorChartAdapter';
import { RiskDonorAdapter } from '@/features/dashboard/charts/adapters/RiskDonorAdapter';
import { RiskPointAdapter } from '@/features/dashboard/charts/adapters/RiskPointAdapter';
import { ScatterAdapter } from '@/features/dashboard/charts/adapters/ScatterAdapter';
import { BarChart } from '@/features/dashboard/charts/components/BarChart';
import { ClusterMarkerMap } from '@/features/dashboard/charts/components/ClusterMarkerMap';
import { HeatMapChart, MapPoint } from '@/features/dashboard/charts/components/HeatMapChart';
import { ScatterChart } from '@/features/dashboard/charts/components/ScatterChart';
import { ChartConfig } from '@/features/dashboard/charts/types/ChartConfig';
import { dashboardConfig } from '@/features/dashboard/config/dashboard.config';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useWindowWidth } from '@/features/dashboard/hooks/useWindowWidth';
import { DashboardContent } from '@/features/dashboard/layouts/DashboardContent';
import { DashboardLayout } from '@/features/dashboard/layouts/DashboardLayout';
import { DashboardFilters } from '@/features/dashboard/services/dashboard.service';
import { ChartCard } from '@/features/dashboard/widgets/ChartCard';
import { DashboardGrid } from '@/features/dashboard/widgets/DashboardGrid';
import { DashboardSection } from '@/features/dashboard/widgets/DashboardSection';
import { KpiCard } from '@/features/dashboard/widgets/KpiCard';
import { MapCard } from '@/features/dashboard/widgets/MapCard';
import { formatNumber } from '@/utils';

export default function DashboardPage() {
  const [filters] = useState<DashboardFilters>({});
  const { data, isLoading, error } = useDashboard(filters);
  const windowWidth = useWindowWidth();

  // Charts collapse to 1 column below this pixel width (between sm=640 and md=768)
  const CHART_SINGLE_COL_BREAKPOINT = 1000;

  const donorDataset = data?.cancellationAnalysis?.donorsChart
    ? DonorChartAdapter(
        data.cancellationAnalysis.donorsChart
          .map((d: Record<string, unknown>) => ({
            id: d.donor as string,
            name: d.donor as string,
            totalKg: d.totalKg as number,
            quantity: d.quantity as number,
          }))
          .slice(0, 15),
      )
    : [];

  const topDonationPointDataset = data?.cancellationAnalysis?.topDonationPoints
    ? DonationPointAdapter(
        data.cancellationAnalysis.topDonationPoints.map(
          (dp: Record<string, unknown>) => {
            return {
              id: dp.donationPoint as string,
              name: dp.donationPoint as string,
              totalKg: dp.totalKg as number,
              quantity: dp.quantity as number,
            };
          },
        ),
      )
    : [];

  // Raw map points (with lat/lon) passed directly to the Leaflet map components
  const rawMapPoints: MapPoint[] = data?.cancellationAnalysis?.mapPoints
    ? data.cancellationAnalysis.mapPoints.map((mp: Record<string, unknown>) => ({
        latitude: mp.latitude as number,
        longitude: mp.longitude as number,
        donationPoint: mp.donationPoint as string,
        donor: mp.donor as string,
        city: mp.city as string | undefined,
        department: mp.department as string | undefined,
        quantity: mp.quantity as number,
        totalKg: mp.totalKg as number,
      }))
    : [];

  const riskDonorDataset = data?.predictiveAnalysis?.topRiskDonors
    ? RiskDonorAdapter(
        data.predictiveAnalysis.topRiskDonors.map(
          (rd: Record<string, unknown>) => ({
            id: rd.donor as string,
            name: rd.donor as string,
            riskPercentage: Number(rd.probability) * 100,
          }),
        ),
        15,
      )
    : [];
  
  const riskPointDataset = data?.predictiveAnalysis?.topRiskDonationPoints
    ? RiskPointAdapter(
        data.predictiveAnalysis.topRiskDonationPoints.map(
          (rp: Record<string, unknown>) => ({
            id: rp.donationPoint as string,
            name: rp.donationPoint as string,
            riskPercentage: Number(rp.probability) * 100,
          }),
        ),
      )
    : [];
  const scatterDataset = data?.predictiveAnalysis?.scatterPlot
    ? ScatterAdapter(
        data.predictiveAnalysis.scatterPlot.map(
          (sp: Record<string, unknown>) => ({
            id: sp.name as string,
            name: sp.name as string,
            announcements: sp.x as number,
            cancellationProbability: sp.y as number,
          }),
        ),
      )
    : [];

  const getKpiValue = (id: string) => {
    if (!data?.cancellationAnalysis?.kpis) return 'Loading...';
    switch (id) {
      case 'kpi-1':
        return formatNumber(data.cancellationAnalysis.kpis.totalCancelled);
      case 'kpi-2':
        return formatNumber(data.cancellationAnalysis.kpis.totalKgCancelled);
      case 'kpi-3':
        return (
         formatNumber( data.cancellationAnalysis.kpis.cancellationProbability * 100 )+ '%'
        );
      case 'kpi-4':
        return formatNumber(data.cancellationAnalysis.kpis.totalGeneral);
      case 'kpi-5':
        return data.predictiveAnalysis?.highestRiskPoint?.donationPoint || 'Loading...';
      case 'kpi-6':
        return data.predictiveAnalysis?.highestRiskDonor?.donor || 'Loading...';
      case 'kpi-7':
        return formatNumber(data.predictiveAnalysis?.excellentPoints|| 0);
      default:
        return '';
    }
  };

  const getDataset = (id: string) => {
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
  };

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
                        config={typedWidget.config as ChartConfig}
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
                        config={typedWidget.config as ChartConfig}
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
                        dataset={scatterDataset}
                        config={typedWidget.config as ChartConfig}
                        loading={isLoading}
                        error={!!error}
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

            return (
              <DashboardSection
                key={section.id}
                title={section.title}
                description={section.description}
              >
                {(
                  section.widgets as {
                    itemSpacing?: number;
                    rowSpacing?: number;
                    items: Record<string, unknown>[];
                  }[]
                ).map((row, rowIndex) => {
                  const { items, itemSpacing, rowSpacing } = row;
                  const isKpiRow = items.every((w) => w.type === 'kpi');

                  // KPI rows: sm→1, md→2, lg→full count
                  // Chart rows: dynamically collapse to 1 col below CHART_SINGLE_COL_BREAKPOINT
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
                        marginBottom: rowSpacing
                          ? `${rowSpacing * 4}px`
                          : undefined,
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
                })}
              </DashboardSection>
            );
          })}
        </DashboardContent>
      </DashboardLayout>
    </ProtectedLayout>
  );
}
