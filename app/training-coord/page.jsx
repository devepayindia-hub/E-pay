'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'trainingCoordData_v1';

const defaultData = () => ({
    user: { name: 'Anjali Nair', role: 'Training & Education Coordinator' },
    metrics: {
        scheduledSessions: 18,
        notificationsSent: 340,
        attendanceRecorded: '98.2%',
        uploadedMaterials: 42,
        activeCertificates: 210
    },
    schedules: [
        { id: 'SCH-01', batch: 'Batch 42', trainer: 'Pooja Trainer', date: '2026-08-25 10:00 AM', room: 'Hall A / Zoom #1', status: 'Scheduled' },
        { id: 'SCH-02', batch: 'Batch 43', trainer: 'Amit Trainer', date: '2026-08-26 02:00 PM', room: 'Hall B / Zoom #2', status: 'Scheduled' }
    ]
});

export default function TrainingCoordPage() {
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

    const handleScheduleSession = () => {
        openModal(
            '📅 Schedule Training Session & Send Invites',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Batch / Program *</label>
                <input id="schBatch" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Batch 45 - SOP & Legal" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Trainer</label>
                <input id="schTrainer" className="w-full border p-2 rounded text-sm mt-1" placeholder="Trainer name..." />
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Date & Time</label>
                        <input id="schDate" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. 2026-08-27 10:00 AM" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Room / Online Link</label>
                        <input id="schRoom" className="w-full border p-2 rounded text-sm mt-1" placeholder="Hall C / Zoom Link" />
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const batch = document.getElementById('schBatch')?.value || 'New Session';
                        const trainer = document.getElementById('schTrainer')?.value || 'Trainer';
                        const date = document.getElementById('schDate')?.value || 'Tomorrow 10:00 AM';
                        const room = document.getElementById('schRoom')?.value || 'Online Zoom';
                        const newS = { id: `SCH-0${data.schedules.length + 1}`, batch, trainer, date, room, status: 'Scheduled' };
                        updateData(prev => ({ ...prev, schedules: [...prev.schedules, newS] }));
                        showToast(`📅 Session scheduled & invites sent to participants!`);
                        closeModal();
                    }} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded text-xs hover:bg-blue-700">Schedule & Notify</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-lg">📅</div>
                    <div>
                        <div className="font-bold text-white text-base">Training <span className="text-blue-400">Coordinator</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Session Admin & Schedule</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['schedules', 'Session Schedules', 'fa-calendar-days'],
                        ['notifications', 'Notifications & Invites', 'fa-bell'],
                        ['attendance', 'Attendance Reports', 'fa-clipboard-user'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Training Administration & Scheduling Portal</div>
                    <button onClick={handleScheduleSession} className="px-3.5 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700">📅 Schedule Session</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Sessions Scheduled</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.scheduledSessions}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Invites Sent</div>
                            <div className="text-xl font-black text-blue-600 mt-1">{data.metrics.notificationsSent}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Attendance Rec.</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.attendanceRecorded}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Materials Uploaded</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.uploadedMaterials}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Active Certificates</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.activeCertificates}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📅 Training Sessions & Invites</h3>
                            <button onClick={handleScheduleSession} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold">+ Schedule</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Batch Name</th>
                                        <th className="p-2.5">Trainer</th>
                                        <th className="p-2.5">Date & Time</th>
                                        <th className="p-2.5">Room / Venue</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.schedules.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-blue-600">{s.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{s.batch}</td>
                                            <td className="p-2.5">{s.trainer}</td>
                                            <td className="p-2.5 text-slate-500">{s.date}</td>
                                            <td className="p-2.5 font-medium">{s.room}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">{s.status}</span></td>
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
