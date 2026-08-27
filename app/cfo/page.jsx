'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { useAuth } from '@/lib/auth-context';



// ============================================================================
// FULL ePAY CFO — FINANCE COMMAND & CONTROL CENTRE
// 360° Audit Trail, Team Supervision, Approvals, Accountability & Governance
// ============================================================================
const STORAGE_KEY = 'epay_cfo_crm_v4';

const defaultCfoDb = () => ({
  user: {
    name: 'Anil Deshmukh',
    role: 'Chief Financial Officer (CFO)',
    company: 'ePay Digital Gallery India Pvt Ltd',
    avatar: 'AD',
    email: 'cfo@epaygallery.com',
    authorityTier: 'Executive Tier-1 Authority (Up to ₹5,00,000)'
  },
  periodLock: {
    lockedPeriod: 'July 2026',
    isLocked: true,
    lockedBy: 'Anil Deshmukh (CFO)',
    lockedAt: '2026-08-01 18:30:00',
    currentPeriod: 'August 2026'
  },
  // 1. TOP LEVEL FINANCIAL METRICS & COUNTERS
  metrics: {
    totalRevenue: 48500000,
    totalExpense: 17200000,
    netProfit: 31300000,
    netMargin: 64.5,
    cashPosition: 8240000,
    bankBalance: 7490000,
    cashInHand: 750000,
    accountsReceivable: 3620000,
    accountsPayable: 2150000,
    pendingCfoApprovals: 17,
    financeExceptions: 8,
    overdueReceivables: 5,
    vendorPaymentsDue: 8,
    pendingRefunds: 3,
    gstExceptions: 2,
    monthEndClosing: 85,
    todayPayments: 1840000,
    todayCollections: 2210000
  },
  // 2. FINANCE CONTROL CENTRE ANOMALIES
  controlCenterIssues: [
    { id: 'CFO-101', severity: 'critical', title: '5 Transactions Require Immediate CFO Review & Clearance', category: 'High-Value Approvals', count: 5, amount: '₹28,50,000', status: 'Immediate Review' },
    { id: 'CFO-102', severity: 'critical', title: '17 CFO Approvals Pending in Queue (>24h SLA Warning)', category: 'Approval Queue', count: 17, amount: '₹42,10,000', status: 'Action Needed' },
    { id: 'CFO-103', severity: 'important', title: '8 Vendor Bills Due for Disbursement Today', category: 'Accounts Payable', count: 8, amount: '₹14,80,000', status: 'Due Today' },
    { id: 'CFO-104', severity: 'critical', title: '5 Overdue Receivables Exceeding 60 Days Threshold', category: 'Accounts Receivable', count: 5, amount: '₹18,20,000', status: 'Escalated' },
    { id: 'CFO-105', severity: 'important', title: '3 Customer Refunds Awaiting Verification', category: 'Refunds', count: 3, amount: '₹1,85,000', status: 'Pending Review' },
    { id: 'CFO-106', severity: 'important', title: '4 Finance Team Overdue Tasks in Reconciliation', category: 'Team SLA', count: 4, amount: '—', status: 'SLA Breached' },
    { id: 'CFO-107', severity: 'critical', title: '2 GST Invoice ITC Discrepancies on Vendor Portals', category: 'Tax Compliance', count: 2, amount: '₹1,45,000 ITC', status: 'Audit Flag' },
    { id: 'CFO-108', severity: 'important', title: '3 Backdated Entries Attempted without Authorization', category: 'Period Integrity', count: 3, amount: '₹75,000', status: 'Blocked' },
    { id: 'CFO-109', severity: 'important', title: '2 Duplicate Vendor Invoices Detected by ERP Engine', category: 'Fraud Control', count: 2, amount: '₹90,000', status: 'Held' }
  ],
  // 3. FINANCE TEAM SUPERVISION (Employee Performance)
  teamMembers: [
    { id: 'EMP-FIN-01', name: 'Rohan Joshi', role: 'Senior Finance Executive', tasks: 32, completed: 27, pending: 5, rejected: 1, sla: 94, status: '🟢 Optimal', specialization: 'Banking & Cash Reconciliation' },
    { id: 'EMP-FIN-02', name: 'Meera Sen', role: 'Finance Executive (AP/AR)', tasks: 28, completed: 19, pending: 9, rejected: 3, sla: 81, status: '🟠 Attention Needed', specialization: 'Customer Invoices & Refunds' },
    { id: 'EMP-FIN-03', name: 'Vikas Shah (CA)', role: 'Finance & Taxation Manager', tasks: 21, completed: 20, pending: 1, rejected: 0, sla: 98, status: '🟢 Optimal', specialization: 'GST Returns & Statutory Audit' },
    { id: 'EMP-FIN-04', name: 'Suresh Patil', role: 'Junior Accounts Officer', tasks: 18, completed: 15, pending: 3, rejected: 2, sla: 86, status: '🟢 Good', specialization: 'Petty Cash & Voucher Entry' }
  ],
  // 4. EMPLOYEE DAILY ACTIVITY TIMELINE (08:58 to 17:00)
  dailyActivities: [
    { time: '08:58 AM', user: 'Rohan Joshi', action: 'System Login & Session Authenticated', txnId: 'AUTH-901', module: 'Security', remarks: 'HQ Finance Terminal IP 192.168.1.45', status: 'Verified' },
    { time: '09:10 AM', user: 'Meera Sen', action: 'Verified Sales Invoices Batch (48 invoices)', txnId: 'INV-BATCH-08', module: 'Receivables', remarks: 'Corporate travel packages for Pune B2B clients', status: 'Completed' },
    { time: '09:35 AM', user: 'Rohan Joshi', action: 'HDFC Corporate Bank Reconciliation (Stmt #8821)', txnId: 'REC-HDFC-991', module: 'Banking', remarks: 'Matched ₹14.5L NEFT credits from clients', status: 'Reconciled' },
    { time: '10:15 AM', user: 'Suresh Patil', action: 'Prepared Vendor Payment Batch for Cloud & Rent', txnId: 'PAY-BATCH-04', module: 'Payables', remarks: 'AWS Mumbai & DLF Cyber Pune rent vouchers', status: 'Submitted' },
    { time: '11:20 AM', user: 'Meera Sen', action: 'Audited Travel Allowance Claims (12 staff)', txnId: 'CLM-TRV-882', module: 'Expenses', remarks: 'Flagged 1 duplicate Uber receipt for ₹3,200', status: 'Flagged' },
    { time: '12:10 PM', user: 'Vikas Shah (CA)', action: 'Reconciled GSTR-2B Input Tax Credit for August', txnId: 'GST-2B-AUG', module: 'GST & Tax', remarks: 'Resolved 2 vendor GSTIN invoice mismatches', status: 'Completed' },
    { time: '02:15 PM', user: 'Meera Sen', action: 'Processed Customer Refund Ticket #RF-9042', txnId: 'RF-9042', module: 'Refunds', remarks: 'Zenith Travel package cancellation after visa rejection', status: 'Queued for CFO' },
    { time: '03:30 PM', user: 'Rohan Joshi', action: 'Executed Bank CMS Disbursal for Vendor Bills', txnId: 'CMS-DISB-102', module: 'Banking', remarks: 'Disbursed ₹18.4L approved payments', status: 'Completed' },
    { time: '04:45 PM', user: 'Vikas Shah (CA)', action: 'Updated August Month-End Closing Checklist', txnId: 'MTH-CLOSE-08', module: 'Month-End', remarks: 'Progress updated from 80% to 85%', status: 'In Progress' }
  ],
  // 5. FINANCE WORK QUEUE
  workQueue: [
    { item: 'Invoices Verification', count: 18, assignedTo: 'Meera Sen', urgency: 'Normal' },
    { item: 'Payment Approvals', count: 11, assignedTo: 'Anil Deshmukh (CFO)', urgency: 'Critical' },
    { item: 'Bank Reconciliation', count: 7, assignedTo: 'Rohan Joshi', urgency: 'High' },
    { item: 'Vendor Payments Due', count: 8, assignedTo: 'Suresh Patil', urgency: 'High' },
    { item: 'Refunds Verification', count: 3, assignedTo: 'Meera Sen', urgency: 'High' },
    { item: 'GST ITC Reconciliation', count: 4, assignedTo: 'Vikas Shah (CA)', urgency: 'Normal' },
    { item: 'Expense Vouchers', count: 19, assignedTo: 'Suresh Patil', urgency: 'Normal' },
    { item: 'Journal Entry Reviews', count: 6, assignedTo: 'Vikas Shah (CA)', urgency: 'Normal' },
    { item: 'Month-End Closing Tasks', count: 9, assignedTo: 'Finance Team Total', urgency: 'High' }
  ],
  // 6. WHO DID WHAT — 360° ACCOUNTABILITY AUDIT TRAIL
  accountabilityLogs: [
    {
      txnId: 'INV-2026-00851',
      type: 'Sales Invoice',
      customerVendor: 'Zenith Global Holidays',
      amount: 1250000,
      createdBy: 'Meera Sen (09:12 AM)',
      verifiedBy: 'Vikas Shah (CA) (10:30 AM)',
      approvedBy: 'Anil Deshmukh (CFO) (11:15 AM)',
      processedBy: 'Rohan Joshi (02:00 PM)',
      reconciledBy: 'Rohan Joshi (03:45 PM)',
      modifiedBy: 'None (Immutable)',
      finalStatus: 'COMPLETED'
    },
    {
      txnId: 'BILL-AWS-8831',
      type: 'Vendor Purchase Bill',
      customerVendor: 'Amazon Web Services India',
      amount: 345000,
      createdBy: 'Suresh Patil (08:45 AM)',
      verifiedBy: 'Vikas Shah (CA) (09:30 AM)',
      approvedBy: 'Anil Deshmukh (CFO) (10:00 AM)',
      processedBy: 'HDFC CMS Automated (11:30 AM)',
      reconciledBy: 'Rohan Joshi (12:15 PM)',
      modifiedBy: 'None',
      finalStatus: 'COMPLETED'
    },
    {
      txnId: 'RF-9042',
      type: 'Customer Refund',
      customerVendor: 'Zenith Travel Cancellation',
      amount: 185000,
      createdBy: 'Meera Sen (01:15 PM)',
      verifiedBy: 'Vikas Shah (CA) (02:00 PM)',
      approvedBy: 'Pending CFO Signoff',
      processedBy: '—',
      reconciledBy: '—',
      modifiedBy: 'Meera Sen (Updated Bank Details)',
      finalStatus: 'PENDING CFO APPROVAL'
    },
    {
      txnId: 'EXP-MKT-771',
      type: 'Marketing Campaign Expense',
      customerVendor: 'Google India Digital Services',
      amount: 450000,
      createdBy: 'Sunil Kumar (Marketing)',
      verifiedBy: 'Suresh Patil (02:30 PM)',
      approvedBy: 'Pending CFO Clearance',
      processedBy: '—',
      reconciledBy: '—',
      modifiedBy: 'None',
      finalStatus: 'PENDING CFO APPROVAL'
    }
  ],
  // 7. PENDING APPROVALS QUEUE (With 6 Status States)
  approvals: [
    { id: 'APP-101', type: 'Vendor Payment', title: 'DLF Cyber Properties Ltd (Pune Gallery August Rent)', amount: 350000, dept: 'Operations', gallery: 'Pune Central', submittedBy: 'Suresh Patil', verifiedBy: 'Vikas Shah', level: 'Level 2 (CFO)', status: 'Pending', risk: 'Low', submissionDate: '2026-08-25' },
    { id: 'APP-102', type: 'Vendor Payment', title: 'Dell Technologies India (50x Smart POS Terminals Capex)', amount: 1450000, dept: 'Technology', gallery: 'Company-Wide', submittedBy: 'Karan Mehra', verifiedBy: 'Vikas Shah', level: 'Level 3 (CFO + CEO)', status: 'Pending', risk: 'Medium', submissionDate: '2026-08-24' },
    { id: 'APP-103', type: 'Customer Refund', title: 'Refund #RF-9042 Zenith Global Tour Cancellation', amount: 185000, dept: 'Customer Ops', gallery: 'Mumbai East', submittedBy: 'Meera Sen', verifiedBy: 'Vikas Shah', level: 'Level 2 (CFO)', status: 'Pending', risk: 'Medium', submissionDate: '2026-08-25' },
    { id: 'APP-104', type: 'Marketing Expense', title: 'Meta & Google Festive Ads Boosting Campaign Q3', amount: 450000, dept: 'Marketing', gallery: 'Company-Wide', submittedBy: 'Sunil Kumar', verifiedBy: 'Suresh Patil', level: 'Level 2 (CFO)', status: 'Pending', risk: 'Low', submissionDate: '2026-08-25' },
    { id: 'APP-105', type: 'Staff Travel Claim', title: 'EMP-884 Rajesh Kumar Outstation Travel (Above Limit)', amount: 18500, dept: 'Sales', gallery: 'Pune Central', submittedBy: 'Rajesh Kumar', verifiedBy: 'Meera Sen', level: 'Level 1 (CFO Exception)', status: 'Pending', risk: 'High', submissionDate: '2026-08-24' }
  ],
  // 8. CONFIGURABLE APPROVAL LIMITS
  approvalLimits: [
    { tier: 'Tier 1 — Operational Limit', range: '₹0 – ₹25,000', approver: 'Finance Manager / Gallery Manager', description: 'Routine office supplies, petty cash & travel reimbursement' },
    { tier: 'Tier 2 — Senior Manager Limit', range: '₹25,001 – ₹1,00,000', approver: 'Senior Finance Manager (CA)', description: 'Standard vendor utility bills, marketing retainers & minor software' },
    { tier: 'Tier 3 — CFO Executive Limit', range: '₹1,00,001 – ₹5,00,000', approver: 'Chief Financial Officer (CFO)', description: 'Commercial rents, high-ticket refunds, campaign ad budgets & payroll' },
    { tier: 'Tier 4 — Board / CEO Joint Limit', range: '₹5,00,001+', approver: 'CFO + Chief Executive Officer (CEO)', description: 'Major Capex equipment, annual contracts, acquisitions & property leases' }
  ],
  // 9. HIGH-VALUE TRANSACTIONS WATCHLIST
  highValueTxns: [
    { id: 'HVT-01', txn: 'Staff Salary Disbursal (August 2026)', amount: 8250000, party: '124 Employees & Staff', gallery: 'All Galleries', risk: 'Low Risk (Payroll)', recommendation: 'Approve batch disbursal for 28-Aug' },
    { id: 'HVT-02', txn: 'Capex PO #DELL-PO-3301 Hardware Setup', amount: 1450000, party: 'Dell Technologies India', gallery: 'HQ / Galleries', risk: 'Medium Risk (Capex)', recommendation: 'Verified 3-quote competitive pricing' },
    { id: 'HVT-03', txn: 'B2B Client Invoice #INV-EP-4901 Recovery', amount: 1250000, party: 'Zenith Global Holidays', gallery: 'Mumbai East', risk: 'High Risk (>60d Overdue)', recommendation: 'Issue final legal notice before write-off' }
  ],
  // 10. CFO TASKS
  tasks: [
    { id: 'CFO-TSK-1', task: 'Review consolidated 90-day cash flow runway model', priority: 'High', dept: 'Treasury', responsible: 'Anil Deshmukh (CFO)', deadline: '2026-08-25', status: 'Completed' },
    { id: 'CFO-TSK-2', task: 'Authorize August vendor payment batch (₹18.4L)', priority: 'Critical', dept: 'Accounts Payable', responsible: 'Anil Deshmukh (CFO)', deadline: '2026-08-25', status: 'Completed' },
    { id: 'CFO-TSK-3', task: 'Review Gallery P&L profitability ranking with Retail Head', priority: 'Medium', dept: 'Operations', responsible: 'Vikas Shah', deadline: '2026-08-26', status: 'In Progress' },
    { id: 'CFO-TSK-4', task: 'Investigate GSTR-2B ITC vendor tax discrepancy (₹1.45L)', priority: 'High', dept: 'Taxation', responsible: 'Vikas Shah (CA)', deadline: '2026-08-26', status: 'In Progress' },
    { id: 'CFO-TSK-5', task: 'Approve Zenith Travel refund ticket #RF-9042 (₹1.85L)', priority: 'High', dept: 'Customer Ops', responsible: 'Anil Deshmukh (CFO)', deadline: '2026-08-25', status: 'Pending' }
  ],
  // 11. CFO NOTEPAD
  notes: [
    { id: 'CN-1', title: 'Q3 Treasury Liquidity & Fixed Deposit Laddering', date: '2026-08-24', tag: 'Treasury', content: 'Park ₹3.00Cr of surplus cash in 91-day SBI Flexi-FD earning 6.85% p.a. while maintaining ₹5.24Cr in liquid operating current accounts.', pinned: true },
    { id: 'CN-2', title: 'Vendor Payment Terms Renegotiation (DLF & AWS)', date: '2026-08-23', tag: 'Payables', content: 'Negotiate 45-day credit cycle with DLF Commercial Properties to match client billing collections.', pinned: true },
    { id: 'CN-3', title: 'Audit Observations for Statutory CA Visit', date: '2026-08-22', tag: 'Stat Audit', content: 'Ensure all 80G CSR donation receipts from Akshaya Patra and Teach for India are archived in digital audit binder.', pinned: false }
  ],
  // 12. CFO MEETINGS
  meetings: [
    { id: 'CMTG-01', time: '09:30 AM', title: 'Daily Finance Operations & Cash Settlement Review', attendees: 'Finance Executives & CA', status: 'Completed' },
    { id: 'CMTG-02', time: '11:00 AM', title: 'Executive Committee Working Capital Briefing', attendees: 'CEO, CFO, COO', status: 'Completed' },
    { id: 'CMTG-03', time: '02:30 PM', title: 'HDFC Corporate Banking RM Credit Facility Review', attendees: 'HDFC Senior Relationship Manager & CFO', status: 'Completed' },
    { id: 'CMTG-04', time: '04:30 PM', title: 'Month-End Closing & Statutory Tax Review', attendees: 'Vikas Shah (CA) & Audit Team', status: 'Scheduled (In 15m)' }
  ],
  // 13. CFO DECISION REGISTER
  decisions: [
    { id: 'DEC-2026-01', date: '2026-08-24', subject: 'Approval of Festive Marketing Budget Expansion (+₹4.5L)', amount: 450000, reason: 'High ROAS (435%) on luxury Dubai tour packages', decision: 'Approved conditionally on weekly CAC tracking < ₹10k', impact: 'Expected +₹22L Gross Revenue', followUp: 'Weekly Marketing Review' },
    { id: 'DEC-2026-02', date: '2026-08-22', subject: 'Enforcement of Strict ₹15,000 Travel Allowance Cap', amount: 0, reason: 'Prevent outstation claim budget inflation', decision: 'Enforced mandatory GPS receipt attachment on claims', impact: 'Saves estimated ₹1.8L monthly in inflated claims', followUp: 'HR Monthly Audit' }
  ],
  // 14. GALLERY-WISE P&L PROFITABILITY
  galleryPnL: [
    { gallery: 'Pune Central Gallery', revenue: 4200000, salary: 500000, rent: 200000, marketing: 100000, operations: 300000, otherExpenses: 200000, netProfit: 2900000, margin: 69.0, rank: 1 },
    { gallery: 'Mumbai East Gallery', revenue: 5800000, salary: 750000, rent: 450000, marketing: 200000, operations: 420000, otherExpenses: 310000, netProfit: 3670000, margin: 63.2, rank: 2 },
    { gallery: 'Nashik North Gallery', revenue: 2100000, salary: 280000, rent: 110000, marketing: 60000, operations: 140000, otherExpenses: 90000, netProfit: 1420000, margin: 67.6, rank: 3 },
    { gallery: 'Nagpur Central Gallery', revenue: 1600000, salary: 220000, rent: 90000, marketing: 50000, operations: 110000, otherExpenses: 70000, netProfit: 1060000, margin: 66.2, rank: 4 }
  ]
});

