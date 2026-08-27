'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'prodTrainingExecData_v1';

const defaultData = () => ({
    user: { name: 'Neha Gupta', role: 'Product Training Executive' },
    metrics: {
        totalProductsCovered: 16,
        faqsMaintained: 142,
        productCertifications: 285,
        avgProductQuizScore: '92.4%',
        activeModules: 8
    },
    materials: [
        { id: 'PRD-101', product: 'ePay Travel Booking Engine 2.0', version: 'v2.4', updated: '2026-08-10', certRequired: true },
        { id: 'PRD-102', product: 'AEPS & Micro-ATM Services', version: 'v1.8', updated: '2026-08-01', certRequired: true },
        { id: 'PRD-103', product: 'Franchise POS & Inventory System', version: 'v3.1', updated: '2026-07-25', certRequired: false }
    ]
});

export default function ProdTrainingExecPage() {
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

    const handleUploadMaterial = () => {
        openModal(
            '📦 Upload Product Training Material',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Product Name *</label>
                <input id="prdName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ePay UPI QR v2" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Version</label>
                <input id="prdVer" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. v2.1" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('prdName')?.value || 'New Product Module';
                        const ver = document.getElementById('prdVer')?.value || 'v1.0';
                        const newM = { id: `PRD-10${data.materials.length + 1}`, product: name, version: ver, updated: new Date().toISOString().slice(0, 10), certRequired: true };
                        updateData(prev => ({ ...prev, materials: [...prev.materials, newM] }));
                        showToast(`📦 Product material for ${name} uploaded & teams notified!`);
                        closeModal();
                    }} className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded text-xs hover:bg-cyan-700">Upload & Notify</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white font-black flex items-center justify-center text-lg">📦</div>
                    <div>
                        <div className="font-bold text-white text-base">Product Training <span className="text-cyan-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">ePay Product Knowledge</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['materials', 'Product Content', 'fa-boxes-packing'],
                        ['faqs', 'Product FAQs', 'fa-circle-question'],
                        ['quiz', 'Assessments', 'fa-file-circle-check'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-cyan-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">ePay Products & Services Training Portal</div>
                    <button onClick={handleUploadMaterial} className="px-3.5 py-1.5 bg-cyan-600 text-white rounded text-xs font-semibold hover:bg-cyan-700">📦 Upload Material</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Products Covered</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.totalProductsCovered}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Product FAQs</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.faqsMaintained}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Certifications</div>
                            <div className="text-xl font-black text-cyan-600 mt-1">{data.metrics.productCertifications}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Quiz Avg Score</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.avgProductQuizScore}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Active Modules</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.materials.length}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📦 Product Training Materials & Versioning</h3>
                            <button onClick={handleUploadMaterial} className="px-3 py-1 bg-cyan-600 text-white rounded text-xs font-semibold">+ Upload</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Product Name</th>
                                        <th className="p-2.5">Version</th>
                                        <th className="p-2.5">Last Updated</th>
                                        <th className="p-2.5">Cert. Mandatory</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.materials.map(m => (
                                        <tr key={m.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-cyan-600">{m.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{m.product}</td>
                                            <td className="p-2.5 text-slate-500">{m.version}</td>
                                            <td className="p-2.5">{m.updated}</td>
                                            <td className="p-2.5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.certRequired ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{m.certRequired ? 'Yes' : 'Optional'}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-cyan-600'}`}>
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
