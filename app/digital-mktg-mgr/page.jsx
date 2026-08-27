'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'digitalMktgMgrData_v1';

const defaultData = () => ({
    user: { name: 'Kavya Sharma', role: 'Digital Marketing Manager' },
    metrics: {
        googleMetaLeads: 3420,
        cpl: '₹140',
        cac: '₹420',
        landingPageConv: '8.4%',
        websiteEnquiries: 1250,
        remarketingAudience: '45,200'
    },
    sources: [
        { id: 'SRC-01', channel: 'Google Search Ads', leads: 1450, cpl: '₹165', convRate: '9.2%', status: 'Active' },
        { id: 'SRC-02', channel: 'Meta (FB/Insta) Ads', leads: 1280, cpl: '₹110', convRate: '7.8%', status: 'Active' },
        { id: 'SRC-03', channel: 'YouTube Video Ads', leads: 690, cpl: '₹155', convRate: '6.4%', status: 'Active' }
    ]
});

export default function DigitalMktgMgrPage() {
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

    const handleAddChannel = () => {
        openModal(
            '🌐 Integrate New Digital Channel',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Channel Name *</label>
                <input id="chnName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. LinkedIn Ads / Telegram Bot" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Target CPL</label>
                <input id="chnCpl" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ₹180" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('chnName')?.value || 'New Channel';
                        const cpl = document.getElementById('chnCpl')?.value || '₹150';
                        const newS = { id: `SRC-0${data.sources.length + 1}`, channel: name, leads: 0, cpl, convRate: '5.0%', status: 'Active' };
                        updateData(prev => ({ ...prev, sources: [...prev.sources, newS] }));
                        showToast(`🌐 Digital channel ${name} connected!`);
                        closeModal();
                    }} className="px-4 py-2 bg-amber-700 text-white font-semibold rounded text-xs hover:bg-amber-800">Connect Channel</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-700 text-white font-black flex items-center justify-center text-lg">🌐</div>
                    <div>
                        <div className="font-bold text-white text-base">Digital Mktg <span className="text-amber-400">Mgr</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Google / Meta / Funnel</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['sources', 'Lead Sources & CPL', 'fa-share-nodes'],
                        ['landing-pages', 'Landing Pages', 'fa-desktop'],
                        ['remarketing', 'Remarketing Audiences', 'fa-users-viewfinder'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-amber-700 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Digital Lead Acquisition & Funnel Command Center</div>
                    <button onClick={handleAddChannel} className="px-3.5 py-1.5 bg-amber-700 text-white rounded text-xs font-semibold hover:bg-amber-800">🌐 Connect Channel</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Google/Meta Leads</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.googleMetaLeads}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Avg CPL</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.cpl}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">CAC</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.cac}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Landing Page Conv.</div>
                            <div className="text-xl font-black text-indigo-600 mt-1">{data.metrics.landingPageConv}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Website Enquiries</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.websiteEnquiries}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Remarketing Audience</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.remarketingAudience}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🌐 Digital Channels & CPL Analytics</h3>
                            <button onClick={handleAddChannel} className="px-3 py-1 bg-amber-700 text-white rounded text-xs font-semibold">+ Add Channel</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Channel Name</th>
                                        <th className="p-2.5">Leads Captured</th>
                                        <th className="p-2.5">CPL</th>
                                        <th className="p-2.5">Conversion %</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.sources.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-amber-700">{s.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{s.channel}</td>
                                            <td className="p-2.5">{s.leads}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{s.cpl}</td>
                                            <td className="p-2.5 font-bold text-indigo-600">{s.convRate}</td>
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
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-amber-700'}`}>
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
