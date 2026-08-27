'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'bdmPortalData_v1';

const defaultData = () => ({
    user: { name: 'Rahul Sharma', role: 'Business Development Manager' },
    metrics: {
        teamRevenue: '₹84.5 L',
        conversionRate: '31.2%',
        qualifiedOpportunities: 42,
        followupsCompleted: 380,
        targetAchievement: '94%',
        bdeProductivity: '91%'
    },
    bdes: [
        { id: 'BDE-01', name: 'Suresh Kumar', assignedLeads: 45, closedDeals: 12, revenue: '₹28.5 L', convRate: '26.6%' },
        { id: 'BDE-02', name: 'Sneha Patil', assignedLeads: 50, closedDeals: 16, revenue: '₹34.0 L', convRate: '32.0%' },
        { id: 'BDE-03', name: 'Amit Verma', assignedLeads: 38, closedDeals: 9, revenue: '₹22.0 L', convRate: '23.6%' }
    ]
});

export default function BDMPage() {
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

    const handleDistributeLeads = () => {
        openModal(
            '🔀 Distribute Leads to BDE Team',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Select BDE *</label>
                <select id="bdeSelect" className="w-full border p-2 rounded text-sm mt-1">
                    {data.bdes.map(b => <option key={b.id} value={b.name}>{b.name} ({b.assignedLeads} leads)</option>)}
                </select>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Number of Leads to Assign</label>
                <input id="leadBatchCount" type="number" className="w-full border p-2 rounded text-sm mt-1" placeholder="10" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const bde = document.getElementById('bdeSelect')?.value;
                        const count = parseInt(document.getElementById('leadBatchCount')?.value) || 5;
                        updateData(prev => ({
                            ...prev,
                            bdes: prev.bdes.map(b => b.name === bde ? { ...b, assignedLeads: b.assignedLeads + count } : b)
                        }));
                        showToast(`🔀 Assigned ${count} fresh leads to ${bde}!`);
                        closeModal();
                    }} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded text-xs hover:bg-teal-700">Assign Leads</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-lg">💼</div>
                    <div>
                        <div className="font-bold text-white text-base">BDM <span className="text-teal-400">Portal</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Business Development Manager</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['team', 'BDE Team Performance', 'fa-users'],
                        ['distribution', 'Lead Distribution', 'fa-network-wired'],
                        ['discounts', 'Discount Approvals', 'fa-tags'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Business Development Management & Sales Pipeline Tower</div>
                    <button onClick={handleDistributeLeads} className="px-3.5 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700">🔀 Distribute Leads</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Team Revenue</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.teamRevenue}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Conv. Rate</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.conversionRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Qualified Opps</div>
                            <div className="text-xl font-black text-teal-600 mt-1">{data.metrics.qualifiedOpportunities}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Follow-ups Done</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.followupsCompleted}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Target Ach.</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.targetAchievement}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">BDE Productivity</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.bdeProductivity}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">💼 BDE Team Performance Roster</h3>
                            <button onClick={handleDistributeLeads} className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-semibold">+ Distribute Leads</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">BDE ID</th>
                                        <th className="p-2.5">Name</th>
                                        <th className="p-2.5">Assigned Leads</th>
                                        <th className="p-2.5">Closed Deals</th>
                                        <th className="p-2.5">Revenue</th>
                                        <th className="p-2.5">Conversion %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.bdes.map(b => (
                                        <tr key={b.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-teal-600">{b.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{b.name}</td>
                                            <td className="p-2.5 font-medium">{b.assignedLeads}</td>
                                            <td className="p-2.5 font-bold">{b.closedDeals}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{b.revenue}</td>
                                            <td className="p-2.5 font-bold text-purple-600">{b.convRate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
}
