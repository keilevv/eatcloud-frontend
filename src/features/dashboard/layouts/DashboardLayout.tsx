import React from 'react';

import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <DashboardHeader />
      <main className="bg-muted/20 flex-1 overflow-auto">{children}</main>
    </div>
  );
};
