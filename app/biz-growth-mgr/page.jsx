'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'bizGrowthMgrData_v1';

const defaultData = () => ({
    user: { name: 'Rohan Deshmukh', role: 'Business Growth Manager' },
    metrics: {
        revenueGrowthRate: '+34.2%',
        upsellRevenue: '₹48.5 L',
        crossSellRevenue: '₹32.0 L',
        retentionRate: '96.4%',
        activeGrowthInitiatives: 8
    },
    initiatives: [
        { id: 'GRW-101', name: 'ePay Travel Package Upsell to Existing Gallery Members', channel: 'Gallery Upsell', targetRev: '₹50 L', achieved: '₹38 L', status: 'Active' },
        { id: 'GRW-102', name: 'Micro-ATM & POS Cross-Sell to Retailers', channel: 'Retail Channel', targetRev: '₹30 L', achieved: '₹22 L', status: 'Active' }
    ]
});

export default function BizGrowthMgrPage() {
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

    const handleCreateInitiative = () => {
        openModal(
            '🚀 Launch Growth & Upsell Initiative',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Initiative Name *</label>
                <input id="initName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. VIP Travel Package Cross-Sell" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Channel / Segment</label>
                <input id="initChan" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. HNI Customers" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Target Revenue</label>
                <input id="initRev" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ₹25 L" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('initName')?.value || 'New Growth Campaign';
                        const channel = document.getElementById('initChan')?.value || 'Direct Upsell';
                        const targetRev = document.getElementById('initRev')?.value || '₹20 L';
                        const newI = { id: `GRW-10${data.initiatives.length + 1}`, name, channel, targetRev, achieved: '₹0 L', status: 'Active' };
                        updateData(prev => ({ ...prev, initiatives: [...prev.initiatives, newI] }));
                        showToast(`🚀 Initiative ${name} launched!`);
                        closeModal();
                    }} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded text-xs hover:bg-indigo-700">Launch Initiative</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg">🚀</div>
                    <div>
                        <div className="font-bold text-white text-base">Biz Growth <span className="text-indigo-400">Mgr</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Upsell, Cross-Sell & Retention</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['initiatives', 'Growth Initiatives', 'fa-chart-line-up'],
                        ['upsell', 'Upsell & Cross-Sell', 'fa-arrows-split-up-and-left'],
                        ['retention', 'Customer Retention', 'fa-heart-circle-check'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Business Revenue Growth & Account Expansion Portal</div>
                    <button onClick={handleCreateInitiative} className="px-3.5 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700">🚀 Launch Initiative</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Growth Rate</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.revenueGrowthRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Upsell Revenue</div>
                            <div className="text-xl font-black text-indigo-600 mt-1">{data.metrics.upsellRevenue}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Cross-Sell Rev</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.crossSellRevenue}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Retention Rate</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.retentionRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Active Initiatives</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.initiatives.length}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🚀 Active Growth Initiatives & Account Expansion</h3>
                            <button onClick={handleCreateInitiative} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold">+ New Initiative</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Initiative Name</th>
                                        <th className="p-2.5">Target Channel</th>
                                        <th className="p-2.5">Target Rev</th>
                                        <th className="p-2.5">Achieved Rev</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.initiatives.map(i => (
                                        <tr key={i.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-indigo-600">{i.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{i.name}</td>
                                            <td className="p-2.5 text-slate-500">{i.channel}</td>
                                            <td className="p-2.5 font-medium">{i.targetRev}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{i.achieved}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{i.status}</span></td>
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
