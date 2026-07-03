import { useQuery } from '@tanstack/react-query';

import { getBeneficiaries } from '@/features/dashboard/services/beneficiaries.service';
import { DashboardFilters } from '@/features/dashboard/services/dashboard.service';

export const useBeneficiaries = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: ['beneficiaries', filters],
    queryFn: () => getBeneficiaries(filters),
  });
};
