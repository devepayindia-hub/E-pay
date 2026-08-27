'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'cmoData_v1';

const defaultData = () => ({
    user: { name: 'Maya Kapoor', role: 'CMO', email: 'maya.kapoor@enterprise.com', authorityTier: 'Tier-1 Executive Authority' },
    marketingHealthScore: 89.7,
    kpis: {
      leads: { current: 4820, target: 4500, pct: '107.1%', trend: '+12.4%' },
      conversion: { current: '18.6%', target: '17.5%', status: 'Exceeded' },
      spend: { current: '₹2,85,00,000', budget: '₹3,12,00,000', util: '91.2%' },
      roi: { current: '4.2x', target: '3.8x', revenue: '₹11.9Cr' },
      traffic: { current: '1,28,000', visitors: '94,000', bounce: '34.2%' },
      cac: { current: '₹6,800', avg: '₹8,200', status: 'Efficient' }
    },
    campaigns: [
      { id: 1, name: 'Q3 Brand Awareness', channel: 'Multi-channel', start: '2025-07-01', end: '2025-09-30', budget: '₹2.50Cr', spent: '₹1.80Cr', status: 'Active', roi: '4.2x' },
      { id: 2, name: 'Product Launch 2025', channel: 'Paid Search', start: '2025-08-15', end: '2025-10-15', budget: '₹1.80Cr', spent: '₹1.20Cr', status: 'Active', roi: '5.1x' },
      { id: 3, name: 'Retargeting Wave', channel: 'Display', start: '2025-09-01', end: '2025-11-30', budget: '₹1.00Cr', spent: '₹0.45Cr', status: 'Mid', roi: '2.8x' },
      { id: 4, name: 'Influencer Collab', channel: 'Social', start: '2025-08-01', end: '2025-09-15', budget: '₹0.80Cr', spent: '₹0.80Cr', status: 'Completed', roi: '6.3x' }
    ],
    approvals: [
      { id: 'CMP-SOC-101', name: 'Campaign Budget Override - Social', amount: 12000000, desc: 'Additional spend for influencer partnerships', status: 'Pending' },
      { id: 'INF-PRT-202', name: 'Content Partnership - Top Influencer', amount: 8000000, desc: '6-month contract with macro-influencer', status: 'Pending' }
    ]
});

