'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'gdmData_v2';

const defaultData = () => ({
    user: { name: 'Ravi', role: 'Gallery District Manager' },
    district: { name: 'District A', region: 'North', hq: 'HQ North' },
    metrics: {
        totalGalleries: 4,
        totalEmployees: 8,
        present: 7,
        absent: 1,
        todayRevenue: '₹4.5L',
        monthlyRevenue: '₹23.5L',
        districtTarget: '₹26.0L',
        achievement: '90%',
        newCustomers: 51,
        newLeads: 75,
        fieldVisits: 125,
        collections: '₹20.6L',
        outstanding: '₹2.9L',
        pendingTasks: 4,
        criticalIssues: 1
    },
    galleries: [
        { id: 1, name: 'Gallery Alpha', manager: 'Rajesh', revenue: '6.0L', target: '7.0L', ach: '86%', customers: 85, leads: 18, performance: 84, status: 'Active' },
        { id: 2, name: 'Gallery Beta', manager: 'Sneha', revenue: '7.0L', target: '7.5L', ach: '93%', customers: 95, leads: 22, performance: 91, status: 'Active' },
        { id: 3, name: 'Gallery Gamma', manager: 'Amit', revenue: '5.0L', target: '5.5L', ach: '91%', customers: 75, leads: 15, performance: 88, status: 'Active' },
        { id: 4, name: 'Gallery Delta', manager: 'Priya', revenue: '5.5L', target: '6.0L', ach: '92%', customers: 80, leads: 20, performance: 90, status: 'Active' },
    ],
    employees: [
        { id: 1, name: 'Rajesh', role: 'Gallery Manager', gallery: 'Gallery Alpha', present: true, tasks: 5, visits: 25, leads: 18, performance: 84 },
        { id: 2, name: 'Sneha', role: 'Gallery Manager', gallery: 'Gallery Beta', present: true, tasks: 4, visits: 20, leads: 22, performance: 91 },
        { id: 3, name: 'Amit', role: 'Gallery Manager', gallery: 'Gallery Gamma', present: false, tasks: 3, visits: 18, leads: 15, performance: 88 },
        { id: 4, name: 'Priya', role: 'Gallery Manager', gallery: 'Gallery Delta', present: true, tasks: 6, visits: 22, leads: 20, performance: 90 },
        { id: 5, name: 'Suresh', role: 'BDE', gallery: 'Gallery Alpha', present: true, tasks: 8, visits: 40, leads: 30, performance: 82 },
        { id: 6, name: 'Meena', role: 'BDO', gallery: 'Gallery Beta', present: true, tasks: 6, visits: 35, leads: 20, performance: 80 },
    ],
    tasks: [
        { id: 1, title: 'Review gallery sales reports', assignedTo: 'Rajesh', due: '2026-08-20', priority: 'High', status: 'Pending' },
        { id: 2, title: 'Visit Gallery Gamma for audit', assignedTo: 'Amit', due: '2026-08-18', priority: 'Medium', status: 'In Progress' },
        { id: 3, title: 'Follow-up with high-value leads', assignedTo: 'Suresh', due: '2026-08-16', priority: 'High', status: 'Completed' },
    ]
});

