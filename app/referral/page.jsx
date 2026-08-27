'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'referralData_v1';

const defaultData = () => ({
    user: { name: 'Rajesh Kumar', role: 'BDE', empId: 'EMP-0042' },
    metrics: {
        total: 24,
        converted: 11,
        convRate: '45.8%',
        referralGmv: '₹48.2L',
        commission: '₹2.14L',
        paidComm: '₹1.6L',
        pending: 7,
        lost: 6,
        followupsDue: 5,
        qualityScore: '91%'
    },
    referrals: [
        { id: 'REF-2026-001', name: 'Mahesh Enterprises', mobile: '9876500001', type: 'Gallery', source: 'Walk-in', status: 'Converted', expected: '₹15L', commission: '₹45,000', created: '2026-06-12' },
        { id: 'REF-2026-002', name: 'Sunita Investments', mobile: '9876500002', type: 'Gallery', source: 'Call', status: 'In Progress', expected: '₹12L', commission: '₹36,000', created: '2026-07-03' },
        { id: 'REF-2026-003', name: 'Ankit Sharma', mobile: '9876500003', type: 'Employee', source: 'Referral', status: 'Converted', expected: '—', commission: '₹8,000', created: '2026-07-15' },
        { id: 'REF-2026-004', name: 'Priya Nair', mobile: '9876500004', type: 'Employee', source: 'WhatsApp', status: 'Contacted', expected: '—', commission: '—', created: '2026-08-01' },
        { id: 'REF-2026-005', name: 'Sharma Constructions', mobile: '9876500005', type: 'Gallery', source: 'Event', status: 'New', expected: '₹20L', commission: '—', created: '2026-08-05' },
        { id: 'REF-2026-006', name: 'Vikram Shah', mobile: '9876500006', type: 'Travel', source: 'Share link', status: 'In Progress', expected: '₹1.5L', commission: '—', created: '2026-08-08' },
        { id: 'REF-2026-007', name: 'Neha Joshi', mobile: '9876500007', type: 'ePay Customer', source: 'WhatsApp', status: 'Converted', expected: '₹1.12L', commission: '₹9,000', created: '2026-07-22' },
    ],
    packages: [
        { id: 1, name: 'ePay Dubai Premium', flag: '🇦🇪', meta: '5N/6D • 5★ All Inclusive', price: '₹1,49,999' },
        { id: 2, name: 'Thailand Honeymoon', flag: '🇹🇭', meta: '6N/7D • 5★ Resort', price: '₹2,15,000' },
        { id: 3, name: 'Paris Getaway', flag: '🇫🇷', meta: '4N/5D • 4★ Breakfast', price: '₹1,85,000' },
        { id: 4, name: 'Kashmir Paradise', flag: '🇮🇳', meta: '5N • Houseboat & Gulmarg', price: '₹42,999' },
    ],
    leaderboard: [
        { rank: 1, name: 'Rahul', refs: 42, bookings: 28, gmv: '₹1.2Cr', comm: '₹4.8L', conv: '66.7%' },
        { rank: 2, name: 'Priya', refs: 36, bookings: 22, gmv: '₹84L', comm: '₹3.6L', conv: '61.1%' },
        { rank: 3, name: 'Amit', refs: 31, bookings: 18, gmv: '₹72L', comm: '₹3.0L', conv: '58.1%' },
        { rank: 4, name: 'Rajesh (You)', refs: 24, bookings: 11, gmv: '₹48.2L', comm: '₹2.14L', conv: '45.8%' },
    ]
});

