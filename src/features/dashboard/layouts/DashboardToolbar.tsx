import React from 'react';

export const DashboardToolbar = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-background flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 md:px-6">
      {children}
    </div>
  );
};
