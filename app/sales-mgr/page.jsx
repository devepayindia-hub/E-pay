'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'salesMgrData_v1';

const defaultData = () => ({
    user: { name: 'Vikramaditya', role: 'Sales Manager' },
    metrics: {
        teamRevenue: '₹1.15 Cr',
        leadsAllocated: 240,
        proposalsApproved: 42,
        pipelineValue: '₹2.80 Cr',
        convRate: '29.4%',
        targetAch: '92%'
    },
    executives: [
        { id: 'SE-01', name: 'Amit Kumar', allocatedLeads: 60, proposalsSent: 18, wonDeals: 8, revenue: '₹32 L', targetAch: '94%' },
        { id: 'SE-02', name: 'Pooja Hegde', allocatedLeads: 65, proposalsSent: 22, wonDeals: 11, revenue: '₹48 L', targetAch: '96%' }
    ]
});

export default function SalesMgrPage() {
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

    const handleApproveProposal = () => {
        openModal(
            '📄 Approve High-Value Sales Proposal',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Proposal / Opportunity ID *</label>
                <input id="propId" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. PROP-8841 (Surat B2B Deal)" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Value & Terms</label>
                <input id="propVal" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ₹25,00,000 (10% Discount Approved)" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const id = document.getElementById('propId')?.value || 'PROP-001';
                        const val = document.getElementById('propVal')?.value || '₹10,00,000';
                        updateData(prev => ({
                            ...prev,
                            metrics: { ...prev.metrics, proposalsApproved: prev.metrics.proposalsApproved + 1 }
                        }));
                        showToast(`📄 Proposal ${id} (${val}) approved!`);
                        closeModal();
                    }} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded text-xs hover:bg-emerald-700">Approve Proposal</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">📈</div>
                    <div>
                        <div className="font-bold text-white text-base">Sales <span className="text-emerald-400">Manager</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Revenue & Proposal Approvals</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['team', 'Sales Executives', 'fa-user-group'],
                        ['pipeline', 'Sales Pipeline Tower', 'fa-chart-line'],
                        ['proposals', 'Proposal Approvals', 'fa-file-signature'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Sales Operations & Executive Management Portal</div>
                    <button onClick={handleApproveProposal} className="px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">📄 Approve Proposal</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Team Revenue</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.teamRevenue}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Leads Allocated</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.leadsAllocated}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Proposals Approved</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.proposalsApproved}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Pipeline Value</div>
                            <div className="text-xl font-black text-indigo-600 mt-1">{data.metrics.pipelineValue}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Conv. Rate</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.convRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Target Ach.</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.targetAch}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📈 Sales Executive Performance</h3>
                            <button onClick={handleApproveProposal} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold">+ Approve Proposal</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Name</th>
                                        <th className="p-2.5">Leads Allocated</th>
                                        <th className="p-2.5">Proposals Sent</th>
                                        <th className="p-2.5">Deals Won</th>
                                        <th className="p-2.5">Revenue</th>
                                        <th className="p-2.5">Target Ach.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.executives.map(e => (
                                        <tr key={e.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-emerald-600">{e.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{e.name}</td>
                                            <td className="p-2.5">{e.allocatedLeads}</td>
                                            <td className="p-2.5 font-medium">{e.proposalsSent}</td>
                                            <td className="p-2.5 font-bold">{e.wonDeals}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{e.revenue}</td>
                                            <td className="p-2.5 font-bold text-purple-600">{e.targetAch}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
}
