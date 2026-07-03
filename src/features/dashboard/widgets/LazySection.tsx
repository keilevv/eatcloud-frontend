'use client';

import React from 'react';

import { useVisibility } from '../hooks/useVisibility';
import { DashboardSection } from './DashboardSection';

interface LazySectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  placeholderHeight?: number;
}

export const LazySection: React.FC<LazySectionProps> = ({
  title,
  description,
  children,
  className,
  placeholderHeight = 400,
}) => {
  const { ref, isVisible } = useVisibility({ rootMargin: '300px' });

  return (
    <div ref={ref}>
      {isVisible ? (
        <DashboardSection
          title={title}
          description={description}
          className={className}
        >
          {children}
        </DashboardSection>
      ) : (
        <div style={{ height: placeholderHeight }} />
      )}
    </div>
  );
};
