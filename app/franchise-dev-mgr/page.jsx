'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'franchiseDevMgrData_v1';

const defaultData = () => ({
    user: { name: 'Karan Malhotra', role: 'Franchise/Gallery Development Manager' },
    metrics: {
        totalEnquiries: 142,
        qualifiedProspects: 58,
        siteVisitsCompleted: 34,
        approvedAgreements: 18,
        galleriesOpenedThisYear: 14,
        pipelineValuation: '₹8.4 Cr'
    },
    prospects: [
        { id: 'FRP-101', name: 'Surat Ring Road Center', investor: 'Vijay Shah', location: 'Surat, Gujarat', stage: 'Agreement', investment: '₹45 L', owner: 'Karan BDM' },
        { id: 'FRP-102', name: 'Nashik City Center', investor: 'Milind Deshmukh', location: 'Nashik, Maharashtra', stage: 'Site Visit', investment: '₹35 L', owner: 'Sneha BDE' },
        { id: 'FRP-103', name: 'Nagpur Central Hub', investor: 'Rajesh Agrawal', location: 'Nagpur, Maharashtra', stage: 'Negotiation', investment: '₹50 L', owner: 'Amit BDE' }
    ]
});

export default function FranchiseDevMgrPage() {
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

    const handleNewEnquiry = () => {
        openModal(
            '🏪 Register New Franchise Enquiry',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Franchise Center Name *</label>
                <input id="frpName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Pune Wakad Gallery" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Investor / Lead Name</label>
                <input id="frpInv" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Ramesh Patel" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Location</label>
                        <input id="frpLoc" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Pune" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Estimated Investment</label>
                        <input id="frpInvAmt" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ₹40 L" />
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('frpName')?.value || 'New Franchise';
                        const investor = document.getElementById('frpInv')?.value || 'Investor';
                        const location = document.getElementById('frpLoc')?.value || 'Pune';
                        const investment = document.getElementById('frpInvAmt')?.value || '₹35 L';
                        const newP = { id: `FRP-10${data.prospects.length + 1}`, name, investor, location, stage: 'Enquiry', investment, owner: 'Karan Dev Mgr' };
                        updateData(prev => ({ ...prev, prospects: [...prev.prospects, newP] }));
                        showToast(`🏪 Franchise enquiry for ${name} registered!`);
                        closeModal();
                    }} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded text-xs hover:bg-violet-700">Register Franchise Lead</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-600 text-white font-black flex items-center justify-center text-lg">🏪</div>
                    <div>
                        <div className="font-bold text-white text-base">Franchise <span className="text-violet-400">Dev Mgr</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Acquisition Pipeline (11-Stage)</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['pipeline', 'Franchise Pipeline', 'fa-diagram-successor'],
                        ['site-visits', 'Site Visit Reports', 'fa-map-location-dot'],
                        ['agreements', 'Legal & Agreements', 'fa-file-signature'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-violet-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Franchise & Gallery Acquisition Command Center</div>
                    <button onClick={handleNewEnquiry} className="px-3.5 py-1.5 bg-violet-600 text-white rounded text-xs font-semibold hover:bg-violet-700">🏪 New Franchise Enquiry</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    {/* Pipeline Stage Tracker Bar */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                        <div className="text-xs font-bold text-slate-700 mb-2">🔄 Franchise Acquisition Pipeline Stages</div>
                        <div className="flex gap-2 text-[10px] font-bold text-slate-600">
                            {['Enquiry', 'Qualified', 'Meeting', 'Site Visit', 'Proposal', 'Negotiation', 'Approved', 'Agreement', 'Payment', 'Setup', 'Open'].map((stg, idx) => (
                                <div key={stg} className={`px-2.5 py-1 rounded border shrink-0 ${idx === 7 ? 'bg-violet-600 text-white border-violet-600' : 'bg-slate-50 border-slate-200'}`}>
                                    {stg}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Enquiries</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.totalEnquiries}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Qualified</div>
                            <div className="text-xl font-black text-violet-600 mt-1">{data.metrics.qualifiedProspects}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Site Visits</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.siteVisitsCompleted}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Agreements Approved</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.approvedAgreements}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Opened 2026</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.galleriesOpenedThisYear}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Pipeline Value</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.pipelineValuation}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🏪 Active Franchise Prospects & Status</h3>
                            <button onClick={handleNewEnquiry} className="px-3 py-1 bg-violet-600 text-white rounded text-xs font-semibold">+ New Enquiry</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Center Name</th>
                                        <th className="p-2.5">Investor</th>
                                        <th className="p-2.5">Location</th>
                                        <th className="p-2.5">Pipeline Stage</th>
                                        <th className="p-2.5">Investment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.prospects.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-violet-600">{p.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{p.name}</td>
                                            <td className="p-2.5">{p.investor}</td>
                                            <td className="p-2.5 text-slate-500">{p.location}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{p.stage}</td>
                                            <td className="p-2.5 font-bold text-purple-600">{p.investment}</td>
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
