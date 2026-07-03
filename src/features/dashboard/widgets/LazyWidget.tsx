'use client';

import React from 'react';

import { useVisibility } from '../hooks/useVisibility';

interface LazyWidgetProps {
  children: React.ReactNode;
  placeholderHeight?: number;
  rootMargin?: string;
}

export const LazyWidget: React.FC<LazyWidgetProps> = ({
  children,
  placeholderHeight = 420,
  rootMargin = '250px',
}) => {
  const { ref, isVisible } = useVisibility({ rootMargin, once: true });

  return (
    <div ref={ref}>
      {isVisible ? (
        children
      ) : (
        <div
          style={{ height: placeholderHeight }}
          className="bg-muted/40 w-full animate-pulse rounded-lg"
        />
      )}
    </div>
  );
};
