'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'bdeData_v1';

const defaultData = () => ({
    user: { name: 'Suresh', role: 'BDE', territory: 'North Zone' },
    leads: [
        { id: 1, name: 'ABC Corp', company: 'ABC Industries', contact: 'Ravi', mobile: '9876543210',
            email: 'ravi@abc.com', location: 'Mumbai', industry: 'Manufacturing', source: 'Referral',
            assignedBDE: 'Suresh', created: '2025-05-15', priority: 'High', requirement: 'Need framing solutions',
            estimatedValue: 50000, expectedClosing: '2025-06-10', status: 'Interested',
            nextFollowup: '2025-05-20', lastContact: '2025-05-15', remarks: '' },
        { id: 2, name: 'XYZ Ltd', company: 'XYZ Enterprises', contact: 'Sita', mobile: '9876543211',
            email: 'sita@xyz.com', location: 'Delhi', industry: 'Retail', source: 'Website',
            assignedBDE: 'Suresh', created: '2025-05-14', priority: 'Medium', requirement: 'Gallery display units',
            estimatedValue: 30000, expectedClosing: '2025-06-05', status: 'Follow-up',
            nextFollowup: '2025-05-18', lastContact: '2025-05-14', remarks: '' },
        { id: 3, name: 'LMN Enterprises', company: 'LMN Group', contact: 'Amit', mobile: '9876543212',
            email: 'amit@lmn.com', location: 'Bangalore', industry: 'Technology', source: 'Campaign',
            assignedBDE: 'Suresh', created: '2025-05-13', priority: 'High', requirement: 'Custom artwork',
            estimatedValue: 75000, expectedClosing: '2025-06-20', status: 'Meeting Scheduled',
            nextFollowup: '2025-05-22', lastContact: '2025-05-13', remarks: '' },
        { id: 4, name: 'PQR Inc', company: 'PQR Solutions', contact: 'Priya', mobile: '9876543213',
            email: 'priya@pqr.com', location: 'Chennai', industry: 'Services', source: 'Social Media',
            assignedBDE: 'Suresh', created: '2025-05-12', priority: 'Low', requirement: 'Framing services',
            estimatedValue: 20000, expectedClosing: '2025-05-30', status: 'New', nextFollowup: '2025-05-17',
            lastContact: '2025-05-12', remarks: '' },
    ],
    calls: [
        { id: 1, leadId: 1, date: '2025-05-15', time: '10:00', callType: 'Outbound', duration: 15,
            outcome: 'Interested', discussion: 'Discussed framing needs', requirement: 'Need samples',
            nextFollowup: '2025-05-20', remarks: '' },
        { id: 2, leadId: 2, date: '2025-05-14', time: '11:30', callType: 'Inbound', duration: 10,
            outcome: 'Follow-up', discussion: 'Customer called for pricing', requirement: 'Price quote',
            nextFollowup: '2025-05-18', remarks: '' },
    ],
    meetings: [
        { id: 1, leadId: 3, date: '2025-05-22', time: '14:00', location: 'Bangalore', type: 'In-person',
            participants: 'Amit, Suresh', purpose: 'Proposal presentation', requirement: 'Understand custom needs',
            discussion: '', opportunityValue: 75000, nextAction: 'Send proposal', followupDate: '2025-05-25',
            outcome: 'Scheduled' },
    ],
    visits: [
        { id: 1, leadId: 1, customer: 'ABC Corp', purpose: 'Introductory meeting', date: '2025-05-16',
            startTime: '10:00', endTime: '11:00', location: 'Mumbai', gps: '19.0760,72.8777',
            distance: 5, livePhoto: 'photo1.jpg', contact: 'Ravi', discussion: 'Discussed requirements',
            outcome: 'Positive', nextFollowup: '2025-05-20', remarks: '' },
        { id: 2, leadId: 2, customer: 'XYZ Ltd', purpose: 'Demo', date: '2025-05-17', startTime: '15:00',
            endTime: '16:00', location: 'Delhi', gps: '28.6139,77.2090', distance: 10,
            livePhoto: 'photo2.jpg', contact: 'Sita', discussion: 'Demo of gallery solutions',
            outcome: 'Interested', nextFollowup: '2025-05-21', remarks: '' },
    ],
    customers: [
        { id: 1, name: 'Art Gallery', contact: 'Raj', mobile: '9876543215', email: 'raj@art.com',
            location: 'Mumbai', industry: 'Art', status: 'Active', revenue: 25000, lastInteraction: '2025-05-15',
            nextFollowup: '2025-05-25', outstanding: 0, opportunities: 1, complaints: 0,
            relationship: 'Good' },
    ],
    opportunities: [
        { id: 1, customerId: 1, leadId: 1, product: 'Custom Frames', estimatedValue: 50000,
            probability: 70, expectedRevenue: 35000, expectedClosing: '2025-06-10', currentStage: 'Negotiation',
            competitor: 'None', decisionMaker: 'Raj', nextAction: 'Finalize pricing', owner: 'Suresh',
            remarks: '' },
    ],
    followups: [
        { id: 1, leadId: 1, customer: 'ABC Corp', date: '2025-05-20', time: '10:00', method: 'Call',
            discussion: 'Follow up on proposal', response: 'Interested', nextAction: 'Send revised quote',
            nextFollowup: '2025-05-25', status: 'Pending' },
        { id: 2, leadId: 2, customer: 'XYZ Ltd', date: '2025-05-18', time: '11:00', method: 'Email',
            discussion: 'Sent price list', response: 'Will review', nextAction: 'Follow-up call',
            nextFollowup: '2025-05-21', status: 'Completed' },
    ],
    dailyReports: [
        { date: '2025-05-16', employee: 'Suresh', territory: 'North Zone', callsMade: 10,
            callsConnected: 6, meetings: 1, visits: 2, newLeads: 3, qualifiedLeads: 2, followups: 4,
            proposals: 1, dealsClosed: 0, businessGenerated: 0, expectedBusiness: 75000,
            customerIssues: 'None', competitorInfo: 'Competitor A offering discounts',
            challenges: 'Tough market', tomorrowPlan: 'Visit ABC Corp again', remarks: '', status: 'Submitted' },
    ],
    travelExpenses: [
        { id: 1, employee: 'Suresh', date: '2025-05-16', expenseType: 'Transport', amount: 500,
            customer: 'ABC Corp', location: 'Mumbai', gps: '19.0760,72.8777', receipt: 'receipt1.jpg',
            livePhoto: 'photo1.jpg', remarks: 'Taxi', status: 'Pending' },
    ],
    tasks: [
        { id: 1, title: 'Call ABC Corp for follow-up', assignedTo: 'Suresh', due: '2025-05-20',
            priority: 'High', status: 'Pending', category: 'Call' },
        { id: 2, title: 'Prepare proposal for XYZ Ltd', assignedTo: 'Suresh', due: '2025-05-19',
            priority: 'Medium', status: 'In Progress', category: 'Proposal' },
    ],
    stats: {}
});

