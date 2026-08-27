'use client';

import React, { useState, useEffect } from 'react';

// ============================================================================
// FULL FINANCE + ACCOUNTING + ERP CONTROL CENTRE — ePAY DIGITAL GALLERY
// ============================================================================
const STORAGE_KEY = 'epay_finance_crm_v4';

const defaultFinanceDb = () => ({
  user: {
    name: 'Anil Deshmukh',
    role: 'Chief Financial Officer (CFO)',
    company: 'ePay Digital Gallery India Pvt Ltd',
    avatar: 'AD',
    email: 'cfo@epaygallery.com'
  },
  periodLock: {
    lockedPeriod: 'July 2026',
    isLocked: true,
    lockedBy: 'Anil Deshmukh (CFO)',
    lockedAt: '2026-08-01 18:30:00',
    currentPeriod: 'August 2026'
  },
  // 1. EXECUTIVE KPI SUMMARY (25 Core Metrics)
  kpi: {
    totalRevenue: 28450000,
    todayRevenue: 984500,
    monthlyRevenue: 18450000,
    ytdRevenue: 148500000,
    grossProfit: 19800000,
    netProfit: 7120000,
    grossMargin: 69.6,
    netMargin: 25.0,
    totalCash: 34250000,
    bankBalance: 29800000,
    cashInHand: 4450000,
    availableCash: 31500000,
    accountsReceivable: 31500000,
    accountsPayable: 14200000,
    overdueReceivables: 6850000,
    vendorPaymentsDue: 4950000,
    pendingRefunds: 485000,
    pendingApprovals: 12,
    marketingSpend: 3450000,
    salaryLiability: 8250000,
    monthlyExpenses: 11330000,
    budgetUtilization: 78.5,
    forecastRevenue: 20000000,
    forecastProfit: 7800000,
    forecastClosingCash: 38200000
  },
  // 2. LIVE CONTROL CENTRE ANOMALIES
  controlCenterIssues: [
    { id: 'CCI-101', severity: 'critical', title: '12 Unmatched Bank Transactions in HDFC Corporate', type: 'Bank Reconciliation', count: 12, amount: '₹14,50,000', status: 'Action Needed' },
    { id: 'CCI-102', severity: 'critical', title: '5 High-Value Overdue Receivables (>60 Days)', type: 'Accounts Receivable', count: 5, amount: '₹42,80,000', status: 'Escalated' },
    { id: 'CCI-103', severity: 'important', title: '8 Vendor Bills Pending Disbursement Schedule', type: 'Accounts Payable', count: 8, amount: '₹18,40,000', status: 'Due Today' },
    { id: 'CCI-104', severity: 'important', title: '3 Customer Refunds Awaiting Final CFO Approval', type: 'Refunds', count: 3, amount: '₹1,85,000', status: 'Pending Review' },
    { id: 'CCI-105', severity: 'important', title: '4 High-Ticket Purchase Approvals Pending', type: 'Approvals', count: 4, amount: '₹28,50,000', status: 'Under Review' },
    { id: 'CCI-106', severity: 'critical', title: '2 Gallery Cash Tills Below Safe Minimum Reserve Threshold', type: 'Cash Management', count: 2, amount: '₹45,000 Short', status: 'Alert' },
    { id: 'CCI-107', severity: 'important', title: '6 Gateway Daily Settlement Variances Detected', type: 'Settlements', count: 6, amount: '₹84,200 Difference', status: 'Reconciling' },
    { id: 'CCI-108', severity: 'critical', title: '4 GSTIN & Tax Rate Discrepancies on Vendor Invoices', type: 'GST & Tax', count: 4, amount: '₹3,12,000 ITC Impact', status: 'Audit Flag' },
    { id: 'CCI-109', severity: 'important', title: '9 Missing Supporting Vouchers & Tax Invoices', type: 'Compliance', count: 9, amount: '₹5,20,000 Exposure', status: 'Docs Required' },
    { id: 'CCI-110', severity: 'important', title: '7 Department & Campaign Budget Threshold Overruns', type: 'Budget Control', count: 7, amount: '₹4,90,000 Over', status: 'Warning' }
  ],
  // 3. ACTION REQUIRED TASK QUEUE
  tasks: [
    { id: 'ACT-301', title: 'Approve Cloud Infrastructure Payment (AWS Mumbai)', type: 'Vendor Payment', priority: 'High', amount: 345000, owner: 'Anil Deshmukh', dept: 'Technology', gallery: 'HQ', dueDate: '2026-08-25', aging: '2 days', escalation: 'Level 2', status: 'Pending' },
    { id: 'ACT-302', title: 'Review August 2026 Staff Salary Disbursal Sheet', type: 'Salary Processing', priority: 'Critical', amount: 8250000, owner: 'Priya Sharma (HR)', dept: 'HR & Finance', gallery: 'All Galleries', dueDate: '2026-08-27', aging: '1 day', escalation: 'Level 3', status: 'Pending' },
    { id: 'ACT-303', title: 'Reconcile HDFC Main Current Account (Stmt #8821)', type: 'Bank Reconciliation', priority: 'High', amount: 14500000, owner: 'Rohan Joshi', dept: 'Finance', gallery: 'HQ', dueDate: '2026-08-25', aging: 'Today', escalation: 'None', status: 'In Progress' },
    { id: 'ACT-304', title: 'Authorize Pune Central Gallery Daily Cash Closing Shortfall', type: 'Cash Verification', priority: 'Critical', amount: 12500, owner: 'Suresh Patil', dept: 'Retail Ops', gallery: 'Pune Central', dueDate: '2026-08-25', aging: '3 hours', escalation: 'Level 1', status: 'Pending' },
    { id: 'ACT-305', title: 'Process Enterprise Customer Refund #RF-9042 (Zenith Travel)', type: 'Refund Approval', priority: 'Medium', amount: 185000, owner: 'Meera Sen', dept: 'Customer Ops', gallery: 'Mumbai East', dueDate: '2026-08-26', aging: '4 days', escalation: 'Level 2', status: 'Pending' },
    { id: 'ACT-306', title: 'Validate GSTR-2B Input Tax Credit for July 2026 Returns', type: 'GST Reconciliation', priority: 'High', amount: 1240000, owner: 'Vikas Shah (CA)', dept: 'Taxation', gallery: 'HQ', dueDate: '2026-08-26', aging: '2 days', escalation: 'None', status: 'In Progress' },
    { id: 'ACT-307', title: 'Approve Fixed Asset Capitalization (50x POS Terminals)', type: 'Asset Approval', priority: 'Medium', amount: 1450000, owner: 'Karan Mehra', dept: 'Asset Mgmt', gallery: 'Company-Wide', dueDate: '2026-08-28', aging: '1 day', escalation: 'None', status: 'Pending' }
  ],
  // 4. CHART OF ACCOUNTS
  chartOfAccounts: [
    { code: '1000', name: 'CURRENT ASSETS', type: 'Asset', parent: 'ROOT', balance: 34250000, status: 'Active' },
    { code: '1100', name: 'HDFC Corporate Current A/c #9011', type: 'Bank Account', parent: '1000', balance: 24500000, status: 'Active' },
    { code: '1110', name: 'ICICI Operational A/c #4421', type: 'Bank Account', parent: '1000', balance: 5300000, status: 'Active' },
    { code: '1200', name: 'Cash in Hand (HQ Vault)', type: 'Cash Account', parent: '1000', balance: 2500000, status: 'Active' },
    { code: '1210', name: 'Gallery Petty Cash Tills', type: 'Cash Account', parent: '1000', balance: 1950000, status: 'Active' },
    { code: '1300', name: 'Trade Receivables (Customers)', type: 'Receivable Account', parent: '1000', balance: 31500000, status: 'Active' },
    { code: '1500', name: 'FIXED ASSETS', type: 'Asset', parent: 'ROOT', balance: 48500000, status: 'Active' },
    { code: '1510', name: 'Gallery Interiors & Furniture', type: 'Fixed Asset', parent: '1500', balance: 22000000, status: 'Active' },
    { code: '1520', name: 'IT Servers, Laptops & POS Terminals', type: 'Fixed Asset', parent: '1500', balance: 26500000, status: 'Active' },
    { code: '2000', name: 'CURRENT LIABILITIES', type: 'Liability', parent: 'ROOT', balance: 26850000, status: 'Active' },
    { code: '2100', name: 'Trade Payables (Vendors)', type: 'Payable Account', parent: '2000', balance: 14200000, status: 'Active' },
    { code: '2200', name: 'Salary & Payroll Payable', type: 'Liability', parent: '2000', balance: 8250000, status: 'Active' },
    { code: '2300', name: 'GST Output Liability (IGST/CGST/SGST)', type: 'Tax Account', parent: '2000', balance: 4400000, status: 'Active' },
    { code: '3000', name: 'CAPITAL & RESERVES', type: 'Capital', parent: 'ROOT', balance: 85000000, status: 'Active' },
    { code: '4000', name: 'INCOME / REVENUE', type: 'Income', parent: 'ROOT', balance: 148500000, status: 'Active' },
    { code: '4100', name: 'ePay Travel & Tour Packages Revenue', type: 'Income', parent: '4000', balance: 65400000, status: 'Active' },
    { code: '4200', name: 'Visa & Passport Processing Fees', type: 'Income', parent: '4000', balance: 34200000, status: 'Active' },
    { code: '4300', name: 'Digital Gallery Membership Subscriptions', type: 'Income', parent: '4000', balance: 28500000, status: 'Active' },
    { code: '4400', name: 'Franchise Setup & License Fees', type: 'Income', parent: '4000', balance: 20400000, status: 'Active' },
    { code: '5000', name: 'OPERATING EXPENSES', type: 'Expense', parent: 'ROOT', balance: 94800000, status: 'Active' },
    { code: '5100', name: 'Employee Salaries & Benefits', type: 'Expense', parent: '5000', balance: 48200000, status: 'Active' },
    { code: '5200', name: 'Commercial Property Rent & Lease', type: 'Expense', parent: '5000', balance: 14800000, status: 'Active' },
    { code: '5300', name: 'Digital Marketing, Boosting & Promotions', type: 'Expense', parent: '5000', balance: 18500000, status: 'Active' },
    { code: '5400', name: 'Office Operations & Utilities', type: 'Expense', parent: '5000', balance: 6400000, status: 'Active' },
    { code: '5500', name: 'Corporate Social Responsibility & Charity', type: 'Expense', parent: '5000', balance: 2100000, status: 'Active' },
    { code: '5600', name: 'Software Subscriptions, Servers & IT', type: 'Expense', parent: '5000', balance: 4800000, status: 'Active' }
  ],
  // 5. DOUBLE-ENTRY JOURNAL VOUCHERS
  journals: [
    { id: 'JV-2026-0801', date: '2026-08-24', voucherType: 'Journal Voucher', reference: 'REF-HDFC-9912', debitAcc: 'HDFC Corporate Current A/c #9011', creditAcc: 'Trade Receivables (Customers)', debitAmount: 850000, creditAmount: 850000, costCentre: 'Pune Gallery', gallery: 'Pune Central', dept: 'Finance', narration: 'Receipt of B2B payment from Aditya Enterprises for corporate travel bookings', postedBy: 'Rohan Joshi', approvedBy: 'Anil Deshmukh', status: 'Posted' },
    { id: 'JV-2026-0802', date: '2026-08-24', voucherType: 'Payment Voucher', reference: 'INV-AWS-8831', debitAcc: 'Software Subscriptions, Servers & IT', creditAcc: 'HDFC Corporate Current A/c #9011', debitAmount: 112400, creditAmount: 112400, costCentre: 'HQ Tech', gallery: 'HQ', dept: 'Technology', narration: 'Cloud hosting charges for ePay ERP microservices cluster', postedBy: 'Vikas Shah', approvedBy: 'Anil Deshmukh', status: 'Posted' },
    { id: 'JV-2026-0803', date: '2026-08-25', voucherType: 'Journal Voucher', reference: 'MKT-META-771', debitAcc: 'Digital Marketing, Boosting & Promotions', creditAcc: 'Trade Payables (Vendors)', debitAmount: 450000, creditAmount: 450000, costCentre: 'Digital Marketing', gallery: 'Company-Wide', dept: 'Marketing', narration: 'Meta & Google Ads boosting invoice for Pune & Mumbai luxury holiday campaigns', postedBy: 'Sunil Kumar', approvedBy: 'Pending CFO', status: 'Pending Approval' },
    { id: 'JV-2026-0804', date: '2026-08-25', voucherType: 'Adjustment Voucher', reference: 'ADJ-RENT-08', debitAcc: 'Commercial Property Rent & Lease', creditAcc: 'Trade Payables (Vendors)', debitAmount: 350000, creditAmount: 350000, costCentre: 'Pune Gallery', gallery: 'Pune Central', dept: 'Operations', narration: 'Monthly lease rental provision for Pune Central Gallery building', postedBy: 'Rohan Joshi', approvedBy: 'Anil Deshmukh', status: 'Posted' }
  ],
  // 6. ACCOUNTING ERROR CENTRE
  accountingErrors: [
    { id: 'ERR-01', rule: 'Backdated Entry without CFO Clearance', desc: 'Voucher JV-881 dated 15-July entered on 24-August by junior clerk', amount: '₹75,000', severity: 'Warning', status: 'Pending Override' },
    { id: 'ERR-02', rule: 'Vendor Invoice Tax Rate Mismatch', desc: 'Inv #DELL-3301 charged at 12% GST instead of statutory 18%', amount: '₹2,61,000', severity: 'Critical', status: 'Blocked from Posting' },
    { id: 'ERR-03', rule: 'Missing Cost Centre Tagging', desc: 'Direct marketing payment of ₹1,80,000 missing gallery attribution tag', amount: '₹1,80,000', severity: 'Warning', status: 'Tag Required' },
    { id: 'ERR-04', rule: 'Potential Duplicate Payment Indicator', desc: 'Two payments of ₹45,000 to "Apex Office Supplies" on same date', amount: '₹45,000', severity: 'Critical', status: 'Held for Verification' }
  ],
  // 7. ACCOUNTS RECEIVABLE (AR) & AGING
  receivables: [
    { id: 'AR-801', customer: 'Zenith Global Holidays', invoiceNo: 'INV-EP-4901', invoiceDate: '2026-06-15', dueDate: '2026-07-15', totalAmount: 1250000, paidAmount: 0, outstanding: 1250000, agingBucket: '31–60 DAYS', gallery: 'Mumbai East', service: 'Corporate Travel', collector: 'Rajesh Varma', promiseDate: '2026-08-28', promiseAmount: 1250000, status: 'Overdue Alert' },
    { id: 'AR-802', customer: 'Nexus Infotech Solutions', invoiceNo: 'INV-EP-5012', invoiceDate: '2026-07-20', dueDate: '2026-08-20', totalAmount: 850000, paidAmount: 300000, outstanding: 550000, agingBucket: '0–30 DAYS', gallery: 'Pune Central', service: 'Visa Processing', collector: 'Sneha Kulkarni', promiseDate: '2026-08-26', promiseAmount: 550000, status: 'Follow-up' },
    { id: 'AR-803', customer: 'Supreme Logistics Ltd', invoiceNo: 'INV-EP-4100', invoiceDate: '2026-03-10', dueDate: '2026-04-10', totalAmount: 1500000, paidAmount: 0, outstanding: 1500000, agingBucket: '91–180 DAYS', gallery: 'Nagpur', service: 'Franchise Royalty', collector: 'Anil Deshmukh', promiseDate: '2026-08-30', promiseAmount: 1500000, status: 'Escalated to Legal' },
    { id: 'AR-804', customer: 'Apex Medical Corp', invoiceNo: 'INV-EP-5230', invoiceDate: '2026-08-10', dueDate: '2026-09-10', totalAmount: 2200000, paidAmount: 1000000, outstanding: 1200000, agingBucket: 'CURRENT', gallery: 'Pune Central', service: 'Annual Membership', collector: 'Sneha Kulkarni', promiseDate: '2026-09-05', promiseAmount: 1200000, status: 'Active' },
    { id: 'AR-805', customer: 'Kalyani Exports Pune', invoiceNo: 'INV-EP-4610', invoiceDate: '2026-05-01', dueDate: '2026-06-01', totalAmount: 680000, paidAmount: 0, outstanding: 680000, agingBucket: '61–90 DAYS', gallery: 'Pune Central', service: 'VIP Delegations', collector: 'Rajesh Varma', promiseDate: '2026-08-27', promiseAmount: 350000, status: 'Promise Pending' }
  ],
  // 8. ACCOUNTS PAYABLE (AP) & VENDOR INVOICES
  payables: [
    { id: 'AP-901', vendor: 'Amazon Web Services India', billNo: 'AWS-AUG-441', billDate: '2026-08-15', dueDate: '2026-08-25', amount: 345000, category: 'Software & IT', priority: 'High', paymentSchedule: 'Due Today', status: 'Scheduled' },
    { id: 'AP-902', vendor: 'DLF Cyber Properties Ltd (Pune Lease)', billNo: 'RENT-PUNE-08', billDate: '2026-08-01', dueDate: '2026-08-05', amount: 350000, category: 'Rent & Lease', priority: 'Critical', paymentSchedule: 'Overdue (20d)', status: 'Approved' },
    { id: 'AP-903', vendor: 'Google India Digital Services', billNo: 'GGL-ADS-991', billDate: '2026-08-20', dueDate: '2026-08-30', amount: 680000, category: 'Digital Marketing', priority: 'High', paymentSchedule: 'Next 5 Days', status: 'Pending Review' },
    { id: 'AP-904', vendor: 'Dell Technologies India', billNo: 'DELL-PO-3301', billDate: '2026-08-12', dueDate: '2026-08-27', amount: 1450000, category: 'Fixed Assets', priority: 'Medium', paymentSchedule: 'In 2 Days', status: 'Approved' },
    { id: 'AP-905', vendor: 'Tata Power Electricity Mumbai', billNo: 'TP-MUM-892', billDate: '2026-08-18', dueDate: '2026-08-28', amount: 84500, category: 'Office Utilities', priority: 'Normal', paymentSchedule: 'In 3 Days', status: 'Scheduled' }
  ],
  // 9. BANK ACCOUNTS & TRANSACTIONS
  banks: [
    { id: 'BNK-1', bankName: 'HDFC Bank Corporate', accountNo: '50200049281011', accountType: 'Current Account', branch: 'Senapati Bapat Road, Pune', ifsc: 'HDFC0000103', openingBal: 22400000, closingBal: 24500000, unmatchedCount: 8, lastReconciled: '2026-08-24' },
    { id: 'BNK-2', bankName: 'ICICI Bank Operational', accountNo: '003905018921', accountType: 'Current Account', branch: 'Nariman Point, Mumbai', ifsc: 'ICIC0000039', openingBal: 4800000, closingBal: 5300000, unmatchedCount: 4, lastReconciled: '2026-08-23' },
    { id: 'BNK-3', bankName: 'State Bank of India (Tax Escrow)', accountNo: '33491829012', accountType: 'Escrow Account', branch: 'Main Branch, Pune', ifsc: 'SBIN0000454', openingBal: 1200000, closingBal: 1500000, unmatchedCount: 0, lastReconciled: '2026-08-25' }
  ],
  bankTransactions: [
    { id: 'BT-101', bank: 'HDFC Corporate', date: '2026-08-25', description: 'NEFT CR-ADITYA ENT-EPAY-8821', type: 'Credit', amount: 850000, matched: true, matchedVoucher: 'JV-2026-0801', status: 'Reconciled' },
    { id: 'BT-102', bank: 'HDFC Corporate', date: '2026-08-25', description: 'RAZORPAY POS SETTLEMENT 24-AUG', type: 'Credit', amount: 482000, matched: false, matchedVoucher: '', status: 'Unmatched' },
    { id: 'BT-103', bank: 'HDFC Corporate', date: '2026-08-24', description: 'ACH DR-AWS CLOUD SERVICES MUMBAI', type: 'Debit', amount: 112400, matched: true, matchedVoucher: 'JV-2026-0802', status: 'Reconciled' },
    { id: 'BT-104', bank: 'ICICI Operational', date: '2026-08-24', description: 'UPI-MUMBAI-GALLERY-COLLECTION', type: 'Credit', amount: 184500, matched: false, matchedVoucher: '', status: 'Unmatched' }
  ],
  // 10. GALLERY DAILY CLOSING & CASH SETTLEMENTS
  galleryClosings: [
    { id: 'GDC-PUNE-0824', gallery: 'Pune Central', date: '2026-08-24', manager: 'Priya Sharma', openingCash: 50000, cashCollected: 245000, upiCollected: 480000, cardCollected: 310000, gatewayCollected: 150000, cashExpenses: 12500, refunds: 5000, expectedCash: 277500, actualCash: 277000, diff: -500, status: 'Approved with Shortage Note' },
    { id: 'GDC-MUM-0824', gallery: 'Mumbai East', date: '2026-08-24', manager: 'Rajesh Varma', openingCash: 75000, cashCollected: 380000, upiCollected: 620000, cardCollected: 490000, gatewayCollected: 220000, cashExpenses: 18000, refunds: 0, expectedCash: 437000, actualCash: 437000, diff: 0, status: 'Perfect Match Reconciled' },
    { id: 'GDC-NSK-0824', gallery: 'Nashik North', date: '2026-08-24', manager: 'Amit Shinde', openingCash: 30000, cashCollected: 120000, upiCollected: 195000, cardCollected: 85000, gatewayCollected: 60000, cashExpenses: 4500, refunds: 2000, expectedCash: 143500, actualCash: 143500, diff: 0, status: 'Reconciled' },
    { id: 'GDC-NGP-0824', gallery: 'Nagpur Central', date: '2026-08-24', manager: 'Vandana Joshi', openingCash: 40000, cashCollected: 95000, upiCollected: 140000, cardCollected: 65000, gatewayCollected: 45000, cashExpenses: 8200, refunds: 0, expectedCash: 126800, actualCash: 126000, diff: -800, status: 'Investigation Flag' }
  ],
  // 11. EXPENSE REGISTER (Comprehensive 24+ main categories)
  expenses: [
    { id: 'EXP-401', voucherNo: 'VCH-EXP-0825', date: '2026-08-25', vendor: 'Google India Pvt Ltd', category: 'Digital Marketing & Boosting', subcategory: 'Meta & Google Ads Campaign', amount: 450000, taxable: 381355, gst: 68645, paymentMode: 'HDFC Corporate Bank', gallery: 'Company-Wide', office: 'HQ', dept: 'Marketing', costCentre: 'Performance Ads', purpose: 'Q3 Luxury Vacation Boosting & Lead Gen', status: 'Approved', paidStatus: 'Paid' },
    { id: 'EXP-402', voucherNo: 'VCH-EXP-0824', date: '2026-08-24', vendor: 'DLF Cyber Real Estate', category: 'Rent & Lease', subcategory: 'Gallery Monthly Lease', amount: 350000, taxable: 296610, gst: 53390, paymentMode: 'HDFC Bank NEFT', gallery: 'Pune Central', office: 'Pune Central Gallery', dept: 'Operations', costCentre: 'Pune Gallery Rent', purpose: 'August 2026 Commercial Space Rent', status: 'Approved', paidStatus: 'Paid' },
    { id: 'EXP-403', voucherNo: 'VCH-EXP-0823', date: '2026-08-23', vendor: 'Staff Payroll Disbursal', category: 'Salary & Payroll', subcategory: 'August Base Salary + Incentives', amount: 8250000, taxable: 8250000, gst: 0, paymentMode: 'HDFC Batch CMS', gallery: 'All Galleries', office: 'All Offices', dept: 'Human Resources', costCentre: 'Payroll Total', purpose: 'Monthly Salary for 124 Employees & Gallery Staff', status: 'Pending CFO Approval', paidStatus: 'Scheduled' },
    { id: 'EXP-404', voucherNo: 'VCH-EXP-0822', date: '2026-08-22', vendor: 'Akshaya Patra Foundation', category: 'Charity & CSR', subcategory: 'Education & Nutrition Sponsorship', amount: 250000, taxable: 250000, gst: 0, paymentMode: 'HDFC Direct Transfer', gallery: 'Company-Wide', office: 'HQ', dept: 'CSR', costCentre: 'CSR Giving', purpose: 'Community Midday Meal Program (80G Exemption)', status: 'Approved', paidStatus: 'Paid' },
    { id: 'EXP-405', voucherNo: 'VCH-EXP-0821', date: '2026-08-21', vendor: 'Dell Technologies India', category: 'Assets & Capital Equipment', subcategory: 'Core i7 Executive Laptops (10 units)', amount: 850000, taxable: 720338, gst: 129662, paymentMode: 'ICICI Bank RTGS', gallery: 'HQ', office: 'HQ Corporate', dept: 'Technology', costCentre: 'Hardware CapEx', purpose: 'New joiner developer & finance team hardware', status: 'Approved', paidStatus: 'Paid' },
    { id: 'EXP-406', voucherNo: 'VCH-EXP-0820', date: '2026-08-20', vendor: 'Instagram Influencer Media Corp', category: 'Social Media & Influencer Marketing', subcategory: 'Travel Vloggers Campaign', amount: 280000, taxable: 237288, gst: 42712, paymentMode: 'HDFC Bank', gallery: 'Company-Wide', office: 'HQ', dept: 'Marketing', costCentre: 'Brand Marketing', purpose: 'Goa & Dubai luxury package reel promotion series', status: 'Approved', paidStatus: 'Paid' }
  ],
  // 12. MARKETING & BOOSTING FINANCE
  marketingCampaigns: [
    { id: 'MKT-01', name: 'Festive Luxury Dubai & Bali Tour Booster', platform: 'Meta Ads (Facebook & IG)', adAccount: 'ACT-EPAY-META-01', budget: 1000000, spent: 785000, leads: 1420, qualifiedLeads: 480, conversions: 84, revenue: 4200000, cac: 9345, roi: 435.0, status: 'Active (78.5% Budget Spent)' },
    { id: 'MKT-02', name: 'Google Search High Intent Visa Processing', platform: 'Google Search Ads', adAccount: 'ACT-EPAY-GGL-02', budget: 600000, spent: 540000, leads: 980, qualifiedLeads: 620, conversions: 210, revenue: 2100000, cac: 2571, roi: 288.8, status: 'Alert: 90% Budget Reached' },
    { id: 'MKT-03', name: 'Local Maharashtra Gallery Walk-in Promotion', platform: 'Local Print, Radio & Meta', adAccount: 'ACT-EPAY-LOCAL-03', budget: 400000, spent: 395000, leads: 420, qualifiedLeads: 180, conversions: 52, revenue: 1850000, cac: 7596, roi: 368.3, status: 'Budget Fully Utilized' },
    { id: 'MKT-04', name: 'YouTube & Travel Influencer Series', platform: 'YouTube / Influencer', adAccount: 'ACT-EPAY-YT-04', budget: 500000, spent: 280000, leads: 610, qualifiedLeads: 210, conversions: 38, revenue: 1520000, cac: 7368, roi: 442.8, status: 'Active' }
  ],
  // 13. SALARY & HRMS FINANCE INTEGRATION
  salarySummary: [
    { gallery: 'Pune Central', headcount: 38, grossSalary: 2850000, pf: 185000, tds: 124000, netDisbursed: 2541000, galleryRevenue: 14850000, salaryRatio: 17.1, status: 'Approved' },
    { gallery: 'Mumbai East', headcount: 44, grossSalary: 3450000, pf: 220000, tds: 182000, netDisbursed: 3048000, galleryRevenue: 18200000, salaryRatio: 18.9, status: 'Approved' },
    { gallery: 'Nashik North', headcount: 22, grossSalary: 1200000, pf: 78000, tds: 45000, netDisbursed: 1077000, galleryRevenue: 6400000, salaryRatio: 18.7, status: 'Approved' },
    { gallery: 'Nagpur Central', headcount: 20, grossSalary: 750000, pf: 48000, tds: 28000, netDisbursed: 674000, galleryRevenue: 4800000, salaryRatio: 15.6, status: 'Pending Review' }
  ],
  // 14. RENT & LEASE ASSET MASTER
  leases: [
    { id: 'LSE-01', propertyName: 'DLF Cyber City Building 4, Pune', unit: 'Ground & 1st Floor Gallery (6,000 sq ft)', landlord: 'DLF Commercial Estates', monthlyRent: 350000, deposit: 2100000, gstRate: 18, rentDueDay: '5th of Month', leaseStart: '2024-04-01', leaseEnd: '2029-03-31', renewalNotice: '90 Days Before', escalationClause: '5% Annual Escalation in April', status: 'Active' },
    { id: 'LSE-02', propertyName: 'Bandra Kurla Complex Tower B, Mumbai', unit: 'Suite 204 Gallery (8,500 sq ft)', landlord: 'BKC Plaza Holdings', monthlyRent: 650000, deposit: 3900000, gstRate: 18, rentDueDay: '1st of Month', leaseStart: '2023-10-01', leaseEnd: '2028-09-30', renewalNotice: '120 Days Before', escalationClause: '7% Biennial Escalation', status: 'Active' },
    { id: 'LSE-03', propertyName: 'Nashik City Mall commercial wing', unit: 'Showroom 12 (3,200 sq ft)', landlord: 'Nashik Realties Pvt Ltd', monthlyRent: 140000, deposit: 840000, gstRate: 18, rentDueDay: '7th of Month', leaseStart: '2025-01-01', leaseEnd: '2028-12-31', renewalNotice: '60 Days Before', escalationClause: '5% Annual Escalation', status: 'Active' }
  ],
  // 15. FIXED ASSETS REGISTER & LIFECYCLE
  assets: [
    { id: 'AST-1001', name: 'Dell PowerEdge R750 Enterprise Server', category: 'IT Infrastructure', serialNo: 'DELL-SRV-9921', purchaseDate: '2024-02-15', purchasePrice: 1250000, vendor: 'Dell India', gallery: 'HQ', dept: 'Technology', custodian: 'Vikram Singh', depreciationMethod: 'SLM 33.33%', accumulatedDep: 624500, bookValue: 625500, status: 'In Use - Verified' },
    { id: 'AST-1002', name: 'Digital Video Wall Display (Pune Gallery)', category: 'Gallery Display Electronics', serialNo: 'SAMS-VW-4810', purchaseDate: '2024-05-10', purchasePrice: 1850000, vendor: 'Samsung India B2B', gallery: 'Pune Central', dept: 'Retail Ops', custodian: 'Priya Sharma', depreciationMethod: 'SLM 20%', accumulatedDep: 462500, bookValue: 1387500, status: 'In Use - Verified' },
    { id: 'AST-1003', name: 'Smart POS Terminals Batch (50 Units)', category: 'POS Hardware', serialNo: 'POS-EP-501-550', purchaseDate: '2025-01-18', purchasePrice: 1450000, vendor: 'Pine Labs Corp', gallery: 'Company-Wide', dept: 'Operations', custodian: 'Rohan Joshi', depreciationMethod: 'SLM 25%', accumulatedDep: 226500, bookValue: 1223500, status: 'Active In Deployment' }
  ],
  // 16. CHARITY & CSR PROJECTS
  charity: [
    { id: 'CSR-01', organization: 'Akshaya Patra Foundation', purpose: 'School Student Midday Meal Program in Maharashtra rural districts', amount: 500000, csrCategory: 'Eradicating Hunger & Malnutrition', approvalDate: '2026-08-10', receiptNo: '80G-AKSH-8841', taxDeduction: '50% u/s 80G', status: 'Completed & Certified' },
    { id: 'CSR-02', organization: 'Teach for India Pune Chapter', purpose: 'Digital Literacy & Computer Lab Setup in Pune Government School', amount: 350000, csrCategory: 'Promoting Quality Education', approvalDate: '2026-08-18', receiptNo: '80G-TFI-4412', taxDeduction: '50% u/s 80G', status: 'Payment Disbursed' },
    { id: 'CSR-03', organization: 'Tata Memorial Cancer Care Relief', purpose: 'Financial aid fund for underprivileged pediatric patients', amount: 400000, csrCategory: 'Healthcare & Preventive Care', approvalDate: '2026-08-22', receiptNo: '80G-TMC-9901', taxDeduction: '50% u/s 80G', status: 'Approved by Management' }
  ],
  // 17. GALLERY PROFITABILITY & RANKING
  galleryProfitability: [
    { rank: 1, gallery: 'Pune Central', revenue: 14850000, salary: 2541000, rent: 350000, marketing: 950000, utilities: 84000, otherExpenses: 210000, directCost: 6500000, netProfit: 4215000, margin: 28.4, status: '⭐ Top Performer' },
    { rank: 2, gallery: 'Mumbai East', revenue: 18200000, salary: 3048000, rent: 650000, marketing: 1400000, utilities: 120000, otherExpenses: 340000, directCost: 8500000, netProfit: 4142000, margin: 22.8, status: 'High Volume' },
    { rank: 3, gallery: 'Nashik North', revenue: 6400000, salary: 1077000, rent: 140000, marketing: 380000, utilities: 45000, otherExpenses: 95000, directCost: 3200000, netProfit: 1463000, margin: 22.8, status: 'High Efficiency' },
    { rank: 4, gallery: 'Nagpur Central', revenue: 4800000, salary: 674000, rent: 120000, marketing: 290000, utilities: 38000, otherExpenses: 82000, directCost: 2800000, netProfit: 796000, margin: 16.6, status: 'Growth Target' }
  ],
  // 18. BUDGET VS ACTUALS
  budgets: [
    { category: 'Employee Salaries & Benefits', allocatedBudget: 5000000, actualSpent: 4820000, variance: -180000, percentUsed: 96.4, status: 'Within Budget' },
    { category: 'Digital Marketing & Ads Boosting', allocatedBudget: 1500000, actualSpent: 1850000, variance: 350000, percentUsed: 123.3, status: 'Over Budget Alert' },
    { category: 'Commercial Property Lease', allocatedBudget: 1200000, actualSpent: 1140000, variance: -60000, percentUsed: 95.0, status: 'Within Budget' },
    { category: 'Software, Cloud & IT Servers', allocatedBudget: 400000, actualSpent: 395000, variance: -5000, percentUsed: 98.8, status: 'Within Budget' },
    { category: 'Corporate CSR & Charity (80G)', allocatedBudget: 300000, actualSpent: 250000, variance: -50000, percentUsed: 83.3, status: 'Within Budget' }
  ],
  // 19. GST & STATUTORY COMPLIANCE
  gstCompliance: [
    { returnType: 'GSTR-1 (Outward Sales)', period: 'July 2026', turnoverReported: 18450000, gstLiability: 3321000, dueDate: '2026-08-11', status: 'Filed & Acknowledged', ackNo: 'AA2707260948123' },
    { returnType: 'GSTR-3B (Summary Return)', period: 'July 2026', turnoverReported: 18450000, gstLiability: 2081000, dueDate: '2026-08-20', status: 'Filed & Paid', ackNo: 'AA2707261198421' },
    { returnType: 'GSTR-2B (ITC Match Auto)', period: 'July 2026', totalInvoices: 342, matchedITC: 1240000, dueDate: '2026-08-14', status: 'Reconciled 98.4%', ackNo: '2B-RECON-2026-07' },
    { returnType: 'TDS Return 26Q (Vendors)', period: 'Q1 FY 26-27', totalInvoices: 88, matchedITC: 480000, dueDate: '2026-07-31', status: 'Filed & Challaned', ackNo: 'TDS-26Q-990142' }
  ],
  // 20. AUDIT LOGS
  auditLogs: [
    { id: 'AUD-901', user: 'Anil Deshmukh (CFO)', action: 'Locked Period: July 2026 Financials', date: '2026-08-01 18:30:00', ip: '192.168.1.45', purpose: 'Statutory Month Closing' },
    { id: 'AUD-902', user: 'Vivek Patil (CEO)', action: 'Approved High Value Capex PO #DELL-PO-3301', date: '2026-08-24 16:45:00', ip: '192.168.1.10', purpose: 'Executive Authorization' },
    { id: 'AUD-903', user: 'Rohan Joshi', action: 'Created Journal Voucher JV-2026-0801', date: '2026-08-24 14:10:00', ip: '192.168.1.62', purpose: 'B2B Customer Settlement Posting' }
  ]
});