const CMOOperatingDashboard = () => {
    const [data, setData] = useState(() => loadData());
    const [activeTab, setActiveTab] = useState('dashboard');
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);

    function loadData() {
        try {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const def = defaultData();
                    for (const k in def) {
                        if (!parsed[k]) parsed[k] = def[k];
                    }
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('CMO load reset error', e);
        }
        const def = defaultData();
        if (typeof window !== 'undefined') { saveData(def); }
        return def;
    }

    function saveData(d) {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
            }
        } catch (e) {}
        if (db && typeof window !== 'undefined') {
            const docRef = doc(db, 'tenants', 'default', 'roleData', STORAGE_KEY);
            setDoc(docRef, d).catch(e => console.warn('Firestore sync failed:', e));
        }
    }

    const updateData = useCallback((updater) => {
        setData(prev => {
            const newData = typeof updater === 'function' ? updater(prev) : updater;
            saveData(newData);
            return newData;
        });
    }, []);

    const showToast = useCallback((msg, type = 'success') => {
        setToast({ msg, type });
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    }, []);
    const toastTimer = useRef(null);

    const openModal = useCallback((title, content) => {
        setModal({ title, content });
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);

    const handleApproval = (id, action) => {
        updateData(prev => ({
            ...prev,
            approvals: prev.approvals.filter(a => a.id !== id)
        }));
        showToast(`✅ Approval Request ${id}: ${action}`);
    };

    const handleCreateCampaign = () => {
        openModal(
            '🚀 Create New Marketing Campaign',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Campaign Name</label>
                <input id="cmpName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Festival Special 2026" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Channel</label>
                <select id="cmpChannel" className="w-full border p-2 rounded text-sm mt-1">
                    <option value="Multi-channel">Multi-channel</option>
                    <option value="Paid Search">Paid Search</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Email">Email</option>
                </select>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Budget (₹)</label>
                <input id="cmpBudget" type="number" className="w-full border p-2 rounded text-sm mt-1" placeholder="5000000" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('cmpName').value || 'New Campaign';
                        const channel = document.getElementById('cmpChannel').value;
                        const budgetVal = Number(document.getElementById('cmpBudget').value) || 5000000;
                        const newCmp = {
                            id: Date.now(),
                            name,
                            channel,
                            start: new Date().toISOString().slice(0, 10),
                            end: '2026-12-31',
                            budget: `₹${(budgetVal / 10000000).toFixed(2)}Cr`,
                            spent: '₹0.00Cr',
                            status: 'Active',
                            roi: '0.0x'
                        };
                        updateData(prev => ({ ...prev, campaigns: [newCmp, ...prev.campaigns] }));
                        showToast(`🚀 Campaign "${name}" created & launched!`);
                        closeModal();
                    }} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded text-xs hover:bg-emerald-700">Launch Campaign</button>
                </div>
            </div>
        );
    };

    const renderDashboard = () => (
        <div className="space-y-5">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-emerald-900 text-white p-4 rounded-xl flex justify-between items-center flex-wrap gap-3 shadow-sm border border-emerald-800/40">
                <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">CMO Primary Objective</div>
                    <div className="text-sm font-semibold mt-0.5">Drive revenue growth through brand building, lead generation, and customer engagement.</div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-right">
                    <div className="text-[10px] text-emerald-300">Marketing Health Score</div>
                    <div className="text-xl font-black text-emerald-400">{data.marketingHealthScore} / 100</div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Total Leads (MTD)</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.kpis.leads.current.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{data.kpis.leads.pct} Target ({data.kpis.leads.trend})</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Conversion Rate</div>
                    <div className="text-lg font-black text-emerald-600 mt-1">{data.kpis.conversion.current}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">{data.kpis.conversion.status} (Target {data.kpis.conversion.target})</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Marketing Spend</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.kpis.spend.current}</div>
                    <div className="text-[10px] text-amber-600 font-semibold">{data.kpis.spend.util} Utilized</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Marketing ROI</div>
                    <div className="text-lg font-black text-emerald-600 mt-1">{data.kpis.roi.current}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Revenue: {data.kpis.roi.revenue}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Website Traffic</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.kpis.traffic.current}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Visitors: {data.kpis.traffic.visitors}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">CAC (Acquisition)</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.kpis.cac.current}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{data.kpis.cac.status} vs Industry</div>
                </div>
            </div>

            {/* Campaigns Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-slate-800">📣 Active Marketing Campaigns ({data.campaigns.length})</h3>
                    <button onClick={handleCreateCampaign} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">+ Create Campaign</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-2">Campaign Name</th>
                                <th className="p-2">Channel</th>
                                <th className="p-2">Budget</th>
                                <th className="p-2">Spent</th>
                                <th className="p-2">ROI</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {data.campaigns.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="p-2 font-bold text-slate-900">{c.name}</td>
                                    <td className="p-2">{c.channel}</td>
                                    <td className="p-2">{c.budget}</td>
                                    <td className="p-2">{c.spent}</td>
                                    <td className="p-2 font-bold text-emerald-600">{c.roi}</td>
                                    <td className="p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{c.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">📣</div>
                    <span className="font-bold text-white tracking-tight text-lg">ENTERPRISE <span className="text-emerald-400">CMO</span></span>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-2">Marketing Operations</div>
                    {[
                        ['dashboard', 'CMO Executive Overview', 'fa-chart-pie'],
                        ['campaigns', 'Active Campaigns', 'fa-bullhorn'],
                        ['approvals', 'Approval Queue', 'fa-check-double'],
                        ['channels', 'Channel Performance', 'fa-chart-bar'],
                        ['leads', 'Lead Pipeline & Funnel', 'fa-filter'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="font-bold text-white">{data.user.name}</div>
                    <div className="text-[10px] text-emerald-400">{data.user.role} • Marketing System</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">CMO Marketing Operating System</div>
                    <div className="flex gap-2">
                        <button onClick={() => showToast('📑 Exported CMO Marketing Performance Report')} className="px-3 py-1.5 border border-slate-200 rounded text-xs hover:bg-slate-50">Export Report</button>
                        <button onClick={() => setActiveTab('approvals')} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">Approvals ({data.approvals.length})</button>
                    </div>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'campaigns' && renderDashboard()}
                    {activeTab === 'approvals' && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <h3 className="font-bold text-sm text-slate-800 mb-3">✍️ CMO Approval Queue</h3>
                            {data.approvals.map(a => (
                                <div key={a.id} className="p-3 border rounded-lg flex justify-between items-center text-xs">
                                    <div>
                                        <div className="font-bold text-slate-900">{a.name} <span className="text-emerald-600 font-bold ml-2">₹{(a.amount / 10000000).toFixed(2)}Cr</span></div>
                                        <div className="text-slate-500 text-[11px] mt-0.5">{a.desc}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApproval(a.id, 'Approved')} className="px-3 py-1 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700">Approve</button>
                                        <button onClick={() => handleApproval(a.id, 'Rejected')} className="px-3 py-1 bg-rose-600 text-white font-semibold rounded hover:bg-rose-700">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {['channels', 'leads'].includes(activeTab) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeTab} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live analytics active.</p>
                        </div>
                    )}
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                    {toast.msg}
                </div>
            )}

            {modal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="font-bold text-base text-slate-800">{modal.title}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
                        </div>
                        {modal.content}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CMOOperatingDashboard;
