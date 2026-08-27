'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'trainingExecData_v1';

const defaultData = () => ({
    user: { name: 'Karan Patil', role: 'Training & Development Executive' },
    metrics: {
        enrolledStaff: 184,
        attendanceRate: '97.1%',
        assessmentsGraded: 142,
        pendingFollowups: 8,
        certificatesUploaded: 126
    },
    enrollees: [
        { id: 'ENR-101', name: 'Rohan Deshmukh', role: 'BDE', program: 'Sales Pitch Mastery', status: 'Completed', certUploaded: true },
        { id: 'ENR-102', name: 'Deepa Kulkarni', role: 'Telecaller', program: 'Customer Care Scripts', status: 'In Progress', certUploaded: false },
        { id: 'ENR-103', name: 'Sagar Jadhav', role: 'Gallery Exec', program: 'POS & Inventory SOP', status: 'Pending Assessment', certUploaded: false }
    ]
});

export default function TrainingExecPage() {
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

    const handleEnrollEmployee = () => {
        openModal(
            '📝 Enroll Employee into Training Program',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Employee Name *</label>
                <input id="enrName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Ramesh More" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Role & Department</label>
                <input id="enrRole" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. BDE - Pune Central" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Program Name</label>
                <input id="enrProg" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ePay Product Certification v2" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('enrName')?.value || 'Employee';
                        const role = document.getElementById('enrRole')?.value || 'Staff';
                        const program = document.getElementById('enrProg')?.value || 'Training Module';
                        const newE = { id: `ENR-10${data.enrollees.length + 1}`, name, role, program, status: 'Enrolled', certUploaded: false };
                        updateData(prev => ({ ...prev, enrollees: [...prev.enrollees, newE] }));
                        showToast(`📝 ${name} enrolled in ${program}!`);
                        closeModal();
                    }} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded text-xs hover:bg-emerald-700">Enroll Employee</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">📝</div>
                    <div>
                        <div className="font-bold text-white text-base">Training <span className="text-emerald-400">Executive</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Enrollments & Certificates</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['enrollments', 'Employee Enrollments', 'fa-user-plus'],
                        ['certificates', 'Certificate Uploads', 'fa-file-certificate'],
                        ['followups', 'Pending Followups', 'fa-clock-rotate-left'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Training Execution & Learning Records Portal</div>
                    <button onClick={handleEnrollEmployee} className="px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">📝 Enroll Employee</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Enrolled Staff</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.enrolledStaff}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Attendance Rate</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.attendanceRate}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Assessments Graded</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.assessmentsGraded}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Pending Followups</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.pendingFollowups}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Certificates Uploaded</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.certificatesUploaded}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📝 Employee Learning & Enrollment Roster</h3>
                            <button onClick={handleEnrollEmployee} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold">+ Enroll</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Employee Name</th>
                                        <th className="p-2.5">Role</th>
                                        <th className="p-2.5">Program</th>
                                        <th className="p-2.5">Status</th>
                                        <th className="p-2.5">Certificate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.enrollees.map(e => (
                                        <tr key={e.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-emerald-600">{e.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{e.name}</td>
                                            <td className="p-2.5 text-slate-500">{e.role}</td>
                                            <td className="p-2.5 font-medium">{e.program}</td>
                                            <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{e.status}</span></td>
                                            <td className="p-2.5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${e.certUploaded ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'}`}>{e.certUploaded ? 'Uploaded' : 'Pending'}</span></td>
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
