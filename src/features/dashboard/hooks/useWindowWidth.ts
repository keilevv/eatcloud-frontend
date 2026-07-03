import { useState, useEffect } from 'react';

const RESIZE_DEBOUNCE_MS = 150;

/**
 * Returns the current window inner width, debounced on resize to avoid
 * re-rendering the full dashboard on every resize frame.
 */
export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, RESIZE_DEBOUNCE_MS);
    };

    setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
}
