'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'bdTrainerData_v1';

const defaultData = () => ({
    user: { name: 'Sanjay Dutt', role: 'Business Development Trainer' },
    metrics: {
        trainedBDMs: 14,
        trainedBDEs: 48,
        prospectingScore: '91.2%',
        franchiseAcqTrainingScore: '94.5%',
        coachingSessionsDone: 64
    },
    sessions: [
        { id: 'BDC-101', topic: 'High-Value Prospecting & Cold Outreach', coach: 'Sanjay Dutt', attendeeCount: 18, rating: '4.9/5' },
        { id: 'BDC-102', topic: 'Franchise Site Visit & Legal Pitch', coach: 'Sanjay Dutt', attendeeCount: 12, rating: '4.8/5' }
    ]
});

export default function BDTrainerPage() {
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

    const handleScheduleCoaching = () => {
        openModal(
            '🎯 Schedule BD Coaching Session',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Coaching Topic *</label>
                <input id="bdTopic" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Lead Qualification Techniques" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Target Attendees</label>
                <input id="bdAttendees" type="number" className="w-full border p-2 rounded text-sm mt-1" placeholder="15" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const topic = document.getElementById('bdTopic')?.value || 'BD Prospecting Coaching';
                        const attendeeCount = parseInt(document.getElementById('bdAttendees')?.value) || 12;
                        const newS = { id: `BDC-10${data.sessions.length + 1}`, topic, coach: 'Sanjay Dutt', attendeeCount, rating: '5.0/5' };
                        updateData(prev => ({ ...prev, sessions: [...prev.sessions, newS] }));
                        showToast(`🎯 Coaching session "${topic}" scheduled!`);
                        closeModal();
                    }} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded text-xs hover:bg-indigo-700">Schedule Session</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg">🎯</div>
                    <div>
                        <div className="font-bold text-white text-base">BD <span className="text-indigo-400">Trainer</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Prospecting & Acquisition</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['sessions', 'Weekly Coaching', 'fa-chalkboard-user'],
                        ['franchise-acq', 'Franchise Acq Training', 'fa-building'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Business Development Training Portal</div>
                    <button onClick={handleScheduleCoaching} className="px-3.5 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700">🎯 Schedule Coaching</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Trained BDMs</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.trainedBDMs}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Trained BDEs</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.trainedBDEs}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Prospecting Score</div>
                            <div className="text-xl font-black text-indigo-600 mt-1">{data.metrics.prospectingScore}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Franchise Acq Score</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.franchiseAcqTrainingScore}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Coaching Sessions</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.coachingSessionsDone}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🎯 BD Coaching & Prospecting Sessions</h3>
                            <button onClick={handleScheduleCoaching} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold">+ New Session</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Topic</th>
                                        <th className="p-2.5">Coach</th>
                                        <th className="p-2.5">Attendees</th>
                                        <th className="p-2.5">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.sessions.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-indigo-600">{s.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{s.topic}</td>
                                            <td className="p-2.5">{s.coach}</td>
                                            <td className="p-2.5">{s.attendeeCount} staff</td>
                                            <td className="p-2.5 font-bold text-emerald-600">⭐ {s.rating}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-indigo-600'}`}>
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
