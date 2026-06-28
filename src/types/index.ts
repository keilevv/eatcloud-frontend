export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: Array<string | { field: string; message: string }>;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ChartData {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface KPI {
  label: string;
  value: number;
  format?: 'number' | 'percentage' | 'kilograms';
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface NormalizedApiError {
  message: string;
  statusCode?: number;
  errors: string[];
}
