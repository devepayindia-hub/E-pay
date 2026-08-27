'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'salesExecData_v1';

const defaultData = () => ({
    user: { name: 'Amit Kumar', role: 'Sales Executive' },
    metrics: {
        assignedLeads: 45,
        callsMade: 180,
        meetingsScheduled: 14,
        quotationsSent: 18,
        closedWonDeals: 8,
        revenueClosed: '₹32.5 L'
    },
    deals: [
        { id: 'DEAL-101', customer: 'Surat Textiles Group', stage: 'Proposal Sent', value: '₹12.5 L', expectedClosing: '2026-08-30' },
        { id: 'DEAL-102', customer: 'Nashik Agro Traders', stage: 'Negotiation', value: '₹8.0 L', expectedClosing: '2026-08-28' }
    ]
});

export default function SalesExecPage() {
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

    const handleCreateQuotation = () => {
        openModal(
            '💵 Generate & Send Quotation',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Customer Name *</label>
                <input id="qCust" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Pune Tech Solutions" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Quotation Amount</label>
                <input id="qAmt" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ₹5,00,000" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const cust = document.getElementById('qCust')?.value || 'Customer';
                        const val = document.getElementById('qAmt')?.value || '₹2,50,000';
                        const newD = { id: `DEAL-10${data.deals.length + 1}`, customer: cust, stage: 'Proposal Sent', value: val, expectedClosing: new Date().toISOString().slice(0, 10) };
                        updateData(prev => ({
                            ...prev,
                            deals: [...prev.deals, newD],
                            metrics: { ...prev.metrics, quotationsSent: prev.metrics.quotationsSent + 1 }
                        }));
                        showToast(`💵 Quotation for ${cust} (${val}) generated!`);
                        closeModal();
                    }} className="px-4 py-2 bg-green-600 text-white font-semibold rounded text-xs hover:bg-green-700">Send Quotation</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-600 text-white font-black flex items-center justify-center text-lg">💵</div>
                    <div>
                        <div className="font-bold text-white text-base">Sales <span className="text-green-400">Executive</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Quotations & Closing</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['leads', 'Assigned Leads', 'fa-user-tag'],
                        ['deals', 'My Pipeline & Deals', 'fa-handshake-simple'],
                        ['quotations', 'Quotations & Invoices', 'fa-file-invoice-dollar'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-green-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Sales Executive Deal Management & Quotations Portal</div>
                    <button onClick={handleCreateQuotation} className="px-3.5 py-1.5 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700">💵 Send Quotation</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Assigned Leads</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.assignedLeads}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Calls Made</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.callsMade}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Meetings</div>
                            <div className="text-xl font-black text-indigo-600 mt-1">{data.metrics.meetingsScheduled}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Quotations Sent</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.quotationsSent}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Deals Won</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.closedWonDeals}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Revenue Closed</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.revenueClosed}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">💵 Active Deals & Pipeline</h3>
                            <button onClick={handleCreateQuotation} className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold">+ Send Quotation</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Customer Name</th>
                                        <th className="p-2.5">Pipeline Stage</th>
                                        <th className="p-2.5">Deal Value</th>
                                        <th className="p-2.5">Expected Closing</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.deals.map(d => (
                                        <tr key={d.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-green-600">{d.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{d.customer}</td>
                                            <td className="p-2.5 font-medium">{d.stage}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{d.value}</td>
                                            <td className="p-2.5 text-slate-500">{d.expectedClosing}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
}
