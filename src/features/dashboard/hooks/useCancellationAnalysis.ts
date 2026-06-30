import { useQuery } from '@tanstack/react-query';

import { getCancellationAnalysis } from '@/features/dashboard/services/cancellation.service';
import { DashboardFilters } from '@/features/dashboard/services/dashboard.service';

export const useCancellationAnalysis = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: ['cancellation-analysis', filters],
    queryFn: () => getCancellationAnalysis(filters),
  });
};
