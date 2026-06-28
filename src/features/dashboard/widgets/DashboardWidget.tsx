import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface DashboardWidgetProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
  contentClassName?: string;
}

export const DashboardWidget = ({
  title,
  description,
  children,
  className = '',
  headerRight,
  contentClassName = '',
}: DashboardWidgetProps) => {
  return (
    <Card className={`flex h-full flex-col ${className}`}>
      {(title || description || headerRight) && (
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            {title && (
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
            )}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerRight && <div>{headerRight}</div>}
        </CardHeader>
      )}
      <CardContent className={`flex-1 ${contentClassName}`}>
        {children}
      </CardContent>
    </Card>
  );
};
