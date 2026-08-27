'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getNavItemsForRole } from '@/lib/rbac';
import {
  LayoutDashboard,
  Crown,
  ShieldCheck,
  Users,
  DollarSign,
  PhoneCall,
  Megaphone,
  Headphones,
  Code,
  Building,
  User,
  ChevronRight,
  LogOut,
  TrendingUp,
  Activity,
  Sparkles,
  Globe,
  GraduationCap,
  Store,
  Briefcase,
  Layers,
  Settings,
  Share2,
  BookOpen
} from 'lucide-react';

const ICON_MAP = {
  LayoutDashboard,
  Crown,
  ShieldCheck,
  Users,
  DollarSign,
  PhoneCall,
  Megaphone,
  Headphones,
  Code,
  Building,
  User,
  TrendingUp,
  Activity,
  Sparkles,
  Globe,
  GraduationCap,
  Store,
  Briefcase,
  Layers,
  Settings,
  Share2,
  BookOpen
};

export default function Sidebar() {
  const pathname = usePathname();
  const { role, logout } = useAuth();
  const navItems = getNavItemsForRole(role);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col justify-between p-4 text-slate-300">
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
          <img src="/assets/images/logo.png" alt="ePay Logo" className="h-9 w-auto object-contain" />
          <div>
            <h1 className="font-bold text-white tracking-wide text-base leading-tight">ePay CRM</h1>
            <span className="text-xs text-emerald-400 font-medium tracking-wider uppercase">Enterprise v2</span>
          </div>
        </div>

        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Portal Navigation
          </div>
          {navItems.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs text-slate-400">Current Role</p>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide truncate">{role ? role.replace(/-/g, ' ') : 'AUTHORIZED'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