const GalleryDistrictManagerPage = () => {
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
            console.warn('GDM load reset error', e);
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
            '📝 Create District Task',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Task Title *</label>
                <input id="taskTitle" className="w-full border p-2 rounded text-sm mt-1" placeholder="Task title..." />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Assigned To</label>
                <input id="taskAssigned" className="w-full border p-2 rounded text-sm mt-1" placeholder="Employee name..." />
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Due Date</label>
                        <input id="taskDue" type="date" className="w-full border p-2 rounded text-sm mt-1" defaultValue={new Date().toISOString().slice(0, 10)} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Priority</label>
                        <select id="taskPrio" className="w-full border p-2 rounded text-sm mt-1">
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const title = document.getElementById('taskTitle').value || 'New Task';
                        const assignedTo = document.getElementById('taskAssigned').value || 'Rajesh';
                        const due = document.getElementById('taskDue').value || new Date().toISOString().slice(0, 10);
                        const priority = document.getElementById('taskPrio').value || 'Medium';
                        const newTask = { id: Date.now(), title, assignedTo, due, priority, status: 'Pending' };
                        updateData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
                        showToast(`📝 Task created and assigned to ${assignedTo}`);
                        closeModal();
                    }} className="px-4 py-2 bg-green-600 text-white font-semibold rounded text-xs hover:bg-green-700">Create Task</button>
                </div>
            </div>
        );
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-green-950 to-slate-900 text-white p-5 rounded-xl border border-green-700/40 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="text-xs uppercase font-bold text-green-300 tracking-wider">{data.user.role} • {data.district.name}</div>
                        <div className="text-2xl font-black mt-1">District Target Achievement <span className="text-green-300">{data.metrics.achievement}</span></div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                        <div>HQ: {data.district.hq} • Region: {data.district.region}</div>
                        <div className="text-green-300 mt-1 font-semibold">Galleries: {data.metrics.totalGalleries} • Staff: {data.metrics.totalEmployees}</div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Galleries</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.totalGalleries}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Employees</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.totalEmployees}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{data.metrics.present} Present</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Today's Rev</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.todayRevenue}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Monthly Rev</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.monthlyRevenue}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Target {data.metrics.districtTarget}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Collections</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.collections}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Outstanding</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.outstanding}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Field Visits</div>
                    <div className="text-xl font-black text-blue-600 mt-1">{data.metrics.fieldVisits}</div>
                    <div className="text-[10px] text-blue-600 font-semibold">GPS Verified</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Pending Tasks</div>
                    <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.pendingTasks}</div>
                </div>
            </div>

            {/* Galleries Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-slate-800">🖼️ District Galleries ({data.galleries.length})</h3>
                    <button onClick={handleCreateTask} className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700">+ Create Task</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-2.5">Gallery</th>
                                <th className="p-2.5">Manager</th>
                                <th className="p-2.5">Revenue</th>
                                <th className="p-2.5">Target</th>
                                <th className="p-2.5">Ach %</th>
                                <th className="p-2.5">Customers</th>
                                <th className="p-2.5">Leads</th>
                                <th className="p-2.5">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {data.galleries.map(g => (
                                <tr key={g.id} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-slate-900">{g.name}</td>
                                    <td className="p-2.5">{g.manager}</td>
                                    <td className="p-2.5 font-bold text-emerald-600">{g.revenue}</td>
                                    <td className="p-2.5 text-slate-500">{g.target}</td>
                                    <td className="p-2.5 font-bold">{g.ach}</td>
                                    <td className="p-2.5">{g.customers}</td>
                                    <td className="p-2.5">{g.leads}</td>
                                    <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{g.performance}%</span></td>
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
                    <div className="w-9 h-9 rounded-xl bg-green-600 text-white font-black flex items-center justify-center text-lg">GDM</div>
                    <div>
                        <div className="font-bold text-white text-base">District <span className="text-green-400">Manager</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">{data.district.name}</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Overview Dashboard', 'fa-house'],
                        ['galleries', 'District Galleries', 'fa-images'],
                        ['team', 'Team Performance', 'fa-users'],
                        ['tasks', 'District Tasks', 'fa-list-check'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-green-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="font-bold text-white">{data.user.name}</div>
                    <div className="text-[10px] text-green-400">{data.user.role}</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Gallery District Manager Portal</div>
                    <button onClick={handleCreateTask} className="px-3.5 py-1.5 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700">+ Create Task</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'galleries' && renderDashboard()}
                    {['team', 'tasks'].includes(activeTab) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeTab} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live district data active.</p>
                        </div>
                    )}
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-green-600'}`}>
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

export default GalleryDistrictManagerPage;
