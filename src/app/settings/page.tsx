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
          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <UpdateProfileForm />
            </div>
          </div>
        </DashboardContent>
      </DashboardLayout>
    </ProtectedLayout>
  );
}
