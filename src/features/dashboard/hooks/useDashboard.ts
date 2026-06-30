import { useQuery } from '@tanstack/react-query';

import { getCancellationAnalysis } from '../services/cancellation.service';
import { DashboardFilters } from '../services/dashboard.service';

export const useDashboard = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: ['dashboard', filters],
    queryFn: async () => {
      const cancellationAnalysis = await getCancellationAnalysis(filters);
      return {
        cancellationAnalysis,
      };
    },
  });
};
