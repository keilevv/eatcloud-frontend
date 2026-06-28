import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageTitle = ({ title, description, actions }: PageTitleProps) => {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-center">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
};
