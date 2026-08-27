'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { useAuth } from '@/lib/auth-context';



// ================================================================
// DYNAMIC DATA STORE & PERSISTENCE
// ================================================================
const STORAGE_KEY = 'epay_ceo_crm_v4';

const defaultData = () => ({
    user: {
        name: 'Vivek Patil',
        role: 'Chief Executive Officer (CEO)',
        company: 'ePay Gallery India',
        avatar: 'VP',
        email: 'ceo@epaygallery.com',
    },
    businessHealth: 92,
    breadcrumbPath: ['India', 'Maharashtra', 'Pune', 'Pune Central', 'EPG-PUNE-009'],

    // Today Priorities (Section 25 Checkbox list)
    priorities: [
        { id: 'prio-1', text: 'Pune Gallery Review', done: false },
        { id: 'prio-2', text: 'Finance Approval', done: false },
        { id: 'prio-3', text: 'CTO Meeting', done: true },
        { id: 'prio-4', text: 'Franchise Review', done: false }
    ],

    // Action Required (Section 4)
    actionRequired: [
        { id: 'ACT-001', severity: 'critical', category: 'Sales Failure', title: 'Pune Gallery sales 25% below monthly target', desc: 'Current: ₹22.5L vs Target: ₹30L. District Manager intervention required.', gallery: 'Pune Central', dept: 'Sales', date: '2026-08-25', status: 'Pending' },
        { id: 'ACT-002', severity: 'critical', category: 'Financial Anomaly', title: '₹12.5L payment overdue from Zenith Enterprises', desc: 'Overdue by 45 days. Legal notification pending.', gallery: 'Mumbai East', dept: 'Finance', date: '2026-08-24', status: 'Pending' },
        { id: 'ACT-003', severity: 'critical', category: 'Customer Complaint', title: 'Critical customer complaint unresolved for 72 hours', desc: 'High-value customer #CUST-9921 reporting service failure.', gallery: 'Pune Central', dept: 'Customer Ops', date: '2026-08-25', status: 'Pending' },
        { id: 'ACT-004', severity: 'critical', category: 'System Failure', title: 'Payment API Gateway downtime on Gallery POS', desc: 'Intermittent failure in Southern Region galleries.', gallery: 'Kochi', dept: 'Technology', date: '2026-08-25', status: 'Pending' },
        { id: 'ACT-005', severity: 'important', category: 'Franchise Agreement', title: 'Major Franchise agreement approval pending for Nashik North', desc: 'Investment value ₹35L. Legal clearance completed.', gallery: 'Nashik', dept: 'Franchise', date: '2026-08-23', status: 'Pending' },
        { id: 'ACT-006', severity: 'important', category: 'Budget Variance', title: 'Marketing campaign spend ₹2.4L above allocated budget', desc: 'Performance Marketing team exceeded digital spend threshold.', gallery: 'HQ', dept: 'Marketing', date: '2026-08-24', status: 'Pending' },
        { id: 'ACT-007', severity: 'attention', category: 'Task Overdue', title: 'Weekly Strategy Report pending from District Manager (Gujarat)', desc: 'Report deadline was yesterday 6:00 PM.', gallery: 'Ahmedabad', dept: 'Operations', date: '2026-08-24', status: 'Pending' },
    ],

    // CEO Commands (Section 5)
    commands: [
        { id: 'CEO-00241', title: 'Increase Pune Gallery monthly revenue to ₹35,00,000', description: 'Implement targeted B2B corporate sales and launch local digital marketing campaign.', department: 'Sales & Operations', gallery: 'Pune Central', location: 'Pune, Maharashtra', assignedTo: 'District Manager (Rajesh Varma)', supportingTeam: ['Gallery Manager (Priya S.)', 'Marketing Head (Sunil K.)'], priority: 'Critical', startDate: '2026-08-01', deadline: '2026-08-31', expectedOutcome: '₹35,00,000 Gross Revenue', kpi: 'Monthly Revenue Achievement %', docs: ['pune_growth_plan.pdf'], notes: 'CEO direct directive.', followUpDate: '2026-08-28', escalationDate: '2026-08-30', status: 'In Progress', progress: 68 },
        { id: 'CEO-00240', title: 'Audit and resolve high-value overdue receivables above ₹5L', description: 'Direct collection drive targeting top 10 commercial receivables.', department: 'Finance', gallery: 'Company-Wide', location: 'National', assignedTo: 'CFO (Anil Deshmukh)', supportingTeam: ['Accounts Manager'], priority: 'Critical', startDate: '2026-08-10', deadline: '2026-08-27', expectedOutcome: 'Recover minimum ₹45L overdue', kpi: 'Receivables Outstanding Reduction %', docs: ['aging_report_aug.pdf'], notes: 'Zero tolerance.', followUpDate: '2026-08-26', escalationDate: '2026-08-27', status: 'In Progress', progress: 82 },
    ],

    // CEO Task Control (Section 6 & 16)
    tasks: [
        { id: 'TSK-101', title: 'Review & Approve FY27 Q3 Marketing Budget (₹45L)', desc: 'Detailed campaign wise split.', priority: 'High', category: 'Finance', startDate: '2026-08-25', dueDate: '2026-08-25', dueTime: '14:00', duration: '45 mins', dept: 'Marketing', assignedTo: 'CMO', gallery: 'HQ', customer: 'N/A', meetingId: 'MTG-002', commandId: 'CEO-00241', project: 'Q3 Strategy', reminder: '30 mins before', repeat: 'None', status: 'In Progress', cancellationReason: '' },
        { id: 'TSK-102', title: 'Conduct Performance Review with District Manager Pune', desc: 'Focus on revenue shortfall.', priority: 'Critical', category: 'Management', startDate: '2026-08-25', dueDate: '2026-08-25', dueTime: '15:30', duration: '60 mins', dept: 'Operations', assignedTo: 'DM Pune', gallery: 'Pune Central', customer: 'N/A', meetingId: 'MTG-003', commandId: 'CEO-00241', project: 'Operations Alignment', reminder: '15 mins before', repeat: 'None', status: 'Not Started', cancellationReason: '' },
        { id: 'TSK-103', title: 'Approve Franchise Agreement for Nashik Location #4', desc: 'Verify background check report.', priority: 'High', category: 'Franchise', startDate: '2026-08-25', dueDate: '2026-08-25', dueTime: '17:00', duration: '30 mins', dept: 'Franchise', assignedTo: 'Franchise Head', gallery: 'Nashik', customer: 'Franchise Lead #412', meetingId: 'N/A', commandId: 'N/A', project: 'Franchise Growth', reminder: '10 mins before', repeat: 'None', status: 'Completed', cancellationReason: '' },
    ],

    // 🤝 CEO MEETINGS MODULE (Sections 2 - 15)
    meetings: [
        { id: 'MTG-00218', title: 'Marketing Strategy Review', type: 'Strategy', date: '2026-08-25', startTime: '10:00', endTime: '11:00', duration: '60 mins', location: 'CEO Office', room: 'Conference Hall A', link: 'https://epay.zoom.us/j/strategy', organizer: 'Vivek Patil', createdDate: '2026-08-22', status: 'Scheduled', priority: '🔴 Critical', participants: [{ name: 'Suresh Kumar', company: 'ePay', designation: 'CMO', phone: '9876543210', email: 'cmo@epay.com', type: 'Internal' }], agenda: { objective: 'Approve festive season brand campaign assets', topics: 'Billboard allocation, Meta advertising, WhatsApp integration', questions: 'Why did Facebook CPL increase by 32%?', docs: 'festive_plan_v2.pdf', reference: 'MTG-00192', pendingDecisions: 'Waiver decision Solapur', expectedOutcome: 'Approve and lock Q3 budget' } },
        { id: 'MTG-00219', title: 'Financial Q2 Performance Audit', type: 'Finance', date: '2026-08-25', startTime: '11:30', endTime: '12:30', duration: '60 mins', location: 'Boardroom', room: 'Board Room', link: '', organizer: 'CFO Office', createdDate: '2026-08-24', status: 'Scheduled', priority: '🟠 Important', participants: [{ name: 'Anil Deshmukh', company: 'ePay', designation: 'CFO', phone: '9876543211', email: 'cfo@epay.com', type: 'Internal' }], agenda: { objective: 'Review operational cost structure', topics: 'High petty cash volume in Mumbai, overhead overrides', questions: 'How do we recoup Solapur collections?', docs: 'q2_ledger.xlsx', reference: 'MTG-00211', pendingDecisions: 'Expense category capping', expectedOutcome: 'Cap gallery petty cash limits' } },
        { id: 'MTG-00220', title: 'Franchise Partner Expansion Solapur', type: 'Franchise', date: '2026-08-25', startTime: '14:00', endTime: '15:00', duration: '60 mins', location: 'Hybrid / Zoom', room: 'N/A', link: 'https://epay.zoom.us/j/solapur', organizer: 'Franchise Head', createdDate: '2026-08-23', status: 'Scheduled', priority: '🟢 Normal', participants: [{ name: 'Solapur Partner', company: 'Solapur Retail', designation: 'Franchise Owner', phone: '9876543212', email: 'solapur@partner.com', type: 'External' }], agenda: { objective: 'Approve fee installment deferment schedule', topics: 'Installment planning, civil layout setup audit', questions: 'Can partner complete civil setup by Q3?', docs: 'solapur_layout.pdf', reference: 'MTG-00185', pendingDecisions: 'Installment waiver approvals', expectedOutcome: 'Approve solapur lease blueprint' } }
    ],

    meetingMinutes: [
        {
            meetingId: 'MTG-00218',
            title: 'Marketing Strategy Review',
            date: '2026-08-25',
            participants: 'Vivek Patil (CEO), Suresh Kumar (CMO)',
            agenda: 'Approve festive season brand campaign assets',
            discussion: 'Discussed rising cost per lead (CPL) on Facebook. Agreed that localized print and outdoor billboards will have better conversion rates in Pune region.',
            decisions: ['Approved Solapur billboard spend override', 'Reallocate ₹5L from Meta Ads to Pune Billboards'],
            actionItems: [
                { id: 'AI-201', action: 'Submit final outdoor billboard mockups', owner: 'Marketing Head', deadline: '2026-08-28', priority: 'High', status: 'Pending' },
                { id: 'AI-202', action: 'Provide breakdown of Facebook ad CPL anomalies', owner: 'CMO', deadline: '2026-08-27', priority: 'High', status: 'Pending' },
                { id: 'AI-203', action: 'Review solapur franchise billboard location', owner: 'District Manager', deadline: '2026-08-30', priority: 'Critical', status: 'Pending' }
            ]
        }
    ],

    // 🔔 CEO ALERT & NOTIFICATION CENTER (Sections 16 - 24)
    alerts: [
        { id: 'ALT-000421', type: 'Financial', severity: 'critical', subject: 'Payment of ₹12.5L overdue from Zenith Enterprises', amount: '₹12,50,000', customer: 'Zenith Enterprises', dept: 'Finance', manager: 'Finance Manager (Rohan K.)', date: '2026-08-25', time: '10:15 AM', sla: '24 hours', status: 'Pending', history: ['Overdue triggered on Day 30', 'Reminder letter sent to Zenith CEO'] },
        { id: 'ALT-000422', type: 'Sales', severity: 'critical', subject: 'Mumbai Gallery sales 25% below monthly target', amount: 'N/A', customer: 'Company-owned', dept: 'Sales', manager: 'District Manager (Rajesh V.)', date: '2026-08-25', time: '09:00 AM', sla: '48 hours', status: 'Pending', history: ['Triggered at weekly performance review'] },
        { id: 'ALT-000423', type: 'Customer', severity: 'critical', subject: 'Critical customer complaint unresolved for 72 hours', amount: 'N/A', customer: 'Enterprise Client #9921', dept: 'Customer Ops', manager: 'Quality Head (Meera S.)', date: '2026-08-24', time: '04:30 PM', sla: '24 hours', status: 'Pending', history: ['Client escalation path reached'] },
        { id: 'ALT-000424', type: 'Technology', severity: 'critical', subject: 'CRM POS payment integration latency outage', amount: 'N/A', customer: 'POS Galleries', dept: 'Technology', manager: 'CTO (Vikram Singh)', date: '2026-08-25', time: '08:15 AM', sla: '4 hours', status: 'Pending', history: ['Primary database replication lag detected'] },
        { id: 'ALT-000425', type: 'Franchise', severity: 'critical', subject: 'Solapur Franchise agreement approval delayed', amount: 'N/A', customer: 'Solapur Partner', dept: 'Franchise', manager: 'Franchise Head (Karan Patel)', date: '2026-08-25', time: '11:00 AM', sla: '72 hours', status: 'Pending', history: ['Waiver details verification ongoing'] },
        { id: 'ALT-000426', type: 'Finance', severity: 'important', subject: '7 Approvals pending CEO signoff', amount: '₹18,50,000 PO', customer: 'Multiple Vendors', dept: 'Finance', manager: 'Procurement Head', date: '2026-08-25', time: '10:30 AM', sla: '48 hours', status: 'Pending', history: ['Aggregated pending items'] },
        { id: 'ALT-000427', type: 'Operations', severity: 'important', subject: '12 Tasks overdue for more than 48 hours', amount: 'N/A', customer: 'N/A', dept: 'Operations', manager: 'HQ Manager', date: '2026-08-25', time: '07:30 AM', sla: '24 hours', status: 'Pending', history: ['Overdue escalation rules checked'] },
        { id: 'ALT-000428', type: 'Operations', severity: 'important', subject: '3 Weekly Reports pending from state heads', amount: 'N/A', customer: 'N/A', dept: 'Operations', manager: 'HQ Operations Team', date: '2026-08-25', time: '06:00 AM', sla: '12 hours', status: 'Pending', history: ['Weekly close alerts'] }
    ],

    alertPreferences: {
        categories: { Finance: true, HR: true, Sales: true, Marketing: true, Operations: true, Technology: true, Gallery: true, Franchise: true, Customer: true, Meetings: true, Tasks: true, Approvals: true },
        severity: 'All', // Critical only, Critical + Important, All
        delivery: { CRM: true, Email: true, Mobile: true, Push: true }
    },

    alertRules: [
        { id: 'rule-1', metric: 'Gallery sales < 80% of monthly target', severity: 'Warning' },
        { id: 'rule-2', metric: 'Gallery sales < 60% of monthly target', severity: 'Critical' },
        { id: 'rule-3', metric: 'Payment overdue > 7 days', severity: 'Important' },
        { id: 'rule-4', metric: 'Payment overdue > 30 days', severity: 'Critical' },
        { id: 'rule-5', metric: 'Complaint unresolved beyond SLA threshold', severity: 'Warning' },
        { id: 'rule-6', metric: 'Complaint unresolved beyond SLA by 24 hours', severity: 'Critical' }
    ],

    // Process Control (Section 7)
    processes: [
        { name: 'Franchise Onboarding', cases: 14, stages: ['Lead', 'Verification', 'Site Eval', 'Proposal', 'Negotiation', 'Agreement', 'Payment', 'Approval', 'Setup', 'Launch'], activeStageIndex: 5, owner: 'Franchise Head (Karan Patel)', dateEntered: '2026-08-12', slaDays: 30, daysPending: 13, delayReason: 'Pending municipal commercial license approval', lastActivity: 'Legal verification approved by Counsel', nextAction: 'CEO Agreement Signoff' },
        { name: 'Senior Recruitment', cases: 6, stages: ['Sourcing', 'Screening', 'Technical', 'Management', 'CEO Interview', 'Offer', 'Onboarding'], activeStageIndex: 4, owner: 'HR Director (Meena Roy)', dateEntered: '2026-08-05', slaDays: 21, daysPending: 20, delayReason: 'Candidate notice period negotiation', lastActivity: 'Management round cleared with 9.2/10 rating', nextAction: 'CEO Final Interview' },
        { name: 'Customer Complaints', cases: 5, stages: ['Logged', 'Assigned', 'Investigation', 'Root Cause', 'Customer Contact', 'Resolution Proposal', 'Verification', 'Closed'], activeStageIndex: 3, owner: 'Customer Ops Head', dateEntered: '2026-08-22', slaDays: 2, daysPending: 3, delayReason: 'Vendor component replacement delayed', lastActivity: 'Technical team inspected site', nextAction: 'Issue replacement hardware & refund token' },
        { name: 'Vendor Onboarding', cases: 8, stages: ['Application', 'Doc Audit', 'Facility Visit', 'Pricing Negotiation', 'Agreement', 'Trial Order', 'Approved'], activeStageIndex: 2, owner: 'Procurement Manager', dateEntered: '2026-08-15', slaDays: 14, daysPending: 10, delayReason: 'GST compliance verification delay', lastActivity: 'Facility visit report submitted', nextAction: 'Pricing negotiation call' },
    ],

    // Approval Center (Section 8)
    approvals: [
        { id: 'APP-801', dept: 'Finance', title: 'Special Purchase Order: 50x Kiosk Hardware Units', amount: '₹18,50,000', requestedBy: 'Procurement Head', date: '2026-08-25', status: 'Pending', details: 'Bulk purchase for 5 new galleries in Maharashtra. Discounted 14% vs MRP.' },
        { id: 'APP-802', dept: 'HR', title: 'Senior VP Operations Hiring & Remuneration Package', amount: '₹32,00,000 / yr', requestedBy: 'HR Director', date: '2026-08-24', status: 'Pending', details: 'Candidate has 14 years retail ops experience. Approved by CFO.' },
        { id: 'APP-803', dept: 'Operations', title: 'Emergency Air Conditioning overhaul for Mumbai East Gallery', amount: '₹3,40,000', requestedBy: 'Gallery Manager Mumbai', date: '2026-08-25', status: 'Pending', details: 'Main compressor failure causing customer discomfort during peak hours.' },
    ],

    // Notes (Section 26)
    notes: [
        { id: 'NTE-01', title: 'Q4 Gallery Expansion Strategy', category: 'Strategy', text: 'Target Tier-2 cities in Maharashtra & Gujarat. Franchise model yields 24% higher ROI than self-owned galleries.', private: true, pinned: true, tags: ['Expansion'], date: '2026-08-24' },
        { id: 'NTE-02', title: 'Employee Performance Incentives Restructuring', category: 'People', text: 'Introduce 30% weighting for NPS scores and zero SLA breach bonus.', private: false, sharedWith: ['HR Director'], pinned: true, tags: ['HR'], date: '2026-08-23' },
    ],

    // Ideas & Strategy (Section 29)
    ideas: [
        { id: 'IDA-01', title: 'Express Gallery Kiosks at Metro Stations', category: 'New Channel', desc: 'Compact 50 sq.ft micro-galleries at high-footfall metro stations.', potential: '₹1.2Cr annual revenue', stage: 'Evaluation', owner: 'Biz Growth Head', date: '2026-08-15' },
    ],

    // Decisions (Section 30)
    decisions: [
        { id: 'DEC-00152', title: 'Increase Pune Gallery monthly target to ₹35,00,000', date: '2026-08-01', reason: 'High market potential and newly launched B2B service line.', owner: 'District Manager Pune', deadline: '2026-08-31', expectedResult: '₹35,00,000 Revenue', actualResult: '₹22,50,000 (In Progress)', status: 'In Progress' },
    ],

    // Follow-ups (Section 31)
    followups: [
        { id: 'FLP-1', title: 'Submit Pune Gallery Recovery Plan', person: 'Sales Head (Rahul M.)', date: '2026-08-26', priority: 'High', status: 'Pending' },
    ],

    // Galleries Performance (Section 10)
    galleries: [
        { id: 'EPG-PUNE-009', name: 'Pune Central', city: 'Pune', state: 'Maharashtra', target: '₹30,00,000', sales: '₹28,40,000', achPct: 94.6, customers: 1840, expense: '₹4,20,000', status: 'green', manager: 'Priya Sharma' },
        { id: 'EPG-MUM-021', name: 'Mumbai East', city: 'Mumbai', state: 'Maharashtra', target: '₹40,00,000', sales: '₹25,10,000', achPct: 62.7, customers: 1210, expense: '₹5,80,000', status: 'red', manager: 'Amit Patel' },
        { id: 'EPG-NAS-004', name: 'Nashik Main', city: 'Nashik', state: 'Maharashtra', target: '₹20,00,000', sales: '₹22,00,000', achPct: 110.0, customers: 1450, expense: '₹3,10,000', status: 'green', manager: 'Sunil Verma' },
    ],

    // Employees / People
    employees: [
        { id: 'EMP-301', name: 'Priya Sharma', role: 'Gallery Manager', gallery: 'Pune Central', rating: 9.2, attendance: '98%', sales: '₹12.4L', status: 'Active', tasks: 12, overdueTasks: 0 },
        { id: 'EMP-302', name: 'Amit Patel', role: 'Gallery Manager', gallery: 'Mumbai East', rating: 6.8, attendance: '88%', sales: '₹8.1L', status: 'Warning', tasks: 8, overdueTasks: 3 },
    ],

    // Budgets & Financials
    budgets: [
        { department: 'Marketing', allocated: '₹50,00,000', spent: '₹48,20,000', variance: '₹1,80,000' },
        { department: 'Operations', allocated: '₹40,00,000', spent: '₹38,50,000', variance: '₹1,50,000' },
    ],

    // Audit Log
    auditLog: [
        { id: 'AUD-901', who: 'CFO Anil Deshmukh', what: 'Expense Category Revision', when: '2026-08-25 10:14', before: '₹65,000', after: '₹85,000', why: 'Emergency HVAC overhaul', approvedBy: 'CEO Vivek Patil', status: 'Verified' },
    ],

    // Daily closing reflection log
    reflections: [
        { date: '2026-08-24', wentWell: 'Resolved ABC Electricals contract.', wentWrong: 'API database error occurred.', observations: 'Franchise setup solapur looks solid.', priorities: 'Review Q3 strategy details.', followup: 'Followup CFO on solapur audit.' }
    ]
});

