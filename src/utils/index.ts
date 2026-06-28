import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (value: string | Date, pattern = 'PPP'): string => {
  const date = typeof value === 'string' ? parseISO(value) : value;

  if (!isValid(date)) {
    return '';
  }

  return format(date, pattern);
};

export const formatNumber = (value: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(value);
};

export const formatPercentage = (
  value: number,
  decimals = 1,
  locale = 'en-US',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatKilograms = (value: number, locale = 'en-US'): string => {
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value)} kg`;
};

export const truncateText = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
};

export const debounce = <T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const buildQueryString = (
  params: Record<string, string | number | boolean | undefined | null>,
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
