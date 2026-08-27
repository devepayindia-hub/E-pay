'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'qualityExecData_v1';

const defaultData = () => ({
    user: { name: 'Deepak Verma', role: 'Process & Quality Executive' },
    metrics: {
        auditsCompleted: 48,
        dataAccuracyScore: '99.4%',
        sopComplianceRate: '98.2%',
        processErrorsFound: 3,
        correctiveActionsClosed: 14
    },
    audits: [
        { id: 'QAU-101', process: 'KYC Document Verification Audit', sampleSize: 100, accuracy: '99.0%', compliance: 'Passed', status: 'Approved' },
        { id: 'QAU-102', process: 'BDE Sales Lead Log & Data Entry Quality', sampleSize: 50, accuracy: '98.5%', compliance: 'Minor Deviation', status: 'Action Required' }
    ]
});

export default function QualityExecPage() {
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

    const handlePerformQualityAudit = () => {
        openModal(
            '🔍 Log Process Quality Audit',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Process Name *</label>
                <input id="qPrcName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Telecalling Script Compliance Audit" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Sample Size audited</label>
                <input id="qSample" type="number" className="w-full border p-2 rounded text-sm mt-1" placeholder="50" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const process = document.getElementById('qPrcName')?.value || 'Process Audit';
                        const sampleSize = parseInt(document.getElementById('qSample')?.value) || 50;
                        const newA = { id: `QAU-10${data.audits.length + 1}`, process, sampleSize, accuracy: '99.5%', compliance: 'Passed', status: 'Approved' };
                        updateData(prev => ({
                            ...prev,
                            audits: [...prev.audits, newA],
                            metrics: { ...prev.metrics, auditsCompleted: prev.metrics.auditsCompleted + 1 }
                        }));
                        showToast(`🔍 Quality audit for "${process}" logged!`);
                        closeModal();
                    }} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded text-xs hover:bg-emerald-700">Save Audit</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">🛡️</div>
                    <div>
                        <div className="font-bold text-white text-base">Quality <span className="text-emerald-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Process & Data Accuracy</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['audits', 'Quality Audits', 'fa-magnifying-glass-chart'],
                        ['sop-compliance', 'SOP Compliance', 'fa-file-shield'],
                        ['reports', 'Quality Reports', 'fa-chart-pie'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Process & Data Quality Audit Command Portal</div>
                    <button onClick={handlePerformQualityAudit} className="px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">🔍 Perform Audit</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Audits Completed</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.auditsCompleted}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Data Accuracy</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.dataAccuracyScore}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">SOP Compliance</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.sopComplianceRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Errors Found</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.processErrorsFound}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Actions Closed</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.correctiveActionsClosed}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🛡️ Process Quality & SOP Audit Log</h3>
                            <button onClick={handlePerformQualityAudit} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold">+ Log Audit</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Process Name</th>
                                        <th className="p-2.5">Sample Size</th>
                                        <th className="p-2.5">Accuracy Score</th>
                                        <th className="p-2.5">Compliance</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.audits.map(a => (
                                        <tr key={a.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-emerald-600">{a.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{a.process}</td>
                                            <td className="p-2.5">{a.sampleSize} records</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{a.accuracy}</td>
                                            <td className="p-2.5 font-medium">{a.compliance}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{a.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
}
