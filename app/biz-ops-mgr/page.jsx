'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'bizOpsMgrData_v1';

const defaultData = () => ({
    user: { name: 'Manish Verma', role: 'Business Operations Manager' },
    metrics: {
        processEfficiency: '94.6%',
        bottlenecksResolved: 18,
        activeSopWorkflows: 14,
        avgSlaAdherence: '98.5%',
        productivityImprovement: '+14.2%'
    },
    sops: [
        { id: 'SOP-101', name: 'Digital KYC & Verification Standard Operating Procedure v3', dept: 'Verification', slaTarget: '24 Hours', efficiencyScore: '96%', status: 'Active' },
        { id: 'SOP-102', name: 'Merchant Settlement & Refund Resolution SOP', dept: 'Finance Ops', slaTarget: '12 Hours', efficiencyScore: '94%', status: 'Active' }
    ]
});

export default function BizOpsMgrPage() {
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

    const handleCreateSop = () => {
        openModal(
            '📐 Create Business Process SOP & SLA',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">SOP Title *</label>
                <input id="sopTitle" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Gallery Inventory Transfer SOP" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Department</label>
                <input id="sopDept" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Inventory Ops" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Target SLA</label>
                <input id="sopSLA" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. 6 Hours" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('sopTitle')?.value || 'New Process SOP';
                        const dept = document.getElementById('sopDept')?.value || 'Operations';
                        const slaTarget = document.getElementById('sopSLA')?.value || '24 Hours';
                        const newS = { id: `SOP-10${data.sops.length + 1}`, name, dept, slaTarget, efficiencyScore: '100%', status: 'Active' };
                        updateData(prev => ({ ...prev, sops: [...prev.sops, newS] }));
                        showToast(`📐 SOP "${name}" deployed!`);
                        closeModal();
                    }} className="px-4 py-2 bg-indigo-700 text-white font-semibold rounded text-xs hover:bg-indigo-800">Deploy SOP</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white font-black flex items-center justify-center text-lg">📐</div>
                    <div>
                        <div className="font-bold text-white text-base">Biz Ops <span className="text-indigo-400">Mgr</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Process Efficiency & SOPs</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['sops', 'Business SOP Workflows', 'fa-diagram-project'],
                        ['bottlenecks', 'Bottleneck Analysis', 'fa-[#f59e0b] fa-filter-circle-xmark'],
                        ['sla', 'Department SLAs', 'fa-clock'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-indigo-700 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Business Process Optimization & Efficiency Command Center</div>
                    <button onClick={handleCreateSop} className="px-3.5 py-1.5 bg-indigo-700 text-white rounded text-xs font-semibold hover:bg-indigo-800">📐 Deploy SOP</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Process Efficiency</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.processEfficiency}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Bottlenecks Resolved</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.bottlenecksResolved}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Active SOPs</div>
                            <div className="text-xl font-black text-indigo-700 mt-1">{data.sops.length}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">SLA Adherence</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.avgSlaAdherence}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Productivity Gain</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.productivityImprovement}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📐 Standard Operating Procedures (SOPs) & SLA Targets</h3>
                            <button onClick={handleCreateSop} className="px-3 py-1 bg-indigo-700 text-white rounded text-xs font-semibold">+ Deploy SOP</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">SOP Title</th>
                                        <th className="p-2.5">Department</th>
                                        <th className="p-2.5">Target SLA</th>
                                        <th className="p-2.5">Efficiency Score</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.sops.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-indigo-700">{s.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{s.name}</td>
                                            <td className="p-2.5 text-slate-500">{s.dept}</td>
                                            <td className="p-2.5 font-medium">{s.slaTarget}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{s.efficiencyScore}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{s.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-indigo-700'}`}>
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
