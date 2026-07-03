import { apiClient } from '@/services/api/api';
import { DashboardFilters } from './dashboard.service';

export const getBeneficiaries = async (filters?: DashboardFilters) => {
  const { data } = await apiClient.get('/dashboard/beneficiaries', { params: filters });
  return data.data; 
};
