import { useQuery } from '@tanstack/react-query';

import {
  getDashboardData,
  DashboardFilters,
} from '../services/dashboard.service';

export const useDashboard = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: ['dashboard', filters],
    queryFn: () => getDashboardData(filters),
  });
};
