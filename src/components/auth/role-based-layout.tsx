
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';

interface RoleBasedLayoutProps {
  children: React.ReactNode;
  allowedRole: 'admin' | 'vendor' | 'user';
}

export default function RoleBasedLayout({ children, allowedRole }: RoleBasedLayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!session) {
      // Not logged in, redirect to home
      router.replace('/');
      return;
    }

    if (session.user.role !== allowedRole) {
      // Not authorized for this role, redirect to home
      router.replace('/');
    }
  }, [session, status, router, allowedRole]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== allowedRole) {
    // Render nothing while redirecting
    return null;
  }

  return <>{children}</>;
}
