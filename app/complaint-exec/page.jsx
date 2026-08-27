'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'complaintExecData_v1';

const defaultData = () => ({
    user: { name: 'Sunil Rao', role: 'Complaint & Escalation Executive' },
    metrics: {
        totalTickets: 24,
        openComplaints: 4,
        escalatedCases: 1,
        resolvedToday: 18,
        slaComplianceRate: '97.5%',
        customerSatisfactionScore: '4.8/5'
    },
    tickets: [
        { id: 'TKT-901', customer: 'Rajesh Patel', category: 'POS Merchant Payout', sla: '4 Hours', stage: 'Escalated', feedback: 'Pending Confirmation' },
        { id: 'TKT-902', customer: 'Swastik Retailers', category: 'Travel Ticket Refund', sla: '12 Hours', stage: 'In Progress', feedback: 'Pending Confirmation' }
    ]
});

export default function ComplaintExecPage() {
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

    const handleCreateTicket = () => {
        openModal(
            '⚠️ Log Complaint Ticket',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Customer Name *</label>
                <input id="tktCust" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Ramesh Deshmukh" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Complaint Category</label>
                <select id="tktCat" className="w-full border p-2 rounded text-sm mt-1">
                    <option value="POS Merchant Payout">POS Merchant Payout</option>
                    <option value="Travel Package Refund">Travel Package Refund</option>
                    <option value="KYC Verification Delay">KYC Verification Delay</option>
                    <option value="Gallery Service Issue">Gallery Service Issue</option>
                </select>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const customer = document.getElementById('tktCust')?.value || 'Customer';
                        const category = document.getElementById('tktCat')?.value || 'General Complaint';
                        const newT = { id: `TKT-90${data.tickets.length + 1}`, customer, category, sla: '6 Hours', stage: 'New', feedback: 'Pending' };
                        updateData(prev => ({
                            ...prev,
                            tickets: [...prev.tickets, newT],
                            metrics: { ...prev.metrics, totalTickets: prev.metrics.totalTickets + 1, openComplaints: prev.metrics.openComplaints + 1 }
                        }));
                        showToast(`⚠️ Complaint ticket for ${customer} logged!`);
                        closeModal();
                    }} className="px-4 py-2 bg-rose-600 text-white font-semibold rounded text-xs hover:bg-rose-700">Create Ticket</button>
                </div>
            </div>
        );
    };

    const handleAdvanceStage = (id) => {
        const stages = ['New', 'Assigned', 'In Progress', 'Escalated', 'Resolved', 'Customer Confirmation', 'Closed'];
        updateData(prev => ({
            ...prev,
            tickets: prev.tickets.map(t => {
                if (t.id === id) {
                    const currentIdx = stages.indexOf(t.stage);
                    const nextStage = stages[Math.min(currentIdx + 1, stages.length - 1)];
                    return { ...t, stage: nextStage };
                }
                return t;
            })
        }));
        showToast(`⚡ Ticket ${id} moved to next stage!`);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center text-lg">⚠️</div>
                    <div>
                        <div className="font-bold text-white text-base">Complaint <span className="text-rose-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">7-Stage Escalation Engine</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['tickets', 'Complaint Tickets', 'fa-ticket'],
                        ['escalations', 'Escalated Cases', 'fa-triangle-exclamation'],
                        ['sla', 'SLA Tracking', 'fa-clock'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-rose-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Customer Complaint & Ticket Escalation Command Portal</div>
                    <button onClick={handleCreateTicket} className="px-3.5 py-1.5 bg-rose-600 text-white rounded text-xs font-semibold hover:bg-rose-700">⚠️ Log Ticket</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    {/* Ticket Flow Stage Indicator Bar */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                        <div className="text-xs font-bold text-slate-700 mb-2">🔄 Ticket Lifecycle Flow</div>
                        <div className="flex gap-2 text-[10px] font-bold text-slate-600">
                            {['New', 'Assigned', 'In Progress', 'Escalated', 'Resolved', 'Customer Confirmation', 'Closed'].map((stg, idx) => (
                                <div key={stg} className={`px-2.5 py-1 rounded border shrink-0 ${idx === 3 ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 border-slate-200'}`}>
                                    {stg}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Tickets</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.totalTickets}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Open Complaints</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.openComplaints}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Escalated Cases</div>
                            <div className="text-xl font-black text-rose-600 mt-1">{data.metrics.escalatedCases}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Resolved Today</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.resolvedToday}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">SLA Compliance</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.slaComplianceRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">CSAT Score</div>
                            <div className="text-xl font-black text-purple-600 mt-1">⭐ {data.metrics.customerSatisfactionScore}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">⚠️ Active Complaint Tickets & Lifecycle Progression</h3>
                            <button onClick={handleCreateTicket} className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-semibold">+ Log Ticket</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">Ticket ID</th>
                                        <th className="p-2.5">Customer Name</th>
                                        <th className="p-2.5">Complaint Category</th>
                                        <th className="p-2.5">SLA Target</th>
                                        <th className="p-2.5">Current Stage</th>
                                        <th className="p-2.5">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.tickets.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-rose-600">{t.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{t.customer}</td>
                                            <td className="p-2.5 font-medium">{t.category}</td>
                                            <td className="p-2.5 text-slate-500">{t.sla}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">{t.stage}</span></td>
                                            <td className="p-2.5">
                                                <button onClick={() => handleAdvanceStage(t.id)} className="px-2.5 py-1 bg-slate-900 text-white rounded text-[10px] font-bold hover:bg-slate-800">Advance Stage ➔</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-rose-600'}`}>
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
