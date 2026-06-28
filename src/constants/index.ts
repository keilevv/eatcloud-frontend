export const APP_METADATA = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? 'EatCloud',
  description: 'Food donation analytics platform',
  env: process.env.NEXT_PUBLIC_ENV ?? 'development',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
  },
  DASHBOARD: {
    OVERVIEW: '/api/dashboard/overview',
    CANCELLATION_ANALYSIS: '/api/dashboard/cancellation-analysis',
    PREDICTIVE_ANALYSIS: '/api/dashboard/predictive-analysis',
    BENEFICIARIES: '/api/dashboard/beneficiaries',
    ECOSYSTEM: '/api/dashboard/ecosystem',
    FILTER_OPTIONS: '/api/dashboard/filter-options',
    CACHE_REFRESH: '/api/dashboard/cache/refresh',
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'eatcloud_auth_token',
  THEME: 'eatcloud_theme',
} as const;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const CHART_COLORS = {
  primary: 'hsl(var(--chart-1))',
  secondary: 'hsl(var(--chart-2))',
  tertiary: 'hsl(var(--chart-3))',
  quaternary: 'hsl(var(--chart-4))',
  quinary: 'hsl(var(--chart-5))',
} as const;

export const MAP_DEFAULTS = {
  defaultCenter: { lat: 4.711, lng: -74.0721 },
  defaultZoom: 6,
  minZoom: 4,
  maxZoom: 18,
} as const;

export const QUERY_DEFAULTS = {
  STALE_TIME: 1000 * 60 * 5,
  GC_TIME: 1000 * 60 * 30,
  RETRY: 1,
} as const;
