export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'EatCloud',
  environment: process.env.NEXT_PUBLIC_ENV ?? 'development',
  isDevelopment: process.env.NEXT_PUBLIC_ENV === 'development',
  isProduction: process.env.NEXT_PUBLIC_ENV === 'production',
} as const;
