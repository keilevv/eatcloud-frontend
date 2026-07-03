'use client';

import { useEffect, useRef, useState } from 'react';

interface UseVisibilityOptions {
  rootMargin?: string;
  once?: boolean;
}

export function useVisibility<T extends HTMLElement = HTMLDivElement>(
  { rootMargin = '200px', once = true }: UseVisibilityOptions = {},
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || (once && isVisible)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once, isVisible]);

  return { ref, isVisible };
}
