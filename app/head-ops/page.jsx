'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'headOpsData_v1';

const defaultData = () => ({
    user: { name: 'Vikramaditya Rao', role: 'Head of Operations' },
    metrics: {
        totalOperations: 1240,
        activeGalleries: 58,
        activeFranchises: 42,
        totalCustomers: 18500,
        pendingRequests: 24,
        openComplaints: 3,
        slaBreaches: 0,
        inventoryValuation: '₹14.5 Cr',
        operationalRevenue: '₹4.82 Cr'
    },
    workflows: [
        { id: 'OP-WF-01', title: 'KYC & Merchant Onboarding SOP', dept: 'Verification', sla: '24 Hours', compliance: '99.2%', status: 'Active' },
        { id: 'OP-WF-02', title: 'Gallery Asset Lifecycle & Maintenance', dept: 'Asset Mgmt', sla: '48 Hours', compliance: '97.8%', status: 'Active' }
    ],
    escalations: [
        { id: 'ESC-901', issue: 'High-Value Settlement Delay (Mumbai Gallery)', severity: 'Critical', reportedBy: 'Ops Mgr', status: 'Pending Review' }
    ]
});

export default function HeadOpsPage() {
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

    const handleResolveEscalation = (id) => {
        updateData(prev => ({
            ...prev,
            escalations: prev.escalations.filter(e => e.id !== id)
        }));
        showToast(`✅ Operational escalation ${id} resolved!`);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-black flex items-center justify-center text-lg">⚙️</div>
                    <div>
                        <div className="font-bold text-white text-base">Head of <span className="text-emerald-400">Operations</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Ecosystem Control Center</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Executive Ops Dashboard', 'fa-house'],
                        ['galleries', 'Galleries & Franchises', 'fa-store'],
                        ['sla', 'SLA Compliance & Audits', 'fa-shield-halved'],
                        ['escalations', 'Critical Escalations', 'fa-triangle-exclamation'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-emerald-800 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Head of Operations Organization-Wide Command Center</div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-xs">SLA: 99.8%</span>
                    </div>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-3 sm:grid-cols-9 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Total Ops</div>
                            <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.totalOperations}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Galleries</div>
                            <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.activeGalleries}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Franchises</div>
                            <div className="text-lg font-black text-purple-600 mt-1">{data.metrics.activeFranchises}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Customers</div>
                            <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.totalCustomers}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Pending Req</div>
                            <div className="text-lg font-black text-amber-600 mt-1">{data.metrics.pendingRequests}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Complaints</div>
                            <div className="text-lg font-black text-rose-600 mt-1">{data.metrics.openComplaints}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">SLA Breaches</div>
                            <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.slaBreaches}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Inventory</div>
                            <div className="text-lg font-black text-indigo-600 mt-1">{data.metrics.inventoryValuation}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Ops Rev</div>
                            <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.operationalRevenue}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                        <h3 className="font-bold text-sm text-slate-800">⚠️ Critical Escalations Queue</h3>
                        {data.escalations.map(e => (
                            <div key={e.id} className="p-3 border border-rose-200 bg-rose-50 rounded-lg flex justify-between items-center text-xs">
                                <div><strong className="text-rose-900">{e.id}: {e.issue}</strong> — Reported by {e.reportedBy}</div>
                                <button onClick={() => handleResolveEscalation(e.id)} className="px-3 py-1 bg-emerald-600 text-white rounded font-semibold">Resolve Escalation</button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">⚙️ Operational SOP Workflows & SLA Compliance</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Workflow Title</th>
                                        <th className="p-2.5">Department</th>
                                        <th className="p-2.5">SLA Target</th>
                                        <th className="p-2.5">SLA Compliance</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.workflows.map(w => (
                                        <tr key={w.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-emerald-800">{w.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{w.title}</td>
                                            <td className="p-2.5 text-slate-500">{w.dept}</td>
                                            <td className="p-2.5 font-medium">{w.sla}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{w.compliance}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{w.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-800'}`}>
                    {toast.msg}
                </div>
            )}
        </div>
    );
}
