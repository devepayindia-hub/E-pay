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

  const isCeo = role === 'ceo' || pathname === '/ceo' || (pathname && pathname.startsWith('/ceo'));

  const closeMobileSidebar = () => {
    if (typeof document !== 'undefined') {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.remove('open');
      }
    }
  };

  return (
    <aside
      style={{ position: 'relative', zIndex: 30, ...(isCeo ? { backgroundColor: '#047857', color: '#ffffff' } : {}) }}
      className={`sidebar w-64 shrink-0 min-h-screen flex flex-col justify-between p-4 transition-all duration-300 ${
        isCeo
          ? 'bg-[#047857] border-r border-emerald-600 text-white shadow-2xl shadow-emerald-950/50'
          : 'bg-slate-900 border-r border-slate-800 text-slate-300'
      }`}
    >
      <div>
        <div
          className={`flex items-center gap-3 px-3 py-4 mb-6 border-b ${
            isCeo ? 'border-emerald-700/50' : 'border-slate-800'
          }`}
        >
          <img src="/assets/images/logo.png" alt="ePay Logo" className="h-9 w-auto object-contain" />
          <div>
            <h1 className="font-bold text-white tracking-wide text-base leading-tight">ePay CRM</h1>
            <span
              className={`text-xs font-semibold tracking-wider uppercase ${
                isCeo ? 'text-emerald-300 font-bold' : 'text-emerald-400'
              }`}
            >
              {isCeo ? 'CEO Executive Hub' : 'Enterprise v2'}
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          <div
            className={`px-3 pb-2 text-[11px] font-bold uppercase tracking-wider ${
              isCeo ? 'text-emerald-400/90' : 'text-slate-500'
            }`}
          >
            Portal Navigation
          </div>
          {navItems.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={closeMobileSidebar}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? isCeo
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 font-bold'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : isCeo
                    ? 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : isCeo ? 'text-emerald-300/80' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`pt-4 border-t space-y-3 ${isCeo ? 'border-emerald-700/50' : 'border-slate-800'}`}>
        <div
          className={`px-3 py-2 rounded-lg flex items-center justify-between border ${
            isCeo
              ? 'bg-emerald-900/60 border-emerald-600/60 text-emerald-200'
              : 'bg-slate-800/40 border-slate-800'
          }`}
        >
          <div className="truncate">
            <p className={`text-xs ${isCeo ? 'text-emerald-300/80 font-medium' : 'text-slate-400'}`}>
              Current Role
            </p>
            <p
              className={`text-xs font-extrabold uppercase tracking-wide truncate ${
                isCeo ? 'text-emerald-200' : 'text-emerald-400'
              }`}
            >
              {role ? role.replace(/-/g, ' ') : 'AUTHORIZED'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
            isCeo
              ? 'bg-emerald-900/50 hover:bg-rose-500/20 text-emerald-200 hover:text-rose-300 border-emerald-700/60 hover:border-rose-500/40'
              : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'
          }`}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
