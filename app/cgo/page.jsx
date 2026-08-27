'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'cgoData_v1';

const defaultData = () => ({
    user: { name: 'Chief Gallery Officer', role: 'CGO' },
    overallHealth: 92,
    metrics: {
        totalGalleries: 84,
        activeGalleries: 81,
        newGalleries: 3,
        todaySales: '₹28.5L',
        monthlySales: '₹6.4 Cr',
        monthlyTarget: '₹7.1 Cr',
        achievement: '90%',
        customersToday: 2840,
        activeMembers: 48200,
        inventoryValue: '₹18.4 Cr',
        stockTurnover: '5.8x',
        monthlyExpenses: '₹92 L',
        grossMargin: '31%',
        complaintsTotal: 148,
        complaintsPending: 31,
        employeesTotal: 1240,
        attendanceRate: '94%',
        galleryHealth: '91%'
    },
    galleries: [
        { id: 1, name: 'Pune Central', state: 'Maharashtra', sales: '52 L', target: '50 L', ach: '104%', profit: '14 L', inventory: '82 L', health: 97, status: 'Active' },
        { id: 2, name: 'Mumbai West', state: 'Maharashtra', sales: '48 L', target: '55 L', ach: '87%', profit: '10 L', inventory: '76 L', health: 89, status: 'Active' },
        { id: 3, name: 'Nashik', state: 'Maharashtra', sales: '42 L', target: '40 L', ach: '105%', profit: '12 L', inventory: '64 L', health: 94, status: 'Active' },
        { id: 4, name: 'Bengaluru Central', state: 'Karnataka', sales: '38 L', target: '45 L', ach: '84%', profit: '8 L', inventory: '71 L', health: 81, status: 'Warning' },
        { id: 5, name: 'Hyderabad Central', state: 'Telangana', sales: '35 L', target: '42 L', ach: '83%', profit: '7 L', inventory: '68 L', health: 74, status: 'Critical' },
    ],
    approvals: [
        { id: 1, req: 'New gallery — Pune South', type: 'Expansion', by: 'State Dir', status: 'Pending' },
        { id: 2, req: 'High-value PO ₹8 L', type: 'Purchase', by: 'GM', status: 'Pending' },
        { id: 3, req: 'Customer compensation ₹25,000', type: 'Exception', by: 'GM', status: 'Pending' },
    ],
    alerts: [
        { id: 1, type: 'critical', msg: 'Gallery profitability dropped below minimum threshold (Gallery A)' },
        { id: 2, type: 'critical', msg: 'Cash reconciliation variance ₹18,500 detected' },
        { id: 3, type: 'high', msg: 'Inventory shortage predicted within 7 days (3 galleries)' },
    ]
});

