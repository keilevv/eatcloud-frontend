'use client';

import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useLogout } from '@/features/auth/hooks/useLogout';

export default function LogoutPage() {
  const { logout } = useLogout();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground text-sm">
        Are you sure you want to log out?
      </p>
      <Button
        onClick={logout}
        variant="destructive"
        className="flex cursor-pointer items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </Button>
    </div>
  );
}
