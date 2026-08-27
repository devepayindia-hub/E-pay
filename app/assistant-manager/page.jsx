'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadarController,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Radar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadarController,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
);

// ====== LOCALSTORAGE DATA STORE ======
const DB_KEY = 'am_dashboard_data_v2';

function defaultDB() {
    return {
        gallery: {
            id: 1,
            name: 'Pune Central Gallery',
            location: 'Pune',
            city: 'Pune',
            state: 'Maharashtra',
            manager: 'Anita Desai',
            employees: 26,
            status: 'active',
            health: 93,
            sales: 4200000,
            target: 4000000,
            profit: 840000,
            customers: 1420,
            members: 584,
            inventory: 26000000,
            expenses: 1240000,
            complaints: 5,
            openTasks: 8,
            todaySales: 185000,
            todayTarget: 200000,
            todayCustomers: 185,
            todayOrders: 42,
        },
        employees: [
            { id: 1, name: 'Anita Desai', role: 'Gallery Manager', email: 'anita@crm.com', phone: '+91 98765 43210', status: 'active', attendance: 96, performance: 94, shift: 'Morning', checkIn: '09:00', checkOut: '18:00', lateMinutes: 0, break: 60, overtime: 0 },
            { id: 2, name: 'Sunita Rao', role: 'Assistant Manager', email: 'sunita@crm.com', phone: '+91 98765 43216', status: 'active', attendance: 95, performance: 90, shift: 'Morning', checkIn: '08:55', checkOut: '18:05', lateMinutes: 0, break: 60, overtime: 0.17 },
            { id: 3, name: 'Rajesh Kumar', role: 'Sales Associate', email: 'rajesh@crm.com', phone: '+91 98765 43222', status: 'active', attendance: 92, performance: 88, shift: 'Morning', checkIn: '09:10', checkOut: '18:15', lateMinutes: 10, break: 60, overtime: 0.25 },
            { id: 4, name: 'Priya Singh', role: 'Sales Associate', email: 'priya@crm.com', phone: '+91 98765 43223', status: 'active', attendance: 94, performance: 91, shift: 'Morning', checkIn: '08:50', checkOut: '18:00', lateMinutes: 0, break: 60, overtime: 0 },
            { id: 5, name: 'Amit Verma', role: 'Inventory Specialist', email: 'amit@crm.com', phone: '+91 98765 43224', status: 'active', attendance: 89, performance: 85, shift: 'Morning', checkIn: '09:05', checkOut: '18:10', lateMinutes: 5, break: 60, overtime: 0.17 },
            { id: 6, name: 'Neha Gupta', role: 'Customer Service', email: 'neha@crm.com', phone: '+91 98765 43225', status: 'active', attendance: 97, performance: 93, shift: 'Morning', checkIn: '08:45', checkOut: '18:00', lateMinutes: 0, break: 60, overtime: 0 },
            { id: 7, name: 'Vikram Singh', role: 'Sales Associate', email: 'vikram@crm.com', phone: '+91 98765 43226', status: 'active', attendance: 86, performance: 82, shift: 'Evening', checkIn: '12:00', checkOut: '21:00', lateMinutes: 0, break: 60, overtime: 0 },
            { id: 8, name: 'Deepa Reddy', role: 'Sales Associate', email: 'deepa@crm.com', phone: '+91 98765 43227', status: 'active', attendance: 93, performance: 89, shift: 'Evening', checkIn: '12:10', checkOut: '21:05', lateMinutes: 10, break: 60, overtime: 0.08 },
            { id: 9, name: 'Suresh Nair', role: 'Inventory Specialist', email: 'suresh@crm.com', phone: '+91 98765 43228', status: 'active', attendance: 90, performance: 86, shift: 'Morning', checkIn: '09:00', checkOut: '18:00', lateMinutes: 0, break: 60, overtime: 0 },
            { id: 10, name: 'Kavita Reddy', role: 'Customer Service', email: 'kavita@crm.com', phone: '+91 98765 43229', status: 'active', attendance: 96, performance: 92, shift: 'Morning', checkIn: '08:50', checkOut: '18:10', lateMinutes: 0, break: 60, overtime: 0.17 },
            { id: 11, name: 'Arjun Singh', role: 'Sales Associate', email: 'arjun@crm.com', phone: '+91 98765 43230', status: 'active', attendance: 65, performance: 72, shift: 'Evening', checkIn: '12:30', checkOut: '21:30', lateMinutes: 30, break: 60, overtime: 0.5 },
            { id: 12, name: 'Meera Iyer', role: 'Sales Associate', email: 'meera@crm.com', phone: '+91 98765 43231', status: 'active', attendance: 91, performance: 87, shift: 'Morning', checkIn: '09:00', checkOut: '18:00', lateMinutes: 0, break: 60, overtime: 0 },
        ],
        shifts: [
            { id: 1, name: 'Morning Shift', startTime: '09:00', endTime: '18:00', breakDuration: '60', gracePeriod: '15', weeklyOff: 'Sunday', nightShift: false, shiftAllowance: 0, status: 'active' },
            { id: 2, name: 'Evening Shift', startTime: '12:00', endTime: '21:00', breakDuration: '60', gracePeriod: '15', weeklyOff: 'Sunday', nightShift: false, shiftAllowance: 0, status: 'active' },
        ],
        tasks: [
            { id: 1, title: 'Stock verification - Electricals', category: 'Inventory', priority: 'critical', assignedTo: 'Amit Verma', status: 'in-progress', created: '2026-08-12', dueDate: '2026-08-12', estimatedTime: 2, actualTime: 0, progress: 60, blocked: false },
            { id: 2, title: 'Customer follow-up calls', category: 'Customer Service', priority: 'high', assignedTo: 'Neha Gupta', status: 'pending', created: '2026-08-12', dueDate: '2026-08-13', estimatedTime: 1.5, actualTime: 0, progress: 0, blocked: false },
            { id: 3, title: 'Resolve complaint #3', category: 'Customer Service', priority: 'critical', assignedTo: 'Kavita Reddy', status: 'open', created: '2026-08-12', dueDate: '2026-08-12', estimatedTime: 1, actualTime: 0, progress: 0, blocked: false },
            { id: 4, title: 'Inventory reconciliation', category: 'Inventory', priority: 'high', assignedTo: 'Suresh Nair', status: 'in-progress', created: '2026-08-11', dueDate: '2026-08-14', estimatedTime: 3, actualTime: 1.5, progress: 50, blocked: false },
            { id: 5, title: 'Staff training - New products', category: 'Training', priority: 'medium', assignedTo: 'Anita Desai', status: 'pending', created: '2026-08-10', dueDate: '2026-08-15', estimatedTime: 2, actualTime: 0, progress: 0, blocked: false },
            { id: 6, title: 'Cash reconciliation', category: 'Finance', priority: 'high', assignedTo: 'Sunita Rao', status: 'completed', created: '2026-08-11', dueDate: '2026-08-11', estimatedTime: 1, actualTime: 1.2, progress: 100, blocked: false },
            { id: 7, title: 'Display arrangement change', category: 'Operations', priority: 'medium', assignedTo: 'Rajesh Kumar', status: 'pending', created: '2026-08-10', dueDate: '2026-08-13', estimatedTime: 1.5, actualTime: 0, progress: 0, blocked: false },
            { id: 8, title: 'Complaint #7 investigation', category: 'Customer Service', priority: 'critical', assignedTo: 'Assistant Manager', status: 'open', created: '2026-08-12', dueDate: '2026-08-12', estimatedTime: 1, actualTime: 0, progress: 0, blocked: false },
            { id: 9, title: 'POS system update', category: 'Maintenance', priority: 'high', assignedTo: 'Assistant Manager', status: 'blocked', created: '2026-08-10', dueDate: '2026-08-12', estimatedTime: 1, actualTime: 0, progress: 0, blocked: true },
        ],
        complaints: [
            { id: 1, customer: 'Mr. Sharma', category: 'Service', severity: 'high', description: 'Delayed delivery of product', status: 'in-progress', created: '2026-08-10', sla: '24h', assignedTo: 'Anita Desai', resolution: '' },
            { id: 2, customer: 'Ms. Patel', category: 'Product', severity: 'medium', description: 'Item received damaged', status: 'resolved', created: '2026-08-08', sla: '48h', assignedTo: 'Sunita Rao', resolution: 'Replaced item same day' },
            { id: 3, customer: 'Mr. Kumar', category: 'Service', severity: 'critical', description: 'Wrong order delivered, urgent', status: 'open', created: '2026-08-12', sla: '4h', assignedTo: 'Sunita Rao', resolution: '' },
            { id: 4, customer: 'Mrs. Gupta', category: 'Billing', severity: 'low', description: 'Billing discrepancy', status: 'pending', created: '2026-08-09', sla: '24h', assignedTo: 'Kavita Reddy', resolution: '' },
            { id: 5, customer: 'Mr. Desai', category: 'Product', severity: 'high', description: 'Product quality issue', status: 'in-progress', created: '2026-08-11', sla: '24h', assignedTo: 'Priya Singh', resolution: '' },
        ],
        inventoryItems: [
            { id: 1, product: 'Smart POS Terminal V2', stock: 120, minStock: 25, demandForecast: 38, soldThisMonth: 42, aging: 15, status: 'good' },
            { id: 2, product: 'QR Soundbox Speaker', stock: 18, minStock: 25, demandForecast: 30, soldThisMonth: 12, aging: 45, status: 'low' },
            { id: 3, product: 'Thermal Printer Roll Pack', stock: 55, minStock: 40, demandForecast: 50, soldThisMonth: 35, aging: 20, status: 'good' },
            { id: 4, product: 'Barcode Scanner Handheld', stock: 8, minStock: 20, demandForecast: 22, soldThisMonth: 5, aging: 60, status: 'low' },
            { id: 5, product: 'Biometric Attendance Device', stock: 45, minStock: 30, demandForecast: 35, soldThisMonth: 28, aging: 14, status: 'good' },
            { id: 6, product: 'Legacy Card Swiping Machine', stock: 200, minStock: 50, demandForecast: 45, soldThisMonth: 10, aging: 110, status: 'slow' },
        ],
        expenses: [
            { id: 1, category: 'Utilities', amount: 45000, date: '2026-08-12', status: 'approved', description: 'Monthly electricity bill' },
            { id: 2, category: 'Maintenance', amount: 28000, date: '2026-08-12', status: 'pending', description: 'AC Servicing & filter change' },
            { id: 3, category: 'Travel', amount: 12000, date: '2026-08-11', status: 'approved', description: 'Client meeting transportation' },
            { id: 4, category: 'Supplies', amount: 8000, date: '2026-08-12', status: 'pending', description: 'Office stationery and printing' },
        ],
        pettyCash: [
            { id: 1, opening: 25000, received: 20000, spent: 31500, closing: 13500, physical: 13100, variance: -400, date: '2026-08-12' },
        ],
        approvals: [
            { id: 1, type: 'Petty Cash', requestedBy: 'Rajesh Kumar', amount: 2500, reason: 'Emergency electrical repair', status: 'pending', createdAt: '2026-08-12', priority: 'high' },
            { id: 2, type: 'Expense', requestedBy: 'Sunita Rao', amount: 28000, reason: 'AC maintenance', status: 'pending', createdAt: '2026-08-12', priority: 'medium' },
            { id: 3, type: 'Task Exception', requestedBy: 'Amit Verma', amount: 0, reason: 'Stock count variance', status: 'pending', createdAt: '2026-08-11', priority: 'high' },
            { id: 4, type: 'Stock Request', requestedBy: 'Suresh Nair', amount: 45000, reason: 'QR Soundbox Speaker restock', status: 'pending', createdAt: '2026-08-10', priority: 'high' },
        ],
        maintenance: [
            { id: 1, asset: 'AC Unit Main Hall', problem: 'Not cooling properly', priority: 'high', vendor: 'CoolTech Services', cost: 12000, eta: '2026-08-14', status: 'in-progress' },
            { id: 2, asset: 'Billing Counter POS 2', problem: 'Touchscreen unresponsive', priority: 'medium', vendor: 'TechSupport India', cost: 5000, eta: '2026-08-13', status: 'scheduled' },
            { id: 3, asset: 'CCTV Entrance Camera', problem: 'Video signal feed flickering', priority: 'high', vendor: 'SecureView Systems', cost: 8000, eta: '2026-08-12', status: 'completed' },
        ],
        stockCounts: [
            { id: 1, product: 'Smart POS Terminal V2', systemQty: 120, physicalQty: 118, difference: -2, valueVariance: -40000, counter: 'Amit Verma', verifier: 'Sunita Rao', date: '2026-08-11', remarks: 'Packaging damaged' },
            { id: 2, product: 'QR Soundbox Speaker', systemQty: 18, physicalQty: 17, difference: -1, valueVariance: -20000, counter: 'Suresh Nair', verifier: 'Sunita Rao', date: '2026-08-11', remarks: 'Pending investigation' },
        ],
        damagedStock: [
            { id: 1, product: 'Thermal Printer Roll Pack', quantity: 2, reason: 'Water leakage damage', value: 4000, employee: 'Rajesh Kumar', date: '2026-08-10', status: 'pending', photo: '' },
        ],
        memberships: [
            { id: 1, newMembers: 24, renewals: 18, expiring: 12, expired: 8, revenue: 720000 },
        ],
        hourlySales: [
            { hour: '10 AM', amount: 18000 },
            { hour: '11 AM', amount: 24000 },
            { hour: '12 PM', amount: 31000 },
            { hour: '1 PM', amount: 42000 },
            { hour: '2 PM', amount: 29000 },
            { hour: '3 PM', amount: 35000 },
            { hour: '4 PM', amount: 28000 },
            { hour: '5 PM', amount: 22000 },
            { hour: '6 PM', amount: 15000 },
        ],
        openingChecklist: [
            { id: 1, item: 'Gallery unlocked & premises inspected', status: 'completed' },
            { id: 2, item: 'Security & CCTV cameras verified active', status: 'completed' },
            { id: 3, item: 'Staff morning attendance verified', status: 'completed' },
            { id: 4, item: 'Assistant Manager on-duty present', status: 'completed' },
            { id: 5, item: 'POS counters & printers operational', status: 'completed' },
            { id: 6, item: 'High-speed internet connection checked', status: 'completed' },
            { id: 7, item: 'UPI / Card payment machines tested', status: 'completed' },
            { id: 8, item: 'Opening cash float verified in vault', status: 'completed' },
            { id: 9, item: 'Display items & stock lighting checked', status: 'completed' },
            { id: 10, item: 'Floor cleanliness & safety verified', status: 'completed' },
        ],
        closingChecklist: [
            { id: 1, item: 'Daily Sales Reconciled with POS', status: 'pending' },
            { id: 2, item: 'Cash Drawer Verified & Batched', status: 'pending' },
            { id: 3, item: 'UPI & Card Settlement Reports Run', status: 'pending' },
            { id: 4, item: 'Inventory Returns & Damages Logged', status: 'pending' },
            { id: 5, item: 'Petty Cash Vouchers Verified', status: 'pending' },
            { id: 6, item: 'Open Customer Complaints Updated', status: 'pending' },
            { id: 7, item: 'Shift Tasks Reviewed & Closed', status: 'pending' },
            { id: 8, item: 'Gallery Doors & Vault Locked Securely', status: 'pending' },
        ],
        shiftHandovers: [
            { id: 1, from: 'Sunita Rao', to: 'Vikram Singh', date: '2026-08-12', openIssues: 3, pendingComplaints: 2, stockIssue: 1, maintenance: 1, cashStatus: 'Verified', notes: 'Follow up on urgent customer complaint #3 immediately.', acknowledged: false },
        ],
        incidents: [
            { id: 1, type: 'Customer Pricing Dispute', severity: 'high', location: 'Sales Counter 1', description: 'Customer disputed promo discount application.', peopleInvolved: 'Mr. Kumar, Rajesh', immediateAction: 'Assistant Manager resolved via override', evidence: '', escalatedTo: 'Anita Desai', resolution: 'Resolved with standard 5% concession', rootCause: 'POS promo code expired', closure: '2026-08-12' },
        ],
        nextId: {
            task: 10,
            complaint: 6,
            expense: 5,
            pettyCash: 2,
            approval: 5,
            maintenance: 4,
            stockCount: 3,
            damagedStock: 2,
            membership: 2,
            shiftHandover: 2,
            incident: 2,
        },
    };
}

