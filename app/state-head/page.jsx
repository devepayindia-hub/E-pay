'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'stateHeadData_v1';

const defaultData = () => ({
    user: { name: 'State Head Manager', role: 'State Head', state: 'Maharashtra' },
    metrics: {
        hqs: 6,
        districts: 24,
        galleries: 58,
        employees: 412,
        presentToday: 376,
        todayRevenue: '₹8.4L',
        monthlyRevenue: '₹2.16Cr',
        targetRevenue: '₹3.20Cr',
        achievement: '67.5%',
        growth: '+14.3%',
        newCustomers: 1842,
        newLeads: 3210,
        fieldVisits: 847,
        collections: '₹1.82Cr',
        outstanding: '₹28.6L'
    },
    hqs: [
        { name: 'HQ Pune', galleries: 12, score: '96%', change: '+8%' },
        { name: 'HQ Mumbai', galleries: 14, score: '92%', change: '+5%' },
        { name: 'HQ Nashik', galleries: 8, score: '88%', change: '+3%' },
        { name: 'HQ Aurangabad', galleries: 7, score: '79%', change: '-1%' },
        { name: 'HQ Nagpur', galleries: 9, score: '69%', change: '-7%' },
    ],
    districts: [
        { name: 'Pune City', manager: 'Anita Desai', galleries: 6, revenue: '54L', ach: '97%' },
        { name: 'Mumbai South', manager: 'Ravi Menon', galleries: 8, revenue: '68L', ach: '91%' },
        { name: 'Nashik Central', manager: 'Priya Sharma', galleries: 4, revenue: '32L', ach: '84%' },
        { name: 'Nagpur East', manager: 'Vikram Singh', galleries: 5, revenue: '24L', ach: '71%' },
    ],
    topGalleries: [
        { rank: 1, name: 'Gallery Prime • Pune', manager: 'S. Patil', revenue: '18.2L' },
        { rank: 2, name: 'Gallery Central • Mumbai', manager: 'A. Joshi', revenue: '15.8L' },
        { rank: 3, name: 'Gallery Elite • Nashik', manager: 'R. More', revenue: '11.4L' },
        { rank: 4, name: 'Gallery Metro • Mumbai', manager: 'D. Kulkarni', revenue: '9.6L' },
    ]
});

const StateHeadManagerPage = () => {
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
            console.warn('State Head load reset error', e);
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
            {/* Top Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 rounded-xl border border-blue-700/40 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="text-xs uppercase font-bold text-blue-300 tracking-wider">State Head Manager • {data.user.state}</div>
                        <div className="text-2xl font-black mt-1">State Target Achievement <span className="text-blue-300">{data.metrics.achievement}</span></div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                        <div>HQs: {data.metrics.hqs} • Districts: {data.metrics.districts} • Galleries: {data.metrics.galleries}</div>
                        <div className="text-blue-300 mt-1 font-semibold">Employees: {data.metrics.employees} (Present: {data.metrics.presentToday})</div>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">HQs</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.hqs}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Districts</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.districts}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Galleries</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.galleries}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Employees</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.employees}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Today's Rev</div>
                    <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.todayRevenue}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Monthly Rev</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.monthlyRevenue}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Collections</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.collections}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Growth</div>
                    <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.growth}</div>
                </div>
            </div>

            {/* HQ Rankings */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-sm text-slate-800 mb-3">🏢 HQ Regional Ranking ({data.hqs.length})</h3>
                <div className="space-y-2 text-xs">
                    {data.hqs.map((hq, idx) => (
                        <div key={hq.name} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                            <div>
                                <span className="font-bold text-slate-900 mr-2">#{idx + 1} {hq.name}</span>
                                <span className="text-slate-500">({hq.galleries} galleries)</span>
                            </div>
                            <div className="font-bold text-emerald-600">{hq.score} <span className="text-[10px] text-slate-400">({hq.change})</span></div>
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
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-lg">SH</div>
                    <div>
                        <div className="font-bold text-white text-base">State <span className="text-blue-400">Head</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">{data.user.state} Manager</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Overview Dashboard', 'fa-house'],
                        ['hqs', 'HQ Leadership', 'fa-building'],
                        ['districts', 'District Performance', 'fa-city'],
                        ['galleries', 'Top Galleries', 'fa-store'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">State Head Manager Dashboard — {data.user.state}</div>
                    <button onClick={() => showToast('🔄 Refreshing state head metrics...')} className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700">Refresh Data</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {['hqs', 'districts', 'galleries'].includes(activeTab) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeTab} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live state head data active.</p>
                        </div>
                    )}
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'}`}>
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

export default StateHeadManagerPage;
