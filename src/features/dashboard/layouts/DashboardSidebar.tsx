'use client';

import { LayoutDashboard, BarChart3, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

import { useLogout } from '@/features/auth/hooks/useLogout';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    current: true,
  },
  { name: 'Analytics', href: '#', icon: BarChart3, current: false },
  { name: 'Settings', href: '#', icon: Settings, current: false },
];

export const DashboardSidebar = () => {
  const { logout } = useLogout();

  return (
    <aside className="bg-background hidden w-64 flex-col border-r md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/"
          className="text-primary flex items-center gap-2 text-xl font-bold"
        >
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            EC
          </div>
          EatCloud
        </Link>
      </div>
      <div className="flex flex-1 flex-col justify-between py-4">
        <nav className="space-y-1 px-3">
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
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="px-3">
          <button
            onClick={logout}
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
