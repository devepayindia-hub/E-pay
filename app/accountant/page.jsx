'use client';

import React, { useState, useEffect, useRef } from 'react';
import './AccountantDashboard.css'; // Tailwind + custom green theme

// ---------- DATA STORE ----------
const STORAGE_KEY = 'accountantData_v1';

const getDefaultData = () => ({
  user: { name: 'Yashraj', role: 'Accountant' },
  transactions: [
    { id: 1, type: 'Sales', date: '2025-05-14', account: 'Sales Revenue', debit: 0, credit: 25000, amount: 25000,
      description: 'Invoice #INV-001', customer: 'Art Gallery', vendor: '', status: 'completed', ref: 'INV-001' },
    { id: 2, type: 'Purchase', date: '2025-05-14', account: 'Inventory', debit: 12000, credit: 0, amount: 12000,
      description: 'PO #PO-202', customer: '', vendor: 'Canvas Supply Co.', status: 'pending', ref: 'PO-202' },
    { id: 3, type: 'Payment', date: '2025-05-15', account: 'Bank', debit: 0, credit: 5000, amount: 5000,
      description: 'Vendor payment', customer: '', vendor: 'Frame World', status: 'completed', ref: 'PAY-003' },
    { id: 4, type: 'Receipt', date: '2025-05-15', account: 'Bank', debit: 15000, credit: 0, amount: 15000,
      description: 'Customer payment', customer: 'Modern Arts', vendor: '', status: 'completed', ref: 'REC-004' },
    { id: 5, type: 'Expense', date: '2025-05-16', account: 'Office Supplies', debit: 3500, credit: 0, amount: 3500,
      description: 'Stationery', customer: '', vendor: 'OfficeMart', status: 'pending', ref: 'EXP-005' },
  ],
  customers: [
    { id: 1, name: 'Art Gallery', balance: 25000, email: 'art@example.com' },
    { id: 2, name: 'Modern Arts', balance: 15000, email: 'modern@example.com' },
  ],
  vendors: [
    { id: 1, name: 'Canvas Supply Co.', balance: 12000, email: 'canvas@example.com' },
    { id: 2, name: 'Frame World', balance: 5000, email: 'frame@example.com' },
  ],
  bankAccounts: [
    { id: 1, name: 'Main Current Account', balance: 450000, lastReconciled: '2025-05-14' },
  ],
  bankTransactions: [
    { id: 1, date: '2025-05-14', amount: 25000, ref: 'INV-001', status: 'matched' },
    { id: 2, date: '2025-05-15', amount: 5000, ref: 'PAY-003', status: 'unmatched' },
  ],
  tasks: [
    { id: 1, title: 'Reconcile bank statement', assigned: '2025-05-15', due: '2025-05-20', priority: 'High',
      status: 'In Progress' },
    { id: 2, title: 'Review pending purchase invoices', assigned: '2025-05-16', due: '2025-05-18',
      priority: 'Medium', status: 'Not Started' },
  ],
  dailyReport: {
    date: '2025-05-16',
    transactionsProcessed: 5,
    salesEntries: 2,
    purchaseEntries: 1,
    expenseEntries: 1,
    paymentEntries: 1,
    receiptEntries: 1,
    journalEntries: 0,
    bankReconciliation: 1,
    customerReconciliation: 0,
    vendorReconciliation: 0,
    errorsFound: 0,
    errorsCorrected: 0,
    pendingTransactions: 2,
    pendingDocuments: 1,
    escalations: 0,
    tasksCompleted: 3,
    tasksPending: 2,
    remarks: 'All good'
  },
  stats: {}
});

