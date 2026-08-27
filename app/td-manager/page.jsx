'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'tdManagerData_v1';

const defaultData = () => ({
    user: { name: 'Kavita Deshmukh', role: 'Training & Development Manager' },
    metrics: {
        annualPlanCompletion: '84%',
        assessmentScoreAvg: '89.2%',
        empImprovementRate: '+16.5%',
        certificationRate: '94%',
        trainingEffectiveness: '4.7/5',
        mandatoryCompliance: '98%'
    },
    paths: [
        { id: 'PATH-01', department: 'Sales / BDE', title: 'Consultative BDE Learning Path', modules: 6, completion: '91%' },
        { id: 'PATH-02', department: 'Telecalling', title: 'Call Excellence & Script Mastery', modules: 4, completion: '95%' },
        { id: 'PATH-03', department: 'Operations', title: 'Gallery Ops & SOP Compliance', modules: 5, completion: '88%' }
    ]
});

export default function TDManagerPage() {
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

    const handleCreateLearningPath = () => {
        openModal(
            '🎓 Create Organizational Learning Path',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Department *</label>
                <input id="lpDept" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Telecalling / BDE" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Learning Path Title</label>
                <input id="lpTitle" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Senior BDE Growth Track" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const dept = document.getElementById('lpDept')?.value || 'General';
                        const title = document.getElementById('lpTitle')?.value || 'New Learning Path';
                        const newP = { id: `PATH-0${data.paths.length + 1}`, department: dept, title, modules: 5, completion: '0%' };
                        updateData(prev => ({ ...prev, paths: [...prev.paths, newP] }));
                        showToast(`🎓 Learning path created for ${dept}!`);
                        closeModal();
                    }} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded text-xs hover:bg-teal-700">Create Learning Path</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-lg">🎓</div>
                    <div>
                        <div className="font-bold text-white text-base">T&D <span className="text-teal-400">Manager</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Strategy & Learning Paths</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'T&D Dashboard', 'fa-house'],
                        ['annual-plan', 'Annual Training Plan', 'fa-calendar-check'],
                        ['learning-paths', 'Learning Paths', 'fa-route'],
                        ['gap-analysis', 'Performance Gap Analysis', 'fa-chart-pie'],
                        ['certifications', 'Certification Expiry', 'fa-award'],
                        ['roi', 'Training ROI & Impact', 'fa-coins'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Organizational Training Strategy Portal</div>
                    <button onClick={handleCreateLearningPath} className="px-3.5 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700">🎓 New Learning Path</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Annual Plan Comp.</div>
                            <div className="text-xl font-black text-teal-600 mt-1">{data.metrics.annualPlanCompletion}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Assessment Avg</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.assessmentScoreAvg}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Emp. Improvement</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.empImprovementRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Certification Rate</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.certificationRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Effectiveness</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.trainingEffectiveness}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Mandatory Compliance</div>
                            <div className="text-xl font-black text-teal-600 mt-1">{data.metrics.mandatoryCompliance}</div>
                        </div>
                    </div>

                    {/* Learning Paths Table */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🎓 Department Learning Paths ({data.paths.length})</h3>
                            <button onClick={handleCreateLearningPath} className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-semibold">+ Create Path</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">Path ID</th>
                                        <th className="p-2.5">Department</th>
                                        <th className="p-2.5">Title</th>
                                        <th className="p-2.5">Modules</th>
                                        <th className="p-2.5">Completion Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.paths.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-teal-600">{p.id}</td>
                                            <td className="p-2.5">{p.department}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{p.title}</td>
                                            <td className="p-2.5">{p.modules} Modules</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{p.completion}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-teal-600'}`}>
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
