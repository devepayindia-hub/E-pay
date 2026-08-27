'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'campaignMgrData_v1';

const defaultData = () => ({
    user: { name: 'Aditya Mehta', role: 'Campaign Manager' },
    metrics: {
        totalBudget: '₹12.5 L',
        totalLeads: 5420,
        avgCpl: '₹145',
        qualifiedLeads: 2480,
        conversionRate: '27.5%',
        totalRevenue: '₹2.10 Cr',
        avgRoi: '4.5x'
    },
    campaigns: [
        { id: 'CMP-201', name: 'Q3 Gallery Expansion Push', audience: 'B2B Retailers / Investors', budget: '₹5.0 L', leads: 2400, cpl: '₹150', qualified: 1100, conv: '29%', roi: '4.8x', status: 'Active' },
        { id: 'CMP-202', name: 'ePay Travel Dubai Summer Promo', audience: 'Honeymooners & Families', budget: '₹4.0 L', leads: 1900, cpl: '₹135', qualified: 850, conv: '26%', roi: '4.2x', status: 'Active' }
    ]
});

export default function CampaignMgrPage() {
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
            '📊 Create New Campaign & Set Budget',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Campaign Name *</label>
                <input id="cmpTitle" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Monsoon Cashback Festival" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Target Audience</label>
                <input id="cmpAud" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Tier-2 City Shop Owners" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Budget Allocated</label>
                <input id="cmpBgt" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ₹3.5 L" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('cmpTitle')?.value || 'New Campaign';
                        const audience = document.getElementById('cmpAud')?.value || 'General Audience';
                        const budget = document.getElementById('cmpBgt')?.value || '₹2.0 L';
                        const newC = { id: `CMP-20${data.campaigns.length + 1}`, name, audience, budget, leads: 0, cpl: '₹140', qualified: 0, conv: '0%', roi: '1.0x', status: 'Active' };
                        updateData(prev => ({ ...prev, campaigns: [...prev.campaigns, newC] }));
                        showToast(`📊 Campaign "${name}" initialized!`);
                        closeModal();
                    }} className="px-4 py-2 bg-purple-600 text-white font-semibold rounded text-xs hover:bg-purple-700">Create Campaign</button>
                </div>
            </div>
        );
    };

    const handleToggleStatus = (id) => {
        updateData(prev => ({
            ...prev,
            campaigns: prev.campaigns.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c)
        }));
        showToast(`⚡ Campaign status updated!`);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-lg">📊</div>
                    <div>
                        <div className="font-bold text-white text-base">Campaign <span className="text-purple-400">Manager</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Budgets, Leads & ROI</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['campaigns', 'Campaign Control', 'fa-chart-pie'],
                        ['compare', 'Compare Campaigns', 'fa-code-compare'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-purple-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Campaign Management & ROI Optimization Dashboard</div>
                    <button onClick={handleCreateCampaign} className="px-3.5 py-1.5 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700">📊 Create Campaign</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Budget</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.totalBudget}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Leads</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.totalLeads}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">CPL</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.avgCpl}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Qualified</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.qualifiedLeads}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Conversion</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.conversionRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Revenue</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.totalRevenue}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">ROI</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.avgRoi}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Active</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.campaigns.length}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📊 Campaign Budget & Performance Matrix</h3>
                            <button onClick={handleCreateCampaign} className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-semibold">+ New Campaign</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Campaign</th>
                                        <th className="p-2.5">Target Audience</th>
                                        <th className="p-2.5">Budget</th>
                                        <th className="p-2.5">Leads</th>
                                        <th className="p-2.5">CPL</th>
                                        <th className="p-2.5">ROI</th>
                                        <th className="p-2.5">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.campaigns.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-purple-600">{c.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{c.name}</td>
                                            <td className="p-2.5 text-slate-500">{c.audience}</td>
                                            <td className="p-2.5 font-medium">{c.budget}</td>
                                            <td className="p-2.5">{c.leads}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{c.cpl}</td>
                                            <td className="p-2.5 font-bold text-purple-600">{c.roi}</td>
                                            <td className="p-2.5">
                                                <button onClick={() => handleToggleStatus(c.id)} className={`px-2.5 py-1 rounded text-[10px] font-bold ${c.status === 'Active' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                                    {c.status === 'Active' ? 'Pause' : 'Resume'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-purple-600'}`}>
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
