'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { SessionLoading } from '@/features/auth/components/Loading';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useSession } from '@/features/auth/hooks/useSession';

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return <SessionLoading />;
  }

  return (
    <div className="bg-muted/40 flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
