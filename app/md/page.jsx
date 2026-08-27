'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'mdData_v1';

const defaultData = () => ({
    user: { name: 'Managing Director', role: 'Managing Director' },
    businessHealth: 92,
    metrics: {
        totalRevenue: '₹2.84 Cr',
        revenueGrowth: '+18% YoY',
        netProfit: '₹92 L',
        profitMargin: '32.4%',
        salesTarget: '₹3.2 Cr',
        targetAchievement: '88.8%',
        activeCustomers: 4820,
        newCustomers: 312,
        leadPipeline: '₹4.2 Cr',
        conversionRate: '18.4%',
        totalEmployees: 248,
        productivity: '91%',
        totalExpenses: '₹1.92 Cr',
        budgetUtilization: '78%',
        receivables: '₹12.4 L',
        payables: '₹8.7 L',
        pendingApprovals: 7,
        criticalAlerts: 2
    },
    deptHealth: [
        { dept: 'Finance', health: 94 },
        { font: 'Sales', health: 91 },
        { dept: 'CRM', health: 88 },
        { dept: 'Marketing', health: 86 },
        { dept: 'Operations', health: 92 },
        { dept: 'HR', health: 90 },
        { dept: 'Technology', health: 95 },
        { dept: 'Customer Support', health: 89 },
        { dept: 'Gallery Network', health: 93 },
    ],
    approvals: [
        { id: 1, req: 'Major Marketing Campaign Budget (₹12 L)', by: 'CMO', dept: 'Marketing', status: 'Pending' },
        { id: 2, req: 'New Gallery Expansion — Surat (₹18 L CapEx)', by: 'CGO', dept: 'Operations', status: 'Pending' },
        { id: 3, req: 'Executive Appointment — State Director', by: 'HR Head', dept: 'HR', status: 'Pending' },
        { id: 4, req: 'Large Discount Exception (>30%)', by: 'Sales Head', dept: 'Sales', status: 'Pending' },
    ],
    alerts: [
        { id: 1, level: 'critical', msg: 'Cash-flow projected to fall below minimum threshold in 18 days if receivables not collected.' },
        { id: 2, level: 'high', msg: 'Maharashtra is 17% below sales target (₹42L vs ₹50.5L).' },
        { id: 3, level: 'warning', msg: 'Marketing budget utilization reached 85% (₹1.28 Cr of ₹1.5 Cr).' },
    ]
});

const ManagingDirectorPage = () => {
    const [data, setData] = useState(() => loadData());
    const [activeTab, setActiveTab] = useState('md-command');
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
            console.warn('MD load reset error', e);
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
        showToast(`✅ Request #${id} ${action} by Managing Director!`);
    };

    const handleNewDecision = () => {
        openModal(
            '⚖️ Log Executive Decision',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Decision Title *</label>
                <input id="decTitle" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Expand Marketing Budget by ₹10L" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Executive Owner</label>
                <select id="decOwner" className="w-full border p-2 rounded text-sm mt-1">
                    <option value="CMO">CMO</option>
                    <option value="CFO">CFO</option>
                    <option value="CGO">CGO</option>
                    <option value="CTO">CTO</option>
                </select>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Expected Financial Impact</label>
                <input id="decImpact" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. +₹45L Revenue" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const title = document.getElementById('decTitle').value || 'Executive Decision';
                        showToast(`⚖️ Decision logged: "${title}"`);
                        closeModal();
                    }} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded text-xs hover:bg-indigo-700">Log Decision</button>
                </div>
            </div>
        );
    };

    const renderCommandCenter = () => (
        <div className="space-y-6">
            {/* Executive Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-xl border border-indigo-700/40 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="text-xs uppercase font-bold text-indigo-300 tracking-wider">Managing Director • Executive Command Center</div>
                        <div className="text-2xl font-black mt-1">Overall Business Health <span className="text-indigo-300">{data.businessHealth}%</span></div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                        <div>FY 2026-27 • Company-Wide Control Tower</div>
                        <div className="text-indigo-300 mt-1 font-semibold">Reports-Driven • Decision-Focused</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-xs">
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Revenue Growth</div><div className="text-lg font-bold text-emerald-400">94%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Profitability</div><div className="text-lg font-bold text-emerald-400">91%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Sales Performance</div><div className="text-lg font-bold text-emerald-400">93%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Operations</div><div className="text-lg font-bold text-emerald-400">92%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Technology</div><div className="text-lg font-bold text-emerald-400">95%</div></div>
                </div>
            </div>

            {/* KPI Control Tower */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div onClick={() => setActiveTab('md-finance')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Total Revenue</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.totalRevenue}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{data.metrics.revenueGrowth}</div>
                </div>
                <div onClick={() => setActiveTab('md-finance')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Net Profit</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.netProfit}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Margin {data.metrics.profitMargin}</div>
                </div>
                <div onClick={() => setActiveTab('md-sales')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Sales Target</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.salesTarget}</div>
                    <div className="text-[10px] text-indigo-600 font-semibold">Achieved {data.metrics.targetAchievement}</div>
                </div>
                <div onClick={() => setActiveTab('md-customers')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Active Customers</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.activeCustomers}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">+{data.metrics.newCustomers} new</div>
                </div>
                <div onClick={() => setActiveTab('md-workforce')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Total Employees</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.totalEmployees}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Productivity {data.metrics.productivity}</div>
                </div>
                <div onClick={() => setActiveTab('md-approvals')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">MD Approvals</div>
                    <div className="text-xl font-black text-indigo-600 mt-1">{data.approvals.length}</div>
                    <div className="text-[10px] text-indigo-600 font-semibold">Pending Authority</div>
                </div>
            </div>

            {/* Department Health Overview */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-sm text-slate-800 mb-3">🏬 Department Health Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {data.deptHealth.map(dh => (
                        <div key={dh.dept || dh.font} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-800">{dh.dept || dh.font}</span>
                            <span className="font-black text-emerald-600">{dh.health}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg">MD</div>
                    <div>
                        <div className="font-bold text-white text-base">Managing <span className="text-indigo-400">Director</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Executive Command</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['md-command', 'Executive Command', 'fa-tachometer-alt'],
                        ['md-finance', 'Financial Control', 'fa-coins'],
                        ['md-sales', 'Sales Control', 'fa-chart-line'],
                        ['md-approvals', 'MD Approvals', 'fa-check-double'],
                        ['md-decisions', 'Decision Center', 'fa-gavel'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Managing Director Executive Portal</div>
                    <button onClick={handleNewDecision} className="px-3.5 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700">⚖️ Log Decision</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'md-command' && renderCommandCenter()}
                    {activeTab === 'md-approvals' && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <h3 className="font-bold text-sm text-slate-800 mb-3">✍️ Managing Director Approval Queue</h3>
                            {data.approvals.map(a => (
                                <div key={a.id} className="p-3 border rounded-lg flex justify-between items-center text-xs">
                                    <div><strong>{a.req}</strong> ({a.dept}) by {a.by}</div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApproval(a.id, 'Approved')} className="px-3 py-1 bg-indigo-600 text-white rounded font-semibold">Approve</button>
                                        <button onClick={() => handleApproval(a.id, 'Rejected')} className="px-3 py-1 bg-rose-600 text-white rounded font-semibold">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {['md-finance', 'md-sales', 'md-decisions'].includes(activeTab) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeTab} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live executive command data active.</p>
                        </div>
                    )}
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-indigo-600'}`}>
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

export default ManagingDirectorPage;
