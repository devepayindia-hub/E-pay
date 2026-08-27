'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'customerPortalData_v1';

const defaultData = () => ({
    user: { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', dob: '1990-05-15', gender: 'Male', city: 'Pune', state: 'Maharashtra', country: 'India', pin: '411001' },
    walletBalance: 8450,
    rewardPoints: 1250,
    activeTrip: { destination: 'Dubai', dates: '15 Oct – 20 Oct 2026', duration: '5N / 6D', travellers: 4, daysToGo: 32, status: 'Confirmed' },
    kpis: [
        { label: 'Active Trip', value: 'Dubai', sub: '15 Oct 2026 • Confirmed', icon: 'fa-plane-departure', color: 'green' },
        { label: 'Upcoming Trip', value: '32', sub: 'Days until departure', icon: 'fa-calendar-check', color: 'gold' },
        { label: 'Pending Payment', value: '₹49,999', sub: 'Due on 20 Sept', icon: 'fa-credit-card', color: 'pink' },
        { label: 'Active Quotations', value: '2', sub: 'Awaiting response', icon: 'fa-file-invoice', color: 'blue' },
        { label: 'My Bookings', value: '4', sub: 'Total bookings', icon: 'fa-suitcase', color: 'gray' },
        { label: 'Rewards', value: '1,250', sub: 'ePay Travel Points', icon: 'fa-star', color: 'gold' },
    ],
    bookings: [
        { id: 'EPTR-10245', destination: 'Dubai', travelDate: '15 Oct 2026', travellers: 4, amount: '₹1,49,999', payment: '70% Paid', status: 'Confirmed' },
        { id: 'EPTR-10122', destination: 'Goa', travelDate: '5-10 Jan 2026', travellers: 3, amount: '₹78,500', payment: 'Paid', status: 'Completed' },
        { id: 'EPTR-10098', destination: 'Kerala', travelDate: '12-18 Mar 2026', travellers: 4, amount: '₹95,000', payment: 'Paid', status: 'Completed' },
    ],
    enquiries: [
        { id: 'ENQ-2026-0042', destination: 'Dubai', dates: '15-20 Oct 2026', pax: 4, status: 'Accepted', lastActivity: '12 Aug 2026' },
        { id: 'ENQ-2026-0038', destination: 'Thailand', dates: '5-12 Dec 2026', pax: 2, status: 'Quotation Sent', lastActivity: '10 Aug 2026' },
        { id: 'ENQ-2026-0029', destination: 'Paris', dates: '20-25 Nov 2026', pax: 2, status: 'Under Review', lastActivity: '5 Aug 2026' },
    ],
    quotations: [
        { id: 'QT-2026-00452', package: 'Dubai Premium', duration: '5N / 6D', price: '₹1,49,999', validUntil: '20 Aug 2026', preparedBy: 'ePay Travel Expert', status: 'Pending' },
        { id: 'QT-2026-00389', package: 'Thailand Honeymoon', duration: '6N / 7D', price: '₹2,15,000', validUntil: '25 Aug 2026', preparedBy: 'ePay Travel Expert', status: 'Pending' }
    ],
    travellers: [
        { id: 1, name: 'Rahul Sharma', relation: 'Primary Traveller', gender: 'Male', dob: '15 May 1990', passport: 'Z1234567', expiry: '10 May 2028', dietary: 'Veg' },
        { id: 2, name: 'Priya Sharma', relation: 'Spouse', gender: 'Female', dob: '20 Dec 1992', passport: 'Z7654321', expiry: '12 Aug 2029', dietary: 'Non-Veg' },
        { id: 3, name: 'Aarav Sharma', relation: 'Child', gender: 'Male', dob: '10 Mar 2018', passport: 'Z9876543', expiry: '20 Jun 2031', dietary: 'Veg' }
    ],
    documents: [
        { id: 1, name: '🪪 Passport', sub: 'Rahul Sharma • Exp: 10 May 2028', status: 'Verified', date: '10 May 2018' },
        { id: 2, name: '🛂 Dubai Visa', sub: 'Rahul Sharma • Exp: 15 Nov 2026', status: 'Verified', date: '10 Aug 2026' },
        { id: 3, name: '🏨 Hotel Voucher', sub: 'Dubai • 15-20 Oct 2026', status: 'Ready', date: '12 Aug 2026' },
        { id: 4, name: '🧾 Invoice', sub: 'Dubai Premium • INV-2026-0042', status: 'Paid', date: '15 Aug 2026' }
    ],
    notifications: [
        { id: 1, type: 'booking', text: 'Your Dubai booking is confirmed. EPTR-10245', time: 'Today, 10:30 AM', badge: 'Booking' },
        { id: 2, type: 'payment', text: '₹49,999 payment is due in 7 days. Final Payment', time: 'Today, 9:15 AM', badge: 'Payment' },
        { id: 3, type: 'documents', text: 'Your hotel voucher is ready. Download now', time: 'Yesterday, 4:20 PM', badge: 'Documents' },
        { id: 4, type: 'offers', text: 'Your saved Dubai package price dropped by ₹8,000.', time: '2 days ago', badge: 'Offers' }
    ],
    supportTickets: []
});

const CustomerPortalPage = () => {
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
            console.warn('Customer portal load reset error', e);
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

    const handleAcceptQuotation = (id) => {
        updateData(prev => ({
            ...prev,
            quotations: prev.quotations.map(q => q.id === id ? { ...q, status: 'Accepted' } : q)
        }));
        showToast(`✅ Quotation ${id} accepted! Next step: Payment`);
    };

    const handleAddTraveller = () => {
        openModal(
            '✈️ Add New Traveller Profile',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Full Name</label>
                <input id="trvName" className="w-full border p-2 rounded text-sm mt-1" placeholder="Traveller Name" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Relation</label>
                <input id="trvRel" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Spouse / Child / Parent" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Passport Number</label>
                        <input id="trvPass" className="w-full border p-2 rounded text-sm mt-1" placeholder="Z1234567" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700">Dietary Choice</label>
                        <select id="trvDiet" className="w-full border p-2 rounded text-sm mt-1">
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                            <option value="Jain">Jain</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const name = document.getElementById('trvName').value || 'New Traveller';
                        const relation = document.getElementById('trvRel').value || 'Family';
                        const passport = document.getElementById('trvPass').value || 'Z0000000';
                        const dietary = document.getElementById('trvDiet').value;
                        const newTrv = { id: Date.now(), name, relation, gender: 'Male', dob: '1995-01-01', passport, expiry: '2030-01-01', dietary };
                        updateData(prev => ({ ...prev, travellers: [...prev.travellers, newTrv] }));
                        showToast(`👤 Traveller "${name}" added`);
                        closeModal();
                    }} className="px-4 py-2 bg-emerald-600 text-white rounded font-semibold text-xs hover:bg-emerald-700">Add Traveller</button>
                </div>
            </div>
        );
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-5 rounded-xl flex justify-between items-center flex-wrap gap-4 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold">Where would you like to go next, {data.user.name.split(' ')[0]}?</h2>
                    <p className="text-xs text-slate-300 mt-1">Plan your dream holiday with AI-powered recommendations and ePay Rewards.</p>
                </div>
                <button onClick={() => setActiveSection('ai-advisor')} className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-full text-xs hover:bg-emerald-400 transition flex items-center gap-2 shadow-md">
                    <i className="fa-solid fa-robot"></i> Plan My Trip with AI
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {data.kpis.map(k => (
                    <div key={k.label} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 cursor-pointer transition" onClick={() => showToast(`ℹ️ ${k.label}: ${k.value}`)}>
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] uppercase font-bold text-slate-500">{k.label}</span>
                            <i className={`fa-solid ${k.icon} text-slate-300`}></i>
                        </div>
                        <div className="text-xl font-black text-slate-900 mt-1">{k.value}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{k.sub}</div>
                    </div>
                ))}
            </div>

            {/* Active Trip Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-white p-5 rounded-xl border border-emerald-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🇦🇪</span>
                        <h3 className="text-lg font-bold text-slate-900">{data.activeTrip.destination} Premium Holiday</h3>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap gap-4 mt-1">
                        <span><i className="fa-regular fa-calendar-alt text-emerald-600 mr-1"></i>{data.activeTrip.dates}</span>
                        <span><i className="fa-regular fa-clock text-emerald-600 mr-1"></i>{data.activeTrip.duration}</span>
                        <span><i className="fa-solid fa-users text-emerald-600 mr-1"></i>{data.activeTrip.travellers} Travellers</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs mt-3 text-emerald-800 font-semibold">
                        <span>✓ Hotel Confirmed</span>
                        <span>✓ Transfer Confirmed</span>
                        <span>✓ Desert Safari Confirmed</span>
                        <span>✓ Burj Khalifa Confirmed</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-amber-600">{data.activeTrip.daysToGo} <span className="text-xs font-normal text-slate-500 block">Days to Go</span></div>
                    <button onClick={() => setActiveSection('bookings')} className="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-full hover:bg-emerald-700">View Trip Details</button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Self-Service Actions</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                    {[
                        ['ai-advisor', 'Plan with AI', 'fa-robot'],
                        ['quotations', 'My Quotations', 'fa-file-invoice'],
                        ['bookings', 'My Bookings', 'fa-suitcase'],
                        ['payments', 'Pay Balance', 'fa-credit-card'],
                        ['documents', 'Download Docs', 'fa-folder-open'],
                        ['travellers', 'Travellers', 'fa-users'],
                        ['rewards', 'Travel Points', 'fa-gift'],
                        ['support', 'Contact Expert', 'fa-headset'],
                    ].map(([id, label, icon]) => (
                        <button key={id} onClick={() => setActiveSection(id)} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center hover:bg-emerald-50 hover:border-emerald-400 transition flex flex-col items-center gap-1">
                            <i className={`fa-solid ${icon} text-emerald-600 text-base mb-1`}></i>
                            <span className="text-xs font-medium text-slate-700">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-200 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg">e</div>
                    <div>
                        <div className="font-bold text-slate-900 text-base">ePay <span className="text-emerald-600">Travel</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Customer Self-Service</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['ai-advisor', 'AI Travel Advisor', 'fa-robot'],
                        ['quotations', 'My Quotations', 'fa-file-invoice'],
                        ['bookings', 'My Bookings', 'fa-suitcase'],
                        ['payments', 'Payment Center', 'fa-credit-card'],
                        ['documents', 'Document Vault', 'fa-folder-open'],
                        ['travellers', 'Traveller Profiles', 'fa-users'],
                        ['rewards', 'Rewards & Points', 'fa-gift'],
                        ['support', 'Customer Support', 'fa-headset'],
                        ['notifications', 'Notifications', 'fa-bell'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveSection(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeSection === id ? 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600' : 'hover:bg-slate-50 text-slate-600'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
                    <div className="font-bold text-slate-900">{data.user.name}</div>
                    <div className="text-[10px] text-emerald-600">Points: {data.rewardPoints} • Wallet: ₹{data.walletBalance}</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Welcome, {data.user.name}</div>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">Wallet: ₹{data.walletBalance}</span>
                    </div>
                </header>

                <main className="flex-1 p-5 overflow-y-auto">
                    {activeSection === 'dashboard' && renderDashboard()}
                    {activeSection === 'quotations' && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm text-slate-800">📄 My Quotations ({data.quotations.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.quotations.map(q => (
                                    <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs">
                                        <div className="flex justify-between font-bold text-slate-900">
                                            <span>{q.package}</span>
                                            <span className="text-emerald-600 text-base">{q.price}</span>
                                        </div>
                                        <div className="text-slate-500">{q.duration} • Valid Until: {q.validUntil}</div>
                                        <div className="flex gap-2 pt-2">
                                            {q.status === 'Accepted' ? (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded">Accepted</span>
                                            ) : (
                                                <button onClick={() => handleAcceptQuotation(q.id)} className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700">Accept Quote</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeSection === 'bookings' && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm text-slate-800">📅 Confirmed Bookings</h3>
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                        <tr>
                                            <th className="p-3">Booking ID</th>
                                            <th className="p-3">Destination</th>
                                            <th className="p-3">Travel Date</th>
                                            <th className="p-3">Travellers</th>
                                            <th className="p-3">Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-slate-700">
                                        {data.bookings.map(b => (
                                            <tr key={b.id}>
                                                <td className="p-3 font-bold text-slate-900">{b.id}</td>
                                                <td className="p-3">{b.destination}</td>
                                                <td className="p-3">{b.travelDate}</td>
                                                <td className="p-3">{b.travellers}</td>
                                                <td className="p-3 font-bold">{b.amount}</td>
                                                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{b.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeSection === 'travellers' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-sm text-slate-800">✈️ Saved Travellers</h3>
                                <button onClick={handleAddTraveller} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700">+ Add Traveller</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {data.travellers.map(t => (
                                    <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
                                        <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                                        <div className="text-slate-500">{t.relation} • {t.gender}</div>
                                        <div className="text-slate-600 pt-1">Passport: <strong>{t.passport}</strong> (Exp: {t.expiry})</div>
                                        <div className="text-emerald-700 font-semibold">Dietary: {t.dietary}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {['ai-advisor', 'payments', 'documents', 'rewards', 'support', 'notifications'].includes(activeSection) && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                            <h3 className="text-base font-bold uppercase text-slate-800">{activeSection} Module</h3>
                            <p className="text-xs text-slate-500 mt-1">Live customer self-service feature active.</p>
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

export default CustomerPortalPage;
