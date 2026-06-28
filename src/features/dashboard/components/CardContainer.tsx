import React from 'react';

import { Card } from '@/components/ui/card';

export const CardContainer = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <Card className={`p-4 ${className}`}>{children}</Card>;
};
