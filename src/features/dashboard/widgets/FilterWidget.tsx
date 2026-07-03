'use client';

import { Check } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface FilterOption {
  label: string;
  value: string;
  count: number;
  selected: boolean;
}

interface FilterWidgetProps {
  title: string;
  subtitle: string;
  options: FilterOption[];
  onToggle: (value: string) => void;
}

export const FilterWidget: React.FC<FilterWidgetProps> = ({
  title,
  subtitle,
  options,
  onToggle,
}) => {
  return (
    <Card className="p-4">
      <div className="mb-3">
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={option.selected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggle(option.value)}
            className="relative"
          >
            {option.label}
            <span className="ml-2 text-xs opacity-70">
              ({option.count})
            </span>
            {option.selected && (
              <Check className="absolute -top-1 -right-1 h-3 w-3 bg-primary text-primary-foreground rounded-full p-0.5" />
            )}
          </Button>
        ))}
      </div>
    </Card>
  );
};