export default function CFOPage() {
  const { logActivity } = useAuth();
  const [db, setDb] = useState(defaultCfoDb());
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [activeToast, setActiveToast] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');


  // Live Firestore database subscriptions
  const { data: approvalsData, update: updateApproval } = useFirestore('approvals', defaultCfoDb().approvals);
  const { data: notesData, add: addNote } = useFirestore('notes', defaultCfoDb().notes);
  const { data: tasksData, update: updateTask } = useFirestore('tasks', defaultCfoDb().tasks);

  // Sync Firestore live queries to regional state db
  useEffect(() => {
    if (approvalsData) {
      setDb(prev => ({ ...prev, approvals: approvalsData }));
    }
  }, [approvalsData]);

  useEffect(() => {
    if (notesData) {
      setDb(prev => ({ ...prev, notes: notesData }));
    }
  }, [notesData]);

  useEffect(() => {
    if (tasksData) {
      setDb(prev => ({ ...prev, tasks: tasksData }));
    }
  }, [tasksData]);

  // Load persistence
  useEffect(() => {

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDb(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load CFO state', e);
    }
  }, []);

  const saveDb = (updated) => {
    setDb(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save CFO state', e);
    }
  };

  const showToast = (message, type = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => setActiveToast(null), 3500);
  };

  const getBadgeCount = (id) => {
    switch (id) {
      case 'controlCentre':
      case 'criticalAlerts':
        return db.controlCenterIssues.length;
      case 'approvals':
        return db.approvals.filter(a => a.status === 'Pending').length;
      case 'exceptions':
        return db.metrics.financeExceptions;
      case 'teamSupervision':
        return db.teamMembers.filter(m => m.sla < 90).length;
      default:
        return 0;
    }
  };

  // CFO SIDEBAR SECTIONS
  const navSections = [
    {
      group: 'COMMAND & CONTROL',
      items: [
        { id: 'dashboard', label: '1. CFO Master Dashboard', icon: 'fa-chart-pie' },
        { id: 'controlCentre', label: '2. Finance Control Centre', icon: 'fa-tower-broadcast' },
        { id: 'actionRequired', label: '3. Action Required', icon: 'fa-bolt' },
        { id: 'criticalAlerts', label: '4. Critical Alerts & Flags', icon: 'fa-triangle-exclamation' }
      ]
    },
    {
      group: 'FINANCE TEAM SUPERVISION',
      items: [
        { id: 'teamSupervision', label: '5. Finance Team Dashboard', icon: 'fa-users-gear' },
        { id: 'employeeActivity', label: '6. Employee Daily Activity', icon: 'fa-timeline' },
        { id: 'teamWorkQueue', label: '7. Finance Work Queue', icon: 'fa-list-check' },
        { id: 'whoDidWhat', label: '8. 🔍 Who Did What Audit', icon: 'fa-fingerprint' },
        { id: 'managerSupervision', label: '9. Finance Manager Supervision', icon: 'fa-user-tie' }
      ]
    },
    {
      group: 'APPROVALS & GOVERNANCE',
      items: [
        { id: 'approvals', label: '10. CFO Approvals Queue', icon: 'fa-check-double' },
        { id: 'approvalLimits', label: '11. Configurable Limits Matrix', icon: 'fa-scale-balanced' },
        { id: 'highValueTxns', label: '12. High-Value Transactions', icon: 'fa-shield-halved' }
      ]
    },
    {
      group: 'ACCOUNTING & STATEMENTS',
      items: [
        { id: 'generalLedger', label: '13. General Ledger', icon: 'fa-book-bookmark' },
        { id: 'chartOfAccounts', label: '14. Chart of Accounts', icon: 'fa-sitemap' },
        { id: 'financialStatements', label: '15. Financial Statements (P&L)', icon: 'fa-file-invoice-dollar' }
      ]
    },
    {
      group: 'CASH, AR, AP & EXPENSES',
      items: [
        { id: 'receivables', label: '16. Receivables Supervision (AR)', icon: 'fa-hand-holding-dollar' },
        { id: 'payables', label: '17. Payables Supervision (AP)', icon: 'fa-money-bill-transfer' },
        { id: 'cashControl', label: '18. Cash & Runway Forecast', icon: 'fa-vault' },
        { id: 'expenseSupervision', label: '19. Expense Supervision', icon: 'fa-receipt' }
      ]
    },
    {
      group: 'AUDIT, TAX & CLOSING',
      items: [
        { id: 'exceptions', label: '20. Transaction Exception Centre', icon: 'fa-triangle-exclamation' },
        { id: 'fraudAnomalies', label: '21. Fraud & Anomaly Centre', icon: 'fa-user-secret' },
        { id: 'monthEndClosing', label: '22. Month-End Closing (85%)', icon: 'fa-calendar-check' },
        { id: 'periodLock', label: '23. Period Lock Governance', icon: 'fa-lock' },
        { id: 'auditCentre', label: '24. Full Audit Centre', icon: 'fa-file-shield' }
      ]
    },
    {
      group: 'TERRITORY & PROFITABILITY',
      items: [
        { id: 'galleryFinance', label: '25. Gallery-Wise Finance & P&L', icon: 'fa-store' },
        { id: 'costCentres', label: '26. Cost Centre Accounting', icon: 'fa-calculator' }
      ]
    },
    {
      group: 'CFO PERSONAL WORKSPACE',
      items: [
        { id: 'cfoDaily', label: '27. Daily Finance & EOD Review', icon: 'fa-sun' },
        { id: 'cfoTasks', label: '28. CFO Personal Tasks', icon: 'fa-tasks' },
        { id: 'cfoNotepad', label: '29. CFO Notepad', icon: 'fa-note-sticky' },
        { id: 'meetings', label: '30. Finance Review Meetings', icon: 'fa-calendar-days' },
        { id: 'decisions', label: '31. CFO Decision Register', icon: 'fa-gavel' },
        { id: 'cfoReports', label: '32. CFO → CEO Escalation Package', icon: 'fa-crown' }
      ]
    }
  ];

  // Approval handlers
  const handleApprove = async (id) => {
    const updated = db.approvals.map(a => a.id === id ? { ...a, status: 'Approved' } : a);
    
    // Update live database first
    await updateApproval(id, { status: 'Approved' });
    await logActivity('CFO_APPROVED_TRANSACTION', { transactionId: id });

    saveDb({
      ...db,
      approvals: updated,
      metrics: {
        ...db.metrics,
        pendingCfoApprovals: Math.max(0, db.metrics.pendingCfoApprovals - 1)
      }
    });
    showToast(`✅ Approval #${id} signed off by CFO!`, 'success');
  };

  const handleOpenRejection = (approval) => {
    setSelectedApproval(approval);
    setActiveModal('rejection_modal');
  };

  const handleSubmitRejection = async (e) => {
    e.preventDefault();
    const form = e.target;
    const reason = form.reason.value;
    const remarks = form.remarks.value;
    const correction = form.correction.value;
    const rejectionReason = `${reason} — ${remarks}. Action Required: ${correction}`;

    const updated = db.approvals.map(a => a.id === selectedApproval.id ? {
      ...a,
      status: 'Rejected',
      rejectionReason
    } : a);

    // Update live database first
    await updateApproval(selectedApproval.id, { status: 'Rejected', rejectionReason });
    await logActivity('CFO_REJECTED_TRANSACTION', { transactionId: selectedApproval.id, reason: rejectionReason });

    saveDb({
      ...db,
      approvals: updated,
      metrics: {
        ...db.metrics,
        pendingCfoApprovals: Math.max(0, db.metrics.pendingCfoApprovals - 1)
      }
    });
    showToast(`🚫 Transaction #${selectedApproval.id} formally rejected & returned with feedback!`, 'error');
    setActiveModal(null);
  };

  const handleAddNote = async () => {
    if (!newNoteTitle.trim()) return;
    const note = {
      title: newNoteTitle,
      content: newNoteContent,
      date: new Date().toISOString().slice(0, 10),
      tag: 'CFO Strategy',
      pinned: false
    };

    // Save directly to live Firestore
    await addNote(note);
    await logActivity('CFO_ADDED_STRATEGY_NOTE', { title: newNoteTitle });


    setNewNoteTitle('');
    setNewNoteContent('');
    showToast('Saved to CFO Notepad!', 'success');
  };


  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* CSS STYLING */}
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --primary: #059669;
          --primary-dark: #064e3b;
          --primary-light: #6ee7b7;
          --bg-surface: #f0fdf4;
          --sidebar-width: 280px;
          --header-height: 64px;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0fdf4; color: #1f2937; display: flex; min-height: 100vh; overflow: hidden; }
        
        #sidebar { width: var(--sidebar-width); height: 100vh; background: #064e3b; color: #d1fae5; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; z-index: 100; transition: transform 0.3s ease; overflow-y: auto; padding-bottom: 16px; border-right: 1px solid rgba(255, 255, 255, 0.08); }
        #sidebar .brand { padding: 18px 20px; font-size: 20px; font-weight: 700; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        #sidebar .brand i { color: #6ee7b7; font-size: 22px; }
        #sidebar .brand span { color: #fff; }
        #sidebar .brand small { font-size: 10px; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 12px; margin-left: auto; color: #a7f3d0; }
        
        .nav-section { padding: 14px 18px 4px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700; color: #6ee7b7; opacity: 0.7; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 16px; margin: 2px 8px; border-radius: 8px; cursor: pointer; transition: all 0.2s; color: #a7f3d0; font-size: 12.5px; font-weight: 500; }
        .nav-item:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
        .nav-item.active { background: rgba(16, 185, 129, 0.25); color: #fff; box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.3); font-weight: 600; }
        .nav-item i { width: 16px; text-align: center; font-size: 13px; }
        .nav-item .badge { margin-left: auto; background: #dc2626; color: #fff; font-size: 10px; padding: 1px 7px; border-radius: 10px; font-weight: 700; }
        
        .sidebar-footer { margin-top: auto; padding: 12px 18px; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 10px; background: #043d2e; }
        .sidebar-footer .avatar { width: 34px; height: 34px; border-radius: 50%; background: #059669; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
        
        #main { margin-left: var(--sidebar-width); flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: #f0fdf4; }
        #header { height: var(--header-height); background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px); border-bottom: 1px solid #d1fae5; display: flex; align-items: center; padding: 0 24px; gap: 16px; flex-shrink: 0; }
        .header-title { font-size: 17px; font-weight: 700; color: #064e3b; display: flex; align-items: center; gap: 8px; flex: 1; }
        .header-actions { display: flex; align-items: center; gap: 10px; }
        
        #pageContent { flex: 1; overflow-y: auto; padding: 20px 28px 40px; }
        
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px; }
        .kpi-card { background: #fff; border-radius: 12px; padding: 14px 16px; border: 1px solid #d1fae5; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.04); transition: transform 0.2s, box-shadow 0.2s; }
        .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(5, 150, 105, 0.08); border-color: #059669; }
        .kpi-card .kpi-label { font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
        .kpi-card .kpi-val { font-size: 20px; font-weight: 700; color: #064e3b; margin-top: 4px; }
        .kpi-card .kpi-sub { font-size: 11px; margin-top: 4px; font-weight: 500; }
        .kpi-card .kpi-sub.green { color: #059669; }
        .kpi-card .kpi-sub.red { color: #dc2626; }
        .kpi-card .kpi-sub.orange { color: #d97706; }
        
        .btn { padding: 7px 16px; border: none; border-radius: 8px; font-weight: 600; font-size: 12.5px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; text-decoration: none; }
        .btn-primary { background: #059669; color: #fff; }
        .btn-primary:hover { background: #047857; }
        .btn-danger { background: #dc2626; color: #fff; }
        .btn-danger:hover { background: #b91c1c; }
        .btn-outline { background: transparent; border: 1px solid #d1fae5; color: #064e3b; }
        .btn-outline:hover { background: #ecfdf5; border-color: #059669; }
        .btn-xs { padding: 3px 8px; font-size: 11px; border-radius: 6px; }
        .btn-sm { padding: 5px 12px; font-size: 12px; border-radius: 6px; }
        
        .table-wrap { background: #fff; border-radius: 12px; border: 1px solid #d1fae5; overflow: hidden; box-shadow: 0 2px 10px rgba(5, 150, 105, 0.04); margin-bottom: 20px; }
        .table-wrap .table-header { padding: 14px 18px; border-bottom: 1px solid #d1fae5; display: flex; justify-content: space-between; align-items: center; background: #fafdfb; }
        .table-wrap .table-header h3 { font-size: 15px; font-weight: 700; color: #064e3b; display: flex; align-items: center; gap: 8px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
        table th { background: #ecfdf5; padding: 10px 14px; font-weight: 700; color: #064e3b; font-size: 11.5px; text-transform: uppercase; border-bottom: 1px solid #d1fae5; }
        table td { padding: 10px 14px; border-bottom: 1px solid #f0fdf4; color: #374151; vertical-align: middle; }
        table tr:hover td { background: #f0fdf4; }
        
        .badge-status { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
        .badge-status.active, .badge-status.completed, .badge-status.approved, .badge-status.verified { background: #dcfce7; color: #065f46; }
        .badge-status.pending, .badge-status.scheduled, .badge-status.in-progress { background: #fef3c7; color: #92400e; }
        .badge-status.critical, .badge-status.rejected, .badge-status.error { background: #fee2e2; color: #991b1b; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(6, 78, 59, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-box { background: #fff; width: 100%; max-width: 720px; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); max-height: 90vh; overflow-y: auto; padding: 24px; border: 1px solid #d1fae5; }
        .modal-box .m-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d1fae5; padding-bottom: 12px; margin-bottom: 16px; }
        .modal-box .m-header h3 { font-size: 17px; font-weight: 700; color: #064e3b; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .form-group { margin-bottom: 12px; }
        .form-group label { display: block; font-size: 11.5px; font-weight: 600; color: #064e3b; margin-bottom: 4px; text-transform: uppercase; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 8px 12px; border: 1px solid #d1fae5; border-radius: 8px; font-size: 13px; outline: none; background: #fff; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #059669; box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.15); }
        
        .toast { position: fixed; bottom: 24px; right: 24px; background: #064e3b; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 9999; border-left: 4px solid #34d399; }
        .toast.error { border-left-color: #ef4444; }
        `
      }} />

      {/* SIDEBAR */}
      <aside id="sidebar" className={sidebarOpen ? 'open' : ''}>
        <div className="brand">
          <i className="fas fa-crown"></i>
          <span>ePAY <span style={{ color: '#6ee7b7' }}>CFO COMMAND</span></span>
          <small>v4.0</small>
        </div>

        <nav style={{ flex: 1, padding: '4px 0 16px' }}>
          {navSections.map((sec, idx) => (
            <React.Fragment key={idx}>
              <div className="nav-section">{sec.group}</div>
              {sec.items.map(item => {
                const count = getBadgeCount(item.id);
                return (
                  <div
                    key={item.id}
                    className={'nav-item ' + (currentPage === item.id ? 'active' : '')}
                    onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                  >
                    <i className={'fas ' + item.icon}></i>
                    <span>{item.label}</span>
                    {count > 0 && <span className="badge">{count}</span>}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">{db.user.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{db.user.name}</div>
            <div style={{ fontSize: 10, color: '#a7f3d0' }}>{db.user.role}</div>
          </div>
          <button className="btn btn-sm btn-outline" style={{ border: 'none', color: '#a7f3d0' }} title="Period Lock Active">
            <i className="fas fa-lock"></i>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div id="main">
        {/* HEADER */}
        <header id="header">
          <div className="header-title">
            <i className="fas fa-building-columns" style={{ color: '#059669' }}></i>
            <span>{currentPage.toUpperCase()} — CFO Executive Governance Hub</span>
            <span style={{ fontSize: 11, background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: 6, marginLeft: 8 }}>
              Period: {db.periodLock.currentPeriod} (Locked: {db.periodLock.lockedPeriod})
            </span>
          </div>

          <div className="header-actions">
            <div style={{ display: 'flex', alignItems: 'center', background: '#ecfdf5', borderRadius: 8, padding: '4px 12px', border: '1px solid #d1fae5' }}>
              <i className="fas fa-search" style={{ color: '#6b7280', fontSize: 12, marginRight: 6 }}></i>
              <input
                type="text"
                placeholder="Search audit trail, vouchers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12, width: 160 }}
              />
            </div>
            
            <button className="btn btn-primary btn-sm" onClick={() => setCurrentPage('approvals')}>
              <i className="fas fa-check-double"></i> Approvals ({db.metrics.pendingCfoApprovals})
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => showToast('Generated CFO Board Briefing Archive', 'success')}>
              <i className="fas fa-file-pdf"></i> Board Pack
            </button>
          </div>
        </header>

        {/* PAGE CONTENT ROUTING */}
        <div id="pageContent">
          {/* TOAST NOTIFICATION */}
          {activeToast && (
            <div className={'toast ' + (activeToast.type === 'error' ? 'error' : '')}>
              <i className={'fas ' + (activeToast.type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check')}></i>
              <span>{activeToast.message}</span>
            </div>
          )}

          {/* ========================================================== */}
          {/* 1. CFO MASTER DASHBOARD */}
          {/* ========================================================== */}
          {currentPage === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-crown"></i> Chief Financial Officer Master Command</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Financial Health Score + Finance Team Performance + 360° Department Oversight</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge-status active" style={{ padding: '6px 12px' }}>🟢 GST Reconciled (100%)</span>
                  <span className="badge-status pending" style={{ padding: '6px 12px' }}>🟡 Month-End Close (85%)</span>
                </div>
              </div>

              {/* TOP LEVEL 6 CARDS */}
              <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-label">Total Revenue</div><div className="kpi-val">₹{(db.metrics.totalRevenue / 10000000).toFixed(2)} Cr</div><div className="kpi-sub green">+18.4% YoY Growth</div></div>
                <div className="kpi-card"><div className="kpi-label">Total Expense</div><div className="kpi-val">₹{(db.metrics.totalExpense / 10000000).toFixed(2)} Cr</div><div className="kpi-sub green">Within Budget (-5.4%)</div></div>
                <div className="kpi-card"><div className="kpi-label">Net Profit</div><div className="kpi-val">₹{(db.metrics.netProfit / 10000000).toFixed(2)} Cr</div><div className="kpi-sub green">{db.metrics.netMargin}% Net Margin</div></div>
                <div className="kpi-card"><div className="kpi-label">Cash Position</div><div className="kpi-val">₹{(db.metrics.cashPosition / 100000).toFixed(2)} L</div><div className="kpi-sub green">Liquid Bank + Vault</div></div>
                <div className="kpi-card"><div className="kpi-label">Receivables (AR)</div><div className="kpi-val">₹{(db.metrics.accountsReceivable / 100000).toFixed(2)} L</div><div className="kpi-sub orange">5 Overdue Invoices</div></div>
                <div className="kpi-card"><div className="kpi-label">Payables (AP)</div><div className="kpi-val">₹{(db.metrics.accountsPayable / 100000).toFixed(2)} L</div><div className="kpi-sub orange">8 Bills Due Today</div></div>
              </div>

              {/* OPERATIONAL ALERT COUNTERS */}
              <div className="kpi-grid">
                <div className="kpi-card" onClick={() => setCurrentPage('approvals')} style={{ cursor: 'pointer' }}><div className="kpi-label">Pending Approvals</div><div className="kpi-val" style={{ color: '#d97706' }}>{db.metrics.pendingCfoApprovals} Items</div><div className="kpi-sub orange">CFO Signoff Needed</div></div>
                <div className="kpi-card" onClick={() => setCurrentPage('exceptions')} style={{ cursor: 'pointer' }}><div className="kpi-label">Finance Exceptions</div><div className="kpi-val" style={{ color: '#dc2626' }}>{db.metrics.financeExceptions} Flags</div><div className="kpi-sub red">Bank & Tax Variances</div></div>
                <div className="kpi-card" onClick={() => setCurrentPage('receivables')} style={{ cursor: 'pointer' }}><div className="kpi-label">Overdue AR</div><div className="kpi-val" style={{ color: '#dc2626' }}>{db.metrics.overdueReceivables} Accounts</div><div className="kpi-sub red">&gt;60 Days Aging</div></div>
                <div className="kpi-card" onClick={() => setCurrentPage('payables')} style={{ cursor: 'pointer' }}><div className="kpi-label">Vendor Due Today</div><div className="kpi-val">{db.metrics.vendorPaymentsDue} Bills</div><div className="kpi-sub green">AWS, DLF, Dell</div></div>
                <div className="kpi-card" onClick={() => setCurrentPage('approvals')} style={{ cursor: 'pointer' }}><div className="kpi-label">Pending Refunds</div><div className="kpi-val">{db.metrics.pendingRefunds} Tickets</div><div className="kpi-sub orange">Zenith & Travel Ops</div></div>
                <div className="kpi-card" onClick={() => setCurrentPage('monthEndClosing')} style={{ cursor: 'pointer' }}><div className="kpi-label">Month-End Closing</div><div className="kpi-val" style={{ color: '#059669' }}>{db.metrics.monthEndClosing}% Done</div><div className="kpi-sub green">Target Close: 31-Aug</div></div>
              </div>

              {/* QUICK CONTROL OVERVIEW */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-users" style={{ color: '#059669' }}></i> Finance Team Output & SLA Scorecard</h3>
                    <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('teamSupervision')}>Full Team</button>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Employee</th><th>Tasks Done</th><th>Pending</th><th>SLA %</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {db.teamMembers.map(m => (
                        <tr key={m.id}>
                          <td><strong>{m.name}</strong><br /><small style={{ color: '#6b7280' }}>{m.role}</small></td>
                          <td><strong style={{ color: '#059669' }}>{m.completed}</strong> / {m.tasks}</td>
                          <td>{m.pending}</td>
                          <td><strong>{m.sla}%</strong></td>
                          <td><span className="badge-status active">{m.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-check-double" style={{ color: '#d97706' }}></i> Pending CFO Approvals (Urgent)</h3>
                    <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('approvals')}>All Approvals</button>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Transaction / Payee</th><th>Amount</th><th>Submitted By</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {db.approvals.slice(0, 3).map(a => (
                        <tr key={a.id}>
                          <td><strong>{a.title}</strong><br /><small style={{ color: '#6b7280' }}>{a.dept} ({a.gallery})</small></td>
                          <td><strong style={{ color: '#064e3b' }}>₹{a.amount.toLocaleString()}</strong></td>
                          <td>{a.submittedBy}</td>
                          <td>
                            {a.status === 'Pending' ? (
                              <button className="btn btn-xs btn-primary" onClick={() => handleApprove(a.id)}>Approve</button>
                            ) : (
                              <span className="badge-status active">{a.status}</span>
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

          {/* ========================================================== */}
          {/* 2. FINANCE CONTROL CENTRE & 4. CRITICAL ALERTS */}
          {/* ========================================================== */}
          {(currentPage === 'controlCentre' || currentPage === 'criticalAlerts') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-tower-broadcast"></i> CFO Finance Control Centre</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Clickable Live Financial Anomaly Matrix & High-Risk Discrepancy Escalations</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Re-scanned all financial control ledgers', 'success')}>
                  <i className="fas fa-rotate"></i> Re-scan Control Centre
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Severity</th>
                      <th>Control Anomaly / Issue Description</th>
                      <th>Category</th>
                      <th>Count</th>
                      <th>Financial Value</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.controlCenterIssues.map(issue => (
                      <tr key={issue.id}>
                        <td>
                          {issue.severity === 'critical' ? (
                            <span style={{ color: '#dc2626', fontWeight: 700 }}><i className="fas fa-circle-dot"></i> CRITICAL RED</span>
                          ) : (
                            <span style={{ color: '#d97706', fontWeight: 700 }}><i className="fas fa-triangle-exclamation"></i> AMBER WARN</span>
                          )}
                        </td>
                        <td><strong>{issue.title}</strong></td>
                        <td>{issue.category}</td>
                        <td><span className="badge-status pending">{issue.count} Records</span></td>
                        <td><strong style={{ color: '#064e3b' }}>{issue.amount}</strong></td>
                        <td><span className={'badge-status ' + (issue.severity === 'critical' ? 'critical' : 'pending')}>{issue.status}</span></td>
                        <td>
                          <button className="btn btn-xs btn-outline" onClick={() => showToast(`Opening command drill-down for ${issue.title}`, 'info')}>
                            Investigate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 5. FINANCE TEAM SUPERVISION & 7. WORK QUEUE */}
          {/* ========================================================== */}
          {(currentPage === 'teamSupervision' || currentPage === 'teamWorkQueue' || currentPage === 'managerSupervision') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-users-gear"></i> Finance Team Supervision & Daily Work Queue</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Employee Task Allocations, Productivity SLA %, Rejections & Open Workloads</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Dispatched task rebalance across finance executives', 'success')}>
                  <i className="fas fa-arrows-split-up-and-left"></i> Rebalance Workload
                </button>
              </div>

              {/* TEAM MEMBERS TABLE */}
              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-user-check"></i> Finance Executive Performance Matrix</h3>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Designation & Role</th>
                      <th>Assigned Tasks</th>
                      <th>Completed</th>
                      <th>Pending</th>
                      <th>Rejected Vouchers</th>
                      <th>SLA Adherence</th>
                      <th>Specialization Area</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.teamMembers.map(m => (
                      <tr key={m.id}>
                        <td><strong>{m.name}</strong></td>
                        <td>{m.role}</td>
                        <td>{m.tasks} tasks</td>
                        <td><strong style={{ color: '#059669' }}>{m.completed}</strong></td>
                        <td>{m.pending}</td>
                        <td><span style={{ color: m.rejected > 1 ? '#dc2626' : '#6b7280', fontWeight: 700 }}>{m.rejected}</span></td>
                        <td><strong style={{ color: m.sla >= 90 ? '#059669' : '#d97706' }}>{m.sla}%</strong></td>
                        <td>{m.specialization}</td>
                        <td><span className="badge-status active">{m.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* WORK QUEUE TABLE */}
              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-list-check"></i> Live Finance Department Work Queue</h3>
                </div>
                <table>
                  <thead>
                    <tr><th>Work Queue Category</th><th>Open Items Count</th><th>Assigned Desk</th><th>Urgency</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {db.workQueue.map((w, idx) => (
                      <tr key={idx}>
                        <td><strong>{w.item}</strong></td>
                        <td><span className="badge-status pending">{w.count} Items</span></td>
                        <td>{w.assignedTo}</td>
                        <td><span className={'badge-status ' + (w.urgency === 'Critical' ? 'critical' : w.urgency === 'High' ? 'pending' : 'active')}>{w.urgency}</span></td>
                        <td><span className="badge-status active">Processing</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 6. EMPLOYEE DAILY ACTIVITY */}
          {/* ========================================================== */}
          {currentPage === 'employeeActivity' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-timeline"></i> Finance Employee Daily Activity Timeline</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Chronological Action Log with Timestamps, Old vs New Values & IP Verification</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Exported employee daily activity log to Excel', 'success')}>
                  <i className="fas fa-download"></i> Export Activity Log
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Finance Staff</th>
                      <th>Action Executed</th>
                      <th>Txn / Ref ID</th>
                      <th>Module Area</th>
                      <th>Remarks & Audit Details</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.dailyActivities.map((act, idx) => (
                      <tr key={idx}>
                        <td><code>{act.time}</code></td>
                        <td><strong>{act.user}</strong></td>
                        <td>{act.action}</td>
                        <td><code>{act.txnId}</code></td>
                        <td><span className="badge-status active">{act.module}</span></td>
                        <td style={{ fontSize: 12 }}>{act.remarks}</td>
                        <td><span className="badge-status verified">{act.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 8. WHO DID WHAT — 360° ACCOUNTABILITY AUDIT */}
          {/* ========================================================== */}
          {currentPage === 'whoDidWhat' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-fingerprint"></i> WHO DID WHAT — Finance Accountability Report</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Immutable Multi-Stage Audit Trail (Created → Verified → Approved → Processed → Reconciled)</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Generated Full Accountability Master Register', 'success')}>
                  <i className="fas fa-file-shield"></i> Export Accountability Report
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Type & Party</th>
                      <th>Amount</th>
                      <th>Created By</th>
                      <th>Verified By</th>
                      <th>Approved By</th>
                      <th>Processed By</th>
                      <th>Reconciled By</th>
                      <th>Final Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.accountabilityLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td><code>{log.txnId}</code></td>
                        <td><strong>{log.type}</strong><br /><small style={{ color: '#6b7280' }}>{log.customerVendor}</small></td>
                        <td><strong style={{ color: '#064e3b' }}>₹{log.amount.toLocaleString()}</strong></td>
                        <td style={{ fontSize: 12 }}>{log.createdBy}</td>
                        <td style={{ fontSize: 12 }}>{log.verifiedBy}</td>
                        <td style={{ fontSize: 12 }}><strong>{log.approvedBy}</strong></td>
                        <td style={{ fontSize: 12 }}>{log.processedBy}</td>
                        <td style={{ fontSize: 12 }}>{log.reconciledBy}</td>
                        <td><span className={'badge-status ' + (log.finalStatus === 'COMPLETED' ? 'active' : 'pending')}>{log.finalStatus}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 10. CFO APPROVALS QUEUE */}
          {/* ========================================================== */}
          {currentPage === 'approvals' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-check-double"></i> CFO Executive Approval Queue ({db.approvals.filter(a => a.status === 'Pending').length})</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Payments, Vendor Invoices, High-Ticket Refunds, Capex & Travel Claims</p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Approval ID</th>
                      <th>Category Type</th>
                      <th>Particulars / Description</th>
                      <th>Amount</th>
                      <th>Gallery & Dept</th>
                      <th>Prepared / Verified By</th>
                      <th>Approval Tier</th>
                      <th>Risk</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.approvals.map(a => (
                      <tr key={a.id}>
                        <td><code>{a.id}</code></td>
                        <td><span className="badge-status active">{a.type}</span></td>
                        <td><strong>{a.title}</strong></td>
                        <td><strong style={{ color: '#064e3b', fontSize: 14 }}>₹{a.amount.toLocaleString()}</strong></td>
                        <td>{a.gallery} ({a.dept})</td>
                        <td>{a.submittedBy} → {a.verifiedBy}</td>
                        <td><strong>{a.level}</strong></td>
                        <td><span className={'badge-status ' + (a.risk === 'Low' ? 'active' : a.risk === 'Medium' ? 'pending' : 'critical')}>{a.risk} Risk</span></td>
                        <td>
                          {a.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-xs btn-primary" onClick={() => handleApprove(a.id)}>Approve</button>
                              <button className="btn btn-xs btn-danger" onClick={() => handleOpenRejection(a)}>Reject...</button>
                            </div>
                          ) : (
                            <span className={'badge-status ' + (a.status === 'Approved' ? 'active' : 'critical')}>{a.status}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 11. APPROVAL LIMITS & 12. HIGH-VALUE TRANSACTIONS */}
          {/* ========================================================== */}
          {(currentPage === 'approvalLimits' || currentPage === 'highValueTxns') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-scale-balanced"></i> Configurable Financial Approval Limits & High-Value Centre</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Multi-Tier Delegation of Financial Authority & Automated Risk Escalation</p>
                </div>
              </div>

              {/* LIMITS TABLE */}
              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-layer-group"></i> Authorization Tier Hierarchy</h3>
                </div>
                <table>
                  <thead>
                    <tr><th>Authorization Tier</th><th>Amount Range</th><th>Mandatory Approver</th><th>Scope & Purpose</th></tr>
                  </thead>
                  <tbody>
                    {db.approvalLimits.map((l, idx) => (
                      <tr key={idx}>
                        <td><strong>{l.tier}</strong></td>
                        <td><strong style={{ color: '#059669' }}>{l.range}</strong></td>
                        <td><strong>{l.approver}</strong></td>
                        <td>{l.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* HIGH VALUE WATCHLIST */}
              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-shield-halved"></i> Active High-Value Transaction Watchlist</h3>
                </div>
                <table>
                  <thead>
                    <tr><th>ID</th><th>Transaction Title</th><th>Amount</th><th>Party Entity</th><th>Location</th><th>Risk Assessment</th><th>Recommendation</th></tr>
                  </thead>
                  <tbody>
                    {db.highValueTxns.map(h => (
                      <tr key={h.id}>
                        <td><code>{h.id}</code></td>
                        <td><strong>{h.txn}</strong></td>
                        <td><strong style={{ color: '#064e3b' }}>₹{h.amount.toLocaleString()}</strong></td>
                        <td>{h.party}</td>
                        <td>{h.gallery}</td>
                        <td><span className="badge-status pending">{h.risk}</span></td>
                        <td>{h.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* RECEIVABLES, PAYABLES, CASH CONTROL & EXPENSES */}
          {/* ========================================================== */}
          {(currentPage === 'receivables' || currentPage === 'payables' || currentPage === 'cashControl' || currentPage === 'expenseSupervision') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}>
                    <i className="fas fa-money-bill-wave"></i> {currentPage.toUpperCase()} — CFO Control Ledger
                  </h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Current Cash: ₹82.4L | Projected Cash: ₹75.0L | AR: ₹36.2L | AP: ₹21.5L</p>
                </div>
              </div>

              <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-label">Current Cash & Bank</div><div className="kpi-val">₹82.40L</div><div className="kpi-sub green">HDFC & ICICI</div></div>
                <div className="kpi-card"><div className="kpi-label">Expected Inflow (30d)</div><div className="kpi-val">₹35.00L</div><div className="kpi-sub green">B2B Collections</div></div>
                <div className="kpi-card"><div className="kpi-label">Expected Outflow (30d)</div><div className="kpi-val">₹42.00L</div><div className="kpi-sub orange">Salary & Rent</div></div>
                <div className="kpi-card"><div className="kpi-label">Projected Closing Cash</div><div className="kpi-val" style={{ color: '#059669' }}>₹75.40L</div><div className="kpi-sub green">Safe Runway</div></div>
              </div>

              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-list"></i> Receivables Aging Breakdown</h3>
                </div>
                <table>
                  <thead>
                    <tr><th>Aging Bucket</th><th>Outstanding (₹)</th><th>Accounts Count</th><th>Risk Profile</th><th>Action Strategy</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>0 – 30 Days</strong> (Current)</td><td>₹14,00,000</td><td>14 Clients</td><td><span className="badge-status active">Low Risk</span></td><td>Standard Invoicing</td></tr>
                    <tr><td><strong>31 – 60 Days</strong></td><td>₹9,00,000</td><td>8 Clients</td><td><span className="badge-status pending">Medium Risk</span></td><td>Automated Email & SMS</td></tr>
                    <tr><td><strong>61 – 90 Days</strong></td><td>₹6,00,000</td><td>5 Clients</td><td><span className="badge-status critical">High Risk</span></td><td>Collector Phone Follow-up</td></tr>
                    <tr><td><strong>90+ Days (Overdue)</strong></td><td>₹7,20,000</td><td>3 Clients</td><td><span className="badge-status critical">Severe Risk</span></td><td>Legal Notice & CFO Hold</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* GALLERY P&L & PROFITABILITY */}
          {/* ========================================================== */}
          {(currentPage === 'galleryFinance' || currentPage === 'costCentres') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-store"></i> Gallery-Wise Finance & Profitability Ranking</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Revenue, Salaries, Commercial Rent, Marketing, Operations & Net Profit Margins</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Exported Gallery P&L Breakdown to Excel', 'success')}>
                  <i className="fas fa-download"></i> Export Gallery P&L
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Gallery Center</th>
                      <th>Gross Revenue</th>
                      <th>Salary Expense</th>
                      <th>Rent Expense</th>
                      <th>Marketing</th>
                      <th>Operations</th>
                      <th>Net Profit</th>
                      <th>Net Margin %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.galleryPnL.map(g => (
                      <tr key={g.rank}>
                        <td><strong>#{g.rank}</strong></td>
                        <td><strong>{g.gallery}</strong></td>
                        <td>₹{g.revenue.toLocaleString()}</td>
                        <td>₹{g.salary.toLocaleString()}</td>
                        <td>₹{g.rent.toLocaleString()}</td>
                        <td>₹{g.marketing.toLocaleString()}</td>
                        <td>₹{g.operations.toLocaleString()}</td>
                        <td><strong style={{ color: '#059669', fontSize: 14 }}>₹{g.netProfit.toLocaleString()}</strong></td>
                        <td><span className="badge-status active">{g.margin}%</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* AUDIT, TAX, FRAUD & PERIOD LOCK */}
          {/* ========================================================== */}
          {(currentPage === 'exceptions' || currentPage === 'fraudAnomalies' || currentPage === 'monthEndClosing' || currentPage === 'periodLock' || currentPage === 'auditCentre' || currentPage === 'financialStatements' || currentPage === 'generalLedger' || currentPage === 'chartOfAccounts') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}>
                    <i className="fas fa-shield"></i> {currentPage.toUpperCase()} — CFO Governance & Audit
                  </h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Month-End Closing (85% Completed) | Period Lock: July 2026 LOCKED</p>
                </div>
                <button className="btn btn-sm btn-danger" onClick={() => showToast('Verified Period Lock integrity: No unauthorized modifications allowed', 'info')}>
                  <i className="fas fa-lock"></i> Period Lock Active
                </button>
              </div>

              <div style={{ background: '#ecfdf5', padding: 18, borderRadius: 12, border: '1px solid #a7f3d0', marginBottom: 20 }}>
                <h4 style={{ color: '#064e3b', fontSize: 15, marginBottom: 6 }}><i className="fas fa-lock"></i> Statutory Period Lock Enforcement</h4>
                <div style={{ fontSize: 13, color: '#047857' }}>
                  <strong>{db.periodLock.lockedPeriod}</strong> is fully <strong>LOCKED</strong> by {db.periodLock.lockedBy}. Any historical adjustments require CFO dual-key authorization with an adjustment journal voucher.
                </div>
              </div>

              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-calendar-check"></i> Month-End Closing Supervision Schedule</h3>
                </div>
                <table>
                  <thead>
                    <tr><th>Closing Module</th><th>Assigned Reviewer</th><th>Completion %</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>Bank Account Reconciliation</strong></td><td>Rohan Joshi</td><td>100%</td><td><span className="badge-status active">Completed</span></td></tr>
                    <tr><td><strong>Accounts Receivable (AR) Reconciliation</strong></td><td>Meera Sen</td><td>92%</td><td><span className="badge-status active">Nearly Done</span></td></tr>
                    <tr><td><strong>Accounts Payable (AP) Reconciliation</strong></td><td>Suresh Patil</td><td>95%</td><td><span className="badge-status active">Nearly Done</span></td></tr>
                    <tr><td><strong>GST & Tax Return Matching (GSTR-2B)</strong></td><td>Vikas Shah (CA)</td><td>100%</td><td><span className="badge-status active">Completed</span></td></tr>
                    <tr><td><strong>Payroll & Salary Reconciliation</strong></td><td>HR & Finance</td><td>100%</td><td><span className="badge-status active">Completed</span></td></tr>
                    <tr><td><strong>Fixed Asset Depreciation Provisioning</strong></td><td>Finance Manager</td><td>88%</td><td><span className="badge-status pending">In Progress (85% Overall)</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* CFO PERSONAL WORKSPACE (DAILY, TASKS, NOTEPAD, MEETINGS, DECISIONS) */}
          {/* ========================================================== */}
          {(currentPage === 'cfoDaily' || currentPage === 'cfoTasks' || currentPage === 'cfoNotepad' || currentPage === 'meetings' || currentPage === 'decisions' || currentPage === 'cfoReports') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}>
                    <i className="fas fa-user-tie"></i> {currentPage.toUpperCase()} — CFO Executive Suite
                  </h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Daily Tasks, Decision Register, Strategy Notes & Board Escalations</p>
                </div>
              </div>

              {/* DECISION REGISTER */}
              {currentPage === 'decisions' && (
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-gavel"></i> CFO Decision Register</h3>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Decision ID</th><th>Date</th><th>Subject</th><th>Amount</th><th>Reason</th><th>Decision Summary</th><th>Financial Impact</th></tr>
                    </thead>
                    <tbody>
                      {db.decisions.map(d => (
                        <tr key={d.id}>
                          <td><code>{d.id}</code></td>
                          <td>{d.date}</td>
                          <td><strong>{d.subject}</strong></td>
                          <td><strong style={{ color: '#064e3b' }}>₹{d.amount.toLocaleString()}</strong></td>
                          <td>{d.reason}</td>
                          <td style={{ maxWidth: 260, fontSize: 12 }}>{d.decision}</td>
                          <td><strong style={{ color: '#059669' }}>{d.impact}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CFO TASKS */}
              {currentPage === 'cfoTasks' && (
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-list-check"></i> Today's CFO Direct Task List</h3>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Task Title</th><th>Priority</th><th>Department</th><th>Deadline</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {db.tasks.map(t => (
                        <tr key={t.id}>
                          <td><strong>{t.task}</strong></td>
                          <td><span className={'badge-status ' + (t.priority === 'Critical' ? 'critical' : 'pending')}>{t.priority}</span></td>
                          <td>{t.dept}</td>
                          <td>{t.deadline}</td>
                          <td><span className={'badge-status ' + (t.status === 'Completed' ? 'active' : 'pending')}>{t.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CFO NOTEPAD */}
              {currentPage === 'cfoNotepad' && (
                <div>
                  <div style={{ background: '#fff', padding: 18, borderRadius: 12, border: '1px solid #d1fae5', marginBottom: 20 }}>
                    <h4 style={{ fontSize: 14, color: '#064e3b', marginBottom: 10 }}>Write New Financial Strategy Memo</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                      <input
                        type="text"
                        placeholder="Memo Title (e.g. Q4 Tax Planning & Depreciation Acceleration)"
                        value={newNoteTitle}
                        onChange={e => setNewNoteTitle(e.target.value)}
                        style={{ padding: 10, border: '1px solid #d1fae5', borderRadius: 8, fontSize: 13, outline: 'none' }}
                      />
                      <textarea
                        placeholder="Write detailed financial analysis, cash allocation plan, vendor terms..."
                        value={newNoteContent}
                        onChange={e => setNewNoteContent(e.target.value)}
                        rows={3}
                        style={{ padding: 10, border: '1px solid #d1fae5', borderRadius: 8, fontSize: 13, outline: 'none' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary btn-sm" onClick={handleAddNote}>
                          <i className="fas fa-save"></i> Save Memo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="table-wrap">
                    <div className="table-header">
                      <h3><i className="fas fa-list"></i> Saved Financial Memos</h3>
                    </div>
                    <table>
                      <thead>
                        <tr><th>Title</th><th>Tag</th><th>Date</th><th>Content Summary</th></tr>
                      </thead>
                      <tbody>
                        {db.notes.map(n => (
                          <tr key={n.id}>
                            <td><strong>{n.title}</strong></td>
                            <td><span className="badge-status active">{n.tag}</span></td>
                            <td>{n.date}</td>
                            <td style={{ maxWidth: 360, fontSize: 12 }}>{n.content}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CFO TO CEO ESCALATION PACKAGE */}
              {currentPage === 'cfoReports' && (
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-crown"></i> CFO → CEO Executive Escalation Briefing</h3>
                    <button className="btn btn-sm btn-primary" onClick={() => showToast('Transmitted Escalation Package to CEO Command Center', 'success')}>
                      Transmit to CEO
                    </button>
                  </div>
                  <table>
                    <tbody>
                      <tr><td><strong>1. High-Value Capex Approval Needed</strong></td><td>Dell Technologies 50x POS Terminals (₹14.5L Capex)</td><td><span className="badge-status pending">Awaiting CEO Signoff</span></td></tr>
                      <tr><td><strong>2. Legal Recovery Recommendation</strong></td><td>Zenith Global Holidays overdue B2B balance (₹12.5L &gt; 60d)</td><td><span className="badge-status critical">Legal Notice Recommended</span></td></tr>
                      <tr><td><strong>3. Festive Marketing Budget Expansion</strong></td><td>Meta & Google ad spend expansion (+₹4.5L)</td><td><span className="badge-status active">CFO Approved</span></td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* MODAL: CFO FORMAL REJECTION SYSTEM */}
      {/* ========================================================== */}
      {activeModal === 'rejection_modal' && selectedApproval && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-circle-xmark" style={{ color: '#dc2626' }}></i> Formal CFO Rejection & Return Protocol</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSubmitRejection}>
              <div style={{ background: '#fee2e2', padding: 12, borderRadius: 8, fontSize: 12, color: '#991b1b', marginBottom: 14 }}>
                Rejecting: <strong>{selectedApproval.title}</strong> (₹{selectedApproval.amount.toLocaleString()})
              </div>
              <div className="form-group">
                <label>Primary Rejection Reason Category *</label>
                <select name="reason">
                  <option value="GST Amount Mismatch">GST / Tax Calculation does not match vendor invoice</option>
                  <option value="Missing Supporting Documents">Missing mandatory supporting voucher / invoice PO</option>
                  <option value="Budget Limit Exceeded">Department monthly budget allocation exceeded</option>
                  <option value="Policy Violation">Company expense policy cap violation</option>
                  <option value="Duplicate Submission">Potential duplicate invoice submission</option>
                </select>
              </div>
              <div className="form-group">
                <label>Detailed CFO Remarks & Observations *</label>
                <textarea name="remarks" required placeholder="Specify exact audit discrepancy identified..."></textarea>
              </div>
              <div className="form-group">
                <label>Required Correction for Resubmission *</label>
                <input type="text" name="correction" required placeholder="e.g. Attach corrected tax invoice with 18% GST and resubmit" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Resubmission Permitted?</label>
                  <select name="resubmission">
                    <option value="Yes">Yes (After correction)</option>
                    <option value="No">No (Permanently Cancelled)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Correction Deadline</label>
                  <input type="date" name="deadline" defaultValue="2026-08-28" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-danger">Confirm Rejection & Notify Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