// ================================================================
// MAIN COMPONENT
// ================================================================
const App = () => {
    // ---- State ----
    const [data, setData] = useState(() => loadData());
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [notifCount, setNotifCount] = useState(8);
    const [userName, setUserName] = useState('Suresh');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ---- Data Helpers ----
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
                    if (!parsed.stats) parsed.stats = {};
                    if (!parsed.user) parsed.user = def.user;
                    updateStats(parsed);
                    saveData(parsed);
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Data load error, resetting', e);
        }
        const def = defaultData();
        updateStats(def);
        saveData(def);
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

    function updateStats(d) {
        const leads = d.leads || [];
        const calls = d.calls || [];
        const meetings = d.meetings || [];
        const visits = d.visits || [];
        const customers = d.customers || [];
        const opportunities = d.opportunities || [];
        const followups = d.followups || [];
        const tasks = d.tasks || [];

        const totalLeads = leads.length;
        const newLeads = leads.filter(l => l.status === 'New').length;
        const contactsToday = calls.filter(c => c.date === new Date().toISOString().slice(0, 10)).length;
        const meetingsToday = meetings.filter(m => m.date === new Date().toISOString().slice(0, 10)).length;
        const visitsToday = visits.filter(v => v.date === new Date().toISOString().slice(0, 10)).length;
        const followupsDue = followups.filter(f => f.status === 'Pending').length;
        const followupsCompleted = followups.filter(f => f.status === 'Completed').length;
        const convertedLeads = leads.filter(l => l.status === 'Won').length;
        const lostLeads = leads.filter(l => l.status === 'Lost').length;
        const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
        const totalExpectedRevenue = leads.reduce((s, l) => s + (l.estimatedValue || 0), 0);
        const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
        const totalRevenue = customers.reduce((s, c) => s + (c.revenue || 0), 0);
        const monthlyTarget = 100000;
        const achievement = monthlyTarget > 0 ? Math.round((totalRevenue / monthlyTarget) * 100) : 0;

        d.stats = {
            monthlyTarget,
            businessGenerated: totalRevenue,
            achievement,
            targetGap: monthlyTarget - totalRevenue,
            totalLeads,
            newLeads,
            contactsToday,
            meetingsToday,
            visitsToday,
            followupsDue,
            followupsCompleted,
            convertedLeads,
            lostLeads,
            conversionRate,
            expectedRevenue: totalExpectedRevenue,
            pendingTasks,
            performanceScore: 85,
        };
    }

    const updateData = useCallback((updater) => {
        setData(prev => {
            const newData = typeof updater === 'function' ? updater(prev) : updater;
            updateStats(newData);
            saveData(newData);
            return newData;
        });
    }, []);

    // ---- Toast ----
    const showToast = useCallback((msg) => {
        setToast(msg);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 2200);
    }, []);
    const toastTimer = useRef(null);

    // ---- Modal ----
    const openModal = useCallback((content) => setModal(content), []);
    const closeModal = useCallback(() => setModal(null), []);

    // ---- Sidebar ----
    const menuStructure = [
        { section: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'fa-house' }] },
        { section: 'Pipeline', items: [
                { id: 'leads', label: 'Leads', icon: 'fa-regular fa-user-plus' },
                { id: 'opportunities', label: 'Opportunities', icon: 'fa-regular fa-chart-line' },
                { id: 'customers', label: 'Customers', icon: 'fa-regular fa-user' },
            ] },
        { section: 'Activities', items: [
                { id: 'calls', label: 'Calls', icon: 'fa-regular fa-phone' },
                { id: 'meetings', label: 'Meetings', icon: 'fa-regular fa-calendar-check' },
                { id: 'visits', label: 'Visits', icon: 'fa-regular fa-location-dot' },
                { id: 'followups', label: 'Follow-ups', icon: 'fa-regular fa-clock' },
            ] },
        { section: 'Tasks & Reports', items: [
                { id: 'tasks', label: 'Daily Tasks', icon: 'fa-regular fa-list-check' },
                { id: 'daily-report', label: 'Daily Report', icon: 'fa-regular fa-file-lines' },
                { id: 'travel', label: 'Travel/Expense', icon: 'fa-regular fa-receipt' },
            ] },
        { section: 'Performance', items: [
                { id: 'performance', label: 'Performance', icon: 'fa-regular fa-star' },
                { id: 'alerts', label: 'Alerts', icon: 'fa-regular fa-triangle-exclamation' },
            ] },
        { section: 'Settings', items: [
                { id: 'settings', label: 'Settings', icon: 'fa-regular fa-gear' },
            ] },
    ];

    const navigateTo = useCallback((pageId) => {
        setCurrentPage(pageId);
        if (typeof window !== 'undefined' && window.innerWidth < 768) setSidebarOpen(false);
    }, []);

    // ---- Render Helpers ----
    const formatNum = (n) => {
        if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr';
        if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
        return n;
    };

    const getStatusBadge = (status) => {
        const clsMap = {
            'pending': 'pending',
            'completed': 'completed',
            'in-progress': 'in-progress',
            'critical': 'critical',
            'positive': 'positive',
            'warning': 'warning',
            'error': 'error',
            'new': 'new',
            'contacted': 'contacted',
            'interested': 'interested',
            'qualified': 'qualified',
            'meeting': 'meeting',
            'proposal': 'proposal',
            'negotiation': 'negotiation',
            'won': 'won',
            'lost': 'lost',
            'overdue': 'overdue',
            'submitted': 'submitted',
            'active': 'positive',
            'inactive': 'warning',
        };
        const cls = clsMap[status?.toLowerCase()] || 'pending';
        return `status-badge ${cls}`;
    };

    // ---- Page Renderers ----
    const renderDashboard = useCallback(() => {
        const s = data.stats;
        const colorMap = {
            green: 'bg-green-50 text-green-600',
            emerald: 'bg-emerald-50 text-emerald-600',
            violet: 'bg-violet-50 text-violet-600',
            rose: 'bg-rose-50 text-rose-600',
            blue: 'bg-blue-50 text-blue-600',
            cyan: 'bg-cyan-50 text-cyan-600',
            teal: 'bg-teal-50 text-teal-600',
            purple: 'bg-purple-50 text-purple-600',
            amber: 'bg-amber-50 text-amber-600',
            sky: 'bg-sky-50 text-sky-600',
            orange: 'bg-orange-50 text-orange-600',
            indigo: 'bg-indigo-50 text-indigo-600'
        };
        const stats = [
            ['Monthly Target', '₹' + formatNum(s.monthlyTarget), 'fa-bullseye', 'green'],
            ['Business Generated', '₹' + formatNum(s.businessGenerated), 'fa-arrow-trend-up', 'emerald'],
            ['Achievement', s.achievement + '%', 'fa-percent', 'violet'],
            ['Target Gap', '₹' + formatNum(s.targetGap), 'fa-circle-exclamation', 'rose'],
            ['Total Leads', s.totalLeads, 'fa-user-plus', 'blue'],
            ['New Leads', s.newLeads, 'fa-user-plus', 'cyan'],
            ['Contacts Today', s.contactsToday, 'fa-phone', 'teal'],
            ['Meetings Today', s.meetingsToday, 'fa-calendar-check', 'purple'],
            ['Visits Today', s.visitsToday, 'fa-location-dot', 'green'],
            ['Follow-ups Due', s.followupsDue, 'fa-clock', 'amber'],
            ['Converted Leads', s.convertedLeads, 'fa-check-circle', 'emerald'],
            ['Lost Leads', s.lostLeads, 'fa-circle-xmark', 'rose'],
            ['Conversion %', s.conversionRate + '%', 'fa-percent', 'sky'],
            ['Expected Revenue', '₹' + formatNum(s.expectedRevenue), 'fa-money-bill', 'green'],
            ['Pending Tasks', s.pendingTasks, 'fa-list-check', 'orange'],
            ['Performance', s.performanceScore + '%', 'fa-star', 'indigo'],
        ];

        const stages = ['New', 'Contacted', 'Interested', 'Qualified', 'Meeting', 'Proposal', 'Negotiation', 'Won', 'Lost'];
        const quickActions = ['New Lead', 'Log Call', 'Schedule Meeting', 'Record Visit', 'Add Follow-up', 'Submit Daily Report', 'Add Expense'];
        const actionIcons = {
            'New Lead': 'fa-user-plus',
            'Log Call': 'fa-phone',
            'Schedule Meeting': 'fa-calendar-check',
            'Record Visit': 'fa-location-dot',
            'Add Follow-up': 'fa-clock',
            'Submit Daily Report': 'fa-file-lines',
            'Add Expense': 'fa-receipt'
        };

        return (
            <>
                <section className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
                    {stats.map(([label, value, icon, color]) => {
                        const cls = colorMap[color] || 'bg-green-50 text-green-600';
                        return (
                            <div key={label} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm card-hover drill-card cursor-pointer" onClick={() => drill(label)}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${cls} flex items-center justify-center`}><i className={`fa-regular ${icon}`}></i></div>
                                    <div><p className="text-[10px] text-slate-500">{label}</p><h4 className="font-bold text-sm text-slate-800">{value}</h4></div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-800">Today's Activity</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div><span className="text-slate-500">Calls:</span> <span className="font-semibold text-slate-800">{s.contactsToday}</span></div>
                            <div><span className="text-slate-500">Meetings:</span> <span className="font-semibold text-slate-800">{s.meetingsToday}</span></div>
                            <div><span className="text-slate-500">Visits:</span> <span className="font-semibold text-slate-800">{s.visitsToday}</span></div>
                            <div><span className="text-slate-500">New Leads:</span> <span className="font-semibold text-slate-800">{s.newLeads}</span></div>
                            <div><span className="text-slate-500">Follow-ups Due:</span> <span className="font-semibold text-amber-600">{s.followupsDue}</span></div>
                            <div><span className="text-slate-500">Follow-ups Done:</span> <span className="font-semibold text-emerald-600">{s.followupsCompleted}</span></div>
                            <div><span className="text-slate-500">Proposals Sent:</span> <span className="font-semibold text-slate-800">1</span></div>
                            <div><span className="text-slate-500">Deals Closed:</span> <span className="font-semibold text-slate-800">{s.convertedLeads}</span></div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-800">Lead Pipeline</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {stages.map(stage => {
                                const count = data.leads.filter(l => l.status === stage).length;
                                return <span key={stage} className={`pipeline-stage ${getStatusBadge(stage)}`}>{stage}: {count}</span>;
                            })}
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-between text-xs"><span className="text-slate-500">Conversion Rate</span><span className="text-slate-800 font-semibold">{s.conversionRate}%</span></div>
                            <div className="chart-bar mt-1"><div className="fill bg-green-600" style={{ width: `${s.conversionRate}%` }}></div></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <h4 className="font-bold text-sm text-slate-800"><i className="fa-regular fa-bolt mr-2 text-amber-500"></i>Quick Actions</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {quickActions.map(label => (
                            <button key={label} onClick={() => quickAction(label)} className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs hover:bg-green-50 transition text-slate-700">
                                <i className={`fa-regular ${actionIcons[label] || 'fa-bolt'} text-green-500 mr-1`}></i>{label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <h4 className="font-bold text-sm text-slate-800"><i className="fa-regular fa-triangle-exclamation mr-2 text-amber-500"></i>Alerts</h4>
                    <div className="space-y-2 mt-2 text-sm">
                        <div className="flex items-center gap-3 border-b pb-2"><span className="status-badge critical">Critical</span><span className="text-slate-700">Target gap of ₹{formatNum(s.targetGap)}</span></div>
                        <div className="flex items-center gap-3 border-b pb-2"><span className="status-badge warning">Warning</span><span className="text-slate-700">2 overdue follow-ups</span></div>
                        <div className="flex items-center gap-3"><span className="status-badge positive">Positive</span><span className="text-slate-700">Conversion rate improved to {s.conversionRate}%</span></div>
                    </div>
                </div>
            </>
        );
    }, [data]);

    const renderLeads = useCallback(() => {
        const leads = data.leads;
        const openModal = () => openLeadModal();
        const editLead = (id) => showToast('✏️ Edit lead (stub)');
        const deleteLead = (id) => {
            if (!confirm('Delete lead?')) return;
            updateData(prev => ({ ...prev, leads: prev.leads.filter(l => l.id !== id) }));
            showToast('🗑️ Lead deleted');
        };
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-user-plus mr-2 text-blue-500"></i>Leads ({leads.length})</h2><button onClick={openModal} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> New Lead</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Name</th><th className="pb-3 text-left">Company</th><th className="pb-3 text-left">Status</th><th className="pb-3 text-left">Value</th><th className="pb-3 text-left">Follow-up</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{leads.map(l => (
                        <tr key={l.id}><td className="text-slate-800 font-medium">{l.name}</td><td className="text-slate-700">{l.company}</td><td><span className={getStatusBadge(l.status)}>{l.status}</span></td><td className="text-slate-800">₹{formatNum(l.estimatedValue)}</td><td className="text-slate-700">{l.nextFollowup || ''}</td><td><button onClick={() => editLead(l.id)} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => deleteLead(l.id)} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderOpportunities = useCallback(() => {
        const opps = data.opportunities;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-chart-line mr-2 text-purple-500"></i>Opportunities ({opps.length})</h2><button onClick={() => showToast('✏️ New opportunity (stub)')} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> New Opportunity</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Customer</th><th className="pb-3 text-left">Product</th><th className="pb-3 text-left">Value</th><th className="pb-3 text-left">Probability</th><th className="pb-3 text-left">Stage</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{opps.map(o => {
                        const cust = data.customers.find(c => c.id === o.customerId);
                        return <tr key={o.id}><td className="text-slate-800 font-medium">{cust ? cust.name : ''}</td><td className="text-slate-700">{o.product}</td><td className="text-slate-800">₹{formatNum(o.estimatedValue)}</td><td className="text-slate-800">{o.probability}%</td><td><span className={getStatusBadge(o.currentStage)}>{o.currentStage}</span></td><td><button onClick={() => showToast('✏️ Edit opportunity')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, opportunities: prev.opportunities.filter(x => x.id !== o.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>;
                    })}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderCustomers = useCallback(() => {
        const customers = data.customers;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-user mr-2 text-blue-500"></i>Customers ({customers.length})</h2><button onClick={() => showToast('✏️ Add customer (stub)')} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Add Customer</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Name</th><th className="pb-3 text-left">Contact</th><th className="pb-3 text-left">Industry</th><th className="pb-3 text-left">Revenue</th><th className="pb-3 text-left">Status</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{customers.map(c => (
                        <tr key={c.id}><td className="text-slate-800 font-medium">{c.name}</td><td className="text-slate-700">{c.contact}</td><td className="text-slate-700">{c.industry}</td><td className="text-slate-800">₹{formatNum(c.revenue)}</td><td><span className={getStatusBadge(c.status)}>{c.status}</span></td><td><button onClick={() => showToast('✏️ Edit customer')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, customers: prev.customers.filter(x => x.id !== c.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderCalls = useCallback(() => {
        const calls = data.calls;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-phone mr-2 text-teal-500"></i>Calls ({calls.length})</h2><button onClick={() => openCallModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Log Call</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Lead</th><th className="pb-3 text-left">Date</th><th className="pb-3 text-left">Duration</th><th className="pb-3 text-left">Outcome</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{calls.map(c => {
                        const lead = data.leads.find(l => l.id === c.leadId);
                        return <tr key={c.id}><td className="text-slate-800 font-medium">{lead ? lead.name : ''}</td><td className="text-slate-700">{c.date}</td><td className="text-slate-700">{c.duration} min</td><td><span className={getStatusBadge(c.outcome)}>{c.outcome}</span></td><td><button onClick={() => showToast('✏️ Edit call')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, calls: prev.calls.filter(x => x.id !== c.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>;
                    })}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderMeetings = useCallback(() => {
        const meetings = data.meetings;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-calendar-check mr-2 text-purple-500"></i>Meetings ({meetings.length})</h2><button onClick={() => showToast('✏️ Schedule meeting (stub)')} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Schedule Meeting</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Lead</th><th className="pb-3 text-left">Date</th><th className="pb-3 text-left">Location</th><th className="pb-3 text-left">Outcome</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{meetings.map(m => {
                        const lead = data.leads.find(l => l.id === m.leadId);
                        return <tr key={m.id}><td className="text-slate-800 font-medium">{lead ? lead.name : ''}</td><td className="text-slate-700">{m.date}</td><td className="text-slate-700">{m.location}</td><td><span className={getStatusBadge(m.outcome || 'Scheduled')}>{m.outcome || 'Scheduled'}</span></td><td><button onClick={() => showToast('✏️ Edit meeting')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, meetings: prev.meetings.filter(x => x.id !== m.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>;
                    })}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderVisits = useCallback(() => {
        const visits = data.visits;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-location-dot mr-2 text-green-500"></i>Visits ({visits.length})</h2><button onClick={() => openVisitModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Record Visit</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Customer</th><th className="pb-3 text-left">Date</th><th className="pb-3 text-left">Purpose</th><th className="pb-3 text-left">GPS</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{visits.map(v => (
                        <tr key={v.id}><td className="text-slate-800 font-medium">{v.customer}</td><td className="text-slate-700">{v.date}</td><td className="text-slate-700">{v.purpose}</td><td className="text-slate-700">{v.gps ? '📍' : ''}</td><td><button onClick={() => showToast('✏️ Edit visit')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, visits: prev.visits.filter(x => x.id !== v.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderFollowups = useCallback(() => {
        const followups = data.followups;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-clock mr-2 text-amber-500"></i>Follow-ups ({followups.length})</h2><button onClick={() => openFollowupModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Add Follow-up</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Customer</th><th className="pb-3 text-left">Date</th><th className="pb-3 text-left">Method</th><th className="pb-3 text-left">Status</th><th className="pb-3 text-left">Next</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{followups.map(f => (
                        <tr key={f.id}><td className="text-slate-800 font-medium">{f.customer}</td><td className="text-slate-700">{f.date}</td><td className="text-slate-700">{f.method}</td><td><span className={getStatusBadge(f.status)}>{f.status}</span></td><td className="text-slate-700">{f.nextFollowup || ''}</td><td><button onClick={() => showToast('✏️ Edit follow-up')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, followups: prev.followups.filter(x => x.id !== f.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderTasks = useCallback(() => {
        const tasks = data.tasks;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-list-check mr-2 text-indigo-500"></i>Daily Tasks ({tasks.length})</h2><button onClick={() => openTaskModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Create Task</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Title</th><th className="pb-3 text-left">Due</th><th className="pb-3 text-left">Priority</th><th className="pb-3 text-left">Status</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{tasks.map(t => (
                        <tr key={t.id}><td className="text-slate-800 font-medium">{t.title}</td><td className="text-slate-700">{t.due}</td><td><span className={getStatusBadge(t.priority)}>{t.priority}</span></td><td><span className={getStatusBadge(t.status)}>{t.status}</span></td><td><button onClick={() => showToast('✏️ Edit task')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, tasks: prev.tasks.filter(x => x.id !== t.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderDailyReport = useCallback(() => {
        const reports = data.dailyReports;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-file-lines mr-2 text-amber-500"></i>Daily Reports</h2><button onClick={() => openDailyReportModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Submit Report</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Date</th><th className="pb-3 text-left">Calls</th><th className="pb-3 text-left">Meetings</th><th className="pb-3 text-left">Visits</th><th className="pb-3 text-left">New Leads</th><th className="pb-3 text-left">Business</th><th className="pb-3 text-left">Status</th></tr></thead>
                    <tbody>{reports.map(r => (
                        <tr key={r.date + r.employee}><td className="text-slate-700">{r.date}</td><td className="text-slate-700">{r.callsMade}</td><td className="text-slate-700">{r.meetings}</td><td className="text-slate-700">{r.visits}</td><td className="text-slate-700">{r.newLeads}</td><td className="text-slate-800">₹{formatNum(r.businessGenerated)}</td><td><span className={getStatusBadge(r.status)}>{r.status}</span></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data]);

    const renderTravel = useCallback(() => {
        const expenses = data.travelExpenses;
        const total = expenses.reduce((s, e) => s + e.amount, 0);
        const pending = expenses.filter(e => e.status === 'Pending').length;
        return (
            <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><p className="text-xs text-slate-500">Total Spent</p><h3 className="text-2xl font-bold text-slate-800">₹{formatNum(total)}</h3></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><p className="text-xs text-slate-500">Pending Claims</p><h3 className="text-2xl font-bold text-amber-600">{pending}</h3></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><p className="text-xs text-slate-500">Remaining Allowance</p><h3 className="text-2xl font-bold text-slate-800">₹{formatNum(15000 - total)}</h3></div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mt-4">
                    <div className="flex items-center justify-between"><h3 className="font-bold text-sm text-slate-800">Expense Entries</h3><button onClick={() => openExpenseModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Add Expense</button></div>
                    <div className="overflow-x-auto mt-2"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-2 text-left">Date</th><th className="pb-2 text-left">Type</th><th className="pb-2 text-left">Amount</th><th className="pb-2 text-left">Customer</th><th className="pb-2 text-left">Status</th></tr></thead>
                        <tbody>{expenses.map(e => (
                            <tr key={e.id}><td className="text-slate-700">{e.date}</td><td className="text-slate-700">{e.expenseType}</td><td className="text-slate-800">₹{formatNum(e.amount)}</td><td className="text-slate-700">{e.customer}</td><td><span className={getStatusBadge(e.status)}>{e.status}</span></td></tr>
                        ))}</tbody></table></div>
                </div>
            </>
        );
    }, [data]);

    const renderPerformance = useCallback(() => {
        const s = data.stats;
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-800">Performance Score</h3>
                    <div className="flex items-center justify-center mt-4">
                        <div className="progress-ring" style={{ '--color': '#0f7b5a', '--pct': `${s.performanceScore}%` }}>
                            <div className="bg"></div>
                            <div className="inner">{s.performanceScore}%</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                        <div><span className="text-slate-500">Revenue Achievement:</span> <span className="font-semibold text-slate-800">{s.achievement}%</span></div>
                        <div><span className="text-slate-500">Lead Conversion:</span> <span className="font-semibold text-slate-800">{s.conversionRate}%</span></div>
                        <div><span className="text-slate-500">New Customers:</span> <span className="font-semibold text-slate-800">{data.customers.length}</span></div>
                        <div><span className="text-slate-500">Avg Deal Value:</span> <span className="font-semibold text-slate-800">₹{formatNum(s.totalLeads > 0 ? Math.round(s.expectedRevenue / s.totalLeads) : 0)}</span></div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-800">Activity Summary</h3>
                    <div className="space-y-2 mt-2 text-sm">
                        <div className="flex justify-between border-b pb-1"><span className="text-slate-500">Total Calls</span><span className="text-slate-800 font-semibold">{data.calls.length}</span></div>
                        <div className="flex justify-between border-b pb-1"><span className="text-slate-500">Total Meetings</span><span className="text-slate-800 font-semibold">{data.meetings.length}</span></div>
                        <div className="flex justify-between border-b pb-1"><span className="text-slate-500">Total Visits</span><span className="text-slate-800 font-semibold">{data.visits.length}</span></div>
                        <div className="flex justify-between border-b pb-1"><span className="text-slate-500">Total Follow-ups</span><span className="text-slate-800 font-semibold">{data.followups.length}</span></div>
                        <div className="flex justify-between border-b pb-1"><span className="text-slate-500">Proposals Sent</span><span className="text-slate-800 font-semibold">{data.opportunities.length}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Daily Reports</span><span className="text-slate-800 font-semibold">{data.dailyReports.length}</span></div>
                    </div>
                </div>
            </div>
        );
    }, [data]);

    const renderAlerts = useCallback(() => {
        const s = data.stats;
        const overdueFollowups = data.followups.filter(f => f.status === 'Pending' && f.date < new Date().toISOString().slice(0, 10));
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-triangle-exclamation mr-2 text-amber-500"></i>Alerts</h2>
                <div className="space-y-3 mt-4">
                    <div className="flex items-start gap-3 border-b pb-3"><span className="status-badge critical">Critical</span><div><p className="font-medium text-slate-800">Target gap of ₹{formatNum(s.targetGap)}</p><p className="text-xs text-slate-500">Achievement: {s.achievement}%</p></div></div>
                    <div className="flex items-start gap-3 border-b pb-3"><span className="status-badge warning">Warning</span><div><p className="font-medium text-slate-800">{overdueFollowups.length} overdue follow-ups</p><p className="text-xs text-slate-500">Follow-up for {overdueFollowups.map(f => f.customer).join(', ')}</p></div></div>
                    <div className="flex items-start gap-3 border-b pb-3"><span className="status-badge warning">Warning</span><div><p className="font-medium text-slate-800">{s.pendingTasks} pending tasks</p><p className="text-xs text-slate-500">Complete them to stay on track</p></div></div>
                    <div className="flex items-start gap-3"><span className="status-badge positive">Positive</span><div><p className="font-medium text-slate-800">Conversion rate improved to {s.conversionRate}%</p><p className="text-xs text-slate-500">Keep up the momentum</p></div></div>
                </div>
            </div>
        );
    }, [data]);

    // ---- Modal Content Generators ----
    const openLeadModal = () => {
        openModal(
            <LeadModalContent data={data} updateData={updateData} closeModal={closeModal} showToast={showToast} userName={data.user.name} />
        );
    };

    const openCallModal = () => {
        const leadOpts = data.leads.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
        const today = new Date().toISOString().slice(0, 10);
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Log Call</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Lead</label><select id="callLead" dangerouslySetInnerHTML={{ __html: `<option value="">Select</option>${leadOpts}` }}></select></div></div>
                <div className="form-row"><div><label>Date</label><input type="date" id="callDate" defaultValue={today} /></div><div><label>Time</label><input type="time" id="callTime" defaultValue="10:00" /></div></div>
                <div className="form-row"><div><label>Call Type</label><select id="callType"><option>Outbound</option><option>Inbound</option></select></div><div><label>Duration (min)</label><input type="number" id="callDuration" defaultValue="5" /></div></div>
                <label>Outcome</label><select id="callOutcome"><option>Connected</option><option>Interested</option><option>Not Interested</option><option>Call Back</option><option>Meeting Required</option><option>Wrong Number</option><option>Unreachable</option><option>Converted</option><option>Lost</option></select>
                <label>Discussion</label><textarea id="callDiscussion" rows="2"></textarea>
                <label>Next Follow-up</label><input type="date" id="callNext" defaultValue={tomorrow} />
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const call = {
                        id: Date.now(),
                        leadId: parseInt(document.getElementById('callLead').value) || 0,
                        date: document.getElementById('callDate').value || today,
                        time: document.getElementById('callTime').value || '10:00',
                        callType: document.getElementById('callType').value || 'Outbound',
                        duration: parseInt(document.getElementById('callDuration').value) || 5,
                        outcome: document.getElementById('callOutcome').value || 'Connected',
                        discussion: document.getElementById('callDiscussion').value || '',
                        requirement: '',
                        nextFollowup: document.getElementById('callNext').value || '',
                        remarks: ''
                    };
                    updateData(prev => ({ ...prev, calls: [...prev.calls, call] }));
                    showToast('📞 Call logged');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Log</button></div>
            </div>
        );
    };

    const openVisitModal = () => {
        const leadOpts = data.leads.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
        const today = new Date().toISOString().slice(0, 10);
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Record Visit</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Customer</label><input id="visitCustomer" placeholder="Customer name" /></div><div><label>Lead</label><select id="visitLead" dangerouslySetInnerHTML={{ __html: `<option value="">None</option>${leadOpts}` }}></select></div></div>
                <label>Purpose</label><input id="visitPurpose" placeholder="Visit purpose" />
                <div className="form-row"><div><label>Date</label><input type="date" id="visitDate" defaultValue={today} /></div><div><label>Start Time</label><input type="time" id="visitStart" defaultValue="10:00" /></div></div>
                <div className="form-row"><div><label>End Time</label><input type="time" id="visitEnd" defaultValue="11:00" /></div><div><label>Location</label><input id="visitLocation" placeholder="Location" /></div></div>
                <div className="form-row"><div><label>GPS (lat,lng)</label><input id="visitGps" placeholder="e.g. 19.0760,72.8777" /></div><div><label>Distance (km)</label><input type="number" id="visitDistance" defaultValue="5" /></div></div>
                <label>Contact Person</label><input id="visitContact" placeholder="Contact" />
                <label>Discussion</label><textarea id="visitDiscussion" rows="2"></textarea>
                <div className="form-row"><div><label>Outcome</label><select id="visitOutcome"><option>Positive</option><option>Interested</option><option>Not Interested</option><option>Follow-up</option></select></div><div><label>Next Follow-up</label><input type="date" id="visitNext" defaultValue={tomorrow} /></div></div>
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const visit = {
                        id: Date.now(),
                        leadId: parseInt(document.getElementById('visitLead').value) || 0,
                        customer: document.getElementById('visitCustomer').value || 'Customer',
                        purpose: document.getElementById('visitPurpose').value || '',
                        date: document.getElementById('visitDate').value || today,
                        startTime: document.getElementById('visitStart').value || '10:00',
                        endTime: document.getElementById('visitEnd').value || '11:00',
                        location: document.getElementById('visitLocation').value || '',
                        gps: document.getElementById('visitGps').value || '',
                        distance: parseFloat(document.getElementById('visitDistance').value) || 0,
                        livePhoto: '',
                        contact: document.getElementById('visitContact').value || '',
                        discussion: document.getElementById('visitDiscussion').value || '',
                        outcome: document.getElementById('visitOutcome').value || 'Positive',
                        nextFollowup: document.getElementById('visitNext').value || '',
                        remarks: ''
                    };
                    updateData(prev => ({ ...prev, visits: [...prev.visits, visit] }));
                    showToast('📍 Visit recorded');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Record</button></div>
            </div>
        );
    };

    const openFollowupModal = () => {
        const leadOpts = data.leads.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
        const today = new Date().toISOString().slice(0, 10);
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Add Follow-up</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Customer</label><input id="fupCustomer" placeholder="Customer name" /></div><div><label>Lead</label><select id="fupLead" dangerouslySetInnerHTML={{ __html: `<option value="">None</option>${leadOpts}` }}></select></div></div>
                <div className="form-row"><div><label>Date</label><input type="date" id="fupDate" defaultValue={today} /></div><div><label>Time</label><input type="time" id="fupTime" defaultValue="10:00" /></div></div>
                <label>Method</label><select id="fupMethod"><option>Call</option><option>Email</option><option>WhatsApp</option><option>In-person</option><option>Other</option></select>
                <label>Discussion</label><textarea id="fupDiscussion" rows="2"></textarea>
                <label>Response</label><textarea id="fupResponse" rows="2"></textarea>
                <div className="form-row"><div><label>Next Action</label><input id="fupNextAction" placeholder="Next action" /></div><div><label>Next Follow-up</label><input type="date" id="fupNextDate" defaultValue={tomorrow} /></div></div>
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const fup = {
                        id: Date.now(),
                        leadId: parseInt(document.getElementById('fupLead').value) || 0,
                        customer: document.getElementById('fupCustomer').value || 'Customer',
                        date: document.getElementById('fupDate').value || today,
                        time: document.getElementById('fupTime').value || '10:00',
                        method: document.getElementById('fupMethod').value || 'Call',
                        discussion: document.getElementById('fupDiscussion').value || '',
                        response: document.getElementById('fupResponse').value || '',
                        nextAction: document.getElementById('fupNextAction').value || '',
                        nextFollowup: document.getElementById('fupNextDate').value || '',
                        status: 'Pending'
                    };
                    updateData(prev => ({ ...prev, followups: [...prev.followups, fup] }));
                    showToast('⏰ Follow-up added');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Add</button></div>
            </div>
        );
    };

    const openTaskModal = () => {
        const today = new Date().toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Create Task</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <label>Title</label><input id="taskTitle" placeholder="Task title" />
                <div className="form-row"><div><label>Assigned To</label><input id="taskAssigned" defaultValue={data.user.name} /></div><div><label>Due Date</label><input type="date" id="taskDue" defaultValue={today} /></div></div>
                <div className="form-row"><div><label>Priority</label><select id="taskPriority"><option>High</option><option>Medium</option><option>Low</option></select></div><div><label>Category</label><input id="taskCategory" placeholder="e.g. Call, Meeting" /></div></div>
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const task = {
                        id: Date.now(),
                        title: document.getElementById('taskTitle').value || 'New Task',
                        assignedTo: document.getElementById('taskAssigned').value || data.user.name,
                        due: document.getElementById('taskDue').value || today,
                        priority: document.getElementById('taskPriority').value || 'Medium',
                        status: 'Pending',
                        category: document.getElementById('taskCategory').value || 'General'
                    };
                    updateData(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
                    showToast('📋 Task created');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Create</button></div>
            </div>
        );
    };

    const openDailyReportModal = () => {
        const today = new Date().toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Submit Daily Report</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Date</label><input type="date" id="reportDate" defaultValue={today} /></div><div><label>Territory</label><input id="reportTerritory" defaultValue={data.user.territory} /></div></div>
                <div className="form-row"><div><label>Calls Made</label><input type="number" id="reportCalls" defaultValue="0" /></div><div><label>Calls Connected</label><input type="number" id="reportConnected" defaultValue="0" /></div></div>
                <div className="form-row"><div><label>Meetings</label><input type="number" id="reportMeetings" defaultValue="0" /></div><div><label>Visits</label><input type="number" id="reportVisits" defaultValue="0" /></div></div>
                <div className="form-row"><div><label>New Leads</label><input type="number" id="reportNewLeads" defaultValue="0" /></div><div><label>Qualified Leads</label><input type="number" id="reportQualified" defaultValue="0" /></div></div>
                <div className="form-row"><div><label>Follow-ups</label><input type="number" id="reportFollowups" defaultValue="0" /></div><div><label>Proposals</label><input type="number" id="reportProposals" defaultValue="0" /></div></div>
                <div className="form-row"><div><label>Deals Closed</label><input type="number" id="reportDeals" defaultValue="0" /></div><div><label>Business Generated (₹)</label><input type="number" id="reportBusiness" defaultValue="0" /></div></div>
                <label>Expected Business (₹)</label><input type="number" id="reportExpected" defaultValue="0" />
                <label>Customer Issues</label><textarea id="reportIssues" rows="2"></textarea>
                <label>Competitor Info</label><textarea id="reportCompetitor" rows="2"></textarea>
                <label>Challenges</label><textarea id="reportChallenges" rows="2"></textarea>
                <label>Tomorrow's Plan</label><textarea id="reportPlan" rows="2"></textarea>
                <label>Remarks</label><textarea id="reportRemarks" rows="2"></textarea>
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const report = {
                        date: document.getElementById('reportDate').value || today,
                        employee: data.user.name,
                        territory: document.getElementById('reportTerritory').value || data.user.territory,
                        callsMade: parseInt(document.getElementById('reportCalls').value) || 0,
                        callsConnected: parseInt(document.getElementById('reportConnected').value) || 0,
                        meetings: parseInt(document.getElementById('reportMeetings').value) || 0,
                        visits: parseInt(document.getElementById('reportVisits').value) || 0,
                        newLeads: parseInt(document.getElementById('reportNewLeads').value) || 0,
                        qualifiedLeads: parseInt(document.getElementById('reportQualified').value) || 0,
                        followups: parseInt(document.getElementById('reportFollowups').value) || 0,
                        proposals: parseInt(document.getElementById('reportProposals').value) || 0,
                        dealsClosed: parseInt(document.getElementById('reportDeals').value) || 0,
                        businessGenerated: parseFloat(document.getElementById('reportBusiness').value) || 0,
                        expectedBusiness: parseFloat(document.getElementById('reportExpected').value) || 0,
                        customerIssues: document.getElementById('reportIssues').value || '',
                        competitorInfo: document.getElementById('reportCompetitor').value || '',
                        challenges: document.getElementById('reportChallenges').value || '',
                        tomorrowPlan: document.getElementById('reportPlan').value || '',
                        remarks: document.getElementById('reportRemarks').value || '',
                        status: 'Submitted'
                    };
                    updateData(prev => ({ ...prev, dailyReports: [...prev.dailyReports, report] }));
                    showToast('📄 Daily report submitted');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Submit</button></div>
            </div>
        );
    };

    const openExpenseModal = () => {
        const today = new Date().toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Add Expense</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Date</label><input type="date" id="expDate" defaultValue={today} /></div><div><label>Type</label><select id="expType"><option>Transport</option><option>Meals</option><option>Accommodation</option><option>Other</option></select></div></div>
                <label>Amount (₹)</label><input type="number" id="expAmount" defaultValue="0" />
                <label>Customer</label><input id="expCustomer" placeholder="Customer/Lead" />
                <label>Location</label><input id="expLocation" placeholder="Location" />
                <label>GPS</label><input id="expGps" placeholder="lat,lng" />
                <label>Remarks</label><textarea id="expRemarks" rows="2"></textarea>
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const exp = {
                        id: Date.now(),
                        employee: data.user.name,
                        date: document.getElementById('expDate').value || today,
                        expenseType: document.getElementById('expType').value || 'Other',
                        amount: parseFloat(document.getElementById('expAmount').value) || 0,
                        customer: document.getElementById('expCustomer').value || '',
                        location: document.getElementById('expLocation').value || '',
                        gps: document.getElementById('expGps').value || '',
                        receipt: '',
                        livePhoto: '',
                        remarks: document.getElementById('expRemarks').value || '',
                        status: 'Pending'
                    };
                    updateData(prev => ({ ...prev, travelExpenses: [...prev.travelExpenses, exp] }));
                    showToast('💳 Expense added');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Add</button></div>
            </div>
        );
    };

    // ---- Quick Actions ----
    const quickAction = (action) => {
        if (action === 'New Lead') openLeadModal();
        else if (action === 'Log Call') openCallModal();
        else if (action === 'Schedule Meeting') showToast('📅 Schedule meeting (stub)');
        else if (action === 'Record Visit') openVisitModal();
        else if (action === 'Add Follow-up') openFollowupModal();
        else if (action === 'Submit Daily Report') openDailyReportModal();
        else if (action === 'Add Expense') openExpenseModal();
        else showToast('⚡ ' + action);
    };

    const drill = (label) => {
        if (label.includes('Lead')) navigateTo('leads');
        else if (label.includes('Customer')) navigateTo('customers');
        else if (label.includes('Visit')) navigateTo('visits');
        else if (label.includes('Task')) navigateTo('tasks');
        else if (label.includes('Follow-up')) navigateTo('followups');
        else if (label.includes('Meeting')) navigateTo('meetings');
        else if (label.includes('Opportunity')) navigateTo('opportunities');
        else if (label.includes('Target') || label.includes('Revenue') || label.includes('Achievement')) navigateTo('performance');
        else showToast('🔍 Drilling into: ' + label);
    };

    // ---- Page Render ----
    const renderPage = useCallback(() => {
        switch (currentPage) {
            case 'dashboard': return renderDashboard();
            case 'leads': return renderLeads();
            case 'opportunities': return renderOpportunities();
            case 'customers': return renderCustomers();
            case 'calls': return renderCalls();
            case 'meetings': return renderMeetings();
            case 'visits': return renderVisits();
            case 'followups': return renderFollowups();
            case 'tasks': return renderTasks();
            case 'daily-report': return renderDailyReport();
            case 'travel': return renderTravel();
            case 'performance': return renderPerformance();
            case 'alerts': return renderAlerts();
            default: return renderDashboard();
        }
    }, [currentPage, renderDashboard, renderLeads, renderOpportunities, renderCustomers, renderCalls,
        renderMeetings, renderVisits, renderFollowups, renderTasks, renderDailyReport, renderTravel,
        renderPerformance, renderAlerts]);

    // ---- Sidebar Render ----
    const renderSidebarItems = () => {
        return menuStructure.map((group, idx) => (
            <div key={idx}>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{group.section}</span>
                <ul className="mt-2 space-y-1">
                    {group.items.map(item => (
                        <li key={item.id}
                            className={`sidebar-link ${currentPage === item.id ? 'active' : ''}`}
                            onClick={() => navigateTo(item.id)}>
                            <i className={`${item.icon} w-4`}></i>{item.label}
                        </li>
                    ))}
                </ul>
            </div>
        ));
    };

    // ---- Main Render ----
    return (
        <div className="bde-app-container">
            <style>{`
                /* ===== GREEN & WHITE THEME ===== */
                :root {
                    --green-50: #ecfdf5;
                    --green-100: #d1fae5;
                    --green-200: #a7f3d0;
                    --green-300: #6ee7b7;
                    --green-400: #34d399;
                    --green-500: #10b981;
                    --green-600: #059669;
                    --green-700: #047857;
                    --green-800: #065f46;
                    --green-900: #064e3b;
                    --white: #ffffff;
                    --off-white: #f4fbf8;
                    --surface: #e6f4ee;
                    --text: #0a2e1f;
                    --text-secondary: #1b4d3a;
                    --text-muted: #2b5e47;
                    --border: #b8d9cc;
                    --border-light: #d5ede2;
                    --radius-sm: 10px;
                    --radius: 14px;
                    --radius-lg: 20px;
                    --radius-xl: 28px;
                }
                * { box-sizing: border-box; }
                .bde-app-container {
                    font-family: 'Inter', system-ui, sans-serif;
                    background: #f0faf5;
                    color: #0a2e1f;
                    display: flex;
                    min-height: 100vh;
                }
                .sidebar-link {
                    transition: all 0.15s;
                    cursor: pointer;
                    display: flex !important;
                    align-items: center !important;
                    gap: 0.75rem !important;
                    padding: 0.5rem 0.75rem !important;
                    border-radius: 0.5rem !important;
                    color: #cbd5e1 !important;
                }
                .sidebar-link:hover {
                    background: #1a3a2e;
                    color: #ffffff !important;
                }
                .sidebar-link.active {
                    background: #1a3a2e;
                    color: #ffffff !important;
                    border-left: 3px solid #34d399;
                }
                .sidebar-link.active i {
                    color: #6ee7b7 !important;
                }
                .sidebar-nav::-webkit-scrollbar { width: 4px; }
                .sidebar-nav::-webkit-scrollbar-track { background: #0b1f16; }
                .sidebar-nav::-webkit-scrollbar-thumb { background: #2b5e47; border-radius: 20px; }
                .card-hover { transition: all 0.2s; }
                .card-hover:hover {
                    box-shadow: 0 12px 30px -12px rgba(5, 150, 105, 0.15);
                    transform: translateY(-2px);
                }
                .fade-in { animation: fadeIn 0.25s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                .toast {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    background: #0b1f16;
                    color: #d1fae5;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-size: 13px;
                    box-shadow: 0 8px 30px rgba(5, 150, 105, 0.25);
                    z-index: 999;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transform: translateY(120px);
                    opacity: 0;
                    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                    pointer-events: none;
                }
                .toast.show { transform: translateY(0); opacity: 1; pointer-events: auto; }
                .toast i { color: #34d399; font-size: 18px; }
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(10, 46, 31, 0.5);
                    backdrop-filter: blur(4px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.25s;
                }
                .modal-overlay.active { opacity: 1; pointer-events: auto; }
                .modal-box {
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 32px;
                    max-width: 640px;
                    width: 92%;
                    max-height: 90vh;
                    overflow-y: auto;
                    transform: scale(0.95);
                    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
                    box-shadow: 0 30px 60px rgba(5, 150, 105, 0.15);
                }
                .modal-overlay.active .modal-box { transform: scale(1); }
                .modal-box input, .modal-box select, .modal-box textarea {
                    width: 100%;
                    border: 1px solid #b8d9cc;
                    border-radius: 10px;
                    padding: 10px 14px;
                    font-size: 14px;
                    margin-top: 6px;
                    outline: none;
                    transition: border 0.2s;
                    background: #ffffff;
                    color: #0a2e1f;
                }
                .modal-box input:focus, .modal-box select:focus, .modal-box textarea:focus {
                    border-color: #059669;
                    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);
                }
                .modal-box label { font-weight: 500; font-size: 13px; color: #1b4d3a; margin-top: 14px; display: block; }
                .modal-box .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                @media (max-width: 480px) { .modal-box .form-row { grid-template-columns: 1fr; } }
                .status-badge {
                    padding: 2px 10px;
                    border-radius: 999px;
                    font-size: 11px;
                    font-weight: 600;
                    display: inline-block;
                }
                .status-badge.pending { background: #fef3c7; color: #92400e; }
                .status-badge.completed { background: #dcfce7; color: #166534; }
                .status-badge.in-progress { background: #dbeafe; color: #1e40af; }
                .status-badge.critical { background: #fee2e2; color: #991b1b; }
                .status-badge.positive { background: #dcfce7; color: #166534; }
                .status-badge.warning { background: #fef3c7; color: #92400e; }
                .status-badge.error { background: #fee2e2; color: #991b1b; }
                .status-badge.new { background: #dbeafe; color: #1e40af; }
                .status-badge.contacted { background: #fef3c7; color: #92400e; }
                .status-badge.qualified { background: #dcfce7; color: #166534; }
                .status-badge.interested { background: #fef3c7; color: #92400e; }
                .status-badge.meeting { background: #dbeafe; color: #1e40af; }
                .status-badge.proposal { background: #fef3c7; color: #92400e; }
                .status-badge.negotiation { background: #fef3c7; color: #92400e; }
                .status-badge.won { background: #dcfce7; color: #166534; }
                .status-badge.lost { background: #fee2e2; color: #991b1b; }
                .status-badge.overdue { background: #fee2e2; color: #991b1b; }
                .status-badge.submitted { background: #dcfce7; color: #166534; }
                .delete-btn { color: #ef4444; cursor: pointer; transition: 0.15s; }
                .delete-btn:hover { color: #dc2626; transform: scale(1.1); }
                .edit-btn { color: #0f7b5a; cursor: pointer; transition: 0.15s; }
                .edit-btn:hover { color: #047857; }
                .chart-bar { height: 8px; border-radius: 999px; background: #ecfdf5; overflow: hidden; }
                .chart-bar .fill { height: 100%; border-radius: 999px; }
                .progress-ring { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; position: relative; }
                .progress-ring .bg { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(var(--color) var(--pct), #e2e8f0 var(--pct)); }
                .progress-ring .inner { position: relative; z-index: 2; background: #ffffff; width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; color: #0a2e1f; }
                .pipeline-stage { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 600; }
                table td { color: #1b4d3a !important; }
                .grid { display: grid; }
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                .grid-cols-8 { grid-template-columns: repeat(8, minmax(0, 1fr)); }
                .gap-2 { gap: 0.5rem; }
                .gap-3 { gap: 0.75rem; }
                .gap-4 { gap: 1rem; }
                .gap-5 { gap: 1.25rem; }
                @media (max-width: 768px) {
                    .grid-cols-8 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                    .grid-cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .grid-cols-2 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                }
                @media (max-width: 480px) {
                    .grid-cols-8 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                .flex { display: flex; }
                .flex-col { flex-direction: column; }
                .flex-1 { flex: 1 1 0%; }
                .flex-shrink-0 { flex-shrink: 0; }
                .shrink-0 { flex-shrink: 0; }
                .items-center { align-items: center; }
                .justify-between { justify-content: space-between; }
                .justify-end { justify-content: flex-end; }
                .w-64 { width: 16rem; }
                .w-4 { width: 1rem; }
                .w-7 { width: 1.75rem; }
                .w-8 { width: 2rem; }
                .w-80 { width: 20rem; }
                .w-full { width: 100%; }
                .w-px { width: 1px; }
                .h-16 { height: 4rem; }
                .h-6 { height: 1.5rem; }
                .h-7 { height: 1.75rem; }
                .h-8 { height: 2rem; }
                .h-full { height: 100%; }
                .h-screen { height: 100vh; }
                .overflow-hidden { overflow: hidden; }
                .overflow-y-auto { overflow-y: auto; }
                .overflow-x-auto { overflow-x: auto; }
                .min-h-screen { min-height: 100vh; }
                .ml-64 { margin-left: 16rem; }
                .p-2 { padding: 0.5rem; }
                .p-3 { padding: 0.75rem; }
                .p-4 { padding: 1rem; }
                .p-5 { padding: 1.25rem; }
                .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
                .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
                .px-4 { padding-left: 1rem; padding-right: 1rem; }
                .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
                .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
                .py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
                .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
                .py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
                .mt-2 { margin-top: 0.5rem; }
                .mt-3 { margin-top: 0.75rem; }
                .mt-4 { margin-top: 1rem; }
                .mt-6 { margin-top: 1.5rem; }
                .mt-1 { margin-top: 0.25rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mr-1 { margin-right: 0.25rem; }
                .mr-2 { margin-right: 0.5rem; }
                .ml-auto { margin-left: auto; }
                .border { border-width: 1px; border-style: solid; }
                .border-b { border-bottom-width: 1px; border-bottom-style: solid; }
                .border-r { border-right-width: 1px; border-right-style: solid; }
                .border-t { border-top-width: 1px; border-top-style: solid; }
                .rounded-full { border-radius: 9999px; }
                .rounded-lg { border-radius: 0.5rem; }
                .rounded-xl { border-radius: 0.75rem; }
                .bg-white { background-color: #ffffff; }
                .bg-slate-50 { background-color: #f8fafc; }
                .bg-green-600 { background-color: #0f7b5a; }
                .hover\\:bg-green-700:hover { background-color: #047857; }
                .hover\\:bg-green-50:hover { background-color: #ecfdf5; }
                .hover\\:bg-slate-50:hover { background-color: #f1f5f9; }
                .text-white { color: #ffffff; }
                .text-slate-800 { color: #0a2e1f; }
                .text-slate-700 { color: #1b4d3a; }
                .text-slate-600 { color: #1b4d3a; }
                .text-slate-500 { color: #2b5e47; }
                .text-slate-400 { color: #94a3b8; }
                .text-green-300 { color: #6ee7b7; }
                .text-green-400 { color: #34d399; }
                .text-green-600 { color: #0f7b5a; }
                .text-amber-500 { color: #d97706; }
                .text-amber-600 { color: #d97706; }
                .text-emerald-600 { color: #16a34a; }
                .text-blue-500 { color: #3b82f6; }
                .text-purple-500 { color: #8b5cf6; }
                .text-teal-500 { color: #14b8a6; }
                .text-indigo-500 { color: #6366f1; }
                .text-rose-600 { color: #dc2626; }
                .font-bold { font-weight: 700; }
                .font-medium { font-weight: 500; }
                .font-semibold { font-weight: 600; }
                .text-2xl { font-size: 1.5rem; line-height: 2rem; }
                .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
                .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                .text-xs { font-size: 0.75rem; line-height: 1rem; }
                .text-\\[10px\\] { font-size: 10px; }
                .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                .tracking-tight { letter-spacing: -0.025em; }
                .tracking-wider { letter-spacing: 0.05em; }
                .uppercase { text-transform: uppercase; }
                .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                .object-cover { object-fit: cover; }
                .ring-2 { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), 0 0 #0000; }
                .ring-green-300 { --tw-ring-color: #6ee7b7; }
                .space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.25rem; }
                .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }
                .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; }
                .space-y-5 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.25rem; }
                .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
                .fixed { position: fixed; }
                .inset-0 { inset: 0; }
                .inset-y-0 { top: 0; bottom: 0; }
                .left-0 { left: 0; }
                .z-50 { z-index: 50; }
                .relative { position: relative; }
                .absolute { position: absolute; }
                .-top-0\\.5 { top: -0.125rem; }
                .-right-0\\.5 { right: -0.125rem; }
                .top-1\\/2 { top: 50%; }
                .left-3\\.5 { left: 0.875rem; }
                .-translate-y-1\\/2 { transform: translateY(-50%); }
                .pl-10 { padding-left: 2.5rem; }
                .pr-4 { padding-right: 1rem; }
                .focus\\:border-green-500:focus { border-color: #059669; }
                .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
                .transition { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                @media (max-width: 768px) {
                    .bde-app-container .w-64 { width: 240px; position: fixed; transform: translateX(-100%); transition: transform 0.3s; z-index: 100; }
                    .bde-app-container .w-64.open { transform: translateX(0); }
                    .bde-app-container .ml-64 { margin-left: 0; }
                    .bde-app-container .w-80 { width: 100%; }
                    .bde-app-container .grid-cols-8 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                }
                .backdrop { display: none; position: fixed; inset: 0; background: rgba(10,46,31,0.3); z-index: 90; }
                .backdrop.open { display: block; }
                .hamburger { display: none; background: none; border: none; font-size: 22px; color: #0a2e1f; cursor: pointer; padding: 4px 8px; border-radius: 10px; }
                @media (max-width: 768px) { .hamburger { display: block; } }
            `}</style>

            {/* Sidebar */}
            <aside id="sidebar" className={`w-64 bg-[#0b1f16] text-white/80 flex flex-col shrink-0 h-full border-r border-[#1a3a2e] fixed inset-y-0 left-0 z-50 ${sidebarOpen ? 'open' : ''}`}>
                <div className="px-5 py-5 border-b border-[#1a3a2e] flex items-center gap-3 shrink-0">
                    <i className="fa-solid fa-user-tie text-green-400 text-xl"></i>
                    <span className="text-white font-bold tracking-tight">ePay <span className="text-green-300">BDE</span></span>
                    <span className="ml-auto text-[10px] bg-green-600/30 text-green-200 px-2 py-0.5 rounded-full">v1</span>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-5 text-sm overflow-y-auto sidebar-nav">
                    {renderSidebarItems()}
                </nav>
                <div className="p-4 border-t border-[#1a3a2e] text-xs text-slate-400 flex items-center gap-3 shrink-0">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full" alt="profile" />
                    <div>
                        <p className="text-white text-sm font-medium">{userName}</p>
                        <p className="text-[10px] text-green-300">BDE</p>
                    </div>
                </div>
            </aside>

            {/* Backdrop */}
            <div className={`backdrop ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>

            {/* Main */}
            <div className="ml-64 flex flex-col h-screen overflow-hidden" style={{ flex: 1 }}>
                <header id="header" className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button className="hamburger" onClick={() => setSidebarOpen(true)}><i className="fa-solid fa-bars"></i></button>
                        <div className="relative w-80">
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            <input id="globalSearch" type="text" placeholder="Search leads, customers, opportunities..." className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500 transition text-slate-800"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => {
                            setUserName(userName === 'Suresh' ? 'Admin' : 'Suresh');
                            showToast('🔄 Switched to ' + (userName === 'Suresh' ? 'Admin' : 'BDE'));
                        }} className="flex items-center gap-2 border border-slate-200 hover:bg-green-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition text-slate-700">
                            <i className="fa-solid fa-arrow-right-arrow-left text-green-600"></i> Switch
                        </button>
                        <div className="relative">
                            <button onClick={() => {
                                if (notifCount > 0) { setNotifCount(0);
                                    showToast('🔔 Notifications cleared'); } else showToast('🔔 No new notifications');
                            }} className="p-2 text-slate-600 hover:bg-green-50 rounded-full transition relative">
                                <i className="fa-regular fa-bell text-lg"></i>
                                {notifCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{notifCount}</span>}
                            </button>
                        </div>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-2">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" className="w-8 h-8 rounded-full object-cover ring-2 ring-green-300" alt="profile" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/80 fade-in" id="mainContent">
                    {renderPage()}
                </main>
            </div>

            {/* Toast */}
            <div className={`toast ${toast ? 'show' : ''}`}><i className="fa-regular fa-circle-check"></i><span>{toast || ''}</span></div>

            {/* Modal */}
            <div className={`modal-overlay ${modal ? 'active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                    {modal}
                </div>
            </div>
        </div>
    );
};

// ===== Lead Modal Content =====
const LeadModalContent = ({ data, updateData, closeModal, showToast, userName }) => {
    const today = new Date().toISOString().slice(0, 10);
    const submitLead = () => {
        const lead = {
            id: Date.now(),
            name: document.getElementById('leadName').value || 'New Lead',
            company: document.getElementById('leadCompany').value || '',
            contact: document.getElementById('leadContact').value || '',
            mobile: document.getElementById('leadMobile').value || '',
            email: document.getElementById('leadEmail').value || '',
            location: document.getElementById('leadLocation').value || '',
            industry: document.getElementById('leadIndustry').value || '',
            source: document.getElementById('leadSource').value || 'Other',
            assignedBDE: userName,
            created: today,
            priority: document.getElementById('leadPriority').value || 'Medium',
            requirement: document.getElementById('leadRequirement').value || '',
            estimatedValue: parseFloat(document.getElementById('leadValue').value) || 0,
            expectedClosing: '',
            status: document.getElementById('leadStatus').value || 'New',
            nextFollowup: document.getElementById('leadFollowup').value || '',
            lastContact: today,
            remarks: ''
        };
        updateData(prev => ({ ...prev, leads: [...prev.leads, lead] }));
        showToast('⭐ Lead created');
        closeModal();
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">New Lead</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
            <div className="form-row"><div><label>Name</label><input id="leadName" placeholder="Lead name" /></div><div><label>Company</label><input id="leadCompany" placeholder="Company" /></div></div>
            <div className="form-row"><div><label>Contact</label><input id="leadContact" placeholder="Contact person" /></div><div><label>Mobile</label><input id="leadMobile" placeholder="Mobile" /></div></div>
            <div className="form-row"><div><label>Email</label><input id="leadEmail" placeholder="Email" /></div><div><label>Location</label><input id="leadLocation" placeholder="Location" /></div></div>
            <div className="form-row"><div><label>Industry</label><input id="leadIndustry" placeholder="Industry" /></div><div><label>Source</label><select id="leadSource"><option>Referral</option><option>Website</option><option>Campaign</option><option>Social Media</option><option>Cold Calling</option><option>Other</option></select></div></div>
            <div className="form-row"><div><label>Priority</label><select id="leadPriority"><option>High</option><option>Medium</option><option>Low</option></select></div><div><label>Estimated Value</label><input type="number" id="leadValue" placeholder="0" /></div></div>
            <label>Requirement</label><textarea id="leadRequirement" rows="2"></textarea>
            <div className="form-row"><div><label>Status</label><select id="leadStatus"><option>New</option><option>Contacted</option><option>Interested</option><option>Qualified</option><option>Meeting Scheduled</option><option>Proposal</option><option>Negotiation</option><option>Won</option><option>Lost</option></select></div><div><label>Next Follow-up</label><input type="date" id="leadFollowup" defaultValue={today} /></div></div>
            <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={submitLead} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Create</button></div>
        </>
    );
};

export default App;
