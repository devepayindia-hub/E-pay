'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

// ================================================================
// DATA STORE
// ================================================================
const STORAGE_KEY = 'bdoData_v1';

const defaultData = () => ({
    user: { name: 'Meena', role: 'BDO', territory: 'North Zone' },
    visits: [
        { id: 1, customer: 'ABC Corp', businessName: 'ABC Industries', contact: 'Ravi', mobile: '9876543210',
            date: '2025-05-16', startTime: '10:00', endTime: '11:00', location: 'Mumbai',
            gps: '19.0760,72.8777', distance: 5, livePhoto: 'photo1.jpg', purpose: 'Introductory meeting',
            discussion: 'Discussed business needs', outcome: 'Positive', nextAction: 'Send proposal',
            followupDate: '2025-05-20', remarks: '', status: 'Completed', verified: true },
        { id: 2, customer: 'XYZ Ltd', businessName: 'XYZ Enterprises', contact: 'Sita', mobile: '9876543211',
            date: '2025-05-17', startTime: '15:00', endTime: '16:00', location: 'Delhi',
            gps: '28.6139,77.2090', distance: 10, livePhoto: 'photo2.jpg', purpose: 'Demo',
            discussion: 'Demo of gallery solutions', outcome: 'Interested', nextAction: 'Follow-up call',
            followupDate: '2025-05-21', remarks: '', status: 'Completed', verified: true },
        { id: 3, customer: 'PQR Inc', businessName: 'PQR Solutions', contact: 'Priya', mobile: '9876543212',
            date: '2025-05-18', startTime: '09:00', endTime: '10:00', location: 'Chennai',
            gps: '13.0827,80.2707', distance: 8, livePhoto: '', purpose: 'Market survey',
            discussion: 'Identified potential', outcome: 'Follow-up', nextAction: 'Schedule meeting',
            followupDate: '2025-05-22', remarks: '', status: 'Pending', verified: false },
        { id: 4, customer: 'LMN Enterprises', businessName: 'LMN Group', contact: 'Amit', mobile: '9876543213',
            date: '2025-05-19', startTime: '14:00', endTime: '15:00', location: 'Bangalore',
            gps: '12.9716,77.5946', distance: 12, livePhoto: 'photo4.jpg', purpose: 'Business development',
            discussion: 'Discussed partnership', outcome: 'Positive', nextAction: 'Share proposal',
            followupDate: '2025-05-24', remarks: '', status: 'Scheduled', verified: true },
    ],
    prospects: [
        { id: 1, businessName: 'New Art Gallery', contact: 'Rahul', mobile: '9876543215',
            email: 'rahul@newart.com', location: 'Mumbai', gps: '19.0760,72.8777', industry: 'Art',
            businessType: 'Gallery', estimatedValue: 50000, requirement: 'Framing solutions',
            currentProvider: 'Competitor A', competitor: 'Competitor A', opportunityLevel: 'High',
            assignedBDO: 'Meena', assignedBDE: '', status: 'New', nextFollowup: '2025-05-22' },
        { id: 2, businessName: 'Craft World', contact: 'Sneha', mobile: '9876543216',
            email: 'sneha@craft.com', location: 'Delhi', gps: '28.6139,77.2090', industry: 'Crafts',
            businessType: 'Retail', estimatedValue: 30000, requirement: 'Display units',
            currentProvider: 'Competitor B', competitor: 'Competitor B', opportunityLevel: 'Medium',
            assignedBDO: 'Meena', assignedBDE: '', status: 'Contacted', nextFollowup: '2025-05-20' },
    ],
    leads: [
        { id: 1, customer: 'ABC Corp', source: 'Field Visit', status: 'Qualified', assignedBDO: 'Meena',
            assignedBDE: 'Suresh', value: 50000, created: '2025-05-16', nextFollowup: '2025-05-20' },
        { id: 2, customer: 'XYZ Ltd', source: 'Referral', status: 'Meeting', assignedBDO: 'Meena',
            assignedBDE: 'Suresh', value: 30000, created: '2025-05-17', nextFollowup: '2025-05-21' },
        { id: 3, customer: 'PQR Inc', source: 'Market Survey', status: 'New', assignedBDO: 'Meena',
            assignedBDE: '', value: 20000, created: '2025-05-18', nextFollowup: '2025-05-22' },
    ],
    opportunities: [
        { id: 1, customer: 'ABC Corp', value: 50000, probability: 70, expectedClosing: '2025-06-10',
            product: 'Custom Frames', decisionMaker: 'Ravi', competitor: 'None', stage: 'Negotiation',
            nextAction: 'Finalize pricing', owner: 'Meena', status: 'Active' },
        { id: 2, customer: 'XYZ Ltd', value: 30000, probability: 50, expectedClosing: '2025-06-05',
            product: 'Display Solutions', decisionMaker: 'Sita', competitor: 'Competitor B',
            stage: 'Proposal', nextAction: 'Follow-up call', owner: 'Meena', status: 'Active' },
    ],
    customers: [
        { id: 1, name: 'Art Gallery', contact: 'Raj', mobile: '9876543217', email: 'raj@art.com',
            location: 'Mumbai', industry: 'Art', status: 'Active', revenue: 25000, lastVisit: '2025-05-16',
            nextFollowup: '2025-05-25', opportunities: 1, complaints: 0, relationship: 'Good' },
    ],
    meetings: [
        { id: 1, customer: 'ABC Corp', date: '2025-05-22', time: '14:00', location: 'Mumbai',
            participants: 'Meena, Ravi', purpose: 'Proposal presentation', discussion: '',
            opportunityValue: 50000, outcome: 'Scheduled', nextAction: 'Send proposal',
            followupDate: '2025-05-25', gps: '19.0760,72.8777', livePhoto: '' },
    ],
    followups: [
        { id: 1, lead: 'ABC Corp', customer: 'ABC Corp', contact: 'Ravi', date: '2025-05-20',
            time: '10:00', method: 'Call', discussion: 'Follow-up on proposal',
            response: 'Interested, need revision', nextAction: 'Send revised quote',
            nextFollowup: '2025-05-25', status: 'Pending' },
        { id: 2, lead: 'XYZ Ltd', customer: 'XYZ Ltd', contact: 'Sita', date: '2025-05-18',
            time: '11:00', method: 'Email', discussion: 'Sent price list', response: 'Will review',
            nextAction: 'Follow-up call', nextFollowup: '2025-05-21', status: 'Completed' },
    ],
    dailyReports: [
        { date: '2025-05-16', employee: 'Meena', territory: 'North Zone', areasCovered: 'Mumbai',
            plannedVisits: 4, completedVisits: 3, customerVisits: 2, prospectVisits: 1, newProspects: 2,
            newLeads: 3, meetings: 1, followups: 4, businessOpportunities: 2, expectedRevenue: 80000,
            competitorFindings: 'Competitor A offering discounts', marketFindings: 'High demand',
            problems: 'None', supportRequired: 'None', tomorrowPlan: 'Visit XYZ Ltd again',
            remarks: '', status: 'Submitted' },
    ],
    surveys: [
        { id: 1, area: 'Mumbai', location: 'Andheri', businessName: 'Creative Hub',
            businessCategory: 'Art Gallery', contactPerson: 'Anil', mobile: '9876543218',
            estimatedBusinessSize: 'Medium', customerPotential: 'High', currentProvider: 'Competitor A',
            competitor: 'Competitor A', competitorPricing: '40k-50k', customerRequirement: 'Framing',
            opportunityPotential: 'High', photo: 'survey1.jpg', gps: '19.0760,72.8777',
            surveyDate: '2025-05-16', remarks: '', status: 'Completed' },
    ],
    intelligence: [
        { id: 1, competitor: 'Competitor A', location: 'Mumbai', product: 'Framing Services',
            priceInfo: '40k-50k', offer: '10% discount', customerFeedback: 'Good quality',
            strengths: 'Established brand', weaknesses: 'Higher pricing', marketPosition: 'Leader',
            photos: '', dateCollected: '2025-05-16', remarks: '' },
    ],
    tasks: [
        { id: 1, title: 'Visit XYZ Ltd for follow-up', assignedTo: 'Meena', due: '2025-05-18',
            priority: 'High', status: 'Completed', category: 'Visit' },
        { id: 2, title: 'Market survey in Andheri area', assignedTo: 'Meena', due: '2025-05-20',
            priority: 'Medium', status: 'Pending', category: 'Survey' },
        { id: 3, title: 'Follow-up with ABC Corp', assignedTo: 'Meena', due: '2025-05-17',
            priority: 'High', status: 'In Progress', category: 'Follow-up' },
    ],
    travelExpenses: [
        { id: 1, employee: 'Meena', date: '2025-05-16', expenseType: 'Transport', amount: 500,
            visitId: 1, customer: 'ABC Corp', location: 'Mumbai', gps: '19.0760,72.8777',
            receipt: 'receipt1.jpg', livePhoto: 'photo1.jpg', remarks: 'Taxi', status: 'Pending' },
        { id: 2, employee: 'Meena', date: '2025-05-17', expenseType: 'Meals', amount: 200,
            visitId: 2, customer: 'XYZ Ltd', location: 'Delhi', gps: '28.6139,77.2090',
            receipt: 'receipt2.jpg', livePhoto: '', remarks: 'Lunch meeting', status: 'Approved' },
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
    const [notifCount, setNotifCount] = useState(6);
    const [userName, setUserName] = useState('Meena');
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
        const visits = d.visits || [];
        const prospects = d.prospects || [];
        const leads = d.leads || [];
        const opportunities = d.opportunities || [];
        const customers = d.customers || [];
        const followups = d.followups || [];
        const tasks = d.tasks || [];
        const surveys = d.surveys || [];
        const today = new Date().toISOString().slice(0, 10);

        const plannedVisits = visits.length;
        const completedVisits = visits.filter(v => v.status === 'Completed').length;
        const missedVisits = visits.filter(v => v.status === 'Missed').length;
        const verifiedVisits = visits.filter(v => v.verified).length;
        const pendingVisits = visits.filter(v => v.status === 'Pending' || v.status === 'Scheduled').length;
        const prospectsVisited = prospects.filter(p => p.status === 'Contacted' || p.status === 'Qualified').length;
        const newLeads = leads.filter(l => l.status === 'New').length;
        const meetingsCount = d.meetings ? d.meetings.length : 0;
        const totalRevenue = customers.reduce((s, c) => s + (c.revenue || 0), 0);
        const monthlyTarget = 80000;
        const achievement = monthlyTarget > 0 ? Math.round((totalRevenue / monthlyTarget) * 100) : 0;
        const pendingFollowups = followups.filter(f => f.status === 'Pending').length;
        const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
        const territoryCoverage = 65;
        const todayVisits = visits.filter(v => v.date === today).length;
        const todayCompleted = visits.filter(v => v.date === today && v.status === 'Completed').length;

        d.stats = {
            todayVisits,
            plannedVisits,
            completedVisits,
            missedVisits,
            verifiedVisits,
            territoryCoverage,
            prospectsVisited,
            newLeads,
            meetings: meetingsCount,
            businessGenerated: totalRevenue,
            targetAchievement: achievement,
            followups: pendingFollowups,
            pendingTasks,
            dailyReportStatus: d.dailyReports && d.dailyReports.length > 0 && d.dailyReports[0].date === today ? 'Submitted' : 'Pending',
            bdoPerformance: 82,
            todayCompleted,
            pendingVisits,
            surveysCount: surveys.length,
            opportunitiesCount: opportunities.filter(o => o.status === 'Active').length,
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
        { section: 'Field', items: [
                { id: 'visits', label: 'Field Visits', icon: 'fa-regular fa-location-dot' },
                { id: 'territory', label: 'Territory', icon: 'fa-regular fa-map' },
                { id: 'surveys', label: 'Market Surveys', icon: 'fa-regular fa-clipboard' },
            ] },
        { section: 'Pipeline', items: [
                { id: 'prospects', label: 'Prospects', icon: 'fa-regular fa-user-plus' },
                { id: 'leads', label: 'Leads', icon: 'fa-regular fa-user-plus' },
                { id: 'opportunities', label: 'Opportunities', icon: 'fa-regular fa-chart-line' },
                { id: 'customers', label: 'Customers', icon: 'fa-regular fa-user' },
            ] },
        { section: 'Activities', items: [
                { id: 'meetings', label: 'Meetings', icon: 'fa-regular fa-calendar-check' },
                { id: 'followups', label: 'Follow-ups', icon: 'fa-regular fa-clock' },
                { id: 'intelligence', label: 'Market Intelligence', icon: 'fa-regular fa-binoculars' },
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
            'verified': 'verified',
            'high': 'high',
            'medium': 'medium',
            'low': 'low',
        };
        const cls = clsMap[status?.toLowerCase()?.replace(' ', '-')] || 'pending';
        return `status-badge ${cls}`;
    };

    // ---- Page Renderers ----
    const renderDashboard = useCallback(() => {
        const s = data.stats;
        const colorMap = {
            indigo: 'bg-indigo-50 text-indigo-600',
            blue: 'bg-blue-50 text-blue-600',
            emerald: 'bg-emerald-50 text-emerald-600',
            rose: 'bg-rose-50 text-rose-600',
            teal: 'bg-teal-50 text-teal-600',
            cyan: 'bg-cyan-50 text-cyan-600',
            purple: 'bg-purple-50 text-purple-600',
            sky: 'bg-sky-50 text-sky-600',
            green: 'bg-green-50 text-green-600',
            amber: 'bg-amber-50 text-amber-600',
            violet: 'bg-violet-50 text-violet-600',
            orange: 'bg-orange-50 text-orange-600',
            pink: 'bg-pink-50 text-pink-600'
        };
        const stats = [
            ["Today's Visits", s.todayVisits, 'fa-location-dot', 'indigo'],
            ['Planned Visits', s.plannedVisits, 'fa-calendar', 'blue'],
            ['Completed', s.completedVisits, 'fa-check-circle', 'emerald'],
            ['Missed', s.missedVisits, 'fa-circle-xmark', 'rose'],
            ['Verified Visits', s.verifiedVisits, 'fa-badge-check', 'teal'],
            ['Territory Coverage', s.territoryCoverage + '%', 'fa-map', 'cyan'],
            ['Prospects Visited', s.prospectsVisited, 'fa-user-plus', 'purple'],
            ['New Leads', s.newLeads, 'fa-user-plus', 'sky'],
            ['Meetings', s.meetings, 'fa-calendar-check', 'green'],
            ['Business Generated', '₹' + formatNum(s.businessGenerated), 'fa-arrow-trend-up', 'amber'],
            ['Target Achievement', s.targetAchievement + '%', 'fa-percent', 'violet'],
            ['Follow-ups', s.followups, 'fa-clock', 'orange'],
            ['Pending Tasks', s.pendingTasks, 'fa-list-check', 'pink'],
            ['Daily Report', s.dailyReportStatus, 'fa-file-lines', s.dailyReportStatus === 'Submitted' ? 'emerald' : 'rose'],
            ['BDO Performance', s.bdoPerformance + '%', 'fa-star', 'indigo'],
            ['Opportunities', s.opportunitiesCount, 'fa-chart-line', 'purple'],
        ];

        const stages = ['New', 'Contacted', 'Qualified', 'Meeting', 'Proposal', 'Negotiation', 'Won', 'Lost'];
        const quickActions = ['Record Visit', 'New Prospect', 'New Lead', 'Schedule Meeting', 'Add Follow-up', 'Market Survey', 'Submit Daily Report', 'Add Expense'];

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
                        <h4 className="font-bold text-sm text-slate-800">Today's Field Activity</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div><span className="text-slate-500">Planned:</span> <span className="font-semibold text-slate-800">{s.plannedVisits}</span></div>
                            <div><span className="text-slate-500">Started:</span> <span className="font-semibold text-slate-800">{s.todayVisits}</span></div>
                            <div><span className="text-slate-500">Completed:</span> <span className="font-semibold text-emerald-600">{s.todayCompleted}</span></div>
                            <div><span className="text-slate-500">Pending:</span> <span className="font-semibold text-amber-600">{s.pendingVisits}</span></div>
                            <div><span className="text-slate-500">Verified:</span> <span className="font-semibold text-teal-600">{s.verifiedVisits}</span></div>
                            <div><span className="text-slate-500">Missed:</span> <span className="font-semibold text-rose-500">{s.missedVisits}</span></div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-800">Business Pipeline</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {stages.map(stage => {
                                const count = data.leads.filter(l => l.status === stage).length;
                                return <span key={stage} className={`pipeline-stage ${getStatusBadge(stage)}`}>{stage}: {count}</span>;
                            })}
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-between text-xs"><span className="text-slate-500">Territory Coverage</span><span className="text-slate-800 font-semibold">{s.territoryCoverage}%</span></div>
                            <div className="chart-bar mt-1"><div className="fill bg-green-600" style={{ width: `${s.territoryCoverage}%` }}></div></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <h4 className="font-bold text-sm text-slate-800"><i className="fa-regular fa-bolt mr-2 text-amber-500"></i>Quick Actions</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {quickActions.map(label => (
                            <button key={label} onClick={() => quickAction(label)} className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs hover:bg-green-50 transition text-slate-700">
                                <i className={`fa-regular ${label.includes('Visit') ? 'fa-location-dot' : label.includes('Prospect') ? 'fa-user-plus' : label.includes('Lead') ? 'fa-user-plus' : label.includes('Meeting') ? 'fa-calendar-check' : label.includes('Follow-up') ? 'fa-clock' : label.includes('Survey') ? 'fa-clipboard' : label.includes('Report') ? 'fa-file-lines' : 'fa-receipt'} text-green-500 mr-1`}></i>{label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <h4 className="font-bold text-sm text-slate-800"><i className="fa-regular fa-triangle-exclamation mr-2 text-amber-500"></i>Alerts</h4>
                    <div className="space-y-2 mt-2 text-sm">
                        <div className="flex items-center gap-3 border-b pb-2"><span className="status-badge critical">Critical</span><span className="text-slate-700">2 visits pending verification</span></div>
                        <div className="flex items-center gap-3 border-b pb-2"><span className="status-badge warning">Warning</span><span className="text-slate-700">Territory coverage at {s.territoryCoverage}%</span></div>
                        <div className="flex items-center gap-3"><span className="status-badge positive">Positive</span><span className="text-slate-700">{s.completedVisits} visits completed this week</span></div>
                    </div>
                </div>
            </>
        );
    }, [data]);

    const renderVisits = useCallback(() => {
        const visits = data.visits;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-location-dot mr-2 text-green-500"></i>Field Visits ({visits.length})</h2><button onClick={() => openVisitModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Record Visit</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Customer</th><th className="pb-3 text-left">Date</th><th className="pb-3 text-left">Purpose</th><th className="pb-3 text-left">GPS</th><th className="pb-3 text-left">Photo</th><th className="pb-3 text-left">Status</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{visits.map(v => (
                        <tr key={v.id}><td className="text-slate-800 font-medium">{v.customer}</td><td className="text-slate-700">{v.date}</td><td className="text-slate-700">{v.purpose}</td><td className="text-slate-700">{v.gps ? '📍' : ''}</td><td className="text-slate-700">{v.livePhoto ? '📷' : ''}</td><td><span className={getStatusBadge(v.status)}>{v.status}</span></td><td><button onClick={() => showToast('✏️ Edit visit (stub)')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete visit?')) { updateData(prev => ({ ...prev, visits: prev.visits.filter(x => x.id !== v.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderTerritory = useCallback(() => {
        const s = data.stats;
        return (
            <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><p className="text-xs text-slate-500">Assigned Territory</p><h3 className="text-2xl font-bold text-slate-800">{data.user.territory}</h3></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><p className="text-xs text-slate-500">Coverage</p><h3 className="text-2xl font-bold text-emerald-600">{s.territoryCoverage}%</h3></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><p className="text-xs text-slate-500">Prospects</p><h3 className="text-2xl font-bold text-slate-800">{data.prospects.length}</h3></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><p className="text-xs text-slate-500">Customers</p><h3 className="text-2xl font-bold text-slate-800">{data.customers.length}</h3></div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mt-4">
                    <h3 className="font-bold text-sm text-slate-800">Territory Coverage Map</h3>
                    <div className="h-48 bg-slate-100 rounded-lg mt-2 flex items-center justify-center text-slate-400 border border-dashed border-slate-300"><i className="fa-regular fa-map text-2xl mr-2"></i> Territory Map ({data.user.territory})</div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div className="bg-slate-50 p-2 rounded"><span className="text-slate-500">Total Areas:</span> 8</div>
                        <div className="bg-slate-50 p-2 rounded"><span className="text-slate-500">Covered:</span> 5</div>
                        <div className="bg-slate-50 p-2 rounded"><span className="text-slate-500">Uncovered:</span> 3</div>
                        <div className="bg-slate-50 p-2 rounded"><span className="text-slate-500">Visits This Month:</span> {data.visits.length}</div>
                    </div>
                </div>
            </>
        );
    }, [data]);

    const renderSurveys = useCallback(() => {
        const surveys = data.surveys;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-clipboard mr-2 text-blue-500"></i>Market Surveys ({surveys.length})</h2><button onClick={() => openSurveyModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> New Survey</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Business</th><th className="pb-3 text-left">Area</th><th className="pb-3 text-left">Category</th><th className="pb-3 text-left">Potential</th><th className="pb-3 text-left">Status</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{surveys.map(s => (
                        <tr key={s.id}><td className="text-slate-800 font-medium">{s.businessName}</td><td className="text-slate-700">{s.area}</td><td className="text-slate-700">{s.businessCategory}</td><td><span className={getStatusBadge(s.opportunityPotential)}>{s.opportunityPotential}</span></td><td><span className={getStatusBadge(s.status)}>{s.status}</span></td><td><button onClick={() => showToast('✏️ Edit survey')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, surveys: prev.surveys.filter(x => x.id !== s.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderProspects = useCallback(() => {
        const prospects = data.prospects;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-user-plus mr-2 text-blue-500"></i>Prospects ({prospects.length})</h2><button onClick={() => openProspectModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> New Prospect</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Business</th><th className="pb-3 text-left">Contact</th><th className="pb-3 text-left">Location</th><th className="pb-3 text-left">Value</th><th className="pb-3 text-left">Status</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{prospects.map(p => (
                        <tr key={p.id}><td className="text-slate-800 font-medium">{p.businessName}</td><td className="text-slate-700">{p.contact}</td><td className="text-slate-700">{p.location}</td><td className="text-slate-800">₹{formatNum(p.estimatedValue)}</td><td><span className={getStatusBadge(p.status)}>{p.status}</span></td><td><button onClick={() => showToast('✏️ Edit prospect')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, prospects: prev.prospects.filter(x => x.id !== p.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderLeads = useCallback(() => {
        const leads = data.leads;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-user-plus mr-2 text-blue-500"></i>Leads ({leads.length})</h2><button onClick={() => openLeadModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> New Lead</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Customer</th><th className="pb-3 text-left">Source</th><th className="pb-3 text-left">Status</th><th className="pb-3 text-left">BDE</th><th className="pb-3 text-left">Value</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{leads.map(l => (
                        <tr key={l.id}><td className="text-slate-800 font-medium">{l.customer}</td><td className="text-slate-700">{l.source}</td><td><span className={getStatusBadge(l.status)}>{l.status}</span></td><td className="text-slate-700">{l.assignedBDE || ''}</td><td className="text-slate-800">₹{formatNum(l.value)}</td><td><button onClick={() => showToast('✏️ Edit lead')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, leads: prev.leads.filter(x => x.id !== l.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderOpportunities = useCallback(() => {
        const opps = data.opportunities;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-chart-line mr-2 text-purple-500"></i>Opportunities ({opps.length})</h2><button onClick={() => openOpportunityModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> New Opportunity</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Customer</th><th className="pb-3 text-left">Product</th><th className="pb-3 text-left">Value</th><th className="pb-3 text-left">Probability</th><th className="pb-3 text-left">Stage</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{opps.map(o => (
                        <tr key={o.id}><td className="text-slate-800 font-medium">{o.customer}</td><td className="text-slate-700">{o.product}</td><td className="text-slate-800">₹{formatNum(o.value)}</td><td className="text-slate-800">{o.probability}%</td><td><span className={getStatusBadge(o.stage)}>{o.stage}</span></td><td><button onClick={() => showToast('✏️ Edit opportunity')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, opportunities: prev.opportunities.filter(x => x.id !== o.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderCustomers = useCallback(() => {
        const customers = data.customers;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-user mr-2 text-blue-500"></i>Customers ({customers.length})</h2><button onClick={() => showToast('✏️ Add customer (stub)')} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Add Customer</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Name</th><th className="pb-3 text-left">Contact</th><th className="pb-3 text-left">Revenue</th><th className="pb-3 text-left">Status</th><th className="pb-3 text-left">Next Visit</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{customers.map(c => (
                        <tr key={c.id}><td className="text-slate-800 font-medium">{c.name}</td><td className="text-slate-700">{c.contact}</td><td className="text-slate-800">₹{formatNum(c.revenue)}</td><td><span className={getStatusBadge(c.status)}>{c.status}</span></td><td className="text-slate-700">{c.nextFollowup || ''}</td><td><button onClick={() => showToast('✏️ Edit customer')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, customers: prev.customers.filter(x => x.id !== c.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
                    ))}</tbody></table></div>
            </div>
        );
    }, [data, updateData, showToast]);

    const renderMeetings = useCallback(() => {
        const meetings = data.meetings;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-calendar-check mr-2 text-purple-500"></i>Meetings ({meetings.length})</h2><button onClick={() => openMeetingModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Schedule Meeting</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Customer</th><th className="pb-3 text-left">Date</th><th className="pb-3 text-left">Location</th><th className="pb-3 text-left">Value</th><th className="pb-3 text-left">Outcome</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{meetings.map(m => (
                        <tr key={m.id}><td className="text-slate-800 font-medium">{m.customer}</td><td className="text-slate-700">{m.date}</td><td className="text-slate-700">{m.location}</td><td className="text-slate-800">₹{formatNum(m.opportunityValue)}</td><td><span className={getStatusBadge(m.outcome || 'Scheduled')}>{m.outcome || 'Scheduled'}</span></td><td><button onClick={() => showToast('✏️ Edit meeting')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, meetings: prev.meetings.filter(x => x.id !== m.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
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

    const renderIntelligence = useCallback(() => {
        const intel = data.intelligence;
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold text-lg text-slate-800"><i className="fa-regular fa-binoculars mr-2 text-blue-500"></i>Market Intelligence ({intel.length})</h2><button onClick={() => openIntelModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Add Intel</button></div>
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Competitor</th><th className="pb-3 text-left">Location</th><th className="pb-3 text-left">Product</th><th className="pb-3 text-left">Price</th><th className="pb-3 text-left">Date</th><th className="pb-3 text-left">Actions</th></tr></thead>
                    <tbody>{intel.map(i => (
                        <tr key={i.id}><td className="text-slate-800 font-medium">{i.competitor}</td><td className="text-slate-700">{i.location}</td><td className="text-slate-700">{i.product}</td><td className="text-slate-700">{i.priceInfo}</td><td className="text-slate-700">{i.dateCollected}</td><td><button onClick={() => showToast('✏️ Edit intel')} className="edit-btn mr-2"><i className="fa-regular fa-pen-to-square"></i></button><button onClick={() => { if (confirm('Delete?')) { updateData(prev => ({ ...prev, intelligence: prev.intelligence.filter(x => x.id !== i.id) })); showToast('🗑️ Deleted'); } }} className="delete-btn"><i className="fa-regular fa-trash-can"></i></button></td></tr>
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
                <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-3 text-left">Date</th><th className="pb-3 text-left">Visits</th><th className="pb-3 text-left">Customers</th><th className="pb-3 text-left">Prospects</th><th className="pb-3 text-left">Leads</th><th className="pb-3 text-left">Revenue</th><th className="pb-3 text-left">Status</th></tr></thead>
                    <tbody>{reports.map(r => (
                        <tr key={r.date + r.employee}><td className="text-slate-700">{r.date}</td><td className="text-slate-700">{r.completedVisits}</td><td className="text-slate-700">{r.customerVisits}</td><td className="text-slate-700">{r.prospectVisits}</td><td className="text-slate-700">{r.newLeads}</td><td className="text-slate-800">₹{formatNum(r.expectedRevenue)}</td><td><span className={getStatusBadge(r.status)}>{r.status}</span></td></tr>
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><p className="text-xs text-slate-500">Monthly Allowance</p><h3 className="text-2xl font-bold text-slate-800">₹15,000</h3></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><p className="text-xs text-slate-500">Spent</p><h3 className="text-2xl font-bold text-slate-800">₹{formatNum(total)}</h3></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><p className="text-xs text-slate-500">Pending Claims</p><h3 className="text-2xl font-bold text-amber-600">{pending}</h3></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><p className="text-xs text-slate-500">Remaining</p><h3 className="text-2xl font-bold text-emerald-600">₹{formatNum(15000 - total)}</h3></div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mt-4">
                    <div className="flex items-center justify-between"><h3 className="font-bold text-sm text-slate-800">Expense Entries</h3><button onClick={() => openExpenseModal()} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><i className="fa-regular fa-plus"></i> Add Expense</button></div>
                    <div className="overflow-x-auto mt-2"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b"><th className="pb-2 text-left">Date</th><th className="pb-2 text-left">Type</th><th className="pb-2 text-left">Amount</th><th className="pb-2 text-left">Customer</th><th className="pb-2 text-left">GPS</th><th className="pb-2 text-left">Status</th></tr></thead>
                        <tbody>{expenses.map(e => (
                            <tr key={e.id}><td className="text-slate-700">{e.date}</td><td className="text-slate-700">{e.expenseType}</td><td className="text-slate-800">₹{formatNum(e.amount)}</td><td className="text-slate-700">{e.customer}</td><td className="text-slate-700">{e.gps ? '📍' : ''}</td><td><span className={getStatusBadge(e.status)}>{e.status}</span></td></tr>
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
                    <h3 className="font-bold text-sm text-slate-800">BDO Performance Score</h3>
                    <div className="flex items-center justify-center mt-4">
                        <div className="progress-ring" style={{ '--color': '#0f7b5a', '--pct': `${s.bdoPerformance}%` }}>
                            <div className="bg"></div>
                            <div className="inner">{s.bdoPerformance}%</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                        <div><span className="text-slate-500">Verified Visits:</span> <span className="font-semibold text-slate-800">{s.verifiedVisits}</span></div>
                        <div><span className="text-slate-500">Territory Coverage:</span> <span className="font-semibold text-slate-800">{s.territoryCoverage}%</span></div>
                        <div><span className="text-slate-500">Lead Generation:</span> <span className="font-semibold text-slate-800">{s.newLeads}</span></div>
                        <div><span className="text-slate-500">Revenue Contribution:</span> <span className="font-semibold text-slate-800">₹{formatNum(s.businessGenerated)}</span></div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-800">Visit Quality</h3>
                    <div className="space-y-2 mt-2 text-sm">
                        <div className="flex justify-between border-b pb-1"><span className="text-slate-500">Total Visits</span><span className="text-slate-800 font-semibold">{s.plannedVisits}</span></div>
                        <div className="flex justify-between border-b pb-1"><span className="text-slate-500">Verified</span><span className="text-emerald-600 font-semibold">{s.verifiedVisits}</span></div>
                        <div className="flex justify-between border-b pb-1"><span className="text-slate-500">With GPS</span><span className="text-slate-800 font-semibold">{data.visits.filter(v => v.gps).length}</span></div>
                        <div className="flex justify-between border-b pb-1"><span className="text-slate-500">With Photo</span><span className="text-slate-800 font-semibold">{data.visits.filter(v => v.livePhoto).length}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Quality Score</span><span className="font-bold text-slate-800">{s.bdoPerformance}%</span></div>
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
                    <div className="flex items-start gap-3 border-b pb-3"><span className="status-badge critical">Critical</span><div><p className="font-medium text-slate-800">{data.visits.filter(v => !v.verified).length} visits pending verification</p><p className="text-xs text-slate-500">GPS or photo evidence missing</p></div></div>
                    <div className="flex items-start gap-3 border-b pb-3"><span className="status-badge warning">Warning</span><div><p className="font-medium text-slate-800">Territory coverage at {s.territoryCoverage}%</p><p className="text-xs text-slate-500">3 areas still uncovered</p></div></div>
                    <div className="flex items-start gap-3 border-b pb-3"><span className="status-badge warning">Warning</span><div><p className="font-medium text-slate-800">{overdueFollowups.length} overdue follow-ups</p><p className="text-xs text-slate-500">Follow-up for {overdueFollowups.map(f => f.customer).join(', ')}</p></div></div>
                    <div className="flex items-start gap-3"><span className="status-badge positive">Positive</span><div><p className="font-medium text-slate-800">{s.completedVisits} visits completed this week</p><p className="text-xs text-slate-500">Keep up the momentum</p></div></div>
                </div>
            </div>
        );
    }, [data]);

    // ---- Modal Generators ----
    const openVisitModal = () => {
        const today = new Date().toISOString().slice(0, 10);
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Record Visit</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Customer</label><input id="visitCustomer" placeholder="Customer name" /></div><div><label>Business Name</label><input id="visitBusiness" placeholder="Business name" /></div></div>
                <div className="form-row"><div><label>Contact</label><input id="visitContact" placeholder="Contact person" /></div><div><label>Mobile</label><input id="visitMobile" placeholder="Mobile" /></div></div>
                <div className="form-row"><div><label>Date</label><input type="date" id="visitDate" defaultValue={today} /></div><div><label>Start Time</label><input type="time" id="visitStart" defaultValue="10:00" /></div></div>
                <div className="form-row"><div><label>End Time</label><input type="time" id="visitEnd" defaultValue="11:00" /></div><div><label>Location</label><input id="visitLocation" placeholder="Location" /></div></div>
                <div className="form-row"><div><label>GPS (lat,lng)</label><input id="visitGps" placeholder="e.g. 19.0760,72.8777" /></div><div><label>Distance (km)</label><input type="number" id="visitDistance" defaultValue="5" /></div></div>
                <label>Purpose</label><input id="visitPurpose" placeholder="Visit purpose" />
                <label>Discussion</label><textarea id="visitDiscussion" rows="2"></textarea>
                <div className="form-row"><div><label>Outcome</label><select id="visitOutcome"><option>Positive</option><option>Interested</option><option>Follow-up</option><option>Not Interested</option></select></div><div><label>Status</label><select id="visitStatus"><option>Completed</option><option>Pending</option><option>Scheduled</option><option>Missed</option></select></div></div>
                <div className="form-row"><div><label>Next Action</label><input id="visitNextAction" placeholder="Next action" /></div><div><label>Follow-up Date</label><input type="date" id="visitFollowup" defaultValue={tomorrow} /></div></div>
                <label>Remarks</label><textarea id="visitRemarks" rows="2"></textarea>
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const visit = {
                        id: Date.now(),
                        customer: document.getElementById('visitCustomer').value || 'Customer',
                        businessName: document.getElementById('visitBusiness').value || '',
                        contact: document.getElementById('visitContact').value || '',
                        mobile: document.getElementById('visitMobile').value || '',
                        date: document.getElementById('visitDate').value || today,
                        startTime: document.getElementById('visitStart').value || '10:00',
                        endTime: document.getElementById('visitEnd').value || '11:00',
                        location: document.getElementById('visitLocation').value || '',
                        gps: document.getElementById('visitGps').value || '',
                        distance: parseFloat(document.getElementById('visitDistance').value) || 0,
                        livePhoto: '',
                        purpose: document.getElementById('visitPurpose').value || '',
                        discussion: document.getElementById('visitDiscussion').value || '',
                        outcome: document.getElementById('visitOutcome').value || 'Positive',
                        nextAction: document.getElementById('visitNextAction').value || '',
                        followupDate: document.getElementById('visitFollowup').value || '',
                        remarks: document.getElementById('visitRemarks').value || '',
                        status: document.getElementById('visitStatus').value || 'Completed',
                        verified: !!document.getElementById('visitGps').value
                    };
                    updateData(prev => ({ ...prev, visits: [...prev.visits, visit] }));
                    showToast('✅ Visit recorded');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Record</button></div>
            </div>
        );
    };

    const openProspectModal = () => {
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">New Prospect</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Business Name</label><input id="prospectBusiness" placeholder="Business name" /></div><div><label>Contact</label><input id="prospectContact" placeholder="Contact person" /></div></div>
                <div className="form-row"><div><label>Mobile</label><input id="prospectMobile" placeholder="Mobile" /></div><div><label>Email</label><input id="prospectEmail" placeholder="Email" /></div></div>
                <div className="form-row"><div><label>Location</label><input id="prospectLocation" placeholder="Location" /></div><div><label>Industry</label><input id="prospectIndustry" placeholder="Industry" /></div></div>
                <div className="form-row"><div><label>Business Type</label><input id="prospectType" placeholder="e.g. Gallery, Retail" /></div><div><label>Estimated Value</label><input type="number" id="prospectValue" placeholder="0" /></div></div>
                <label>Requirement</label><textarea id="prospectRequirement" rows="2"></textarea>
                <div className="form-row"><div><label>Opportunity Level</label><select id="prospectLevel"><option>High</option><option>Medium</option><option>Low</option></select></div><div><label>Status</label><select id="prospectStatus"><option>New</option><option>Contacted</option><option>Qualified</option><option>Lost</option></select></div></div>
                <label>Next Follow-up</label><input type="date" id="prospectFollowup" defaultValue={tomorrow} />
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const prospect = {
                        id: Date.now(),
                        businessName: document.getElementById('prospectBusiness').value || 'New Business',
                        contact: document.getElementById('prospectContact').value || '',
                        mobile: document.getElementById('prospectMobile').value || '',
                        email: document.getElementById('prospectEmail').value || '',
                        location: document.getElementById('prospectLocation').value || '',
                        gps: '',
                        industry: document.getElementById('prospectIndustry').value || '',
                        businessType: document.getElementById('prospectType').value || '',
                        estimatedValue: parseFloat(document.getElementById('prospectValue').value) || 0,
                        requirement: document.getElementById('prospectRequirement').value || '',
                        currentProvider: '',
                        competitor: '',
                        opportunityLevel: document.getElementById('prospectLevel').value || 'Medium',
                        assignedBDO: data.user.name,
                        assignedBDE: '',
                        status: document.getElementById('prospectStatus').value || 'New',
                        nextFollowup: document.getElementById('prospectFollowup').value || '',
                    };
                    updateData(prev => ({ ...prev, prospects: [...prev.prospects, prospect] }));
                    showToast('✅ Prospect created');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Create</button></div>
            </div>
        );
    };

    const openLeadModal = () => {
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">New Lead</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Customer</label><input id="leadCustomer" placeholder="Customer name" /></div><div><label>Source</label><select id="leadSource"><option>Field Visit</option><option>Market Survey</option><option>Referral</option><option>Existing Customer</option><option>Business Directory</option><option>Other</option></select></div></div>
                <div className="form-row"><div><label>BDE Assignment</label><input id="leadBDE" placeholder="BDE name (optional)" /></div><div><label>Value</label><input type="number" id="leadValue" placeholder="0" /></div></div>
                <label>Status</label><select id="leadStatus"><option>New</option><option>Contacted</option><option>Qualified</option><option>Meeting</option><option>Proposal</option><option>Negotiation</option><option>Won</option><option>Lost</option></select>
                <label>Next Follow-up</label><input type="date" id="leadFollowup" defaultValue={tomorrow} />
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const lead = {
                        id: Date.now(),
                        customer: document.getElementById('leadCustomer').value || 'New Lead',
                        source: document.getElementById('leadSource').value || 'Other',
                        status: document.getElementById('leadStatus').value || 'New',
                        assignedBDO: data.user.name,
                        assignedBDE: document.getElementById('leadBDE').value || '',
                        value: parseFloat(document.getElementById('leadValue').value) || 0,
                        created: new Date().toISOString().slice(0, 10),
                        nextFollowup: document.getElementById('leadFollowup').value || '',
                    };
                    updateData(prev => ({ ...prev, leads: [...prev.leads, lead] }));
                    showToast('✅ Lead created');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Create</button></div>
            </div>
        );
    };

    const openOpportunityModal = () => {
        const thirtyDays = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">New Opportunity</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Customer</label><input id="oppCustomer" placeholder="Customer name" /></div><div><label>Product/Service</label><input id="oppProduct" placeholder="Product" /></div></div>
                <div className="form-row"><div><label>Value</label><input type="number" id="oppValue" placeholder="0" /></div><div><label>Probability %</label><input type="number" id="oppProbability" defaultValue="50" /></div></div>
                <div className="form-row"><div><label>Expected Closing</label><input type="date" id="oppClosing" defaultValue={thirtyDays} /></div><div><label>Stage</label><select id="oppStage"><option>New</option><option>Proposal</option><option>Negotiation</option><option>Won</option><option>Lost</option></select></div></div>
                <label>Decision Maker</label><input id="oppDecision" placeholder="Decision maker" />
                <label>Next Action</label><input id="oppNext" placeholder="Next action" />
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const opp = {
                        id: Date.now(),
                        customer: document.getElementById('oppCustomer').value || 'Customer',
                        product: document.getElementById('oppProduct').value || '',
                        value: parseFloat(document.getElementById('oppValue').value) || 0,
                        probability: parseFloat(document.getElementById('oppProbability').value) || 50,
                        expectedClosing: document.getElementById('oppClosing').value || '',
                        decisionMaker: document.getElementById('oppDecision').value || '',
                        competitor: '',
                        stage: document.getElementById('oppStage').value || 'New',
                        nextAction: document.getElementById('oppNext').value || '',
                        owner: data.user.name,
                        status: 'Active'
                    };
                    updateData(prev => ({ ...prev, opportunities: [...prev.opportunities, opp] }));
                    showToast('✅ Opportunity created');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Create</button></div>
            </div>
        );
    };

    const openFollowupModal = () => {
        const today = new Date().toISOString().slice(0, 10);
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Add Follow-up</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Customer</label><input id="fupCustomer" placeholder="Customer name" /></div><div><label>Lead</label><input id="fupLead" placeholder="Lead name (optional)" /></div></div>
                <div className="form-row"><div><label>Date</label><input type="date" id="fupDate" defaultValue={today} /></div><div><label>Time</label><input type="time" id="fupTime" defaultValue="10:00" /></div></div>
                <label>Method</label><select id="fupMethod"><option>Call</option><option>Email</option><option>WhatsApp</option><option>In-person</option><option>Other</option></select>
                <label>Discussion</label><textarea id="fupDiscussion" rows="2"></textarea>
                <label>Response</label><textarea id="fupResponse" rows="2"></textarea>
                <div className="form-row"><div><label>Next Action</label><input id="fupNextAction" placeholder="Next action" /></div><div><label>Next Follow-up</label><input type="date" id="fupNextDate" defaultValue={tomorrow} /></div></div>
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const fup = {
                        id: Date.now(),
                        lead: document.getElementById('fupLead').value || '',
                        customer: document.getElementById('fupCustomer').value || 'Customer',
                        contact: '',
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

    const openSurveyModal = () => {
        const today = new Date().toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Market Survey</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Area</label><input id="surveyArea" placeholder="Area" /></div><div><label>Location</label><input id="surveyLocation" placeholder="Location" /></div></div>
                <label>Business Name</label><input id="surveyBusiness" placeholder="Business name" />
                <div className="form-row"><div><label>Category</label><input id="surveyCategory" placeholder="e.g. Art Gallery" /></div><div><label>Contact</label><input id="surveyContact" placeholder="Contact person" /></div></div>
                <div className="form-row"><div><label>Mobile</label><input id="surveyMobile" placeholder="Mobile" /></div><div><label>Estimated Size</label><select id="surveySize"><option>Small</option><option>Medium</option><option>Large</option></select></div></div>
                <div className="form-row"><div><label>Customer Potential</label><select id="surveyPotential"><option>High</option><option>Medium</option><option>Low</option></select></div><div><label>Opportunity Potential</label><select id="surveyOpportunity"><option>High</option><option>Medium</option><option>Low</option></select></div></div>
                <label>GPS</label><input id="surveyGps" placeholder="lat,lng" />
                <label>Remarks</label><textarea id="surveyRemarks" rows="2"></textarea>
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const survey = {
                        id: Date.now(),
                        area: document.getElementById('surveyArea').value || '',
                        location: document.getElementById('surveyLocation').value || '',
                        businessName: document.getElementById('surveyBusiness').value || 'New Business',
                        businessCategory: document.getElementById('surveyCategory').value || '',
                        contactPerson: document.getElementById('surveyContact').value || '',
                        mobile: document.getElementById('surveyMobile').value || '',
                        estimatedBusinessSize: document.getElementById('surveySize').value || 'Medium',
                        customerPotential: document.getElementById('surveyPotential').value || 'Medium',
                        currentProvider: '',
                        competitor: '',
                        competitorPricing: '',
                        customerRequirement: '',
                        opportunityPotential: document.getElementById('surveyOpportunity').value || 'Medium',
                        photo: '',
                        gps: document.getElementById('surveyGps').value || '',
                        surveyDate: today,
                        remarks: document.getElementById('surveyRemarks').value || '',
                        status: 'Completed'
                    };
                    updateData(prev => ({ ...prev, surveys: [...prev.surveys, survey] }));
                    showToast('📋 Survey submitted');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Submit</button></div>
            </div>
        );
    };

    const openDailyReportModal = () => {
        const today = new Date().toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Submit Daily Report</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Date</label><input type="date" id="reportDate" defaultValue={today} /></div><div><label>Territory</label><input id="reportTerritory" defaultValue={data.user.territory} /></div></div>
                <div className="form-row"><div><label>Areas Covered</label><input id="reportAreas" placeholder="Areas" /></div><div><label>Planned Visits</label><input type="number" id="reportPlanned" defaultValue="0" /></div></div>
                <div className="form-row"><div><label>Completed Visits</label><input type="number" id="reportCompleted" defaultValue="0" /></div><div><label>Customer Visits</label><input type="number" id="reportCustomerVisits" defaultValue="0" /></div></div>
                <div className="form-row"><div><label>Prospect Visits</label><input type="number" id="reportProspectVisits" defaultValue="0" /></div><div><label>New Prospects</label><input type="number" id="reportNewProspects" defaultValue="0" /></div></div>
                <div className="form-row"><div><label>New Leads</label><input type="number" id="reportNewLeads" defaultValue="0" /></div><div><label>Meetings</label><input type="number" id="reportMeetings" defaultValue="0" /></div></div>
                <div className="form-row"><div><label>Follow-ups</label><input type="number" id="reportFollowups" defaultValue="0" /></div><div><label>Business Opportunities</label><input type="number" id="reportOpportunities" defaultValue="0" /></div></div>
                <div className="form-row"><div><label>Expected Revenue</label><input type="number" id="reportRevenue" defaultValue="0" /></div><div><label>Status</label><select id="reportStatus"><option>Submitted</option><option>Pending</option></select></div></div>
                <label>Competitor Findings</label><textarea id="reportCompetitor" rows="2"></textarea>
                <label>Market Findings</label><textarea id="reportMarket" rows="2"></textarea>
                <label>Problems/Challenges</label><textarea id="reportProblems" rows="2"></textarea>
                <label>Tomorrow's Plan</label><textarea id="reportPlan" rows="2"></textarea>
                <label>Remarks</label><textarea id="reportRemarks" rows="2"></textarea>
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const report = {
                        date: document.getElementById('reportDate').value || today,
                        employee: data.user.name,
                        territory: document.getElementById('reportTerritory').value || data.user.territory,
                        areasCovered: document.getElementById('reportAreas').value || '',
                        plannedVisits: parseInt(document.getElementById('reportPlanned').value) || 0,
                        completedVisits: parseInt(document.getElementById('reportCompleted').value) || 0,
                        customerVisits: parseInt(document.getElementById('reportCustomerVisits').value) || 0,
                        prospectVisits: parseInt(document.getElementById('reportProspectVisits').value) || 0,
                        newProspects: parseInt(document.getElementById('reportNewProspects').value) || 0,
                        newLeads: parseInt(document.getElementById('reportNewLeads').value) || 0,
                        meetings: parseInt(document.getElementById('reportMeetings').value) || 0,
                        followups: parseInt(document.getElementById('reportFollowups').value) || 0,
                        businessOpportunities: parseInt(document.getElementById('reportOpportunities').value) || 0,
                        expectedRevenue: parseFloat(document.getElementById('reportRevenue').value) || 0,
                        competitorFindings: document.getElementById('reportCompetitor').value || '',
                        marketFindings: document.getElementById('reportMarket').value || '',
                        problems: document.getElementById('reportProblems').value || '',
                        supportRequired: '',
                        tomorrowPlan: document.getElementById('reportPlan').value || '',
                        remarks: document.getElementById('reportRemarks').value || '',
                        status: document.getElementById('reportStatus').value || 'Submitted'
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
                <label>Amount</label><input type="number" id="expAmount" defaultValue="0" />
                <label>Customer/Prospect</label><input id="expCustomer" placeholder="Customer name" />
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
                        visitId: 0,
                        customer: document.getElementById('expCustomer').value || '',
                        location: document.getElementById('expLocation').value || '',
                        gps: document.getElementById('expGps').value || '',
                        receipt: '',
                        livePhoto: '',
                        remarks: document.getElementById('expRemarks').value || '',
                        status: 'Pending'
                    };
                    updateData(prev => ({ ...prev, travelExpenses: [...prev.travelExpenses, exp] }));
                    showToast('🧾 Expense added');
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
                <div className="form-row"><div><label>Priority</label><select id="taskPriority"><option>High</option><option>Medium</option><option>Low</option></select></div><div><label>Category</label><input id="taskCategory" placeholder="e.g. Visit, Survey" /></div></div>
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

    const openIntelModal = () => {
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Add Market Intelligence</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <div className="form-row"><div><label>Competitor</label><input id="intelCompetitor" placeholder="Competitor name" /></div><div><label>Location</label><input id="intelLocation" placeholder="Location" /></div></div>
                <div className="form-row"><div><label>Product/Service</label><input id="intelProduct" placeholder="Product" /></div><div><label>Price Info</label><input id="intelPrice" placeholder="Price" /></div></div>
                <label>Offer</label><input id="intelOffer" placeholder="Offer details" />
                <label>Customer Feedback</label><textarea id="intelFeedback" rows="2"></textarea>
                <label>Strengths</label><input id="intelStrengths" placeholder="Strengths" />
                <label>Weaknesses</label><input id="intelWeaknesses" placeholder="Weaknesses" />
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const intel = {
                        id: Date.now(),
                        competitor: document.getElementById('intelCompetitor').value || 'Competitor',
                        location: document.getElementById('intelLocation').value || '',
                        product: document.getElementById('intelProduct').value || '',
                        priceInfo: document.getElementById('intelPrice').value || '',
                        offer: document.getElementById('intelOffer').value || '',
                        customerFeedback: document.getElementById('intelFeedback').value || '',
                        strengths: document.getElementById('intelStrengths').value || '',
                        weaknesses: document.getElementById('intelWeaknesses').value || '',
                        marketPosition: '',
                        photos: '',
                        dateCollected: new Date().toISOString().slice(0, 10),
                        remarks: ''
                    };
                    updateData(prev => ({ ...prev, intelligence: [...prev.intelligence, intel] }));
                    showToast('🔍 Market intelligence added');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Add</button></div>
            </div>
        );
    };

    const openMeetingModal = () => {
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        openModal(
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Schedule Meeting</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button></div>
                <label>Customer</label><input id="meetingCustomer" placeholder="Customer name" />
                <div className="form-row"><div><label>Date</label><input type="date" id="meetingDate" defaultValue={tomorrow} /></div><div><label>Time</label><input type="time" id="meetingTime" defaultValue="14:00" /></div></div>
                <label>Location</label><input id="meetingLocation" placeholder="Location" />
                <label>Participants</label><input id="meetingParticipants" placeholder="Participants" />
                <label>Purpose</label><textarea id="meetingPurpose" rows="2"></textarea>
                <label>Opportunity Value</label><input type="number" id="meetingValue" placeholder="0" />
                <label>GPS</label><input id="meetingGps" placeholder="lat,lng" />
                <div className="mt-6 flex gap-3 justify-end"><button onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button><button onClick={() => {
                    const meeting = {
                        id: Date.now(),
                        customer: document.getElementById('meetingCustomer').value || 'Customer',
                        date: document.getElementById('meetingDate').value || tomorrow,
                        time: document.getElementById('meetingTime').value || '14:00',
                        location: document.getElementById('meetingLocation').value || '',
                        participants: document.getElementById('meetingParticipants').value || '',
                        purpose: document.getElementById('meetingPurpose').value || '',
                        discussion: '',
                        opportunityValue: parseFloat(document.getElementById('meetingValue').value) || 0,
                        outcome: 'Scheduled',
                        nextAction: '',
                        followupDate: '',
                        gps: document.getElementById('meetingGps').value || '',
                        livePhoto: ''
                    };
                    updateData(prev => ({ ...prev, meetings: [...prev.meetings, meeting] }));
                    showToast('📅 Meeting scheduled');
                    closeModal();
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Schedule</button></div>
            </div>
        );
    };

    // ---- Quick Actions ----
    const quickAction = (action) => {
        if (action === 'Record Visit') openVisitModal();
        else if (action === 'New Prospect') openProspectModal();
        else if (action === 'New Lead') openLeadModal();
        else if (action === 'Schedule Meeting') openMeetingModal();
        else if (action === 'Add Follow-up') openFollowupModal();
        else if (action === 'Market Survey') openSurveyModal();
        else if (action === 'Submit Daily Report') openDailyReportModal();
        else if (action === 'Add Expense') openExpenseModal();
        else showToast('⚡ ' + action);
    };

    const drill = (label) => {
        if (label.includes('Visit')) navigateTo('visits');
        else if (label.includes('Territory')) navigateTo('territory');
        else if (label.includes('Prospect')) navigateTo('prospects');
        else if (label.includes('Lead')) navigateTo('leads');
        else if (label.includes('Opportunity')) navigateTo('opportunities');
        else if (label.includes('Customer')) navigateTo('customers');
        else if (label.includes('Meeting')) navigateTo('meetings');
        else if (label.includes('Follow-up')) navigateTo('followups');
        else if (label.includes('Survey')) navigateTo('surveys');
        else if (label.includes('Task')) navigateTo('tasks');
        else if (label.includes('Performance')) navigateTo('performance');
        else if (label.includes('Revenue') || label.includes('Target') || label.includes('Business')) navigateTo('performance');
        else showToast('🔍 Drilling into: ' + label);
    };

    // ---- Page Render ----
    const renderPage = useCallback(() => {
        switch (currentPage) {
            case 'dashboard': return renderDashboard();
            case 'visits': return renderVisits();
            case 'territory': return renderTerritory();
            case 'surveys': return renderSurveys();
            case 'prospects': return renderProspects();
            case 'leads': return renderLeads();
            case 'opportunities': return renderOpportunities();
            case 'customers': return renderCustomers();
            case 'meetings': return renderMeetings();
            case 'followups': return renderFollowups();
            case 'intelligence': return renderIntelligence();
            case 'tasks': return renderTasks();
            case 'daily-report': return renderDailyReport();
            case 'travel': return renderTravel();
            case 'performance': return renderPerformance();
            case 'alerts': return renderAlerts();
            default: return renderDashboard();
        }
    }, [currentPage, renderDashboard, renderVisits, renderTerritory, renderSurveys, renderProspects,
        renderLeads, renderOpportunities, renderCustomers, renderMeetings, renderFollowups,
        renderIntelligence, renderTasks, renderDailyReport, renderTravel, renderPerformance, renderAlerts]);

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
        <div className="bdo-app-container">
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
                .bdo-app-container {
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
                    max-width: 660px;
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
                .status-badge.verified { background: #dcfce7; color: #166534; }
                .status-badge.high { background: #dcfce7; color: #166534; }
                .status-badge.medium { background: #fef3c7; color: #92400e; }
                .status-badge.low { background: #fee2e2; color: #991b1b; }
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
                    .bdo-app-container .w-64 { width: 240px; position: fixed; transform: translateX(-100%); transition: transform 0.3s; z-index: 100; }
                    .bdo-app-container .w-64.open { transform: translateX(0); }
                    .bdo-app-container .ml-64 { margin-left: 0; }
                    .bdo-app-container .w-80 { width: 100%; }
                    .bdo-app-container .grid-cols-8 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                }
                .backdrop { display: none; position: fixed; inset: 0; background: rgba(10,46,31,0.3); z-index: 90; }
                .backdrop.open { display: block; }
                .hamburger { display: none; background: none; border: none; font-size: 22px; color: #0a2e1f; cursor: pointer; padding: 4px 8px; border-radius: 10px; }
                @media (max-width: 768px) { .hamburger { display: block; } }
            `}</style>

            {/* Sidebar */}
            <aside id="sidebar" className={`w-64 bg-[#0b1f16] text-white/80 flex flex-col shrink-0 h-full border-r border-[#1a3a2e] fixed inset-y-0 left-0 z-50 ${sidebarOpen ? 'open' : ''}`}>
                <div className="px-5 py-5 border-b border-[#1a3a2e] flex items-center gap-3 shrink-0">
                    <i className="fa-solid fa-route text-green-400 text-xl"></i>
                    <span className="text-white font-bold tracking-tight">ePay <span className="text-green-300">·</span> BDO</span>
                    <span className="ml-auto text-[10px] bg-green-600/30 text-green-200 px-2 py-0.5 rounded-full">v1</span>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-5 text-sm overflow-y-auto sidebar-nav">
                    {renderSidebarItems()}
                </nav>
                <div className="p-4 border-t border-[#1a3a2e] text-xs text-slate-400 flex items-center gap-3 shrink-0">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full" alt="profile" />
                    <div>
                        <p className="text-white text-sm font-medium">{userName}</p>
                        <p className="text-[10px] text-green-300">BDO</p>
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
                            <input id="globalSearch" type="text" placeholder="Search visits, prospects, customers..." className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500 transition text-slate-800"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => {
                            setUserName(userName === 'Meena' ? 'Admin' : 'Meena');
                            showToast('🔄 Switched to ' + (userName === 'Meena' ? 'Admin' : 'BDO'));
                        }} className="flex items-center gap-2 border border-slate-200 hover:bg-green-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition text-slate-700">
                            <i className="fa-solid fa-arrow-right-arrow-left text-green-600"></i> Switch
                        </button>
                        <div className="relative">
                            <button onClick={() => {
                                if (notifCount > 0) { setNotifCount(0); showToast('🔔 Notifications cleared'); } else showToast('🔔 No new notifications');
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

export default App;
