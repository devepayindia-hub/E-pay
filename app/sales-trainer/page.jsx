'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'salesTrainerData_v1';

const defaultData = () => ({
    user: { name: 'Manish Malhotra', role: 'Sales Trainer' },
    metrics: {
        conversionImprovement: '+18.4%',
        salesProductivity: '92.5%',
        trainingCompletion: '96%',
        callQualityScore: '4.8/5',
        lostLeadsAnalyzed: 142
    },
    reviews: [
        { id: 'REV-01', agent: 'Rahul BDE', callId: 'CALL-8821', score: '94%', objectionHandling: 'Excellent', notes: 'Great rapport building & handling pricing objection.' },
        { id: 'REV-02', agent: 'Priya Telecaller', callId: 'CALL-8824', score: '82%', objectionHandling: 'Needs Work', notes: 'Review script on ePay Travel package add-ons.' }
    ]
});

export default function SalesTrainerPage() {
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

    const handleAuditCall = () => {
        openModal(
            '🎧 Conduct Call Quality & Conversation Audit',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Agent Name</label>
                <input id="audAgent" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Suresh BDE" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Call Recording ID</label>
                <input id="audCallId" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. CALL-9912" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Quality Score (%)</label>
                        <input id="audScore" type="number" className="w-full border p-2 rounded text-sm mt-1" placeholder="90" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Objection Handling</label>
                        <select id="audObjection" className="w-full border p-2 rounded text-sm mt-1">
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Needs Improvement">Needs Improvement</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const agent = document.getElementById('audAgent')?.value || 'Agent';
                        const callId = document.getElementById('audCallId')?.value || 'CALL-000';
                        const score = (document.getElementById('audScore')?.value || '90') + '%';
                        const objectionHandling = document.getElementById('audObjection')?.value || 'Good';
                        const newR = { id: `REV-0${data.reviews.length + 1}`, agent, callId, score, objectionHandling, notes: 'Audit completed.' };
                        updateData(prev => ({ ...prev, reviews: [...prev.reviews, newR] }));
                        showToast(`🎧 Call audit for ${agent} saved!`);
                        closeModal();
                    }} className="px-4 py-2 bg-purple-600 text-white font-semibold rounded text-xs hover:bg-purple-700">Submit Audit</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-lg">🎧</div>
                    <div>
                        <div className="font-bold text-white text-base">Sales <span className="text-purple-400">Trainer</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Conversion & Call Quality</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['audits', 'Call Quality Audits', 'fa-headset'],
                        ['objections', 'Objection Handling', 'fa-shield-halved'],
                        ['lost-leads', 'Lost Lead Analysis', 'fa-user-slash'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-purple-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Sales Conversion & Coaching Portal</div>
                    <button onClick={handleAuditCall} className="px-3.5 py-1.5 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700">🎧 Audit Call</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Conv. Improvement</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.conversionImprovement}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Sales Productivity</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.salesProductivity}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Training Completion</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.trainingCompletion}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Call Quality Score</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.callQualityScore}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Lost Leads Analyzed</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.lostLeadsAnalyzed}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🎧 Call Quality & Conversation Reviews</h3>
                            <button onClick={handleAuditCall} className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-semibold">+ Audit Call</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Agent</th>
                                        <th className="p-2.5">Call ID</th>
                                        <th className="p-2.5">Quality Score</th>
                                        <th className="p-2.5">Objection Handling</th>
                                        <th className="p-2.5">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.reviews.map(r => (
                                        <tr key={r.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-purple-600">{r.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{r.agent}</td>
                                            <td className="p-2.5 text-slate-500">{r.callId}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{r.score}</td>
                                            <td className="p-2.5">{r.objectionHandling}</td>
                                            <td className="p-2.5 text-slate-500">{r.notes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-purple-600'}`}>
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
