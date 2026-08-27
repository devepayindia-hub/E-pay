'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'galleryManagerData_v3';

const defaultData = () => ({
    user: { name: 'Suresh Manager', role: 'Gallery Manager (Role 9)', gallery: 'Pune Flagship' },
    galleryHealth: 94,
    metrics: {
        todaySales: '₹1.85L',
        monthlyRevenue: '₹42.5L',
        monthlyTarget: '₹45.0L',
        achievement: '94.4%',
        customers: 1850,
        newCustomers: 68,
        leads: 120,
        conversion: '22.8%',
        collection: '₹38.0L',
        outstanding: '₹4.5L',
        complaints: 5,
        staff: 26,
        present: 24,
        visits: 185,
        inventoryValue: '₹18.75L'
    },
    employees: [
        { id: 1, name: 'Amit Verma', role: 'Sales Lead', revenue: '₹5.8L', performance: 116, present: true },
        { id: 2, name: 'Neha Deshmukh', role: 'Sales Lead', revenue: '₹4.2L', performance: 84, present: true },
        { id: 3, name: 'Rohit Sharma', role: 'BDE', revenue: '—', performance: 82, present: true },
    ],
    tasks: [
        { id: 1, title: 'Review monthly sales reports', assignedTo: 'Amit Verma', due: '2026-08-20', priority: 'High', status: 'Pending' },
        { id: 2, title: 'Audit inventory count', assignedTo: 'Neha Deshmukh', due: '2026-08-18', priority: 'Medium', status: 'In Progress' },
    ]
});

const GalleryManagerPage = () => {
    const [data, setData] = useState(() => loadData());
    const [activeTab, setActiveTab] = useState('dashboard');
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);

    function loadData() {
        try {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const def = defaultData();
                    for (const k in def) {
                        if (!parsed[k]) parsed[k] = def[k];
                    }
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('GM load reset error', e);
        }
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

    const openModal = useCallback((title, content) => {
        setModal({ title, content });
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);

    const handleCreateTask = () => {
        openModal(
            '📋 Create Gallery Task',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Task Title *</label>
                <input id="gmTaskTitle" className="w-full border p-2 rounded text-sm mt-1" placeholder="Enter task title..." />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Assigned Staff</label>
                <input id="gmTaskEmp" className="w-full border p-2 rounded text-sm mt-1" placeholder="Staff name..." />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const title = document.getElementById('gmTaskTitle').value || 'New Task';
                        const emp = document.getElementById('gmTaskEmp').value || 'Amit Verma';
                        const newTask = { id: Date.now(), title, assignedTo: emp, due: new Date().toISOString().slice(0, 10), priority: 'Medium', status: 'Pending' };
                        updateData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
                        showToast(`📋 Task created for ${emp}!`);
                        closeModal();
                    }} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded text-xs hover:bg-emerald-700">Create Task</button>
                </div>
            </div>
        );
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 rounded-xl border border-emerald-700/40 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="text-xs uppercase font-bold text-emerald-300 tracking-wider">{data.user.role} • {data.user.gallery}</div>
                        <div className="text-2xl font-black mt-1">Gallery Health Score <span className="text-emerald-300">{data.galleryHealth}%</span></div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                        <div>Staff: {data.metrics.present}/{data.metrics.staff} Present</div>
                        <div className="text-emerald-300 mt-1 font-semibold">Today's Sales: {data.metrics.todaySales}</div>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Monthly Revenue</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.monthlyRevenue}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Target {data.metrics.monthlyTarget}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Achievement</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.achievement}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Customers</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.customers}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">+{data.metrics.newCustomers} new</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Conversion Rate</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.conversion}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Inventory Value</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.inventoryValue}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Complaints</div>
                    <div className="text-xl font-black text-rose-600 mt-1">{data.metrics.complaints}</div>
                </div>
            </div>

            {/* Staff List */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-slate-800">👥 Gallery Staff ({data.employees.length})</h3>
                    <button onClick={handleCreateTask} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">+ Create Task</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-2.5">Name</th>
                                <th className="p-2.5">Role</th>
                                <th className="p-2.5">Revenue</th>
                                <th className="p-2.5">Performance</th>
                                <th className="p-2.5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {data.employees.map(e => (
                                <tr key={e.id} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-slate-900">{e.name}</td>
                                    <td className="p-2.5">{e.role}</td>
                                    <td className="p-2.5 font-bold text-emerald-600">{e.revenue}</td>
                                    <td className="p-2.5 font-bold">{e.performance}%</td>
                                    <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Present</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">GM</div>
                    <div>
                        <div className="font-bold text-white text-base">Gallery <span className="text-emerald-400">Manager</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Role 9 • Owner</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Command Center', 'fa-house'],
                        ['health', 'Health Score', 'fa-heart-pulse'],
                        ['tasks', 'Gallery Tasks', 'fa-list-check'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="font-bold text-white">{data.user.name}</div>
                    <div className="text-[10px] text-emerald-400">{data.user.gallery}</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Gallery Manager Portal (Role 9)</div>
                    <button onClick={handleCreateTask} className="px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">+ Create Task</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {['health', 'tasks'].includes(activeTab) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeTab} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live gallery data active.</p>
                        </div>
                    )}
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
};

export default GalleryManagerPage;
