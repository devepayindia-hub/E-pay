'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'trainingManagerData_v1';

const defaultData = () => ({
    user: { name: 'Sunil Verma', role: 'Training Manager' },
    metrics: {
        activePrograms: 8,
        activeBatches: 12,
        enrolledEmployees: 145,
        avgAttendance: '96.2%',
        avgScore: '88.4%',
        certificationsIssued: 128,
        trainerPerformance: '94%'
    },
    batches: [
        { id: 'BAT-101', name: 'Batch 42 - Sales Excellence', trainer: 'Pooja Trainer', schedule: 'Mon-Wed 10:00 AM', enrolled: 25, status: 'In Progress' },
        { id: 'BAT-102', name: 'Batch 43 - BDE Prospecting', trainer: 'Amit Trainer', schedule: 'Tue-Thu 02:00 PM', enrolled: 20, status: 'Scheduled' },
        { id: 'BAT-103', name: 'Batch 44 - Product Mastery', trainer: 'Ravi Trainer', schedule: 'Fri-Sat 11:00 AM', enrolled: 30, status: 'In Progress' }
    ],
    assessments: [
        { id: 'ASS-301', title: 'Objection Handling & Closing Assessment', batch: 'Batch 42', avgScore: '89.5%', status: 'Graded' },
        { id: 'ASS-302', title: 'Product Knowledge Quiz v3', batch: 'Batch 44', avgScore: '84.2%', status: 'Pending Review' }
    ]
});

export default function TrainingManagerPage() {
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

    const handleCreateBatch = () => {
        openModal(
            '📚 Schedule New Training Batch',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Batch Name *</label>
                <input id="batchName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Batch 45 - Customer Service" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Trainer</label>
                <input id="batchTrainer" className="w-full border p-2 rounded text-sm mt-1" placeholder="Trainer name..." />
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Schedule</label>
                        <input id="batchSchedule" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Mon-Wed 10:00 AM" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Enrolled Count</label>
                        <input id="batchEnrolled" type="number" className="w-full border p-2 rounded text-sm mt-1" placeholder="25" />
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('batchName')?.value || 'New Batch';
                        const trainer = document.getElementById('batchTrainer')?.value || 'Trainer';
                        const schedule = document.getElementById('batchSchedule')?.value || 'Mon-Fri';
                        const enrolled = parseInt(document.getElementById('batchEnrolled')?.value) || 20;
                        const id = `BAT-${data.batches.length + 104}`;
                        const newB = { id, name, trainer, schedule, enrolled, status: 'Scheduled' };
                        updateData(prev => ({ ...prev, batches: [...prev.batches, newB] }));
                        showToast(`📚 Batch ${name} scheduled!`);
                        closeModal();
                    }} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded text-xs hover:bg-emerald-700">Schedule Batch</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">📚</div>
                    <div>
                        <div className="font-bold text-white text-base">Training <span className="text-emerald-400">Manager</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Lifecycle & Batches</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Training Dashboard', 'fa-house'],
                        ['batches', 'Batch Management', 'fa-layer-group'],
                        ['calendar', 'Trainer Calendar', 'fa-calendar'],
                        ['attendance', 'Attendance Tracking', 'fa-user-check'],
                        ['assessments', 'Assessments & Scores', 'fa-file-signature'],
                        ['certifications', 'Certifications', 'fa-award'],
                        ['reports', 'Training Reports', 'fa-file-lines'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Employee Training Lifecycle Command Center</div>
                    <button onClick={handleCreateBatch} className="px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">📚 Schedule Batch</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Active Programs</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.activePrograms}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Active Batches</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.batches.length}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Enrolled Staff</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.enrolledEmployees}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Avg Attendance</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.avgAttendance}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Avg Assessment Score</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.avgScore}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Certifications</div>
                            <div className="text-xl font-black text-indigo-600 mt-1">{data.metrics.certificationsIssued}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Trainer Score</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.trainerPerformance}</div>
                        </div>
                    </div>

                    {/* Batches Table */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📚 Training Batches & Schedules ({data.batches.length})</h3>
                            <button onClick={handleCreateBatch} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold">+ Schedule Batch</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">Batch ID</th>
                                        <th className="p-2.5">Program Name</th>
                                        <th className="p-2.5">Trainer</th>
                                        <th className="p-2.5">Schedule</th>
                                        <th className="p-2.5">Enrolled</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.batches.map(b => (
                                        <tr key={b.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-emerald-600">{b.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{b.name}</td>
                                            <td className="p-2.5">{b.trainer}</td>
                                            <td className="p-2.5 text-slate-500">{b.schedule}</td>
                                            <td className="p-2.5 font-bold">{b.enrolled}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{b.status}</span></td>
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