const CGOOperatingDashboard = () => {
    const [data, setData] = useState(() => loadData());
    const [activeTab, setActiveTab] = useState('cgo-command');
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);
    const [filterState, setFilterState] = useState('all');

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
            console.warn('CGO load reset error', e);
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

    const renderCommandCenter = () => (
        <div className="space-y-5">
            {/* Scorecard Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white p-5 rounded-xl border border-emerald-700/40 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Chief Gallery Officer • Network Scorecard</div>
                        <div className="text-2xl font-black mt-1">Overall Gallery Health <span className="text-emerald-400">{data.overallHealth}%</span></div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                        <div>Period: Aug 2026 • 84 Galleries Across India</div>
                        <div className="text-emerald-300 mt-1 font-semibold">Sales • Profit • Stock • CX • Health</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-xs">
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Sales Performance</div><div className="text-lg font-bold text-emerald-400">94%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Profitability</div><div className="text-lg font-bold text-emerald-400">91%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Inventory</div><div className="text-lg font-bold text-emerald-400">89%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Customer CX</div><div className="text-lg font-bold text-emerald-400">93%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Staff Performance</div><div className="text-lg font-bold text-emerald-400">92%</div></div>
                </div>
            </div>

            {/* Metrics Tower */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div onClick={() => setActiveTab('cgo-galleries')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Total Galleries</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.totalGalleries}</div>
                </div>
                <div onClick={() => setActiveTab('cgo-sales')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Today's Sales</div>
                    <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.todaySales}</div>
                </div>
                <div onClick={() => setActiveTab('cgo-sales')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Monthly Sales</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.monthlySales}</div>
                </div>
                <div onClick={() => setActiveTab('cgo-inventory')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Inventory Value</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.inventoryValue}</div>
                </div>
                <div onClick={() => setActiveTab('cgo-complaints')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Complaints</div>
                    <div className="text-lg font-black text-rose-600 mt-1">{data.metrics.complaintsTotal} ({data.metrics.complaintsPending} open)</div>
                </div>
                <div onClick={() => setActiveTab('cgo-health')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Gallery Health</div>
                    <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.galleryHealth}</div>
                </div>
            </div>

            {/* Critical Alerts */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-sm text-slate-800 mb-3"><i className="fa-solid fa-bell text-rose-500 mr-2"></i>Critical Network Alerts</h3>
                <div className="space-y-2 text-xs">
                    {data.alerts.map(al => (
                        <div key={al.id} className={`p-3 rounded-lg border-l-4 ${al.type === 'critical' ? 'border-rose-500 bg-rose-50' : 'border-amber-500 bg-amber-50'}`}>
                            <div className="font-bold text-slate-800">{al.type.toUpperCase()}: {al.msg}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderGalleriesTable = () => {
        const filtered = filterState === 'all' ? data.galleries : data.galleries.filter(g => g.state === filterState);
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-800">🏬 All Network Galleries ({filtered.length})</h3>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">Filter State:</span>
                        <select value={filterState} onChange={e => setFilterState(e.target.value)} className="border p-1.5 rounded bg-slate-50">
                            <option value="all">All States</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Telangana">Telangana</option>
                        </select>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-3">Gallery Name</th>
                                <th className="p-3">State</th>
                                <th className="p-3">Sales</th>
                                <th className="p-3">Target</th>
                                <th className="p-3">Ach %</th>
                                <th className="p-3">Profit</th>
                                <th className="p-3">Inventory</th>
                                <th className="p-3">Health Score</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {filtered.map(g => (
                                <tr key={g.id} className="hover:bg-emerald-50/40 transition">
                                    <td className="p-3 font-bold text-slate-900">{g.name}</td>
                                    <td className="p-3">{g.state}</td>
                                    <td className="p-3 font-bold">{g.sales}</td>
                                    <td className="p-3">{g.target}</td>
                                    <td className="p-3 font-bold text-emerald-600">{g.ach}</td>
                                    <td className="p-3">{g.profit}</td>
                                    <td className="p-3">{g.inventory}</td>
                                    <td className="p-3 font-black text-emerald-600">{g.health}%</td>
                                    <td className="p-3">
                                        <button onClick={() => openModal(`🏬 Gallery Detail: ${g.name}`, (
                                            <div className="space-y-3 text-xs">
                                                <div><strong>State:</strong> {g.state}</div>
                                                <div><strong>Sales:</strong> {g.sales} (Target: {g.target})</div>
                                                <div><strong>Profit:</strong> {g.profit}</div>
                                                <div><strong>Inventory Stock:</strong> {g.inventory}</div>
                                                <button onClick={() => { showToast(`🏬 Full Inspection report generated for ${g.name}`); closeModal(); }} className="px-3 py-1.5 bg-emerald-600 text-white rounded font-semibold mt-2">Generate Inspection PDF</button>
                                            </div>
                                        ))} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded hover:bg-emerald-50 hover:text-emerald-700 font-semibold">Inspect</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">CG</div>
                    <span className="font-bold text-white tracking-tight text-lg">CGO <span className="text-emerald-400">Network</span></span>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-2">Network Command</div>
                    {[
                        ['cgo-command', 'CGO Command Center', 'fa-tachometer-alt'],
                        ['cgo-galleries', 'All Galleries (84)', 'fa-store-alt'],
                        ['cgo-sales', 'Sales Dashboard', 'fa-rupee-sign'],
                        ['cgo-inventory', 'Stock & Inventory', 'fa-boxes'],
                        ['cgo-approvals', 'Approval Center', 'fa-check-double'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="font-bold text-white">{data.user.name}</div>
                    <div className="text-[10px] text-emerald-400">National Gallery Operations</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">CGO Gallery Network Operations Hub</div>
                    <button onClick={() => showToast('🔄 Refreshing network metrics...')} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">Refresh Data</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'cgo-command' && renderCommandCenter()}
                    {activeTab === 'cgo-galleries' && renderGalleriesTable()}
                    {activeTab === 'cgo-approvals' && (
                        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                            <h3 className="font-bold text-sm text-slate-800 mb-3">✍️ CGO Pending Approvals</h3>
                            {data.approvals.map(a => (
                                <div key={a.id} className="p-3 border rounded-lg flex justify-between items-center text-xs">
                                    <div><strong>{a.req}</strong> ({a.type}) by {a.by}</div>
                                    <button onClick={() => handleApproval(a.id, 'Approved')} className="px-3 py-1 bg-emerald-600 text-white rounded font-semibold">Approve</button>
                                </div>
                            ))}
                        </div>
                    )}
                    {['cgo-sales', 'cgo-inventory'].includes(activeTab) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeTab} Network Operations</h3>
                            <p className="text-xs text-slate-500 mt-1">Live gallery network metrics active.</p>
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

export default CGOOperatingDashboard;
