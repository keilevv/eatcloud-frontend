import React from 'react';

export const ScrollableContainer = ({
  children,
  className = '',
  height = '400px',
}: {
  children: React.ReactNode;
  className?: string;
  height?: string;
}) => {
  return (
    <div className={`overflow-auto ${className}`} style={{ maxHeight: height }}>
      {children}
    </div>
  );
};
