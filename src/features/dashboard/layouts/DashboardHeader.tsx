'use client';

import { useState } from 'react';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { UserMenu } from '@/features/auth/components/UserMenu';
import logo from '../../../assets/icn-eatcloud.png';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    current: true,
  },
];

export const DashboardHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-primary flex items-center gap-2 text-xl font-bold"
        >
          <img src={logo.src} alt="EatCloud" className="h-8" />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                aria-current={item.current ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        <UserMenu />
      </div>

      {mobileMenuOpen && (
        <div className="bg-background absolute top-16 right-0 left-0 border-b md:hidden">
          <nav className="flex flex-col space-y-2 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
