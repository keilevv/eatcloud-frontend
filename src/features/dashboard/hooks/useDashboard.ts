import { useQuery } from '@tanstack/react-query';

import { getCancellationAnalysis } from '../services/cancellation.service';
import { getPredictiveAnalysis } from '../services/predictive.service';
import { getBeneficiaries } from '../services/beneficiaries.service';
import { DashboardFilters } from '../services/dashboard.service';

export const useDashboard = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: ['dashboard', filters],
    queryFn: async () => {
      const cancellationAnalysis = await getCancellationAnalysis(filters);
      const predictiveAnalysis = await getPredictiveAnalysis(filters);
      const beneficiaries = await getBeneficiaries(filters);
      return {
        cancellationAnalysis,
        predictiveAnalysis,
        beneficiaries,
      };
    },
  });
};
