'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ALL_ROLES, ROLE_REDIRECTS } from '@/lib/rbac';
import { Loader2 } from 'lucide-react';

const PUBLIC_PATHS = ['/login', '/', '/_not-found'];

export default function RouteGuard({ children }) {
  const { user, role, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if the current route is public
    const isPublic = PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api/');

    if (!isPublic) {
      // 1. If not logged in, redirect to login page immediately
      if (!user) {
        router.push('/login');
        return;
      }

      // 2. Extract first path segment (e.g., 'superadmin', 'devhub', 'cmd', 'hr')
      const segment = pathname.split('/')[1];

      // Get set of all registered role IDs
      const validRoles = new Set(ALL_ROLES.map(r => r.id));

      if (validRoles.has(segment)) {
        const cleanUserRole = (role || user.role || '').toLowerCase();

        // Super Admin has master clearance to view any dashboard
        if (cleanUserRole === 'superadmin' || cleanUserRole === 'super-admin') {
          return;
        }

        // If the user's role does not match this dashboard workspace, redirect to their proper portal
        if (cleanUserRole !== segment) {
          const targetDashboard = ROLE_REDIRECTS[cleanUserRole] || '/login';
          router.push(targetDashboard);
        }
      }
    }
  }, [user, role, isLoading, pathname, router]);

  // Render a loading state during initialization or redirect phase
  const isPublic = PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api/');
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-100">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-xs font-semibold tracking-wide text-slate-400">Loading secure environment...</p>
      </div>
    );
  }

  if (!isPublic && !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-100">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-xs font-semibold tracking-wide text-slate-400">Verifying session credentials...</p>
      </div>
    );
  }

  return children;
}
