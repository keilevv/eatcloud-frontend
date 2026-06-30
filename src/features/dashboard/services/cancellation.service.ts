import { apiClient } from '@/services/api/api';
import { DashboardFilters } from './dashboard.service';

export const getCancellationAnalysis = async (filters?: DashboardFilters) => {
  const { data } = await apiClient.get('/dashboard/cancellation-analysis', { params: filters });
  return data.data; 
};
