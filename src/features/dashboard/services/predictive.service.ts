import { apiClient } from '@/services/api/api';
import { DashboardFilters } from './dashboard.service';

export const getPredictiveAnalysis = async (filters?: DashboardFilters) => {
  const { data } = await apiClient.get('/dashboard/predictive-analysis', { params: filters });
  return data.data; 
};
