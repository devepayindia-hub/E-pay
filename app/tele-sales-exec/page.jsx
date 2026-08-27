'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'teleSalesExecData_v1';

const defaultData = () => ({
    user: { name: 'Priya Sharma', role: 'Tele Sales Executive' },
    metrics: {
        callsMade: 142,
        connectedCalls: 98,
        talkTime: '4h 12m',
        interestedLeads: 24,
        scheduledCallbacks: 16,
        conversions: 7,
        teleRevenue: '₹3.4 L'
    },
    callingQueue: [
        { id: 'LEAD-801', name: 'Sanjay Shah', mobile: '9822114455', city: 'Pune', status: 'Interested', lastOutcome: 'Requested ePay Travel Brochure', callbackDate: '2026-08-24 11:00 AM' },
        { id: 'LEAD-802', name: 'Sunita Patil', mobile: '9822114466', city: 'Mumbai', status: 'Follow Up Required', lastOutcome: 'Busy - Call back tomorrow', callbackDate: '2026-08-25 02:30 PM' }
    ]
});

export default function TeleSalesExecPage() {
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

    const handleLogCall = () => {
        openModal(
            '📞 Record Outbound Call Outcome & Notes',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Lead Name & Number *</label>
                <input id="callLead" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Ramesh More (9876543210)" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Call Outcome</label>
                <select id="callOutcome" className="w-full border p-2 rounded text-sm mt-1">
                    <option value="Interested">Interested / Qualified</option>
                    <option value="Callback Requested">Callback Requested</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Converted">Converted & Payment Received</option>
                </select>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const lead = document.getElementById('callLead')?.value || 'Lead';
                        const outcome = document.getElementById('callOutcome')?.value || 'Interested';
                        updateData(prev => ({
                            ...prev,
                            metrics: { ...prev.metrics, callsMade: prev.metrics.callsMade + 1, connectedCalls: prev.metrics.connectedCalls + 1 }
                        }));
                        showToast(`📞 Call outcome for ${lead} recorded (${outcome})!`);
                        closeModal();
                    }} className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded text-xs hover:bg-cyan-700">Save Call Outcome</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white font-black flex items-center justify-center text-lg">📞</div>
                    <div>
                        <div className="font-bold text-white text-base">Tele Sales <span className="text-cyan-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Outbound Calling CRM</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['queue', 'Calling Queue', 'fa-list-ol'],
                        ['scripts', 'CRM Calling Scripts', 'fa-scroll'],
                        ['callbacks', 'Scheduled Callbacks', 'fa-clock'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-cyan-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Tele Sales Outbound Calling & Lead Qualification Portal</div>
                    <button onClick={handleLogCall} className="px-3.5 py-1.5 bg-cyan-600 text-white rounded text-xs font-semibold hover:bg-cyan-700">📞 Record Call</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Calls Made</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.callsMade}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Connected</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.connectedCalls}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Talk Time</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.talkTime}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Interested</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.interestedLeads}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Callbacks</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.scheduledCallbacks}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Conversions</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.conversions}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Tele Revenue</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.teleRevenue}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📞 Calling Queue & Follow-up Roster</h3>
                            <button onClick={handleLogCall} className="px-3 py-1 bg-cyan-600 text-white rounded text-xs font-semibold">+ Record Call</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">Lead ID</th>
                                        <th className="p-2.5">Name</th>
                                        <th className="p-2.5">Mobile</th>
                                        <th className="p-2.5">City</th>
                                        <th className="p-2.5">Last Outcome</th>
                                        <th className="p-2.5">Callback Time</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.callingQueue.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-cyan-600">{c.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{c.name}</td>
                                            <td className="p-2.5 font-mono text-slate-500">{c.mobile}</td>
                                            <td className="p-2.5">{c.city}</td>
                                            <td className="p-2.5 font-medium">{c.lastOutcome}</td>
                                            <td className="p-2.5 text-amber-600 font-semibold">{c.callbackDate}</td>
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
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-cyan-600'}`}>
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
