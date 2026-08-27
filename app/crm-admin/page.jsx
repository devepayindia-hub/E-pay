'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'crmAdminData_v1';

const defaultData = () => ({
    user: { name: 'CRM Admin', role: 'System Admin' },
    crmHealth: 98.6,
    kpis: {
        activeUsers: 398,
        onlineUsers: 142,
        activeWorkflows: 47,
        activeCampaigns: 18,
        todayLeads: 142,
        monthlyLeads: 3210,
        leadAssignments: 2847,
        failedAutomations: 8,
        openIssues: 14,
        integrationsOperational: 12,
        integrationsTotal: 14,
        dataQualityPct: 87.4,
        pendingRequests: 23,
        openTickets: 9,
        systemAlerts: 3
    },
    users: [
        { id: 1001, name: 'Anita Sharma', role: 'HQ Head', dept: 'Sales', status: 'Active', login: '2h ago' },
        { id: 1002, name: 'Raj Patel', role: 'BDE', dept: 'Business Dev.', status: 'Active', login: '15m ago' },
        { id: 1003, name: 'Sunita Desai', role: 'Gallery Manager', dept: 'Operations', status: 'Inactive', login: '2d ago' },
        { id: 1004, name: 'Mohan Khan', role: 'Marketing Exec.', dept: 'Marketing', status: 'Active', login: '1h ago' },
        { id: 1005, name: 'Priya Yadav', role: 'BDO', dept: 'Field Ops', status: 'Locked', login: '3d ago' },
    ],
    workflows: [
        { id: 1, name: 'Lead Assignment', trigger: 'Lead Created', status: 'Active', success: '98%', lastRun: '2m ago' },
        { id: 2, name: 'Follow-up Reminder', trigger: 'Follow-up Due', status: 'Active', success: '96%', lastRun: '15m ago' },
        { id: 3, name: 'Lead Ageing Alert', trigger: 'Lead Stale', status: 'Active', success: '92%', lastRun: '1h ago' },
        { id: 4, name: 'Daily Report Reminder', trigger: 'Time-based', status: 'Active', success: '89%', lastRun: '8h ago' },
        { id: 5, name: 'Expense Approval', trigger: 'Claim Submitted', status: 'Degraded', success: '76%', lastRun: '3h ago' },
    ],
    tickets: [
        { id: '#1024', cat: 'Login Issue', prio: 'High', status: 'In Progress', sla: '2h left' },
        { id: '#1021', cat: 'Lead Assignment', prio: 'Medium', status: 'Resolved', sla: 'Done' },
        { id: '#1018', cat: 'Workflow Error', prio: 'High', status: 'In Progress', sla: '4h left' },
        { id: '#1012', cat: 'Report Issue', prio: 'Low', status: 'New', sla: '12h left' },
        { id: '#1003', cat: 'Integration', prio: 'High', status: 'Escalated', sla: 'Overdue' }
    ]
});

const CRMAdminDashboard = () => {
    const [data, setData] = useState(() => loadData());
    const [activeSection, setActiveSection] = useState('dashboard');
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
            console.warn('CRM Admin load reset error', e);
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

    const handleAddUser = () => {
        openModal(
            '👤 Add New CRM User',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Full Name</label>
                <input id="usrName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Vikram Singh" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Role</label>
                <select id="usrRole" className="w-full border p-2 rounded text-sm mt-1">
                    <option value="BDE">BDE</option>
                    <option value="BDO">BDO</option>
                    <option value="Gallery Manager">Gallery Manager</option>
                    <option value="HQ Head">HQ Head</option>
                </select>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Department</label>
                <input id="usrDept" className="w-full border p-2 rounded text-sm mt-1" placeholder="Sales / Ops / Field" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('usrName').value || 'New User';
                        const role = document.getElementById('usrRole').value;
                        const dept = document.getElementById('usrDept').value || 'Sales';
                        const newUser = { id: 1000 + data.users.length + 1, name, role, dept, status: 'Active', login: 'Just now' };
                        updateData(prev => ({ ...prev, users: [newUser, ...prev.users] }));
                        showToast(`👤 User "${name}" added successfully`);
                        closeModal();
                    }} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded text-xs hover:bg-emerald-700">Add User</button>
                </div>
            </div>
        );
    };

    const renderDashboard = () => (
        <div className="space-y-5">
            {/* KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-500" onClick={() => showToast('👤 Active Users: 398')}>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Active Users</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.kpis.activeUsers}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-500" onClick={() => showToast('🟢 Online Users: 142')}>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Online Now</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.kpis.onlineUsers}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-500" onClick={() => showToast('❤️ CRM Health: 98.6%')}>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">CRM Health</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.crmHealth}%</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-500" onClick={() => showToast('⚙️ Workflows: 47 Active')}>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Active Workflows</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.kpis.activeWorkflows}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-500" onClick={() => showToast('📈 Monthly Leads: 3,210')}>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Monthly Leads</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.kpis.monthlyLeads.toLocaleString()}</div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-slate-800">👤 User Management ({data.users.length})</h3>
                    <button onClick={handleAddUser} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">+ Add User</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-2">User ID</th>
                                <th className="p-2">Name</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Department</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Last Login</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {data.users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="p-2 text-slate-400 font-mono">#{u.id}</td>
                                    <td className="p-2 font-bold text-slate-900">{u.name}</td>
                                    <td className="p-2">{u.role}</td>
                                    <td className="p-2">{u.dept}</td>
                                    <td className="p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : u.status === 'Locked' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{u.status}</span></td>
                                    <td className="p-2 text-slate-500">{u.login}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Workflows Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-sm text-slate-800 mb-3">⚙️ Active CRM Workflows</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-2">Workflow Name</th>
                                <th className="p-2">Trigger</th>
                                <th className="p-2">Success Rate</th>
                                <th className="p-2">Last Run</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {data.workflows.map(w => (
                                <tr key={w.id} className="hover:bg-slate-50">
                                    <td className="p-2 font-bold text-slate-900">{w.name}</td>
                                    <td className="p-2">{w.trigger}</td>
                                    <td className="p-2 font-bold text-emerald-600">{w.success}</td>
                                    <td className="p-2 text-slate-500">{w.lastRun}</td>
                                    <td className="p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${w.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{w.status}</span></td>
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
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">⚙️</div>
                    <span className="font-bold text-white tracking-tight text-lg">CRM <span className="text-emerald-400">ADMIN</span></span>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-2">System Modules</div>
                    {[
                        ['dashboard', 'System Dashboard', 'fa-th-large'],
                        ['users', 'User Management', 'fa-users-cog'],
                        ['workflows', 'Workflows', 'fa-route'],
                        ['integrations', 'Integrations', 'fa-plug'],
                        ['queries', 'Support Queries', 'fa-clipboard-list'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveSection(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeSection === id ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="font-bold text-white">{data.user.name}</div>
                    <div className="text-[10px] text-emerald-400">{data.user.role} • 412 Total Users</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">CRM System Admin Control Center</div>
                    <button onClick={() => showToast('🔄 Refreshing system metrics...')} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">Refresh System</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeSection === 'dashboard' && renderDashboard()}
                    {activeSection === 'users' && renderDashboard()}
                    {['workflows', 'integrations', 'queries'].includes(activeSection) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeSection} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live CRM administration engine active.</p>
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

export default CRMAdminDashboard;
