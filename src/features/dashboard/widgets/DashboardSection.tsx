import React from 'react';

import { SectionTitle } from './SectionTitle';

interface DashboardSectionProps {
  title: string;
  description?: string;
  filters?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DashboardSection = ({
  title,
  description,
  filters,
  children,
  className = '',
}: DashboardSectionProps) => {
  return (
    <section className={`mb-10 ${className}`}>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <SectionTitle title={title} description={description} />
        {filters && <div className="flex-shrink-0">{filters}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
};
