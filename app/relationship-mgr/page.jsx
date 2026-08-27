'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'relationshipMgrData_v1';

const defaultData = () => ({
    user: { name: 'Pooja Kulkarni', role: 'Relationship Manager' },
    metrics: {
        assignedHniCustomers: 85,
        csatScore: '4.9/5',
        upsellRevenueGenerated: '₹24.5 L',
        retentionRate: '98.8%',
        openEscalations: 1
    },
    clients: [
        { id: 'RM-101', name: 'Rajesh Agrawal', segment: 'HNI Member (ePay Gold)', relationshipAge: '2 Years', monthlySpend: '₹1.4 L', lastTouchpoint: '2026-08-20', status: 'Active' },
        { id: 'RM-102', name: 'Meena Shah', segment: 'Corporate Account', relationshipAge: '1.5 Years', monthlySpend: '₹2.8 L', lastTouchpoint: '2026-08-18', status: 'Active' }
    ]
});

export default function RelationshipMgrPage() {
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

    const handleLogInteraction = () => {
        openModal(
            '📞 Log Client Touchpoint & Upsell Note',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Client Name *</label>
                <input id="rmClient" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Rajesh Agrawal" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Interaction Notes & Upsell Requirements</label>
                <textarea id="rmNotes" className="w-full border p-2 rounded text-sm mt-1 h-20" placeholder="Discussed ePay Dubai VIP package upgrade..." />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const client = document.getElementById('rmClient')?.value || 'Client';
                        showToast(`📞 Touchpoint for ${client} logged!`);
                        closeModal();
                    }} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded text-xs hover:bg-blue-700">Save Touchpoint</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-lg">📞</div>
                    <div>
                        <div className="font-bold text-white text-base">Relationship <span className="text-blue-400">Manager</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">HNI Accounts & CSAT</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['clients', 'Assigned HNI Clients', 'fa-user-tie'],
                        ['touchpoints', 'Interaction Log', 'fa-phone-volume'],
                        ['retention', 'Account Retention', 'fa-shield-heart'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">VIP & Key Customer Relationship Management Portal</div>
                    <button onClick={handleLogInteraction} className="px-3.5 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700">📞 Log Touchpoint</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Assigned HNI Clients</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.assignedHniCustomers}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">CSAT Score</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">⭐ {data.metrics.csatScore}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Upsell Revenue</div>
                            <div className="text-xl font-black text-blue-600 mt-1">{data.metrics.upsellRevenueGenerated}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Retention Rate</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.retentionRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Open Escalations</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.openEscalations}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📞 Assigned Client Accounts & Monthly Volume</h3>
                            <button onClick={handleLogInteraction} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold">+ Log Touchpoint</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Client Name</th>
                                        <th className="p-2.5">Segment</th>
                                        <th className="p-2.5">Age</th>
                                        <th className="p-2.5">Monthly Spend</th>
                                        <th className="p-2.5">Last Touchpoint</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.clients.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-blue-600">{c.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{c.name}</td>
                                            <td className="p-2.5 text-slate-500">{c.segment}</td>
                                            <td className="p-2.5">{c.relationshipAge}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{c.monthlySpend}</td>
                                            <td className="p-2.5 font-medium">{c.lastTouchpoint}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{c.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
}
