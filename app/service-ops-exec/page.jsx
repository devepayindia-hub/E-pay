'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'serviceOpsExecData_v1';

const defaultData = () => ({
    user: { name: 'Karan Patil', role: 'Service Operations Executive' },
    metrics: {
        serviceOrdersToday: 45,
        inProgressServices: 8,
        completedServices: 37,
        slaAdherenceRate: '99.1%',
        avgServiceTime: '45 mins'
    },
    orders: [
        { id: 'SRV-101', serviceName: 'POS Machine Installation & Merchant Activation', client: 'Swastik Traders', technician: 'Ravi Tech', sla: '2 Hours', status: 'Completed' },
        { id: 'SRV-102', serviceName: 'Micro-ATM Hardware Maintenance', client: 'Laxmi Supermarket', technician: 'Amit Tech', sla: '4 Hours', status: 'In Progress' }
    ]
});

export default function ServiceOpsExecPage() {
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

    const handleCreateServiceOrder = () => {
        openModal(
            '🛠️ Dispatch New Service Order',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Service Name *</label>
                <input id="srvName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. POS Paper Roll Delivery & Tech Check" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Client / Merchant Name</label>
                <input id="srvClient" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Apex Stores Pune" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Assigned Field Technician</label>
                <input id="srvTech" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Suresh Tech Executive" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('srvName')?.value || 'Service Order';
                        const client = document.getElementById('srvClient')?.value || 'Client';
                        const tech = document.getElementById('srvTech')?.value || 'Technician';
                        const newO = { id: `SRV-10${data.orders.length + 1}`, serviceName: name, client, technician: tech, sla: '2 Hours', status: 'In Progress' };
                        updateData(prev => ({
                            ...prev,
                            orders: [...prev.orders, newO],
                            metrics: { ...prev.metrics, serviceOrdersToday: prev.metrics.serviceOrdersToday + 1 }
                        }));
                        showToast(`🛠️ Service order dispatched to ${tech}!`);
                        closeModal();
                    }} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded text-xs hover:bg-emerald-700">Dispatch Order</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">🛠️</div>
                    <div>
                        <div className="font-bold text-white text-base">Service Ops <span className="text-emerald-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Service Dispatch & SLA</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['orders', 'Service Orders Queue', 'fa-list-check'],
                        ['technicians', 'Field Tech Dispatch', 'fa-user-gear'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Service Order Processing & Field Dispatch Portal</div>
                    <button onClick={handleCreateServiceOrder} className="px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">🛠️ Dispatch Order</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Service Orders Today</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.serviceOrdersToday}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">In Progress</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.inProgressServices}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Completed</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.completedServices}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">SLA Adherence</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.slaAdherenceRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Avg Service Time</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.avgServiceTime}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🛠️ Active Service Orders & Dispatch Queue</h3>
                            <button onClick={handleCreateServiceOrder} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold">+ Dispatch Order</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">Order ID</th>
                                        <th className="p-2.5">Service Name</th>
                                        <th className="p-2.5">Client / Merchant</th>
                                        <th className="p-2.5">Field Technician</th>
                                        <th className="p-2.5">SLA Target</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.orders.map(o => (
                                        <tr key={o.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-emerald-600">{o.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{o.serviceName}</td>
                                            <td className="p-2.5">{o.client}</td>
                                            <td className="p-2.5 font-medium">{o.technician}</td>
                                            <td className="p-2.5 text-slate-500">{o.sla}</td>
                                            <td className="p-2.5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{o.status}</span></td>
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
