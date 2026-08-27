'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'marketingExecData_v1';

const defaultData = () => ({
    user: { name: 'Rahul Kumar', role: 'Marketing Executive' },
    metrics: {
        activeCampaigns: 12,
        targetAchievement: '78%',
        leadsGenerated: 1247,
        qualifiedLeads: 486,
        converted: 142,
        visits: 87,
        roi: '3.4x',
        performance: '82%'
    },
    campaigns: [
        { id: 'CMP-042', name: 'Monsoon Membership Drive', type: 'Membership', territory: 'Zone A', budget: '₹1,50,000', spend: '₹98,400', leads: 312, conv: 48, roi: '2.8x', status: 'Active' },
        { id: 'CMP-038', name: 'Local Awareness — Sector 12', type: 'Brand Awareness', territory: 'Zone B', budget: '₹75,000', spend: '₹72,100', leads: 198, conv: 31, roi: '3.1x', status: 'Active' },
        { id: 'CMP-035', name: 'Digital Lead Gen — Q3', type: 'Digital', territory: 'All / HQ', budget: '₹2,50,000', spend: '₹1,87,200', leads: 520, conv: 89, roi: '4.2x', status: 'Active' },
    ],
    leads: [
        { id: 1, name: 'Priya Sharma', phone: '98765 43210', source: 'Field', campaign: 'CMP-042', assignedTo: 'Amit (BDE)', status: 'Qualified', quality: '4.5' },
        { id: 2, name: 'Rajesh Patel', phone: '98123 45678', source: 'Social', campaign: 'CMP-035', assignedTo: 'Neha (Tele)', status: 'Contacted', quality: '4.2' },
        { id: 3, name: 'Sneha Gupta', phone: '97654 32109', source: 'Event', campaign: 'CMP-041', assignedTo: 'Vikram (BDO)', status: 'Follow-up', quality: '4.0' },
    ]
});

const MarketingExecutivePage = () => {
    const [data, setData] = useState(() => loadData());
    const [activeTab, setActiveTab] = useState('dashboard');
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);

    function loadData() {
        try {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const def = defaultData();
                    for (const k in def) {
                        if (!parsed[k]) parsed[k] = def[k];
                    }
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Marketing Exec load reset error', e);
        }
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

    const openModal = useCallback((title, content) => {
        setModal({ title, content });
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);

    const handleCreateCampaign = () => {
        openModal(
            '📣 Create Marketing Campaign',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Campaign Name *</label>
                <input id="cmpName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Festival Drive" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Type</label>
                        <select id="cmpType" className="w-full border p-2 rounded text-sm mt-1">
                            <option value="Lead Generation">Lead Generation</option>
                            <option value="Brand Awareness">Brand Awareness</option>
                            <option value="Membership">Membership</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Budget (₹)</label>
                        <input id="cmpBudget" className="w-full border p-2 rounded text-sm mt-1" placeholder="100000" />
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('cmpName').value || 'New Campaign';
                        const type = document.getElementById('cmpType').value || 'Lead Generation';
                        const budget = document.getElementById('cmpBudget').value ? `₹${parseFloat(document.getElementById('cmpBudget').value).toLocaleString()}` : '₹1,00,000';
                        const id = `CMP-0${data.campaigns.length + 40}`;
                        const newC = { id, name, type, territory: 'North Zone', budget, spend: '₹0', leads: 0, conv: 0, roi: '0.0x', status: 'Active' };
                        updateData(prev => ({ ...prev, campaigns: [newC, ...prev.campaigns] }));
                        showToast(`📣 Campaign ${name} created!`);
                        closeModal();
                    }} className="px-4 py-2 bg-amber-600 text-white font-semibold rounded text-xs hover:bg-amber-700">Create Campaign</button>
                </div>
            </div>
        );
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-5 rounded-xl border border-amber-700/40 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="text-xs uppercase font-bold text-amber-300 tracking-wider">{data.user.role} Portal</div>
                        <div className="text-2xl font-black mt-1">Marketing ROI <span className="text-amber-300">{data.metrics.roi}</span></div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                        <div>Leads Generated: {data.metrics.leadsGenerated} • Qualified: {data.metrics.qualifiedLeads}</div>
                        <div className="text-amber-300 mt-1 font-semibold">Target Achievement: {data.metrics.targetAchievement}</div>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Active Campaigns</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.campaigns.length}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Leads Generated</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.leadsGenerated}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Qualified Leads</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.qualifiedLeads}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Converted</div>
                    <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.converted}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Field Visits</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.visits}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Marketing ROI</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.roi}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Achievement</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.targetAchievement}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Performance</div>
                    <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.performance}</div>
                </div>
            </div>

            {/* Campaigns Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-slate-800">📣 Active Marketing Campaigns ({data.campaigns.length})</h3>
                    <button onClick={handleCreateCampaign} className="px-3 py-1.5 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700">+ New Campaign</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-2.5">ID</th>
                                <th className="p-2.5">Campaign Name</th>
                                <th className="p-2.5">Type</th>
                                <th className="p-2.5">Budget</th>
                                <th className="p-2.5">Spend</th>
                                <th className="p-2.5">Leads</th>
                                <th className="p-2.5">ROI</th>
                                <th className="p-2.5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {data.campaigns.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-amber-600">{c.id}</td>
                                    <td className="p-2.5 font-bold text-slate-900">{c.name}</td>
                                    <td className="p-2.5">{c.type}</td>
                                    <td className="p-2.5 text-slate-500">{c.budget}</td>
                                    <td className="p-2.5 font-semibold">{c.spend}</td>
                                    <td className="p-2.5 font-bold text-emerald-600">{c.leads}</td>
                                    <td className="p-2.5 font-bold text-amber-600">{c.roi}</td>
                                    <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">{c.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-lg">M</div>
                    <div>
                        <div className="font-bold text-white text-base">Marketing <span className="text-amber-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Campaign & Field</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Overview Dashboard', 'fa-house'],
                        ['campaigns', 'Campaigns', 'fa-bullhorn'],
                        ['leads', 'Lead Generation', 'fa-users'],
                        ['field', 'Field Marketing', 'fa-map-marker-alt'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-amber-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="font-bold text-white">{data.user.name}</div>
                    <div className="text-[10px] text-amber-400">{data.user.role}</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Marketing Executive CRM Portal</div>
                    <button onClick={handleCreateCampaign} className="px-3.5 py-1.5 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700">+ New Campaign</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'campaigns' && renderDashboard()}
                    {['leads', 'field'].includes(activeTab) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeTab} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live marketing executive data active.</p>
                        </div>
                    )}
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
};

export default MarketingExecutivePage;
