'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'digitalMktgExecData_v1';

const defaultData = () => ({
    user: { name: 'Aakash Verma', role: 'Digital Marketing Executive' },
    metrics: {
        socialMediaLeads: 850,
        digitalEnquiries: 420,
        handedOverToBDE: 610,
        activeCampaignData: 8
    },
    leads: [
        { id: 'DLE-101', name: 'Ramesh Patel', source: 'Instagram Lead Form', mobile: '9822334411', handedOverTo: 'Suresh BDE', status: 'Handed Over' },
        { id: 'DLE-102', name: 'Sunita Rao', source: 'Google Search Enquiry', mobile: '9822334422', handedOverTo: 'Rahul BDE', status: 'Handed Over' }
    ]
});

export default function DigitalMktgExecPage() {
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

    const handleHandoverBDE = () => {
        openModal(
            '🤝 Handover Digital Lead to BDE',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Lead Name *</label>
                <input id="ldName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Vikas Sharma" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Source (Insta / Google / Meta)</label>
                <input id="ldSource" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Meta Ads" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Assign BDE</label>
                <input id="ldBDE" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Suresh BDE" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('ldName')?.value || 'Lead';
                        const source = document.getElementById('ldSource')?.value || 'Digital';
                        const handedOverTo = document.getElementById('ldBDE')?.value || 'BDE';
                        const newL = { id: `DLE-10${data.leads.length + 1}`, name, source, mobile: '9876543210', handedOverTo, status: 'Handed Over' };
                        updateData(prev => ({ ...prev, leads: [...prev.leads, newL] }));
                        showToast(`🤝 Lead ${name} handed over to ${handedOverTo}!`);
                        closeModal();
                    }} className="px-4 py-2 bg-amber-500 text-white font-semibold rounded text-xs hover:bg-amber-600">Handover Lead</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-lg">📲</div>
                    <div>
                        <div className="font-bold text-white text-base">Digital Mktg <span className="text-amber-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Social Leads & BDE Handover</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['leads', 'Digital Leads Roster', 'fa-mobile-screen'],
                        ['handover', 'BDE Handover Queue', 'fa-handshake'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-amber-500 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Digital Lead Capture & BDE Handover Executive Portal</div>
                    <button onClick={handleHandoverBDE} className="px-3.5 py-1.5 bg-amber-500 text-white rounded text-xs font-semibold hover:bg-amber-600">🤝 Handover Lead</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Social Media Leads</div>
                            <div className="text-xl font-black text-amber-500 mt-1">{data.metrics.socialMediaLeads}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Digital Enquiries</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.digitalEnquiries}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Handed Over</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.handedOverToBDE}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Active Datasets</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.activeCampaignData}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📲 Digital Leads & BDE Assignment</h3>
                            <button onClick={handleHandoverBDE} className="px-3 py-1 bg-amber-500 text-white rounded text-xs font-semibold">+ Handover Lead</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Lead Name</th>
                                        <th className="p-2.5">Source Channel</th>
                                        <th className="p-2.5">Assigned BDE</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.leads.map(l => (
                                        <tr key={l.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-amber-500">{l.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{l.name}</td>
                                            <td className="p-2.5 text-slate-500">{l.source}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{l.handedOverTo}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{l.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-amber-500'}`}>
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
