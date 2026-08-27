'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import { Building, Store, MapPin, Award, Plus } from 'lucide-react';

export default function FranchisePage() {
  const franchises = [
    ['FRN-701', 'North Mumbai Gallery Hub', 'Mumbai, MH', '42 Merchants', '₹18.4 Lakhs', <span key="1" className="text-emerald-400 font-semibold">Tier 1 Partner</span>],
    ['FRN-702', 'Bengaluru Tech Corridor', 'Bengaluru, KA', '68 Merchants', '₹24.8 Lakhs', <span key="2" className="text-emerald-400 font-semibold">Tier 1 Partner</span>],
    ['FRN-703', 'Delhi Connaught Outlet', 'New Delhi, DL', '55 Merchants', '₹21.0 Lakhs', <span key="3" className="text-emerald-400 font-semibold">Tier 1 Partner</span>],
    ['FRN-704', 'Pune City Station', 'Pune, MH', '29 Merchants', '₹11.2 Lakhs', <span key="4" className="text-blue-400 font-semibold">Tier 2 Partner</span>],
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-8 flex-1 space-y-8 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Building className="w-6 h-6 text-violet-400" />
                <span>Franchise Network Management</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">Manage regional franchise partners, gallery owners, commissions, and outlet performance</p>
            </div>
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-violet-600/20 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Register New Franchise</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard title="Active Outlets" value="128 Locations" change="24 Cities" isPositive={true} icon={Store} color="purple" />
            <StatCard title="Total Merchants Onboarded" value="4,820 Merchants" change="+12% MoM" isPositive={true} icon={MapPin} color="blue" />
            <StatCard title="Franchise Royalty Disbursed" value="₹42.5 Lakhs" change="This Month" isPositive={true} icon={Award} color="emerald" />
          </div>

          <DataTable
            title="Franchise Outlet & Royalty Directory"
            headers={['Franchise ID', 'Outlet Name', 'City / Territory', 'Active Merchants', 'Monthly Revenue', 'Status Tier']}
            rows={franchises}
          />
        </main>
      </div>
    </div>
  );
}
