import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/config/env';
import type { ApiErrorResponse, NormalizedApiError } from '@/types';

const REQUEST_TIMEOUT = 30000;

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const responseData = axiosError.response?.data;

    return {
      message: responseData?.message ?? axiosError.message ?? 'Request failed',
      statusCode: axiosError.response?.status,
      errors: Array.isArray(responseData?.errors)
        ? responseData.errors.map((item) =>
            typeof item === 'string' ? item : item.message,
          )
        : [],
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      errors: [],
    };
  }

  return {
    message: 'An unexpected error occurred',
    errors: [],
  };
};

const attachAuthHeader = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('eatcloud_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(attachAuthHeader);

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const normalizedError = normalizeApiError(error);
    if (
      normalizedError.statusCode === 401 ||
      normalizedError.statusCode === 403
    ) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('eatcloud_auth_token');
        // Dispatch a custom event so the React context can listen to it and update state
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(normalizedError);
  },
);

export default apiClient;
