'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'kycExecData_v1';

const defaultData = () => ({
    user: { name: 'Amit Sharma', role: 'KYC & Verification Executive' },
    metrics: {
        kycPending: 12,
        underReview: 5,
        verifiedToday: 48,
        rejectedToday: 2,
        resubmissionRequired: 3,
        suspiciousEscalated: 1
    },
    kycList: [
        { id: 'KYC-101', name: 'Ramesh Patel', type: 'Merchant Aadhaar & PAN', submittedDate: '2026-08-23', status: 'Pending', rejectionReason: '' },
        { id: 'KYC-102', name: 'Swastik Enterprises', type: 'Franchise GST & Bank Cheque', submittedDate: '2026-08-23', status: 'Under Review', rejectionReason: '' }
    ]
});

export default function KycExecPage() {
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

    const handleUpdateKycStatus = (id, newStatus) => {
        if (newStatus === 'Rejected') {
            openModal(
                '❌ Reject KYC & Record Reason',
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mt-2">Rejection Reason *</label>
                    <textarea id="kycRejReason" className="w-full border p-2 rounded text-sm mt-1 h-20" placeholder="Blurred Aadhaar image / Pan mismatch..." />
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                        <button onClick={() => {
                            const reason = document.getElementById('kycRejReason')?.value || 'Document mismatch';
                            updateData(prev => ({
                                ...prev,
                                kycList: prev.kycList.map(k => k.id === id ? { ...k, status: 'Rejected', rejectionReason: reason } : k),
                                metrics: { ...prev.metrics, rejectedToday: prev.metrics.rejectedToday + 1 }
                            }));
                            showToast(`❌ KYC ${id} rejected (${reason})!`);
                            closeModal();
                        }} className="px-4 py-2 bg-rose-600 text-white font-semibold rounded text-xs hover:bg-rose-700">Confirm Rejection</button>
                    </div>
                </div>
            );
        } else {
            updateData(prev => ({
                ...prev,
                kycList: prev.kycList.map(k => k.id === id ? { ...k, status: newStatus } : k),
                metrics: newStatus === 'Verified' ? { ...prev.metrics, verifiedToday: prev.metrics.verifiedToday + 1 } : prev.metrics
            }));
            showToast(`✅ KYC ${id} status updated to ${newStatus}!`);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg">🛡️</div>
                    <div>
                        <div className="font-bold text-white text-base">KYC <span className="text-indigo-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Verification Workflow Engine</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['kyc-queue', 'KYC Queue', 'fa-id-card'],
                        ['escalations', 'Suspicious Cases', 'fa-shield-triangle-exclamation'],
                        ['history', 'Verification History', 'fa-history'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">KYC & Identity Verification Processing Portal</div>
                    <div className="text-xs font-semibold text-slate-500">Status Workflow: Pending → Under Review → Verified / Rejected</div>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Pending KYC</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.kycPending}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Under Review</div>
                            <div className="text-xl font-black text-indigo-600 mt-1">{data.metrics.underReview}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Verified Today</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.verifiedToday}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Rejected Today</div>
                            <div className="text-xl font-black text-rose-600 mt-1">{data.metrics.rejectedToday}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Resubmission Req</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.resubmissionRequired}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Suspicious Cases</div>
                            <div className="text-xl font-black text-rose-600 mt-1">{data.metrics.suspiciousEscalated}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🛡️ KYC Applications & Verification Roster</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">KYC ID</th>
                                        <th className="p-2.5">Applicant Name</th>
                                        <th className="p-2.5">Document Set</th>
                                        <th className="p-2.5">Submitted Date</th>
                                        <th className="p-2.5">Status</th>
                                        <th className="p-2.5">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.kycList.map(k => (
                                        <tr key={k.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-indigo-600">{k.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{k.name}</td>
                                            <td className="p-2.5 text-slate-500">{k.type}</td>
                                            <td className="p-2.5">{k.submittedDate}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">{k.status}</span></td>
                                            <td className="p-2.5">
                                                <div className="flex gap-1.5">
                                                    <button onClick={() => handleUpdateKycStatus(k.id, 'Verified')} className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">Approve</button>
                                                    <button onClick={() => handleUpdateKycStatus(k.id, 'Rejected')} className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold">Reject</button>
                                                </div>
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
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-indigo-600'}`}>
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