export default function CEOCommandSystem() {
    const { logActivity, getAllUsers } = useAuth();
    const [data, setData] = useState(() => defaultData());
    const [usersList, setUsersList] = useState([]);
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);
    const [globalSearch, setGlobalSearch] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedMeetingId, setSelectedMeetingId] = useState('MTG-00218');
    const [selectedAlertId, setSelectedAlertId] = useState('ALT-000421');
    const [meetingViewMode, setMeetingViewMode] = useState('AGENDA'); // DAY, WEEK, MONTH, AGENDA, TIMELINE
    const toastTimer = useRef(null);

    const refreshUsers = useCallback(async () => {
        try {
            if (typeof getAllUsers === 'function') {
                const users = await getAllUsers();
                if (users && users.length > 0) {
                    setUsersList(users);
                }
            }
        } catch (err) {
            console.warn('CEO: Error fetching users:', err);
        }
    }, [getAllUsers]);

    useEffect(() => {
        refreshUsers();
        if (typeof window !== 'undefined') {
            const handleSync = () => refreshUsers();
            window.addEventListener('epay_users_updated', handleSync);
            window.addEventListener('storage', handleSync);
            return () => {
                window.removeEventListener('epay_users_updated', handleSync);
                window.removeEventListener('storage', handleSync);
            };
        }
    }, [refreshUsers]);

    // Live Firestore database subscriptions
    const { data: prioritiesData } = useFirestore('priorities', defaultData().priorities);
    const { data: actionRequiredData } = useFirestore('actionRequired', defaultData().actionRequired);
    const { data: commandsData, add: addCommand } = useFirestore('commands', defaultData().commands);
    const { data: tasksData, add: addTask } = useFirestore('tasks', defaultData().tasks);
    const { data: meetingsData, add: addMeeting } = useFirestore('meetings', defaultData().meetings);
    const { data: alertsData } = useFirestore('alerts', defaultData().alerts);
    const { data: notesData, add: addNote } = useFirestore('notes', defaultData().notes);

    // Sync Firestore live queries to state db (only overwrite if array contains elements to prevent blank states)
    useEffect(() => {
        if (prioritiesData && prioritiesData.length > 0) setData(prev => ({ ...prev, priorities: prioritiesData }));
    }, [prioritiesData]);

    useEffect(() => {
        if (actionRequiredData && actionRequiredData.length > 0) setData(prev => ({ ...prev, actionRequired: actionRequiredData }));
    }, [actionRequiredData]);

    useEffect(() => {
        if (commandsData && commandsData.length > 0) setData(prev => ({ ...prev, commands: commandsData }));
    }, [commandsData]);

    useEffect(() => {
        if (tasksData && tasksData.length > 0) setData(prev => ({ ...prev, tasks: tasksData }));
    }, [tasksData]);

    useEffect(() => {
        if (meetingsData && meetingsData.length > 0) setData(prev => ({ ...prev, meetings: meetingsData }));
    }, [meetingsData]);

    useEffect(() => {
        if (alertsData && alertsData.length > 0) setData(prev => ({ ...prev, alerts: alertsData }));
    }, [alertsData]);

    useEffect(() => {
        if (notesData && notesData.length > 0) setData(prev => ({ ...prev, notes: notesData }));
    }, [notesData]);

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const defaults = defaultData();
                    const merged = { ...defaults };
                    
                    Object.keys(defaults).forEach(key => {
                        if (parsed[key] !== undefined) {
                            if (Array.isArray(defaults[key]) && Array.isArray(parsed[key]) && parsed[key].length === 0) {
                                merged[key] = defaults[key];
                            } else {
                                merged[key] = parsed[key];
                            }
                        }
                    });
                    setData(merged);
                }
            }
        } catch (e) {
            console.warn('LocalStorage load error:', e);
        }
    }, []);

    function saveData(d) {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
            }
        } catch (e) {
            console.warn('LocalStorage save error:', e);
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
        toastTimer.current = setTimeout(() => setToast(null), 3200);
    }, []);

    const openModal = useCallback((title, content) => {
        setModal({ title, content });
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);

    // ----------------------------------------------------------------
    // AUDITING & UTILITIES
    // ----------------------------------------------------------------
    const logAudit = (action, before, after, why) => {
        const entry = {
            id: `AUD-${Date.now()}`,
            who: data.user.name,
            what: action,
            when: new Date().toLocaleString(),
            before: String(before),
            after: String(after),
            why: why || 'Direct executive interaction',
            approvedBy: data.user.name,
            status: 'Verified'
        };
        updateData(prev => ({
            ...prev,
            auditLog: [entry, ...prev.auditLog]
        }));
    };

    // ----------------------------------------------------------------
    // CEO MEETING life cycle management
    // ----------------------------------------------------------------
    const handleCreateMeeting = () => {
        openModal(
            '🤝 Create CEO Executive Meeting',
            <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const newMtg = {
                    id: `MTG-00${Math.floor(221 + Math.random() * 800)}`,
                    title: form.title.value,
                    type: form.type.value,
                    date: form.date.value,
                    startTime: form.startTime.value,
                    endTime: form.endTime.value || '11:00',
                    duration: '60 mins',
                    location: form.location.value,
                    room: form.room.value || 'CEO Main Office',
                    link: form.link.value || '',
                    organizer: data.user.name,
                    createdDate: new Date().toISOString().slice(0, 10),
                    status: 'Scheduled',
                    priority: form.priority.value,
                    participants: [
                        { name: form.pName.value, company: form.pCompany.value, designation: form.pDesignation.value, email: form.pEmail.value, type: form.pType.value }
                    ],
                    agenda: {
                        objective: form.objective.value,
                        topics: form.topics.value,
                        questions: form.questions.value,
                        docs: form.docs.value,
                        reference: form.reference.value || 'N/A',
                        pendingDecisions: '',
                        expectedOutcome: form.expectedOutcome.value
                    }
                };

                await addMeeting(newMtg);
                await logActivity('CEO_CREATED_MEETING', { meetingId: newMtg.id, title: newMtg.title });
                updateData(prev => ({ ...prev, meetings: [newMtg, ...prev.meetings] }));
                logAudit(`Scheduled Meeting #${newMtg.id}`, 'N/A', newMtg.title, 'Created using Executive Meeting Interface');
                showToast(`🤝 Meeting "${newMtg.title}" Scheduled successfully.`);
                closeModal();


            }} className="space-y-3 text-xs max-h-[80vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Meeting Title *</label>
                        <input name="title" required className="w-full border p-2 rounded focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Meeting Type</label>
                        <select name="type" className="w-full border p-2 rounded">
                            <option>Strategy</option>
                            <option>Finance</option>
                            <option>Franchise</option>
                            <option>HR</option>
                            <option>Operations</option>
                            <option>Technology</option>
                            <option>Emergency</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Date *</label>
                        <input name="date" type="date" required className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Start Time *</label>
                        <input name="startTime" type="time" required className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">End Time</label>
                        <input name="endTime" type="time" defaultValue="11:00" className="w-full border p-2 rounded" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Location</label>
                        <input name="location" defaultValue="CEO Office" className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Room</label>
                        <input name="room" defaultValue="Conference Hall A" className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Priority</label>
                        <select name="priority" className="w-full border p-2 rounded">
                            <option value="🔴 Critical">🔴 Critical</option>
                            <option value="🟠 Important">🟠 Important</option>
                            <option value="🟢 Normal">🟢 Normal</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Online Zoom/Meet Link</label>
                    <input name="link" className="w-full border p-2 rounded" placeholder="https://epay.zoom.us/..." />
                </div>

                <div className="bg-slate-50 p-2.5 rounded border space-y-2">
                    <span className="font-bold text-[11px] text-slate-800">Primary Participant</span>
                    <div className="grid grid-cols-2 gap-2">
                        <input name="pName" required className="border p-1.5 rounded bg-white" placeholder="Name *" />
                        <input name="pDesignation" required className="border p-1.5 rounded bg-white" placeholder="Designation *" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <input name="pCompany" defaultValue="ePay" className="border p-1.5 rounded bg-white" placeholder="Company" />
                        <input name="pEmail" required className="border p-1.5 rounded bg-white" placeholder="Email *" />
                        <select name="pType" className="border p-1.5 rounded bg-white">
                            <option value="Internal">Internal</option>
                            <option value="External">External</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="font-bold text-[11px] text-slate-800">Meeting Agenda Details</span>
                    <input name="objective" required className="w-full border p-2 rounded" placeholder="Objective: e.g. Approve Q3 strategy" />
                    <input name="topics" className="w-full border p-2 rounded" placeholder="Topics (comma separated)" />
                    <div className="grid grid-cols-3 gap-2">
                        <input name="questions" className="border p-2 rounded" placeholder="Questions to ask" />
                        <input name="docs" className="border p-2 rounded" placeholder="Documents required" />
                        <input name="reference" className="border p-2 rounded" placeholder="Prev. reference ID" />
                    </div>
                    <input name="expectedOutcome" className="w-full border p-2 rounded" placeholder="Expected outcome" />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t">
                    <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded font-bold">Schedule Meeting</button>
                </div>
            </form>
        );
    };

    // Meeting status transitions (Section 10)
    const handleMtgStatus = (mtgId, status) => {
        const mtg = data.meetings.find(m => m.id === mtgId);
        if (!mtg) return;

        updateData(prev => ({
            ...prev,
            meetings: prev.meetings.map(m => m.id === mtgId ? { ...m, status } : m)
        }));
        logAudit(`Changed Meeting #${mtgId} status`, mtg.status, status, 'Meeting lifecycle transition');
        showToast(`Meeting #${mtgId} is now ${status}.`);
    };

    // Meeting to Task Conversion (Section 12)
    const handleMOMToTask = (actionText, owner, deadline, mtgId) => {
        const newTask = {
            id: `TSK-MTG-${Math.floor(100 + Math.random() * 900)}`,
            title: actionText,
            desc: `Created from action item generated during Meeting #${mtgId}`,
            priority: 'High',
            category: 'Operations',
            startDate: new Date().toISOString().slice(0, 10),
            dueDate: deadline || new Date().toISOString().slice(0, 10),
            dueTime: '18:00',
            duration: '30 mins',
            dept: 'Operations',
            assignedTo: owner || 'Operations Head',
            gallery: 'HQ',
            status: 'In Progress',
            cancellationReason: ''
        };

        updateData(prev => ({
            ...prev,
            tasks: [newTask, ...prev.tasks],
            meetingMinutes: prev.meetingMinutes.map(m => m.meetingId === mtgId ? {
                ...m,
                actionItems: m.actionItems.map(ai => ai.action === actionText ? { ...ai, status: 'Tasks Created' } : ai)
            } : m)
        }));
        logAudit(`Converted MOM Action Item to Task #${newTask.id}`, 'N/A', actionText, `Automated mapping from Meeting #${mtgId}`);
        showToast(`⚡ Action item successfully mapped to Task #${newTask.id}!`);
    };

    // Meeting to Decision Register (Section 14)
    const handleMOMToDecision = (actionText, owner, deadline, mtgId) => {
        const newDec = {
            id: `DEC-MTG-${Math.floor(100 + Math.random() * 900)}`,
            title: actionText,
            date: new Date().toISOString().slice(0, 10),
            reason: `Determined during executive strategy session Meeting #${mtgId}`,
            owner: owner || 'District Manager',
            deadline: deadline || new Date().toISOString().slice(0, 10),
            expectedResult: 'Performance alignment',
            actualResult: 'In Progress',
            status: 'In Progress'
        };

        updateData(prev => ({
            ...prev,
            decisions: [newDec, ...prev.decisions]
        }));
        logAudit(`Logged Decision #${newDec.id}`, 'N/A', actionText, `Mapped from Meeting #${mtgId}`);
        showToast(`🧠 Decision recorded in CEO Register: #${newDec.id}.`);
    };

    // Meeting to Follow-up (Section 13)
    const handleMOMToFollowup = (actionText, owner, deadline, mtgId) => {
        const newFlp = {
            id: `FLP-MTG-${Math.floor(100 + Math.random() * 900)}`,
            title: `Follow up: ${actionText}`,
            person: owner || 'Operations Head',
            date: deadline || new Date().toISOString().slice(0, 10),
            priority: 'High',
            status: 'Pending'
        };

        updateData(prev => ({
            ...prev,
            followups: [newFlp, ...prev.followups]
        }));
        logAudit(`Registered Follow-up #${newFlp.id}`, 'N/A', actionText, `Followup reminder set`);
        showToast(`🔁 Follow-up registered for ${newFlp.person}.`);
    };

    // ----------------------------------------------------------------
    // CEO ALERT SYSTEM ACTIONS (Section 19)
    // ----------------------------------------------------------------
    const handleAlertAction = (alertId, action) => {
        const alertItem = data.alerts.find(a => a.id === alertId);
        if (!alertItem) return;

        if (action === 'Resolve' || action === 'Dismiss') {
            updateData(prev => ({
                ...prev,
                alerts: prev.alerts.map(a => a.id === alertId ? { ...a, status: action + 'd' } : a)
            }));
            logAudit(`${action}d Alert #${alertId}`, alertItem.status, action + 'd', 'CEO Direct Alert Center interaction');
            showToast(`🔔 Alert #${alertId} has been successfully ${action}d.`);
        } else if (action === 'Escalate') {
            updateData(prev => ({
                ...prev,
                alerts: prev.alerts.map(a => a.id === alertId ? { ...a, severity: 'critical', subject: `🔴 [ESCALATED TO CEO] ${a.subject}` } : a)
            }));
            logAudit(`Escalated Alert #${alertId}`, alertItem.severity, 'critical', 'Alert severity escalation rule');
            showToast(`🔥 Alert #${alertId} escalated to Critical CEO level.`);
        } else if (action === 'Snooze') {
            updateData(prev => ({
                ...prev,
                alerts: prev.alerts.map(a => a.id === alertId ? { ...a, date: new Date(Date.now() + 86400000).toISOString().slice(0, 10) } : a)
            }));
            logAudit(`Snoozed Alert #${alertId}`, alertItem.date, 'Snoozed by 24h', 'Snooze warning action');
            showToast(`Snoozed Alert #${alertId} by 24 hours.`);
        } else if (action === 'Assign') {
            openModal(
                '👤 Assign Alert Responsibility',
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const manager = e.target.manager.value;
                    updateData(prev => ({
                        ...prev,
                        alerts: prev.alerts.map(a => a.id === alertId ? { ...a, manager } : a)
                    }));
                    logAudit(`Assigned Alert #${alertId} responsibility`, alertItem.manager, manager, 'Reassigning alert tracker');
                    showToast(`Alert #${alertId} assigned to ${manager}.`);
                    closeModal();
                }} className="space-y-3 text-xs">
                    <input name="manager" required className="w-full border p-2 rounded" placeholder="Manager Name (e.g. Sales Head)..." />
                    <button type="submit" className="w-full py-2 bg-slate-900 text-white rounded font-bold">Assign Responsibility</button>
                </form>
            );
        } else if (action === 'Command') {
            handleIssueCommand();
        }
    };

    // ----------------------------------------------------------------
    // RENDERING
    // ----------------------------------------------------------------

    // Wednesday, 25 August 2026 Home Page Top Section (Section 25 Spec Layout)
    const renderDashboardTopSection = () => {
        const nextMtg = data.meetings.find(m => m.id === 'MTG-00218') || data.meetings[0];
        const criticalAlerts = data.alerts.filter(a => a.severity === 'critical' && a.status === 'Pending');

        return (
            <div className="space-y-6">
                {/* Home Page Top Ribbon */}
                <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
                        <div>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">ePay CEO Command Center</h2>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">Tuesday, 25 August 2026 • Welcome, {data.user.name}</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border">Company: {data.user.company}</span>
                        </div>
                    </div>

                    {/* Today Executive Overview strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs text-center font-bold">
                        <div onClick={() => setCurrentSection('ceo-tasks')} className="bg-slate-50 border p-3 rounded-xl hover:border-emerald-500 cursor-pointer transition">
                            <span className="text-slate-400 block uppercase text-[9px] mb-0.5">Agenda Tasks</span>
                            <span className="text-sm text-slate-850">📋 {data.tasks.filter(t => t.status !== 'Completed').length} Tasks</span>
                        </div>
                        <div onClick={() => setCurrentSection('ceo-meetings')} className="bg-slate-50 border p-3 rounded-xl hover:border-emerald-500 cursor-pointer transition">
                            <span className="text-slate-400 block uppercase text-[9px] mb-0.5">Today Meetings</span>
                            <span className="text-sm text-slate-850">🤝 {data.meetings.length} Meetings</span>
                        </div>
                        <div onClick={() => setCurrentSection('ceo-alerts')} className="bg-slate-50 border p-3 rounded-xl hover:border-emerald-500 cursor-pointer transition text-rose-700 border-rose-100 bg-rose-50/20">
                            <span className="text-rose-400 block uppercase text-[9px] mb-0.5">Critical Warnings</span>
                            <span className="text-sm font-black">🔔 {criticalAlerts.length} Alerts</span>
                        </div>
                        <div onClick={() => setCurrentSection('ceo-commands')} className="bg-slate-50 border p-3 rounded-xl hover:border-emerald-500 cursor-pointer transition text-indigo-700">
                            <span className="text-indigo-400 block uppercase text-[9px] mb-0.5">Issued Directives</span>
                            <span className="text-sm font-black">⚡ {data.commands.length} Commands</span>
                        </div>
                        <div onClick={() => setCurrentSection('approval-center')} className="bg-slate-50 border p-3 rounded-xl hover:border-emerald-500 cursor-pointer transition">
                            <span className="text-slate-400 block uppercase text-[9px] mb-0.5">CEO Approvals</span>
                            <span className="text-sm text-slate-850">✅ {data.approvals.filter(a => a.status === 'Pending').length} Pending</span>
                        </div>
                        <div onClick={() => setCurrentSection('ceo-followups')} className="bg-slate-50 border p-3 rounded-xl hover:border-emerald-500 cursor-pointer transition">
                            <span className="text-slate-400 block uppercase text-[9px] mb-0.5">Active Followups</span>
                            <span className="text-sm text-slate-850">🔁 {data.followups.filter(f => f.status === 'Pending').length} Pending</span>
                        </div>
                    </div>
                </div>

                {/* Home Page Layout Grid (Action Required, Next Meeting, Alerts, CEO Today) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left Columns (Action Required & Alerts) */}
                    <div className="space-y-6">
                        {/* 🚨 Action Required */}
                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                            <div className="flex justify-between items-center border-b pb-2 mb-3">
                                <h3 className="font-bold text-sm text-slate-800">🚨 ACTION REQUIRED</h3>
                                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                                    {data.actionRequired.filter(a => a.status === 'Pending').length} Items
                                </span>
                            </div>
                            <div className="space-y-2.5">
                                {data.actionRequired.slice(0, 3).map(act => (
                                    <div key={act.id} className="p-3 border rounded bg-slate-50 text-xs flex justify-between items-center gap-3 hover:border-emerald-500 transition">
                                        <div>
                                            <div className="font-bold text-slate-900">{act.title}</div>
                                            <div className="text-slate-500 text-[10px] mt-0.5">SLA Deadline: {act.date} • {act.gallery}</div>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <button onClick={() => handleActionItem(act.id, 'Approve')} className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]">Approve</button>
                                            <button onClick={() => handleActionItem(act.id, 'Reject')} className="px-2.5 py-1 bg-rose-600 text-white rounded font-bold text-[10px]">Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 🔔 Alerts Center overview */}
                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                            <div className="flex justify-between items-center border-b pb-2 mb-3">
                                <h3 className="font-bold text-sm text-slate-800">🔔 ALERTS & CRITICAL EXCEPTIONS</h3>
                                <span onClick={() => setCurrentSection('ceo-alerts')} className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer">Open Center ›</span>
                            </div>
                            <div className="space-y-2.5">
                                {data.alerts.slice(0, 4).map(alert => (
                                    <div key={alert.id} className={`p-2.5 rounded text-xs border ${alert.severity === 'critical' ? 'bg-rose-50/20 border-rose-200 text-rose-950' : 'bg-amber-50/20 border-amber-200 text-amber-950'}`}>
                                        <div className="flex justify-between font-bold">
                                            <span>{alert.severity === 'critical' ? '🔴' : '🟠'} {alert.subject}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Columns (Next Meeting & CEO Today Priorities) */}
                    <div className="space-y-6">
                        {/* 🤝 Next Meeting card */}
                        {nextMtg && (
                            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between">
                                <div className="border-b pb-2 mb-3 flex justify-between items-center">
                                    <h3 className="font-bold text-sm text-slate-800">🤝 NEXT MEETING</h3>
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Active</span>
                                </div>
                                <div className="p-3 bg-slate-50 border rounded-xl space-y-2">
                                    <div className="font-extrabold text-sm text-slate-900">{nextMtg.title}</div>
                                    <div className="text-xs text-slate-600">
                                        🕒 {nextMtg.startTime} - {nextMtg.endTime} | Organizer: {nextMtg.organizer}
                                    </div>
                                    <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                                        Meeting starting in 28 minutes
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button onClick={() => { setSelectedMeetingId(nextMtg.id); setCurrentSection('ceo-meetings'); }} className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800">
                                        Open Meeting Workspace
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 📋 CEO Today Focus priorities */}
                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                            <h3 className="font-bold text-sm text-slate-800 border-b pb-2 mb-3">📋 CEO TODAY (Daily Focus Priorities)</h3>
                            <div className="space-y-2 text-xs">
                                {data.priorities.map(prio => (
                                    <label key={prio.id} className="flex items-center gap-2.5 p-2 border.5 rounded hover:bg-slate-50 cursor-pointer">
                                        <input type="checkbox" checked={prio.done} onChange={() => {
                                            updateData(prev => ({
                                                ...prev,
                                                priorities: prev.priorities.map(p => p.id === prio.id ? { ...p, done: !p.done } : p)
                                            }));
                                            showToast('Focus Priority updated.');
                                        }} className="rounded text-emerald-600 focus:ring-emerald-500" />
                                        <span className={prio.done ? 'line-through text-slate-400' : 'text-slate-700 font-semibold'}>{prio.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    // 2. CEO MEETINGS WORKSPACE (Section 2 - 15)
    const renderMeetingsModule = () => {
        const selectedMtg = data.meetings.find(m => m.id === selectedMeetingId) || data.meetings[0];
        const selectedMOM = data.meetingMinutes.find(m => m.meetingId === selectedMeetingId);

        return (
            <div className="space-y-6">
                {/* Title Section */}
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
                    <div>
                        <h2 className="text-lg font-black text-slate-800">🤝 CEO Meetings Management Workspace</h2>
                        <p className="text-xs text-slate-400">Complete Meeting Lifecycle: Schedule → Prepare → Conduct → Decide → Automate.</p>
                    </div>
                    <button onClick={handleCreateMeeting} className="px-4 py-2 bg-emerald-600 text-white rounded font-bold text-xs">
                        + Schedule CEO Meeting
                    </button>
                </div>

                {/* Meeting Cards strip (Section 4) */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border shadow-sm text-center">
                        <span className="text-slate-400 block uppercase text-[9px] font-bold">Today</span>
                        <span className="text-xl font-extrabold text-slate-800">{data.meetings.length}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border shadow-sm text-center">
                        <span className="text-slate-400 block uppercase text-[9px] font-bold">Upcoming</span>
                        <span className="text-xl font-extrabold text-slate-800">4</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border shadow-sm text-center">
                        <span className="text-slate-400 block uppercase text-[9px] font-bold">This Week</span>
                        <span className="text-xl font-extrabold text-slate-800">18</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border shadow-sm text-center">
                        <span className="text-slate-400 block uppercase text-[9px] font-bold">Minutes Pending</span>
                        <span className="text-xl font-extrabold text-amber-600">5</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border shadow-sm text-center">
                        <span className="text-slate-400 block uppercase text-[9px] font-bold">Followups</span>
                        <span className="text-xl font-extrabold text-rose-600">11</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border shadow-sm text-center">
                        <span className="text-slate-400 block uppercase text-[9px] font-bold">Decisions</span>
                        <span className="text-xl font-extrabold text-indigo-600">7</span>
                    </div>
                </div>

                {/* Calendar View Selector tabs (Section 15) */}
                <div className="bg-white p-3.5 rounded-xl border shadow-sm flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Meeting Calendar & Agenda View</span>
                    <div className="flex gap-1.5 text-xs">
                        {['DAY', 'WEEK', 'MONTH', 'AGENDA', 'TIMELINE'].map(mode => (
                            <button key={mode} onClick={() => setMeetingViewMode(mode)} className={`px-3 py-1.5 rounded font-bold uppercase transition ${meetingViewMode === mode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Meetings Sidebar & Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left list panel */}
                    <div className="space-y-3 lg:col-span-1">
                        <span className="text-xs uppercase font-bold text-slate-400 block">Today Meetings List</span>
                        {data.meetings.map(m => (
                            <div key={m.id} onClick={() => setSelectedMeetingId(m.id)} className={`p-4 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${selectedMeetingId === m.id ? 'bg-emerald-50/20 border-emerald-500 shadow-sm' : 'bg-white hover:border-slate-300'}`}>
                                <div className="flex justify-between font-bold">
                                    <span className="text-slate-900">{m.title}</span>
                                    <span className="text-emerald-700">{m.startTime}</span>
                                </div>
                                <div className="text-[11px] text-slate-500">Room: {m.room} • {m.type}</div>
                                <div className="flex justify-between items-center pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                                    <span>Status: <strong>{m.status}</strong></span>
                                    <span className="font-bold text-rose-700">{m.priority}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Center Workspace Panel (Prepare & Conduct Meeting) */}
                    <div className="space-y-4 lg:col-span-2">
                        {selectedMtg ? (
                            <div className="space-y-4">
                                {/* Meeting Objective & Participants */}
                                <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <h3 className="font-bold text-slate-900 text-base">{selectedMtg.title} Workspace</h3>
                                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">{selectedMtg.status}</span>
                                    </div>
                                    <div className="text-xs space-y-2 text-slate-700">
                                        <div><strong>Objective:</strong> {selectedMtg.agenda.objective}</div>
                                        <div><strong>Organizer:</strong> {selectedMtg.organizer} • Created: {selectedMtg.createdDate}</div>
                                        <div>
                                            <strong>Participants:</strong>
                                            <div className="mt-1 flex flex-wrap gap-1.5">
                                                {selectedMtg.participants.map((p, idx) => (
                                                    <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold border">
                                                        {p.name} ({p.designation} - {p.type})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5 pt-2 border-t text-xs">
                                        <button onClick={() => handleMtgStatus(selectedMtg.id, 'Started')} className="px-3 py-1.5 bg-emerald-600 text-white rounded font-bold">Start Meeting</button>
                                        <button onClick={() => handleMtgStatus(selectedMtg.id, 'Completed')} className="px-3 py-1.5 bg-slate-900 text-white rounded font-bold">Complete Meeting</button>
                                        <button onClick={() => handleRecordMOM(selectedMtg)} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded font-bold">Record MOM</button>
                                    </div>
                                </div>

                                {/* CEO Preparation Panel (Section 8) */}
                                <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                                    <h3 className="font-bold text-slate-800 text-xs border-b pb-1.5 uppercase tracking-wider">🧠 CEO Meeting Preparation & Context</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                                        <div className="space-y-1">
                                            <div><strong>Previous Meeting:</strong> Reviewing solapur billing blueprints ({selectedMtg.agenda.reference})</div>
                                            <div><strong>Previous Decisions:</strong> Waiver cap at 15%</div>
                                            <div><strong>Previous Tasks:</strong> CMO to audit ad CPL trends</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div><strong>SLA / Status:</strong> 2 Overdue Tasks, 1 Warning</div>
                                            <div><strong>Pending Issues:</strong> Facebook CPL increased by 32%</div>
                                            <div><strong>Documents:</strong> <span className="text-emerald-700 font-bold font-mono">{selectedMtg.agenda.docs}</span></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Minutes of Meeting details & Action item mapping (Section 11 - 14) */}
                                {selectedMOM && (
                                    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                                        <h3 className="font-bold text-slate-900 text-xs border-b pb-1.5 uppercase">Recorded Meeting Minutes (MOM)</h3>
                                        <div className="text-xs space-y-2 bg-slate-50 p-3 rounded-lg border">
                                            <div><strong>Discussion Summary:</strong> {selectedMOM.discussion}</div>
                                            <div><strong>Registered Decisions:</strong>
                                                <ul className="list-disc pl-4 mt-1 font-semibold text-slate-800">
                                                    {selectedMOM.decisions.map((d, idx) => (
                                                        <li key={idx}>{d}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="font-bold text-[11px] text-slate-800 uppercase block">Action Items Mapping</span>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                                                    <thead className="bg-slate-100 font-bold">
                                                        <tr>
                                                            <th className="p-2 border-b">Action Item</th>
                                                            <th className="p-2 border-b">Responsible</th>
                                                            <th className="p-2 border-b">Deadline</th>
                                                            <th className="p-2 border-b text-center">Automate Workflow</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedMOM.actionItems.map((ai, idx) => (
                                                            <tr key={idx} className="border-b">
                                                                <td className="p-2 font-semibold text-slate-800">{ai.action}</td>
                                                                <td className="p-2">{ai.owner}</td>
                                                                <td className="p-2 font-mono text-[11px]">{ai.deadline}</td>
                                                                <td className="p-2 text-center flex justify-center gap-1">
                                                                    {ai.status === 'Pending' ? (
                                                                        <>
                                                                            <button onClick={() => handleMOMToTask(ai.action, ai.owner, ai.deadline, selectedMtg.id)} className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold text-[9px]">
                                                                                + Task
                                                                            </button>
                                                                            <button onClick={() => handleMOMToDecision(ai.action, ai.owner, ai.deadline, selectedMtg.id)} className="px-2 py-0.5 bg-slate-900 text-white rounded font-bold text-[9px]">
                                                                                + Decision
                                                                            </button>
                                                                            <button onClick={() => handleMOMToFollowup(ai.action, ai.owner, ai.deadline, selectedMtg.id)} className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded font-bold text-[9px]">
                                                                                + Followup
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase">Mapped</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-xl border text-center text-slate-400 text-xs">
                                Select a meeting from the sidebar workspace list.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        );
    };

    // 3. CEO ALERT & NOTIFICATION CENTER (Sections 16 - 24)
    const renderAlertsCenterModule = () => {
        const selectedAlert = data.alerts.find(a => a.id === selectedAlertId) || data.alerts[0];
        const pendingCritical = data.alerts.filter(a => a.severity === 'critical' && a.status === 'Pending');
        const pendingImportant = data.alerts.filter(a => a.severity === 'important' && a.status === 'Pending');

        return (
            <div className="space-y-6">
                {/* Title */}
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
                    <div>
                        <h2 className="text-lg font-black text-slate-800">🔔 CEO Centralized Alert & Notification Center</h2>
                        <p className="text-xs text-slate-400">CEO's primary warning matrix: auto-escalations, SLA mapping, and response preferences.</p>
                    </div>
                </div>

                {/* Dashboard Grid (Section 18) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm text-center">
                        <span className="text-[10px] font-black text-rose-500 uppercase block">🔴 Critical Alerts</span>
                        <span className="text-2xl font-black text-rose-700 mt-1">{pendingCritical.length}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm text-center">
                        <span className="text-[10px] font-black text-amber-500 uppercase block">🟠 Important Alerts</span>
                        <span className="text-2xl font-black text-amber-700 mt-1">{pendingImportant.length}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase block">🟡 Reminders</span>
                        <span className="text-2xl font-black text-slate-800 mt-1">24</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase block">🟢 Information</span>
                        <span className="text-2xl font-black text-slate-800 mt-1">42</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Alerts List */}
                    <div className="space-y-3 lg:col-span-1">
                        <span className="text-xs uppercase font-bold text-slate-400 block">System Warnings Inbox</span>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                            {data.alerts.map(a => (
                                <div key={a.id} onClick={() => setSelectedAlertId(a.id)} className={`p-3 rounded-xl border cursor-pointer text-xs space-y-1.5 transition ${selectedAlertId === a.id ? 'bg-emerald-50/20 border-emerald-500 shadow-sm' : 'bg-white hover:border-slate-350'}`}>
                                    <div className="flex justify-between font-bold">
                                        <span className="truncate pr-1 text-slate-900">{a.subject}</span>
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${a.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{a.severity}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                                        <span>Status: {a.status}</span>
                                        <span>SLA: {a.sla}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Alert Detail Workspace & preferences settings */}
                    <div className="space-y-4 lg:col-span-2">
                        {selectedAlert ? (
                            <div className="space-y-4">
                                {/* Details Panel */}
                                <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <div>
                                            <h3 className="font-extrabold text-slate-900 text-sm">{selectedAlert.subject}</h3>
                                            <span className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {selectedAlert.id} • SLA Timeframe: {selectedAlert.sla}</span>
                                        </div>
                                        <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase">{selectedAlert.severity}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border">
                                        <div><strong>Category Type:</strong> {selectedAlert.type}</div>
                                        {selectedAlert.amount !== 'N/A' && <div><strong>Overdue Amount:</strong> <span className="font-black text-emerald-700">{selectedAlert.amount}</span></div>}
                                        <div><strong>Customer Affected:</strong> {selectedAlert.customer}</div>
                                        <div><strong>Responsible Department:</strong> {selectedAlert.dept}</div>
                                        <div><strong>Manager Accountable:</strong> {selectedAlert.manager}</div>
                                        <div><strong>Surfaced Date:</strong> {selectedAlert.date} @ {selectedAlert.time}</div>
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <span className="font-bold text-slate-700">Previous Escalation Actions History</span>
                                        <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                                            {selectedAlert.history.map((hist, idx) => (
                                                <li key={idx}>{hist}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Buttons for alert (Section 19) */}
                                    <div className="flex flex-wrap gap-1.5 pt-3 border-t text-xs font-bold">
                                        <button onClick={() => showToast(`Opening referenced records for ${selectedAlert.id}`)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700">View Record</button>
                                        <button onClick={() => handleAlertAction(selectedAlert.id, 'Assign')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700">Assign Manager</button>
                                        <button onClick={() => handleAlertAction(selectedAlert.id, 'Command')} className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded">Direct Command</button>
                                        <button onClick={() => handleAlertAction(selectedAlert.id, 'Escalate')} className="px-3 py-1.5 bg-amber-600 text-white hover:bg-amber-700 rounded">Escalate</button>
                                        <button onClick={() => handleAlertAction(selectedAlert.id, 'Resolve')} className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded">Resolve</button>
                                        <button onClick={() => handleAlertAction(selectedAlert.id, 'Dismiss')} className="px-3 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded">Dismiss</button>
                                        <button onClick={() => handleAlertAction(selectedAlert.id, 'Snooze')} className="px-3 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded">Snooze 24h</button>
                                    </div>
                                </div>

                                {/* Settings & Rules subpanel (Sections 20 & 23) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Rules Configuration */}
                                    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2 text-xs">
                                        <span className="font-bold text-slate-800 uppercase block">⚙️ Configured Warning Rules</span>
                                        <div className="space-y-1.5 max-h-[20vh] overflow-y-auto pr-1">
                                            {data.alertRules.map(rule => (
                                                <div key={rule.id} className="flex justify-between items-center p-2 bg-slate-50 border rounded text-[11px]">
                                                    <span>{rule.metric}</span>
                                                    <span className={`font-bold uppercase text-[9px] ${rule.severity === 'Critical' ? 'text-rose-700' : 'text-amber-700'}`}>{rule.severity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Delivery Preferences (Section 23) */}
                                    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3 text-xs">
                                        <span className="font-bold text-slate-800 uppercase block">🛡️ CEO Notification Preferences</span>
                                        <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
                                            {Object.keys(data.alertPreferences.delivery).map(method => (
                                                <label key={method} className="flex items-center gap-1.5 cursor-pointer">
                                                    <input type="checkbox" checked={data.alertPreferences.delivery[method]} onChange={() => {
                                                        updateData(prev => ({
                                                            ...prev,
                                                            alertPreferences: {
                                                                ...prev.alertPreferences,
                                                                delivery: { ...prev.alertPreferences.delivery, [method]: !prev.alertPreferences.delivery[method] }
                                                            }
                                                        }));
                                                        showToast('Notification preference saved.');
                                                    }} className="rounded text-emerald-600 focus:ring-emerald-500" />
                                                    <span>{method} Deliveries</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-xl border text-center text-slate-400 text-xs">
                                Select an active warning alert from the list scope.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        );
    };

    // ----------------------------------------------------------------
    // CEO ACTIONS HANDLERS
    // ----------------------------------------------------------------
    const handleActionItem = (id, action) => {
        updateData(prev => ({
            ...prev,
            actionRequired: prev.actionRequired.map(a => a.id === id ? { ...a, status: action + 'ed' } : a)
        }));
        const item = data.actionRequired.find(a => a.id === id);
        logAudit(`${action}ed Action Item #${id}`, item ? item.status : 'Pending', action + 'ed', 'Action Required resolution');
        showToast(`Action Item #${id} has been ${action}ed.`);
    };

    const handleCreateTask = () => {
        openModal(
            '📋 Create CEO Personal Task',
            <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const newTask = {
                    id: `TSK-${Date.now()}`,
                    title: form.title.value,
                    desc: form.desc.value,
                    priority: form.priority.value,
                    category: 'Management',
                    startDate: new Date().toISOString().slice(0,10),
                    dueDate: form.dueDate.value,
                    dueTime: form.dueTime.value || '18:00',
                    duration: '30 mins',
                    dept: 'Management',
                    assignedTo: 'CEO',
                    gallery: 'HQ',
                    status: 'In Progress'
                };
                await addTask(newTask);
                await logActivity('CEO_CREATED_TASK', { taskId: newTask.id, title: newTask.title });
                updateData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
                logAudit(`Created Task #${newTask.id}`, 'N/A', newTask.title, 'Manual CEO task entry');
                showToast(`Task "${newTask.title}" added successfully.`);
                closeModal();


            }} className="space-y-3 text-xs">
                <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Task Title *</label>
                    <input name="title" required className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Description</label>
                    <textarea name="desc" className="w-full border p-2 rounded"></textarea>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Due Date</label>
                        <input name="dueDate" type="date" required className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Due Time</label>
                        <input name="dueTime" type="time" defaultValue="18:00" className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Priority</label>
                        <select name="priority" className="w-full border p-2 rounded">
                            <option>Critical</option>
                            <option>High</option>
                            <option>Normal</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded font-bold">Create Task</button>
            </form>
        );
    };

    const handleCancelTask = (id) => {
        openModal(
            '⚠️ Cancel Task',
            <form onSubmit={(e) => {
                e.preventDefault();
                const reason = e.target.reason.value;
                updateData(prev => ({
                    ...prev,
                    tasks: prev.tasks.map(t => t.id === id ? { ...t, status: 'Cancelled', cancellationReason: reason } : t)
                }));
                logAudit(`Cancelled Task #${id}`, 'In Progress', 'Cancelled', `Reason: ${reason}`);
                showToast(`Task #${id} has been cancelled.`);
                closeModal();
            }} className="space-y-3 text-xs">
                <div>
                    <label className="font-bold text-rose-600 block mb-1">Reason for cancellation *</label>
                    <textarea name="reason" required className="w-full border p-2 rounded" placeholder="E.g., Event postponed, scope changed..."></textarea>
                </div>
                <button type="submit" className="w-full py-2 bg-rose-600 text-white rounded font-bold">Confirm Cancellation</button>
            </form>
        );
    };

    const handleCreateNote = () => {
        openModal(
            '🗒️ Add Pinned Note',
            <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const newNote = {
                    id: `NTE-${Date.now()}`,
                    title: form.title.value,
                    category: form.category.value,
                    text: form.text.value,
                    private: form.isPrivate.checked,
                    pinned: true,
                    tags: [form.category.value],
                    date: new Date().toISOString().slice(0, 10)
                };
                await addNote(newNote);
                await logActivity('CEO_CREATED_NOTE', { noteId: newNote.id, title: newNote.title });
                updateData(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
                logAudit(`Added Note #${newNote.id}`, 'N/A', newNote.title, 'Manual CEO notebook entry');
                showToast('Note added and pinned successfully.');
                closeModal();


            }} className="space-y-3 text-xs">
                <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Note Title *</label>
                    <input name="title" required className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Category</label>
                    <input name="category" defaultValue="Strategy" className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Content *</label>
                    <textarea name="text" required className="w-full border p-2 rounded h-24"></textarea>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" name="isPrivate" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <span>Private Note (Only Visible to CEO)</span>
                </label>
                <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded font-bold">Save Note</button>
            </form>
        );
    };

    const handleConvertNote = (noteId, type) => {
        const note = data.notes.find(n => n.id === noteId);
        if (!note) return;

        if (type === 'task') {
            const newTask = {
                id: `TSK-NTE-${Math.floor(100 + Math.random() * 900)}`,
                title: note.title,
                desc: note.text,
                priority: 'High',
                category: note.category,
                startDate: new Date().toISOString().slice(0,10),
                dueDate: new Date().toISOString().slice(0,10),
                dueTime: '18:00',
                duration: '30 mins',
                dept: 'Operations',
                assignedTo: 'Operations Head',
                gallery: 'HQ',
                status: 'In Progress'
            };
            updateData(prev => ({
                ...prev,
                tasks: [newTask, ...prev.tasks],
                notes: prev.notes.filter(n => n.id !== noteId)
            }));
            logAudit(`Converted Note #${noteId} to Task #${newTask.id}`, note.title, 'Task active', 'Notepad integration');
            showToast('Note successfully converted to Personal Task!');
        }
    };

    const handleRecordMOM = (mtg) => {
        openModal(
            `📝 Record Minutes for: ${mtg.title}`,
            <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newMOM = {
                    meetingId: mtg.id,
                    title: mtg.title,
                    date: mtg.date,
                    participants: mtg.participants.map(p => `${p.name} (${p.designation})`).join(', ') + `, Vivek Patil (CEO)`,
                    agenda: mtg.agenda.objective,
                    discussion: form.discussion.value,
                    decisions: form.decisions.value.split('\n').filter(d => d.trim()),
                    actionItems: [
                        { action: form.action1.value, owner: form.owner1.value, deadline: form.deadline1.value || mtg.date, priority: 'High', status: 'Pending' },
                        { action: form.action2.value, owner: form.owner2.value, deadline: form.deadline2.value || mtg.date, priority: 'High', status: 'Pending' }
                    ].filter(ai => ai.action.trim())
                };

                updateData(prev => ({
                    ...prev,
                    meetingMinutes: [newMOM, ...prev.meetingMinutes.filter(m => m.meetingId !== mtg.id)],
                    meetings: prev.meetings.map(m => m.id === mtg.id ? { ...m, status: 'Minutes Completed' } : m)
                }));
                logAudit(`Logged Minutes & MOM for Meeting #${mtg.id}`, 'Minutes Pending', 'Minutes Completed', 'conducted meeting summary saved');
                showToast('MOM logged successfully. Action items available for automation.');
                closeModal();
            }} className="space-y-3 text-xs max-h-[85vh] overflow-y-auto pr-1">
                <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Discussion Summary *</label>
                    <textarea name="discussion" required className="w-full border p-2 rounded h-20" placeholder="Describe the discussion points..."></textarea>
                </div>
                <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Key Decisions (One per line) *</label>
                    <textarea name="decisions" required className="w-full border p-2 rounded h-16" placeholder="Decision 1&#10;Decision 2..."></textarea>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border space-y-2">
                    <span className="font-bold text-[11px] text-slate-800">Action Item 1</span>
                    <input name="action1" required className="w-full border p-1.5 rounded bg-white" placeholder="Action description *" />
                    <div className="grid grid-cols-2 gap-2">
                        <input name="owner1" required className="border p-1.5 rounded bg-white" placeholder="Responsible Owner *" />
                        <input name="deadline1" type="date" className="border p-1.5 rounded bg-white" />
                    </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border space-y-2">
                    <span className="font-bold text-[11px] text-slate-800">Action Item 2 (Optional)</span>
                    <input name="action2" className="w-full border p-1.5 rounded bg-white" placeholder="Action description" />
                    <div className="grid grid-cols-2 gap-2">
                        <input name="owner2" className="border p-1.5 rounded bg-white" placeholder="Responsible Owner" />
                        <input name="deadline2" type="date" className="border p-1.5 rounded bg-white" />
                    </div>
                </div>
                <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded font-bold">Save MOM Minutes</button>
            </form>
        );
    };

    const handleIssueCommand = () => {
        openModal(
            '⚡ Issue Direct CEO Command Directive',
            <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newCmd = {
                    id: `CEO-00${Math.floor(242 + Math.random() * 500)}`,
                    title: form.title.value,
                    description: form.description.value,
                    department: form.department.value,
                    gallery: form.gallery.value || 'HQ',
                    location: 'National',
                    assignedTo: form.assignedTo.value,
                    supportingTeam: [form.supporting.value],
                    priority: form.priority.value,
                    startDate: new Date().toISOString().slice(0, 10),
                    deadline: form.deadline.value,
                    expectedOutcome: form.expectedOutcome.value,
                    kpi: 'Outcome achievement rate',
                    docs: [],
                    notes: 'CEO direct order',
                    followUpDate: form.deadline.value,
                    escalationDate: form.deadline.value,
                    status: 'In Progress',
                    progress: 0
                };

                updateData(prev => ({
                    ...prev,
                    commands: [newCmd, ...prev.commands]
                }));
                logAudit(`Issued CEO Directive #${newCmd.id}`, 'N/A', newCmd.title, 'Direct executive directive issued');
                showToast(`⚡ Directive Issued: ${newCmd.title}`);
                closeModal();
            }} className="space-y-3 text-xs max-h-[85vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Command Title *</label>
                        <input name="title" required className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Responsible Executive *</label>
                        <input name="assignedTo" required className="w-full border p-2 rounded" placeholder="E.g., CMO Suresh K." />
                    </div>
                </div>
                <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Operational Directive Description *</label>
                    <textarea name="description" required className="w-full border p-2 rounded h-20"></textarea>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Department</label>
                        <input name="department" defaultValue="Operations" className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Target Gallery</label>
                        <input name="gallery" defaultValue="Company-Wide" className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Priority</label>
                        <select name="priority" className="w-full border p-2 rounded">
                            <option>Critical</option>
                            <option>High</option>
                            <option>Normal</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Deadline *</label>
                        <input name="deadline" type="date" required className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Supporting Official</label>
                        <input name="supporting" defaultValue="DM Pune" className="w-full border p-2 rounded" />
                    </div>
                </div>
                <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Expected Outcome Target *</label>
                    <input name="expectedOutcome" required className="w-full border p-2 rounded" placeholder="E.g., Increase sales 30%" />
                </div>
                <button type="submit" className="w-full py-2 bg-slate-900 text-white rounded font-bold">Issue Executive Command</button>
            </form>
        );
    };

    // ----------------------------------------------------------------
    // CEO RENDER MODULES (renderCommands, renderProcessControl, etc.)
    // ----------------------------------------------------------------
    const renderCommands = () => {
        return (
            <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">⚡ CEO Directives & Active Commands</h3>
                        <p className="text-[11px] text-slate-500">Track implementation of CEO direct orders across galleries and departments.</p>
                    </div>
                    <button onClick={handleIssueCommand} className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-bold">
                        + Issue Direct Command
                    </button>
                </div>
                <div className="space-y-3">
                    {data.commands.map(cmd => (
                        <div key={cmd.id} className="p-4 border rounded-lg bg-slate-50 text-xs space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-black text-slate-900">Command #{cmd.id}: {cmd.title}</span>
                                <span className="bg-slate-200 px-2 py-0.5 rounded font-bold text-[9px] uppercase">{cmd.priority}</span>
                            </div>
                            <p className="text-slate-600">{cmd.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-500 text-[11px]">
                                <div><strong>Responsible:</strong> {cmd.assignedTo}</div>
                                <div><strong>Deadline:</strong> {cmd.deadline}</div>
                                <div><strong>Outcome Target:</strong> {cmd.expectedOutcome}</div>
                                <div><strong>Status:</strong> <span className="text-emerald-700 font-bold">{cmd.status}</span></div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                                    <span>Execution Progress</span>
                                    <span>{cmd.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${cmd.progress}%` }}></div>
                                </div>
                            </div>
                            <div className="pt-2 border-t flex gap-2">
                                <button onClick={() => {
                                    const nextProgress = Math.min(100, cmd.progress + 10);
                                    updateData(prev => ({
                                        ...prev,
                                        commands: prev.commands.map(c => c.id === cmd.id ? { ...c, progress: nextProgress, status: nextProgress === 100 ? 'Completed' : 'In Progress' } : c)
                                    }));
                                    showToast(`Progress updated to ${nextProgress}%`);
                                }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[9px]">Update Progress</button>
                                <button onClick={() => showToast(`Status explanation request sent to ${cmd.assignedTo}`)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[9px]">Request Status</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderProcessControl = () => {
        return (
            <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                <div className="border-b pb-2">
                    <h3 className="font-bold text-slate-800 text-sm">🔄 Company-Wide Process Auditing & Controls</h3>
                    <p className="text-[11px] text-slate-500">Live lifecycle tracking of operations, compliance approvals, and recruitment.</p>
                </div>
                <div className="space-y-3">
                    {data.processes.map((proc, idx) => (
                        <div key={idx} className="p-4 border rounded bg-slate-50 text-xs space-y-2">
                            <div className="flex justify-between font-bold">
                                <span className="text-slate-900">{proc.name}</span>
                                <span className="text-slate-400 font-normal">Accountable: {proc.owner}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-slate-500">
                                <div><strong>Pending Duration:</strong> {proc.daysPending} / {proc.slaDays} SLA Days</div>
                                <div><strong>Delay Reason:</strong> {proc.delayReason}</div>
                                <div><strong>Last Action:</strong> {proc.lastActivity}</div>
                                <div><strong>Next Milestone:</strong> <span className="text-emerald-700 font-bold">{proc.nextAction}</span></div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 block font-bold">Workflow Progress Steps</span>
                                <div className="flex flex-wrap gap-1">
                                    {proc.stages.map((stage, sidx) => (
                                        <span key={sidx} className={`px-2 py-0.5 rounded text-[9px] font-bold ${sidx === proc.activeStageIndex ? 'bg-indigo-600 text-white' : sidx < proc.activeStageIndex ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                                            {stage}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderApprovalCenter = () => {
        return (
            <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                <div className="border-b pb-2">
                    <h3 className="font-bold text-slate-800 text-sm">✅ Executive Approval Hub</h3>
                    <p className="text-[11px] text-slate-500">Authorize high-value procurement, compensation requests, and budget overrides.</p>
                </div>
                <div className="space-y-3">
                    {data.approvals.map(app => (
                        <div key={app.id} className="p-4 border rounded bg-slate-50 text-xs flex justify-between items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded text-[9px] uppercase">{app.dept}</span>
                                    <span className="font-bold text-slate-900">{app.title}</span>
                                </div>
                                <p className="text-slate-500">{app.details}</p>
                                <div className="text-[10px] text-slate-400">Requested: {app.date} • Requester: {app.requestedBy}</div>
                            </div>
                            <div className="shrink-0 flex flex-col items-end gap-2">
                                <span className="font-black text-emerald-700 text-sm">{app.amount}</span>
                                {app.status === 'Pending' ? (
                                    <div className="flex gap-1.5">
                                        <button onClick={() => {
                                            updateData(prev => ({ ...prev, approvals: prev.approvals.map(a => a.id === app.id ? { ...a, status: 'Approved' } : a) }));
                                            logAudit(`Approved Request #${app.id}`, 'Pending', 'Approved', app.title);
                                            showToast(`Approved Request #${app.id}`);
                                        }} className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]">Approve</button>
                                        <button onClick={() => {
                                            updateData(prev => ({ ...prev, approvals: prev.approvals.map(a => a.id === app.id ? { ...a, status: 'Rejected' } : a) }));
                                            logAudit(`Rejected Request #${app.id}`, 'Pending', 'Rejected', app.title);
                                            showToast(`Rejected Request #${app.id}`, 'error');
                                        }} className="px-2.5 py-1 bg-rose-600 text-white rounded font-bold text-[10px]">Reject</button>
                                    </div>
                                ) : (
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{app.status}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderPersonalOffice = () => {
        return (
            <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">📋 CEO Personal Task Control</h3>
                        <p className="text-[11px] text-slate-500">End-of-day checklist and pending corporate actions.</p>
                    </div>
                    <button onClick={handleCreateTask} className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-bold">
                        + Add Personal Task
                    </button>
                </div>
                <div className="space-y-2">
                    {data.tasks.map(tsk => (
                        <div key={tsk.id} className="p-3 border rounded bg-slate-55 text-xs flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${tsk.priority === 'Critical' ? 'bg-rose-500' : tsk.priority === 'High' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                    <span className={`font-semibold ${tsk.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-850'}`}>{tsk.title}</span>
                                </div>
                                <p className="text-slate-500 text-[10px] mt-0.5">{tsk.desc} • Due: {tsk.dueDate} @ {tsk.dueTime}</p>
                            </div>
                            {tsk.status !== 'Completed' && tsk.status !== 'Cancelled' ? (
                                <div className="flex gap-1.5">
                                    <button onClick={() => {
                                        updateData(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === tsk.id ? { ...t, status: 'Completed' } : t) }));
                                        logAudit(`Completed Task #${tsk.id}`, 'In Progress', 'Completed', tsk.title);
                                        showToast('Task marked completed.');
                                    }} className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold">Done</button>
                                    <button onClick={() => handleCancelTask(tsk.id)} className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold">Cancel</button>
                                </div>
                            ) : (
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${tsk.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{tsk.status}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderFinancialCommand = () => {
        return (
            <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                <div className="border-b pb-2">
                    <h3 className="font-bold text-slate-850 text-sm">💰 Financial Command & Budget Overrides</h3>
                    <p className="text-[11px] text-slate-500">Monitor budget variance thresholds and aging corporate invoice alerts.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-3 rounded-lg bg-slate-50 space-y-2 text-xs">
                        <span className="font-bold text-slate-700 block border-b pb-1">Department Budget Allocations</span>
                        {data.budgets.map((b, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px] py-1 border-b border-dashed">
                                <span className="font-semibold">{b.department}</span>
                                <span>Spent: <strong className="text-slate-800">{b.spent}</strong> / Allocated: {b.allocated}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border p-3 rounded-lg bg-slate-50 space-y-2 text-xs">
                        <span className="font-bold text-slate-700 block border-b pb-1">Outstanding Receivables Matrix</span>
                        <div className="text-[11px] space-y-1.5">
                            <div className="flex justify-between">
                                <span>Zenith Enterprises</span>
                                <span className="font-bold text-rose-700">₹12,50,000 (45 days overdue)</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Solapur Franchise</span>
                                <span className="font-bold text-amber-700">₹6,80,000 (15 days overdue)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGalleryCommand = () => {
        return (
            <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                <div className="border-b pb-2 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">🏢 Gallery Command Matrix</h3>
                        <p className="text-[11px] text-slate-500">Performance ratings and localized management overrides.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                        <thead className="bg-slate-100 font-bold">
                            <tr>
                                <th className="p-2.5">Gallery ID</th>
                                <th className="p-2.5">Name</th>
                                <th className="p-2.5">Target</th>
                                <th className="p-2.5">Sales</th>
                                <th className="p-2.5">Ach. %</th>
                                <th className="p-2.5">Territory Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.galleries.map(gal => (
                                <tr key={gal.id} className="border-b hover:bg-slate-50">
                                    <td className="p-2.5 font-mono text-slate-550">{gal.id}</td>
                                    <td className="p-2.5 font-bold text-slate-850">{gal.name}</td>
                                    <td className="p-2.5">{gal.target}</td>
                                    <td className="p-2.5 text-emerald-700 font-bold">{gal.sales}</td>
                                    <td className="p-2.5 font-mono">{gal.achPct}%</td>
                                    <td className="p-2.5">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${gal.status === 'green' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                            {gal.status === 'green' ? 'Green Line' : 'Red Alert'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const getGroupedEmployees = () => {
        const mergedEmployees = [...(usersList.length > 0 ? usersList : defaultData().employees)];
        
        const hqEmployees = [];
        const galleryGroups = {};

        mergedEmployees.forEach(emp => {
            const isHQ = !emp.galleryId || emp.galleryId.includes('HQ') || emp.galleryId === 'ALL' || ['superadmin', 'ceo', 'cto', 'hr', 'finance'].includes(emp.role);
            if (isHQ) {
                hqEmployees.push(emp);
            } else {
                const gId = emp.galleryId || emp.gallery || 'Other Galleries';
                if (!galleryGroups[gId]) {
                    galleryGroups[gId] = [];
                }
                galleryGroups[gId].push(emp);
            }
        });

        return { hqEmployees, galleryGroups };
    };

    const renderPeopleCommand = () => {
        const { hqEmployees, galleryGroups } = getGroupedEmployees();

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white p-5 rounded-xl border shadow-sm">
                    <div className="border-b pb-2 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">👥 Live Enterprise Directory</h3>
                            <p className="text-[11px] text-slate-500">Real-time listing of active staff members across Head Office and all Retail Galleries.</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                            Total Staff: {usersList.length > 0 ? usersList.length : defaultData().employees.length}
                        </span>
                    </div>
                </div>

                {/* Head Office (HQ) Section */}
                <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                        🏢 Corporate Head Office (HQ)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hqEmployees.map((emp, idx) => (
                            <div key={emp.uid || emp.id || idx} className="p-4 border rounded-xl bg-slate-50 text-xs hover:border-emerald-500 transition-colors flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{emp.name}</div>
                                            <div className="text-[10px] text-slate-500 font-mono">{emp.employeeId || 'EMP-2026'}</div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800">
                                            {emp.role?.toUpperCase().replace(/-/g, ' ')}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-slate-600">
                                        <div>Department: <strong>{emp.department || 'Management'}</strong></div>
                                        <div>Designation: <strong>{emp.designation || 'Executive'}</strong></div>
                                        <div>Email: <span className="font-mono text-slate-500">{emp.email}</span></div>
                                    </div>
                                </div>
                                <div className="border-t mt-3 pt-2 text-[10px] text-slate-400 flex justify-between items-center">
                                    <span>Status: <strong className="text-emerald-600 font-semibold">Active</strong></span>
                                    <span>Location: {emp.galleryId || 'HQ Global'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Galleries Section */}
                <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                        🏪 Retail Galleries & Field Staff
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(galleryGroups).map(([galleryId, staffList]) => (
                            <div key={galleryId} className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                                <div className="border-b pb-2 flex justify-between items-center">
                                    <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        📍 {galleryId.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                                        {staffList.length} Personnel
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {staffList.map((emp, idx) => (
                                        <div key={emp.uid || emp.id || idx} className="p-3 border rounded-lg bg-slate-55 hover:bg-slate-100/50 transition-colors flex justify-between items-center text-xs">
                                            <div>
                                                <div className="font-bold text-slate-900">{emp.name}</div>
                                                <div className="text-[10px] text-slate-500">{emp.designation || emp.role} • {emp.email}</div>
                                            </div>
                                            <div className="text-right text-[10px] text-slate-500 space-y-0.5">
                                                <div>Employee ID: <strong className="text-slate-700 font-mono">{emp.employeeId || 'N/A'}</strong></div>
                                                <div>State: <strong className="text-slate-700">{emp.stateId || 'MH'}</strong></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderAuditCenter = () => {
        return (
            <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                <div className="border-b pb-2">
                    <h3 className="font-bold text-slate-800 text-sm">🕵️ Executive Audit & Accountability Trail</h3>
                    <p className="text-[11px] text-slate-500">Tamper-evident logs of every data mutation, parameter change, and approval override.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                        <thead className="bg-slate-100 font-bold">
                            <tr>
                                <th className="p-2.5">Audit ID</th>
                                <th className="p-2.5">User</th>
                                <th className="p-2.5">Mutation</th>
                                <th className="p-2.5">Time</th>
                                <th className="p-2.5">Before</th>
                                <th className="p-2.5">After</th>
                                <th className="p-2.5">Approved By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.auditLog.map(aud => (
                                <tr key={aud.id} className="border-b hover:bg-slate-50">
                                    <td className="p-2.5 font-mono text-emerald-700 font-bold">{aud.id}</td>
                                    <td className="p-2.5 font-semibold text-slate-850">{aud.who}</td>
                                    <td className="p-2.5">{aud.what}</td>
                                    <td className="p-2.5 text-[10px] text-slate-400 font-mono">{aud.when}</td>
                                    <td className="p-2.5 text-rose-600 font-semibold">{aud.before}</td>
                                    <td className="p-2.5 text-emerald-650 font-bold">{aud.after}</td>
                                    <td className="p-2.5 font-semibold">{aud.approvedBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 4. Other Modules placeholders
    const renderSectionHeader = (title, icon, subtitle) => (
        <div className="bg-white p-6 rounded-xl border shadow-sm text-center space-y-2">
            <i className={`fa-solid ${icon} text-4xl text-emerald-600 mb-2`}></i>
            <h3 className="text-lg font-black text-slate-800 uppercase">{title} Hub</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">{subtitle}</p>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar Navigation - Vibrant Solid Emerald Green Theme */}
            <aside
                style={{ backgroundColor: '#047857', color: '#ffffff' }}
                className={`w-64 flex flex-col shrink-0 fixed inset-y-0 left-0 z-50 transition-transform border-r border-emerald-600 shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}
            >
                <div style={{ backgroundColor: '#03543f' }} className="p-4 border-b border-emerald-600 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white text-[#047857] font-black flex items-center justify-center text-base shadow-md">e</div>
                    <span className="font-black text-white text-base tracking-tight leading-none">ePay <span className="text-emerald-200 font-extrabold">CEO</span></span>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs" style={{ backgroundColor: '#047857' }}>
                    <div className="text-[10px] uppercase font-black tracking-wider px-3 py-1.5" style={{ color: '#a7f3d0' }}>CEO Command Center</div>
                    {[
                        ['dashboard', 'Executive Dashboard', 'fa-gauge-high'],
                        ['action-required', 'Action Required', 'fa-triangle-exclamation'],
                        ['ceo-commands', 'CEO Commands', 'fa-bolt'],
                        ['process-control', 'Process Control', 'fa-gears'],
                        ['task-control', 'Task Control', 'fa-list-check'],
                        ['approval-center', 'Approval Center', 'fa-clipboard-check'],
                        ['escalations', 'Escalations', 'fa-circle-exclamation'],
                    ].map(([id, label, icon]) => (
                        <div
                            key={id}
                            onClick={() => { setCurrentSection(id); setSidebarOpen(false); }}
                            style={currentSection === id ? { backgroundColor: '#10b981', color: '#ffffff' } : { color: '#ecfdf5' }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${currentSection === id ? 'font-black shadow-lg shadow-emerald-900/40' : 'hover:bg-[#03543f] hover:text-white font-medium'}`}
                        >
                            <i className={`fa-solid ${icon} w-4 text-center`}></i>{label}
                        </div>
                    ))}

                    <div className="text-[10px] uppercase font-black tracking-wider px-3 py-1.5 pt-4" style={{ color: '#a7f3d0' }}>👤 CEO Personal Office</div>
                    {[
                        ['ceo-tasks', 'My Daily Tasks', 'fa-list-check'],
                        ['ceo-calendar', 'My Calendar', 'fa-calendar-days'],
                        ['ceo-meetings', 'Meetings Workspace', 'fa-comments'],
                        ['ceo-mom', 'Meeting Minutes (MOM)', 'fa-file-lines'],
                        ['ceo-notepad', 'My Notepad', 'fa-note-sticky'],
                        ['ceo-ideas', 'Ideas & Strategy', 'fa-lightbulb'],
                        ['ceo-decisions', 'Decision Register', 'fa-brain'],
                        ['ceo-followups', 'Follow-Ups', 'fa-arrows-spin'],
                        ['ceo-alerts', 'Alerts & Notifications', 'fa-bell'],
                        ['ceo-daily-closing', 'Daily Closing Reflection', 'fa-moon'],
                    ].map(([id, label, icon]) => (
                        <div
                            key={id}
                            onClick={() => { setCurrentSection(id); setSidebarOpen(false); }}
                            style={currentSection === id ? { backgroundColor: '#10b981', color: '#ffffff' } : { color: '#ecfdf5' }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${currentSection === id ? 'font-black shadow-lg shadow-emerald-900/40' : 'hover:bg-[#03543f] hover:text-white font-medium'}`}
                        >
                            <i className={`fa-solid ${icon} w-4 text-center`}></i>{label}
                        </div>
                    ))}

                    <div className="text-[10px] uppercase font-black tracking-wider px-3 py-1.5 pt-4" style={{ color: '#a7f3d0' }}>💰 Command & Reports</div>
                    {[
                        ['financial-command', 'Financial Command', 'fa-coins'],
                        ['gallery-command', 'Gallery Command', 'fa-store'],
                        ['people-command', 'People Command', 'fa-users'],
                        ['sales-command', 'Sales Command', 'fa-chart-line'],
                        ['marketing-command', 'Marketing Command', 'fa-bullhorn'],
                        ['operations-command', 'Operations Command', 'fa-toolbox'],
                        ['technology-command', 'Technology Command', 'fa-laptop-code'],
                        ['customer-command', 'Customer Command', 'fa-headset'],
                        ['vendor-command', 'Vendor Command', 'fa-handshake'],
                        ['franchise-command', 'Franchise Command', 'fa-network-wired'],
                        ['executive-reports', 'Executive Reports', 'fa-chart-pie'],
                        ['analytics', 'Analytics', 'fa-chart-column'],
                        ['global-search', 'Global Search', 'fa-magnifying-glass'],
                        ['audit-accountability', 'Audit & Accountability', 'fa-clock-rotate-left'],
                    ].map(([id, label, icon]) => (
                        <div
                            key={id}
                            onClick={() => { setCurrentSection(id); setSidebarOpen(false); }}
                            style={currentSection === id ? { backgroundColor: '#10b981', color: '#ffffff' } : { color: '#ecfdf5' }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${currentSection === id ? 'font-black shadow-lg shadow-emerald-900/40' : 'hover:bg-[#03543f] hover:text-white font-medium'}`}
                        >
                            <i className={`fa-solid ${icon} w-4 text-center`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Workspace Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-slate-600 text-lg">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <div className="text-sm font-bold text-slate-850">ePay Executive Command Center</div>
                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded">CEO Workspace Panel</div>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    {currentSection === 'dashboard' && renderDashboardTopSection()}
                    {currentSection === 'action-required' && <div className="space-y-4"><h2 className="text-lg font-bold text-slate-800">🚨 Action Required Inbox</h2>{data.actionRequired.map(act => (
                        <div key={act.id} className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${act.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{act.severity}</span>
                                <h4 className="font-bold text-slate-900 text-sm mt-1">{act.title}</h4>
                                <p className="text-xs text-slate-600">{act.desc}</p>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleActionItem(act.id, 'Approve')} className="px-2.5 py-1.5 bg-emerald-600 text-white rounded font-bold text-xs">Approve</button>
                                <button onClick={() => handleActionItem(act.id, 'Reject')} className="px-2.5 py-1.5 bg-rose-600 text-white rounded font-bold text-xs">Reject</button>
                                <button onClick={() => handleActionItem(act.id, 'Escalate')} className="px-2.5 py-1.5 bg-amber-500 text-white rounded font-bold text-xs">Escalate</button>
                            </div>
                        </div>
                    ))}</div>}
                    {currentSection === 'ceo-commands' && renderCommands()}
                    {currentSection === 'process-control' && renderProcessControl()}
                    {currentSection === 'task-control' && <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3"><h2 className="text-lg font-bold text-slate-800">📋 CEO Task Control</h2><button onClick={handleCreateTask} className="px-3 py-1.5 bg-slate-950 text-white rounded text-xs font-bold">+ Create Task</button><div className="space-y-2 mt-2">{data.tasks.map(t => (
                        <div key={t.id} className="p-3 border rounded text-xs flex justify-between items-center bg-slate-50">
                            <div><strong className="text-slate-800">{t.title}</strong><div className="text-[10px] text-slate-400">{t.desc}</div></div>
                            <button onClick={() => handleCancelTask(t.id)} className="px-2 py-1 bg-rose-600 text-white font-bold rounded text-[10px]">Cancel Task</button>
                        </div>
                    ))}</div></div>}
                    {currentSection === 'approval-center' && renderApprovalCenter()}
                    {currentSection === 'escalations' && renderSectionHeader('Escalations', 'fa-circle-exclamation', 'Surfaced SLA breaches, delayed projects, and critical warning overrides.')}

                    {/* Personal Office Subsections */}
                    {currentSection === 'ceo-tasks' && renderPersonalOffice()}
                    {currentSection === 'ceo-calendar' && renderSectionHeader('CEO Calendar Matrix', 'fa-calendar-days', 'Day, Week, Month schedule of all corporate meetings and operations reviews.')}
                    {currentSection === 'ceo-meetings' && renderMeetingsModule()}
                    {currentSection === 'ceo-mom' && renderMeetingsModule()}
                    {currentSection === 'ceo-notepad' && <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3"><h2 className="text-lg font-bold text-slate-800">🗒️ My Notepad Workspace</h2><button onClick={handleCreateNote} className="px-3 py-1.5 bg-slate-950 text-white rounded text-xs font-bold">+ Create Note</button><div className="space-y-3 mt-2">{data.notes.map(note => (
                        <div key={note.id} className="p-3 border rounded bg-slate-50 text-xs">
                            <span className="font-bold text-slate-800">{note.private ? '🔒' : '👥'} {note.title}</span>
                            <p className="text-slate-600 mt-1">{note.text}</p>
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => handleConvertNote(note.id, 'task')} className="text-emerald-700 font-bold hover:underline">Convert to Task</button>
                            </div>
                        </div>
                    ))}</div></div>}
                    {currentSection === 'ceo-ideas' && renderSectionHeader('Ideas & Strategy Workspace', 'fa-lightbulb', 'Tracks pipeline for new metric targets, expansion plans, cost-cutting initiatives.')}
                    {currentSection === 'ceo-decisions' && <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3"><h2 className="text-lg font-bold text-slate-800">🧠 Decision Register Workspace</h2><div className="space-y-2">{data.decisions.map(d => (
                        <div key={d.id} className="p-3 border rounded bg-slate-50 text-xs flex justify-between">
                            <div><strong className="text-slate-900">#{d.id} — {d.title}</strong><div className="text-[10px] text-slate-500">Rationale: {d.reason}</div></div>
                            <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase self-center">{d.status}</span>
                        </div>
                    ))}</div></div>}
                    {currentSection === 'ceo-followups' && <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3"><h2 className="text-lg font-bold text-slate-800">🔁 Follow-Ups Manager</h2><div className="space-y-2">{data.followups.map(f => (
                        <div key={f.id} className="p-3 border rounded bg-slate-50 text-xs flex justify-between">
                            <div><strong>{f.title}</strong><div className="text-[10px] text-slate-500">Responsible: {f.person} • Due: {f.date}</div></div>
                            <button onClick={() => {
                                updateData(prev => ({ ...prev, followups: prev.followups.filter(item => item.id !== f.id) }));
                                showToast('Follow-up completed.');
                            }} className="px-2 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]">Complete</button>
                        </div>
                    ))}</div></div>}
                    {currentSection === 'ceo-alerts' && renderAlertsCenterModule()}
                    {currentSection === 'ceo-daily-closing' && <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3"><h2 className="text-lg font-bold text-slate-800">🌙 Daily Closing Reflection Workspace</h2><form onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target;
                        const ref = {
                            date: new Date().toISOString().slice(0, 10),
                            wentWell: form.wentWell.value,
                            wentWrong: form.wentWrong.value,
                            observations: form.observations.value,
                            priorities: form.priorities.value,
                            followup: form.followup.value
                        };
                        updateData(prev => ({ ...prev, reflections: [ref, ...prev.reflections] }));
                        showToast('🌙 Reflection saved in closing register.');
                    }} className="space-y-3 text-xs">
                        <textarea name="wentWell" required className="w-full border p-2 rounded" placeholder="What went well today?"></textarea>
                        <textarea name="wentWrong" required className="w-full border p-2 rounded" placeholder="What went wrong today?"></textarea>
                        <textarea name="observations" required className="w-full border p-2 rounded" placeholder="Key Observations"></textarea>
                        <textarea name="priorities" required className="w-full border p-2 rounded" placeholder="Tomorrow Priorities"></textarea>
                        <textarea name="followup" required className="w-full border p-2 rounded" placeholder="Followup required"></textarea>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded font-bold">Log Reflection</button>
                    </form></div>}

                    {/* Command Hubs */}
                    {currentSection === 'financial-command' && renderFinancialCommand()}
                    {currentSection === 'gallery-command' && renderGalleryCommand()}
                    {currentSection === 'people-command' && renderPeopleCommand()}
                    {currentSection === 'sales-command' && renderSectionHeader('Sales Command', 'fa-chart-line', 'Analyzes lead pipelines, conversion stats, and state-wise targets.')}
                    {currentSection === 'marketing-command' && renderSectionHeader('Marketing Command', 'fa-bullhorn', 'ROI metric analytics for outdoor billboards and Meta ad campaigns.')}
                    {currentSection === 'operations-command' && renderSectionHeader('Operations Command', 'fa-toolbox', 'Stock levels, transit damage tracking, and warehouse compliance.')}
                    {currentSection === 'technology-command' && renderSectionHeader('Technology Command', 'fa-laptop-code', 'POS API gateway latencies, bug backlog, and database replicas.')}
                    {currentSection === 'customer-command' && renderSectionHeader('Customer Command', 'fa-headset', 'NPS tracking score, client retention reviews, and SLA breaches.')}
                    {currentSection === 'vendor-command' && renderSectionHeader('Vendor Command', 'fa-handshake', 'SLA evaluation score metrics for hardware kiosk partners.')}
                    {currentSection === 'franchise-command' && renderSectionHeader('Franchise Command', 'fa-network-wired', 'TracksSolapur and Nashik expansions, fee modeling, and legal clearances.')}

                    {/* System & Audit */}
                    {currentSection === 'executive-reports' && renderSectionHeader('Executive Reports', 'fa-chart-pie', '15 custom daily, weekly, and monthly reports.')}
                    {currentSection === 'analytics' && renderSectionHeader('Analytics Engine', 'fa-chart-column', 'Consolidated financial ledgers and performance matrices.')}
                    {currentSection === 'global-search' && <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3"><h2 className="text-lg font-bold text-slate-800">🔍 Global Search</h2><input value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} className="w-full border p-2 rounded text-xs" placeholder="Filter by Name, ID, or amount..." /><div className="mt-2 text-xs text-slate-500">Query filtering active across database indexes.</div></div>}
                    {currentSection === 'audit-accountability' && renderAuditCenter()}
                </main>
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="font-extrabold text-base text-slate-900">{modal.title}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 text-xl font-bold">&times;</button>
                        </div>
                        {modal.content}
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-5 right-5 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-slate-900 border border-emerald-500 z-50">
                    {toast.msg}
                </div>
            )}
        </div>
    );
}
