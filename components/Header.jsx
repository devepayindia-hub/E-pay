'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ALL_ROLES } from '@/lib/rbac';
import { Bell, Search, ShieldCheck, Crown, UserCheck, Shield, Menu } from 'lucide-react';

export default function Header() {
  const { user, role, setRole } = useAuth();
  const isSuperAdmin = role === 'superadmin' || role === 'super-admin';

  const toggleMobileSidebar = () => {
    if (typeof document !== 'undefined') {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.toggle('open');
      }
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input & Mobile Toggle */}
      <div className="flex items-center gap-3 w-72 md:w-96">
        <button
          onClick={toggleMobileSidebar}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search leads, operations, employees..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Display / Super Admin Mode */}
        {isSuperAdmin ? (
          <div className="flex items-center gap-2">
            <Link
              href="/superadmin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold hover:bg-purple-500/30 transition-all"
            >
              <Crown className="w-3.5 h-3.5 text-purple-400" />
              <span>User Management</span>
            </Link>

            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-lg">
              <span className="text-[11px] text-slate-400 font-medium">Audit Role:</span>
              <select
                value={role || 'superadmin'}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent text-xs font-semibold text-purple-300 focus:outline-none cursor-pointer"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 font-medium">Role:</span>
            <span className="font-bold text-emerald-400 uppercase tracking-wide">
              {role ? role.replace(/-/g, ' ') : 'AUTHORIZED STAFF'}
            </span>
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </button>

        <div className="h-6 w-px bg-slate-800" />

        {/* User Profile Pill */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600/30 to-teal-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'EP'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-white leading-tight">{user?.name || 'Authorized Staff'}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{user?.email || 'staff@epay.in'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
