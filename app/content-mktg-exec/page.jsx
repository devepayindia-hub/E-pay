'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'contentMktgExecData_v1';

const defaultData = () => ({
    user: { name: 'Megha Rao', role: 'Content Marketing Executive' },
    metrics: {
        contentPiecesPublished: 84,
        libraryItems: 142,
        totalEngagement: '184.5K',
        contentGeneratedLeads: 920,
        contentRoi: '3.9x'
    },
    contents: [
        { id: 'CNT-101', title: 'How to Start an ePay Gallery Franchise in Maharashtra', type: 'Blog & Case Study', leads: 420, engagement: '45.2K Views', status: 'Published' },
        { id: 'CNT-102', title: 'Top 10 Travel Destinations 2026 - ePay Travel Guide', type: 'E-Book / PDF', leads: 280, engagement: '28.1K Downloads', status: 'Published' }
    ]
});

export default function ContentMktgExecPage() {
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

    const handleCreateContent = () => {
        openModal(
            '✍️ Publish Campaign Content',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Content Title *</label>
                <input id="cntTitle" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. 5 Reasons to Upgrade your ePay Membership" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Content Type (Blog / Video Script / E-book)</label>
                <input id="cntType" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Blog Article" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const title = document.getElementById('cntTitle')?.value || 'New Article';
                        const type = document.getElementById('cntType')?.value || 'Blog';
                        const newC = { id: `CNT-10${data.contents.length + 1}`, title, type, leads: 0, engagement: '1K Views', status: 'Published' };
                        updateData(prev => ({ ...prev, contents: [...prev.contents, newC] }));
                        showToast(`✍️ Content "${title}" published to library!`);
                        closeModal();
                    }} className="px-4 py-2 bg-sky-600 text-white font-semibold rounded text-xs hover:bg-sky-700">Publish Content</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center text-lg">✍️</div>
                    <div>
                        <div className="font-bold text-white text-base">Content Mktg <span className="text-sky-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Content Library & Engagement</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['library', 'Content Library', 'fa-newspaper'],
                        ['leads', 'Content Leads', 'fa-magnet'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-sky-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Content Marketing & Engagement Portal</div>
                    <button onClick={handleCreateContent} className="px-3.5 py-1.5 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700">✍️ Publish Content</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Pieces Published</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.contentPiecesPublished}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Library Size</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.libraryItems}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Engagement</div>
                            <div className="text-xl font-black text-sky-600 mt-1">{data.metrics.totalEngagement}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Leads Generated</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.contentGeneratedLeads}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Content ROI</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.contentRoi}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">✍️ Content Calendar & Published Assets</h3>
                            <button onClick={handleCreateContent} className="px-3 py-1 bg-sky-600 text-white rounded text-xs font-semibold">+ Publish Content</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Content Title</th>
                                        <th className="p-2.5">Content Type</th>
                                        <th className="p-2.5">Leads Captured</th>
                                        <th className="p-2.5">Engagement</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.contents.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-sky-600">{c.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{c.title}</td>
                                            <td className="p-2.5 text-slate-500">{c.type}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{c.leads}</td>
                                            <td className="p-2.5 font-medium">{c.engagement}</td>
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
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-sky-600'}`}>
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
