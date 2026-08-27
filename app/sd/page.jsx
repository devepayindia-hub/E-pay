'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'sdData_v1';

const defaultData = () => ({
    user: { name: 'Yashraj Sathe', role: 'State Director', state: 'Maharashtra' },
    stateHealth: 92,
    metrics: {
        totalGalleries: 18,
        activeGalleries: 17,
        stateSales: '₹1.42 Cr',
        monthlyTarget: '₹1.55 Cr',
        achievement: '92%',
        stateProfit: '₹38 L',
        inventory: '₹4.8 Cr',
        customers: 12450,
        members: 8620,
        employees: 286,
        attendance: '94%',
        complaints: 38,
        pendingComplaints: 7,
        expenses: '₹21 L'
    },
    galleries: [
        { id: 1, name: 'Pune Central', city: 'Pune', sales: '42 L', target: '40 L', ach: '105%', profit: '12 L', health: 96, status: 'Active' },
        { id: 2, name: 'Pune East', city: 'Pune', sales: '36 L', target: '38 L', ach: '95%', profit: '9 L', health: 93, status: 'Active' },
        { id: 3, name: 'Pune West', city: 'Pune', sales: '28 L', target: '34 L', ach: '82%', profit: '6 L', health: 84, status: 'Warning' },
        { id: 4, name: 'Mumbai Central', city: 'Mumbai', sales: '39 L', target: '40 L', ach: '98%', profit: '10 L', health: 95, status: 'Active' },
        { id: 5, name: 'Mumbai West', city: 'Mumbai', sales: '31 L', target: '38 L', ach: '82%', profit: '7 L', health: 82, status: 'Warning' },
        { id: 6, name: 'Nashik Central', city: 'Nashik', sales: '31 L', target: '30 L', ach: '103%', profit: '11 L', health: 94, status: 'Active' },
    ],
    approvals: [
        { id: 1, req: 'Stock transfer 8 L (Pune Central -> Mumbai West)', type: 'Transfer', by: 'GM', status: 'Pending' },
        { id: 2, req: 'Employee transfer (Pune -> Mumbai)', type: 'HR', by: 'Manager', status: 'Pending' },
        { id: 3, req: 'Gallery expense ₹45,000', type: 'Expense', by: 'GM', status: 'Pending' },
    ],
    alerts: [
        { id: 1, type: 'high', msg: 'Mumbai West below 85% target — GM alerted' },
        { id: 2, type: 'warning', msg: 'Pune West turnover risk — overstock detected' },
        { id: 3, type: 'info', msg: 'Projected 96% target achievement across state' },
    ]
});

