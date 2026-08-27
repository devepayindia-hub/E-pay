'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'franchiseOpsMgrData_v1';

const defaultData = () => ({
    user: { name: 'Rajesh Kulkarni', role: 'Franchise Operations Manager' },
    metrics: {
        activeFranchises: 42,
        onboardingInFlight: 6,
        complianceRate: '98.5%',
        monthlyFranchiseRev: '₹1.84 Cr',
        openSupportTickets: 3,
        escalationsResolved: 14
    },
    franchises: [
        { id: 'FR-201', name: 'Surat Ring Road Center', investor: 'Vijay Shah', compliance: '99%', monthlyRev: '₹28 L', openTickets: 0, status: 'Active' },
        { id: 'FR-202', name: 'Nashik City Center', investor: 'Milind Deshmukh', compliance: '96%', monthlyRev: '₹22 L', openTickets: 1, status: 'Active' }
    ]
});

export default function FranchiseOpsMgrPage() {
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

    const handleAuditCompliance = () => {
        openModal(
            '🛡️ Conduct Franchise Compliance Audit',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Franchise Center *</label>
                <select id="frAuditSelect" className="w-full border p-2 rounded text-sm mt-1">
                    {data.franchises.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                </select>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Compliance Rating (%)</label>
                <input id="frAuditScore" type="number" className="w-full border p-2 rounded text-sm mt-1" placeholder="98" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('frAuditSelect')?.value;
                        const score = (document.getElementById('frAuditScore')?.value || '98') + '%';
                        updateData(prev => ({
                            ...prev,
                            franchises: prev.franchises.map(f => f.name === name ? { ...f, compliance: score } : f)
                        }));
                        showToast(`🛡️ Compliance audit for ${name} updated (${score})!`);
                        closeModal();
                    }} className="px-4 py-2 bg-purple-700 text-white font-semibold rounded text-xs hover:bg-purple-800">Save Audit</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-700 text-white font-black flex items-center justify-center text-lg">🏬</div>
                    <div>
                        <div className="font-bold text-white text-base">Franchise Ops <span className="text-purple-400">Mgr</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Operational Lifecycle & Compliance</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['franchises', 'Franchise Network', 'fa-building'],
                        ['compliance', 'Compliance Audits', 'fa-shield-check'],
                        ['tickets', 'Support Tickets', 'fa-headset'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-purple-700 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Franchise Network Operations & Compliance Portal</div>
                    <button onClick={handleAuditCompliance} className="px-3.5 py-1.5 bg-purple-700 text-white rounded text-xs font-semibold hover:bg-purple-800">🛡️ Audit Compliance</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Active Franchises</div>
                            <div className="text-xl font-black text-purple-700 mt-1">{data.metrics.activeFranchises}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Onboarding</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.onboardingInFlight}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Compliance</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.complianceRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Monthly Revenue</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.monthlyFranchiseRev}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Open Tickets</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.openSupportTickets}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Escalations Fixed</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.escalationsResolved}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🏬 Active Franchise Network Operations</h3>
                            <button onClick={handleAuditCompliance} className="px-3 py-1 bg-purple-700 text-white rounded text-xs font-semibold">+ Audit Compliance</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Center Name</th>
                                        <th className="p-2.5">Investor</th>
                                        <th className="p-2.5">Compliance Rate</th>
                                        <th className="p-2.5">Monthly Revenue</th>
                                        <th className="p-2.5">Open Tickets</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.franchises.map(f => (
                                        <tr key={f.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-purple-700">{f.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{f.name}</td>
                                            <td className="p-2.5">{f.investor}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{f.compliance}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{f.monthlyRev}</td>
                                            <td className="p-2.5 font-medium text-amber-600">{f.openTickets}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{f.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-purple-700'}`}>
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