function loadDB() {
    if (typeof window === 'undefined') return defaultDB();
    try {
        const raw = localStorage.getItem(DB_KEY);
        if (!raw) return defaultDB();
        const data = JSON.parse(raw);
        const def = defaultDB();
        for (const k in def) { if (!data[k]) data[k] = def[k]; }
        if (!data.nextId) data.nextId = {};
        const idKeys = ['task', 'complaint', 'expense', 'pettyCash', 'approval', 'maintenance', 'stockCount', 'damagedStock', 'membership', 'shiftHandover', 'incident'];
        for (const key of idKeys) {
            if (!data.nextId[key]) data.nextId[key] = 10;
        }
        return data;
    } catch (_) { return defaultDB(); }
}

function saveDB(db) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ====== HELPERS ======
function genId(db, collection) {
    const key = collection;
    if (!db.nextId) db.nextId = {};
    if (!db.nextId[key]) db.nextId[key] = 1;
    return db.nextId[key]++;
}

function formatDate(d) {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function formatCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
    const num = Number(amount);
    if (num >= 10000000) return '₹' + (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000) return '₹' + (num / 100000).toFixed(2) + ' L';
    if (num >= 1000) return '₹' + (num / 1000).toFixed(1) + ' K';
    return '₹' + num.toLocaleString('en-IN');
}

function getHealthColor(score) {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#f59e0b';
    if (score >= 70) return '#f97316';
    return '#ef4444';
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'active':
        case 'completed':
        case 'resolved':
        case 'approved':
        case 'good':
            return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
        case 'pending':
        case 'in-progress':
        case 'scheduled':
        case 'open':
        case 'high':
        case 'slow':
            return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
        case 'critical':
        case 'danger':
        case 'rejected':
        case 'blocked':
        case 'low':
            return 'bg-red-500/15 text-red-400 border-red-500/30';
        default:
            return 'bg-slate-700/40 text-slate-300 border-slate-700';
    }
}