// ---------- MENU STRUCTURE ----------
const menuStructure = [
  { section: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'fa-house' }] },
  { section: 'Accounting', items: [
    { id: 'transactions', label: 'My Transactions', icon: 'fa-regular fa-receipt' },
    { id: 'ledger', label: 'General Ledger', icon: 'fa-regular fa-book' },
    { id: 'journal', label: 'Journal Entries', icon: 'fa-regular fa-pen-to-square' },
  ] },
  { section: 'Sales', items: [
    { id: 'sales-invoices', label: 'Sales Invoices', icon: 'fa-regular fa-file-invoice' },
    { id: 'sales-reconciliation', label: 'Sales Reconciliation', icon: 'fa-regular fa-check-double' },
  ] },
  { section: 'Purchases', items: [
    { id: 'purchase-invoices', label: 'Purchase Invoices', icon: 'fa-regular fa-file-invoice' },
    { id: 'purchase-reconciliation', label: 'Purchase Reconciliation', icon: 'fa-regular fa-check-double' },
  ] },
  { section: 'Receipts', items: [
    { id: 'receipts', label: 'Customer Receipts', icon: 'fa-regular fa-hand-holding-usd' },
  ] },
  { section: 'Payments', items: [
    { id: 'payments', label: 'Vendor Payments', icon: 'fa-regular fa-credit-card' },
  ] },
  { section: 'Expenses', items: [
    { id: 'expenses', label: 'Expense Entries', icon: 'fa-regular fa-coins' },
  ] },
  { section: 'Bank', items: [
    { id: 'bank', label: 'Bank Reconciliation', icon: 'fa-regular fa-building-columns' },
  ] },
  { section: 'Customers', items: [
    { id: 'customer-ledger', label: 'Customer Ledger', icon: 'fa-regular fa-user' },
  ] },
  { section: 'Vendors', items: [
    { id: 'vendor-ledger', label: 'Vendor Ledger', icon: 'fa-regular fa-user-tie' },
  ] },
  { section: 'Tasks', items: [
    { id: 'tasks', label: 'My Tasks', icon: 'fa-regular fa-list-check' },
    { id: 'daily-report', label: 'Daily Report', icon: 'fa-regular fa-file-lines' },
  ] },
  { section: 'Settings', items: [
    { id: 'settings', label: 'Settings', icon: 'fa-regular fa-gear' },
  ] },
];

