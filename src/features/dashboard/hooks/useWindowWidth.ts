import { useState, useEffect } from 'react';

/**
 * Returns the current window inner width, updating on every resize event.
 * Uses 0 as the initial SSR-safe default.
 */
export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // Sync on mount in case the initial value was 0 (SSR)
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
