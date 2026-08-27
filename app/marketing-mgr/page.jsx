'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'marketingMgrData_v1';

const defaultData = () => ({
    user: { name: 'Rajesh Khanna', role: 'Marketing Manager' },
    metrics: {
        leadsGenerated: '4,850',
        qualifiedLeads: '2,140',
        conversionRate: '26.8%',
        cac: '₹480',
        campaignRoi: '4.2x',
        revenueGenerated: '₹1.84 Cr'
    },
    campaigns: [
        { id: 'CMP-101', name: 'Monsoon Gallery Membership Drive', budget: '₹2.5 L', leads: 1250, qualified: 680, convRate: '28.4%', roi: '4.8x', status: 'Active' },
        { id: 'CMP-102', name: 'ePay Travel Dubai Expo Ads', budget: '₹4.0 L', leads: 2100, qualified: 940, convRate: '24.2%', roi: '3.9x', status: 'Active' },
        { id: 'CMP-103', name: 'Local B2B Merchant Partnership', budget: '₹1.2 L', leads: 1500, qualified: 520, convRate: '29.1%', roi: '4.5x', status: 'Completed' }
    ]
});

export default function MarketingMgrPage() {
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

    const handleCreateCampaign = () => {
        openModal(
            '📣 Launch Marketing Campaign',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Campaign Name *</label>
                <input id="cmpName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Festival Cashback Blast" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Budget Allocated</label>
                <input id="cmpBudget" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ₹3.0 L" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('cmpName')?.value || 'New Campaign';
                        const budget = document.getElementById('cmpBudget')?.value || '₹1.0 L';
                        const newC = { id: `CMP-10${data.campaigns.length + 1}`, name, budget, leads: 0, qualified: 0, convRate: '0%', roi: '1.0x', status: 'Active' };
                        updateData(prev => ({ ...prev, campaigns: [...prev.campaigns, newC] }));
                        showToast(`📣 Campaign ${name} launched!`);
                        closeModal();
                    }} className="px-4 py-2 bg-amber-600 text-white font-semibold rounded text-xs hover:bg-amber-700">Launch Campaign</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-lg">📣</div>
                    <div>
                        <div className="font-bold text-white text-base">Marketing <span className="text-amber-400">Manager</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Lead Gen & Campaign ROI</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['campaigns', 'Campaign Management', 'fa-rectangle-ad'],
                        ['leads', 'Lead Distribution', 'fa-users-line'],
                        ['roi', 'Campaign ROI & CAC', 'fa-chart-pie'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-amber-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Marketing Strategy & Customer Acquisition Operating System</div>
                    <button onClick={handleCreateCampaign} className="px-3.5 py-1.5 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700">📣 Launch Campaign</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Leads Generated</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.leadsGenerated}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Qualified Leads</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.qualifiedLeads}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Conv. Rate</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.conversionRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">CAC</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.cac}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Campaign ROI</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.campaignRoi}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Revenue</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.revenueGenerated}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📣 Active Marketing Campaigns & Performance</h3>
                            <button onClick={handleCreateCampaign} className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-semibold">+ New Campaign</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Campaign Name</th>
                                        <th className="p-2.5">Budget</th>
                                        <th className="p-2.5">Leads Generated</th>
                                        <th className="p-2.5">Qualified</th>
                                        <th className="p-2.5">Conv. Rate</th>
                                        <th className="p-2.5">ROI</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.campaigns.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-amber-600">{c.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{c.name}</td>
                                            <td className="p-2.5 font-medium">{c.budget}</td>
                                            <td className="p-2.5">{c.leads}</td>
                                            <td className="p-2.5 font-bold">{c.qualified}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{c.convRate}</td>
                                            <td className="p-2.5 font-bold text-purple-600">{c.roi}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{c.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-amber-600'}`}>
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
