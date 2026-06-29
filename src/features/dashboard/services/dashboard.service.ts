import { apiClient } from '@/services/api/api';

export interface DashboardFilters {
  donor?: string;
  donationPoint?: string;
  city?: string;
  department?: string;
  riskLevel?: string;
  beneficiaryType?: string;
  beneficiaryStatus?: string;
  limit?: number;
}

export const getDashboardData = async (filters?: DashboardFilters) => {
  const { data } = await apiClient.get('/dashboard', { params: filters });
  return data.data; // sendSuccess returns { success: true, data: { ... }, message: "..." }
};
