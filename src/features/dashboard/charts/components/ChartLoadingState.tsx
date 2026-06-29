import { Loader2 } from 'lucide-react';
import React from 'react';

export const ChartLoadingState: React.FC = () => {
  return (
    <div className="bg-muted/10 absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-lg backdrop-blur-[1px]">
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading chart data...</span>
      </div>
    </div>
  );
};
