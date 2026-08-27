'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'hqHeadData_v1';

const defaultData = () => ({
    user: { name: 'Vikram', role: 'HQ Head' },
    hqs: [
        { id: 1, name: 'HQ North', region: 'North', districts: 3, galleries: 8, revenue: '₹45.0L', target: '₹50.0L', ach: '90%', employees: 45, collections: '₹38.0L', outstanding: '₹7.0L' },
        { id: 2, name: 'HQ South', region: 'South', districts: 2, galleries: 5, revenue: '₹32.0L', target: '₹35.0L', ach: '91%', employees: 30, collections: '₹28.0L', outstanding: '₹4.0L' },
    ],
    districts: [
        { id: 1, hqId: 1, name: 'District A', galleries: 4, revenue: '₹25.0L', target: '₹28.0L', achievement: '89%', employees: 22, performance: 85 },
        { id: 2, hqId: 1, name: 'District B', galleries: 4, revenue: '₹20.0L', target: '₹22.0L', achievement: '91%', employees: 23, performance: 88 },
        { id: 3, hqId: 2, name: 'District C', galleries: 5, revenue: '₹32.0L', target: '₹35.0L', achievement: '91%', employees: 30, performance: 90 },
    ],
    galleries: [
        { id: 1, name: 'Gallery Alpha', manager: 'Rajesh', revenue: '₹6.0L', target: '₹7.0L', achievement: '86%', customers: 85, leads: 18, complaints: 2, performance: 84 },
        { id: 2, name: 'Gallery Beta', manager: 'Sneha', revenue: '₹7.0L', target: '₹7.5L', achievement: '93%', customers: 95, leads: 22, complaints: 1, performance: 91 },
        { id: 3, name: 'Gallery Gamma', manager: 'Amit', revenue: '₹5.0L', target: '₹5.5L', achievement: '91%', customers: 75, leads: 15, complaints: 0, performance: 88 },
        { id: 4, name: 'Gallery Delta', manager: 'Priya', revenue: '₹5.5L', target: '₹6.0L', achievement: '92%', customers: 80, leads: 20, complaints: 1, performance: 90 },
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

const HQHeadPage = () => {
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
            console.warn('HQ Head load reset error', e);
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
            <div className="bg-gradient-to-r from-slate-900 via-green-950 to-slate-900 text-white p-5 rounded-xl border border-green-700/40 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="text-xs uppercase font-bold text-green-300 tracking-wider">HQ Head • Operations Command</div>
                        <div className="text-2xl font-black mt-1">Assigned HQs: <span className="text-green-300">{data.hqs.length}</span></div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                        <div>Galleries: {data.galleries.length} • Employees: {data.employees.length}</div>
                        <div className="text-green-300 mt-1 font-semibold">Total Revenue: {data.hqs[0]?.revenue}</div>
                    </div>
                </div>
            </div>

            {/* HQ Performance Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-slate-800">🏢 HQ Performance Summary</h3>
                    <button onClick={() => showToast('🔄 Refreshing HQ performance data...')} className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700">Refresh Data</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-2.5">HQ Name</th>
                                <th className="p-2.5">Region</th>
                                <th className="p-2.5">Districts</th>
                                <th className="p-2.5">Galleries</th>
                                <th className="p-2.5">Revenue</th>
                                <th className="p-2.5">Target</th>
                                <th className="p-2.5">Ach %</th>
                                <th className="p-2.5">Employees</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {data.hqs.map(h => (
                                <tr key={h.id} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-slate-900">{h.name}</td>
                                    <td className="p-2.5">{h.region}</td>
                                    <td className="p-2.5">{h.districts}</td>
                                    <td className="p-2.5">{h.galleries}</td>
                                    <td className="p-2.5 font-bold text-emerald-600">{h.revenue}</td>
                                    <td className="p-2.5 text-slate-500">{h.target}</td>
                                    <td className="p-2.5 font-bold">{h.ach}</td>
                                    <td className="p-2.5">{h.employees}</td>
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
                    <div className="w-9 h-9 rounded-xl bg-green-600 text-white font-black flex items-center justify-center text-lg">HQ</div>
                    <div>
                        <div className="font-bold text-white text-base">HQ <span className="text-green-400">Head</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Regional Command</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Overview Dashboard', 'fa-house'],
                        ['hqs', 'HQ Performance', 'fa-building'],
                        ['districts', 'District Performance', 'fa-layer-group'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-green-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">HQ Head Portal</div>
                    <button onClick={() => showToast('🔄 Refreshing HQ Head portal...')} className="px-3.5 py-1.5 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700">Sync</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {['hqs', 'districts'].includes(activeTab) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeTab} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live HQ head data active.</p>
                        </div>
                    )}
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-green-600'}`}>
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

export default HQHeadPage;
