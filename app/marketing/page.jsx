'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'digitalMarketingData_v1';

const defaultData = () => ({
    user: { name: 'Yashraj Sathe', role: 'Marketing Manager' },
    metrics: {
        activeCampaigns: 8,
        traffic: '12.5K',
        leadsGenerated: 420,
        adSpend: '₹85K',
        roas: '3.5x',
        conversions: 156
    },
    campaigns: [
        { id: 1, name: 'Q3 Franchise Push', platform: 'Meta Ads', budget: '1,50,000', spent: '72,500', leads: 420, ctr: '2.45%', cpc: '8.45', status: 'Active' },
        { id: 2, name: 'Enterprise CRM Webinar', platform: 'Google Ads', budget: '85,000', spent: '48,300', leads: 185, ctr: '3.12%', cpc: '12.36', status: 'Active' },
        { id: 3, name: 'LinkedIn B2B Outreach', platform: 'LinkedIn Ads', budget: '1,20,000', spent: '63,200', leads: 95, ctr: '1.78%', cpc: '16.22', status: 'Paused' },
        { id: 4, name: 'Email Nurture Series', platform: 'Email', budget: '25,000', spent: '12,400', leads: 63, ctr: '12.45%', cpc: '1.25', status: 'Active' },
        { id: 5, name: 'Retargeting Campaign', platform: 'Meta Ads', budget: '40,000', spent: '20,100', leads: 48, ctr: '4.32%', cpc: '6.85', status: 'Active' },
    ],
    reports: [
        { id: 'REP-001', function: 'DataSync Module', date: '2026-08-01', user: 'Admin', status: 'Success' },
        { id: 'REP-002', function: 'User Auth Gateway', date: '2026-08-05', user: 'System', status: 'Failed' },
        { id: 'REP-003', function: 'Payment API Processing', date: '2026-08-12', user: 'Admin', status: 'Success' },
        { id: 'REP-004', function: 'Monthly Backup Script', date: '2026-08-15', user: 'System', status: 'Pending' },
    ]
});

const DigitalMarketingPortalPage = () => {
    const [data, setData] = useState(() => loadData());
    const [currentPanel, setCurrentPanel] = useState('dashboard');
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
            console.warn('Digital Marketing load reset error', e);
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
                <label className="block text-xs font-semibold text-slate-700 mt-2">Campaign Name</label>
                <input id="cmpName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Q4 Growth Campaign" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Platform</label>
                <select id="cmpPlatform" className="w-full border p-2 rounded text-sm mt-1">
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="LinkedIn Ads">LinkedIn Ads</option>
                    <option value="Email">Email</option>
                </select>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Budget (₹)</label>
                <input id="cmpBudget" type="text" className="w-full border p-2 rounded text-sm mt-1" placeholder="1,00,000" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('cmpName').value || 'New Campaign';
                        const platform = document.getElementById('cmpPlatform').value;
                        const budget = document.getElementById('cmpBudget').value || '1,00,000';
                        const newCmp = { id: Date.now(), name, platform, budget, spent: '0', leads: 0, ctr: '0.00%', cpc: '0.00', status: 'Active' };
                        updateData(prev => ({ ...prev, campaigns: [newCmp, ...prev.campaigns] }));
                        showToast(`📣 Campaign "${name}" created`);
                        closeModal();
                    }} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded text-xs hover:bg-emerald-700">Create</button>
                </div>
            </div>
        );
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Active Campaigns</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.activeCampaigns}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">+14% vs last month</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Website Traffic</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.traffic}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">+28.5% vs last month</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Leads Generated</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.leadsGenerated}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">+36.4% vs last month</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Ad Spend</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.adSpend}</div>
                    <div className="text-[10px] text-amber-600 font-semibold">8.2% under budget</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">ROAS</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.roas}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">+22.1% vs last month</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Conversions</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.conversions}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">+18.7% vs last month</div>
                </div>
            </div>

            {/* Campaigns Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-slate-800">📣 Active Marketing Campaigns ({data.campaigns.length})</h3>
                    <button onClick={handleCreateCampaign} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">+ Create Campaign</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-2">Campaign Name</th>
                                <th className="p-2">Platform</th>
                                <th className="p-2">Budget</th>
                                <th className="p-2">Spent</th>
                                <th className="p-2">Leads</th>
                                <th className="p-2">CTR</th>
                                <th className="p-2">CPC</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {data.campaigns.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="p-2 font-bold text-slate-900">{c.name}</td>
                                    <td className="p-2">{c.platform}</td>
                                    <td className="p-2">₹{c.budget}</td>
                                    <td className="p-2">₹{c.spent}</td>
                                    <td className="p-2 font-bold text-emerald-600">{c.leads}</td>
                                    <td className="p-2">{c.ctr}</td>
                                    <td className="p-2">₹{c.cpc}</td>
                                    <td className="p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{c.status}</span></td>
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
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-200 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">📣</div>
                    <div>
                        <div className="font-bold text-slate-900 text-base">ePay <span className="text-emerald-600">Marketing</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Digital Marketing Portal</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard Overview', 'fa-house'],
                        ['campaigns', 'Campaigns', 'fa-bullhorn'],
                        ['seo', 'SEO Management', 'fa-search'],
                        ['channels', 'Marketing Channels', 'fa-network-wired'],
                        ['content', 'Content Library', 'fa-file-alt'],
                        ['social', 'Social Media', 'fa-hashtag'],
                        ['email', 'Email Marketing', 'fa-envelope'],
                        ['leads', 'Leads & Forms', 'fa-filter'],
                        ['analytics', 'Analytics', 'fa-chart-line'],
                        ['reports', 'Performance Reports', 'fa-download'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setCurrentPanel(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${currentPanel === id ? 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600' : 'hover:bg-slate-50 text-slate-600'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Digital Marketing & Performance Portal</div>
                    <button onClick={() => showToast('🔄 Refreshing marketing metrics...')} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">Refresh Data</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {currentPanel === 'dashboard' && renderDashboard()}
                    {currentPanel === 'campaigns' && renderDashboard()}
                    {['seo', 'channels', 'content', 'social', 'email', 'leads', 'analytics', 'reports'].includes(currentPanel) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{currentPanel} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live digital marketing data active.</p>
                        </div>
                    )}
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
};

export default DigitalMarketingPortalPage;
