'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'mktgOpsExecData_v1';

const defaultData = () => ({
    user: { name: 'Gaurav Kulkarni', role: 'Marketing Operations Executive' },
    metrics: {
        configuredSources: 18,
        activeIntegrations: 12,
        activeWorkflows: 14,
        routedLeadsToday: 480,
        dataAccuracy: '99.4%'
    },
    workflows: [
        { id: 'WFL-01', name: 'Auto Lead Routing to BDE based on Pincode', trigger: 'New Lead Webhook', status: 'Active', latency: '0.4s' },
        { id: 'WFL-02', name: 'WhatsApp & SMS Welcome Automation', trigger: 'Lead Form Submission', status: 'Active', latency: '0.2s' }
    ]
});

export default function MktgOpsExecPage() {
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

    const handleCreateWorkflow = () => {
        openModal(
            '⚙️ Configure Automation Workflow',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Workflow Name *</label>
                <input id="wflName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. High-Priority Lead Alert to BDM" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Trigger Event</label>
                <input id="wflTrig" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Franchise Form Filled" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('wflName')?.value || 'New Automation';
                        const trigger = document.getElementById('wflTrig')?.value || 'Lead Webhook';
                        const newW = { id: `WFL-0${data.workflows.length + 1}`, name, trigger, status: 'Active', latency: '0.3s' };
                        updateData(prev => ({ ...prev, workflows: [...prev.workflows, newW] }));
                        showToast(`⚙️ Workflow "${name}" active & configured!`);
                        closeModal();
                    }} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded text-xs hover:bg-teal-700">Deploy Workflow</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-lg">⚙️</div>
                    <div>
                        <div className="font-bold text-white text-base">Marketing Ops <span className="text-teal-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Integrations & Workflows</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['workflows', 'Automation Workflows', 'fa-diagram-project'],
                        ['sources', 'Lead Source Config', 'fa-sliders'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Marketing CRM Integrations & Automation Ops Portal</div>
                    <button onClick={handleCreateWorkflow} className="px-3.5 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700">⚙️ Deploy Workflow</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Configured Sources</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.configuredSources}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Integrations</div>
                            <div className="text-xl font-black text-teal-600 mt-1">{data.metrics.activeIntegrations}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Workflows</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.activeWorkflows}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Routed Leads Today</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.routedLeadsToday}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Data Accuracy</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.dataAccuracy}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">⚙️ Active Marketing Automation Workflows</h3>
                            <button onClick={handleCreateWorkflow} className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-semibold">+ New Workflow</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Workflow Name</th>
                                        <th className="p-2.5">Trigger Event</th>
                                        <th className="p-2.5">Execution Latency</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.workflows.map(w => (
                                        <tr key={w.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-teal-600">{w.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{w.name}</td>
                                            <td className="p-2.5 text-slate-500">{w.trigger}</td>
                                            <td className="p-2.5 font-mono text-emerald-600">{w.latency}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{w.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-teal-600'}`}>
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