const ReferralPage = () => {
    const [data, setData] = useState(() => loadData());
    const [activeTab, setActiveTab] = useState('dashboard');
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

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
            console.warn('Referral load reset error', e);
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

    const handleCreateReferral = (type) => {
        openModal(
            `🤝 Create ${type} Referral`,
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Full Name / Business Name *</label>
                <input id="refName" className="w-full border p-2 rounded text-sm mt-1" placeholder="Enter name..." />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Mobile Number *</label>
                <input id="refMobile" className="w-full border p-2 rounded text-sm mt-1" placeholder="10-digit mobile" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Expected Value / Budget</label>
                <input id="refVal" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ₹10L" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('refName').value || 'New Referral';
                        const mobile = document.getElementById('refMobile').value || '9876500099';
                        const expected = document.getElementById('refVal').value || '₹5L';
                        const id = `REF-2026-0${data.referrals.length + 1}`;
                        const newR = { id, name, mobile, type, source: 'Direct', status: 'New', expected, commission: 'Pending', created: new Date().toISOString().slice(0, 10) };
                        updateData(prev => ({ ...prev, referrals: [newR, ...prev.referrals] }));
                        showToast(`🤝 Referral ${id} (${name}) created!`);
                        closeModal();
                    }} className="px-4 py-2 bg-purple-600 text-white font-semibold rounded text-xs hover:bg-purple-700">Submit Referral</button>
                </div>
            </div>
        );
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Total Referrals</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{data.referrals.length}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">+4 this month</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Converted</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.converted}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{data.metrics.convRate}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Referral GMV</div>
                    <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.referralGmv}</div>
                    <div className="text-[10px] text-purple-600 font-semibold">+18% YoY</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Commission</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.commission}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Paid {data.metrics.paidComm}</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Pending</div>
                    <div className="text-xl font-black text-amber-600 mt-1">{data.metrics.pending}</div>
                    <div className="text-[10px] text-amber-600 font-semibold">In pipeline</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Lost</div>
                    <div className="text-xl font-black text-slate-400 mt-1">{data.metrics.lost}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">25% rate</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Follow-ups Due</div>
                    <div className="text-xl font-black text-rose-600 mt-1">{data.metrics.followupsDue}</div>
                    <div className="text-[10px] text-rose-600 font-semibold">2 overdue</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Quality Score</div>
                    <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.qualityScore}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">+3 pts</div>
                </div>
            </div>

            {/* Referrals List Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-slate-800">🤝 Recent Referrals ({data.referrals.length})</h3>
                    <div className="flex gap-2">
                        <button onClick={() => handleCreateReferral('Gallery')} className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700">+ Refer Gallery</button>
                        <button onClick={() => handleCreateReferral('Employee')} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700">+ Refer Employee</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="p-2.5">ID</th>
                                <th className="p-2.5">Name</th>
                                <th className="p-2.5">Mobile</th>
                                <th className="p-2.5">Type</th>
                                <th className="p-2.5">Status</th>
                                <th className="p-2.5">Expected Value</th>
                                <th className="p-2.5">Commission</th>
                                <th className="p-2.5">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                            {data.referrals.map(r => (
                                <tr key={r.id} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-purple-600">{r.id}</td>
                                    <td className="p-2.5 font-bold text-slate-900">{r.name}</td>
                                    <td className="p-2.5">{r.mobile}</td>
                                    <td className="p-2.5">{r.type}</td>
                                    <td className="p-2.5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{r.status}</span></td>
                                    <td className="p-2.5 font-semibold">{r.expected}</td>
                                    <td className="p-2.5 text-emerald-600 font-bold">{r.commission}</td>
                                    <td className="p-2.5 text-slate-500">{r.created}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Service Sharing Cards */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-sm text-slate-800 mb-3">📲 Service & Package Sharing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {data.packages.map(p => (
                        <div key={p.id} className="p-3 border rounded-xl bg-slate-50 space-y-2">
                            <div className="text-sm font-bold text-slate-900">{p.flag} {p.name}</div>
                            <div className="text-xs text-slate-500">{p.meta}</div>
                            <div className="text-sm font-black text-purple-600">{p.price}</div>
                            <button onClick={() => showToast(`📲 Shared ${p.name} link to WhatsApp!`)} className="w-full py-1.5 bg-emerald-600 text-white font-semibold rounded text-xs hover:bg-emerald-700">Share via WhatsApp</button>
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
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-lg">🤝</div>
                    <div>
                        <div className="font-bold text-white text-base">Referral <span className="text-purple-400">CRM</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Network & Rewards</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['referrals', 'My Referrals', 'fa-list'],
                        ['packages', 'Service Sharing', 'fa-share-alt'],
                        ['leaderboard', 'Top Referrers', 'fa-trophy'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-purple-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="font-bold text-white">{data.user.name}</div>
                    <div className="text-[10px] text-purple-400">{data.user.role} ({data.user.empId})</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Referral & Affiliate Network Portal</div>
                    <div className="flex gap-2">
                        <button onClick={() => handleCreateReferral('Gallery')} className="px-3.5 py-1.5 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700">+ Refer Gallery</button>
                    </div>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'referrals' && renderDashboard()}
                    {['packages', 'leaderboard'].includes(activeTab) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeTab} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live referral network data active.</p>
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

export default ReferralPage;
