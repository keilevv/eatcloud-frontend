'use client';

import { ProtectedLayout } from '@/features/auth/components/ProtectedLayout';
import { dashboardConfig } from '@/features/dashboard/config/dashboard.config';
import { DashboardContent } from '@/features/dashboard/layouts/DashboardContent';
import { DashboardLayout } from '@/features/dashboard/layouts/DashboardLayout';
import { ChartCard } from '@/features/dashboard/widgets/ChartCard';
import { DashboardGrid } from '@/features/dashboard/widgets/DashboardGrid';
import { DashboardSection } from '@/features/dashboard/widgets/DashboardSection';
import { KpiCard } from '@/features/dashboard/widgets/KpiCard';
import { MapCard } from '@/features/dashboard/widgets/MapCard';

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <DashboardLayout>
        <DashboardContent>
          {dashboardConfig.map((section) => (
            <DashboardSection
              key={section.id}
              title={section.title}
              description={section.description}
            >
              <DashboardGrid
                columns={{
                  sm: 1,
                  md: section.widgets.length > 2 ? 2 : 1,
                  lg: section.widgets.some((w) => w.type === 'kpi') ? 4 : 2,
                }}
              >
                {section.widgets.map((widget) => {
                  switch (widget.type) {
                    case 'kpi':
                      return (
                        <KpiCard
                          key={widget.id}
                          title={widget.title}
                          value={
                            ((widget as Record<string, unknown>)
                              .value as string) || ''
                          }
                          loading={true}
                        />
                      );
                    case 'chart':
                      return (
                        <ChartCard
                          key={widget.id}
                          title={widget.title}
                          loading={true}
                        />
                      );
                    case 'map':
                      return (
                        <MapCard
                          key={widget.id}
                          title={widget.title}
                          loading={true}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </DashboardGrid>
            </DashboardSection>
          ))}
        </DashboardContent>
      </DashboardLayout>
    </ProtectedLayout>
  );
}
