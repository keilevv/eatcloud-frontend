'use client';

import { Menu, Bell } from 'lucide-react';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/features/auth/components/UserMenu';

export const DashboardHeader = () => {
  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger could go here */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="text-muted-foreground hidden text-sm font-medium md:flex">
          {/* Breadcrumb placeholder */}
          Dashboard / Overview
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
