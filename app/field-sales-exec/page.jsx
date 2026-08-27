'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'fieldSalesExecData_v1';

const defaultData = () => ({
    user: { name: 'Suresh Patil', role: 'Field Sales Executive' },
    metrics: {
        todaysVisits: 8,
        completedVisits: 5,
        pendingVisits: 3,
        fieldLeads: 14,
        conversions: 4,
        fieldRevenue: '₹4.8 L',
        distanceTraveled: '24.5 km',
        dailyExpenses: '₹450'
    },
    visits: [
        { id: 'VST-101', client: 'Maharashtra Retailers Store', location: 'FC Road, Pune', checkIn: '10:15 AM', checkOut: '11:00 AM', status: 'Completed', outcome: 'Interested in POS Terminal', expense: '₹120' },
        { id: 'VST-102', client: 'Sai Travels & Tours', location: 'Deccan, Pune', checkIn: '11:45 AM', checkOut: '12:30 PM', status: 'Completed', outcome: 'Booked ePay Travel Package', expense: '₹150' },
        { id: 'VST-103', client: 'Swastik Electronics', location: 'Kothrud, Pune', checkIn: 'Pending', checkOut: '-', status: 'Pending', outcome: 'Scheduled for 03:00 PM', expense: '₹0' }
    ]
});

export default function FieldSalesExecPage() {
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

    const handleCheckIn = () => {
        openModal(
            '📍 GPS Check-in & Start Field Visit',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Client / Shop Name *</label>
                <input id="vstClient" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Laxmi Super Market" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Location / Pincode</label>
                <input id="vstLoc" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Hadapsar, Pune (Pincode: 411028)" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const client = document.getElementById('vstClient')?.value || 'Client Store';
                        const location = document.getElementById('vstLoc')?.value || 'Pune Field';
                        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const newV = { id: `VST-10${data.visits.length + 1}`, client, location, checkIn: timeStr, checkOut: '-', status: 'In Progress', outcome: 'Meeting in progress...', expense: '₹50' };
                        updateData(prev => ({
                            ...prev,
                            visits: [...prev.visits, newV],
                            metrics: { ...prev.metrics, todaysVisits: prev.metrics.todaysVisits + 1 }
                        }));
                        showToast(`📍 Checked-in at ${client}! GPS Location recorded.`);
                        closeModal();
                    }} className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded text-xs hover:bg-emerald-800">📍 Check-In Now</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center text-lg">📍</div>
                    <div>
                        <div className="font-bold text-white text-base">Field Sales <span className="text-emerald-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">GPS Check-in & Visits</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['visits', 'Today\'s Field Visits', 'fa-location-dot'],
                        ['expenses', 'Travel Expenses', 'fa-receipt'],
                        ['reports', 'Daily Visit Reports', 'fa-file-lines'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-emerald-700 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Field Sales & Location Attendance Portal</div>
                    <button onClick={handleCheckIn} className="px-3.5 py-1.5 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800">📍 GPS Check-In</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Today's Visits</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.todaysVisits}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Completed</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.completedVisits}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Pending</div>
                            <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.pendingVisits}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Field Leads</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.fieldLeads}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Conversions</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.conversions}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Revenue</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.fieldRevenue}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Distance</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.distanceTraveled}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Expenses</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.dailyExpenses}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📍 Field Visit Schedule & GPS Log</h3>
                            <button onClick={handleCheckIn} className="px-3 py-1 bg-emerald-700 text-white rounded text-xs font-semibold">+ Check-In</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Client / Shop</th>
                                        <th className="p-2.5">Location</th>
                                        <th className="p-2.5">Check-In</th>
                                        <th className="p-2.5">Check-Out</th>
                                        <th className="p-2.5">Outcome</th>
                                        <th className="p-2.5">Travel Exp.</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.visits.map(v => (
                                        <tr key={v.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-emerald-700">{v.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{v.client}</td>
                                            <td className="p-2.5 text-slate-500">{v.location}</td>
                                            <td className="p-2.5 font-medium text-emerald-600">{v.checkIn}</td>
                                            <td className="p-2.5 font-medium">{v.checkOut}</td>
                                            <td className="p-2.5">{v.outcome}</td>
                                            <td className="p-2.5 font-bold text-purple-600">{v.expense}</td>
                                            <td className="p-2.5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{v.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-700'}`}>
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
