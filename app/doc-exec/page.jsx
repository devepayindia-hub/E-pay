'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'docExecData_v1';

const defaultData = () => ({
    user: { name: 'Sneha Kulkarni', role: 'Documentation Executive' },
    metrics: {
        docsCollectedToday: 84,
        docsVerified: 78,
        pendingDocCount: 6,
        expiringThisMonth: 12,
        digitalRepositorySize: '1,420 Vault Docs'
    },
    documents: [
        { id: 'DOC-101', customer: 'Surat Textiles B2B', docType: 'GST & Pan Card', status: 'Verified', expiry: '2028-12-31', uploadedBy: 'Sneha Kulkarni' },
        { id: 'DOC-102', customer: 'Apex Retailers', docType: 'Shops & Establishment License', status: 'Pending Verification', expiry: '2026-11-30', uploadedBy: 'Sneha Kulkarni' }
    ]
});

export default function DocExecPage() {
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

    const handleUploadDocument = () => {
        openModal(
            '📁 Upload Customer / Franchise Document',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Customer / Franchise Name *</label>
                <input id="docCust" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Pune Central Franchise" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Document Type (Aadhaar / GST / Lease Agreement)</label>
                <input id="docTypeInput" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Registered Rent Agreement" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Expiry Date</label>
                <input id="docExpInput" type="date" className="w-full border p-2 rounded text-sm mt-1" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const customer = document.getElementById('docCust')?.value || 'Customer';
                        const docType = document.getElementById('docTypeInput')?.value || 'General Document';
                        const expiry = document.getElementById('docExpInput')?.value || '2028-12-31';
                        const newD = { id: `DOC-10${data.documents.length + 1}`, customer, docType, status: 'Verified', expiry, uploadedBy: 'Sneha Kulkarni' };
                        updateData(prev => ({
                            ...prev,
                            documents: [...prev.documents, newD],
                            metrics: { ...prev.metrics, docsCollectedToday: prev.metrics.docsCollectedToday + 1, docsVerified: prev.metrics.docsVerified + 1 }
                        }));
                        showToast(`📁 Document "${docType}" uploaded & verified for ${customer}!`);
                        closeModal();
                    }} className="px-4 py-2 bg-slate-700 text-white font-semibold rounded text-xs hover:bg-slate-800">Upload & Verify</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-700 text-white font-black flex items-center justify-center text-lg">📁</div>
                    <div>
                        <div className="font-bold text-white text-base">Doc <span className="text-slate-400">Executive</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Digital Document Vault</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['vault', 'Document Vault', 'fa-vault'],
                        ['pending', 'Pending Verification', 'fa-clock-rotate-left'],
                        ['expiring', 'Expiry Tracker', 'fa-calendar-xmark'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-slate-700 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Customer & Franchise Document Management Portal</div>
                    <button onClick={handleUploadDocument} className="px-3.5 py-1.5 bg-slate-700 text-white rounded text-xs font-semibold hover:bg-slate-800">📁 Upload Document</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Collected Today</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.docsCollectedToday}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Docs Verified</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.docsVerified}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Pending Docs</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.pendingDocCount}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Expiring This Month</div>
                            <div className="text-xl font-black text-rose-600 mt-1">{data.metrics.expiringThisMonth}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Vault Repository</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.digitalRepositorySize}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📁 Digital Document Repository & Expiry Status</h3>
                            <button onClick={handleUploadDocument} className="px-3 py-1 bg-slate-700 text-white rounded text-xs font-semibold">+ Upload Doc</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Customer / Franchise</th>
                                        <th className="p-2.5">Document Type</th>
                                        <th className="p-2.5">Expiry Date</th>
                                        <th className="p-2.5">Uploaded By</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.documents.map(d => (
                                        <tr key={d.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-slate-700">{d.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{d.customer}</td>
                                            <td className="p-2.5 font-medium">{d.docType}</td>
                                            <td className="p-2.5 text-slate-500">{d.expiry}</td>
                                            <td className="p-2.5">{d.uploadedBy}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{d.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-700'}`}>
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
