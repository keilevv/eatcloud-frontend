'use client';

import { useState } from 'react';

import { ProtectedLayout } from '@/features/auth/components/ProtectedLayout';
import { DonationPointAdapter } from '@/features/dashboard/charts/adapters/DonationPointAdapter';
import { DonorChartAdapter } from '@/features/dashboard/charts/adapters/DonorChartAdapter';
import { RiskDonorAdapter } from '@/features/dashboard/charts/adapters/RiskDonorAdapter';
import { RiskPointAdapter } from '@/features/dashboard/charts/adapters/RiskPointAdapter';
import { ScatterAdapter } from '@/features/dashboard/charts/adapters/ScatterAdapter';
import { BarChart } from '@/features/dashboard/charts/components/BarChart';
import { HorizontalBarChart } from '@/features/dashboard/charts/components/HorizontalBarChart';
import { ScatterChart } from '@/features/dashboard/charts/components/ScatterChart';
import { ChartConfig } from '@/features/dashboard/charts/types/ChartConfig';
import { dashboardConfig } from '@/features/dashboard/config/dashboard.config';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { DashboardContent } from '@/features/dashboard/layouts/DashboardContent';
import { DashboardLayout } from '@/features/dashboard/layouts/DashboardLayout';
import { DashboardFilters } from '@/features/dashboard/services/dashboard.service';
import { ChartCard } from '@/features/dashboard/widgets/ChartCard';
import { DashboardGrid } from '@/features/dashboard/widgets/DashboardGrid';
import { DashboardSection } from '@/features/dashboard/widgets/DashboardSection';
import { KpiCard } from '@/features/dashboard/widgets/KpiCard';
import { MapCard } from '@/features/dashboard/widgets/MapCard';

export default function DashboardPage() {
  const [filters] = useState<DashboardFilters>({});
  const { data, isLoading, error } = useDashboard(filters);

  const donorDataset = data?.cancellationAnalysis?.donors
    ? DonorChartAdapter(
        data.cancellationAnalysis.donors.map((d: Record<string, unknown>) => ({
          id: d.donor as string,
          name: d.donor as string,
          totalKg: d.totalKg as number,
        })),
      )
    : [];
  const donationPointDataset = data?.cancellationAnalysis?.donationPoints
    ? DonationPointAdapter(
        data.cancellationAnalysis.donationPoints.map(
          (dp: Record<string, unknown>) => ({
            id: dp.donationPoint as string,
            name: dp.donationPoint as string,
            count: dp.quantity as number,
          }),
        ),
      )
    : [];
  const riskDonorDataset = data?.predictiveAnalysis?.riskDonors
    ? RiskDonorAdapter(
        data.predictiveAnalysis.riskDonors.map(
          (rd: Record<string, unknown>) => ({
            id: rd.donor as string,
            name: rd.donor as string,
            riskPercentage: rd.riskProbability as number,
          }),
        ),
      )
    : [];
  const riskPointDataset = data?.predictiveAnalysis?.riskPoints
    ? RiskPointAdapter(
        data.predictiveAnalysis.riskPoints.map(
          (rp: Record<string, unknown>) => ({
            id: rp.donationPoint as string,
            name: rp.donationPoint as string,
            riskPercentage: rp.riskProbability as number,
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
        return data.cancellationAnalysis.kpis.totalCancelled.toString();
      case 'kpi-2':
        return data.cancellationAnalysis.kpis.totalKgCancelled.toFixed(2);
      case 'kpi-3':
        return (
          data.cancellationAnalysis.kpis.cancellationProbability.toFixed(2) +
          '%'
        );
      case 'kpi-4':
        return data.cancellationAnalysis.kpis.totalGeneral.toString();
      default:
        return '';
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
            const gridWidgets = section.widgets.filter(
              (w: Record<string, unknown>) => w.className !== 'col',
            );
            const colWidgets = section.widgets.filter(
              (w: Record<string, unknown>) => w.className === 'col',
            );

            const renderWidget = (widget: Record<string, unknown>) => {
              const typedWidget = widget as Record<string, unknown>;
              switch (widget.type) {
                case 'kpi':
                  return (
                    <KpiCard
                      key={widget.id}
                      title={widget.title}
                      value={getKpiValue(widget.id)}
                      loading={isLoading}
                    />
                  );
                case 'bar':
                  return (
                    <ChartCard
                      key={widget.id}
                      title={widget.title}
                      subtitle={typedWidget.subtitle as string}
                    >
                      <BarChart
                        dataset={
                          widget.id === 'chart-5'
                            ? donorDataset
                            : riskPointDataset
                        }
                        config={typedWidget.config as ChartConfig}
                        loading={isLoading}
                        error={!!error}
                      />
                    </ChartCard>
                  );
                case 'horizontalBar':
                  return (
                    <ChartCard
                      key={widget.id}
                      title={widget.title}
                      subtitle={typedWidget.subtitle as string}
                    >
                      <HorizontalBarChart
                        dataset={
                          widget.id === 'chart-2'
                            ? donationPointDataset
                            : riskDonorDataset
                        }
                        config={typedWidget.config as ChartConfig}
                        loading={isLoading}
                        error={!!error}
                      />
                    </ChartCard>
                  );
                case 'scatter':
                  return (
                    <ChartCard
                      key={widget.id}
                      title={widget.title}
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
                case 'map':
                  return (
                    <MapCard
                      key={widget.id}
                      title={widget.title}
                      loading={isLoading}
                    />
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
                {gridWidgets.length > 0 && (
                  <DashboardGrid
                    columns={{
                      sm: 1,
                      md: gridWidgets.length > 2 ? 2 : 1,
                      lg: gridWidgets.some((w) => w.type === 'kpi') ? 4 : 2,
                    }}
                  >
                    {gridWidgets.map(renderWidget)}
                  </DashboardGrid>
                )}
                {colWidgets.length > 0 && (
                  <div className="mt-6 flex flex-col gap-6">
                    {colWidgets.map(renderWidget)}
                  </div>
                )}
              </DashboardSection>
            );
          })}
        </DashboardContent>
      </DashboardLayout>
    </ProtectedLayout>
  );
}