export default function FinancePage() {
  const [db, setDb] = useState(defaultFinanceDb());
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [activeToast, setActiveToast] = useState(null);
  const [activeStatementTab, setActiveStatementTab] = useState('pnl');
  const [selectedLedgerAcc, setSelectedLedgerAcc] = useState('HDFC Corporate Current A/c #9011');
  const [activeReportType, setActiveReportType] = useState(null);
  
  // Generic Edit Modal State
  const [editItem, setEditItem] = useState(null);
  const [editCollection, setEditCollection] = useState('');

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDb(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load finance data', e);
    }
  }, []);

  const saveDb = (updated) => {
    setDb(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save finance data', e);
    }
  };

  const showToast = (message, type = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => setActiveToast(null), 3500);
  };

  // Badge count helpers
  const getBadgeCount = (id) => {
    switch (id) {
      case 'controlCentre':
        return db.controlCenterIssues.length;
      case 'actionRequired':
        return db.tasks.filter(t => t.status === 'Pending').length;
      case 'accountingErrors':
        return db.accountingErrors.length;
      case 'receivables':
      case 'receivableAging':
        return db.receivables.filter(r => r.agingBucket.includes('60') || r.agingBucket.includes('90') || r.agingBucket.includes('180')).length;
      case 'payables':
      case 'payableAging':
        return db.payables.filter(p => p.priority === 'Critical' || p.paymentSchedule === 'Due Today').length;
      case 'banks':
        return db.banks.reduce((acc, b) => acc + b.unmatchedCount, 0);
      case 'galleryClosing':
        return db.galleryClosings.filter(g => g.diff !== 0).length;
      case 'marketingFinance':
      case 'promotionsFinance':
        return db.marketingCampaigns.filter(m => m.status.includes('Alert') || m.status.includes('Utilized')).length;
      default:
        return 0;
    }
  };

  // Navigation menu organized into 10 major groups with 37 modules
  const navSections = [
    {
      group: 'COMMAND & CONTROL',
      items: [
        { id: 'dashboard', label: '1. Finance Dashboard', icon: 'fa-chart-pie' },
        { id: 'controlCentre', label: '2. Finance Control Centre', icon: 'fa-tower-broadcast' },
        { id: 'actionRequired', label: '3. Finance Action Centre', icon: 'fa-list-check' },
        { id: 'cfoCommandView', label: '4. CFO Command View', icon: 'fa-user-tie' },
        { id: 'ceoCommandView', label: '5. CEO Financial View', icon: 'fa-crown' }
      ]
    },
    {
      group: 'CORE ACCOUNTING & LEDGER',
      items: [
        { id: 'chartOfAccounts', label: '6. Chart of Accounts', icon: 'fa-sitemap' },
        { id: 'doubleEntry', label: '7. Double-Entry Engine', icon: 'fa-scale-balanced' },
        { id: 'accountingErrors', label: '8. Accounting Error Centre', icon: 'fa-triangle-exclamation' },
        { id: 'generalLedger', label: '9. General Ledger', icon: 'fa-book-bookmark' },
        { id: 'trialBalance', label: '10. Trial Balance', icon: 'fa-scale-unbalanced' },
        { id: 'financialStatements', label: '11. Financial Statements (P&L)', icon: 'fa-file-invoice-dollar' }
      ]
    },
    {
      group: 'RECEIVABLES & PAYABLES (AR / AP)',
      items: [
        { id: 'receivables', label: '12. Accounts Receivable (AR)', icon: 'fa-hand-holding-dollar' },
        { id: 'receivableAging', label: '13. Receivable Aging', icon: 'fa-hourglass-half' },
        { id: 'collectionManagement', label: '14. Collections & Promises', icon: 'fa-phone-volume' },
        { id: 'payables', label: '15. Accounts Payable (AP)', icon: 'fa-money-bill-transfer' },
        { id: 'payableAging', label: '16. Payable Aging', icon: 'fa-clock-rotate-left' }
      ]
    },
    {
      group: 'BANK, CASH & SETTLEMENTS',
      items: [
        { id: 'banks', label: '17. Bank Management & Rec', icon: 'fa-building-columns' },
        { id: 'cashManagement', label: '18. Cash & Petty Cash', icon: 'fa-vault' },
        { id: 'galleryClosing', label: '19. Gallery Daily Closing', icon: 'fa-store' },
        { id: 'paymentGateway', label: '20. Gateway Reconcile', icon: 'fa-credit-card' },
        { id: 'exceptionCentre', label: '21. Transaction Exceptions', icon: 'fa-shield-halved' }
      ]
    },
    {
      group: 'EXPENSES, SALARY & OPERATIONS',
      items: [
        { id: 'expenses', label: '22. Expense Management', icon: 'fa-receipt' },
        { id: 'salaryFinance', label: '23. Salary & Payroll Finance', icon: 'fa-users-gear' },
        { id: 'rentLease', label: '24. Rent & Lease Finance', icon: 'fa-building' },
        { id: 'officeFinance', label: '25. Office & HQ Expenses', icon: 'fa-briefcase' }
      ]
    },
    {
      group: 'MARKETING & GROWTH FINANCE',
      items: [
        { id: 'marketingFinance', label: '26. Marketing & Ads Boosting', icon: 'fa-bullhorn' },
        { id: 'promotionsFinance', label: '27. Promotion & ROI Engine', icon: 'fa-chart-line' }
      ]
    },
    {
      group: 'ASSETS, CSR & PROFITABILITY',
      items: [
        { id: 'assetManagement', label: '28. Fixed Asset Register', icon: 'fa-boxes-stacked' },
        { id: 'charityCsr', label: '29. Charity & CSR (80G)', icon: 'fa-hand-holding-heart' },
        { id: 'profitability', label: '30. Gallery & Service P&L', icon: 'fa-trophy' }
      ]
    },
    {
      group: 'BUDGET, FORECAST & TAX',
      items: [
        { id: 'budgets', label: '31. Budget vs Actuals', icon: 'fa-calculator' },
        { id: 'forecasting', label: '32. Cash Flow Forecasting', icon: 'fa-crystal-ball' },
        { id: 'gstTax', label: '33. GST & Tax Compliance', icon: 'fa-stamp' }
      ]
    },
    {
      group: 'GOVERNANCE, AUDIT & REPORTS',
      items: [
        { id: 'financialControls', label: '34. Controls & Period Lock', icon: 'fa-lock' },
        { id: 'closingChecklist', label: '35. Daily & Month Closing', icon: 'fa-calendar-check' },
        { id: 'auditExport', label: '36. Audit Package Generator', icon: 'fa-file-shield' },
        { id: 'reportCentre', label: '37. Finance Report Centre', icon: 'fa-print' }
      ]
    }
  ];

  // Actions
  const handleAddJournal = (e) => {
    e.preventDefault();
    const form = e.target;
    const debit = parseFloat(form.debitAmount.value);
    const credit = parseFloat(form.creditAmount.value);

    if (debit !== credit) {
      showToast('Error: Unbalanced Journal! Debit must equal Credit.', 'error');
      return;
    }

    const newJournal = {
      id: 'JV-2026-' + Math.floor(1000 + Math.random() * 9000),
      date: form.date.value,
      voucherType: form.voucherType.value,
      reference: form.reference.value || 'REF-' + Math.floor(10000 + Math.random() * 90000),
      debitAcc: form.debitAcc.value,
      creditAcc: form.creditAcc.value,
      debitAmount: debit,
      creditAmount: credit,
      costCentre: form.costCentre.value,
      gallery: form.gallery.value,
      dept: form.dept.value,
      narration: form.narration.value,
      postedBy: db.user.name,
      approvedBy: 'Auto-Balanced / CFO Verified',
      status: 'Posted'
    };

    saveDb({
      ...db,
      journals: [newJournal, ...db.journals]
    });
    showToast('Balanced Journal Voucher created & ledger updated!', 'success');
    setActiveModal(null);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const form = e.target;
    const amt = parseFloat(form.amount.value);
    const gstRate = parseFloat(form.gstRate.value || '18');
    const taxable = Math.round(amt / (1 + gstRate / 100));
    const gst = amt - taxable;

    const newExp = {
      id: 'EXP-' + Math.floor(1000 + Math.random() * 9000),
      voucherNo: 'VCH-EXP-' + Math.floor(10000 + Math.random() * 90000),
      date: form.date.value,
      vendor: form.vendor.value,
      category: form.category.value,
      subcategory: form.subcategory?.value || form.category.value,
      amount: amt,
      taxable,
      gst,
      paymentMode: form.paymentMode.value,
      gallery: form.gallery.value,
      office: form.office.value,
      dept: form.dept.value,
      costCentre: form.costCentre.value,
      purpose: form.purpose.value,
      status: 'Approved',
      paidStatus: 'Scheduled'
    };

    saveDb({
      ...db,
      expenses: [newExp, ...db.expenses],
      kpi: {
        ...db.kpi,
        monthlyExpenses: db.kpi.monthlyExpenses + amt
      }
    });
    showToast('Expense Voucher registered and queued for payout!', 'success');
    setActiveModal(null);
  };

  const handleAddInvoice = (e) => {
    e.preventDefault();
    const form = e.target;
    const tot = parseFloat(form.totalAmount.value);

    const newInv = {
      id: 'AR-' + Math.floor(1000 + Math.random() * 9000),
      customer: form.customer.value,
      invoiceNo: 'INV-EP-' + Math.floor(10000 + Math.random() * 90000),
      invoiceDate: form.invoiceDate.value,
      dueDate: form.dueDate.value,
      totalAmount: tot,
      paidAmount: 0,
      outstanding: tot,
      agingBucket: 'CURRENT',
      gallery: form.gallery.value,
      service: form.service.value,
      collector: db.user.name,
      promiseDate: '',
      promiseAmount: 0,
      status: 'Active'
    };

    saveDb({
      ...db,
      receivables: [newInv, ...db.receivables],
      kpi: {
        ...db.kpi,
        accountsReceivable: db.kpi.accountsReceivable + tot
      }
    });
    showToast('Customer Sales Invoice generated successfully!', 'success');
    setActiveModal(null);
  };

  const handleAddPayable = (e) => {
    e.preventDefault();
    const form = e.target;
    const amt = parseFloat(form.amount.value);

    const newPayable = {
      id: 'AP-' + Math.floor(1000 + Math.random() * 9000),
      vendor: form.vendor.value,
      billNo: form.billNo.value,
      billDate: form.billDate.value,
      dueDate: form.dueDate.value,
      amount: amt,
      category: form.category.value,
      priority: form.priority.value,
      paymentSchedule: 'Due in 7 Days',
      status: 'Approved'
    };

    saveDb({
      ...db,
      payables: [newPayable, ...db.payables],
      kpi: {
        ...db.kpi,
        accountsPayable: db.kpi.accountsPayable + amt
      }
    });
    showToast('Vendor Purchase Bill registered in Accounts Payable!', 'success');
    setActiveModal(null);
  };

  const handleAddAccountCode = (e) => {
    e.preventDefault();
    const form = e.target;
    const newAcc = {
      code: form.code.value,
      name: form.name.value,
      type: form.type.value,
      parent: form.parent.value || 'ROOT',
      balance: parseFloat(form.balance.value) || 0,
      status: 'Active'
    };

    saveDb({
      ...db,
      chartOfAccounts: [...db.chartOfAccounts, newAcc]
    });
    showToast(`Account Code ${newAcc.code} - ${newAcc.name} added to Chart of Accounts!`, 'success');
    setActiveModal(null);
  };

  const handleAddAsset = (e) => {
    e.preventDefault();
    const form = e.target;
    const cost = parseFloat(form.purchasePrice.value) || 50000;
    const newAsset = {
      id: 'AST-' + Math.floor(1000 + Math.random() * 9000),
      name: form.name.value,
      category: form.category.value,
      serialNo: form.serialNo.value,
      purchaseDate: form.purchaseDate.value,
      purchasePrice: cost,
      vendor: form.vendor.value,
      gallery: form.gallery.value,
      dept: form.dept.value,
      custodian: form.custodian.value,
      depreciationMethod: form.depreciationMethod.value,
      accumulatedDep: 0,
      bookValue: cost,
      status: 'Active - Capitalized'
    };

    saveDb({
      ...db,
      assets: [newAsset, ...db.assets]
    });
    showToast(`Fixed Asset ${newAsset.name} capitalized into registry!`, 'success');
    setActiveModal(null);
  };

  const handleAddLease = (e) => {
    e.preventDefault();
    const form = e.target;
    const rent = parseFloat(form.monthlyRent.value) || 100000;
    const dep = parseFloat(form.deposit.value) || 500000;

    const newLease = {
      id: 'LSE-' + Math.floor(10 + Math.random() * 90),
      propertyName: form.propertyName.value,
      unit: form.unit.value,
      landlord: form.landlord.value,
      monthlyRent: rent,
      deposit: dep,
      gstRate: 18,
      rentDueDay: form.rentDueDay.value,
      leaseStart: form.leaseStart.value,
      leaseEnd: form.leaseEnd.value,
      renewalNotice: '90 Days Before',
      escalationClause: form.escalationClause.value,
      status: 'Active'
    };

    saveDb({
      ...db,
      leases: [newLease, ...db.leases]
    });
    showToast(`Commercial property lease for ${newLease.propertyName} registered!`, 'success');
    setActiveModal(null);
  };

  const handleAddCsr = (e) => {
    e.preventDefault();
    const form = e.target;
    const amt = parseFloat(form.amount.value) || 100000;

    const newCsr = {
      id: 'CSR-' + Math.floor(10 + Math.random() * 90),
      organization: form.organization.value,
      purpose: form.purpose.value,
      amount: amt,
      csrCategory: form.csrCategory.value,
      approvalDate: form.approvalDate.value,
      receiptNo: form.receiptNo.value || '80G-' + Math.floor(1000 + Math.random() * 9000),
      taxDeduction: '50% u/s 80G',
      status: 'Approved & Certified'
    };

    saveDb({
      ...db,
      charity: [newCsr, ...db.charity]
    });
    showToast(`CSR Grant of ₹${amt.toLocaleString()} recorded with 80G tax benefit!`, 'success');
    setActiveModal(null);
  };

  const handleAddBudget = (e) => {
    e.preventDefault();
    const form = e.target;
    const budget = parseFloat(form.allocatedBudget.value) || 500000;

    const newBud = {
      category: form.category.value,
      allocatedBudget: budget,
      actualSpent: 0,
      variance: -budget,
      percentUsed: 0,
      status: 'Within Budget'
    };

    saveDb({
      ...db,
      budgets: [...db.budgets, newBud]
    });
    showToast(`Budget allocation set for ${newBud.category}!`, 'success');
    setActiveModal(null);
  };

  const handleAddBank = (e) => {
    e.preventDefault();
    const form = e.target;
    const bal = parseFloat(form.closingBal.value) || 1000000;

    const newBank = {
      id: 'BNK-' + Math.floor(10 + Math.random() * 90),
      bankName: form.bankName.value,
      accountNo: form.accountNo.value,
      accountType: form.accountType.value,
      branch: form.branch.value,
      ifsc: form.ifsc.value,
      openingBal: bal,
      closingBal: bal,
      unmatchedCount: 0,
      lastReconciled: new Date().toISOString().slice(0, 10)
    };

    saveDb({
      ...db,
      banks: [...db.banks, newBank]
    });
    showToast(`Bank account ${newBank.bankName} added to treasury!`, 'success');
    setActiveModal(null);
  };

  // Generic Edit Handler
  const openEditModal = (collectionName, item) => {
    setEditCollection(collectionName);
    setEditItem(item);
    setActiveModal('generic_edit');
  };

  const handleSaveGenericEdit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedItem = { ...editItem };

    // Update fields dynamically from form
    Array.from(form.elements).forEach(elem => {
      if (elem.name && elem.name !== 'submit') {
        const val = elem.value;
        if (!isNaN(val) && val !== '' && !elem.name.toLowerCase().includes('date') && !elem.name.toLowerCase().includes('no') && !elem.name.toLowerCase().includes('id') && !elem.name.toLowerCase().includes('phone')) {
          updatedItem[elem.name] = parseFloat(val);
        } else {
          updatedItem[elem.name] = val;
        }
      }
    });

    const currentList = db[editCollection] || [];
    const updatedList = currentList.map(i => (i.id === editItem.id || i.code === editItem.code || i.category === editItem.category) ? updatedItem : i);

    saveDb({
      ...db,
      [editCollection]: updatedList
    });

    showToast(`Updated record in ${editCollection} successfully!`, 'success');
    setActiveModal(null);
    setEditItem(null);
  };

  const handleTaskAction = (taskId, action) => {
    const updated = db.tasks.map(t => t.id === taskId ? { ...t, status: action } : t);
    saveDb({ ...db, tasks: updated });
    showToast(`Action ${taskId} marked as ${action}!`, 'info');
  };

  const openReportViewer = (reportType) => {
    setActiveReportType(reportType);
    setActiveModal('report_viewer');
  };

  const handleGenerateAuditPackage = () => {
    openReportViewer('COMPREHENSIVE_AUDIT_PACKAGE');
  };

  return (
    <>
      <style jsx>{`
        .finance-wrapper {
          display: flex;
          min-height: 100vh;
          background: #f0fdf4;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #1f2937;
        }
        .sidebar {
          width: 280px;
          background: #064e3b;
          color: #d1fae5;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
        }
        .brand {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-logo {
          width: 36px;
          height: 36px;
          background: #059669;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: #fff;
          font-size: 16px;
        }
        .nav-group-title {
          padding: 16px 20px 6px;
          font-size: 10px;
          font-weight: 700;
          color: #a7f3d0;
          letter-spacing: 0.8px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 20px;
          font-size: 12.5px;
          color: #d1fae5;
          cursor: pointer;
          transition: all 0.15s;
          user-select: none;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }
        .nav-link.active {
          background: #059669;
          color: #fff;
          font-weight: 600;
        }
        .nav-badge {
          margin-left: auto;
          background: #ef4444;
          color: #fff;
          padding: 2px 7px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          height: 100vh;
          overflow-y: auto;
        }
        .topbar {
          background: #fff;
          border-bottom: 1px solid #d1fae5;
          padding: 12px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .content-area {
          padding: 24px 28px;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }
        .kpi-card {
          background: #fff;
          border: 1px solid #d1fae5;
          border-radius: 12px;
          padding: 14px 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          transition: transform 0.15s;
        }
        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.1);
        }
        .kpi-label {
          font-size: 11.5px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .kpi-val {
          font-size: 20px;
          font-weight: 800;
          color: #064e3b;
        }
        .kpi-sub {
          font-size: 11px;
          margin-top: 4px;
          font-weight: 600;
        }
        .kpi-sub.green { color: #059669; }
        .kpi-sub.red { color: #dc2626; }
        .kpi-sub.orange { color: #d97706; }
        .table-wrap {
          background: #fff;
          border: 1px solid #d1fae5;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
          margin-bottom: 24px;
        }
        .table-header {
          padding: 16px 20px;
          border-bottom: 1px solid #d1fae5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fcfdfc;
        }
        .table-header h3 {
          font-size: 15px;
          font-weight: 700;
          color: #064e3b;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
        }
        th {
          background: #ecfdf5;
          color: #064e3b;
          text-align: left;
          padding: 11px 16px;
          font-weight: 700;
          border-bottom: 1px solid #d1fae5;
          font-size: 11.5px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        td {
          padding: 12px 16px;
          border-bottom: 1px solid #ecfdf5;
          color: #374151;
        }
        tr:hover td {
          background: #f0fdf4;
        }
        .badge-status {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 14px;
          font-size: 11px;
          font-weight: 700;
        }
        .badge-status.active { background: #dcfce7; color: #065f46; }
        .badge-status.pending { background: #fef3c7; color: #92400e; }
        .badge-status.critical { background: #fee2e2; color: #991b1b; }
        .badge-status.overdue { background: #fee2e2; color: #b91c1c; }
        .badge-status.approved { background: #dcfce7; color: #047857; }
        .badge-status.reconciled { background: #d1fae5; color: #065f46; }
        .badge-status.scheduled { background: #e0f2fe; color: #0369a1; }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s;
        }
        .btn-primary { background: #059669; color: #fff; }
        .btn-primary:hover { background: #047857; }
        .btn-outline { background: transparent; border: 1px solid #d1fae5; color: #064e3b; }
        .btn-outline:hover { background: #ecfdf5; }
        .btn-danger { background: #dc2626; color: #fff; }
        .btn-danger:hover { background: #b91c1c; }
        .btn-sm { padding: 5px 10px; font-size: 11.5px; }
        .btn-xs { padding: 3px 8px; font-size: 10.5px; }
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 12px 20px;
          border-radius: 10px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toast.success { background: #059669; }
        .toast.error { background: #dc2626; }
        .toast.info { background: #2563eb; }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }
        .modal-box {
          background: #fff;
          border-radius: 16px;
          width: 90%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .modal-box.large {
          max-width: 900px;
        }
        .m-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #d1fae5;
          padding-bottom: 14px;
          margin-bottom: 20px;
        }
        .m-header h3 {
          margin: 0;
          font-size: 18px;
          color: #064e3b;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .form-group {
          margin-bottom: 14px;
        }
        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #d1fae5;
          font-size: 13px;
          color: #1f2937;
          background: #fff;
          outline: none;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: #059669;
          box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.1);
        }
        .tabs-header {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid #d1fae5;
          margin-bottom: 16px;
        }
        .tab-btn {
          padding: 8px 18px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
        }
        .tab-btn.active {
          color: #059669;
          border-bottom-color: #059669;
        }
        .report-sheet {
          background: #fff;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 32px;
          font-family: 'Courier New', Courier, monospace;
          color: #111827;
        }
        .report-header-formal {
          text-align: center;
          border-bottom: 2px solid #111827;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="finance-wrapper">
        {/* ============================================================ */}
        {/* SIDEBAR NAVIGATION — 37 COMPLETE MODULES */}
        {/* ============================================================ */}
        <div className="sidebar">
          <div className="brand">
            <div className="brand-logo">eP</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>ePay Finance ERP</div>
              <div style={{ fontSize: 11, color: '#a7f3d0' }}>CFO & Accounts HQ</div>
            </div>
          </div>

          <div style={{ padding: '12px 16px' }}>
            <input
              type="text"
              placeholder="Search 37 modules..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 12px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 12,
                outline: 'none'
              }}
            />
          </div>

          <div style={{ flex: 1, paddingBottom: 24 }}>
            {navSections.map(sec => {
              const visibleItems = sec.items.filter(item =>
                !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (visibleItems.length === 0) return null;

              return (
                <div key={sec.group}>
                  <div className="nav-group-title">{sec.group}</div>
                  {visibleItems.map(item => {
                    const badge = getBadgeCount(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => setCurrentPage(item.id)}
                      >
                        <i className={`fas ${item.icon}`} style={{ width: 16, textAlign: 'center' }}></i>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                        {badge > 0 && <span className="nav-badge">{badge}</span>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* MAIN DISPLAY VIEW */}
        {/* ============================================================ */}
        <div className="main-content">
          {/* TOPBAR */}
          <div className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontWeight: 700, color: '#064e3b', fontSize: 16 }}>
                ePay Digital India Pvt Ltd · Corporate Finance & Ledger
              </div>
              <span className="badge-status active">
                <i className="fas fa-lock" style={{ marginRight: 4 }}></i>
                Period: {db.periodLock.currentPeriod}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="btn btn-sm btn-outline" onClick={() => openReportViewer('PNL_REPORT')}>
                <i className="fas fa-file-pdf"></i> Quick P&L
              </button>
              <button className="btn btn-sm btn-primary" onClick={handleGenerateAuditPackage}>
                <i className="fas fa-download"></i> Audit Dossier
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderLeft: '1px solid #d1fae5', paddingLeft: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                  {db.user.avatar}
                </div>
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: '#064e3b' }}>{db.user.name}</div>
                  <div style={{ fontSize: 10, color: '#6b7280' }}>CFO & Top Management</div>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE CONTENT ROUTING */}
          <div className="content-area">
            {/* 1. FINANCE DASHBOARD */}
            {currentPage === 'dashboard' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-chart-pie"></i> Executive Finance Dashboard</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>25 Real-Time KPIs, Cash Flow & Financial Health Indicators</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-outline" onClick={() => setActiveModal('new_journal')}>
                      <i className="fas fa-plus"></i> New Journal
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_expense')}>
                      <i className="fas fa-receipt"></i> Record Expense
                    </button>
                  </div>
                </div>

                <div className="kpi-grid">
                  <div className="kpi-card"><div className="kpi-label">1. Total Revenue</div><div className="kpi-val">₹{(db.kpi.totalRevenue / 100000).toFixed(2)}L</div><div className="kpi-sub green">+18.4% vs Last Month</div></div>
                  <div className="kpi-card"><div className="kpi-label">2. Today's Revenue</div><div className="kpi-val">₹{(db.kpi.todayRevenue / 1000).toFixed(1)}k</div><div className="kpi-sub green">Across 4 Galleries</div></div>
                  <div className="kpi-card"><div className="kpi-label">3. Monthly Revenue</div><div className="kpi-val">₹{(db.kpi.monthlyRevenue / 100000).toFixed(2)}L</div><div className="kpi-sub green">August 2026 Run Rate</div></div>
                  <div className="kpi-card"><div className="kpi-label">4. Gross Profit</div><div className="kpi-val">₹{(db.kpi.grossProfit / 100000).toFixed(2)}L</div><div className="kpi-sub green">{db.kpi.grossMargin}% Gross Margin</div></div>
                  <div className="kpi-card"><div className="kpi-label">5. Net Profit</div><div className="kpi-val">₹{(db.kpi.netProfit / 100000).toFixed(2)}L</div><div className="kpi-sub green">{db.kpi.netMargin}% Net Margin</div></div>
                  <div className="kpi-card"><div className="kpi-label">6. Total Cash Reserves</div><div className="kpi-val">₹{(db.kpi.totalCash / 100000).toFixed(2)}L</div><div className="kpi-sub green">Bank + Till Reserves</div></div>
                  <div className="kpi-card"><div className="kpi-label">7. Accounts Receivable</div><div className="kpi-val">₹{(db.kpi.accountsReceivable / 100000).toFixed(2)}L</div><div className="kpi-sub orange">DSO: 34 Days</div></div>
                  <div className="kpi-card"><div className="kpi-label">8. Accounts Payable</div><div className="kpi-val">₹{(db.kpi.accountsPayable / 100000).toFixed(2)}L</div><div className="kpi-sub orange">Due in 30 Days</div></div>
                </div>

                {/* QUICK CONTROL OVERVIEW */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="table-wrap">
                    <div className="table-header">
                      <h3><i className="fas fa-bell" style={{ color: '#dc2626' }}></i> Live Action Triggers</h3>
                      <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('actionRequired')}>View All ({db.tasks.length})</button>
                    </div>
                    <table>
                      <thead>
                        <tr><th>Action Item</th><th>Dept</th><th>Amount</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {db.tasks.slice(0, 4).map(t => (
                          <tr key={t.id}>
                            <td><strong>{t.title}</strong></td>
                            <td>{t.dept}</td>
                            <td>₹{t.amount.toLocaleString()}</td>
                            <td><span className={'badge-status ' + (t.status === 'Pending' ? 'pending' : 'active')}>{t.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="table-wrap">
                    <div className="table-header">
                      <h3><i className="fas fa-trophy" style={{ color: '#d97706' }}></i> Top Gallery Profitability</h3>
                      <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('profitability')}>All Galleries</button>
                    </div>
                    <table>
                      <thead>
                        <tr><th>Gallery</th><th>Revenue</th><th>Net Profit</th><th>Margin</th></tr>
                      </thead>
                      <tbody>
                        {db.galleryProfitability.map(g => (
                          <tr key={g.rank}>
                            <td><strong>{g.gallery}</strong></td>
                            <td>₹{(g.revenue / 100000).toFixed(1)}L</td>
                            <td style={{ color: '#059669', fontWeight: 700 }}>₹{(g.netProfit / 100000).toFixed(1)}L</td>
                            <td><span className="badge-status active">{g.margin}%</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. FINANCE CONTROL CENTRE */}
            {currentPage === 'controlCentre' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-tower-broadcast"></i> Live Finance Control Centre</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>System-Wide Red/Amber Warning Matrix & Operational Flags</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => showToast('Ledger anomaly scans refreshed!', 'info')}>
                    <i className="fas fa-rotate"></i> Rescan Anomalies
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Severity</th><th>Anomaly Description</th><th>Module</th><th>Count</th><th>Financial Impact</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {db.controlCenterIssues.map(issue => (
                        <tr key={issue.id}>
                          <td>
                            {issue.severity === 'critical' ? (
                              <span style={{ color: '#dc2626', fontWeight: 700 }}><i className="fas fa-circle-dot"></i> RED ALERT</span>
                            ) : (
                              <span style={{ color: '#d97706', fontWeight: 700 }}><i className="fas fa-triangle-exclamation"></i> AMBER WARN</span>
                            )}
                          </td>
                          <td><strong>{issue.title}</strong></td>
                          <td>{issue.type}</td>
                          <td><span className="badge-status pending">{issue.count} Records</span></td>
                          <td><strong style={{ color: '#064e3b' }}>{issue.amount}</strong></td>
                          <td><span className={'badge-status ' + (issue.severity === 'critical' ? 'critical' : 'pending')}>{issue.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => showToast(`Resolved anomaly: ${issue.title}`, 'success')}>
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

            {/* 3. FINANCE ACTION CENTRE */}
            {currentPage === 'actionRequired' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-list-check"></i> Finance Action Centre</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Priority Approval & Task Queue for CFO & Finance Team</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => showToast('Action queue refreshed!', 'success')}>
                    <i className="fas fa-sync"></i> Refresh Queue
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Task Title</th><th>Type</th><th>Priority</th><th>Amount</th><th>Owner</th><th>Due Date</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {db.tasks.map(t => (
                        <tr key={t.id}>
                          <td><code>{t.id}</code></td>
                          <td><strong>{t.title}</strong></td>
                          <td><span className="badge-status active">{t.type}</span></td>
                          <td>
                            <span className={'badge-status ' + (t.priority === 'Critical' ? 'critical' : t.priority === 'High' ? 'pending' : 'active')}>
                              {t.priority}
                            </span>
                          </td>
                          <td><strong style={{ color: '#059669' }}>₹{t.amount.toLocaleString()}</strong></td>
                          <td>{t.owner} ({t.dept})</td>
                          <td>{t.dueDate}</td>
                          <td>
                            {t.status === 'Pending' ? (
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button className="btn btn-xs btn-primary" onClick={() => handleTaskAction(t.id, 'Approved')}>Approve</button>
                                <button className="btn btn-xs btn-danger" onClick={() => handleTaskAction(t.id, 'Rejected')}>Reject</button>
                              </div>
                            ) : (
                              <span className="badge-status active">{t.status}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. CFO & 5. CEO COMMAND VIEW */}
            {(currentPage === 'cfoCommandView' || currentPage === 'ceoCommandView') && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}>
                      <i className={'fas ' + (currentPage === 'ceoCommandView' ? 'fa-crown' : 'fa-user-tie')}></i> {currentPage === 'ceoCommandView' ? 'CEO Financial Command Cockpit' : 'CFO 360° Operational Cockpit'}
                    </h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Executive Revenue Streams, Profitability, Runway & Critical Approvals</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={handleGenerateAuditPackage}>
                    <i className="fas fa-file-pdf"></i> Board Briefing Deck
                  </button>
                </div>

                <div className="kpi-grid">
                  <div className="kpi-card"><div className="kpi-label">YTD Revenue</div><div className="kpi-val">₹14.85Cr</div><div className="kpi-sub green">+22.1% YoY</div></div>
                  <div className="kpi-card"><div className="kpi-label">Net Profit Margin</div><div className="kpi-val">25.0%</div><div className="kpi-sub green">₹71.2L Net Profit</div></div>
                  <div className="kpi-card"><div className="kpi-label">Liquid Cash Reserves</div><div className="kpi-val">₹3.42Cr</div><div className="kpi-sub green">9 Months Runway</div></div>
                  <div className="kpi-card"><div className="kpi-label">Overdue Receivables Risk</div><div className="kpi-val">₹68.5L</div><div className="kpi-sub red">5 High-Value Alerts</div></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="table-wrap">
                    <div className="table-header">
                      <h3><i className="fas fa-chart-line"></i> Revenue Streams Breakdown</h3>
                    </div>
                    <table>
                      <thead><tr><th>Service Stream</th><th>YTD Revenue</th><th>Margin</th></tr></thead>
                      <tbody>
                        <tr><td><strong>ePay Luxury Travel & Holidays</strong></td><td>₹6.54Cr</td><td><span className="badge-status active">26.7%</span></td></tr>
                        <tr><td><strong>Visa & VIP Fast-Track</strong></td><td>₹3.42Cr</td><td><span className="badge-status active">45.0%</span></td></tr>
                        <tr><td><strong>Digital Gallery Memberships</strong></td><td>₹2.85Cr</td><td><span className="badge-status active">66.7%</span></td></tr>
                        <tr><td><strong>Franchise Royalties & Licensing</strong></td><td>₹2.04Cr</td><td><span className="badge-status active">82.0%</span></td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="table-wrap">
                    <div className="table-header">
                      <h3><i className="fas fa-triangle-exclamation" style={{ color: '#dc2626' }}></i> Executive Approvals Required</h3>
                    </div>
                    <table>
                      <thead><tr><th>Decision / Risk Item</th><th>Exposure</th><th>Status</th></tr></thead>
                      <tbody>
                        <tr><td><strong>Zenith Legal Recovery Notice</strong></td><td>₹12.5L</td><td><span className="badge-status critical">Signoff Needed</span></td></tr>
                        <tr><td><strong>August Staff Salary Batch</strong></td><td>₹82.5L</td><td><span className="badge-status pending">Pending Signoff</span></td></tr>
                        <tr><td><strong>Festive Marketing Budget Override</strong></td><td>₹34.5L</td><td><span className="badge-status pending">Under Review</span></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 6. CHART OF ACCOUNTS */}
            {currentPage === 'chartOfAccounts' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-sitemap"></i> Chart of Accounts (COA) Hierarchy</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Structured Double-Entry Ledger Code Repository & Balances</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_account_code')}>
                    <i className="fas fa-plus"></i> New Account Code
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Account Code</th><th>Account Ledger Title</th><th>Classification Type</th><th>Parent Category</th><th>Current Balance</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {db.chartOfAccounts.map(acc => (
                        <tr key={acc.code} style={{ background: acc.parent === 'ROOT' ? '#f0fdf4' : 'transparent', fontWeight: acc.parent === 'ROOT' ? 700 : 400 }}>
                          <td><code>{acc.code}</code></td>
                          <td>
                            <span style={{ paddingLeft: acc.parent !== 'ROOT' ? 20 : 0 }}>
                              {acc.parent !== 'ROOT' && '↳ '}
                              {acc.name}
                            </span>
                          </td>
                          <td><span className="badge-status active">{acc.type}</span></td>
                          <td>{acc.parent}</td>
                          <td><strong style={{ color: acc.type === 'Asset' || acc.type === 'Income' ? '#059669' : '#1f2937' }}>₹{acc.balance.toLocaleString()}</strong></td>
                          <td><span className="badge-status active">{acc.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => openEditModal('chartOfAccounts', acc)}>
                              <i className="fas fa-edit"></i> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. DOUBLE-ENTRY ENGINE */}
            {currentPage === 'doubleEntry' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-scale-balanced"></i> Double-Entry Journal Voucher Register</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Strict Double-Entry Enforcement (Total Debit = Total Credit)</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_journal')}>
                    <i className="fas fa-plus"></i> Create Journal Voucher
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Voucher ID</th><th>Date</th><th>Debit (Dr)</th><th>Credit (Cr)</th><th>Amount</th><th>Gallery</th><th>Narration</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {db.journals.map(j => (
                        <tr key={j.id}>
                          <td><code>{j.id}</code></td>
                          <td>{j.date}</td>
                          <td><strong style={{ color: '#047857' }}>Dr {j.debitAcc}</strong></td>
                          <td><strong style={{ color: '#991b1b' }}>Cr {j.creditAcc}</strong></td>
                          <td><strong style={{ color: '#064e3b' }}>₹{j.debitAmount.toLocaleString()}</strong></td>
                          <td>{j.gallery}</td>
                          <td style={{ maxWidth: 220, fontSize: 12 }}>{j.narration}</td>
                          <td><span className="badge-status active">{j.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => openEditModal('journals', j)}>
                              <i className="fas fa-edit"></i> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. ACCOUNTING ERROR CENTRE */}
            {currentPage === 'accountingErrors' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-triangle-exclamation"></i> Accounting Error & Discrepancy Centre</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Automated Detection for Unbalanced Journals, Tax Mismatches & Backdated Modifications</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => showToast('Scan complete: 0 new errors detected!', 'success')}>
                    <i className="fas fa-rotate"></i> Run Audit Rule Engine
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Error ID</th><th>Rule</th><th>Discrepancy Details</th><th>Amount</th><th>Severity</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {db.accountingErrors.map(e => (
                        <tr key={e.id}>
                          <td><code>{e.id}</code></td>
                          <td><strong>{e.rule}</strong></td>
                          <td style={{ maxWidth: 300, fontSize: 12 }}>{e.desc}</td>
                          <td><strong style={{ color: '#dc2626' }}>{e.amount}</strong></td>
                          <td><span className={'badge-status ' + (e.severity === 'Critical' ? 'critical' : 'pending')}>{e.severity}</span></td>
                          <td><span className="badge-status pending">{e.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => showToast(`Auto-reconciled ${e.id}!`, 'success')}>
                              Fix & Post
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 9. GENERAL LEDGER */}
            {currentPage === 'generalLedger' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-book-bookmark"></i> General Ledger (GL) Sub-Accounts</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Account-Wise Debit/Credit Breakdown & Historical Audit Trail</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      value={selectedLedgerAcc}
                      onChange={e => setSelectedLedgerAcc(e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #d1fae5', fontSize: 13, background: '#fff' }}
                    >
                      {db.chartOfAccounts.map(a => <option key={a.code} value={a.name}>{a.code} - {a.name}</option>)}
                    </select>
                    <button className="btn btn-sm btn-primary" onClick={() => openReportViewer('GL_REPORT')}>
                      <i className="fas fa-print"></i> Formatted Report
                    </button>
                  </div>
                </div>

                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-list"></i> Transactions for: {selectedLedgerAcc}</h3>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Date</th><th>Voucher No</th><th>Particulars / Narration</th><th>Debit (Dr)</th><th>Credit (Cr)</th><th>Running Balance</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>2026-08-01</td><td>OB-2026-08</td><td>Opening Balance as of 1st August 2026</td><td>₹2,45,00,000</td><td>₹0</td><td><strong style={{ color: '#059669' }}>₹2,45,00,000 Dr</strong></td></tr>
                      <tr><td>2026-08-24</td><td>JV-2026-0801</td><td>Receipt from Aditya Enterprises</td><td>₹8,50,000</td><td>₹0</td><td><strong style={{ color: '#059669' }}>₹2,53,50,000 Dr</strong></td></tr>
                      <tr><td>2026-08-24</td><td>JV-2026-0802</td><td>Payment to AWS Cloud Mumbai</td><td>₹0</td><td>₹1,12,400</td><td><strong style={{ color: '#059669' }}>₹2,52,37,600 Dr</strong></td></tr>
                      <tr><td>2026-08-25</td><td>EXP-401</td><td>Google India Meta & Ads Boosting</td><td>₹0</td><td>₹4,50,000</td><td><strong style={{ color: '#059669' }}>₹2,47,87,600 Dr</strong></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 10. TRIAL BALANCE */}
            {currentPage === 'trialBalance' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-scale-unbalanced"></i> Trial Balance (Balancing Verification)</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>All Nominal, Real, and Personal Account Balances as of {db.periodLock.currentPeriod}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="badge-status active" style={{ padding: '6px 14px' }}>
                      <i className="fas fa-check-circle"></i> Balanced: Dr ₹16.83Cr = Cr ₹16.83Cr
                    </span>
                    <button className="btn btn-sm btn-primary" onClick={() => openReportViewer('TRIAL_BALANCE')}>
                      <i className="fas fa-print"></i> Formatted Report
                    </button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Account Code</th><th>Account Title</th><th>Category Type</th><th>Debit Total (Dr)</th><th>Credit Total (Cr)</th></tr>
                    </thead>
                    <tbody>
                      {db.chartOfAccounts.filter(a => a.parent !== 'ROOT').map(a => (
                        <tr key={a.code}>
                          <td><code>{a.code}</code></td>
                          <td><strong>{a.name}</strong></td>
                          <td><span className="badge-status active">{a.type}</span></td>
                          <td>{a.type === 'Asset' || a.type === 'Expense' ? `₹${a.balance.toLocaleString()}` : '—'}</td>
                          <td>{a.type === 'Liability' || a.type === 'Income' || a.type === 'Capital' ? `₹${a.balance.toLocaleString()}` : '—'}</td>
                        </tr>
                      ))}
                      <tr style={{ background: '#ecfdf5', fontWeight: 700, fontSize: 14 }}>
                        <td colSpan={3} style={{ textAlign: 'right' }}>TOTAL BALANCED SUM:</td>
                        <td style={{ color: '#047857' }}>₹16,83,00,000</td>
                        <td style={{ color: '#047857' }}>₹16,83,00,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 11. FINANCIAL STATEMENTS */}
            {currentPage === 'financialStatements' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-file-invoice-dollar"></i> Statutory Financial Statements</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Profit & Loss (P&L), Balance Sheet, and Cash Flow Statement</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-primary" onClick={() => openReportViewer('PNL_REPORT')}>
                      <i className="fas fa-print"></i> Formatted Statement
                    </button>
                  </div>
                </div>

                <div className="tabs-header">
                  <button className={'tab-btn ' + (activeStatementTab === 'pnl' ? 'active' : '')} onClick={() => setActiveStatementTab('pnl')}>Profit & Loss (P&L)</button>
                  <button className={'tab-btn ' + (activeStatementTab === 'balanceSheet' ? 'active' : '')} onClick={() => setActiveStatementTab('balanceSheet')}>Balance Sheet</button>
                  <button className={'tab-btn ' + (activeStatementTab === 'cashFlow' ? 'active' : '')} onClick={() => setActiveStatementTab('cashFlow')}>Cash Flow Statement</button>
                </div>

                {activeStatementTab === 'pnl' && (
                  <div className="table-wrap">
                    <div className="table-header">
                      <h3><i className="fas fa-file-contract"></i> Statement of Profit and Loss (P&L) for {db.periodLock.currentPeriod}</h3>
                    </div>
                    <table>
                      <tbody>
                        <tr style={{ background: '#f0fdf4', fontWeight: 700 }}><td><strong>I. REVENUE FROM OPERATIONS</strong></td><td></td><td style={{ textAlign: 'right' }}><strong>₹14,85,00,000</strong></td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Travel & Holiday Packages Revenue</td><td></td><td style={{ textAlign: 'right' }}>₹6,54,00,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Visa & VIP Processing Fees</td><td></td><td style={{ textAlign: 'right' }}>₹3,42,00,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Digital Gallery Memberships</td><td></td><td style={{ textAlign: 'right' }}>₹2,85,00,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Franchise Royalties & Fees</td><td></td><td style={{ textAlign: 'right' }}>₹2,04,00,000</td></tr>
                        <tr style={{ background: '#fef3c7', fontWeight: 700 }}><td><strong>II. DIRECT COSTS & COST OF SALES</strong></td><td></td><td style={{ textAlign: 'right', color: '#92400e' }}>(₹5,05,00,000)</td></tr>
                        <tr style={{ background: '#ecfdf5', fontWeight: 700 }}><td><strong>III. GROSS PROFIT (I - II)</strong></td><td><strong>Margin: 66.0%</strong></td><td style={{ textAlign: 'right', color: '#059669' }}>₹9,80,00,000</td></tr>
                        <tr style={{ background: '#f0fdf4', fontWeight: 700 }}><td><strong>IV. OPERATING EXPENSES (OPEX)</strong></td><td></td><td style={{ textAlign: 'right' }}><strong>(₹6,08,00,000)</strong></td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Employee Salaries & Benefits</td><td></td><td style={{ textAlign: 'right' }}>₹3,45,00,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Digital Marketing, Boosting & Promotions</td><td></td><td style={{ textAlign: 'right' }}>₹1,25,00,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Commercial Property Rent & Lease</td><td></td><td style={{ textAlign: 'right' }}>₹85,00,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Office Operations, Cloud & Utilities</td><td></td><td style={{ textAlign: 'right' }}>₹53,00,000</td></tr>
                        <tr style={{ background: '#ecfdf5', fontWeight: 700, fontSize: 14 }}>
                          <td><strong>V. NET PROFIT BEFORE TAX (EBITDA)</strong></td>
                          <td><strong>Net Margin: 25.0%</strong></td>
                          <td style={{ textAlign: 'right', color: '#047857', fontSize: 16 }}><strong>₹3,72,00,000</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeStatementTab === 'balanceSheet' && (
                  <div className="table-wrap">
                    <div className="table-header">
                      <h3><i className="fas fa-balance-scale"></i> Balance Sheet as of 25 August 2026</h3>
                    </div>
                    <table>
                      <tbody>
                        <tr style={{ background: '#ecfdf5', fontWeight: 700 }}><td><strong>ASSETS</strong></td><td style={{ textAlign: 'right' }}><strong>₹12,47,50,000</strong></td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Fixed Assets (Servers, Interiors, POS Terminals)</td><td style={{ textAlign: 'right' }}>₹4,85,00,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Current Assets — Bank Balances (HDFC, ICICI, SBI)</td><td style={{ textAlign: 'right' }}>₹2,98,00,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Current Assets — Trade Receivables (AR)</td><td style={{ textAlign: 'right' }}>₹3,15,00,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Current Assets — Cash in Hand (Tills & Vault)</td><td style={{ textAlign: 'right' }}>₹1,49,50,000</td></tr>
                        <tr style={{ background: '#fef3c7', fontWeight: 700 }}><td><strong>LIABILITIES & CAPITAL</strong></td><td style={{ textAlign: 'right' }}><strong>₹12,47,50,000</strong></td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Shareholders Capital & Retained Earnings</td><td style={{ textAlign: 'right' }}>₹8,50,00,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Current Liabilities — Trade Payables (Vendors)</td><td style={{ textAlign: 'right' }}>₹1,42,00,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Current Liabilities — Staff Salary Liability</td><td style={{ textAlign: 'right' }}>₹82,50,000</td></tr>
                        <tr><td style={{ paddingLeft: 24 }}>Statutory Tax Liabilities (GST & TDS)</td><td style={{ textAlign: 'right' }}>₹1,73,00,000</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeStatementTab === 'cashFlow' && (
                  <div className="table-wrap">
                    <div className="table-header">
                      <h3><i className="fas fa-money-bill-wave"></i> Cash Flow Statement</h3>
                    </div>
                    <table>
                      <tbody>
                        <tr style={{ background: '#ecfdf5', fontWeight: 700 }}><td><strong>A. CASH FLOW FROM OPERATING ACTIVITIES</strong></td><td style={{ textAlign: 'right', color: '#059669' }}><strong>+₹4,25,00,000</strong></td></tr>
                        <tr style={{ background: '#fee2e2', fontWeight: 700 }}><td><strong>B. CASH FLOW FROM INVESTING ACTIVITIES (CAPEX)</strong></td><td style={{ textAlign: 'right', color: '#dc2626' }}><strong>(₹85,00,000)</strong></td></tr>
                        <tr style={{ background: '#f0fdf4', fontWeight: 700 }}><td><strong>C. CASH FLOW FROM FINANCING ACTIVITIES</strong></td><td style={{ textAlign: 'right' }}><strong>₹0</strong></td></tr>
                        <tr style={{ background: '#ecfdf5', fontWeight: 700, fontSize: 14 }}><td><strong>NET CASH GENERATION (A + B + C)</strong></td><td style={{ textAlign: 'right', color: '#047857' }}><strong>+₹3,40,00,000</strong></td></tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 12. ACCOUNTS RECEIVABLE & 13. RECEIVABLE AGING */}
            {(currentPage === 'receivables' || currentPage === 'receivableAging' || currentPage === 'collectionManagement') && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-hand-holding-dollar"></i> Accounts Receivable (AR) & Aging Analysis</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Customer Invoices, DSO Metrics & Collection Promises</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_invoice')}>
                    <i className="fas fa-plus"></i> Raise Sales Invoice
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Invoice ID</th><th>Customer Entity</th><th>Service</th><th>Invoice Date</th><th>Due Date</th><th>Total</th><th>Outstanding</th><th>Aging</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {db.receivables.map(r => (
                        <tr key={r.id}>
                          <td><code>{r.invoiceNo}</code></td>
                          <td><strong>{r.customer}</strong></td>
                          <td>{r.service}</td>
                          <td>{r.invoiceDate}</td>
                          <td>{r.dueDate}</td>
                          <td>₹{r.totalAmount.toLocaleString()}</td>
                          <td><strong style={{ color: '#dc2626' }}>₹{r.outstanding.toLocaleString()}</strong></td>
                          <td><span className={'badge-status ' + (r.agingBucket === 'CURRENT' ? 'active' : 'overdue')}>{r.agingBucket}</span></td>
                          <td><span className="badge-status pending">{r.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn btn-xs btn-outline" onClick={() => openEditModal('receivables', r)}>
                                <i className="fas fa-edit"></i> Edit
                              </button>
                              <button className="btn btn-xs btn-primary" onClick={() => showToast(`Payment reminder sent to ${r.customer}!`, 'success')}>
                                Remind
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 15. ACCOUNTS PAYABLE & 16. PAYABLE AGING */}
            {(currentPage === 'payables' || currentPage === 'payableAging') && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-money-bill-transfer"></i> Accounts Payable (AP) & Disbursement Aging</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Disbursement Schedules, Vendor Invoices & Priority Payouts</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_payable')}>
                    <i className="fas fa-plus"></i> Register Vendor Bill
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Bill No</th><th>Vendor Entity</th><th>Category</th><th>Bill Date</th><th>Due Date</th><th>Amount Due</th><th>Priority</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {db.payables.map(p => (
                        <tr key={p.id}>
                          <td><code>{p.billNo}</code></td>
                          <td><strong>{p.vendor}</strong></td>
                          <td>{p.category}</td>
                          <td>{p.billDate}</td>
                          <td>{p.dueDate}</td>
                          <td><strong style={{ color: '#064e3b' }}>₹{p.amount.toLocaleString()}</strong></td>
                          <td><span className={'badge-status ' + (p.priority === 'Critical' ? 'critical' : 'pending')}>{p.priority}</span></td>
                          <td><span className="badge-status active">{p.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn btn-xs btn-outline" onClick={() => openEditModal('payables', p)}>
                                <i className="fas fa-edit"></i> Edit
                              </button>
                              <button className="btn btn-xs btn-primary" onClick={() => showToast(`Payout authorized for ${p.vendor}!`, 'success')}>
                                Pay
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 17. BANK MANAGEMENT */}
            {currentPage === 'banks' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-building-columns"></i> Bank Management & Reconciliation</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Multi-Bank Account Feeds, Reconciliation & Statement Sync</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-outline" onClick={() => setActiveModal('new_bank_acc')}>
                      <i className="fas fa-plus"></i> Add Bank A/c
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={() => showToast('Synced bank feeds via Open Banking API', 'success')}>
                      <i className="fas fa-sync"></i> Refresh Feeds
                    </button>
                  </div>
                </div>

                <div className="kpi-grid">
                  {db.banks.map(b => (
                    <div className="kpi-card" key={b.id}>
                      <div className="kpi-label">{b.bankName}</div>
                      <div className="kpi-val">₹{(b.closingBal / 100000).toFixed(2)}L</div>
                      <div className="kpi-sub orange">A/c: {b.accountNo.slice(-6)} | {b.unmatchedCount} Unmatched</div>
                    </div>
                  ))}
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>TXN ID</th><th>Bank</th><th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {db.bankTransactions.map(t => (
                        <tr key={t.id}>
                          <td><code>{t.id}</code></td>
                          <td>{t.bank}</td>
                          <td>{t.date}</td>
                          <td><strong>{t.description}</strong></td>
                          <td><span className={'badge-status ' + (t.type === 'Credit' ? 'active' : 'overdue')}>{t.type}</span></td>
                          <td><strong style={{ color: t.type === 'Credit' ? '#059669' : '#dc2626' }}>₹{t.amount.toLocaleString()}</strong></td>
                          <td><span className={'badge-status ' + (t.matched ? 'reconciled' : 'critical')}>{t.status}</span></td>
                          <td>
                            {!t.matched && (
                              <button className="btn btn-xs btn-outline" onClick={() => showToast(`Auto-matched feed ${t.id}!`, 'success')}>
                                Auto-Match
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 18. CASH MANAGEMENT & 19. GALLERY CLOSING */}
            {(currentPage === 'cashManagement' || currentPage === 'galleryClosing') && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-vault"></i> Gallery Daily Cash Closing & Till Settlement</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Cash Counts, POS Collections, Petty Cash & Shortage Verification</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => showToast('Day-End Cash count locked & verified!', 'success')}>
                    <i className="fas fa-plus"></i> Submit Day End Count
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Gallery Centre</th><th>Date</th><th>Manager</th><th>Opening Cash</th><th>Inflows</th><th>Expenses</th><th>Actual Cash</th><th>Difference</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {db.galleryClosings.map(g => (
                        <tr key={g.id}>
                          <td><strong>{g.gallery}</strong></td>
                          <td>{g.date}</td>
                          <td>{g.manager}</td>
                          <td>₹{g.openingCash.toLocaleString()}</td>
                          <td><strong style={{ color: '#059669' }}>+₹{g.cashCollected.toLocaleString()}</strong></td>
                          <td><strong style={{ color: '#dc2626' }}>-₹{g.cashExpenses.toLocaleString()}</strong></td>
                          <td><strong>₹{g.actualCash.toLocaleString()}</strong></td>
                          <td>
                            <strong style={{ color: g.diff < 0 ? '#dc2626' : '#059669' }}>
                              {g.diff === 0 ? '₹0 (Balanced)' : `${g.diff < 0 ? '-₹' + Math.abs(g.diff) : '+₹' + g.diff}`}
                            </strong>
                          </td>
                          <td><span className={'badge-status ' + (g.diff === 0 ? 'reconciled' : 'critical')}>{g.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => openEditModal('galleryClosings', g)}>
                              <i className="fas fa-edit"></i> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 20. PAYMENT GATEWAY & 21. TRANSACTION EXCEPTIONS */}
            {(currentPage === 'paymentGateway' || currentPage === 'exceptionCentre') && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-credit-card"></i> Payment Gateway & Transaction Exception Centre</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Razorpay/PayU Settlements, Failed Webhooks, Chargebacks & Refund Reconciliation</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => showToast('Settlement batch reconciled successfully!', 'success')}>
                    <i className="fas fa-rotate"></i> Reconcile Gateway Batch
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Exception Category</th><th>Active Count</th><th>Financial Value</th><th>Channel</th><th>Status</th><th>Resolution</th></tr>
                    </thead>
                    <tbody>
                      <tr><td><strong>Failed POS Terminal Transactions</strong></td><td>05</td><td>₹42,500</td><td>Pine Labs</td><td><span className="badge-status critical">Auto-Retry Queue</span></td><td><button className="btn btn-xs btn-outline" onClick={() => showToast('Reprocessed failed webhook', 'success')}>Reprocess</button></td></tr>
                      <tr><td><strong>Unmatched Bank Feed Records</strong></td><td>12</td><td>₹14,50,000</td><td>HDFC CMS</td><td><span className="badge-status critical">Manual Review</span></td><td><button className="btn btn-xs btn-outline" onClick={() => showToast('Matched with invoice batch', 'success')}>Match</button></td></tr>
                      <tr><td><strong>Customer Chargeback Disputes</strong></td><td>02</td><td>₹65,000</td><td>Razorpay</td><td><span className="badge-status pending">Evidence Uploaded</span></td><td><button className="btn btn-xs btn-outline" onClick={() => showToast('Viewing chargeback dossier', 'info')}>View Dossier</button></td></tr>
                      <tr><td><strong>Gateway Settlement Differences</strong></td><td>06</td><td>₹84,200</td><td>PayU India</td><td><span className="badge-status pending">Fee Variance</span></td><td><button className="btn btn-xs btn-outline" onClick={() => showToast('Adjusted MDR fee ledger', 'success')}>Adjust MDR</button></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 22. EXPENSE MANAGEMENT & 25. OFFICE EXPENSES */}
            {(currentPage === 'expenses' || currentPage === 'officeFinance') && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-receipt"></i> Corporate Expense Register (24+ Categories)</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Salary, Rent, Office, Utilities, Promotions, Boosting, Assets, CSR & Subscriptions</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_expense')}>
                    <i className="fas fa-plus"></i> Record Expense Voucher
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Voucher</th><th>Date</th><th>Vendor</th><th>Category</th><th>Gross Amount</th><th>GST</th><th>Cost Centre</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {db.expenses.map(e => (
                        <tr key={e.id}>
                          <td><code>{e.voucherNo}</code></td>
                          <td>{e.date}</td>
                          <td><strong>{e.vendor}</strong></td>
                          <td><span className="badge-status active">{e.category}</span></td>
                          <td><strong style={{ color: '#064e3b' }}>₹{e.amount.toLocaleString()}</strong></td>
                          <td>₹{e.gst.toLocaleString()}</td>
                          <td>{e.costCentre}</td>
                          <td><span className="badge-status approved">{e.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => openEditModal('expenses', e)}>
                              <i className="fas fa-edit"></i> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 23. SALARY FINANCE */}
            {currentPage === 'salaryFinance' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-users-gear"></i> Salary & Payroll Finance Control</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Monthly Salary Liability, Deductions & Gallery Salary/Revenue Ratios</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => showToast('Payroll batch authorized for bank CMS disbursal!', 'success')}>
                    <i className="fas fa-check-double"></i> Authorize Payroll Disbursal
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Gallery Location</th><th>Headcount</th><th>Gross Salary</th><th>PF</th><th>TDS</th><th>Net Disbursed</th><th>Gallery Revenue</th><th>Salary %</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {db.salarySummary.map((s, idx) => (
                        <tr key={idx}>
                          <td><strong>{s.gallery}</strong></td>
                          <td>{s.headcount} employees</td>
                          <td>₹{s.grossSalary.toLocaleString()}</td>
                          <td>₹{s.pf.toLocaleString()}</td>
                          <td>₹{s.tds.toLocaleString()}</td>
                          <td><strong style={{ color: '#059669' }}>₹{s.netDisbursed.toLocaleString()}</strong></td>
                          <td>₹{s.galleryRevenue.toLocaleString()}</td>
                          <td><strong style={{ color: s.salaryRatio > 20 ? '#dc2626' : '#059669' }}>{s.salaryRatio}%</strong></td>
                          <td><span className="badge-status active">{s.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 24. RENT & LEASE FINANCE */}
            {currentPage === 'rentLease' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-building"></i> Commercial Property Rent & Lease Master</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Agreements, Monthly Rent, Deposits, Escalation Clauses & Renewals</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_lease')}>
                    <i className="fas fa-plus"></i> Add Property Lease
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Property</th><th>Landlord</th><th>Monthly Rent</th><th>Deposit</th><th>Rent Due</th><th>Validity</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {db.leases.map(l => (
                        <tr key={l.id}>
                          <td><strong>{l.propertyName}</strong></td>
                          <td>{l.landlord}</td>
                          <td><strong style={{ color: '#064e3b' }}>₹{l.monthlyRent.toLocaleString()}</strong></td>
                          <td>₹{l.deposit.toLocaleString()}</td>
                          <td><strong>{l.rentDueDay}</strong></td>
                          <td>{l.leaseStart} to {l.leaseEnd}</td>
                          <td><span className="badge-status active">{l.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => openEditModal('leases', l)}>
                              <i className="fas fa-edit"></i> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 26. MARKETING & 27. PROMOTIONS FINANCE */}
            {(currentPage === 'marketingFinance' || currentPage === 'promotionsFinance') && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-bullhorn"></i> Marketing & Promotion ROI Engine</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Meta, Google Ads, CAC & Real-Time Return on Ad Spend (ROAS)</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => showToast('Campaign budget allocation form opened', 'info')}>
                    <i className="fas fa-plus"></i> Allocate Campaign Budget
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Campaign Name</th><th>Platform</th><th>Budget</th><th>Actual Spent</th><th>Leads</th><th>Revenue</th><th>ROI %</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {db.marketingCampaigns.map(m => (
                        <tr key={m.id}>
                          <td><strong>{m.name}</strong></td>
                          <td>{m.platform}</td>
                          <td>₹{m.budget.toLocaleString()}</td>
                          <td><strong style={{ color: '#d97706' }}>₹{m.spent.toLocaleString()}</strong></td>
                          <td>{m.leads}</td>
                          <td><strong style={{ color: '#059669' }}>₹{m.revenue.toLocaleString()}</strong></td>
                          <td><strong style={{ color: '#047857' }}>{m.roi}%</strong></td>
                          <td><span className={'badge-status ' + (m.status.includes('Alert') ? 'critical' : 'active')}>{m.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 28. FIXED ASSET REGISTER */}
            {currentPage === 'assetManagement' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-boxes-stacked"></i> Fixed Asset Register & Depreciation Engine</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Capitalization, Verification, Custodians & Book Values</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_asset')}>
                    <i className="fas fa-plus"></i> Capitalize Fixed Asset
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Asset ID</th><th>Asset Title</th><th>Category</th><th>Serial No</th><th>Purchase Date</th><th>Cost</th><th>Book Value</th><th>Location</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {db.assets.map(a => (
                        <tr key={a.id}>
                          <td><code>{a.id}</code></td>
                          <td><strong>{a.name}</strong></td>
                          <td>{a.category}</td>
                          <td><code>{a.serialNo}</code></td>
                          <td>{a.purchaseDate}</td>
                          <td>₹{a.purchasePrice.toLocaleString()}</td>
                          <td><strong style={{ color: '#059669' }}>₹{a.bookValue.toLocaleString()}</strong></td>
                          <td>{a.gallery}</td>
                          <td><span className="badge-status active">{a.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => openEditModal('assets', a)}>
                              <i className="fas fa-edit"></i> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 29. CHARITY & CSR (80G) */}
            {currentPage === 'charityCsr' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-hand-holding-heart"></i> Corporate Social Responsibility (CSR) & Charity</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Mandatory CSR Allocation, Section 80G Tax Exemption & Verification</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_csr')}>
                    <i className="fas fa-plus"></i> New CSR Grant Proposal
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Grant ID</th><th>Beneficiary Organization</th><th>Purpose</th><th>Category</th><th>Amount</th><th>80G Receipt</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {db.charity.map(c => (
                        <tr key={c.id}>
                          <td><code>{c.id}</code></td>
                          <td><strong>{c.organization}</strong></td>
                          <td style={{ maxWidth: 240, fontSize: 12 }}>{c.purpose}</td>
                          <td><span className="badge-status active">{c.csrCategory}</span></td>
                          <td><strong style={{ color: '#064e3b' }}>₹{c.amount.toLocaleString()}</strong></td>
                          <td><code>{c.receiptNo}</code></td>
                          <td><span className="badge-status active">{c.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => openEditModal('charity', c)}>
                              <i className="fas fa-edit"></i> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 30. GALLERY & SERVICE P&L */}
            {currentPage === 'profitability' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-trophy"></i> Gallery & Service-Wise P&L Profitability Ranking</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Revenue, OPEX, Allocated Overheads, Net Profit & Margin % by Territory</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => openReportViewer('GALLERY_PNL_REPORT')}>
                    <i className="fas fa-print"></i> Formatted Report
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Rank</th><th>Gallery Center</th><th>Gross Revenue</th><th>Salary Cost</th><th>Rent Cost</th><th>Marketing</th><th>Operating Profit</th><th>Margin</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {db.galleryProfitability.map(g => (
                        <tr key={g.rank}>
                          <td><strong>#{g.rank}</strong></td>
                          <td><strong>{g.gallery}</strong></td>
                          <td>₹{g.revenue.toLocaleString()}</td>
                          <td>₹{g.salary.toLocaleString()}</td>
                          <td>₹{g.rent.toLocaleString()}</td>
                          <td>₹{g.marketing.toLocaleString()}</td>
                          <td><strong style={{ color: '#059669', fontSize: 14 }}>₹{g.netProfit.toLocaleString()}</strong></td>
                          <td><span className="badge-status active">{g.margin}%</span></td>
                          <td><strong>{g.status}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 31. BUDGET VS ACTUALS */}
            {currentPage === 'budgets' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-calculator"></i> Budget Management & Variance Analysis</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Favorable & Unfavorable Threshold Alerts across Corporate Categories</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_budget')}>
                    <i className="fas fa-plus"></i> Set Category Budget
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Budget Category</th><th>Allocated Budget</th><th>Actual Spent</th><th>Variance</th><th>Utilization %</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {db.budgets.map((b, idx) => (
                        <tr key={idx}>
                          <td><strong>{b.category}</strong></td>
                          <td>₹{b.allocatedBudget.toLocaleString()}</td>
                          <td><strong>₹{b.actualSpent.toLocaleString()}</strong></td>
                          <td>
                            <strong style={{ color: b.variance > 0 ? '#dc2626' : '#059669' }}>
                              {b.variance > 0 ? `+₹${b.variance.toLocaleString()}` : `-₹${Math.abs(b.variance).toLocaleString()}`}
                            </strong>
                          </td>
                          <td>{b.percentUsed}%</td>
                          <td><span className={'badge-status ' + (b.percentUsed > 100 ? 'critical' : 'active')}>{b.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => openEditModal('budgets', b)}>
                              <i className="fas fa-edit"></i> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 32. CASH FLOW FORECASTING */}
            {currentPage === 'forecasting' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-crystal-ball"></i> Cash Flow Forecasting & Scenario Planning</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Conservative, Base Case & Optimistic 3-Month Projection Engine</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => showToast('Recalculated 90-day cash projections', 'success')}>
                    <i className="fas fa-calculator"></i> Run Scenario Model
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Forecast Scenario</th><th>Expected Revenue</th><th>Salary & Rent</th><th>Vendor & Tax</th><th>Projected Closing Cash</th><th>Confidence</th></tr>
                    </thead>
                    <tbody>
                      <tr><td><strong>Conservative Case</strong></td><td>₹1.65Cr</td><td>(₹97.3L)</td><td>(₹48.0L)</td><td><strong style={{ color: '#059669' }}>₹3.19Cr</strong></td><td><span className="badge-status active">95% Probable</span></td></tr>
                      <tr style={{ background: '#ecfdf5', fontWeight: 700 }}><td><strong>Base Case Model</strong></td><td>₹2.00Cr</td><td>(₹97.3L)</td><td>(₹64.5L)</td><td><strong style={{ color: '#047857', fontSize: 14 }}>₹3.82Cr</strong></td><td><span className="badge-status active">85% Expected</span></td></tr>
                      <tr><td><strong>Optimistic Case</strong></td><td>₹2.45Cr</td><td>(₹97.3L)</td><td>(₹72.0L)</td><td><strong style={{ color: '#059669' }}>₹4.18Cr</strong></td><td><span className="badge-status pending">65% Target</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 33. GST & TAX COMPLIANCE */}
            {currentPage === 'gstTax' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-stamp"></i> GST & Tax Compliance & Returns Calendar</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>GSTR-1, GSTR-3B, GSTR-2B Input Tax Credit Reconciliation</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => openReportViewer('GST_REPORT')}>
                    <i className="fas fa-print"></i> Formatted GST Report
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Return Type</th><th>Period</th><th>Turnover / ITC</th><th>Tax Amount</th><th>Due Date</th><th>Filing Status</th><th>Ack No</th></tr>
                    </thead>
                    <tbody>
                      {db.gstCompliance.map((g, idx) => (
                        <tr key={idx}>
                          <td><strong>{g.returnType}</strong></td>
                          <td>{g.period}</td>
                          <td>{g.turnoverReported ? `Turnover: ₹${(g.turnoverReported / 100000).toFixed(1)}L` : `Invoices: ${g.totalInvoices}`}</td>
                          <td><strong style={{ color: '#064e3b' }}>{g.gstLiability ? `₹${(g.gstLiability / 100000).toFixed(2)}L` : `₹${(g.matchedITC / 100000).toFixed(2)}L`}</strong></td>
                          <td><strong>{g.dueDate}</strong></td>
                          <td><span className={'badge-status ' + (g.status.includes('Filed') ? 'active' : 'pending')}>{g.status}</span></td>
                          <td><code>{g.ackNo}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 34. CONTROLS, 35. CLOSING & 36. AUDIT EXPORT & 37. REPORT CENTRE */}
            {(currentPage === 'financialControls' || currentPage === 'closingChecklist' || currentPage === 'auditExport' || currentPage === 'reportCentre') && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-file-shield"></i> Finance Report Centre & Audit Package Generator</h2>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>One-Click Board & Statutory Audit Export Engine with Printable Letterhead</p>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={handleGenerateAuditPackage}>
                    <i className="fas fa-download"></i> Generate Complete Audit Package
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="table-wrap">
                    <div className="table-header">
                      <h3><i className="fas fa-file-pdf"></i> Accounting & Statutory Statements</h3>
                    </div>
                    <table>
                      <tbody>
                        <tr><td><strong>Trial Balance (Detailed Account-Level)</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-primary" onClick={() => openReportViewer('TRIAL_BALANCE')}>View & Print</button></td></tr>
                        <tr><td><strong>General Ledger (All Sub-Accounts)</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-primary" onClick={() => openReportViewer('GL_REPORT')}>View & Print</button></td></tr>
                        <tr><td><strong>Profit & Loss (P&L) Statement</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-primary" onClick={() => openReportViewer('PNL_REPORT')}>View & Print</button></td></tr>
                        <tr><td><strong>Balance Sheet (Statutory Format)</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-primary" onClick={() => openReportViewer('BALANCE_SHEET')}>View & Print</button></td></tr>
                        <tr><td><strong>Cash Flow Statement</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-primary" onClick={() => openReportViewer('CASH_FLOW')}>View & Print</button></td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="table-wrap">
                    <div className="table-header">
                      <h3><i className="fas fa-chart-pie"></i> Management & Tax Reports</h3>
                    </div>
                    <table>
                      <tbody>
                        <tr><td><strong>Gallery-Wise P&L Profitability Breakdown</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-primary" onClick={() => openReportViewer('GALLERY_PNL_REPORT')}>View & Print</button></td></tr>
                        <tr><td><strong>Marketing ROI & Ads Boosting Analysis</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-primary" onClick={() => openReportViewer('MARKETING_ROI_REPORT')}>View & Print</button></td></tr>
                        <tr><td><strong>Salary & HRMS Payroll Reconciliation</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-primary" onClick={() => openReportViewer('PAYROLL_REPORT')}>View & Print</button></td></tr>
                        <tr><td><strong>Fixed Asset Register & Depreciation Schedule</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-primary" onClick={() => openReportViewer('ASSET_REPORT')}>View & Print</button></td></tr>
                        <tr><td><strong>GST Compliance & GSTR-2B ITC Dossier</strong></td><td style={{ textAlign: 'right' }}><button className="btn btn-xs btn-primary" onClick={() => openReportViewer('GST_REPORT')}>View & Print</button></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {activeToast && (
        <div className={`toast ${activeToast.type}`}>
          <i className="fas fa-info-circle"></i>
          <span>{activeToast.message}</span>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: NEW JOURNAL VOUCHER */}
      {/* ========================================================== */}
      {activeModal === 'new_journal' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-scale-balanced" style={{ color: '#059669' }}></i> Post Double-Entry Journal Voucher</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddJournal}>
              <div className="form-row">
                <div className="form-group">
                  <label>Voucher Type *</label>
                  <select name="voucherType">
                    <option value="Journal Voucher">Journal Voucher (JV)</option>
                    <option value="Payment Voucher">Payment Voucher (PV)</option>
                    <option value="Receipt Voucher">Receipt Voucher (RV)</option>
                    <option value="Adjustment Voucher">Adjustment Voucher</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Posting Date *</label>
                  <input type="date" name="date" defaultValue="2026-08-25" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Debit Account (Dr) *</label>
                  <select name="debitAcc" required>
                    {db.chartOfAccounts.map(a => <option key={a.code} value={a.name}>{a.code} - {a.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Debit Amount (₹) *</label>
                  <input type="number" name="debitAmount" defaultValue="50000" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Credit Account (Cr) *</label>
                  <select name="creditAcc" required>
                    {db.chartOfAccounts.map(a => <option key={a.code} value={a.name}>{a.code} - {a.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Credit Amount (₹) *</label>
                  <input type="number" name="creditAmount" defaultValue="50000" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Cost Centre *</label>
                  <input type="text" name="costCentre" defaultValue="Corporate HQ" required />
                </div>
                <div className="form-group">
                  <label>Gallery / Office *</label>
                  <select name="gallery">
                    <option value="Pune Central">Pune Central</option>
                    <option value="Mumbai East">Mumbai East</option>
                    <option value="Nashik North">Nashik North</option>
                    <option value="Nagpur Central">Nagpur Central</option>
                    <option value="HQ">Corporate HQ</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" name="dept" defaultValue="Finance" />
                </div>
                <div className="form-group">
                  <label>Reference No / Bill No</label>
                  <input type="text" name="reference" placeholder="e.g. INV-9901" />
                </div>
              </div>
              <div className="form-group">
                <label>Narration / Business Description *</label>
                <textarea name="narration" required placeholder="Detail the double-entry reason and supporting evidence..."></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Validate & Post Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: RECORD EXPENSE VOUCHER */}
      {/* ========================================================== */}
      {activeModal === 'new_expense' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-receipt" style={{ color: '#059669' }}></i> Record Corporate Expense Voucher</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="form-row">
                <div className="form-group">
                  <label>Vendor / Payee Name *</label>
                  <input type="text" name="vendor" required placeholder="e.g. DLF Cyber, Google Ads, Dell India" />
                </div>
                <div className="form-group">
                  <label>Expense Date *</label>
                  <input type="date" name="date" defaultValue="2026-08-25" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Main Category *</label>
                  <select name="category">
                    <option value="Salary & Payroll">Salary & Payroll Expenses</option>
                    <option value="Rent & Lease">Rent & Commercial Lease</option>
                    <option value="Office & HQ Operations">Office & HQ Expenses</option>
                    <option value="Digital Marketing & Boosting">Digital Marketing, SEO & Ads Boosting</option>
                    <option value="Social Media & Influencers">Social Media & Influencer Marketing</option>
                    <option value="Assets & Capital Equipment">Assets & Hardware Capex</option>
                    <option value="Charity & CSR">Charity & CSR Giving (80G)</option>
                    <option value="Utilities & Electricity">Office Utilities & Power</option>
                    <option value="Software & Cloud IT">Software Subscriptions & Servers</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Total Amount (₹) *</label>
                  <input type="number" name="amount" defaultValue="25000" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>GST Rate applicable</label>
                  <select name="gstRate">
                    <option value="18">18% GST (Standard)</option>
                    <option value="12">12% GST</option>
                    <option value="5">5% GST</option>
                    <option value="0">0% (Nil / Exempt)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Disbursement Bank / Mode *</label>
                  <select name="paymentMode">
                    <option value="HDFC Corporate Bank">HDFC Corporate Bank CMS</option>
                    <option value="ICICI Bank RTGS">ICICI Bank RTGS</option>
                    <option value="Petty Cash Till">Gallery Petty Cash Till</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gallery Branch *</label>
                  <select name="gallery">
                    <option value="Pune Central">Pune Central</option>
                    <option value="Mumbai East">Mumbai East</option>
                    <option value="Nashik North">Nashik North</option>
                    <option value="Nagpur Central">Nagpur Central</option>
                    <option value="HQ">Corporate HQ</option>
                    <option value="Company-Wide">Company-Wide</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department & Cost Centre *</label>
                  <input type="text" name="costCentre" defaultValue="Operational HQ" required />
                  <input type="hidden" name="office" value="Corporate HQ" />
                  <input type="hidden" name="dept" value="Finance" />
                </div>
              </div>
              <div className="form-group">
                <label>Business Purpose / Narration *</label>
                <textarea name="purpose" required placeholder="Detail the business justification and attach invoice number..."></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: SALES INVOICE (AR) */}
      {/* ========================================================== */}
      {activeModal === 'new_invoice' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-file-invoice" style={{ color: '#059669' }}></i> Raise Customer Sales Invoice</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddInvoice}>
              <div className="form-row">
                <div className="form-group">
                  <label>Customer Name *</label>
                  <input type="text" name="customer" required placeholder="e.g. Apex Medical Corp" />
                </div>
                <div className="form-group">
                  <label>Service Stream *</label>
                  <select name="service">
                    <option value="Corporate Travel">Corporate Travel Package</option>
                    <option value="Visa Processing">Visa & VIP Processing</option>
                    <option value="Annual Membership">Annual Gallery Membership</option>
                    <option value="Franchise Royalty">Franchise Royalty</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Invoice Date *</label>
                  <input type="date" name="invoiceDate" defaultValue="2026-08-25" required />
                </div>
                <div className="form-group">
                  <label>Due Date *</label>
                  <input type="date" name="dueDate" defaultValue="2026-09-25" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Invoice Total Amount (₹) *</label>
                  <input type="number" name="totalAmount" defaultValue="150000" required />
                </div>
                <div className="form-group">
                  <label>Gallery Branch *</label>
                  <select name="gallery">
                    <option value="Pune Central">Pune Central</option>
                    <option value="Mumbai East">Mumbai East</option>
                    <option value="Nashik North">Nashik North</option>
                    <option value="Nagpur Central">Nagpur Central</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: VENDOR PURCHASE BILL (AP) */}
      {/* ========================================================== */}
      {activeModal === 'new_payable' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-money-bill-transfer" style={{ color: '#059669' }}></i> Register Vendor Purchase Bill</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddPayable}>
              <div className="form-row">
                <div className="form-group">
                  <label>Vendor Entity *</label>
                  <input type="text" name="vendor" required placeholder="e.g. Tata Power Electricity" />
                </div>
                <div className="form-group">
                  <label>Vendor Bill / Invoice No *</label>
                  <input type="text" name="billNo" required placeholder="e.g. TP-MUM-9901" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bill Date *</label>
                  <input type="date" name="billDate" defaultValue="2026-08-25" required />
                </div>
                <div className="form-group">
                  <label>Payment Due Date *</label>
                  <input type="date" name="dueDate" defaultValue="2026-09-05" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount Due (₹) *</label>
                  <input type="number" name="amount" defaultValue="75000" required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category">
                    <option value="Office Utilities">Office Utilities & Power</option>
                    <option value="Software & IT">Software Subscriptions & Cloud</option>
                    <option value="Rent & Lease">Rent & Commercial Lease</option>
                    <option value="Digital Marketing">Digital Marketing & Ads</option>
                    <option value="Fixed Assets">Fixed Assets & Capex</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Payment Priority *</label>
                  <select name="priority">
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Vendor Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: NEW ACCOUNT CODE (CHART OF ACCOUNTS) */}
      {/* ========================================================== */}
      {activeModal === 'new_account_code' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-sitemap" style={{ color: '#059669' }}></i> Add New Chart of Accounts Code</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddAccountCode}>
              <div className="form-row">
                <div className="form-group">
                  <label>Account Code *</label>
                  <input type="text" name="code" required placeholder="e.g. 5700" />
                </div>
                <div className="form-group">
                  <label>Classification Type *</label>
                  <select name="type">
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                    <option value="Capital">Capital & Equity</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Account Ledger Title *</label>
                <input type="text" name="name" required placeholder="e.g. Travel Insurance Commission" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Parent Account Group Code</label>
                  <input type="text" name="parent" defaultValue="4000" />
                </div>
                <div className="form-group">
                  <label>Opening Balance (₹)</label>
                  <input type="number" name="balance" defaultValue="0" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Account Code</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: CAPITALIZE FIXED ASSET */}
      {/* ========================================================== */}
      {activeModal === 'new_asset' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-boxes-stacked" style={{ color: '#059669' }}></i> Capitalize New Fixed Asset</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddAsset}>
              <div className="form-row">
                <div className="form-group">
                  <label>Asset Name *</label>
                  <input type="text" name="name" required placeholder="e.g. Apple MacBook Pro M3" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category">
                    <option value="IT Infrastructure">IT Infrastructure</option>
                    <option value="Gallery Interiors & Furniture">Gallery Interiors</option>
                    <option value="POS Hardware">POS Hardware</option>
                    <option value="Office Equipment">Office Equipment</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Serial / Tag Number *</label>
                  <input type="text" name="serialNo" required placeholder="e.g. MAC-2026-991" />
                </div>
                <div className="form-group">
                  <label>Purchase Date *</label>
                  <input type="date" name="purchaseDate" defaultValue="2026-08-25" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Purchase Price (₹) *</label>
                  <input type="number" name="purchasePrice" defaultValue="185000" required />
                </div>
                <div className="form-group">
                  <label>Vendor Entity *</label>
                  <input type="text" name="vendor" defaultValue="Apple India B2B" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gallery / Office *</label>
                  <input type="text" name="gallery" defaultValue="HQ Corporate" required />
                </div>
                <div className="form-group">
                  <label>Custodian *</label>
                  <input type="text" name="custodian" defaultValue="Anil Deshmukh" required />
                  <input type="hidden" name="dept" value="Finance" />
                  <input type="hidden" name="depreciationMethod" value="SLM 33.33%" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Capitalize Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: ADD PROPERTY LEASE */}
      {/* ========================================================== */}
      {activeModal === 'new_lease' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-building" style={{ color: '#059669' }}></i> Add Property Lease Agreement</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddLease}>
              <div className="form-row">
                <div className="form-group">
                  <label>Property Name *</label>
                  <input type="text" name="propertyName" required placeholder="e.g. Phoenix Marketcity Gallery" />
                </div>
                <div className="form-group">
                  <label>Unit / Floor Details *</label>
                  <input type="text" name="unit" required placeholder="e.g. Ground Floor Shop 14 (4,500 sq ft)" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Landlord / Entity *</label>
                  <input type="text" name="landlord" required placeholder="e.g. Phoenix Malls India Ltd" />
                </div>
                <div className="form-group">
                  <label>Monthly Rent (₹) *</label>
                  <input type="number" name="monthlyRent" defaultValue="250000" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Security Deposit (₹) *</label>
                  <input type="number" name="deposit" defaultValue="1500000" required />
                </div>
                <div className="form-group">
                  <label>Rent Due Day *</label>
                  <input type="text" name="rentDueDay" defaultValue="5th of Month" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Lease Start Date *</label>
                  <input type="date" name="leaseStart" defaultValue="2026-09-01" required />
                </div>
                <div className="form-group">
                  <label>Lease End Date *</label>
                  <input type="date" name="leaseEnd" defaultValue="2031-08-31" required />
                  <input type="hidden" name="escalationClause" value="5% Annual Escalation" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Lease Agreement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: NEW CSR GRANT */}
      {/* ========================================================== */}
      {activeModal === 'new_csr' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-hand-holding-heart" style={{ color: '#059669' }}></i> New CSR Grant Proposal</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddCsr}>
              <div className="form-row">
                <div className="form-group">
                  <label>Beneficiary NGO / Trust *</label>
                  <input type="text" name="organization" required placeholder="e.g. CRY - Child Rights and You" />
                </div>
                <div className="form-group">
                  <label>CSR Category *</label>
                  <select name="csrCategory">
                    <option value="Promoting Quality Education">Promoting Quality Education</option>
                    <option value="Eradicating Hunger & Malnutrition">Eradicating Hunger & Malnutrition</option>
                    <option value="Healthcare & Preventive Care">Healthcare & Preventive Care</option>
                    <option value="Rural Development Projects">Rural Development Projects</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Purpose / Project Description *</label>
                <textarea name="purpose" required placeholder="Detail the social impact project and milestones..."></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Grant Amount (₹) *</label>
                  <input type="number" name="amount" defaultValue="250000" required />
                </div>
                <div className="form-group">
                  <label>Approval Date *</label>
                  <input type="date" name="approvalDate" defaultValue="2026-08-25" required />
                </div>
              </div>
              <div className="form-group">
                <label>80G Receipt / Registration Number</label>
                <input type="text" name="receiptNo" placeholder="e.g. 80G-CRY-2026-88" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Approve & Record Grant</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: NEW BUDGET */}
      {/* ========================================================== */}
      {activeModal === 'new_budget' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-calculator" style={{ color: '#059669' }}></i> Set Category Budget Allocation</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddBudget}>
              <div className="form-group">
                <label>Budget Category *</label>
                <input type="text" name="category" required placeholder="e.g. AI & Tech Research" />
              </div>
              <div className="form-group">
                <label>Allocated Annual / Monthly Budget (₹) *</label>
                <input type="number" name="allocatedBudget" defaultValue="500000" required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: NEW BANK ACCOUNT */}
      {/* ========================================================== */}
      {activeModal === 'new_bank_acc' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-building-columns" style={{ color: '#059669' }}></i> Add Corporate Bank Account</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddBank}>
              <div className="form-row">
                <div className="form-group">
                  <label>Bank Name *</label>
                  <input type="text" name="bankName" required placeholder="e.g. Axis Bank Corporate" />
                </div>
                <div className="form-group">
                  <label>Account Number *</label>
                  <input type="text" name="accountNo" required placeholder="e.g. 920020049182901" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Account Type *</label>
                  <select name="accountType">
                    <option value="Current Account">Current Account</option>
                    <option value="Escrow Account">Escrow Account</option>
                    <option value="Sweep Account">Sweep Account</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>IFSC Code *</label>
                  <input type="text" name="ifsc" defaultValue="UTIB0000124" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Branch Name *</label>
                  <input type="text" name="branch" defaultValue="FC Road, Pune" required />
                </div>
                <div className="form-group">
                  <label>Opening Balance (₹) *</label>
                  <input type="number" name="closingBal" defaultValue="1000000" required />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Bank Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* UNIVERSAL EDIT MODAL FOR ANY RECORD */}
      {/* ========================================================== */}
      {activeModal === 'generic_edit' && editItem && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-edit" style={{ color: '#059669' }}></i> Edit {editCollection.toUpperCase()} Record</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveGenericEdit}>
              {Object.entries(editItem)
                .filter(([k]) => k !== 'id')
                .map(([key, val]) => (
                  <div className="form-group" key={key}>
                    <label style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type={typeof val === 'number' ? 'number' : 'text'}
                      name={key}
                      defaultValue={val}
                      required
                    />
                  </div>
                ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* FORMAL FORMATTED REPORT VIEWER WITH PRINT & EXPORT */}
      {/* ========================================================== */}
      {activeModal === 'report_viewer' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box large" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-print" style={{ color: '#059669' }}></i> Formal Statutory Financial Statement</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sm btn-primary" onClick={() => window.print()}>
                  <i className="fas fa-print"></i> Print Report
                </button>
                <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
              </div>
            </div>

            <div className="report-sheet">
              <div className="report-header-formal">
                <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900 }}>ePAY DIGITAL INDIA PRIVATE LIMITED</h2>
                <div style={{ fontSize: 11, color: '#4b5563' }}>CIN: U72900PN2024PTC229812 · GSTIN: 27AABCE1234F1Z8</div>
                <div style={{ fontSize: 11, color: '#4b5563' }}>Regd Office: 516, 5th Floor, The Pavillion Mall, Senapati Bapat Road, Pune - 411016</div>
                <h3 style={{ margin: '14px 0 2px', fontSize: 15, textTransform: 'uppercase', textDecoration: 'underline' }}>
                  {activeReportType === 'TRIAL_BALANCE' ? 'STATUTORY TRIAL BALANCE' :
                   activeReportType === 'GL_REPORT' ? `GENERAL LEDGER ACCOUNT STATEMENT: ${selectedLedgerAcc}` :
                   activeReportType === 'GST_REPORT' ? 'GST COMPLIANCE & INPUT TAX CREDIT (GSTR-2B) DOSSIER' :
                   activeReportType === 'GALLERY_PNL_REPORT' ? 'GALLERY-WISE SEGMENTAL PROFITABILITY REPORT' :
                   'PROFIT & LOSS STATEMENT & AUDIT DOSSIER'}
                </h3>
                <div style={{ fontSize: 11 }}>For the Accounting Period: {db.periodLock.currentPeriod} (Currency: INR ₹)</div>
              </div>

              {/* REPORT CONTENT BODY */}
              <div style={{ marginBottom: 24 }}>
                <table style={{ width: '100%', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #000' }}>
                      <th style={{ background: 'none', color: '#000', padding: '6px 0' }}>PARTICULARS</th>
                      <th style={{ background: 'none', color: '#000', textAlign: 'right', padding: '6px 0' }}>AMOUNT (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: '6px 0' }}><strong>I. Gross Revenue from Platform Operations</strong></td><td style={{ textAlign: 'right', fontWeight: 700 }}>₹14,85,00,000</td></tr>
                    <tr><td style={{ padding: '4px 16px' }}>• Holiday & Tour Packages Revenue</td><td style={{ textAlign: 'right' }}>₹6,54,00,000</td></tr>
                    <tr><td style={{ padding: '4px 16px' }}>• Visa & VIP Processing Fees</td><td style={{ textAlign: 'right' }}>₹3,42,00,000</td></tr>
                    <tr><td style={{ padding: '4px 16px' }}>• Digital Gallery Memberships</td><td style={{ textAlign: 'right' }}>₹2,85,00,000</td></tr>
                    <tr><td style={{ padding: '4px 16px' }}>• Franchise Royalty & Tech Fees</td><td style={{ textAlign: 'right' }}>₹2,04,00,000</td></tr>
                    <tr style={{ borderTop: '1px solid #9ca3af' }}><td style={{ padding: '6px 0' }}><strong>II. Total Direct Cost of Services</strong></td><td style={{ textAlign: 'right', color: '#dc2626' }}>(₹5,05,00,000)</td></tr>
                    <tr style={{ borderTop: '1px solid #000', fontWeight: 700 }}><td style={{ padding: '6px 0' }}>III. GROSS OPERATING PROFIT (I - II)</td><td style={{ textAlign: 'right', color: '#047857' }}>₹9,80,00,000</td></tr>
                    <tr><td style={{ padding: '6px 0' }}><strong>IV. Total Operational Expenses (OPEX)</strong></td><td style={{ textAlign: 'right', color: '#dc2626' }}>(₹6,08,00,000)</td></tr>
                    <tr><td style={{ padding: '4px 16px' }}>• Staff Salaries & Statutory Benefits</td><td style={{ textAlign: 'right' }}>₹3,45,00,000</td></tr>
                    <tr><td style={{ padding: '4px 16px' }}>• Performance Digital Ads & Boosting</td><td style={{ textAlign: 'right' }}>₹1,25,00,000</td></tr>
                    <tr><td style={{ padding: '4px 16px' }}>• Commercial Lease & Property Rent</td><td style={{ textAlign: 'right' }}>₹85,00,000</td></tr>
                    <tr><td style={{ padding: '4px 16px' }}>• Cloud Hosting, Servers & Utilities</td><td style={{ textAlign: 'right' }}>₹53,00,000</td></tr>
                    <tr style={{ borderTop: '2px solid #000', borderBottom: '3px double #000', fontWeight: 900, fontSize: 14 }}>
                      <td style={{ padding: '8px 0' }}>V. NET PROFIT BEFORE TAX (EBITDA)</td>
                      <td style={{ textAlign: 'right', color: '#047857' }}>₹3,72,00,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* STATUTORY SIGNATURE BLOCK */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 20, borderTop: '1px solid #d1d5db', fontSize: 11 }}>
                <div>
                  <strong>Prepared By:</strong><br />
                  Rohan Joshi<br />
                  Senior Accounts Manager
                </div>
                <div>
                  <strong>Verified & Reconciled:</strong><br />
                  Vikas Shah (FCA)<br />
                  Statutory Tax Auditor
                </div>
                <div>
                  <strong>Authorized Signatory:</strong><br />
                  Anil Deshmukh<br />
                  Chief Financial Officer (CFO)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