// ====== MAIN ASSISTANT MANAGER PORTAL COMPONENT ======
export default function AssistantManagerPortal() {
    const [db, setDb] = useState(defaultDB);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [toast, setToast] = useState(null);
    const [modal, setModal] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [reportType, setReportType] = useState('executive');
    const [reportDateRange, setReportDateRange] = useState('today');

    const currentUser = { id: 2, name: 'Assistant Manager', role: 'am' };

    // Load initial DB on client mount
    useEffect(() => {
        setDb(loadDB());
    }, []);

    // Helper to update DB & save to LocalStorage
    const updateDb = useCallback((updater) => {
        setDb(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            saveDB(next);
            return { ...next };
        });
    }, []);

    // Toast notification
    const showToast = useCallback((msg, type = 'info') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    }, []);

    const openModal = useCallback((content) => setModal(content), []);
    const closeModal = useCallback(() => setModal(null), []);

    // Navigation configuration
    const NAV_SECTIONS = [
        { group: 'Command', items: [{ id: 'dashboard', label: 'Command Center', icon: 'fa-gauge-high' }, { id: 'daily', label: 'Today\'s Action Center', icon: 'fa-clock' }] },
        { group: 'Gallery Ops', items: [{ id: 'opening', label: 'Opening Control', icon: 'fa-door-open' }, { id: 'closing', label: 'Closing Control', icon: 'fa-door-closed' }, { id: 'checklist', label: 'Daily Checklist', icon: 'fa-clipboard-list' }, { id: 'handover', label: 'Shift Handover', icon: 'fa-handshake' }] },
        { group: 'People', items: [{ id: 'employees', label: 'Employees', icon: 'fa-users' }, { id: 'attendance', label: 'Attendance', icon: 'fa-calendar-check' }, { id: 'shifts', label: 'Shift Management', icon: 'fa-user-clock' }, { id: 'performance', label: 'Performance', icon: 'fa-chart-simple' }] },
        { group: 'Tasks', items: [{ id: 'tasks', label: 'Task Center', icon: 'fa-tasks' }, { id: 'mytasks', label: 'My Tasks', icon: 'fa-list-check' }, { id: 'overdue', label: 'Overdue Tasks', icon: 'fa-hourglass-exclamation' }] },
        { group: 'Sales', items: [{ id: 'sales', label: 'Sales Monitor', icon: 'fa-chart-line' }, { id: 'floor', label: 'Sales Floor', icon: 'fa-store' }] },
        { group: 'Inventory', items: [{ id: 'inventory', label: 'Stock Control', icon: 'fa-cubes' }, { id: 'stockcount', label: 'Stock Count', icon: 'fa-calculator' }, { id: 'damaged', label: 'Damaged Stock', icon: 'fa-triangle-exclamation' }] },
        { group: 'Customers', items: [{ id: 'customers', label: 'Customer Service', icon: 'fa-user-group' }, { id: 'membership', label: 'Membership', icon: 'fa-id-card' }, { id: 'complaints', label: 'Complaints', icon: 'fa-headset' }] },
        { group: 'Finance', items: [{ id: 'cash', label: 'Cash Control', icon: 'fa-money-bill-wave' }, { id: 'expenses', label: 'Expenses', icon: 'fa-coins' }, { id: 'pettycash', label: 'Petty Cash', icon: 'fa-wallet' }] },
        { group: 'Operations', items: [{ id: 'maintenance', label: 'Maintenance', icon: 'fa-wrench' }, { id: 'compliance', label: 'Compliance', icon: 'fa-shield-halved' }, { id: 'incidents', label: 'Incidents', icon: 'fa-bell' }] },
        { group: 'Controls', items: [{ id: 'approvals', label: 'Approvals', icon: 'fa-check-double' }, { id: 'exceptions', label: 'Exceptions', icon: 'fa-circle-exclamation' }, { id: 'escalations', label: 'Escalations', icon: 'fa-arrow-up-right-dots' }] },
        { group: 'Reports', items: [{ id: 'reports', label: 'Realtime Reports', icon: 'fa-file-contract' }] },
    ];

    const getNavCount = useCallback((pageId) => {
        const counts = {
            approvals: db.approvals?.filter(a => a.status === 'pending').length || 0,
            complaints: db.complaints?.filter(c => c.status === 'open' || c.status === 'in-progress' || c.status === 'pending').length || 0,
            tasks: db.tasks?.filter(t => t.status === 'open' || t.status === 'pending' || t.status === 'in-progress').length || 0,
            overdue: db.tasks?.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length || 0,
            exceptions: db.complaints?.filter(c => c.severity === 'critical' || c.severity === 'high').length || 0,
            inventory: db.inventoryItems?.filter(i => i.status === 'low' || i.status === 'slow').length || 0,
            maintenance: db.maintenance?.filter(m => m.status === 'in-progress' || m.status === 'scheduled').length || 0,
            stockcount: db.stockCounts?.filter(s => s.difference !== 0).length || 0,
            damaged: db.damagedStock?.filter(d => d.status === 'pending').length || 0,
            incidents: db.incidents?.filter(i => !i.closure).length || 0,
            handover: db.shiftHandovers?.filter(h => !h.acknowledged).length || 0,
            escalations: db.complaints?.filter(c => c.severity === 'critical' && c.status !== 'resolved').length || 0,
            mytasks: db.tasks?.filter(t => t.assignedTo === currentUser.name && t.status !== 'completed').length || 0,
        };
        return counts[pageId] || 0;
    }, [db, currentUser.name]);

    // Export & Print helper methods for reports
    const exportCSV = (data, filename) => {
        if (!data || !data.length) return showToast('No data available to export.', 'warning');
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${filename}_${todayStr()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`Report exported as ${filename}.csv`, 'success');
    };

    const printReport = () => {
        window.print();
    };

    // ================= PAGE RENDERERS =================

    // 1. Dashboard (Command Center)
    const renderDashboard = () => {
        const g = db.gallery || {};
        const employees = db.employees || [];
        const present = employees.filter(e => e.attendance >= 85).length;
        const tasks = db.tasks || [];
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = tasks.filter(t => t.status !== 'completed').length;
        const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
        const lowStock = db.inventoryItems?.filter(i => i.status === 'low').length || 0;
        const pendingComplaints = db.complaints?.filter(c => c.status !== 'resolved').length || 0;
        const pendingApprovals = db.approvals?.filter(a => a.status === 'pending').length || 0;
        const ach = g.todayTarget > 0 ? Math.round((g.todaySales / g.todayTarget) * 100) : 0;
        const criticalIssues = (db.complaints?.filter(c => c.severity === 'critical' && c.status !== 'resolved').length || 0) +
                               (db.tasks?.filter(t => t.priority === 'critical' && t.status !== 'completed').length || 0);

        const hourlyData = db.hourlySales || [];
        const maxHourly = Math.max(...hourlyData.map(h => h.amount), 1);

        const healthMetrics = [
            { label: 'Sales Target', score: Math.min(100, ach) },
            { label: 'Staff On-Duty', score: employees.length ? Math.round((present / employees.length) * 100) : 0 },
            { label: 'Stock Health', score: Math.max(0, 100 - (lowStock * 15)) },
            { label: 'Footfall', score: Math.min(100, Math.round((g.todayCustomers / 200) * 100)) },
            { label: 'SLA Speed', score: Math.max(0, 100 - (pendingComplaints * 10)) },
            { label: 'Cash Balance', score: 98 },
            { label: 'Ops Safety', score: 94 },
            { label: 'Compliance', score: 97 },
        ];

        return (
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Today's Sales</span>
                            <i className="fa-solid fa-indian-rupee-sign text-emerald-400"></i>
                        </div>
                        <div className="text-xl font-bold text-white mt-2">{formatCurrency(g.todaySales)}</div>
                        <div className={`text-xs mt-2 font-semibold ${ach >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {ach}% of target ({formatCurrency(g.todayTarget)})
                        </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Staff Attendance</span>
                            <i className="fa-solid fa-users text-blue-400"></i>
                        </div>
                        <div className="text-xl font-bold text-white mt-2">{present} / {employees.length}</div>
                        <div className="text-xs text-blue-400 mt-2 font-semibold">
                            {employees.length ? Math.round((present / employees.length) * 100) : 0}% Present on floor
                        </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Pending Tasks</span>
                            <i className="fa-solid fa-tasks text-purple-400"></i>
                        </div>
                        <div className="text-xl font-bold text-white mt-2">{pending} Tasks</div>
                        <div className="text-xs text-slate-400 mt-2">
                            <span className="text-emerald-400 font-semibold">{completed} completed</span> · <span className="text-red-400">{overdue} overdue</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Pending Approvals</span>
                            <i className="fa-solid fa-check-double text-amber-400"></i>
                        </div>
                        <div className="text-xl font-bold text-white mt-2">{pendingApprovals} Pending</div>
                        <div className="text-xs text-amber-400 mt-2 font-semibold">Action required by AM</div>
                    </div>
                </div>

                {/* AI Operational Insight Banner */}
                <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/80 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-4 shadow-md">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg flex-shrink-0">
                        <i className="fa-solid fa-robot"></i>
                    </div>
                    <div className="flex-1 text-xs space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">AI Realtime Operational Assistant</span>
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">Live AI Active</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                            {lowStock > 0 ? `⚠️ Alert: ${lowStock} items low in inventory stock. ` : '✅ Inventory healthy. '}
                            {overdue > 0 ? `⏰ ${overdue} tasks are overdue! ` : '✅ Tasks on schedule. '}
                            {pendingComplaints > 0 ? `🚨 ${pendingComplaints} customer complaints open. ` : '✅ Zero escalation complaints. '}
                            Sales pace is at {ach}% of target with {formatCurrency(g.todaySales)} revenue generated today.
                        </p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
                        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-chart-bar text-emerald-400"></i> Hourly Revenue Stream (₹ K)
                        </h4>
                        <div className="h-64">
                            <Bar
                                data={{
                                    labels: hourlyData.map(h => h.hour),
                                    datasets: [{
                                        label: 'Revenue (₹)',
                                        data: hourlyData.map(h => Math.round(h.amount / 1000)),
                                        backgroundColor: hourlyData.map(h => (h.amount / maxHourly) > 0.75 ? '#10b981' : '#3b82f6'),
                                        borderRadius: 6,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
                                        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
                        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-heart-pulse text-indigo-400"></i> Gallery Operational Health Radar
                        </h4>
                        <div className="h-64 flex items-center justify-center">
                            <Radar
                                data={{
                                    labels: healthMetrics.map(m => m.label),
                                    datasets: [{
                                        label: 'Score %',
                                        data: healthMetrics.map(m => m.score),
                                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                        borderColor: '#10b981',
                                        pointBackgroundColor: '#10b981',
                                        borderWidth: 2,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        r: {
                                            min: 0,
                                            max: 100,
                                            grid: { color: '#1e293b' },
                                            angleLines: { color: '#334155' },
                                            pointLabels: { color: '#cbd5e1', font: { size: 10 } },
                                            ticks: { display: false }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Priority Operational Action Cards */}
                <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-list-check text-amber-400"></i> Today's Quick Action Center
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
                        <button onClick={() => setCurrentPage('exceptions')} className="bg-slate-900/90 border border-red-500/30 hover:border-red-500 p-3 rounded-lg text-left transition-all">
                            <div className="text-red-400 font-semibold">Critical Issues</div>
                            <div className="text-xl font-bold text-white mt-1">{criticalIssues}</div>
                            <div className="text-[10px] text-slate-400 mt-1">Requires immediate response</div>
                        </button>
                        <button onClick={() => setCurrentPage('overdue')} className="bg-slate-900/90 border border-amber-500/30 hover:border-amber-500 p-3 rounded-lg text-left transition-all">
                            <div className="text-amber-400 font-semibold">Overdue Tasks</div>
                            <div className="text-xl font-bold text-white mt-1">{overdue}</div>
                            <div className="text-[10px] text-slate-400 mt-1">Check overdue tasks list</div>
                        </button>
                        <button onClick={() => setCurrentPage('inventory')} className="bg-slate-900/90 border border-blue-500/30 hover:border-blue-500 p-3 rounded-lg text-left transition-all">
                            <div className="text-blue-400 font-semibold">Low Stock Items</div>
                            <div className="text-xl font-bold text-white mt-1">{lowStock}</div>
                            <div className="text-[10px] text-slate-400 mt-1">Request restock replenishment</div>
                        </button>
                        <button onClick={() => setCurrentPage('complaints')} className="bg-slate-900/90 border border-purple-500/30 hover:border-purple-500 p-3 rounded-lg text-left transition-all">
                            <div className="text-purple-400 font-semibold">Open Complaints</div>
                            <div className="text-xl font-bold text-white mt-1">{pendingComplaints}</div>
                            <div className="text-[10px] text-slate-400 mt-1">Customer SLA tracker</div>
                        </button>
                        <button onClick={() => setCurrentPage('approvals')} className="bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500 p-3 rounded-lg text-left transition-all">
                            <div className="text-emerald-400 font-semibold">Approvals Queue</div>
                            <div className="text-xl font-bold text-white mt-1">{pendingApprovals}</div>
                            <div className="text-[10px] text-slate-400 mt-1">Approve / Reject requests</div>
                        </button>
                        <button onClick={() => setCurrentPage('handover')} className="bg-slate-900/90 border border-teal-500/30 hover:border-teal-500 p-3 rounded-lg text-left transition-all">
                            <div className="text-teal-400 font-semibold">Shift Handovers</div>
                            <div className="text-xl font-bold text-white mt-1">{db.shiftHandovers?.filter(h => !h.acknowledged).length || 0}</div>
                            <div className="text-[10px] text-slate-400 mt-1">Pending acknowledgements</div>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // 2. Today's Action Center
    const renderDaily = () => {
        const g = db.gallery || {};
        const employees = db.employees || [];
        const present = employees.filter(e => e.attendance >= 85).length;
        const tasks = db.tasks || [];
        const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
        const critical = db.complaints?.filter(c => c.severity === 'critical' && c.status !== 'resolved').length || 0;
        const lowStock = db.inventoryItems?.filter(i => i.status === 'low').length || 0;
        const pendingApprovals = db.approvals?.filter(a => a.status === 'pending').length || 0;
        const ach = g.todayTarget > 0 ? Math.round((g.todaySales / g.todayTarget) * 100) : 0;

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-clock text-emerald-400"></i> Today's Action Center
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Realtime priority management and daily operational status</p>
                    </div>
                    <button onClick={() => showToast('Refreshed live metrics', 'success')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg border border-slate-700 flex items-center gap-2">
                        <i className="fa-solid fa-rotate text-emerald-400"></i> Refresh Live Metrics
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400 uppercase font-semibold">Critical Escalations</div>
                        <div className="text-2xl font-bold text-red-400 mt-2">{critical}</div>
                        <div className="text-xs text-slate-400 mt-1">Requires immediate intervention</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400 uppercase font-semibold">Sales Target Gap</div>
                        <div className="text-2xl font-bold text-amber-400 mt-2">{formatCurrency(Math.max(0, g.todayTarget - g.todaySales))}</div>
                        <div className="text-xs text-slate-400 mt-1">{ach}% of target reached</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400 uppercase font-semibold">Staff Shortage / Late</div>
                        <div className="text-2xl font-bold text-blue-400 mt-2">{employees.filter(e => e.lateMinutes > 0).length} Staff</div>
                        <div className="text-xs text-slate-400 mt-1">{present} staff present on floor</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400 uppercase font-semibold">Low Stock Alerts</div>
                        <div className="text-2xl font-bold text-purple-400 mt-2">{lowStock} Items</div>
                        <div className="text-xs text-slate-400 mt-1">Below minimum threshold</div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-white">Live Action Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-800/60 rounded-lg flex items-center justify-between border border-slate-700/60">
                            <div>
                                <div className="font-semibold text-slate-200">Morning Gallery Opening Checklist</div>
                                <div className="text-slate-400 text-[11px]">10/10 items completed</div>
                            </div>
                            <button onClick={() => setCurrentPage('opening')} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded text-[11px] font-semibold">View Control</button>
                        </div>
                        <div className="p-3 bg-slate-800/60 rounded-lg flex items-center justify-between border border-slate-700/60">
                            <div>
                                <div className="font-semibold text-slate-200">Evening Shift Handover</div>
                                <div className="text-slate-400 text-[11px]">{db.shiftHandovers?.filter(h => !h.acknowledged).length ? 'Pending acknowledgement' : 'All clear'}</div>
                            </div>
                            <button onClick={() => setCurrentPage('handover')} className="px-2.5 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-[11px] font-semibold">View Handover</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 3. Opening Control
    const renderOpening = () => {
        const checklist = db.openingChecklist || [];
        const completed = checklist.filter(c => c.status === 'completed').length;
        const total = checklist.length;
        const score = total > 0 ? Math.round((completed / total) * 100) : 0;

        const toggleItem = (id) => {
            updateDb(prev => {
                const item = prev.openingChecklist.find(c => c.id === id);
                if (item) item.status = item.status === 'completed' ? 'pending' : 'completed';
                return prev;
            });
            showToast('Opening checklist updated', 'success');
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-door-open text-emerald-400"></i> Opening Control
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Verify gallery readiness before customer entry</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-300">Completion Score:</span>
                        <span className="text-lg font-bold text-emerald-400">{score}%</span>
                    </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${score}%` }}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {checklist.map(c => (
                        <div key={c.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${c.status === 'completed' ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-900 border-slate-800'}`}>
                            <div className="flex items-center gap-3">
                                <button onClick={() => toggleItem(c.id)} className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all ${c.status === 'completed' ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600 text-transparent'}`}>
                                    ✓
                                </button>
                                <span className={`text-sm ${c.status === 'completed' ? 'text-slate-200 line-through' : 'text-slate-100 font-medium'}`}>{c.item}</span>
                            </div>
                            <button onClick={() => toggleItem(c.id)} className={`px-3 py-1 rounded text-xs font-semibold ${c.status === 'completed' ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
                                {c.status === 'completed' ? 'Undo' : 'Mark Done'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // 4. Closing Control
    const renderClosing = () => {
        const checklist = db.closingChecklist || [];
        const completed = checklist.filter(c => c.status === 'completed').length;
        const total = checklist.length;
        const score = total > 0 ? Math.round((completed / total) * 100) : 0;

        const toggleItem = (id) => {
            updateDb(prev => {
                const item = prev.closingChecklist.find(c => c.id === id);
                if (item) item.status = item.status === 'completed' ? 'pending' : 'completed';
                return prev;
            });
            showToast('Closing checklist updated', 'success');
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-door-closed text-indigo-400"></i> Closing Control
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">End of day gallery closing procedures & security audit</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-300">Closing Progress:</span>
                        <span className="text-lg font-bold text-indigo-400">{score}%</span>
                    </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${score}%` }}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {checklist.map(c => (
                        <div key={c.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${c.status === 'completed' ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-slate-900 border-slate-800'}`}>
                            <div className="flex items-center gap-3">
                                <button onClick={() => toggleItem(c.id)} className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all ${c.status === 'completed' ? 'bg-indigo-500 text-white' : 'border border-slate-600 text-transparent'}`}>
                                    ✓
                                </button>
                                <span className={`text-sm ${c.status === 'completed' ? 'text-slate-200 line-through' : 'text-slate-100 font-medium'}`}>{c.item}</span>
                            </div>
                            <button onClick={() => toggleItem(c.id)} className={`px-3 py-1 rounded text-xs font-semibold ${c.status === 'completed' ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                                {c.status === 'completed' ? 'Undo' : 'Mark Done'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // 5. Daily Checklist
    const renderChecklist = () => {
        const checklists = [
            { id: 1, name: 'Staff Attendance Verification', status: 'completed' },
            { id: 2, name: 'Gallery Cleanliness & Ambiance Check', status: 'completed' },
            { id: 3, name: 'Display Electronics & Lighting Power Check', status: 'completed' },
            { id: 4, name: 'POS Terminals & Card Swipers Online', status: 'completed' },
            { id: 5, name: 'Mid-Day Physical Stock Spot Check', status: 'pending' },
            { id: 6, name: 'Cash Register Reconciliation', status: 'pending' },
            { id: 7, name: 'Customer Feedback & SLA Review', status: 'completed' },
            { id: 8, name: 'Fire Safety & Emergency Exit Verification', status: 'pending' },
        ];
        const done = checklists.filter(c => c.status === 'completed').length;

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-clipboard-list text-purple-400"></i> Daily Checklist Overview
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Routine operational compliance checks</p>
                    </div>
                    <span className="text-xs font-semibold bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">
                        {done} / {checklists.length} Tasks Verified
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {checklists.map(c => (
                        <div key={c.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                            <span className="text-sm text-slate-200">{c.name}</span>
                            <span className={`px-2.5 py-1 text-xs rounded-full border font-semibold ${c.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                                {c.status === 'completed' ? 'Verified' : 'Pending'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // 6. Shift Handover
    const renderHandover = () => {
        const handovers = db.shiftHandovers || [];

        const acknowledgeHandover = (id) => {
            updateDb(prev => {
                const h = prev.shiftHandovers.find(x => x.id === id);
                if (h) h.acknowledged = true;
                return prev;
            });
            showToast('Shift handover acknowledged!', 'success');
        };

        const openNewHandover = () => {
            openModal(
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-handshake text-emerald-400"></i> New Shift Handover Note
                        </h3>
                        <button onClick={closeModal} className="text-slate-400 hover:text-white">&times;</button>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const from = e.target.from.value;
                        const to = e.target.to.value;
                        const issues = parseInt(e.target.issues.value) || 0;
                        const complaints = parseInt(e.target.complaints.value) || 0;
                        const notes = e.target.notes.value.trim();

                        updateDb(prev => {
                            prev.shiftHandovers.push({
                                id: genId(prev, 'shiftHandover'),
                                from,
                                to,
                                date: todayStr(),
                                openIssues: issues,
                                pendingComplaints: complaints,
                                stockIssue: 0,
                                maintenance: 0,
                                cashStatus: 'Verified',
                                notes,
                                acknowledged: false,
                            });
                            return prev;
                        });
                        showToast('Shift handover submitted successfully!', 'success');
                        closeModal();
                    }} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-400 mb-1">Handover From</label>
                                <input name="from" defaultValue={currentUser.name} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">Handover To</label>
                                <select name="to" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required>
                                    {db.employees.map(emp => (
                                        <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-400 mb-1">Open Issues Count</label>
                                <input name="issues" type="number" defaultValue="0" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">Pending Complaints</label>
                                <input name="complaints" type="number" defaultValue="0" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1">Handover Instructions & Operational Notes</label>
                            <textarea name="notes" rows="3" placeholder="Key updates for next shift manager..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required></textarea>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-500">Submit Handover</button>
                        </div>
                    </form>
                </div>
            );
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-handshake text-teal-400"></i> Shift Handover Management
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Inter-shift operational communication and task transfers</p>
                    </div>
                    <button onClick={openNewHandover} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20">
                        <i className="fa-solid fa-plus"></i> New Shift Handover
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">From</th>
                                <th className="p-3">To</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Open Issues</th>
                                <th className="p-3">Cash Status</th>
                                <th className="p-3">Notes</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {handovers.map(h => (
                                <tr key={h.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{h.from}</td>
                                    <td className="p-3">{h.to}</td>
                                    <td className="p-3">{formatDate(h.date)}</td>
                                    <td className="p-3 text-amber-400 font-semibold">{h.openIssues} Issues</td>
                                    <td className="p-3 text-emerald-400">{h.cashStatus}</td>
                                    <td className="p-3 text-slate-300 max-w-xs truncate">{h.notes}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${h.acknowledged ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                                            {h.acknowledged ? 'Acknowledged' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {!h.acknowledged && (
                                            <button onClick={() => acknowledgeHandover(h.id)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold">
                                                Acknowledge
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 7. Employees Directory
    const renderEmployees = () => {
        const filtered = db.employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.role.toLowerCase().includes(searchTerm.toLowerCase()));

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-users text-blue-400"></i> Gallery Staff Directory
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Overview of staff roles, attendance, and shift schedules</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Employee</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Shift</th>
                                <th className="p-3">Check-In</th>
                                <th className="p-3">Check-Out</th>
                                <th className="p-3">Attendance</th>
                                <th className="p-3">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filtered.map(e => (
                                <tr key={e.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs">
                                            {e.name[0]}
                                        </div>
                                        <div>
                                            <div>{e.name}</div>
                                            <div className="text-[10px] text-slate-500 font-normal">{e.email}</div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-slate-300">{e.role}</td>
                                    <td className="p-3 text-slate-300">{e.shift}</td>
                                    <td className="p-3 text-emerald-400">{e.checkIn}</td>
                                    <td className="p-3 text-slate-400">{e.checkOut}</td>
                                    <td className="p-3">
                                        <span className={`font-semibold ${e.attendance >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{e.attendance}%</span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`font-semibold ${e.performance >= 90 ? 'text-emerald-400' : 'text-blue-400'}`}>{e.performance}%</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 8. Attendance Control
    const renderAttendance = () => {
        const employees = db.employees || [];
        const present = employees.filter(e => e.attendance >= 85).length;
        const late = employees.filter(e => e.lateMinutes > 0).length;

        const recordLate = (id) => {
            updateDb(prev => {
                const emp = prev.employees.find(x => x.id === id);
                if (emp) {
                    emp.lateMinutes = (emp.lateMinutes || 0) + 15;
                    emp.attendance = Math.max(50, emp.attendance - 2);
                }
                return prev;
            });
            showToast('Late arrival recorded', 'warning');
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-calendar-check text-emerald-400"></i> Attendance Control Center
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Live check-in monitoring and late arrival tracking</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400">Present Today</div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">{present}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400">Late Arrivals</div>
                        <div className="text-2xl font-bold text-amber-400 mt-1">{late}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400">Total Staff</div>
                        <div className="text-2xl font-bold text-white mt-1">{employees.length}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400">Average Attendance</div>
                        <div className="text-2xl font-bold text-blue-400 mt-1">
                            {employees.length ? Math.round(employees.reduce((acc, curr) => acc + curr.attendance, 0) / employees.length) : 0}%
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Staff Name</th>
                                <th className="p-3">Shift</th>
                                <th className="p-3">Check-In</th>
                                <th className="p-3">Late Mins</th>
                                <th className="p-3">Score</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {employees.map(e => (
                                <tr key={e.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{e.name}</td>
                                    <td className="p-3">{e.shift}</td>
                                    <td className="p-3 text-emerald-400">{e.checkIn}</td>
                                    <td className="p-3 text-amber-400 font-semibold">{e.lateMinutes} mins</td>
                                    <td className="p-3">{e.attendance}%</td>
                                    <td className="p-3">
                                        <button onClick={() => recordLate(e.id)} className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 rounded text-[11px] font-semibold">
                                            +15m Late
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 9. Shift Management
    const renderShifts = () => {
        const morning = db.employees.filter(e => e.shift === 'Morning');
        const evening = db.employees.filter(e => e.shift === 'Evening');

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-user-clock text-indigo-400"></i> Shift Roster & Management
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Manage shift rosters and morning/evening floor coverage</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white text-sm">Morning Shift (09:00 - 18:00)</h3>
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                                {morning.length} Staff Assigned
                            </span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                            {morning.map(m => (
                                <div key={m.id} className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                                    <span className="text-slate-200 font-medium">{m.name}</span>
                                    <span className="text-slate-400">{m.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white text-sm">Evening Shift (12:00 - 21:00)</h3>
                            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-bold">
                                {evening.length} Staff Assigned
                            </span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                            {evening.map(m => (
                                <div key={m.id} className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                                    <span className="text-slate-200 font-medium">{m.name}</span>
                                    <span className="text-slate-400">{m.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 10. Performance
    const renderPerformance = () => {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-chart-simple text-purple-400"></i> Employee Performance Matrix
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Task completion rates and performance ratings</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Staff Name</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Attendance %</th>
                                <th className="p-3">Overall Performance Rating</th>
                                <th className="p-3">Quality Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {db.employees.map(e => (
                                <tr key={e.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{e.name}</td>
                                    <td className="p-3 text-slate-400">{e.role}</td>
                                    <td className="p-3">{e.attendance}%</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div className="bg-purple-500 h-full" style={{ width: `${e.performance}%` }}></div>
                                            </div>
                                            <span className="font-bold text-purple-400">{e.performance}%</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-emerald-400 font-semibold">{e.performance >= 90 ? 'Exceeds Expectations' : 'Meets Standard'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 11. Tasks Center
    const renderTasks = () => {
        const tasks = db.tasks || [];

        const completeTask = (id) => {
            updateDb(prev => {
                const t = prev.tasks.find(x => x.id === id);
                if (t) { t.status = 'completed'; t.progress = 100; }
                return prev;
            });
            showToast('Task marked as completed!', 'success');
        };

        const blockTask = (id) => {
            updateDb(prev => {
                const t = prev.tasks.find(x => x.id === id);
                if (t) { t.status = 'blocked'; t.blocked = true; }
                return prev;
            });
            showToast('Task status updated to blocked', 'warning');
        };

        const openAddTask = () => {
            openModal(
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-plus text-emerald-400"></i> Create New Operational Task
                        </h3>
                        <button onClick={closeModal} className="text-slate-400 hover:text-white">&times;</button>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const title = e.target.title.value.trim();
                        const category = e.target.category.value;
                        const priority = e.target.priority.value;
                        const assignedTo = e.target.assignedTo.value;
                        const dueDate = e.target.dueDate.value;

                        updateDb(prev => {
                            prev.tasks.push({
                                id: genId(prev, 'task'),
                                title,
                                category,
                                priority,
                                assignedTo,
                                status: 'pending',
                                created: todayStr(),
                                dueDate,
                                estimatedTime: 2,
                                actualTime: 0,
                                progress: 0,
                                blocked: false,
                            });
                            return prev;
                        });
                        showToast('Task created successfully!', 'success');
                        closeModal();
                    }} className="space-y-4 text-xs">
                        <div>
                            <label className="block text-slate-400 mb-1">Task Title</label>
                            <input name="title" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" placeholder="e.g. Audit POS Receipt Printers" required />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-400 mb-1">Category</label>
                                <select name="category" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white">
                                    <option value="Inventory">Inventory</option>
                                    <option value="Customer Service">Customer Service</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">Priority</label>
                                <select name="priority" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white">
                                    <option value="critical">Critical</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-400 mb-1">Assign To</label>
                                <select name="assignedTo" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white">
                                    {db.employees.map(emp => (
                                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">Due Date</label>
                                <input name="dueDate" type="date" defaultValue={todayStr()} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-500">Create Task</button>
                        </div>
                    </form>
                </div>
            );
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-tasks text-emerald-400"></i> Gallery Task Center
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Assign, track, and complete operational tasks</p>
                    </div>
                    <button onClick={openAddTask} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20">
                        <i className="fa-solid fa-plus"></i> Add New Task
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Task Title</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Assignee</th>
                                <th className="p-3">Priority</th>
                                <th className="p-3">Due Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {tasks.map(t => (
                                <tr key={t.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{t.title}</td>
                                    <td className="p-3 text-slate-400">{t.category}</td>
                                    <td className="p-3 text-slate-300">{t.assignedTo}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(t.priority)}`}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td className="p-3 text-slate-400">{formatDate(t.dueDate)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(t.status)}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-3 flex items-center gap-2">
                                        {t.status !== 'completed' && (
                                            <button onClick={() => completeTask(t.id)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold">
                                                Complete
                                            </button>
                                        )}
                                        {t.status !== 'blocked' && t.status !== 'completed' && (
                                            <button onClick={() => blockTask(t.id)} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-red-400 rounded text-[11px]">
                                                Block
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 12. My Tasks
    const renderMyTasks = () => {
        const myTasks = db.tasks.filter(t => t.assignedTo === currentUser.name || t.assignedTo === 'Sunita Rao' || t.assignedTo === 'Assistant Manager');

        const completeTask = (id) => {
            updateDb(prev => {
                const t = prev.tasks.find(x => x.id === id);
                if (t) { t.status = 'completed'; t.progress = 100; }
                return prev;
            });
            showToast('My task completed!', 'success');
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-list-check text-blue-400"></i> My Assigned Tasks
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Tasks specifically assigned to Assistant Manager</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Task Title</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Priority</th>
                                <th className="p-3">Due Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {myTasks.map(t => (
                                <tr key={t.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{t.title}</td>
                                    <td className="p-3 text-slate-400">{t.category}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(t.priority)}`}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td className="p-3">{formatDate(t.dueDate)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(t.status)}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {t.status !== 'completed' && (
                                            <button onClick={() => completeTask(t.id)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold">
                                                Mark Completed
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {myTasks.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-slate-500">No active tasks assigned to Assistant Manager.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 13. Overdue Tasks
    const renderOverdue = () => {
        const overdue = db.tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed');

        const escalateTask = (id) => {
            const t = db.tasks.find(x => x.id === id);
            updateDb(prev => {
                prev.complaints.push({
                    id: genId(prev, 'complaint'),
                    customer: 'Internal Systems',
                    category: 'Overdue Task Escalation',
                    severity: 'high',
                    description: `Escalated overdue task "${t?.title}" assigned to ${t?.assignedTo}.`,
                    status: 'open',
                    created: todayStr(),
                    sla: '12h',
                    assignedTo: 'Anita Desai',
                    resolution: '',
                });
                return prev;
            });
            showToast(`Task "${t?.title}" escalated to Gallery Manager!`, 'warning');
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-hourglass-exclamation text-red-400"></i> Overdue Tasks Center
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Tasks past due date requiring escalation</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Task Title</th>
                                <th className="p-3">Assignee</th>
                                <th className="p-3">Due Date</th>
                                <th className="p-3">Priority</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {overdue.map(t => (
                                <tr key={t.id} className="bg-red-950/10 hover:bg-red-950/20">
                                    <td className="p-3 font-semibold text-white">{t.title}</td>
                                    <td className="p-3 text-slate-300">{t.assignedTo}</td>
                                    <td className="p-3 text-red-400 font-bold">{formatDate(t.dueDate)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(t.priority)}`}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td className="p-3 text-amber-400">{t.status}</td>
                                    <td className="p-3">
                                        <button onClick={() => escalateTask(t.id)} className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-semibold flex items-center gap-1">
                                            <i className="fa-solid fa-arrow-up"></i> Escalate to GM
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {overdue.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-emerald-400 font-medium">All tasks are up to date! Zero overdue items.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 14. Sales Monitor
    const renderSales = () => {
        const g = db.gallery || {};
        const ach = g.todayTarget > 0 ? Math.round((g.todaySales / g.todayTarget) * 100) : 0;

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-chart-line text-emerald-400"></i> Sales Monitor & Target Tracking
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Realtime daily target vs actual revenue stream</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-xs text-slate-400">Today's Target</div>
                        <div className="text-2xl font-bold text-white mt-1">{formatCurrency(g.todayTarget)}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-xs text-slate-400">Achieved Revenue</div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(g.todaySales)}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-xs text-slate-400">Target Achievement</div>
                        <div className="text-2xl font-bold text-blue-400 mt-1">{ach}%</div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-sm font-semibold text-white mb-4">Hourly Revenue Performance</h3>
                    <div className="h-64">
                        <Bar
                            data={{
                                labels: db.hourlySales.map(h => h.hour),
                                datasets: [{
                                    label: 'Sales (₹)',
                                    data: db.hourlySales.map(h => h.amount),
                                    backgroundColor: '#10b981',
                                    borderRadius: 6,
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
                                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    // 15. Sales Floor
    const renderFloor = () => {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-store text-blue-400"></i> Sales Floor Footfall Monitor
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Live customer footfall & associate sales productivity</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">Active Sales Associates on Floor</h3>
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-500/30">
                            {db.employees.filter(e => e.role === 'Sales Associate').length} Associates Active
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        {db.employees.filter(e => e.role === 'Sales Associate').map(sa => (
                            <div key={sa.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-white">{sa.name}</div>
                                    <div className="text-[10px] text-slate-400">Shift: {sa.shift}</div>
                                </div>
                                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 font-semibold rounded text-[10px]">
                                    {sa.performance}% Rating
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // 16. Inventory / Stock Control
    const renderInventory = () => {
        const items = db.inventoryItems || [];

        const requestStock = (product) => {
            updateDb(prev => {
                prev.approvals.push({
                    id: genId(prev, 'approval'),
                    type: 'Stock Request',
                    requestedBy: currentUser.name,
                    amount: 35000,
                    reason: `Replenishment order for low stock item: ${product}`,
                    status: 'pending',
                    createdAt: todayStr(),
                    priority: 'high',
                });
                return prev;
            });
            showToast(`Replenishment request for ${product} sent to approvals queue!`, 'success');
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-cubes text-purple-400"></i> Stock & Inventory Control
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Realtime inventory levels, minimum thresholds & restock orders</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Product Name</th>
                                <th className="p-3">Current Stock</th>
                                <th className="p-3">Min Threshold</th>
                                <th className="p-3">Sold This Month</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {items.map(i => (
                                <tr key={i.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{i.product}</td>
                                    <td className="p-3 font-bold text-slate-200">{i.stock} units</td>
                                    <td className="p-3 text-slate-400">{i.minStock} units</td>
                                    <td className="p-3 text-emerald-400">{i.soldThisMonth} sold</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(i.status)}`}>
                                            {i.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {i.status === 'low' && (
                                            <button onClick={() => requestStock(i.product)} className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-semibold">
                                                Request Restock
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 17. Stock Count
    const renderStockCount = () => {
        const counts = db.stockCounts || [];

        const openNewCount = () => {
            openModal(
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-calculator text-emerald-400"></i> New Physical Stock Audit Count
                        </h3>
                        <button onClick={closeModal} className="text-slate-400 hover:text-white">&times;</button>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const product = e.target.product.value;
                        const systemQty = parseInt(e.target.systemQty.value) || 0;
                        const physicalQty = parseInt(e.target.physicalQty.value) || 0;
                        const diff = physicalQty - systemQty;

                        updateDb(prev => {
                            prev.stockCounts.push({
                                id: genId(prev, 'stockCount'),
                                product,
                                systemQty,
                                physicalQty,
                                difference: diff,
                                valueVariance: diff * 2000,
                                counter: currentUser.name,
                                verifier: 'Sunita Rao',
                                date: todayStr(),
                                remarks: e.target.remarks.value || 'Routine physical audit',
                            });
                            // Auto-update inventory stock level if physical count differs
                            const item = prev.inventoryItems.find(i => i.product === product);
                            if (item) {
                                item.stock = physicalQty;
                                item.status = physicalQty < item.minStock ? 'low' : 'good';
                            }
                            return prev;
                        });
                        showToast('Physical stock audit recorded and inventory updated!', 'success');
                        closeModal();
                    }} className="space-y-4 text-xs">
                        <div>
                            <label className="block text-slate-400 mb-1">Select Product</label>
                            <select name="product" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white">
                                {db.inventoryItems.map(item => (
                                    <option key={item.id} value={item.product}>{item.product} (Current System: {item.stock})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-400 mb-1">System Quantity</label>
                                <input name="systemQty" type="number" defaultValue="20" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">Physical Audited Count</label>
                                <input name="physicalQty" type="number" defaultValue="20" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1">Audit Remarks</label>
                            <input name="remarks" placeholder="Notes regarding packaging or variance..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-500">Save Stock Audit</button>
                        </div>
                    </form>
                </div>
            );
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-calculator text-emerald-400"></i> Stock Audit & Reconciliation
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Physical vs System inventory count verification</p>
                    </div>
                    <button onClick={openNewCount} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20">
                        <i className="fa-solid fa-plus"></i> Audit Stock Item
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Product Name</th>
                                <th className="p-3">System Qty</th>
                                <th className="p-3">Physical Qty</th>
                                <th className="p-3">Variance</th>
                                <th className="p-3">Auditor</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {counts.map(c => (
                                <tr key={c.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{c.product}</td>
                                    <td className="p-3">{c.systemQty}</td>
                                    <td className="p-3 font-bold text-slate-200">{c.physicalQty}</td>
                                    <td className={`p-3 font-bold ${c.difference === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {c.difference > 0 ? `+${c.difference}` : c.difference}
                                    </td>
                                    <td className="p-3 text-slate-400">{c.counter}</td>
                                    <td className="p-3 text-slate-400">{formatDate(c.date)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${c.difference === 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                            {c.difference === 0 ? 'Matched' : 'Variance'}
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

    // 18. Damaged Stock
    const renderDamaged = () => {
        const damaged = db.damagedStock || [];

        const openReportDamage = () => {
            openModal(
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-triangle-exclamation text-amber-400"></i> Report Damaged Inventory
                        </h3>
                        <button onClick={closeModal} className="text-slate-400 hover:text-white">&times;</button>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const product = e.target.product.value;
                        const qty = parseInt(e.target.qty.value) || 1;
                        const value = parseFloat(e.target.value.value) || 0;
                        const reason = e.target.reason.value;

                        updateDb(prev => {
                            prev.damagedStock.push({
                                id: genId(prev, 'damagedStock'),
                                product,
                                quantity: qty,
                                value,
                                reason,
                                employee: currentUser.name,
                                date: todayStr(),
                                status: 'pending',
                                photo: '',
                            });
                            // Reduce stock in inventory
                            const item = prev.inventoryItems.find(i => i.product === product);
                            if (item) {
                                item.stock = Math.max(0, item.stock - qty);
                            }
                            return prev;
                        });
                        showToast('Damaged stock report logged successfully!', 'success');
                        closeModal();
                    }} className="space-y-4 text-xs">
                        <div>
                            <label className="block text-slate-400 mb-1">Product</label>
                            <select name="product" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white">
                                {db.inventoryItems.map(item => (
                                    <option key={item.id} value={item.product}>{item.product}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-400 mb-1">Damaged Quantity</label>
                                <input name="qty" type="number" defaultValue="1" min="1" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">Estimated Value (₹)</label>
                                <input name="value" type="number" defaultValue="2000" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1">Reason for Damage</label>
                            <input name="reason" placeholder="e.g. Transit impact, liquid spill" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-amber-600 text-white font-semibold rounded hover:bg-amber-500">Report Damage</button>
                        </div>
                    </form>
                </div>
            );
        };

        const approveDamage = (id) => {
            updateDb(prev => {
                const d = prev.damagedStock.find(x => x.id === id);
                if (d) d.status = 'approved';
                return prev;
            });
            showToast('Damaged stock write-off approved!', 'success');
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-triangle-exclamation text-amber-400"></i> Damaged Stock Registry
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Track damaged inventory & write-off approvals</p>
                    </div>
                    <button onClick={openReportDamage} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-md shadow-amber-600/20">
                        <i className="fa-solid fa-plus"></i> Report Damaged Item
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Product Name</th>
                                <th className="p-3">Qty</th>
                                <th className="p-3">Value</th>
                                <th className="p-3">Reason</th>
                                <th className="p-3">Reported By</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {damaged.map(d => (
                                <tr key={d.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{d.product}</td>
                                    <td className="p-3 font-bold text-amber-400">{d.quantity} units</td>
                                    <td className="p-3 text-slate-200">{formatCurrency(d.value)}</td>
                                    <td className="p-3 text-slate-400">{d.reason}</td>
                                    <td className="p-3 text-slate-300">{d.employee}</td>
                                    <td className="p-3 text-slate-400">{formatDate(d.date)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(d.status)}`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {d.status === 'pending' && (
                                            <button onClick={() => approveDamage(d.id)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold">
                                                Approve Write-off
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 19. Customer Service
    const renderCustomers = () => {
        const g = db.gallery || {};
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-user-group text-blue-400"></i> Customer Service Hub
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Customer footfall, satisfaction metrics & service quality</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-xs text-slate-400">Today's Footfall</div>
                        <div className="text-2xl font-bold text-white mt-1">{g.todayCustomers} Customers</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-xs text-slate-400">Total Registered Members</div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">{g.members} Members</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-xs text-slate-400">Customer CSAT Score</div>
                        <div className="text-2xl font-bold text-blue-400 mt-1">94% Positive</div>
                    </div>
                </div>
            </div>
        );
    };

    // 20. Membership Operations
    const renderMembership = () => {
        const m = db.memberships[0] || {};
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-id-card text-emerald-400"></i> Membership Operations
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">New member registrations & renewal performance</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400">New Members (Month)</div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">+{m.newMembers || 0}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400">Renewals</div>
                        <div className="text-2xl font-bold text-blue-400 mt-1">{m.renewals || 0}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400">Expiring Soon</div>
                        <div className="text-2xl font-bold text-amber-400 mt-1">{m.expiring || 0}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-400">Membership Revenue</div>
                        <div className="text-2xl font-bold text-purple-400 mt-1">{formatCurrency(m.revenue)}</div>
                    </div>
                </div>
            </div>
        );
    };

    // 21. Complaints
    const renderComplaints = () => {
        const complaints = db.complaints || [];

        const resolveComplaint = (id) => {
            updateDb(prev => {
                const c = prev.complaints.find(x => x.id === id);
                if (c) { c.status = 'resolved'; c.resolution = 'Resolved by Assistant Manager'; }
                return prev;
            });
            showToast('Complaint resolved successfully!', 'success');
        };

        const escalateComplaint = (id) => {
            updateDb(prev => {
                const c = prev.complaints.find(x => x.id === id);
                if (c) { c.status = 'in-progress'; c.assignedTo = 'Anita Desai (GM)'; }
                return prev;
            });
            showToast('Complaint escalated to Gallery Manager!', 'warning');
        };

        const openAddComplaint = () => {
            openModal(
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-headset text-purple-400"></i> Log Customer Complaint
                        </h3>
                        <button onClick={closeModal} className="text-slate-400 hover:text-white">&times;</button>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const customer = e.target.customer.value.trim();
                        const category = e.target.category.value;
                        const severity = e.target.severity.value;
                        const description = e.target.description.value.trim();

                        updateDb(prev => {
                            prev.complaints.push({
                                id: genId(prev, 'complaint'),
                                customer,
                                category,
                                severity,
                                description,
                                status: 'open',
                                created: todayStr(),
                                sla: severity === 'critical' ? '4h' : '24h',
                                assignedTo: currentUser.name,
                                resolution: '',
                            });
                            return prev;
                        });
                        showToast('Customer complaint recorded!', 'success');
                        closeModal();
                    }} className="space-y-4 text-xs">
                        <div>
                            <label className="block text-slate-400 mb-1">Customer Name / ID</label>
                            <input name="customer" placeholder="e.g. Mr. Rajesh Khanna" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-400 mb-1">Category</label>
                                <select name="category" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white">
                                    <option value="Service">Service</option>
                                    <option value="Product">Product</option>
                                    <option value="Billing">Billing</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">Severity SLA</label>
                                <select name="severity" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white">
                                    <option value="critical">Critical (4h SLA)</option>
                                    <option value="high">High (24h SLA)</option>
                                    <option value="medium">Medium (48h SLA)</option>
                                    <option value="low">Low (72h SLA)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1">Complaint Description</label>
                            <textarea name="description" rows="3" placeholder="Provide details of customer issue..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required></textarea>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-500">Log Complaint</button>
                        </div>
                    </form>
                </div>
            );
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-headset text-purple-400"></i> Complaint Management Center
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">SLA tracking & customer issue resolution</p>
                    </div>
                    <button onClick={openAddComplaint} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-md shadow-purple-600/20">
                        <i className="fa-solid fa-plus"></i> Add Complaint
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Severity</th>
                                <th className="p-3">SLA</th>
                                <th className="p-3">Assignee</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {complaints.map(c => (
                                <tr key={c.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{c.customer}</td>
                                    <td className="p-3 text-slate-400">{c.category}</td>
                                    <td className="p-3 text-slate-300 max-w-xs truncate">{c.description}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(c.severity)}`}>
                                            {c.severity}
                                        </span>
                                    </td>
                                    <td className="p-3 text-amber-400 font-semibold">{c.sla}</td>
                                    <td className="p-3 text-slate-300">{c.assignedTo}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(c.status)}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="p-3 flex items-center gap-2">
                                        {c.status !== 'resolved' && (
                                            <button onClick={() => resolveComplaint(c.id)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold">
                                                Resolve
                                            </button>
                                        )}
                                        {c.severity === 'critical' && c.status !== 'resolved' && (
                                            <button onClick={() => escalateComplaint(c.id)} className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px]">
                                                Escalate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 22. Cash Control
    const renderCash = () => {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-money-bill-wave text-emerald-400"></i> Cash & Float Control
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Physical float verification & payment mode reconciliation</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                        <div className="text-xs text-slate-400 uppercase font-semibold">Morning Vault Opening Float</div>
                        <div className="text-2xl font-bold text-white">₹25,000</div>
                        <div className="text-xs text-emerald-400 font-semibold">✅ Float Verified Match</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                        <div className="text-xs text-slate-400 uppercase font-semibold">Evening Closing Cash Float</div>
                        <div className="text-2xl font-bold text-white">₹48,200</div>
                        <div className="text-xs text-amber-400 font-semibold">⚠️ Variance: -₹300 (Under Investigation)</div>
                    </div>
                </div>
            </div>
        );
    };

    // 23. Expenses
    const renderExpenses = () => {
        const expenses = db.expenses || [];

        const approveExpense = (id) => {
            updateDb(prev => {
                const e = prev.expenses.find(x => x.id === id);
                if (e) e.status = 'approved';
                return prev;
            });
            showToast('Expense request approved!', 'success');
        };

        const openAddExpense = () => {
            openModal(
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-coins text-emerald-400"></i> Submit New Gallery Expense
                        </h3>
                        <button onClick={closeModal} className="text-slate-400 hover:text-white">&times;</button>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const category = e.target.category.value;
                        const amount = parseFloat(e.target.amount.value) || 0;
                        const description = e.target.description.value.trim();

                        updateDb(prev => {
                            prev.expenses.push({
                                id: genId(prev, 'expense'),
                                category,
                                amount,
                                date: todayStr(),
                                status: 'pending',
                                description,
                            });
                            return prev;
                        });
                        showToast('Expense submitted for approval!', 'success');
                        closeModal();
                    }} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-400 mb-1">Category</label>
                                <select name="category" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white">
                                    <option value="Utilities">Utilities</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Supplies">Supplies</option>
                                    <option value="Cleaning">Cleaning</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">Amount (₹)</label>
                                <input name="amount" type="number" placeholder="5000" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1">Expense Description</label>
                            <input name="description" placeholder="Details of expense..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-500">Submit Expense</button>
                        </div>
                    </form>
                </div>
            );
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-coins text-amber-400"></i> Gallery Expense Management
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Operating expense claims & approval vouchers</p>
                    </div>
                    <button onClick={openAddExpense} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20">
                        <i className="fa-solid fa-plus"></i> Add Expense
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Category</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {expenses.map(e => (
                                <tr key={e.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{e.category}</td>
                                    <td className="p-3 font-bold text-emerald-400">{formatCurrency(e.amount)}</td>
                                    <td className="p-3 text-slate-300">{e.description}</td>
                                    <td className="p-3 text-slate-400">{formatDate(e.date)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(e.status)}`}>
                                            {e.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {e.status === 'pending' && (
                                            <button onClick={() => approveExpense(e.id)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold">
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 24. Petty Cash
    const renderPettyCash = () => {
        const pc = db.pettyCash[0] || {};

        const openRequest = () => {
            openModal(
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-wallet text-emerald-400"></i> Request Petty Cash Voucher
                        </h3>
                        <button onClick={closeModal} className="text-slate-400 hover:text-white">&times;</button>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const amount = parseFloat(e.target.amount.value) || 0;
                        const reason = e.target.reason.value.trim();

                        updateDb(prev => {
                            prev.approvals.push({
                                id: genId(prev, 'approval'),
                                type: 'Petty Cash',
                                requestedBy: currentUser.name,
                                amount,
                                reason,
                                status: 'pending',
                                createdAt: todayStr(),
                                priority: amount > 5000 ? 'high' : 'medium',
                            });
                            return prev;
                        });
                        showToast('Petty cash request submitted for approval!', 'success');
                        closeModal();
                    }} className="space-y-4 text-xs">
                        <div>
                            <label className="block text-slate-400 mb-1">Voucher Amount (₹)</label>
                            <input name="amount" type="number" placeholder="2500" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1">Purpose / Reason</label>
                            <input name="reason" placeholder="e.g. Emergency electrical wire replacement" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-500">Submit Request</button>
                        </div>
                    </form>
                </div>
            );
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-wallet text-emerald-400"></i> Petty Cash Control
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Petty cash balances, vouchers & approval thresholds</p>
                    </div>
                    <button onClick={openRequest} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20">
                        <i className="fa-solid fa-plus"></i> Request Petty Cash
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400">Opening Balance</div>
                        <div className="text-2xl font-bold text-white mt-1">{formatCurrency(pc.opening)}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400">Received Float</div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(pc.received)}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400">Total Spent</div>
                        <div className="text-2xl font-bold text-amber-400 mt-1">{formatCurrency(pc.spent)}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400">Current Balance</div>
                        <div className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(pc.closing)}</div>
                    </div>
                </div>
            </div>
        );
    };

    // 25. Maintenance
    const renderMaintenance = () => {
        const items = db.maintenance || [];

        const startMaintenance = (id) => {
            updateDb(prev => {
                const m = prev.maintenance.find(x => x.id === id);
                if (m) m.status = 'in-progress';
                return prev;
            });
            showToast('Maintenance marked in-progress', 'info');
        };

        const completeMaintenance = (id) => {
            updateDb(prev => {
                const m = prev.maintenance.find(x => x.id === id);
                if (m) m.status = 'completed';
                return prev;
            });
            showToast('Maintenance marked completed!', 'success');
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-wrench text-amber-400"></i> Asset Maintenance Control
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Equipment repair, vendor SLA tracking & maintenance requests</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Asset</th>
                                <th className="p-3">Problem Description</th>
                                <th className="p-3">Priority</th>
                                <th className="p-3">Vendor</th>
                                <th className="p-3">Cost</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {items.map(m => (
                                <tr key={m.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{m.asset}</td>
                                    <td className="p-3 text-slate-300 max-w-xs truncate">{m.problem}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(m.priority)}`}>
                                            {m.priority}
                                        </span>
                                    </td>
                                    <td className="p-3 text-slate-400">{m.vendor}</td>
                                    <td className="p-3 text-emerald-400 font-semibold">{formatCurrency(m.cost)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(m.status)}`}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td className="p-3 flex items-center gap-2">
                                        {m.status === 'scheduled' && (
                                            <button onClick={() => startMaintenance(m.id)} className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-semibold">
                                                Start
                                            </button>
                                        )}
                                        {m.status === 'in-progress' && (
                                            <button onClick={() => completeMaintenance(m.id)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold">
                                                Complete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 26. Compliance
    const renderCompliance = () => {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-shield-halved text-emerald-400"></i> Operational Compliance Scorecard
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Audit readiness & SOP compliance scores</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-xs text-slate-400">Staff Attendance Compliance</div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">96%</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-xs text-slate-400">Cash Float Audit Compliance</div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">98%</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-xs text-slate-400">Inventory Reconciliation</div>
                        <div className="text-2xl font-bold text-blue-400 mt-1">94%</div>
                    </div>
                </div>
            </div>
        );
    };

    // 27. Incidents
    const renderIncidents = () => {
        const incidents = db.incidents || [];

        const resolveIncident = (id) => {
            updateDb(prev => {
                const inc = prev.incidents.find(x => x.id === id);
                if (inc) inc.closure = todayStr();
                return prev;
            });
            showToast('Incident closed and resolved!', 'success');
        };

        const openReportIncident = () => {
            openModal(
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-bell text-red-400"></i> Report Floor Incident
                        </h3>
                        <button onClick={closeModal} className="text-slate-400 hover:text-white">&times;</button>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const type = e.target.type.value;
                        const severity = e.target.severity.value;
                        const location = e.target.location.value;
                        const description = e.target.description.value.trim();

                        updateDb(prev => {
                            prev.incidents.push({
                                id: genId(prev, 'incident'),
                                type,
                                severity,
                                location,
                                description,
                                peopleInvolved: '',
                                immediateAction: 'Assistant Manager Intervened',
                                evidence: '',
                                escalatedTo: 'Anita Desai',
                                resolution: '',
                                rootCause: '',
                                closure: null,
                            });
                            // Auto create complaint escalation if high or critical
                            if (severity === 'critical' || severity === 'high') {
                                prev.complaints.push({
                                    id: genId(prev, 'complaint'),
                                    customer: 'Floor Incident',
                                    category: 'Security / Dispute',
                                    severity,
                                    description: `Incident Escalation: ${type} - ${description}`,
                                    status: 'open',
                                    created: todayStr(),
                                    sla: '2h',
                                    assignedTo: 'Anita Desai',
                                    resolution: '',
                                });
                            }
                            return prev;
                        });
                        showToast('Incident report logged and escalated!', 'warning');
                        closeModal();
                    }} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-400 mb-1">Incident Type</label>
                                <input name="type" placeholder="e.g. Customer Dispute" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">Severity</label>
                                <select name="severity" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white">
                                    <option value="critical">Critical</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1">Location</label>
                            <input name="location" placeholder="e.g. Billing Counter 1" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1">Incident Description</label>
                            <textarea name="description" rows="3" placeholder="Details of event and action taken..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required></textarea>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500">Report Incident</button>
                        </div>
                    </form>
                </div>
            );
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-bell text-red-400"></i> Incident Reporting Log
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Floor dispute, safety & equipment incident records</p>
                    </div>
                    <button onClick={openReportIncident} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-md shadow-red-600/20">
                        <i className="fa-solid fa-plus"></i> Report Incident
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Type</th>
                                <th className="p-3">Severity</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Escalated To</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {incidents.map(i => (
                                <tr key={i.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{i.type}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(i.severity)}`}>
                                            {i.severity}
                                        </span>
                                    </td>
                                    <td className="p-3 text-slate-300">{i.location}</td>
                                    <td className="p-3 text-slate-300 max-w-xs truncate">{i.description}</td>
                                    <td className="p-3 text-slate-400">{i.escalatedTo}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${i.closure ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                            {i.closure ? 'Resolved' : 'Open'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {!i.closure && (
                                            <button onClick={() => resolveIncident(i.id)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold">
                                                Resolve & Close
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 28. Approvals
    const renderApprovals = () => {
        const approvals = db.approvals || [];

        const approve = (id) => {
            updateDb(prev => {
                const a = prev.approvals.find(x => x.id === id);
                if (a) a.status = 'approved';
                return prev;
            });
            showToast('Approval request granted!', 'success');
        };

        const reject = (id) => {
            updateDb(prev => {
                const a = prev.approvals.find(x => x.id === id);
                if (a) a.status = 'rejected';
                return prev;
            });
            showToast('Approval request rejected', 'warning');
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-check-double text-emerald-400"></i> Approvals Queue
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Review pending petty cash, expense & stock replenishment requests</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Type</th>
                                <th className="p-3">Requested By</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Reason</th>
                                <th className="p-3">Priority</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {approvals.map(a => (
                                <tr key={a.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">{a.type}</td>
                                    <td className="p-3 text-slate-300">{a.requestedBy}</td>
                                    <td className="p-3 font-bold text-emerald-400">{a.amount > 0 ? formatCurrency(a.amount) : '—'}</td>
                                    <td className="p-3 text-slate-300 max-w-xs truncate">{a.reason}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(a.priority)}`}>
                                            {a.priority}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(a.status)}`}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className="p-3 flex items-center gap-2">
                                        {a.status === 'pending' && (
                                            <>
                                                <button onClick={() => approve(a.id)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold">
                                                    Approve
                                                </button>
                                                <button onClick={() => reject(a.id)} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-red-400 rounded text-[11px]">
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 29. Exception Center
    const renderExceptions = () => {
        const critical = db.complaints?.filter(c => (c.severity === 'critical' || c.severity === 'high') && c.status !== 'resolved') || [];
        const lowStock = db.inventoryItems?.filter(i => i.status === 'low') || [];
        const overdueTasks = db.tasks?.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed') || [];

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-circle-exclamation text-amber-400"></i> Gallery Exception Center
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Consolidated view of all critical operational exceptions</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {critical.map(c => (
                        <div key={c.id} className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl flex items-center justify-between">
                            <div>
                                <div className="text-red-400 font-bold text-sm">Critical Complaint: {c.customer}</div>
                                <div className="text-xs text-slate-300 mt-1">{c.description}</div>
                            </div>
                            <button onClick={() => setCurrentPage('complaints')} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded">
                                Resolve Complaint
                            </button>
                        </div>
                    ))}

                    {lowStock.map(i => (
                        <div key={i.id} className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between">
                            <div>
                                <div className="text-amber-400 font-bold text-sm">Low Stock Alert: {i.product}</div>
                                <div className="text-xs text-slate-300 mt-1">Current Stock: {i.stock} units (Minimum: {i.minStock} units)</div>
                            </div>
                            <button onClick={() => setCurrentPage('inventory')} className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded">
                                Restock Item
                            </button>
                        </div>
                    ))}

                    {overdueTasks.map(t => (
                        <div key={t.id} className="bg-purple-950/20 border border-purple-500/30 p-4 rounded-xl flex items-center justify-between">
                            <div>
                                <div className="text-purple-400 font-bold text-sm">Overdue Task: {t.title}</div>
                                <div className="text-xs text-slate-300 mt-1">Assigned to: {t.assignedTo} · Due: {formatDate(t.dueDate)}</div>
                            </div>
                            <button onClick={() => setCurrentPage('overdue')} className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded">
                                View Task
                            </button>
                        </div>
                    ))}

                    {critical.length === 0 && lowStock.length === 0 && overdueTasks.length === 0 && (
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-emerald-400 font-medium text-sm">
                            ✅ No active operational exceptions! All systems operating within normal parameters.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 30. Escalations Center
    const renderEscalations = () => {
        const escalations = db.complaints?.filter(c => c.severity === 'critical') || [];

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-arrow-up-right-dots text-red-400"></i> Escalation Control Panel
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Critical issues escalated to Gallery Manager Anita Desai</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                                <th className="p-3">Issue ID</th>
                                <th className="p-3">Title / Description</th>
                                <th className="p-3">Severity</th>
                                <th className="p-3">Escalated To</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {escalations.map(e => (
                                <tr key={e.id} className="hover:bg-slate-800/40">
                                    <td className="p-3 font-semibold text-white">#CMP-{e.id}</td>
                                    <td className="p-3 text-slate-200">{e.description}</td>
                                    <td className="p-3 text-red-400 font-bold uppercase">{e.severity}</td>
                                    <td className="p-3 text-emerald-400 font-semibold">{e.assignedTo}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(e.status)}`}>
                                            {e.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {escalations.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-slate-500">No active escalations.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 31. Realtime Reports Center
    const renderReports = () => {
        const g = db.gallery || {};
        const employees = db.employees || [];
        const tasks = db.tasks || [];
        const complaints = db.complaints || [];
        const inventory = db.inventoryItems || [];
        const expenses = db.expenses || [];
        const pettyCash = db.pettyCash[0] || {};
        const maintenance = db.maintenance || [];
        const stockCounts = db.stockCounts || [];

        // Report Generators based on selected reportType
        const getReportData = () => {
            switch (reportType) {
                case 'executive':
                    return [
                        { Metric: 'Today Sales Revenue', Value: formatCurrency(g.todaySales) },
                        { Metric: 'Target Achievement', Value: `${g.todayTarget > 0 ? Math.round((g.todaySales / g.todayTarget) * 100) : 0}%` },
                        { Metric: 'Staff Present', Value: `${employees.filter(e => e.attendance >= 85).length} / ${employees.length}` },
                        { Metric: 'Pending Tasks', Value: tasks.filter(t => t.status !== 'completed').length },
                        { Metric: 'Open Complaints', Value: complaints.filter(c => c.status !== 'resolved').length },
                        { Metric: 'Low Stock Items', Value: inventory.filter(i => i.status === 'low').length },
                    ];
                case 'sales':
                    return db.hourlySales.map(h => ({ Hour: h.hour, Revenue: formatCurrency(h.amount) }));
                case 'staff':
                    return employees.map(e => ({ Employee: e.name, Role: e.role, Shift: e.shift, Attendance: `${e.attendance}%`, Performance: `${e.performance}%` }));
                case 'inventory':
                    return inventory.map(i => ({ Product: i.product, Stock: i.stock, MinStock: i.minStock, SoldThisMonth: i.soldThisMonth, Status: i.status }));
                case 'finance':
                    return expenses.map(e => ({ Category: e.category, Amount: formatCurrency(e.amount), Date: formatDate(e.date), Status: e.status }));
                default:
                    return [];
            }
        };

        const currentReportRows = getReportData();

        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-file-contract text-emerald-400"></i> Realtime Executive Reports Generator
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Live data extraction, analytics charts & multi-format export</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => exportCSV(currentReportRows, `epay_${reportType}_report`)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5">
                            <i className="fa-solid fa-file-csv"></i> Export CSV
                        </button>
                        <button onClick={printReport} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1.5">
                            <i className="fa-solid fa-print"></i> Print / PDF
                        </button>
                    </div>
                </div>

                {/* Report Configuration Bar */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center gap-4 text-xs">
                    <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Select Report Type</label>
                        <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="bg-slate-950 border border-slate-800 text-white rounded px-3 py-1.5 font-semibold">
                            <option value="executive">Daily Executive Summary Report</option>
                            <option value="sales">Sales & Hourly Revenue Report</option>
                            <option value="staff">Staff Attendance & Performance Report</option>
                            <option value="inventory">Inventory & Stock Variance Report</option>
                            <option value="finance">Financial Expenses & Audit Report</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Date Range</label>
                        <select value={reportDateRange} onChange={(e) => setReportDateRange(e.target.value)} className="bg-slate-950 border border-slate-800 text-white rounded px-3 py-1.5 font-semibold">
                            <option value="today">Today ({todayStr()})</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>

                    <div className="ml-auto flex items-end">
                        <button onClick={() => showToast('Realtime data synchronized!', 'success')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded border border-slate-700 font-semibold flex items-center gap-1">
                            <i className="fa-solid fa-arrows-rotate"></i> Sync Realtime Data
                        </button>
                    </div>
                </div>

                {/* Report Preview Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 print:bg-white print:text-black">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                        <div>
                            <h1 className="text-lg font-bold text-white uppercase tracking-wider">{db.gallery?.name || 'ePay CRM Gallery'}</h1>
                            <p className="text-xs text-slate-400">Assistant Manager Operations & Performance Report</p>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                            <div><strong>Report:</strong> {reportType.toUpperCase()} SUMMARY</div>
                            <div><strong>Generated Date:</strong> {new Date().toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Dynamic Table Preview */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left text-slate-300">
                            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                                <tr>
                                    {currentReportRows.length > 0 && Object.keys(currentReportRows[0]).map(key => (
                                        <th key={key} className="p-3">{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {currentReportRows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/40">
                                        {Object.values(row).map((val, i) => (
                                            <td key={i} className="p-3 text-slate-200">{String(val)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    // Dispatcher for active page renderer
    const renderActivePage = () => {
        switch (currentPage) {
            case 'dashboard': return renderDashboard();
            case 'daily': return renderDaily();
            case 'opening': return renderOpening();
            case 'closing': return renderClosing();
            case 'checklist': return renderChecklist();
            case 'handover': return renderHandover();
            case 'employees': return renderEmployees();
            case 'attendance': return renderAttendance();
            case 'shifts': return renderShifts();
            case 'performance': return renderPerformance();
            case 'tasks': return renderTasks();
            case 'mytasks': return renderMyTasks();
            case 'overdue': return renderOverdue();
            case 'sales': return renderSales();
            case 'floor': return renderFloor();
            case 'inventory': return renderInventory();
            case 'stockcount': return renderStockCount();
            case 'damaged': return renderDamaged();
            case 'customers': return renderCustomers();
            case 'membership': return renderMembership();
            case 'complaints': return renderComplaints();
            case 'cash': return renderCash();
            case 'expenses': return renderExpenses();
            case 'pettycash': return renderPettyCash();
            case 'maintenance': return renderMaintenance();
            case 'compliance': return renderCompliance();
            case 'incidents': return renderIncidents();
            case 'approvals': return renderApprovals();
            case 'exceptions': return renderExceptions();
            case 'escalations': return renderEscalations();
            case 'reports': return renderReports();
            default: return renderDashboard();
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                {/* Sub-Header & Navigation Bar for Assistant Manager Portal */}
                <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-base font-bold shadow-sm">
                            AM
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">Assistant Manager Portal</h2>
                            <p className="text-[11px] text-slate-400">Pune Central Gallery · Sunita Rao</p>
                        </div>
                    </div>

                    {/* Global Realtime Search Bar */}
                    <div className="relative w-64">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-slate-500"></i>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Filter records..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>
                </div>

                {/* Portal Section Navigation Sub-Bar */}
                <div className="bg-slate-950/90 border-b border-slate-800 px-6 py-2 overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
                    {NAV_SECTIONS.map(sec => (
                        <React.Fragment key={sec.group}>
                            {sec.items.map(item => {
                                const count = getNavCount(item.id);
                                const isActive = currentPage === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setCurrentPage(item.id)}
                                        className={`px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap font-medium transition-all ${
                                            isActive
                                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                                        }`}
                                    >
                                        <i className={`fa-solid ${item.icon}`}></i>
                                        <span>{item.label}</span>
                                        {count > 0 && (
                                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? 'bg-white text-emerald-700' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>

                {/* Main Content Area */}
                <main className="p-6 flex-1 overflow-y-auto">
                    {renderActivePage()}
                </main>
            </div>

            {/* Global Notification Toast */}
            {toast && (
                <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold text-white flex items-center gap-2 border transition-all animate-bounce ${
                    toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500 text-emerald-200' :
                    toast.type === 'warning' ? 'bg-amber-900/90 border-amber-500 text-amber-200' :
                    'bg-slate-900/90 border-slate-700 text-slate-200'
                }`}>
                    <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}`}></i>
                    <span>{toast.msg}</span>
                </div>
            )}

            {/* Global Modal Overlay */}
            {modal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {modal}
                    </div>
                </div>
            )}
        </div>
    );
}
