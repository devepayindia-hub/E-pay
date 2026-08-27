'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'galleryOpsMgrData_v1';

const defaultData = () => ({
    user: { name: 'Anita Desai', role: 'Gallery Operations Manager' },
    metrics: {
        todaysSales: '₹1.85 L',
        footfall: 142,
        newMembers: 18,
        expenses: '₹4,200',
        inventoryValue: '₹18.5 L',
        employeesCount: 8,
        attendance: '100%',
        complaints: 0,
        targetAchievement: '96.2%'
    },
    staff: [
        { id: 'STF-101', name: 'Rohan Sharma', role: 'Gallery Exec', checkIn: '09:30 AM', salesToday: '₹45,000', status: 'Present' },
        { id: 'STF-102', name: 'Priya Kulkarni', role: 'Customer Service', checkIn: '09:35 AM', salesToday: '₹62,000', status: 'Present' }
    ]
});

export default function GalleryOpsMgrPage() {
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

    const handleSubmitDailyReport = () => {
        openModal(
            '📊 Submit Daily Gallery Operations Report',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Today's Sales Revenue (₹) *</label>
                <input id="repSales" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. 185000" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Customer Footfall Count</label>
                <input id="repFoot" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. 142" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Daily Gallery Expenses (₹)</label>
                <input id="repExp" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. 4200" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const sales = document.getElementById('repSales')?.value || '185000';
                        showToast(`📊 Daily report submitted! Sales ₹${sales} logged to HQ.`);
                        closeModal();
                    }} className="px-4 py-2 bg-green-700 text-white font-semibold rounded text-xs hover:bg-green-800">Submit Daily Report</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-700 text-white font-black flex items-center justify-center text-lg">🏪</div>
                    <div>
                        <div className="font-bold text-white text-base">Gallery Ops <span className="text-green-400">Mgr</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Pune Central Gallery</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['sales', 'Today\'s Footfall & Sales', 'fa-cart-shopping'],
                        ['inventory', 'Gallery Inventory', 'fa-boxes-stacked'],
                        ['staff', 'Staff Roster & Attendance', 'fa-users'],
                        ['expenses', 'Gallery Expenses', 'fa-receipt'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-green-700 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Gallery Operations & Performance Management Center</div>
                    <button onClick={handleSubmitDailyReport} className="px-3.5 py-1.5 bg-green-700 text-white rounded text-xs font-semibold hover:bg-green-800">📊 Submit Daily Report</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-3 sm:grid-cols-9 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Today's Sales</div>
                            <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.todaysSales}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Footfall</div>
                            <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.footfall}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">New Members</div>
                            <div className="text-lg font-black text-purple-600 mt-1">{data.metrics.newMembers}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Expenses</div>
                            <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.expenses}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Inventory</div>
                            <div className="text-lg font-black text-indigo-600 mt-1">{data.metrics.inventoryValue}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Employees</div>
                            <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.employeesCount}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Attendance</div>
                            <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.attendance}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Complaints</div>
                            <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.complaints}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[9px] font-bold text-slate-500 uppercase">Target Ach.</div>
                            <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.targetAchievement}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">🏪 Gallery Staff Roster & Daily Sales Performance</h3>
                            <button onClick={handleSubmitDailyReport} className="px-3 py-1 bg-green-700 text-white rounded text-xs font-semibold">+ Submit Report</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">Staff ID</th>
                                        <th className="p-2.5">Name</th>
                                        <th className="p-2.5">Role</th>
                                        <th className="p-2.5">Check-In</th>
                                        <th className="p-2.5">Sales Today</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.staff.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-green-700">{s.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{s.name}</td>
                                            <td className="p-2.5 text-slate-500">{s.role}</td>
                                            <td className="p-2.5 font-medium">{s.checkIn}</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{s.salesToday}</td>
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
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-green-700'}`}>
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
