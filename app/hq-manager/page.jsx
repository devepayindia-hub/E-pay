'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'hqManagerData_v1';

const defaultData = () => ({
    user: { name: 'Anand', role: 'HQ Manager' },
    hq: { name: 'HQ North', region: 'North' },
    metrics: {
        assignedHQ: 'HQ North',
        galleries: 4,
        teamMembers: 8,
        present: 7,
        absent: 1,
        todayRevenue: '₹4.5L',
        monthlyRevenue: '₹23.5L',
        target: '₹26.0L',
        achievement: '90%',
        newCustomers: 45,
        newLeads: 75,
        todayVisits: 125,
        collections: '₹20.6L',
        outstanding: '₹2.9L',
        pendingTasks: 4,
        criticalIssues: 1
    },
    districts: [
        { id: 1, name: 'District A', manager: 'Ravi', galleries: 4, employees: 22, revenue: '₹25.0L', target: '₹28.0L', achievement: '89%', performance: 85 },
        { id: 2, name: 'District B', manager: 'Sita', galleries: 3, employees: 18, revenue: '₹18.0L', target: '₹20.0L', achievement: '90%', performance: 88 },
    ],
    galleries: [
        { id: 1, name: 'Gallery Alpha', manager: 'Rajesh', staff: 8, present: 7, revenue: '₹6.0L', target: '₹7.0L', achievement: '86%', customers: 85, leads: 18, complaints: 2, performance: 84 },
        { id: 2, name: 'Gallery Beta', manager: 'Sneha', staff: 7, present: 6, revenue: '₹7.0L', target: '₹7.5L', achievement: '93%', customers: 95, leads: 22, complaints: 1, performance: 91 },
        { id: 3, name: 'Gallery Gamma', manager: 'Amit', staff: 6, present: 5, revenue: '₹5.0L', target: '₹5.5L', achievement: '91%', customers: 75, leads: 15, complaints: 0, performance: 88 },
        { id: 4, name: 'Gallery Delta', manager: 'Priya', staff: 7, present: 6, revenue: '₹5.5L', target: '₹6.0L', achievement: '92%', customers: 80, leads: 20, complaints: 1, performance: 90 },
    ],
    employees: [
        { id: 1, name: 'Rajesh', role: 'Gallery Manager', present: true, tasks: 5, revenue: '₹6.0L' },
        { id: 2, name: 'Sneha', role: 'Gallery Manager', present: true, tasks: 4, revenue: '₹7.0L' },
        { id: 3, name: 'Amit', role: 'Gallery Manager', present: false, tasks: 3, revenue: '₹5.0L' },
        { id: 4, name: 'Priya', role: 'Gallery Manager', present: true, tasks: 6, revenue: '₹5.5L' },
        { id: 5, name: 'Suresh', role: 'BDE', present: true, tasks: 8, revenue: '—' },
        { id: 6, name: 'Meena', role: 'BDO', present: true, tasks: 6, revenue: '—' },
    ]
});

const HQManagerPage = () => {
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
            console.warn('HQ Manager load reset error', e);
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

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 rounded-xl border border-emerald-700/40 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="text-xs uppercase font-bold text-emerald-300 tracking-wider">HQ Manager • {data.hq.name}</div>
                        <div className="text-2xl font-black mt-1">Target Achievement <span className="text-emerald-300">{data.metrics.achievement}</span></div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                        <div>Galleries: {data.metrics.galleries} • Team: {data.metrics.teamMembers}</div>
                        <div className="text-emerald-300 mt-1 font-semibold">Monthly Revenue: {data.metrics.monthlyRevenue}</div>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Galleries</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.galleries}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Team Members</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.teamMembers}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{data.metrics.present} Present</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Today's Rev</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.todayRevenue}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Monthly Rev</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.monthlyRevenue}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Collections</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.collections}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Outstanding</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.outstanding}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Field Visits</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.todayVisits}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Pending Tasks</div>
                    <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.pendingTasks}</div>
                </div>
            </div>

            {/* Districts Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-slate-800">🏛️ Assigned Districts ({data.districts.length})</h3>
                    <button onClick={() => showToast('🔄 Syncing HQ Manager data...')} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">Sync</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-2.5">District</th>
                                <th className="p-2.5">Manager</th>
                                <th className="p-2.5">Galleries</th>
                                <th className="p-2.5">Revenue</th>
                                <th className="p-2.5">Target</th>
                                <th className="p-2.5">Achievement</th>
                                <th className="p-2.5">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {data.districts.map(d => (
                                <tr key={d.id} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-slate-900">{d.name}</td>
                                    <td className="p-2.5">{d.manager}</td>
                                    <td className="p-2.5">{d.galleries}</td>
                                    <td className="p-2.5 font-bold text-emerald-600">{d.revenue}</td>
                                    <td className="p-2.5 text-slate-500">{d.target}</td>
                                    <td className="p-2.5 font-bold">{d.achievement}</td>
                                    <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{d.performance}%</span></td>
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
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">HQ</div>
                    <div>
                        <div className="font-bold text-white text-base">HQ <span className="text-emerald-400">Manager</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">{data.hq.name}</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Overview Dashboard', 'fa-house'],
                        ['districts', 'Districts', 'fa-layer-group'],
                        ['galleries', 'Galleries', 'fa-images'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="font-bold text-white">{data.user.name}</div>
                    <div className="text-[10px] text-emerald-400">{data.user.role}</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">HQ Manager Operations Portal</div>
                    <button onClick={() => showToast('🔄 Refreshing HQ Manager portal...')} className="px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">Sync</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {['districts', 'galleries'].includes(activeTab) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeTab} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live HQ manager data active.</p>
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

export default HQManagerPage;
