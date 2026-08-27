'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'gm_dashboard_data_v2';

const defaultData = () => ({
    user: { name: 'General Manager', role: 'GM — Operations' },
    metrics: {
        totalGalleries: 6,
        activeGalleries: 6,
        todaySales: '₹4.8L',
        monthlySales: '₹2.8 Cr',
        targetSales: '₹3.2 Cr',
        achievement: '87.5%',
        customers: 18520,
        inventory: '₹1.75 Cr',
        expenses: '₹2.8 Cr',
        employees: 142,
        present: 130,
        pendingComplaints: 5,
        openTasks: 12,
        avgHealth: 94
    },
    galleries: [
        { id: 1, name: 'Pune Central', city: 'Pune', manager: 'Anita Desai', employees: 18, health: 96, sales: '₹42 L', target: '₹40 L', ach: '105%', profit: '₹8.4 L' },
        { id: 2, name: 'Pune East', city: 'Pune', manager: 'Vikram Singh', employees: 14, health: 87, sales: '₹31 L', target: '₹35 L', ach: '88%', profit: '₹5.5 L' },
        { id: 3, name: 'Pune West', city: 'Pune', manager: 'Priya Mehta', employees: 16, health: 91, sales: '₹28 L', target: '₹30 L', ach: '93%', profit: '₹5.0 L' },
        { id: 4, name: 'Pimpri', city: 'Pune', manager: 'Rahul Sharma', employees: 12, health: 94, sales: '₹26 L', target: '₹27 L', ach: '96%', profit: '₹5.2 L' },
        { id: 5, name: 'Hinjewadi', city: 'Pune', manager: 'Neha Patil', employees: 15, health: 89, sales: '₹22 L', target: '₹25 L', ach: '88%', profit: '₹3.9 L' },
        { id: 6, name: 'Kothrud', city: 'Pune', manager: 'Deepak Joshi', employees: 13, health: 92, sales: '₹24 L', target: '₹26 L', ach: '92%', profit: '₹4.3 L' },
    ],
    approvals: [
        { id: 1, type: 'Stock Transfer', gallery: 'Pune Central', by: 'Anita Desai', amount: '₹2.5L', status: 'Pending' },
        { id: 2, type: 'Expense Approval', gallery: 'Pune East', by: 'Vikram Singh', amount: '₹55,000', status: 'Pending' },
        { id: 3, type: 'Purchase Request', gallery: 'Pune West', by: 'Priya Mehta', amount: '₹1.2L', status: 'Pending' },
    ]
});

const GeneralManagerOpsPage = () => {
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
            console.warn('GM Ops load reset error', e);
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
        showToast(`✅ Approval #${id} ${action}!`);
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 rounded-xl border border-teal-700/40 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="text-xs uppercase font-bold text-teal-300 tracking-wider">{data.user.role}</div>
                        <div className="text-2xl font-black mt-1">Regional Gallery Health <span className="text-teal-300">{data.metrics.avgHealth}%</span></div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                        <div>Assigned Galleries: {data.metrics.totalGalleries} ({data.metrics.activeGalleries} Active)</div>
                        <div className="text-teal-300 mt-1 font-semibold">Total Employees: {data.metrics.employees} ({data.metrics.present} Present)</div>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Today's Sales</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.todaySales}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Monthly Sales</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.monthlySales}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Target {data.metrics.targetSales}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Achievement</div>
                    <div className="text-xl font-black text-teal-600 mt-1">{data.metrics.achievement}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Total Customers</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.customers.toLocaleString()}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Inventory Value</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.inventory}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">GM Approvals</div>
                    <div className="text-xl font-black text-teal-600 mt-1">{data.approvals.length}</div>
                </div>
            </div>

            {/* Regional Galleries Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-slate-800">🏬 Regional Galleries ({data.galleries.length})</h3>
                    <button onClick={() => showToast('🔄 Refreshing gallery statuses...')} className="px-3 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700">Refresh Data</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-2.5">Gallery</th>
                                <th className="p-2.5">Manager</th>
                                <th className="p-2.5">Sales</th>
                                <th className="p-2.5">Target</th>
                                <th className="p-2.5">Ach %</th>
                                <th className="p-2.5">Profit</th>
                                <th className="p-2.5">Health</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {data.galleries.map(g => (
                                <tr key={g.id} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-slate-900">{g.name}</td>
                                    <td className="p-2.5">{g.manager}</td>
                                    <td className="p-2.5 font-bold text-emerald-600">{g.sales}</td>
                                    <td className="p-2.5 text-slate-500">{g.target}</td>
                                    <td className="p-2.5 font-bold">{g.ach}</td>
                                    <td className="p-2.5">{g.profit}</td>
                                    <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">{g.health}%</span></td>
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
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-lg">GM</div>
                    <div>
                        <div className="font-bold text-white text-base">General <span className="text-teal-400">Manager</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Operations Command</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'GM Command', 'fa-house'],
                        ['galleries', 'My Galleries', 'fa-building'],
                        ['approvals', 'Approval Center', 'fa-check-double'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="font-bold text-white">{data.user.name}</div>
                    <div className="text-[10px] text-teal-400">{data.user.role}</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">General Manager Operations Portal</div>
                    <button onClick={() => showToast('🔄 Syncing GM operations...')} className="px-3.5 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700">Sync</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'galleries' && renderDashboard()}
                    {activeTab === 'approvals' && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <h3 className="font-bold text-sm text-slate-800 mb-3">✍️ General Manager Approvals Queue</h3>
                            {data.approvals.map(a => (
                                <div key={a.id} className="p-3 border rounded-lg flex justify-between items-center text-xs">
                                    <div><strong>{a.type}</strong> ({a.gallery}) — {a.amount} by {a.by}</div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApproval(a.id, 'Approved')} className="px-3 py-1 bg-teal-600 text-white rounded font-semibold">Approve</button>
                                        <button onClick={() => handleApproval(a.id, 'Rejected')} className="px-3 py-1 bg-rose-600 text-white rounded font-semibold">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-teal-600'}`}>
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

export default GeneralManagerOpsPage;
