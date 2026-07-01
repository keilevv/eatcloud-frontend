import { useQuery } from '@tanstack/react-query';

import { getPredictiveAnalysis } from '@/features/dashboard/services/predictive.service';
import { DashboardFilters } from '@/features/dashboard/services/dashboard.service';

export const usePredictiveAnalysis = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: ['predictive-analysis', filters],
    queryFn: () => getPredictiveAnalysis(filters),
  });
};
