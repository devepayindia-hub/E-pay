'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'opsMgrData_v1';

const defaultData = () => ({
    user: { name: 'Amitabh Joshi', role: 'Operations Manager' },
    metrics: {
        dailyActivities: 340,
        taskCompletionRate: '96.5%',
        empProductivity: '92%',
        pendingCases: 14,
        slaCompliance: '98.6%',
        approvedRequests: 48
    },
    tasks: [
        { id: 'TSK-101', title: 'Verify Hinjewadi Gallery Inventory Audit', assignee: 'Ops Exec Suresh', dept: 'Gallery Ops', priority: 'High', status: 'In Progress' },
        { id: 'TSK-102', title: 'Process Customer Settlement Request #8821', assignee: 'Ops Exec Neha', dept: 'Finance Ops', priority: 'Medium', status: 'Completed' }
    ]
});

export default function OpsMgrPage() {
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

    const handleAssignTask = () => {
        openModal(
            '📌 Assign Operational Task',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Task Title *</label>
                <input id="tskTitle" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Audit POS Merchant Terminals" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Assignee</label>
                <input id="tskAssignee" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Suresh Ops Executive" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const title = document.getElementById('tskTitle')?.value || 'New Ops Task';
                        const assignee = document.getElementById('tskAssignee')?.value || 'Ops Exec';
                        const newT = { id: `TSK-10${data.tasks.length + 1}`, title, assignee, dept: 'Operations', priority: 'Medium', status: 'In Progress' };
                        updateData(prev => ({ ...prev, tasks: [...prev.tasks, newT] }));
                        showToast(`📌 Operational task assigned to ${assignee}!`);
                        closeModal();
                    }} className="px-4 py-2 bg-teal-700 text-white font-semibold rounded text-xs hover:bg-teal-800">Assign Task</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-700 text-white font-black flex items-center justify-center text-lg">🎛️</div>
                    <div>
                        <div className="font-bold text-white text-base">Ops <span className="text-teal-400">Manager</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Daily Ops & Task Allocation</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['tasks', 'Operational Tasks', 'fa-list-check'],
                        ['approvals', 'Ops Approvals', 'fa-check-double'],
                        ['sla', 'SLA Tracking', 'fa-clock'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-teal-700 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Daily Business Operations Management Portal</div>
                    <button onClick={handleAssignTask} className="px-3.5 py-1.5 bg-teal-700 text-white rounded text-xs font-semibold hover:bg-teal-800">📌 Assign Task</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Daily Activities</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.dailyActivities}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Task Completion</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.taskCompletionRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Productivity</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.empProductivity}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Pending Cases</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.pendingCases}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">SLA Compliance</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.slaCompliance}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Approved Requests</div>
                            <div className="text-xl font-black text-teal-700 mt-1">{data.metrics.approvedRequests}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📌 Active Operational Tasks & Team Allocation</h3>
                            <button onClick={handleAssignTask} className="px-3 py-1 bg-teal-700 text-white rounded text-xs font-semibold">+ Assign Task</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Task Title</th>
                                        <th className="p-2.5">Assignee</th>
                                        <th className="p-2.5">Department</th>
                                        <th className="p-2.5">Priority</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.tasks.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-teal-700">{t.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{t.title}</td>
                                            <td className="p-2.5">{t.assignee}</td>
                                            <td className="p-2.5 text-slate-500">{t.dept}</td>
                                            <td className="p-2.5 font-bold text-amber-600">{t.priority}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{t.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-teal-700'}`}>
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
