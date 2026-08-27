'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'tdData_v1';

const defaultData = () => ({
    user: { name: 'Technical Director', role: 'TD' },
    engineeringHealth: 92,
    metrics: {
        activeProjects: 18,
        onTrackProjects: 14,
        atRiskProjects: 3,
        criticalProjects: 1,
        activeDevs: 42,
        utilization: '87%',
        openTasks: 318,
        overdueTasks: 27,
        sprintCompletion: '91%',
        criticalBugs: 5,
        qaPassRate: '94%',
        releaseReadiness: '92%',
        deploySuccess: '97%',
        incidents: 2,
        supportTickets: 86,
        slaCompliance: '95%',
        techDebt: '18%',
        pendingApprovals: 11
    },
    projects: [
        { id: 1, name: 'CRM 2.0', techLead: 'Rahul', devs: 8, phase: 'Sprint 24', progress: '72%', budget: '₹12 L', actual: '₹8.6 L', bugs: 4, risk: 'Low', status: 'On Track' },
        { id: 2, name: 'Mobile App v3', techLead: 'Priya', devs: 5, phase: 'Sprint 12', progress: '89%', budget: '₹8 L', actual: '₹6.2 L', bugs: 2, risk: 'Low', status: 'On Track' },
        { id: 3, name: 'Payment Gateway 2.0', techLead: 'Ankit', devs: 4, phase: 'Sprint 8', progress: '58%', budget: '₹6 L', actual: '₹5.1 L', bugs: 6, risk: 'High', status: 'At Risk' },
        { id: 4, name: 'AI Lead Scoring', techLead: 'Sneha', devs: 3, phase: 'Sprint 3', progress: '41%', budget: '₹4 L', actual: '₹3.2 L', bugs: 8, risk: 'Critical', status: 'Critical' },
    ],
    developers: [
        { id: 1, name: 'Rahul S.', role: 'Full Stack', project: 'CRM 2.0', tasks: 18, completed: 14, overdue: 2, util: '100%', quality: '94%', status: 'Overloaded' },
        { id: 2, name: 'Priya M.', role: 'Android', project: 'Mobile v3', tasks: 12, completed: 11, overdue: 0, util: '88%', quality: '96%', status: 'OK' },
        { id: 3, name: 'Ankit V.', role: 'Backend', project: 'Payment GW', tasks: 14, completed: 9, overdue: 3, util: '95%', quality: '91%', status: 'High Load' },
        { id: 4, name: 'Sneha P.', role: 'Frontend', project: 'CRM 2.0', tasks: 10, completed: 8, overdue: 1, util: '72%', quality: '93%', status: 'Available' },
    ],
    blockers: [
        { id: 1, code: 'BLK-012', project: 'Payment GW', task: 'API Integration', dev: '4 developers', type: 'Dependency', age: '9h', impact: 'High', status: 'Open' },
        { id: 2, code: 'BLK-011', project: 'CRM 2.0', task: 'Lead Import', dev: 'Rahul', type: 'External API', age: '1d', impact: 'Medium', status: 'Investigating' },
    ],
    approvals: [
        { id: 1, req: 'Resource: +2 devs for CRM V2', type: 'Resource', by: 'Tech Lead', status: 'Pending' },
        { id: 2, req: 'Release v4.8.0', type: 'Release', by: 'QA Lead', status: 'Pending' },
        { id: 3, req: 'Emergency production hotfix', type: 'Deploy', by: 'DevOps', status: 'Urgent' },
    ]
});