// ---------- REACT COMPONENT ----------
const AccountantDashboard = () => {
  // --- State ---
  const [appData, setAppData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // ensure all keys exist
        const defaults = getDefaultData();
        const merged = { ...defaults, ...parsed };
        // merge nested objects if needed
        return merged;
      }
      return getDefaultData();
    } catch {
      return getDefaultData();
    }
  });

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'transaction' or 'editTransaction'
  const [modalData, setModalData] = useState(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef(null);

  // --- Data helpers ---
  const saveData = (newData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {}
  };

  const updateStats = (data) => {
    const t = data.transactions || [];
    const pending = t.filter(tx => tx.status === 'pending');
    const errors = t.filter(tx => tx.status === 'error');
    data.stats = {
      transactionsAssigned: t.length,
      transactionsCompleted: t.filter(tx => tx.status === 'completed').length,
      transactionsPending: pending.length,
      transactionsUnderReview: t.filter(tx => tx.status === 'review').length,
      salesEntries: t.filter(tx => tx.type === 'Sales').length,
      purchaseEntries: t.filter(tx => tx.type === 'Purchase').length,
      expenseEntries: t.filter(tx => tx.type === 'Expense').length,
      paymentEntries: t.filter(tx => tx.type === 'Payment').length,
      receiptEntries: t.filter(tx => tx.type === 'Receipt').length,
      journalEntries: t.filter(tx => tx.type === 'Journal').length,
      bankEntries: t.filter(tx => tx.account === 'Bank').length,
      reconciliationTasks: data.bankTransactions ? data.bankTransactions.filter(bt => bt.status === 'unmatched')
        .length : 0,
      errorsFound: errors.length,
      correctionsPending: pending.length,
      totalRevenueEntries: t.filter(tx => tx.type === 'Sales' || tx.type === 'Receipt').length,
      totalExpenseEntries: t.filter(tx => tx.type === 'Expense' || tx.type === 'Purchase').length,
      totalPaymentEntries: t.filter(tx => tx.type === 'Payment').length,
      totalReceiptEntries: t.filter(tx => tx.type === 'Receipt').length,
      reconciliationPercent: data.bankTransactions ? Math.round((data.bankTransactions.filter(bt => bt.status ===
        'matched').length / data.bankTransactions.length) * 100) : 0,
      errorPercent: t.length ? Math.round((errors.length / t.length) * 100) : 0,
      pendingTransactions: pending.length,
      completedTasks: data.tasks ? data.tasks.filter(task => task.status === 'Completed').length : 0,
      monthlyTotal: t.length,
    };
    return data;
  };

  // update and save
  const updateAppData = (newData) => {
    const updated = updateStats(newData);
    setAppData(updated);
    saveData(updated);
  };

  // --- CRUD operations ---
  const addTransaction = (txData) => {
    const newTx = {
      id: Date.now(),
      date: txData.date || new Date().toISOString().slice(0, 10),
      type: txData.type || 'Sales',
      account: txData.account || 'Revenue',
      debit: txData.debit || 0,
      credit: txData.credit || 0,
      amount: txData.amount || 0,
      description: txData.description || '',
      customer: txData.customer || '',
      vendor: txData.vendor || '',
      status: txData.status || 'pending',
      ref: txData.ref || 'TXN' + Date.now().toString().slice(-6),
    };
    const newData = {
      ...appData,
      transactions: [...appData.transactions, newTx]
    };
    updateAppData(newData);
    showToast('✅ Transaction created');
  };

  const deleteTransaction = (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    const newData = {
      ...appData,
      transactions: appData.transactions.filter(t => t.id !== id)
    };
    updateAppData(newData);
    showToast('🗑️ Deleted');
  };

  const editTransaction = (id) => {
    const tx = appData.transactions.find(t => t.id === id);
    if (!tx) return;
    openModal('editTransaction', tx);
  };

  const saveEditTransaction = (id, data) => {
    const updatedTransactions = appData.transactions.map(tx =>
      tx.id === id ? { ...tx, ...data } : tx
    );
    const newData = { ...appData, transactions: updatedTransactions };
    updateAppData(newData);
    showToast('✅ Transaction updated');
  };

  // --- Modal ---
  const openModal = (action, data = null) => {
    setModalAction(action);
    setModalData(data);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalAction(null);
    setModalData(null);
    document.body.style.overflow = '';
  };

  // --- Toast ---
  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2200);
  };

  // --- Navigation ---
  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    // Update stats when navigating
    const updated = updateStats(appData);
    setAppData(updated);
    saveData(updated);
  };

  // --- Quick Action ---
  const quickAction = (action) => {
    showToast('⚡ ' + action);
    if (action.includes('New Sales Invoice') || action.includes('New Purchase Invoice') ||
      action.includes('New Receipt') || action.includes('New Payment') ||
      action.includes('New Expense') || action.includes('New Journal Entry')) {
      openModal('transaction');
    }
    if (action === 'Reconcile Bank') {
      showToast('🔄 Bank reconciliation initiated');
    }
    if (action === 'Submit Daily Report') {
      showToast('📋 Daily report submitted');
    }
    if (action === 'Complete Task') {
      showToast('✅ Task marked complete');
    }
  };

  // --- Search handler ---
  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase().trim();
    setSearchQuery(q);
    if (!q) {
      // no filtering, render current page normally
      return;
    }
    const filteredTxs = appData.transactions.filter(tx =>
      tx.description.toLowerCase().includes(q) ||
      tx.customer.toLowerCase().includes(q) ||
      tx.vendor.toLowerCase().includes(q)
    );
    showToast(`🔍 Found ${filteredTxs.length} transactions`);
    // We could set a filtered state, but for simplicity we just show toast.
    // The actual page render will still show all data; search is for quick find.
  };

  // --- Notification badge ---
  const [notifCount, setNotifCount] = useState(12);
  const clearNotifications = () => {
    setNotifCount(0);
    showToast('🔔 Notifications cleared');
  };

  // --- Switch role ---
  const [userName, setUserName] = useState(appData.user?.name || 'Yashraj');
  const switchRole = () => {
    const newName = userName === 'Yashraj' ? 'Admin' : 'Yashraj';
    setUserName(newName);
    showToast('🔄 Switched to ' + newName);
  };

  // --- Render page content based on currentPage ---
  const renderPageContent = () => {
    const s = appData.stats;
    const txs = appData.transactions;

    switch (currentPage) {
      case 'dashboard':
        return (
          <>
            <section className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-3">
              {[
                ['Assigned', s.transactionsAssigned, 'fa-receipt', 'green'],
                ['Completed', s.transactionsCompleted, 'fa-check-circle', 'emerald'],
                ['Pending', s.transactionsPending, 'fa-clock', 'amber'],
                ['Under Review', s.transactionsUnderReview, 'fa-eye', 'sky'],
                ['Sales', s.salesEntries, 'fa-chart-simple', 'blue'],
                ['Purchases', s.purchaseEntries, 'fa-cart-shopping', 'purple'],
                ['Expenses', s.expenseEntries, 'fa-coins', 'rose'],
                ['Payments', s.paymentEntries, 'fa-credit-card', 'teal'],
                ['Receipts', s.receiptEntries, 'fa-hand-holding-usd', 'green'],
                ['Journal', s.journalEntries, 'fa-pen', 'amber'],
                ['Bank Entries', s.bankEntries, 'fa-building-columns', 'cyan'],
                ['Reconciliation', s.reconciliationTasks, 'fa-check-double', 'violet'],
                ['Errors', s.errorsFound, 'fa-circle-exclamation', 'red'],
                ['Corrections', s.correctionsPending, 'fa-pen-to-square', 'orange'],
              ].map(([label, value, icon, color]) => {
                const colorMap = {
                  green: 'bg-green-50 text-green-600',
                  emerald: 'bg-emerald-50 text-emerald-600',
                  amber: 'bg-amber-50 text-amber-600',
                  sky: 'bg-sky-50 text-sky-600',
                  blue: 'bg-blue-50 text-blue-600',
                  purple: 'bg-purple-50 text-purple-600',
                  rose: 'bg-rose-50 text-rose-600',
                  teal: 'bg-teal-50 text-teal-600',
                  cyan: 'bg-cyan-50 text-cyan-600',
                  violet: 'bg-violet-50 text-violet-600',
                  red: 'bg-red-50 text-red-600',
                  orange: 'bg-orange-50 text-orange-600'
                };
                const cls = colorMap[color] || 'bg-green-50 text-green-600';
                return (
                  <div key={label} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm card-hover">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${cls} flex items-center justify-center`}>
                        <i className={`fa-regular ${icon}`}></i>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">{label}</p>
                        <h4 className="font-bold text-sm">{value}</h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-400">Monthly Transactions</p>
                <h3 className="text-2xl font-bold">{s.monthlyTotal}</h3>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-400">Reconciliation %</p>
                <h3 className="text-2xl font-bold">{s.reconciliationPercent}%</h3>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                  <div className="bg-green-600 rounded-full h-2" style={{ width: `${s.reconciliationPercent}%` }}></div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-400">Error Rate</p>
                <h3 className="text-2xl font-bold">{s.errorPercent}%</h3>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h4 className="font-bold text-sm text-slate-800">
                <i className="fa-regular fa-bolt mr-2 text-green-500"></i>Quick Actions
              </h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {['New Sales Invoice', 'New Purchase Invoice', 'New Receipt', 'New Payment', 'New Expense',
                  'New Journal Entry', 'Reconcile Bank', 'View Pending', 'Submit Daily Report'
                ].map(label => (
                  <button key={label} onClick={() => quickAction(label)}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs hover:bg-green-50 transition">
                    <i className={`fa-regular ${label.includes('Sales') ? 'fa-file-invoice' :
                      label.includes('Purchase') ? 'fa-file-invoice' :
                      label.includes('Receipt') ? 'fa-hand-holding-usd' :
                      label.includes('Payment') ? 'fa-credit-card' :
                      label.includes('Expense') ? 'fa-coins' :
                      label.includes('Journal') ? 'fa-pen' :
                      label.includes('Reconcile') ? 'fa-check-double' :
                      label.includes('Pending') ? 'fa-clock' : 'fa-file-lines'} text-green-500 mr-1`}></i>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-800">
                  <i className="fa-regular fa-clock mr-2"></i>Recent Transactions
                </h4>
                <button onClick={() => navigateTo('transactions')} className="text-xs text-green-600">View All</button>
              </div>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b">
                      <th className="pb-2 text-left">Date</th>
                      <th className="pb-2 text-left">Type</th>
                      <th className="pb-2 text-left">Description</th>
                      <th className="pb-2 text-left">Amount</th>
                      <th className="pb-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appData.transactions.slice(0, 5).map(tx => (
                      <tr key={tx.id}>
                        <td className="py-2">{tx.date}</td>
                        <td>{tx.type}</td>
                        <td>{tx.description}</td>
                        <td>₹{tx.amount}</td>
                        <td><span className={`status-badge ${tx.status}`}>{tx.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'transactions':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-bold text-lg text-slate-800">
                <i className="fa-regular fa-receipt mr-2 text-green-500"></i>My Transactions ({txs.length})
              </h2>
              <button onClick={() => openModal('transaction')}
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <i className="fa-regular fa-plus mr-1"></i> New Transaction
              </button>
            </div>
            <div className="overflow-x-auto mt-4 scrollable-table">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b">
                    <th className="pb-3 text-left">ID</th>
                    <th className="pb-3 text-left">Date</th>
                    <th className="pb-3 text-left">Type</th>
                    <th className="pb-3 text-left">Account</th>
                    <th className="pb-3 text-left">Debit</th>
                    <th className="pb-3 text-left">Credit</th>
                    <th className="pb-3 text-left">Amount</th>
                    <th className="pb-3 text-left">Status</th>
                    <th className="pb-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {txs.map(tx => (
                    <tr key={tx.id}>
                      <td>{tx.id}</td>
                      <td>{tx.date}</td>
                      <td>{tx.type}</td>
                      <td>{tx.account}</td>
                      <td>{tx.debit}</td>
                      <td>{tx.credit}</td>
                      <td>₹{tx.amount}</td>
                      <td><span className={`status-badge ${tx.status}`}>{tx.status}</span></td>
                      <td>
                        <button onClick={() => editTransaction(tx.id)} className="edit-btn mr-2">
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button onClick={() => deleteTransaction(tx.id)} className="delete-btn">
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'sales-invoices': {
        const sales = txs.filter(tx => tx.type === 'Sales');
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-800">
                <i className="fa-regular fa-file-invoice mr-2 text-green-500"></i>Sales Invoices ({sales.length})
              </h2>
              <button onClick={() => quickAction('New Sales Invoice')}
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <i className="fa-regular fa-plus"></i> New
              </button>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b">
                    <th className="pb-3 text-left">Invoice</th>
                    <th className="pb-3 text-left">Customer</th>
                    <th className="pb-3 text-left">Amount</th>
                    <th className="pb-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(s => (
                    <tr key={s.id}>
                      <td>{s.ref}</td>
                      <td>{s.customer}</td>
                      <td>₹{s.amount}</td>
                      <td><span className={`status-badge ${s.status}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'purchase-invoices': {
        const purchases = txs.filter(tx => tx.type === 'Purchase');
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-800">
                <i className="fa-regular fa-file-invoice mr-2 text-purple-500"></i>Purchase Invoices ({purchases.length})
              </h2>
              <button onClick={() => quickAction('New Purchase Invoice')}
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <i className="fa-regular fa-plus"></i> New
              </button>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b">
                    <th className="pb-3 text-left">PO</th>
                    <th className="pb-3 text-left">Vendor</th>
                    <th className="pb-3 text-left">Amount</th>
                    <th className="pb-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map(p => (
                    <tr key={p.id}>
                      <td>{p.ref}</td>
                      <td>{p.vendor}</td>
                      <td>₹{p.amount}</td>
                      <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'receipts': {
        const receipts = txs.filter(tx => tx.type === 'Receipt');
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-lg text-slate-800">
              <i className="fa-regular fa-hand-holding-usd mr-2 text-green-500"></i>Customer Receipts
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b">
                    <th className="pb-3 text-left">Receipt #</th>
                    <th className="pb-3 text-left">Customer</th>
                    <th className="pb-3 text-left">Amount</th>
                    <th className="pb-3 text-left">Date</th>
                    <th className="pb-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map(r => (
                    <tr key={r.id}>
                      <td>{r.ref}</td>
                      <td>{r.customer}</td>
                      <td>₹{r.amount}</td>
                      <td>{r.date}</td>
                      <td><span className={`status-badge ${r.status}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'payments': {
        const payments = txs.filter(tx => tx.type === 'Payment');
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-lg text-slate-800">
              <i className="fa-regular fa-credit-card mr-2 text-teal-500"></i>Vendor Payments
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b">
                    <th className="pb-3 text-left">Payment #</th>
                    <th className="pb-3 text-left">Vendor</th>
                    <th className="pb-3 text-left">Amount</th>
                    <th className="pb-3 text-left">Date</th>
                    <th className="pb-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td>{p.ref}</td>
                      <td>{p.vendor}</td>
                      <td>₹{p.amount}</td>
                      <td>{p.date}</td>
                      <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'expenses': {
        const expenses = txs.filter(tx => tx.type === 'Expense');
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-lg text-slate-800">
              <i className="fa-regular fa-coins mr-2 text-rose-500"></i>Expense Entries
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b">
                    <th className="pb-3 text-left">Expense #</th>
                    <th className="pb-3 text-left">Description</th>
                    <th className="pb-3 text-left">Amount</th>
                    <th className="pb-3 text-left">Date</th>
                    <th className="pb-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id}>
                      <td>{e.ref}</td>
                      <td>{e.description}</td>
                      <td>₹{e.amount}</td>
                      <td>{e.date}</td>
                      <td><span className={`status-badge ${e.status}`}>{e.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'bank': {
        const bankTxs = appData.bankTransactions || [];
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-400">Bank Balance</p>
                <h3 className="text-2xl font-bold">₹{appData.bankAccounts[0]?.balance || 0}</h3>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-400">Matched</p>
                <h3 className="text-2xl font-bold text-emerald-600">
                  {bankTxs.filter(bt => bt.status === 'matched').length}
                </h3>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-400">Unmatched</p>
                <h3 className="text-2xl font-bold text-rose-500">
                  {bankTxs.filter(bt => bt.status === 'unmatched').length}
                </h3>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-sm text-slate-800">Bank Transactions</h3>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b">
                      <th className="pb-2 text-left">Date</th>
                      <th className="pb-2 text-left">Amount</th>
                      <th className="pb-2 text-left">Reference</th>
                      <th className="pb-2 text-left">Status</th>
                      <th className="pb-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankTxs.map(bt => (
                      <tr key={bt.id}>
                        <td>{bt.date}</td>
                        <td>₹{bt.amount}</td>
                        <td>{bt.ref}</td>
                        <td>
                          <span className={`status-badge ${bt.status === 'matched' ? 'reconciled' : 'unreconciled'}`}>
                            {bt.status}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => quickAction('Reconcile Bank')} className="text-xs text-green-600">
                            Reconcile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      }

      case 'customer-ledger': {
        const customers = appData.customers;
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-lg text-slate-800">
              <i className="fa-regular fa-user mr-2 text-green-500"></i>Customer Ledger
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b">
                    <th className="pb-3 text-left">Customer</th>
                    <th className="pb-3 text-left">Email</th>
                    <th className="pb-3 text-left">Balance</th>
                    <th className="pb-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td>₹{c.balance}</td>
                      <td>
                        <span className={`status-badge ${c.balance > 0 ? 'unpaid' : 'paid'}`}>
                          {c.balance > 0 ? 'Outstanding' : 'Settled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'vendor-ledger': {
        const vendors = appData.vendors;
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-lg text-slate-800">
              <i className="fa-regular fa-user-tie mr-2 text-purple-500"></i>Vendor Ledger
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b">
                    <th className="pb-3 text-left">Vendor</th>
                    <th className="pb-3 text-left">Email</th>
                    <th className="pb-3 text-left">Balance</th>
                    <th className="pb-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id}>
                      <td>{v.name}</td>
                      <td>{v.email}</td>
                      <td>₹{v.balance}</td>
                      <td>
                        <span className={`status-badge ${v.balance > 0 ? 'unpaid' : 'paid'}`}>
                          {v.balance > 0 ? 'Outstanding' : 'Settled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'tasks': {
        const tasks = appData.tasks;
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-lg text-slate-800">
              <i className="fa-regular fa-list-check mr-2 text-green-500"></i>My Tasks ({tasks.length})
            </h2>
            <div className="space-y-3 mt-4">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-slate-400">Due: {task.due}  Priority: {task.priority}</p>
                  </div>
                  <div>
                    <span className={`status-badge ${task.status === 'Completed' ? 'completed' : 'pending'}`}>
                      {task.status}
                    </span>
                    <button onClick={() => quickAction('Complete Task')} className="ml-2 text-xs text-green-600">
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'daily-report': {
        const r = appData.dailyReport || {};
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-lg text-slate-800">
              <i className="fa-regular fa-file-lines mr-2 text-amber-500"></i>Daily Report - {r.date || 'Today'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {[
                ['Transactions Processed', r.transactionsProcessed],
                ['Sales Entries', r.salesEntries],
                ['Purchase Entries', r.purchaseEntries],
                ['Expense Entries', r.expenseEntries],
                ['Payment Entries', r.paymentEntries],
                ['Receipt Entries', r.receiptEntries],
                ['Errors Found', r.errorsFound],
                ['Tasks Completed', r.tasksCompleted]
              ].map(([label, value]) => (
                <div key={label} className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="font-bold text-lg">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm"><span className="font-semibold">Remarks:</span> {r.remarks || 'None'}</p>
            </div>
            <button onClick={() => quickAction('Submit Daily Report')}
              className="mt-4 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Submit Report
            </button>
          </div>
        );
      }

      case 'ledger':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-lg text-slate-800">General Ledger</h2>
            <p className="text-sm text-slate-500">View all account balances and transactions.</p>
          </div>
        );

      case 'journal':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-lg text-slate-800">Journal Entries</h2>
            <p className="text-sm text-slate-500">Create and view routine journal entries.</p>
          </div>
        );

      case 'sales-reconciliation':
      case 'purchase-reconciliation': {
        const label = currentPage === 'sales-reconciliation' ? 'Sales' : 'Purchase';
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-lg text-slate-800">{label} Reconciliation</h2>
            <p className="text-sm text-slate-500">Match {label.toLowerCase()} transactions with bank/customer records.</p>
          </div>
        );
      }

      default:
        return <div>Page not found</div>;
    }
  };

  // --- Modal content render ---
  const renderModalContent = () => {
    if (!modalOpen) return null;
    const isEdit = modalAction === 'editTransaction';
    const tx = modalData || {};

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = {
        date: document.getElementById('modalDate').value,
        type: document.getElementById('modalType').value,
        account: document.getElementById('modalAccount').value,
        debit: parseFloat(document.getElementById('modalDebit').value) || 0,
        credit: parseFloat(document.getElementById('modalCredit').value) || 0,
        amount: parseFloat(document.getElementById('modalAmount').value) || 0,
        description: document.getElementById('modalDescription').value,
        customer: document.getElementById('modalCustomer').value,
        vendor: document.getElementById('modalVendor').value,
        ref: document.getElementById('modalRef').value,
        status: document.getElementById('modalStatus').value,
      };
      if (isEdit) {
        saveEditTransaction(tx.id, formData);
      } else {
        addTransaction(formData);
      }
      closeModal();
    };

    return (
      <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="modal-box">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800">{isEdit ? 'Edit' : 'New'} Transaction</h3>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div>
                <label>Date</label>
                <input type="date" id="modalDate" defaultValue={tx.date || new Date().toISOString().slice(0, 10)} />
              </div>
              <div>
                <label>Type</label>
                <select id="modalType" defaultValue={tx.type || 'Sales'}>
                  <option>Sales</option>
                  <option>Purchase</option>
                  <option>Expense</option>
                  <option>Payment</option>
                  <option>Receipt</option>
                  <option>Journal</option>
                </select>
              </div>
            </div>
            <label>Account</label>
            <input id="modalAccount" defaultValue={tx.account || ''} placeholder="Account name" />
            <div className="form-row">
              <div><label>Debit</label><input type="number" id="modalDebit" defaultValue={tx.debit || 0} /></div>
              <div><label>Credit</label><input type="number" id="modalCredit" defaultValue={tx.credit || 0} /></div>
            </div>
            <label>Amount</label>
            <input type="number" id="modalAmount" defaultValue={tx.amount || 0} />
            <label>Description</label>
            <input id="modalDescription" defaultValue={tx.description || ''} />
            <div className="form-row">
              <div><label>Customer</label><input id="modalCustomer" defaultValue={tx.customer || ''} /></div>
              <div><label>Vendor</label><input id="modalVendor" defaultValue={tx.vendor || ''} /></div>
            </div>
            <label>Reference</label>
            <input id="modalRef" defaultValue={tx.ref || ''} />
            <label>Status</label>
            <select id="modalStatus" defaultValue={tx.status || 'pending'}>
              <option>pending</option>
              <option>completed</option>
              <option>review</option>
              <option>error</option>
            </select>
            <div className="mt-6 flex gap-3 justify-end">
              <button type="button" onClick={closeModal} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                {isEdit ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // --- Effects ---
  useEffect(() => {
    // Update stats on mount and whenever appData changes
    const updated = updateStats(appData);
    if (updated !== appData) {
      setAppData(updated);
      saveData(updated);
    }
  }, []);

  // Cleanup toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // --- Render ---
  return (
    <div className="flex h-screen bg-slate-50/80">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b1f16] text-white/80 flex flex-col shrink-0 h-full border-r border-[#1a3a2e] fixed inset-y-0 left-0 z-50">
        <div className="px-5 py-5 border-b border-[#1a3a2e] flex items-center gap-3 shrink-0">
          <i className="fa-solid fa-calculator text-green-400 text-xl"></i>
          <span className="text-white font-bold tracking-tight">ePay Accountant</span>
          <span className="ml-auto text-[10px] bg-green-600/30 text-green-200 px-2 py-0.5 rounded-full">v3</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-5 text-sm overflow-y-auto sidebar-nav" id="sidebarNav">
          {menuStructure.map((group, idx) => (
            <div key={idx}>
              <span className="text-[10px] uppercase tracking-wider text-green-400/60 font-semibold">
                {group.section}
              </span>
              <ul className="mt-2 space-y-1">
                {group.items.map(item => (
                  <li
                    key={item.id}
                    className={`sidebar-link ${currentPage === item.id ? 'active' : ''}`}
                    onClick={() => navigateTo(item.id)}
                  >
                    <i className={`${item.icon} w-4`}></i>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-[#1a3a2e] text-xs text-slate-400 flex items-center gap-3 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&auto=format&fit=crop&q=80"
            className="w-7 h-7 rounded-full"
            alt="profile"
          />
          <div>
            <p className="text-white text-sm font-medium" id="userNameDisplay">{userName}</p>
            <p className="text-[10px] text-green-300">Accountant</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex flex-col h-screen overflow-hidden w-full">
        {/* Top Nav */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="relative w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search transactions, customers, vendors..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500 transition"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={switchRole}
              className="flex items-center gap-2 border border-slate-200 hover:bg-green-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              <i className="fa-solid fa-arrow-right-arrow-left text-green-600"></i> Switch
            </button>
            <div className="relative">
              <button onClick={clearNotifications} className="p-2 text-slate-600 hover:bg-green-50 rounded-full transition relative">
                <i className="fa-regular fa-bell text-lg"></i>
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </button>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-green-300"
                alt="profile"
              />
            </div>
          </div>
        </header>

        {/* Scrollable main */}
        <main className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/80" id="mainContent">
          {renderPageContent()}
        </main>
      </div>

      {/* Toast */}
      <div id="toast" className={`toast ${toastVisible ? 'show' : ''}`}>
        <i className="fa-regular fa-circle-check"></i>
        <span id="toastMsg">{toastMessage}</span>
      </div>

      {/* Modal */}
      {renderModalContent()}
    </div>
  );
};

export default AccountantDashboard;