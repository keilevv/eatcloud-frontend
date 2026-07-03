'use client';

import { ProtectedLayout } from '@/features/auth/components/ProtectedLayout';
import { DashboardLayout } from '@/features/dashboard/layouts/DashboardLayout';
import { DashboardContent } from '@/features/dashboard/layouts/DashboardContent';

import { UpdateProfileForm } from '@/features/settings/components/UpdateProfileForm';

export default function SettingsPage() {
  return (
    <ProtectedLayout>
      <DashboardLayout>
        <DashboardContent>
          <UpdateProfileForm />
        </DashboardContent>
      </DashboardLayout>
    </ProtectedLayout>
  );
}