const StateDirectorPage = () => {
    const [data, setData] = useState(() => loadData());
    const [activeTab, setActiveTab] = useState('sd-command');
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);
    const [filterCity, setFilterCity] = useState('all');

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
            console.warn('SD load reset error', e);
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

    const handleCreateRecoveryPlan = () => {
        openModal(
            '🚑 Create Gallery Recovery Plan',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Target Gallery</label>
                <select id="recGal" className="w-full border p-2 rounded text-sm mt-1">
                    <option value="Mumbai West">Mumbai West</option>
                    <option value="Pune West">Pune West</option>
                </select>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Identified Root Cause</label>
                <input id="recCause" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Low conversion & overstock" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Corrective Actions</label>
                <textarea id="recAction" rows="3" className="w-full border p-2 rounded text-sm mt-1" placeholder="Action steps..."></textarea>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const gal = document.getElementById('recGal').value;
                        const cause = document.getElementById('recCause').value || 'Underperformance';
                        showToast(`🚑 Recovery Plan activated for ${gal}: ${cause}`);
                        closeModal();
                    }} className="px-4 py-2 bg-sky-600 text-white font-semibold rounded text-xs hover:bg-sky-700">Activate Plan</button>
                </div>
            </div>
        );
    };

    const renderCommandCenter = () => (
        <div className="space-y-5">
            {/* Scorecard Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 rounded-xl border border-sky-700/40 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="text-xs uppercase font-bold text-sky-300 tracking-wider">State Director • {data.user.state} Operations</div>
                        <div className="text-2xl font-black mt-1">State Health Score <span className="text-sky-300">{data.stateHealth}%</span></div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                        <div>{data.metrics.totalGalleries} Galleries Across {data.user.state}</div>
                        <div className="text-sky-300 mt-1 font-semibold">Sales • Profit • Inventory • Staff • CX</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-xs">
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Sales Achievement</div><div className="text-lg font-bold text-emerald-400">94%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Profitability</div><div className="text-lg font-bold text-emerald-400">91%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Gallery Performance</div><div className="text-lg font-bold text-emerald-400">92%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Inventory Turnover</div><div className="text-lg font-bold text-emerald-400">88%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Customer CX</div><div className="text-lg font-bold text-emerald-400">93%</div></div>
                </div>
            </div>

            {/* Metrics Tower */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div onClick={() => setActiveTab('sd-galleries')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-sky-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">State Galleries</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.totalGalleries}</div>
                </div>
                <div onClick={() => setActiveTab('sd-sales')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-sky-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">State Sales</div>
                    <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.stateSales}</div>
                </div>
                <div onClick={() => setActiveTab('sd-profit')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-sky-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">State Profit</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.stateProfit}</div>
                </div>
                <div onClick={() => setActiveTab('sd-inventory')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-sky-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Inventory Stock</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.inventory}</div>
                </div>
                <div onClick={() => setActiveTab('sd-employees')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-sky-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Employees</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.employees}</div>
                </div>
                <div onClick={() => setActiveTab('sd-approvals')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-sky-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Pending Approvals</div>
                    <div className="text-lg font-black text-sky-600 mt-1">{data.approvals.length}</div>
                </div>
            </div>

            {/* State Alerts */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-slate-800"><i className="fa-solid fa-bell text-sky-600 mr-2"></i>Regional Operations Alerts</h3>
                    <button onClick={handleCreateRecoveryPlan} className="px-3 py-1 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700">🚑 Recovery Plan</button>
                </div>
                <div className="space-y-2 text-xs">
                    {data.alerts.map(al => (
                        <div key={al.id} className="p-3 rounded-lg border-l-4 border-sky-500 bg-sky-50">
                            <div className="font-bold text-slate-800">{al.msg}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderGalleriesTable = () => {
        const filtered = filterCity === 'all' ? data.galleries : data.galleries.filter(g => g.city === filterCity);
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-800">🏬 Maharashtra Galleries ({filtered.length})</h3>
                    <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="border p-1.5 rounded text-xs bg-slate-50">
                        <option value="all">All Cities</option>
                        <option value="Pune">Pune</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Nashik">Nashik</option>
                    </select>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-3">Gallery Name</th>
                                <th className="p-3">City</th>
                                <th className="p-3">Sales</th>
                                <th className="p-3">Target</th>
                                <th className="p-3">Ach %</th>
                                <th className="p-3">Profit</th>
                                <th className="p-3">Health Score</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {filtered.map(g => (
                                <tr key={g.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-bold text-slate-900">{g.name}</td>
                                    <td className="p-3">{g.city}</td>
                                    <td className="p-3 font-bold">{g.sales}</td>
                                    <td className="p-3">{g.target}</td>
                                    <td className="p-3 font-bold text-emerald-600">{g.ach}</td>
                                    <td className="p-3">{g.profit}</td>
                                    <td className="p-3 font-black text-sky-600">{g.health}%</td>
                                    <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${g.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{g.status}</span></td>
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
                    <div className="w-9 h-9 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center text-lg">SD</div>
                    <div>
                        <div className="font-bold text-white text-base">State <span className="text-sky-400">Director</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">{data.user.state} Operations</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['sd-command', 'State Command', 'fa-tachometer-alt'],
                        ['sd-galleries', 'All Galleries', 'fa-store'],
                        ['sd-sales', 'Sales Control', 'fa-rupee-sign'],
                        ['sd-inventory', 'Stock & Inventory', 'fa-boxes'],
                        ['sd-approvals', 'Approval Center', 'fa-check-circle'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-sky-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="font-bold text-white">{data.user.name}</div>
                    <div className="text-[10px] text-sky-400">{data.user.state} Regional Hub</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">State Director Operations — {data.user.state}</div>
                    <button onClick={handleCreateRecoveryPlan} className="px-3.5 py-1.5 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700">🚑 Recovery Plan</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'sd-command' && renderCommandCenter()}
                    {activeTab === 'sd-galleries' && renderGalleriesTable()}
                    {activeTab === 'sd-approvals' && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <h3 className="font-bold text-sm text-slate-800 mb-3">✍️ State Director Approvals Queue</h3>
                            {data.approvals.map(a => (
                                <div key={a.id} className="p-3 border rounded-lg flex justify-between items-center text-xs">
                                    <div><strong>{a.req}</strong> ({a.type}) by {a.by}</div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApproval(a.id, 'Approved')} className="px-3 py-1 bg-sky-600 text-white rounded font-semibold">Approve</button>
                                        <button onClick={() => handleApproval(a.id, 'Rejected')} className="px-3 py-1 bg-rose-600 text-white rounded font-semibold">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {['sd-sales', 'sd-inventory'].includes(activeTab) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeTab} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live regional operations data active.</p>
                        </div>
                    )}
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-sky-600'}`}>
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

export default StateDirectorPage;
