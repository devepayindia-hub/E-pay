'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'regionalOpsMgrData_v1';

const defaultData = () => ({
    user: { name: 'Sanjay Deshmukh', role: 'Regional Operations Manager' },
    metrics: {
        region: 'Western Region (MH & GA)',
        totalGalleriesFranchises: 28,
        regionalRevenue: '₹2.84 Cr',
        productivityScore: '93.4%',
        regionalAuditsDone: 18,
        openIssues: 2
    },
    galleries: [
        { id: 'REG-101', location: 'Pune Central', type: 'Gallery', revenue: '₹42 L', productivity: '96%', kpiScore: '95/100', auditStatus: 'Passed' },
        { id: 'REG-102', location: 'Mumbai Andheri', type: 'Gallery', revenue: '₹55 L', productivity: '94%', kpiScore: '92/100', auditStatus: 'Passed' },
        { id: 'REG-103', location: 'Goa Panaji Center', type: 'Franchise', revenue: '₹28 L', type: 'Franchise', productivity: '90%', kpiScore: '88/100', auditStatus: 'Audit Pending' }
    ]
});

export default function RegionalOpsMgrPage() {
    useEffect(() => {
        if (!db) return;
        const docRef = doc(db, 'tenants', 'default', 'roleData', STORAGE_KEY);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const remoteData = docSnap.data();
                setData(remoteData);
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
                } catch (e) {}
            } else {
                const def = defaultData();
                setDoc(docRef, def).catch(e => console.warn(e));
            }
        });
        return () => unsubscribe();
    }, []);

    

    const [data, setData] = useState(() => loadData());
    const [activeTab, setActiveTab] = useState('dashboard');
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);

    function loadData() {
        try {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) return JSON.parse(stored);
            }
        } catch (e) {}
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

    const openModal = useCallback((title, content) => setModal({ title, content }), []);
    const closeModal = useCallback(() => setModal(null), []);

    const handleConductAudit = () => {
        openModal(
            '🔍 Conduct Regional Branch Audit',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Select Center / Gallery *</label>
                <select id="regAuditSelect" className="w-full border p-2 rounded text-sm mt-1">
                    {data.galleries.map(g => <option key={g.id} value={g.location}>{g.location}</option>)}
                </select>
                <label className="block text-xs font-semibold text-slate-700 mt-2">KPI Audit Score (Out of 100)</label>
                <input id="regKpiScore" type="number" className="w-full border p-2 rounded text-sm mt-1" placeholder="95" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const loc = document.getElementById('regAuditSelect')?.value;
                        const kpi = (document.getElementById('regKpiScore')?.value || '95') + '/100';
                        updateData(prev => ({
                            ...prev,
                            galleries: prev.galleries.map(g => g.location === loc ? { ...g, kpiScore: kpi, auditStatus: 'Passed' } : g),
                            metrics: { ...prev.metrics, regionalAuditsDone: prev.metrics.regionalAuditsDone + 1 }
                        }));
                        showToast(`🔍 Audit completed for ${loc} (KPI Score: ${kpi})!`);
                        closeModal();
                    }} className="px-4 py-2 bg-sky-700 text-white font-semibold rounded text-xs hover:bg-sky-800">Pass & Save Audit</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-700 text-white font-black flex items-center justify-center text-lg">🌐</div>
                    <div>
                        <div className="font-bold text-white text-base">Regional Ops <span className="text-sky-400">Mgr</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Western Region Control</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['galleries', 'Regional Centers', 'fa-globe'],
                        ['audits', 'Regional Audits', 'fa-list-check'],
                        ['issues', 'Operational Issues', 'fa-triangle-exclamation'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-sky-700 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Regional Operations & Multi-Branch Management Portal</div>
                    <button onClick={handleConductAudit} className="px-3.5 py-1.5 bg-sky-700 text-white rounded text-xs font-semibold hover:bg-sky-800">🔍 Conduct Audit</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Assigned Region</div>
                            <div className="text-sm font-black text-sky-700 mt-1">{data.metrics.region}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Centers</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.totalGalleriesFranchises}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Regional Revenue</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.regionalRevenue}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Productivity</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.productivityScore}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Audits Done</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.regionalAuditsDone}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Open Issues</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.openIssues}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🌐 Regional Branch & Gallery Network Performance</h3>
                            <button onClick={handleConductAudit} className="px-3 py-1 bg-sky-700 text-white rounded text-xs font-semibold">+ Audit Branch</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Center Location</th>
                                        <th className="p-2.5">Monthly Revenue</th>
                                        <th className="p-2.5">Productivity</th>
                                        <th className="p-2.5">KPI Score</th>
                                        <th className="p-2.5">Audit Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.galleries.map(g => (
                                        <tr key={g.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-sky-700">{g.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{g.location}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{g.revenue}</td>
                                            <td className="p-2.5 font-medium">{g.productivity}</td>
                                            <td className="p-2.5 font-bold text-purple-600">{g.kpiScore}</td>
                                            <td className="p-2.5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${g.auditStatus === 'Passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{g.auditStatus}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-sky-700'}`}>
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
}
