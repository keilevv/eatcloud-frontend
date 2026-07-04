'use client';

import { ProtectedLayout } from '@/features/auth/components/ProtectedLayout';
import { DashboardLayout } from '@/features/dashboard/layouts/DashboardLayout';
import { DashboardContent } from '@/features/dashboard/layouts/DashboardContent';

import { UpdateProfileForm } from '@/features/settings/components/UpdateProfileForm';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export default function SettingsPage() {
  return (
    <ProtectedLayout>
      <DashboardLayout>
        <DashboardContent>
          <UpdateProfileForm />

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Configuración de Tema</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Elige tu apariencia preferida para la plataforma.
            </p>
            <ThemeToggle />
          </div>
        </DashboardContent>
      </DashboardLayout>
    </ProtectedLayout>
  );
}
