'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-emerald-500/30 animate-pulse">
          eP
        </div>
        <div className="absolute -inset-2 rounded-3xl border-2 border-emerald-500/20 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-slate-300 mt-6 tracking-wide">Loading ePay Workspace...</p>
      <p className="text-xs text-slate-500 mt-1">Securing enterprise session</p>
    </div>
  );
}