const TechnicalDirectorPage = () => {
    const [data, setData] = useState(() => loadData());
    const [activeTab, setActiveTab] = useState('td-command');
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
            console.warn('TD load reset error', e);
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

    const handleApproval = (id, action) => {
        updateData(prev => ({
            ...prev,
            approvals: prev.approvals.filter(a => a.id !== id)
        }));
        showToast(`✅ Approval #${id} ${action}!`);
    };

    const handleAddProject = () => {
        openModal(
            '📁 Create Engineering Project',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Project Name</label>
                <input id="prjName" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ERP Billing Module" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Tech Lead</label>
                <input id="prjLead" className="w-full border p-2 rounded text-sm mt-1" placeholder="Lead Name" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Budget (₹)</label>
                <input id="prjBudget" type="number" className="w-full border p-2 rounded text-sm mt-1" placeholder="800000" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('prjName').value || 'New Project';
                        const techLead = document.getElementById('prjLead').value || 'Lead';
                        const budgetVal = Number(document.getElementById('prjBudget').value) || 800000;
                        const newPrj = {
                            id: Date.now(),
                            name,
                            techLead,
                            devs: 4,
                            phase: 'Sprint 1',
                            progress: '15%',
                            budget: `₹${(budgetVal / 100000).toFixed(1)} L`,
                            actual: '₹0.5 L',
                            bugs: 0,
                            risk: 'Low',
                            status: 'On Track'
                        };
                        updateData(prev => ({ ...prev, projects: [newPrj, ...prev.projects] }));
                        showToast(`📁 Project "${name}" initialized`);
                        closeModal();
                    }} className="px-4 py-2 bg-purple-600 text-white font-semibold rounded text-xs hover:bg-purple-700">Create Project</button>
                </div>
            </div>
        );
    };

    const renderCommandCenter = () => (
        <div className="space-y-5">
            {/* Scorecard Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-5 rounded-xl border border-purple-700/40 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="text-xs uppercase font-bold text-purple-300 tracking-wider">Technical Director • Engineering Scorecard</div>
                        <div className="text-2xl font-black mt-1">Overall Engineering Health <span className="text-purple-300">{data.engineeringHealth}%</span></div>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                        <div>Period: Aug 2026 • Enterprise Architecture</div>
                        <div className="text-purple-300 mt-1 font-semibold">Delivery • Velocity • Quality • Code Audit</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-xs">
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Project Delivery</div><div className="text-lg font-bold text-emerald-400">93%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Sprint Velocity</div><div className="text-lg font-bold text-emerald-400">90%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Dev Productivity</div><div className="text-lg font-bold text-emerald-400">89%</div></div>
                    <div className="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">Code Quality</div><div className="text-lg font-bold text-emerald-400">94%</div></div>
                    <div class="bg-white/10 p-2.5 rounded-lg border border-white/10"><div className="text-slate-300 text-[10px]">QA Quality</div><div className="text-lg font-bold text-emerald-400">95%</div></div>
                </div>
            </div>

            {/* Metrics Tower */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div onClick={() => setActiveTab('td-projects')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-purple-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Active Projects</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.activeProjects}</div>
                </div>
                <div onClick={() => setActiveTab('td-developers')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-purple-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Active Developers</div>
                    <div className="text-lg font-black text-slate-900 mt-1">{data.metrics.activeDevs}</div>
                </div>
                <div onClick={() => setActiveTab('td-bugs')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-purple-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Critical Bugs</div>
                    <div className="text-lg font-black text-rose-600 mt-1">{data.metrics.criticalBugs}</div>
                </div>
                <div onClick={() => setActiveTab('td-readiness')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-purple-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Release Readiness</div>
                    <div className="text-lg font-black text-emerald-600 mt-1">{data.metrics.releaseReadiness}</div>
                </div>
                <div onClick={() => setActiveTab('td-blockers')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-purple-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Active Blockers</div>
                    <div className="text-lg font-black text-amber-600 mt-1">{data.blockers.length}</div>
                </div>
                <div onClick={() => setActiveTab('td-approvals')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-purple-500 cursor-pointer">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Pending Approvals</div>
                    <div className="text-lg font-black text-purple-600 mt-1">{data.approvals.length}</div>
                </div>
            </div>

            {/* Blockers & Alerts */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-sm text-slate-800 mb-3"><i className="fa-solid fa-ban text-rose-500 mr-2"></i>Active Blockers</h3>
                <div className="space-y-2 text-xs">
                    {data.blockers.map(b => (
                        <div key={b.id} className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex justify-between items-center">
                            <div>
                                <div className="font-bold text-rose-900">{b.code}: {b.task} ({b.project})</div>
                                <div className="text-slate-600 text-[11px] mt-0.5">Impact: {b.dev} • Age: {b.age}</div>
                            </div>
                            <span className="px-2.5 py-1 bg-rose-200 text-rose-900 rounded font-bold">{b.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-lg">TD</div>
                    <span className="font-bold text-white tracking-tight text-lg">Technical <span className="text-purple-400">Director</span></span>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-2">Engineering Management</div>
                    {[
                        ['td-command', 'Technical Command', 'fa-tachometer-alt'],
                        ['td-projects', 'Project Portfolio (18)', 'fa-folder-open'],
                        ['td-developers', 'Developers & Workload', 'fa-users'],
                        ['td-blockers', 'Blocker Center', 'fa-ban'],
                        ['td-approvals', 'Approval Center', 'fa-check-circle'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-purple-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="font-bold text-white">{data.user.name}</div>
                    <div className="text-[10px] text-purple-400">Engineering Command</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Technical Director Command Center</div>
                    <button onClick={handleAddProject} className="px-3.5 py-1.5 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700">+ New Project</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'td-command' && renderCommandCenter()}
                    {activeTab === 'td-projects' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-sm text-slate-800">📁 Active Engineering Projects ({data.projects.length})</h3>
                                <button onClick={handleAddProject} className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700">+ New Project</button>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                        <tr>
                                            <th className="p-3">Project</th>
                                            <th className="p-3">Tech Lead</th>
                                            <th className="p-3">Devs</th>
                                            <th className="p-3">Phase</th>
                                            <th className="p-3">Progress</th>
                                            <th className="p-3">Budget</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-slate-700">
                                        {data.projects.map(p => (
                                            <tr key={p.id}>
                                                <td className="p-3 font-bold text-slate-900">{p.name}</td>
                                                <td className="p-3">{p.techLead}</td>
                                                <td className="p-3">{p.devs}</td>
                                                <td className="p-3">{p.phase}</td>
                                                <td className="p-3 font-bold text-emerald-600">{p.progress}</td>
                                                <td className="p-3">{p.budget}</td>
                                                <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'On Track' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{p.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === 'td-developers' && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm text-slate-800">👤 Developer Workload & Capacity</h3>
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                        <tr>
                                            <th className="p-3">Developer</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3">Project</th>
                                            <th className="p-3">Utilization</th>
                                            <th className="p-3">Quality</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-slate-700">
                                        {data.developers.map(d => (
                                            <tr key={d.id}>
                                                <td className="p-3 font-bold text-slate-900">{d.name}</td>
                                                <td className="p-3">{d.role}</td>
                                                <td className="p-3">{d.project}</td>
                                                <td className="p-3 font-bold">{d.util}</td>
                                                <td className="p-3 text-emerald-600 font-bold">{d.quality}</td>
                                                <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.status === 'OK' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{d.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === 'td-approvals' && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <h3 className="font-bold text-sm text-slate-800 mb-3">✍️ Technical Director Approval Queue</h3>
                            {data.approvals.map(a => (
                                <div key={a.id} className="p-3 border rounded-lg flex justify-between items-center text-xs">
                                    <div><strong>{a.req}</strong> ({a.type}) by {a.by}</div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApproval(a.id, 'Approved')} className="px-3 py-1 bg-purple-600 text-white rounded font-semibold">Approve</button>
                                        <button onClick={() => handleApproval(a.id, 'Rejected')} className="px-3 py-1 bg-rose-600 text-white rounded font-semibold">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-purple-600'}`}>
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

export default TechnicalDirectorPage;
