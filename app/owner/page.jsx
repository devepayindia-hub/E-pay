'use client';

import React, { useState, useEffect } from 'react';

// ============================================================================
// FULL ePAY GALLERY OWNER — COMMAND, OWNERSHIP & BUSINESS MANAGEMENT MODULE
// Complete Business Health, Operations, Ownership Equity, ROI, P&L & Reports
// ============================================================================
const STORAGE_KEY = 'epay_owner_crm_v4';

const defaultOwnerDb = () => ({
  user: {
    name: 'Rahul Patil',
    role: 'Gallery Owner & Franchise Partner',
    gallery: 'Pune Central Gallery (Flagship)',
    avatar: 'RP',
    email: 'rahul.patil@epaygallery.com',
    ownershipShare: 50
  },
  // 1. BUSINESS & OPERATIONAL HEALTH SCORES
  healthScores: {
    overallScore: 91,
    revenuePerformance: 90,
    profitability: 92,
    cashPosition: 86,
    customerGrowth: 94,
    employeePerformance: 88,
    inventoryHealth: 91,
    marketingRoi: 84,
    compliance: 100
  },
  // 2. FINANCIAL & BUSINESS HEALTH KPIS
  businessKpis: {
    todayRevenue: 185000,
    todayTarget: 200000,
    monthlyRevenue: 4250000,
    monthlyTarget: 5000000,
    annualRevenue: 51000000,
    grossProfit: 3280000,
    netProfit: 2835000,
    profitMargin: 66.7,
    roi: 34.28,
    revenueGrowth: 22.4,
    customerGrowth: 18.5,
    expenseGrowth: 4.2,
    galleryValuation: 3500000,
    ownerCapital: 2500000,
    profitShareAmount: 1417500,
    paidProfitShare: 1000000,
    pendingProfitShare: 417500
  },
  // 3. OPERATIONAL HEALTH KPIS
  operationsKpis: {
    employeesPresent: 24,
    employeesTotal: 26,
    todayTasks: 58,
    completedTasks: 47,
    overdueTasks: 6,
    customersToday: 185,
    leadsToday: 42,
    conversionsToday: 18,
    conversionRate: 25.2,
    complaintsActive: 2,
    inventoryValue: 1870000,
    lowStockItems: 8,
    outOfStockItems: 3,
    cashInTill: 820000,
    receivables: 480000,
    payables: 200000
  },
  // 4. MULTI-OWNER SHAREHOLDING & CAPITAL LEDGER
  shareholders: [
    { id: 'OWN-01', name: 'Rahul Patil', role: 'Principal Managing Owner', sharePct: 50, capital: 1750000, profitShareTotal: 1417500, withdrawals: 450000, currentCapital: 1300000, status: 'Active' },
    { id: 'OWN-02', name: 'Pooja Patil', role: 'Co-Owner & Investor', sharePct: 30, capital: 1050000, profitShareTotal: 850500, withdrawals: 200000, currentCapital: 850000, status: 'Active' },
    { id: 'OWN-03', name: 'Anjali Patil', role: 'Silent Equity Partner', sharePct: 20, capital: 700000, profitShareTotal: 567000, withdrawals: 100000, currentCapital: 600000, status: 'Active' }
  ],
  // 5. CAPITAL WITHDRAWAL REQUESTS
  withdrawals: [
    { id: 'WDL-101', owner: 'Rahul Patil', amount: 250000, date: '2026-08-20', reason: 'Quarterly owner dividend distribution', approvalLevel: 'CFO Approved', status: 'Disbursed' },
    { id: 'WDL-102', owner: 'Pooja Patil', amount: 150000, date: '2026-08-24', reason: 'Capital withdrawal for personal asset investment', approvalLevel: 'Under CFO Review', status: 'Pending Review' }
  ],
  // 6. OWNER ACTION REQUIRED CENTRE
  actionItems: [
    { id: 'ACT-01', priority: 'Critical', type: 'Customer Complaint', title: 'High-Value VIP Tour Flight Booking reschedule delay', entity: 'Zenith Global', dueDate: 'Today', status: 'In Resolution' },
    { id: 'ACT-02', priority: 'Critical', type: 'Cash Exception', title: 'Pune Central Till Closing shortfall (-₹500 shortage note)', entity: 'Till #2', dueDate: 'Today', status: 'Investigation' },
    { id: 'ACT-03', priority: 'High', type: 'Vendor Payment', title: 'DLF Cyber Properties monthly commercial rent (₹2.00L)', entity: 'DLF Estates', dueDate: '2026-08-26', status: 'Approved' },
    { id: 'ACT-04', priority: 'High', type: 'Low Stock Alert', title: '8 VIP Merchandise Kits & Smart POS rolls below reorder level', entity: 'Inventory', dueDate: '2026-08-27', status: 'Reorder Due' },
    { id: 'ACT-05', priority: 'Medium', type: 'Document Renewal', title: 'Maharashtra Commercial Trade License renewal due in 15 days', entity: 'HQ Compliance', dueDate: '2026-09-10', status: 'In Progress' }
  ],
  // 7. OWNER P&L BREAKDOWN
  pnl: {
    grossRevenue: 4250000,
    directCost: 450000,
    grossProfit: 3800000,
    expenses: {
      salary: 500000,
      rent: 200000,
      marketing: 120000,
      utilities: 45000,
      maintenance: 30000,
      promotionsBoosting: 50000,
      officeSupplies: 20000,
      other: 100000
    },
    totalExpenses: 1065000,
    netProfit: 2835000,
    marginPct: 66.7
  },
  // 8. SALES TARGET & SERVICE BREAKDOWN
  serviceRevenue: [
    { service: 'Luxury Tour & Holiday Packages', revenue: 2150000, target: 2400000, pct: 89.5, orders: 48, growth: '+24%' },
    { service: 'Visa & VIP Fast-Track Processing', revenue: 1120000, target: 1300000, pct: 86.1, orders: 84, growth: '+19%' },
    { service: 'Digital Gallery Memberships', revenue: 680000, target: 800000, pct: 85.0, orders: 34, growth: '+15%' },
    { service: 'Corporate Delegations & MICE', revenue: 300000, target: 500000, pct: 60.0, orders: 6, growth: '+8%' }
  ],
  // 9. MARKETING CAMPAIGN ROI
  campaigns: [
    { id: 'MKT-01', name: 'Pune City Local Meta & Instagram Ads', spend: 45000, leads: 280, conversions: 58, revenue: 320000, roi: '7.1X', status: 'Active' },
    { id: 'MKT-02', name: 'High Net-Worth Visa Google Search Ads', spend: 35000, leads: 140, conversions: 29, revenue: 160000, roi: '4.5X', status: 'Active' },
    { id: 'MKT-03', name: 'Gallery Walk-in Weekend VIP Event', spend: 40000, leads: 190, conversions: 42, revenue: 240000, roi: '6.0X', status: 'Completed' }
  ],
  // 10. EMPLOYEE TEAM & ATTENDANCE
  employees: [
    { id: 'EMP-01', name: 'Suresh Patil', role: 'Operations & Cash Officer', attendance: 'Present (08:55 AM)', tasks: 12, completed: 10, sales: '₹4.2L', status: '🟢 Excellent' },
    { id: 'EMP-02', name: 'Sneha Kulkarni', role: 'Senior Tour Consultant', attendance: 'Present (09:02 AM)', tasks: 14, completed: 12, sales: '₹8.9L', status: '🟢 Top Sales' },
    { id: 'EMP-03', name: 'Aditya Kadam', role: 'Visa Documentation Specialist', attendance: 'Present (09:10 AM)', tasks: 16, completed: 14, sales: '₹5.1L', status: '🟢 Excellent' },
    { id: 'EMP-04', name: 'Pooja Deshmukh', role: 'Customer Relationship Exec', attendance: 'Absent (Sick Leave)', tasks: 8, completed: 0, sales: '₹0.0L', status: '🔴 On Leave' }
  ],
  // 11. INVENTORY & MERCHANDISE
  inventory: [
    { id: 'INV-01', item: 'VIP Passport Leather Folders & Pouches', sku: 'SKU-VIP-101', stock: 18, reorderLevel: 25, unitPrice: 1200, totalValue: 21600, status: '🟠 Low Stock Alert' },
    { id: 'INV-02', item: 'Smart POS Thermal Printing Paper Roll', sku: 'SKU-POS-202', stock: 12, reorderLevel: 30, unitPrice: 150, totalValue: 1800, status: '🟠 Low Stock Alert' },
    { id: 'INV-03', item: 'Digital Gallery Hologram VIP Cards', sku: 'SKU-CARD-303', stock: 140, reorderLevel: 50, unitPrice: 450, totalValue: 63000, status: '🟢 In Stock' },
    { id: 'INV-04', item: 'ePay Luggage Smart Travel Tags', sku: 'SKU-TAG-404', stock: 0, reorderLevel: 20, unitPrice: 850, totalValue: 0, status: '🔴 Out of Stock' }
  ],
  // 12. OWNER PERSONAL NOTEPAD & IDEAS
  notes: [
    { id: 'ON-1', title: 'Q4 Franchise Expansion to Kothrud Sub-Branch', date: '2026-08-24', tag: 'Expansion', content: 'Explore setting up a 1,500 sq ft satellite customer center in Kothrud to capture Western Pune luxury clients.', pinned: true },
    { id: 'ON-2', title: 'Corporate Tie-Up with Hinjewadi Tech Parks', date: '2026-08-22', tag: 'B2B Sales', content: 'Pitch employee vacation discount memberships to Infosys and TCS employee welfare committees.', pinned: true },
    { id: 'ON-3', title: 'Staff Incentive Bonus Structure Revision', date: '2026-08-20', tag: 'Staff', content: 'Introduce additional 1.5% commission on premium Europe and Australia luxury package bookings.', pinned: false }
  ],
  // 13. OWNER MEETINGS
  meetings: [
    { id: 'OM-01', time: '10:30 AM', title: 'Weekly Gallery Sales Review & Target Standup', attendees: 'Gallery Staff & Manager', location: 'Gallery Conference Room', status: 'Completed' },
    { id: 'OM-02', time: '02:00 PM', title: 'HQ Regional Franchise Development Review', attendees: 'CFO Anil Deshmukh & Territory Head', location: 'Google Meet', status: 'Completed' },
    { id: 'OM-03', time: '04:30 PM', title: 'VIP Client Itinerary Finalization (Dr. Kulkarni Family Dubai Tour)', attendees: 'Client & Sneha Kulkarni', location: 'VIP Lounge', status: 'Scheduled' }
  ],
  // 14. OWNER DECISION REGISTER
  decisions: [
    { id: 'OD-01', date: '2026-08-24', subject: 'Approval of Weekend VIP Walk-in Campaign Budget (₹40,000)', financialImpact: '₹40,000 Spend', operationalImpact: '+42 New VIP Clients', status: 'Executed', followUp: 'Track Q3 ROI' },
    { id: 'OD-02', date: '2026-08-21', subject: 'Replacement of Front Reception Touchscreen Terminal', financialImpact: '₹28,000 Capex', operationalImpact: 'Faster Visitor Check-in', status: 'Executed', followUp: 'Hardware Warranty' }
  ]
});

