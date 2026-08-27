'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'headTrainingData_v1';

const defaultData = () => ({
    user: { name: 'Dr. Vikramaditya', role: 'Head of Training & Business Development' },
    metrics: {
        revenueGenerated: '₹3.42 Cr',
        leadConversionRate: '28.4%',
        franchiseAcquisition: 14,
        targetAchievement: '94%',
        trainingCompletion: '92%',
        teamProductivity: '91%',
        employeeConvRate: '24.8%',
        revenuePerEmployee: '₹1.85 L'
    },
    targets: [
        { id: 1, assignee: 'Training Managers', monthly: '95% Completion', quarterly: '98% Certified', status: 'On Track' },
        { id: 2, assignee: 'BDMs & BDEs', monthly: '₹1.2 Cr Revenue', quarterly: '₹3.5 Cr Revenue', status: 'Achieved' },
        { id: 3, assignee: 'Sales Managers', monthly: '28% Conversion', quarterly: '32% Conversion', status: 'In Progress' }
    ],
    pipeline: [
        { id: 'FR-101', name: 'Pune Central Franchise', stage: 'Agreement', value: '₹45 L', owner: 'Rahul BDM' },
        { id: 'FR-102', name: 'Mumbai Andheri Gallery', stage: 'Site Visit', value: '₹60 L', owner: 'Sneha BDE' },
        { id: 'FR-103', name: 'Nagpur East Center', stage: 'Negotiation', value: '₹35 L', owner: 'Amit BDM' }
    ],
    trainings: [
        { id: 'TRN-201', program: 'Sales Capability & Objection Handling', batch: 'Batch 42', enrolled: 45, completed: 42, passRate: '93.3%' },
        { id: 'TRN-202', program: 'Franchise Acquisition Strategy', batch: 'Batch 18', enrolled: 24, completed: 24, passRate: '100%' },
        { id: 'TRN-203', program: 'Product Knowledge & ePay Ecosystem', batch: 'Batch 56', enrolled: 60, completed: 52, passRate: '86.6%' }
    ],
    approvals: [
        { id: 'APP-801', title: 'Major Franchise Deal (Surat Center - ₹50L)', requestedBy: 'BDM Rahul', status: 'Pending' },
        { id: 'APP-802', title: 'Sales Capability Incentive Program', requestedBy: 'Training Mgr', status: 'Pending' }
    ]
});

export default function HeadTrainingPage() {
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

    const handleAssignTarget = () => {
        openModal(
            '🎯 Assign Target to Manager / Team',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Assignee (Training Manager / BDM / Sales Manager)</label>
                <input id="targetAssignee" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Sales Managers" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Monthly Target</label>
                        <input id="targetMonthly" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ₹1.5 Cr / 30% Conv" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Quarterly Target</label>
                        <input id="targetQuarterly" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ₹4.5 Cr / 35% Conv" />
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const assignee = document.getElementById('targetAssignee')?.value || 'BDMs';
                        const monthly = document.getElementById('targetMonthly')?.value || '₹1.5 Cr';
                        const quarterly = document.getElementById('targetQuarterly')?.value || '₹4.5 Cr';
                        const newT = { id: Date.now(), assignee, monthly, quarterly, status: 'Assigned' };
                        updateData(prev => ({ ...prev, targets: [...prev.targets, newT] }));
                        showToast(`🎯 Target assigned to ${assignee}!`);
                        closeModal();
                    }} className="px-4 py-2 bg-green-600 text-white font-semibold rounded text-xs hover:bg-green-700">Assign Target</button>
                </div>
            </div>
        );
    };

    const handleApproval = (id, action) => {
        updateData(prev => ({
            ...prev,
            approvals: prev.approvals.filter(a => a.id !== id)
        }));
        showToast(`✅ Opportunity ${id} ${action}!`);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-600 text-white font-black flex items-center justify-center text-lg">🎓</div>
                    <div>
                        <div className="font-bold text-white text-base">Head of <span className="text-green-400">Training</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">& Biz Development</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Executive Dashboard', 'fa-house'],
                        ['leads', 'Lead Management', 'fa-user-plus'],
                        ['pipeline', 'Sales Pipeline', 'fa-chart-line'],
                        ['franchise', 'Franchise CRM', 'fa-store'],
                        ['training', 'Training Programs', 'fa-graduation-cap'],
                        ['targets', 'Targets & Assignments', 'fa-bullseye'],
                        ['performance', 'Team Performance', 'fa-trophy'],
                        ['approvals', 'Business Approvals', 'fa-check-double'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-green-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Head of Training & Business Development Portal</div>
                    <button onClick={handleAssignTarget} className="px-3.5 py-1.5 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700">🎯 Assign Target</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    {/* Top KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Revenue</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.revenueGenerated}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Lead Conv.</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.leadConversionRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Franchise Acq.</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.franchiseAcquisition}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Target Ach.</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.targetAchievement}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Training Comp.</div>
                            <div className="text-xl font-black text-indigo-600 mt-1">{data.metrics.trainingCompletion}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Team Productivity</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.teamProductivity}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Emp. Conv. Rate</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.employeeConvRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Rev / Employee</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.revenuePerEmployee}</div>
                        </div>
                    </div>

                    {/* Targets Table */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🎯 Assigned Business & Training Targets</h3>
                            <button onClick={handleAssignTarget} className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold">+ New Target</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">Assignee</th>
                                        <th className="p-2.5">Monthly Target</th>
                                        <th className="p-2.5">Quarterly Target</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.targets.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-slate-900">{t.assignee}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{t.monthly}</td>
                                            <td className="p-2.5 text-slate-500">{t.quarterly}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">{t.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Approvals Queue */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                        <h3 className="font-bold text-sm text-slate-800">✍️ Major Business & Training Opportunity Approvals</h3>
                        {data.approvals.map(a => (
                            <div key={a.id} className="p-3 border rounded-lg flex justify-between items-center text-xs">
                                <div><strong>{a.title}</strong> — Requested by {a.requestedBy}</div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleApproval(a.id, 'Approved')} className="px-3 py-1 bg-green-600 text-white rounded font-semibold">Approve</button>
                                    <button onClick={() => handleApproval(a.id, 'Rejected')} className="px-3 py-1 bg-rose-600 text-white rounded font-semibold">Reject</button>
                                </div>
                            </div>
                        ))}
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
