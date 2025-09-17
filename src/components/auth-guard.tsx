"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import type { Role } from '@/lib/data';

export default function AuthGuard({ children, requiredRole }: { children: React.ReactNode, requiredRole?: Role }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user === undefined) return; 

    if (!user) {
      router.push('/');
      return;
    }
    
    if (requiredRole && user.role !== requiredRole) {
      router.push(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }

  }, [user, router, requiredRole, pathname]);

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
