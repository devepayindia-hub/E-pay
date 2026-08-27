'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'perfMktgExecData_v1';

const defaultData = () => ({
    user: { name: 'Vikram Sethi', role: 'Performance Marketing Executive' },
    metrics: {
        paidAdSpend: '₹3.8 L',
        cpl: '₹125',
        cpa: '₹410',
        conversions: 890,
        ctrAvg: '3.8%'
    },
    ads: [
        { id: 'AD-101', name: 'Google Search - "Franchise Business Opportunity"', platform: 'Google Ads', spend: '₹1.5 L', cpl: '₹140', cpa: '₹420', ctr: '4.2%', status: 'Optimized' },
        { id: 'AD-102', name: 'Meta Advantage+ - "ePay Travel Membership"', platform: 'Meta Ads', spend: '₹1.2 L', cpl: '₹105', cpa: '₹380', ctr: '3.6%', status: 'Optimized' }
    ]
});

export default function PerfMktgExecPage() {
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

    const handleOptimizeAd = () => {
        openModal(
            '⚡ Optimize Paid Ad Set',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Ad Set Name *</label>
                <input id="adName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Retargeting High-Intent Users" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Platform (Google / Meta / LinkedIn)</label>
                <input id="adPlat" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Meta Ads" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('adName')?.value || 'New Ad Set';
                        const platform = document.getElementById('adPlat')?.value || 'Google Ads';
                        const newA = { id: `AD-10${data.ads.length + 1}`, name, platform, spend: '₹50,000', cpl: '₹120', cpa: '₹390', ctr: '4.0%', status: 'Optimized' };
                        updateData(prev => ({ ...prev, ads: [...prev.ads, newA] }));
                        showToast(`⚡ Ad set ${name} optimized & synced to CRM!`);
                        closeModal();
                    }} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded text-xs hover:bg-violet-700">Optimize & Sync</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-600 text-white font-black flex items-center justify-center text-lg">📈</div>
                    <div>
                        <div className="font-bold text-white text-base">Perf Mktg <span className="text-violet-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">CPL, CPA & Paid Ads</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['ads', 'Paid Ad Performance', 'fa-chart-line'],
                        ['optimization', 'CPL / CPA Optimization', 'fa-sliders'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-violet-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Performance Marketing & Paid Acquisition Portal</div>
                    <button onClick={handleOptimizeAd} className="px-3.5 py-1.5 bg-violet-600 text-white rounded text-xs font-semibold hover:bg-violet-700">⚡ Optimize Ad Set</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Paid Ad Spend</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.paidAdSpend}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">CPL</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.cpl}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">CPA</div>
                            <div className="text-xl font-black text-violet-600 mt-1">{data.metrics.cpa}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Conversions</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.conversions}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Avg CTR</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.ctrAvg}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📈 Paid Ad Campaign Performance</h3>
                            <button onClick={handleOptimizeAd} className="px-3 py-1 bg-violet-600 text-white rounded text-xs font-semibold">+ Optimize Ad</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Ad Set Name</th>
                                        <th className="p-2.5">Platform</th>
                                        <th className="p-2.5">Ad Spend</th>
                                        <th className="p-2.5">CPL</th>
                                        <th className="p-2.5">CPA</th>
                                        <th className="p-2.5">CTR</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.ads.map(a => (
                                        <tr key={a.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-violet-600">{a.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{a.name}</td>
                                            <td className="p-2.5 text-slate-500">{a.platform}</td>
                                            <td className="p-2.5 font-medium">{a.spend}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{a.cpl}</td>
                                            <td className="p-2.5 font-bold text-violet-600">{a.cpa}</td>
                                            <td className="p-2.5">{a.ctr}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{a.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-violet-600'}`}>
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
