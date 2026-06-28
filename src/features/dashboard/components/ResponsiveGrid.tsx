import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}

export const ResponsiveGrid = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = '6',
  className = '',
}: ResponsiveGridProps) => {
  const getGridClasses = () => {
    let classes = `grid gap-${gap} `;
    if (columns.sm) classes += `grid-cols-${columns.sm} `;
    if (columns.md) classes += `md:grid-cols-${columns.md} `;
    if (columns.lg) classes += `lg:grid-cols-${columns.lg} `;
    if (columns.xl) classes += `xl:grid-cols-${columns.xl} `;
    return classes.trim();
  };

  return <div className={`${getGridClasses()} ${className}`}>{children}</div>;
};