export default function OwnerPage() {
  const [db, setDb] = useState(defaultOwnerDb());
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [activeToast, setActiveToast] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Load persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDb(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load owner data', e);
    }
  }, []);

  const saveDb = (updated) => {
    setDb(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save owner data', e);
    }
  };

  const showToast = (message, type = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => setActiveToast(null), 3500);
  };

  const getBadgeCount = (id) => {
    switch (id) {
      case 'actionCentre':
      case 'criticalAlerts':
        return db.actionItems.length;
      case 'inventory':
        return db.operationsKpis.lowStockItems;
      case 'withdrawals':
        return db.withdrawals.filter(w => w.status.includes('Pending')).length;
      default:
        return 0;
    }
  };

  // 12 Major Navigation Groups
  const navSections = [
    {
      group: 'COMMAND & CONTROL',
      items: [
        { id: 'dashboard', label: '1. Owner Dashboard', icon: 'fa-gauge-high' },
        { id: 'masterControl', label: '2. Master Control Centre', icon: 'fa-tower-broadcast' },
        { id: 'actionCentre', label: '3. Owner Action Centre', icon: 'fa-bolt' },
        { id: 'criticalAlerts', label: '4. Critical Alerts', icon: 'fa-triangle-exclamation' }
      ]
    },
    {
      group: 'OWNERSHIP & EQUITY',
      items: [
        { id: 'ownershipEquity', label: '5. Ownership & Shareholding', icon: 'fa-id-card-clip' },
        { id: 'capitalLedger', label: '6. Capital Contributions', icon: 'fa-coins' },
        { id: 'withdrawals', label: '7. Capital Withdrawals', icon: 'fa-hand-holding-dollar' },
        { id: 'profitSharing', label: '8. Profit Sharing & ROI', icon: 'fa-chart-pie' }
      ]
    },
    {
      group: 'FINANCE & P&L',
      items: [
        { id: 'galleryPnl', label: '9. Gallery Owner P&L', icon: 'fa-file-invoice-dollar' },
        { id: 'balanceSheet', label: '10. Gallery Balance Sheet', icon: 'fa-scale-balanced' },
        { id: 'cashBook', label: '11. Daily Cash Book', icon: 'fa-book-bookmark' },
        { id: 'expenseCommand', label: '12. Expenses & Budget vs Actual', icon: 'fa-receipt' }
      ]
    },
    {
      group: 'SALES & REVENUE',
      items: [
        { id: 'salesRevenue', label: '13. Sales & Target Centre', icon: 'fa-bullseye' },
        { id: 'crmCustomers', label: '14. Customers & Lead Pipeline', icon: 'fa-users' }
      ]
    },
    {
      group: 'OPERATIONS & STAFF',
      items: [
        { id: 'employeeSupervision', label: '15. Employee Supervision', icon: 'fa-user-check' },
        { id: 'inventory', label: '16. Inventory & Stock Control', icon: 'fa-boxes-stacked' },
        { id: 'vendors', label: '17. Vendor Management', icon: 'fa-truck-field' }
      ]
    },
    {
      group: 'MARKETING & GROWTH',
      items: [
        { id: 'marketing', label: '18. Marketing ROI & Campaigns', icon: 'fa-bullhorn' },
        { id: 'franchise', label: '19. Franchise & Agreement Hub', icon: 'fa-handshake' }
      ]
    },
    {
      group: 'OWNER WORKSPACE',
      items: [
        { id: 'dailyReport', label: '20. Daily Owner Report', icon: 'fa-calendar-check' },
        { id: 'ownerTasks', label: '21. Owner Task Centre', icon: 'fa-list-check' },
        { id: 'ownerNotepad', label: '22. Owner Notepad', icon: 'fa-note-sticky' },
        { id: 'meetings', label: '23. Meetings & Schedule', icon: 'fa-calendar-days' },
        { id: 'decisions', label: '24. Decision Register', icon: 'fa-gavel' },
        { id: 'reportCentre', label: '25. Owner Report Centre', icon: 'fa-print' }
      ]
    }
  ];

  // Handlers
  const handleAddWithdrawal = (e) => {
    e.preventDefault();
    const form = e.target;
    const amount = Number(form.amount.value) || 100000;
    const newWdl = {
      id: 'WDL-' + Math.floor(100 + Math.random() * 900),
      owner: db.user.name,
      amount,
      date: new Date().toISOString().slice(0, 10),
      reason: form.reason.value,
      approvalLevel: 'Under CFO Review',
      status: 'Pending CFO Review'
    };
    saveDb({
      ...db,
      withdrawals: [newWdl, ...db.withdrawals]
    });
    showToast(`Capital withdrawal request of ₹${amount.toLocaleString()} submitted to CFO!`, 'success');
    setActiveModal(null);
  };

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) return;
    const note = {
      id: 'ON-' + Date.now(),
      title: newNoteTitle,
      content: newNoteContent,
      date: new Date().toISOString().slice(0, 10),
      tag: 'Owner Idea',
      pinned: false
    };
    saveDb({ ...db, notes: [note, ...db.notes] });
    setNewNoteTitle('');
    setNewNoteContent('');
    showToast('Saved to Owner Notepad!', 'success');
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
        
        #owner-sidebar { width: var(--sidebar-width); height: 100vh; background: #064e3b; color: #d1fae5; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; z-index: 100; transition: transform 0.3s ease; overflow-y: auto; padding-bottom: 16px; border-right: 1px solid rgba(255, 255, 255, 0.08); }
        #owner-sidebar .brand { padding: 18px 20px; font-size: 20px; font-weight: 700; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
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
        
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 24px; }
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
        .badge-status.active, .badge-status.completed, .badge-status.approved { background: #dcfce7; color: #065f46; }
        .badge-status.pending, .badge-status.in-progress { background: #fef3c7; color: #92400e; }
        .badge-status.critical, .badge-status.error { background: #fee2e2; color: #991b1b; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(6, 78, 59, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-box { background: #fff; width: 100%; max-width: 680px; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); max-height: 90vh; overflow-y: auto; padding: 24px; border: 1px solid #d1fae5; }
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
          <i className="fas fa-store"></i>
          <span>ePAY <span style={{ color: '#6ee7b7' }}>OWNER HUB</span></span>
          <small>v4.0 ERP</small>
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
            <div style={{ fontSize: 10, color: '#a7f3d0' }}>{db.user.gallery}</div>
          </div>
          <button className="btn btn-sm btn-outline" style={{ border: 'none', color: '#a7f3d0' }} title="Owner 50% Equity">
            <i className="fas fa-crown"></i>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div id="main">
        {/* HEADER */}
        <header id="header">
          <div className="header-title">
            <i className="fas fa-gem" style={{ color: '#059669' }}></i>
            <span>{currentPage.toUpperCase()} — Gallery Owner Command Hub</span>
            <span style={{ fontSize: 11, background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: 6, marginLeft: 8 }}>
              Business Health: {db.healthScores.overallScore}%
            </span>
          </div>

          <div className="header-actions">
            <div style={{ display: 'flex', alignItems: 'center', background: '#ecfdf5', borderRadius: 8, padding: '4px 12px', border: '1px solid #d1fae5' }}>
              <i className="fas fa-search" style={{ color: '#6b7280', fontSize: 12, marginRight: 6 }}></i>
              <input
                type="text"
                placeholder="Search sales, stock, staff..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12, width: 160 }}
              />
            </div>
            
            <button className="btn btn-outline btn-sm" onClick={() => setActiveModal('new_withdrawal')}>
              <i className="fas fa-hand-holding-dollar"></i> Request Capital Withdrawal
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => showToast('Transmitted Owner Daily Closing report to CFO & HQ', 'success')}>
              <i className="fas fa-paper-plane"></i> Submit Day Closing
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
          {/* 1. OWNER DASHBOARD (3 LAYERS) */}
          {/* ========================================================== */}
          {currentPage === 'dashboard' && (
            <div>
              {/* BANNER: LAYER A. BUSINESS HEALTH SCORE */}
              <div style={{ background: '#064e3b', color: '#fff', borderRadius: 12, padding: 18, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase' }}>Gallery Owner 360° Health Matrix</span>
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Gallery Business Health Score: <span style={{ color: '#34d399' }}>{db.healthScores.overallScore}%</span></h2>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="badge-status active" style={{ padding: '6px 12px' }}>⭐ ROI: {db.businessKpis.roi}%</span>
                    <span className="badge-status active" style={{ padding: '6px 12px' }}>💰 Owner Profit Share: ₹{(db.businessKpis.profitShareAmount / 100000).toFixed(2)}L</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#a7f3d0' }}>REVENUE PERFORMANCE</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>{db.healthScores.revenuePerformance}%</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#a7f3d0' }}>NET PROFITABILITY</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>{db.healthScores.profitability}%</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#a7f3d0' }}>CUSTOMER GROWTH</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>{db.healthScores.customerGrowth}%</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#a7f3d0' }}>STAFF PRODUCTIVITY</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>{db.healthScores.employeePerformance}%</div>
                  </div>
                </div>
              </div>

              {/* LAYER A. BUSINESS HEALTH KPIS */}
              <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-label">Today's Revenue</div><div className="kpi-val">₹{(db.businessKpis.todayRevenue / 1000).toFixed(1)}k</div><div className="kpi-sub green">Target: ₹200k (92.5%)</div></div>
                <div className="kpi-card"><div className="kpi-label">Monthly Revenue</div><div className="kpi-val">₹{(db.businessKpis.monthlyRevenue / 100000).toFixed(2)}L</div><div className="kpi-sub green">Target: ₹50.0L (85%)</div></div>
                <div className="kpi-card"><div className="kpi-label">Net Profit (MTD)</div><div className="kpi-val" style={{ color: '#059669' }}>₹{(db.businessKpis.netProfit / 100000).toFixed(2)}L</div><div className="kpi-sub green">{db.businessKpis.profitMargin}% Net Margin</div></div>
                <div className="kpi-card"><div className="kpi-label">Owner Share (50%)</div><div className="kpi-val" style={{ color: '#059669' }}>₹{(db.businessKpis.profitShareAmount / 100000).toFixed(2)}L</div><div className="kpi-sub green">₹10.0L Disbursed</div></div>
                <div className="kpi-card"><div className="kpi-label">Annual ROI</div><div className="kpi-val" style={{ color: '#059669' }}>{db.businessKpis.roi}%</div><div className="kpi-sub green">Invested: ₹35.0L</div></div>
                <div className="kpi-card"><div className="kpi-label">Cash In Till & Bank</div><div className="kpi-val">₹{(db.operationsKpis.cashInTill / 100000).toFixed(2)}L</div><div className="kpi-sub green">Safe Liquidity</div></div>
              </div>

              {/* LAYER B. OPERATIONAL HEALTH */}
              <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-label">Staff Present</div><div className="kpi-val">{db.operationsKpis.employeesPresent} / {db.operationsKpis.employeesTotal}</div><div className="kpi-sub green">92.3% Attendance</div></div>
                <div className="kpi-card"><div className="kpi-label">Today's Tasks</div><div className="kpi-val">{db.operationsKpis.completedTasks} / {db.operationsKpis.todayTasks}</div><div className="kpi-sub green">47 Done, 6 Overdue</div></div>
                <div className="kpi-card"><div className="kpi-label">Leads & Conversion</div><div className="kpi-val">{db.operationsKpis.conversionsToday} / {db.operationsKpis.leadsToday}</div><div className="kpi-sub green">{db.operationsKpis.conversionRate}% Rate</div></div>
                <div className="kpi-card"><div className="kpi-label">Inventory Valuation</div><div className="kpi-val">₹{(db.operationsKpis.inventoryValue / 100000).toFixed(2)}L</div><div className="kpi-sub orange">8 Low Stock Items</div></div>
              </div>

              {/* LAYER C. OWNER ACTION CENTRE OVERVIEW */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-triangle-exclamation" style={{ color: '#dc2626' }}></i> Critical Action Centre Items</h3>
                    <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('actionCentre')}>View All (5)</button>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Item / Type</th><th>Entity</th><th>Due Date</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {db.actionItems.slice(0, 3).map(a => (
                        <tr key={a.id}>
                          <td><strong>{a.title}</strong><br /><small style={{ color: '#6b7280' }}>{a.type}</small></td>
                          <td>{a.entity}</td>
                          <td>{a.dueDate}</td>
                          <td><span className={'badge-status ' + (a.priority === 'Critical' ? 'critical' : 'pending')}>{a.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-chart-line" style={{ color: '#059669' }}></i> Service Revenue Mix</h3>
                    <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('salesRevenue')}>View Breakdown</button>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Service Stream</th><th>Revenue</th><th>Target %</th><th>Growth</th></tr>
                    </thead>
                    <tbody>
                      {db.serviceRevenue.map((s, idx) => (
                        <tr key={idx}>
                          <td><strong>{s.service}</strong></td>
                          <td>₹{(s.revenue / 100000).toFixed(1)}L</td>
                          <td><span className="badge-status active">{s.pct}%</span></td>
                          <td><strong style={{ color: '#059669' }}>{s.growth}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 2. MASTER CONTROL CENTRE */}
          {/* ========================================================== */}
          {currentPage === 'masterControl' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-tower-broadcast"></i> Gallery Owner Master Control Cockpit</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Integrated Business, Cash, Sales Target, Team & Inventory Overview</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={{ background: '#fff', padding: 18, borderRadius: 12, border: '1px solid #d1fae5' }}>
                  <h4 style={{ color: '#064e3b', fontSize: 14, marginBottom: 8 }}><i className="fas fa-chart-pie"></i> Business Performance</h4>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#064e3b' }}>₹42.50L <span style={{ fontSize: 13, color: '#059669' }}>Rev</span></div>
                  <div style={{ fontSize: 13, color: '#059669', marginTop: 4 }}>Net Profit: <strong>₹28.35L</strong> | ROI: <strong>34.28%</strong></div>
                </div>

                <div style={{ background: '#fff', padding: 18, borderRadius: 12, border: '1px solid #d1fae5' }}>
                  <h4 style={{ color: '#064e3b', fontSize: 14, marginBottom: 8 }}><i className="fas fa-vault"></i> Cash & Working Capital</h4>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#064e3b' }}>₹8.20L <span style={{ fontSize: 13, color: '#059669' }}>Cash</span></div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>AR Receivables: <strong>₹4.8L</strong> | AP Payables: <strong>₹2.0L</strong></div>
                </div>

                <div style={{ background: '#fff', padding: 18, borderRadius: 12, border: '1px solid #d1fae5' }}>
                  <h4 style={{ color: '#064e3b', fontSize: 14, marginBottom: 8 }}><i className="fas fa-bullseye"></i> Sales Target (85%)</h4>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#064e3b' }}>₹42.5L / ₹50L</div>
                  <div style={{ fontSize: 13, color: '#d97706', marginTop: 4 }}>Gap: <strong>₹7.50L</strong> (6 Days Remaining)</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 3. OWNER ACTION CENTRE & 4. CRITICAL ALERTS */}
          {/* ========================================================== */}
          {(currentPage === 'actionCentre' || currentPage === 'criticalAlerts') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-bolt"></i> Owner Action & Priority Task Queue</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Critical Customer Issues, Cash Exceptions, Stock Reorders & Renewals</p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Severity</th><th>Action Title</th><th>Category Type</th><th>Entity</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {db.actionItems.map(a => (
                      <tr key={a.id}>
                        <td>
                          {a.priority === 'Critical' ? (
                            <span style={{ color: '#dc2626', fontWeight: 700 }}><i className="fas fa-circle-dot"></i> CRITICAL RED</span>
                          ) : (
                            <span style={{ color: '#d97706', fontWeight: 700 }}><i className="fas fa-triangle-exclamation"></i> ACTION REQUIRED</span>
                          )}
                        </td>
                        <td><strong>{a.title}</strong></td>
                        <td>{a.type}</td>
                        <td>{a.entity}</td>
                        <td>{a.dueDate}</td>
                        <td><span className={'badge-status ' + (a.priority === 'Critical' ? 'critical' : 'pending')}>{a.status}</span></td>
                        <td>
                          <button className="btn btn-xs btn-outline" onClick={() => showToast(`Opening action resolution workflow for ${a.title}`, 'info')}>
                            Resolve
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
          {/* 5. OWNERSHIP & SHAREHOLDING & 6. CAPITAL CONTRIBUTIONS */}
          {/* ========================================================== */}
          {(currentPage === 'ownershipEquity' || currentPage === 'capitalLedger' || currentPage === 'profitSharing') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-id-card-clip"></i> Ownership Shareholding & Capital Ledger</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Multi-Owner Capital Contributions, Profit Sharing %, Withdrawals & Current Equity</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_withdrawal')}>
                  <i className="fas fa-hand-holding-dollar"></i> Request Capital Withdrawal
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Owner ID</th>
                      <th>Partner Name</th>
                      <th>Role & Designation</th>
                      <th>Ownership %</th>
                      <th>Initial Capital</th>
                      <th>Profit Share (YTD)</th>
                      <th>Withdrawals</th>
                      <th>Current Owner Capital</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.shareholders.map(s => (
                      <tr key={s.id}>
                        <td><code>{s.id}</code></td>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.role}</td>
                        <td><strong style={{ color: '#059669', fontSize: 14 }}>{s.sharePct}%</strong></td>
                        <td>₹{s.capital.toLocaleString()}</td>
                        <td><strong style={{ color: '#059669' }}>₹{s.profitShareTotal.toLocaleString()}</strong></td>
                        <td><span style={{ color: '#dc2626' }}>-₹{s.withdrawals.toLocaleString()}</span></td>
                        <td><strong style={{ color: '#064e3b', fontSize: 14 }}>₹{s.currentCapital.toLocaleString()}</strong></td>
                        <td><span className="badge-status active">{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 7. CAPITAL WITHDRAWALS */}
          {/* ========================================================== */}
          {currentPage === 'withdrawals' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-hand-holding-dollar"></i> Capital Withdrawal History & Requests</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Formal Request Protocol with Mandatory CFO & CEO Joint Authorization</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_withdrawal')}>
                  <i className="fas fa-plus"></i> New Withdrawal Request
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Request ID</th><th>Owner Name</th><th>Requested Amount</th><th>Date</th><th>Business Reason</th><th>Approval Tier</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {db.withdrawals.map(w => (
                      <tr key={w.id}>
                        <td><code>{w.id}</code></td>
                        <td><strong>{w.owner}</strong></td>
                        <td><strong style={{ color: '#064e3b', fontSize: 14 }}>₹{w.amount.toLocaleString()}</strong></td>
                        <td>{w.date}</td>
                        <td style={{ maxWidth: 280, fontSize: 12 }}>{w.reason}</td>
                        <td><strong>{w.approvalLevel}</strong></td>
                        <td><span className={'badge-status ' + (w.status === 'Disbursed' ? 'active' : 'pending')}>{w.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 9. GALLERY OWNER P&L & 10. BALANCE SHEET */}
          {/* ========================================================== */}
          {(currentPage === 'galleryPnl' || currentPage === 'balanceSheet' || currentPage === 'cashBook' || currentPage === 'expenseCommand') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-file-invoice-dollar"></i> Gallery Profit & Loss Statement (P&L)</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Revenue: ₹42.50L | Direct Cost: ₹4.50L | Expenses: ₹9.65L | Net Profit: ₹28.35L (66.7% Margin)</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Exported Gallery P&L to Excel', 'success')}>
                  <i className="fas fa-download"></i> Export P&L
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <tbody>
                    <tr style={{ background: '#ecfdf5', fontWeight: 700 }}><td><strong>I. GROSS GALLERY REVENUE</strong></td><td style={{ textAlign: 'right', color: '#059669', fontSize: 15 }}>₹{db.pnl.grossRevenue.toLocaleString()}</td></tr>
                    <tr style={{ background: '#fee2e2', fontWeight: 700 }}><td><strong>II. DIRECT COSTS & GDS FEES</strong></td><td style={{ textAlign: 'right', color: '#dc2626' }}>(₹{db.pnl.directCost.toLocaleString()})</td></tr>
                    <tr style={{ background: '#f0fdf4', fontWeight: 700 }}><td><strong>III. GROSS PROFIT (I - II)</strong></td><td style={{ textAlign: 'right', color: '#047857' }}>₹{db.pnl.grossProfit.toLocaleString()}</td></tr>
                    
                    <tr style={{ background: '#fef3c7', fontWeight: 700 }}><td colSpan={2}><strong>IV. OPERATING OVERHEADS & EXPENSES</strong></td></tr>
                    <tr><td style={{ paddingLeft: 24 }}>Employee Salaries & Benefits</td><td style={{ textAlign: 'right' }}>₹{db.pnl.expenses.salary.toLocaleString()}</td></tr>
                    <tr><td style={{ paddingLeft: 24 }}>Commercial Property Rent (DLF Cyber)</td><td style={{ textAlign: 'right' }}>₹{db.pnl.expenses.rent.toLocaleString()}</td></tr>
                    <tr><td style={{ paddingLeft: 24 }}>Local Marketing & Ads Boosting</td><td style={{ textAlign: 'right' }}>₹{db.pnl.expenses.marketing.toLocaleString()}</td></tr>
                    <tr><td style={{ paddingLeft: 24 }}>Electricity, Power & Utilities</td><td style={{ textAlign: 'right' }}>₹{db.pnl.expenses.utilities.toLocaleString()}</td></tr>
                    <tr><td style={{ paddingLeft: 24 }}>Office Supplies & Maintenance</td><td style={{ textAlign: 'right' }}>₹{db.pnl.expenses.maintenance.toLocaleString()}</td></tr>
                    <tr><td style={{ paddingLeft: 24 }}>Other Operating Expenses</td><td style={{ textAlign: 'right' }}>₹{db.pnl.expenses.other.toLocaleString()}</td></tr>
                    
                    <tr style={{ background: '#ecfdf5', fontWeight: 700, fontSize: 15 }}>
                      <td><strong>V. NET OPERATING PROFIT</strong> (Margin: {db.pnl.marginPct}%)</td>
                      <td style={{ textAlign: 'right', color: '#047857', fontSize: 17 }}><strong>₹{db.pnl.netProfit.toLocaleString()}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 13. SALES & TARGET CENTRE & 14. CRM CUSTOMERS */}
          {/* ========================================================== */}
          {(currentPage === 'salesRevenue' || currentPage === 'crmCustomers') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-bullseye"></i> Sales Target & Lead Pipeline Command</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Target: ₹50.00L | Achieved: ₹42.50L (85.0%) | Remaining Gap: ₹7.50L (6 Days)</p>
                </div>
              </div>

              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-list-check"></i> Service Target Progress</h3>
                </div>
                <table>
                  <thead>
                    <tr><th>Service Category</th><th>Revenue Generated</th><th>Target</th><th>Progress %</th><th>Orders</th><th>YoY Growth</th></tr>
                  </thead>
                  <tbody>
                    {db.serviceRevenue.map((s, idx) => (
                      <tr key={idx}>
                        <td><strong>{s.service}</strong></td>
                        <td><strong style={{ color: '#059669' }}>₹{s.revenue.toLocaleString()}</strong></td>
                        <td>₹{s.target.toLocaleString()}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${s.pct}%`, height: '100%', background: s.pct >= 85 ? '#059669' : '#d97706' }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700 }}>{s.pct}%</span>
                          </div>
                        </td>
                        <td>{s.orders} bookings</td>
                        <td><strong style={{ color: '#059669' }}>{s.growth}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 15. EMPLOYEE SUPERVISION */}
          {/* ========================================================== */}
          {currentPage === 'employeeSupervision' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-user-check"></i> Gallery Staff Attendance & Productivity</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>24 Present / 26 Total Staff (92.3% Attendance)</p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Staff Member</th><th>Role / Function</th><th>Today's Attendance</th><th>Tasks Completed</th><th>Sales Contribution</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {db.employees.map(e => (
                      <tr key={e.id}>
                        <td><strong>{e.name}</strong></td>
                        <td>{e.role}</td>
                        <td>{e.attendance}</td>
                        <td><strong>{e.completed}</strong> / {e.tasks}</td>
                        <td><strong style={{ color: '#059669' }}>{e.sales}</strong></td>
                        <td><span className={'badge-status ' + (e.status.includes('On Leave') ? 'critical' : 'active')}>{e.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 16. INVENTORY & STOCK CONTROL */}
          {/* ========================================================== */}
          {currentPage === 'inventory' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-boxes-stacked"></i> Gallery Inventory & Merchandise Stock</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Total Stock Value: ₹18.70L | 8 Low Stock Items | 3 Out of Stock</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Generated Purchase Reorder Batch for Low Stock Items', 'success')}>
                  <i className="fas fa-cart-plus"></i> Auto-Reorder Stock
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Item Description</th><th>SKU Code</th><th>Available Stock</th><th>Reorder Level</th><th>Unit Price</th><th>Total Value</th><th>Stock Status</th></tr>
                  </thead>
                  <tbody>
                    {db.inventory.map(item => (
                      <tr key={item.id}>
                        <td><strong>{item.item}</strong></td>
                        <td><code>{item.sku}</code></td>
                        <td><strong>{item.stock} units</strong></td>
                        <td>{item.reorderLevel} units</td>
                        <td>₹{item.unitPrice}</td>
                        <td>₹{item.totalValue.toLocaleString()}</td>
                        <td><span className={'badge-status ' + (item.status.includes('Out') ? 'critical' : item.status.includes('Low') ? 'pending' : 'active')}>{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 18. MARKETING ROI & 19. FRANCHISE HUB */}
          {/* ========================================================== */}
          {(currentPage === 'marketing' || currentPage === 'franchise' || currentPage === 'vendors') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-bullhorn"></i> Marketing ROI & Local Campaigns</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Local Promotions, Ads Boosting, Lead Influx & Conversion ROI</p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Campaign Title</th><th>Campaign Spend</th><th>Leads Generated</th><th>Converted Customers</th><th>Revenue</th><th>ROAS Multiplier</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {db.campaigns.map(c => (
                      <tr key={c.id}>
                        <td><strong>{c.name}</strong></td>
                        <td>₹{c.spend.toLocaleString()}</td>
                        <td>{c.leads}</td>
                        <td>{c.conversions}</td>
                        <td><strong style={{ color: '#059669' }}>₹{c.revenue.toLocaleString()}</strong></td>
                        <td><strong style={{ color: '#047857', fontSize: 14 }}>{c.roi}</strong></td>
                        <td><span className="badge-status active">{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* OWNER WORKSPACE: DAILY REPORT, NOTEPAD, TASKS, DECISIONS */}
          {/* ========================================================== */}
          {(currentPage === 'dailyReport' || currentPage === 'ownerTasks' || currentPage === 'ownerNotepad' || currentPage === 'meetings' || currentPage === 'decisions' || currentPage === 'reportCentre') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}>
                    <i className="fas fa-user-gear"></i> {currentPage.toUpperCase()} — Gallery Owner Executive Suite
                  </h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Daily Operational Reports, Decisions, Ideas Notepad & Report Library</p>
                </div>
              </div>

              {/* DAILY REPORT VIEW */}
              {currentPage === 'dailyReport' && (
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-calendar-check"></i> Gallery Daily Owner Closing Summary</h3>
                    <button className="btn btn-sm btn-primary" onClick={() => showToast('Submitted Day Closing Dossier to HQ Operations', 'success')}>
                      Transmit to HQ
                    </button>
                  </div>
                  <table>
                    <tbody>
                      <tr><td><strong>Today's Revenue Collected</strong></td><td>₹1,85,000 (Target: ₹2,00,000 — 92.5% Achieved)</td></tr>
                      <tr><td><strong>Total Customer Footfall</strong></td><td>185 Customers (18 New Conversions, 42 Active Leads)</td></tr>
                      <tr><td><strong>Cash & Collections</strong></td><td>₹1,42,000 Collections | ₹18,500 Petty Cash Expenses</td></tr>
                      <tr><td><strong>Staff Attendance & Tasks</strong></td><td>24 / 26 Present | 47 / 58 Tasks Completed</td></tr>
                      <tr><td><strong>Customer Complaints</strong></td><td>2 Critical Complaints in resolution | 3 Minor Resolved</td></tr>
                      <tr><td><strong>Daily Closing Status</strong></td><td><span className="badge-status active">SUBMITTED & VERIFIED</span></td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* DECISION REGISTER */}
              {currentPage === 'decisions' && (
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-gavel"></i> Owner Decision Register</h3>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Decision ID</th><th>Date</th><th>Subject</th><th>Financial Impact</th><th>Operational Impact</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {db.decisions.map(d => (
                        <tr key={d.id}>
                          <td><code>{d.id}</code></td>
                          <td>{d.date}</td>
                          <td><strong>{d.subject}</strong></td>
                          <td><strong style={{ color: '#064e3b' }}>{d.financialImpact}</strong></td>
                          <td>{d.operationalImpact}</td>
                          <td><span className="badge-status active">{d.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* OWNER NOTEPAD */}
              {currentPage === 'ownerNotepad' && (
                <div>
                  <div style={{ background: '#fff', padding: 18, borderRadius: 12, border: '1px solid #d1fae5', marginBottom: 20 }}>
                    <h4 style={{ fontSize: 14, color: '#064e3b', marginBottom: 10 }}>Write New Business Strategy Idea</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                      <input
                        type="text"
                        placeholder="Idea Title (e.g. Luxury VIP Wedding Tour Packages)"
                        value={newNoteTitle}
                        onChange={e => setNewNoteTitle(e.target.value)}
                        style={{ padding: 10, border: '1px solid #d1fae5', borderRadius: 8, fontSize: 13, outline: 'none' }}
                      />
                      <textarea
                        placeholder="Write detailed expansion thoughts, marketing campaigns, client notes..."
                        value={newNoteContent}
                        onChange={e => setNewNoteContent(e.target.value)}
                        rows={3}
                        style={{ padding: 10, border: '1px solid #d1fae5', borderRadius: 8, fontSize: 13, outline: 'none' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary btn-sm" onClick={handleAddNote}>
                          <i className="fas fa-save"></i> Save Idea
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="table-wrap">
                    <div className="table-header">
                      <h3><i className="fas fa-list"></i> Saved Strategy Memos</h3>
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

              {/* OWNER REPORT LIBRARY */}
              {currentPage === 'reportCentre' && (
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-print"></i> Owner Master Report Library</h3>
                  </div>
                  <table>
                    <tbody>
                      <tr><td><strong>1. Gallery Profit & Loss Statement (P&L)</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-outline" onClick={() => showToast('Exporting P&L...', 'info')}>Export</button></td></tr>
                      <tr><td><strong>2. Multi-Owner Shareholding & Capital Report</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-outline" onClick={() => showToast('Exporting Equity Report...', 'info')}>Export</button></td></tr>
                      <tr><td><strong>3. Owner ROI & Profit Sharing Statement</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-outline" onClick={() => showToast('Exporting ROI Report...', 'info')}>Export</button></td></tr>
                      <tr><td><strong>4. Daily Cash Book & Till Reconciliation</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-outline" onClick={() => showToast('Exporting Cash Book...', 'info')}>Export</button></td></tr>
                      <tr><td><strong>5. Sales Target & Service Performance Report</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-outline" onClick={() => showToast('Exporting Sales Report...', 'info')}>Export</button></td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* MODAL: CAPITAL WITHDRAWAL REQUEST */}
      {/* ========================================================== */}
      {activeModal === 'new_withdrawal' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-hand-holding-dollar" style={{ color: '#059669' }}></i> Submit Capital Withdrawal Request</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddWithdrawal}>
              <div className="form-group">
                <label>Withdrawal Amount (₹) *</label>
                <input type="number" name="amount" defaultValue="250000" required />
              </div>
              <div className="form-group">
                <label>Available Owner Capital</label>
                <input type="text" value={`₹${db.businessKpis.ownerCapital.toLocaleString()}`} disabled style={{ background: '#f3f4f6' }} />
              </div>
              <div className="form-group">
                <label>Business / Personal Reason *</label>
                <textarea name="reason" required placeholder="Specify reason for dividend distribution or capital drawdown..."></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Transmit Request to CFO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
