"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Search,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Shield,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Briefcase,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Clock,
  Eye,
  Edit,
  Send,
  Plus,
  FileText,
  Settings,
  LayoutDashboard,
  BarChart,
  PieChart,
  Home,
  FolderKanban,
  GitBranch,
  Server,
  Zap,
  Coffee,
  UserCheck,
  UserX,
  UserMinus,
  UserPlus,
  CalendarDays,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  RefreshCw,
  MoreHorizontal,
  Paperclip,
  Upload,
  Check,
  Circle,
  CircleDot,
  CircleOff,
  Loader2,
  FolderTree,
  ShieldAlert,
  FileCheck,
  FileX,
  Award,
  Star,
  Trophy,
  Flame,
  Sparkles,
  Globe,
  MapPin,
  Phone,
  Mail,
  Link,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Activity,
  Gauge,
  Timer,
  Wallet,
  CreditCard,
  Receipt,
  PiggyBank,
  Landmark,
  Store,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Package,
  Box,
  Clipboard,
  FileCheck2,
  FileSearch,
  FileSpreadsheet,
  FileBarChart,
  FilePieChart,
  Settings2,
  Key,
  Lock,
  Unlock,
  Fingerprint,
  Scan,
  QrCode,
  BadgeCheck,
  BadgeX,
  BadgeAlert,
  BellRing,
  Volume2,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileJson,
  FileCss,
  FileHtml,
  FileJs,
  FileTs,
  FileReact,
  FileNode,
  FilePython,
  FileJava,
  FilePhp,
  FileRuby,
  FileGo,
  FileRust,
  FileSwift,
  FileKotlin,
  FileDart,
  FileSql,
  FileMarkdown,
  FileYaml,
  FileToml,
  FileIni,
  FileConf,
  FileLog,
  FileDiff,
  FilePatch,
  FileBinary,
  FileUnknown,
} from "lucide-react";

const UsersIcon = Users;

// ============================================================
// 2. MOCK DATA
// ============================================================

const MOCK_KPIS = [
  { label: "Total Revenue", value: "₹4,82,50,000", change: 12.5, changeType: "up", icon: <DollarSign size={18} />, color: "text-green-600" },
  { label: "Total Expenses", value: "₹2,31,20,000", change: 4.2, changeType: "up", icon: <TrendingDown size={18} />, color: "text-red-500" },
  { label: "Net Profit", value: "₹2,51,30,000", change: 18.7, changeType: "up", icon: <TrendingUp size={18} />, color: "text-blue-600" },
  { label: "Cash Position", value: "₹1,82,40,000", change: -2.1, changeType: "down", icon: <Wallet size={18} />, color: "text-yellow-600" },
  { label: "Total Customers", value: "24,892", change: 8.3, changeType: "up", icon: <Users size={18} />, color: "text-purple-600" },
  { label: "Total Galleries", value: "47", change: 4, changeType: "up", icon: <Store size={18} />, color: "text-indigo-600" },
  { label: "Total Employees", value: "386", change: 6, changeType: "up", icon: <Users size={18} />, color: "text-teal-600" },
  { label: "Total Leads", value: "3,421", change: -5.2, changeType: "down", icon: <Activity size={18} />, color: "text-orange-500" },
  { label: "Conversion Rate", value: "24.8%", change: 2.1, changeType: "up", icon: <Target size={18} />, color: "text-green-600" },
  { label: "Pending Approvals", value: "18", change: -3, changeType: "down", icon: <FileCheck size={18} />, color: "text-red-500" },
  { label: "Outstanding Payments", value: "₹67,80,000", change: 8.5, changeType: "up", icon: <Receipt size={18} />, color: "text-amber-600" },
  { label: "Outstanding Expenses", value: "₹34,20,000", change: 3.2, changeType: "up", icon: <CreditCard size={18} />, color: "text-rose-500" },
];

const MOCK_GALLERIES = [
  { id: "G1", name: "Pune Gallery", city: "Pune", revenue: 4250000, expenses: 2650000, profit: 1600000, status: "Operational", employees: 24, customers: 1850, leads: 320, conversionRate: 28.5 },
  { id: "G2", name: "Mumbai Gallery", city: "Mumbai", revenue: 3820000, expenses: 2410000, profit: 1410000, status: "Operational", employees: 32, customers: 2100, leads: 380, conversionRate: 31.2 },
  { id: "G3", name: "Nashik Gallery", city: "Nashik", revenue: 2980000, expenses: 1890000, profit: 1090000, status: "Operational", employees: 18, customers: 1240, leads: 210, conversionRate: 26.8 },
  { id: "G4", name: "Nagpur Gallery", city: "Nagpur", revenue: 2470000, expenses: 1620000, profit: 850000, status: "Operational", employees: 16, customers: 980, leads: 175, conversionRate: 24.2 },
  { id: "G5", name: "Kolhapur Gallery", city: "Kolhapur", revenue: 1890000, expenses: 1320000, profit: 570000, status: "Operational", employees: 12, customers: 720, leads: 130, conversionRate: 22.5 },
  { id: "G6", name: "Aurangabad Gallery", city: "Aurangabad", revenue: 1560000, expenses: 1150000, profit: 410000, status: "Underperforming", employees: 10, customers: 540, leads: 95, conversionRate: 18.3 },
  { id: "G7", name: "Solapur Gallery", city: "Solapur", revenue: 980000, expenses: 820000, profit: 160000, status: "Underperforming", employees: 8, customers: 380, leads: 65, conversionRate: 15.7 },
  { id: "G8", name: "Jalgaon Gallery", city: "Jalgaon", revenue: 1240000, expenses: 960000, profit: 280000, status: "Under Setup", employees: 6, customers: 0, leads: 40, conversionRate: 0 },
  { id: "G9", name: "Amravati Gallery", city: "Amravati", revenue: 0, expenses: 450000, profit: -450000, status: "Pending Approval", employees: 0, customers: 0, leads: 0, conversionRate: 0 },
];

const MOCK_FRANCHISE_APPLICATIONS = [
  { id: "F001", applicant: "Rajesh Patil", city: "Surat", location: "Surat City Center", cityCategory: "Metro", proposedInvestment: 3500000, franchiseFee: 1500000, agreementStatus: "Under Review", paymentStatus: "Partial", verificationStatus: "Verified", assignedManager: "Anita Desai", approvalStatus: "Pending", cmdApproval: "Pending", ctoApproval: "Approved", financeApproval: "Pending" },
  { id: "F002", applicant: "Priya Mehta", city: "Vadodara", location: "Vadodara Main", cityCategory: "Urban", proposedInvestment: 2800000, franchiseFee: 1200000, agreementStatus: "Signed", paymentStatus: "Pending", verificationStatus: "Pending", assignedManager: "Suresh Kumar", approvalStatus: "Pending", cmdApproval: "Pending", ctoApproval: "Pending", financeApproval: "Pending" },
  { id: "F003", applicant: "Amit Shah", city: "Indore", location: "Indore Business Hub", cityCategory: "Metro", proposedInvestment: 4200000, franchiseFee: 1800000, agreementStatus: "Signed", paymentStatus: "Paid", verificationStatus: "Verified", assignedManager: "Vikram Singh", approvalStatus: "Approved", cmdApproval: "Approved", ctoApproval: "Approved", financeApproval: "Approved" },
  { id: "F004", applicant: "Neha Reddy", city: "Hyderabad", location: "Hyderabad West", cityCategory: "Metro", proposedInvestment: 5000000, franchiseFee: 2200000, agreementStatus: "Pending", paymentStatus: "Pending", verificationStatus: "Pending", assignedManager: "Rahul Sharma", approvalStatus: "Pending", cmdApproval: "Pending", ctoApproval: "Pending", financeApproval: "Pending" },
  { id: "F005", applicant: "Vikram Deshmukh", city: "Nasik", location: "Nasik East", cityCategory: "Urban", proposedInvestment: 2200000, franchiseFee: 900000, agreementStatus: "Under Review", paymentStatus: "Partial", verificationStatus: "Verified", assignedManager: "Anita Desai", approvalStatus: "Pending", cmdApproval: "Pending", ctoApproval: "Pending", financeApproval: "Pending" },
];

const MOCK_APPROVALS = [
  { id: "A001", type: "Major Expense", requestedBy: "Rahul Sharma", department: "Technology", amount: 2500000, reason: "Server infrastructure upgrade", supportingDocs: ["server_quote.pdf", "specs.docx"], managerApproval: "Approved", departmentHeadApproval: "Approved", cfoApproval: "Pending", ctoApproval: "Approved", ceoApproval: "Pending", cmdDecision: "Pending", date: "2026-08-25" },
  { id: "A002", type: "New Gallery", requestedBy: "Anita Desai", department: "Operations", amount: 5000000, reason: "New gallery in Nagpur", supportingDocs: ["gallery_proposal.pdf", "financial_model.xlsx"], managerApproval: "Approved", departmentHeadApproval: "Approved", cfoApproval: "Approved", ctoApproval: "Pending", ceoApproval: "Pending", cmdDecision: "Pending", date: "2026-08-26" },
  { id: "A003", type: "Franchise Approval", requestedBy: "Vikram Singh", department: "Franchise", amount: 1500000, reason: "Franchise application - Surat", supportingDocs: ["franchise_app.pdf", "agreement.docx"], managerApproval: "Approved", departmentHeadApproval: "Approved", cfoApproval: "Pending", ctoApproval: "Pending", ceoApproval: "Pending", cmdDecision: "Pending", date: "2026-08-24" },
  { id: "A004", type: "Senior Hiring", requestedBy: "Meera Reddy", department: "HR", amount: 0, reason: "Senior Marketing Director position", supportingDocs: ["jd.docx", "candidates.pdf"], managerApproval: "Approved", departmentHeadApproval: "Approved", cfoApproval: "Approved", ctoApproval: "Approved", ceoApproval: "Approved", cmdDecision: "Pending", date: "2026-08-23" },
  { id: "A005", type: "Major Marketing Campaign", requestedBy: "Kiran Joshi", department: "Marketing", amount: 1800000, reason: "Diwali marketing campaign across all galleries", supportingDocs: ["campaign_plan.pdf", "budget.xlsx"], managerApproval: "Approved", departmentHeadApproval: "Approved", cfoApproval: "Pending", ctoApproval: "Pending", ceoApproval: "Pending", cmdDecision: "Pending", date: "2026-08-26" },
  { id: "A006", type: "Vendor Contract", requestedBy: "Priya Shah", department: "Operations", amount: 3200000, reason: "Major vendor contract for gallery supplies", supportingDocs: ["contract.pdf", "vendor_eval.docx"], managerApproval: "Approved", departmentHeadApproval: "Pending", cfoApproval: "Pending", ctoApproval: "Pending", ceoApproval: "Pending", cmdDecision: "Pending", date: "2026-08-26" },
];

const MOCK_DEPARTMENTS = [
  { id: "D1", name: "Finance", head: "Rajiv Shah", employeeCount: 28, budget: 45000000, spent: 38200000 },
  { id: "D2", name: "Accounts", head: "Sneha Patel", employeeCount: 18, budget: 22000000, spent: 19600000 },
  { id: "D3", name: "Payroll", head: "Vikram Rao", employeeCount: 8, budget: 12000000, spent: 11800000 },
  { id: "D4", name: "Technology", head: "Rahul Sharma", employeeCount: 45, budget: 68000000, spent: 52100000 },
  { id: "D5", name: "Android", head: "Amit Kumar", employeeCount: 22, budget: 28000000, spent: 22400000 },
  { id: "D6", name: "AI/ML", head: "Dr. Priya Joshi", employeeCount: 12, budget: 32000000, spent: 18400000 },
  { id: "D7", name: "QA", head: "Suresh Reddy", employeeCount: 15, budget: 18000000, spent: 16200000 },
  { id: "D8", name: "DevOps", head: "Neha Shah", employeeCount: 10, budget: 25000000, spent: 21800000 },
  { id: "D9", name: "Technical Support", head: "Rajesh Nair", employeeCount: 18, budget: 15000000, spent: 12800000 },
  { id: "D10", name: "Marketing", head: "Kiran Joshi", employeeCount: 32, budget: 52000000, spent: 46800000 },
  { id: "D11", name: "Digital Marketing", head: "Ananya Singh", employeeCount: 14, budget: 24000000, spent: 21200000 },
  { id: "D12", name: "Social Media", head: "Meera Rao", employeeCount: 8, budget: 14000000, spent: 11800000 },
  { id: "D13", name: "Telecalling", head: "Sunita Pillai", employeeCount: 22, budget: 16000000, spent: 14200000 },
  { id: "D14", name: "Content", head: "Arjun Mehta", employeeCount: 6, budget: 8000000, spent: 7200000 },
  { id: "D15", name: "HR", head: "Meera Reddy", employeeCount: 16, budget: 38000000, spent: 32600000 },
  { id: "D16", name: "Recruitment", head: "Deepak Sharma", employeeCount: 8, budget: 12000000, spent: 10800000 },
  { id: "D17", name: "Attendance", head: "Priya Menon", employeeCount: 4, budget: 6000000, spent: 5400000 },
  { id: "D18", name: "Employee Management", head: "Vikas Patel", employeeCount: 6, budget: 8000000, spent: 7200000 },
  { id: "D19", name: "Gallery Operations", head: "Anita Desai", employeeCount: 68, budget: 95000000, spent: 82400000 },
  { id: "D20", name: "Gallery Managers", head: "Ramesh Iyer", employeeCount: 28, budget: 38000000, spent: 34200000 },
  { id: "D21", name: "BDE", head: "Sanjay Rao", employeeCount: 18, budget: 22000000, spent: 19600000 },
  { id: "D22", name: "BDO", head: "Nisha Shah", employeeCount: 12, budget: 18000000, spent: 16200000 },
  { id: "D23", name: "Operations", head: "Ravi Kumar", employeeCount: 10, budget: 17000000, spent: 12400000 },
];

const MOCK_EMPLOYEES = [
  { id: "E1", name: "Rajiv Shah", role: "CFO", department: "Finance", status: "Active", joinDate: "2020-01-15", performance: 94, attendance: 98 },
  { id: "E2", name: "Rahul Sharma", role: "CTO", department: "Technology", status: "Active", joinDate: "2019-06-01", performance: 96, attendance: 97 },
  { id: "E3", name: "Kiran Joshi", role: "CMO", department: "Marketing", status: "Active", joinDate: "2020-03-10", performance: 91, attendance: 95 },
  { id: "E4", name: "Meera Reddy", role: "HR Head", department: "HR", status: "Active", joinDate: "2018-11-20", performance: 93, attendance: 96 },
  { id: "E5", name: "Anita Desai", role: "Operations Head", department: "Gallery Operations", status: "Active", joinDate: "2019-09-05", performance: 92, attendance: 94 },
  { id: "E6", name: "Amit Kumar", role: "Android Lead", department: "Android", status: "Active", joinDate: "2020-07-12", performance: 88, attendance: 92 },
  { id: "E7", name: "Suresh Reddy", role: "QA Lead", department: "QA", status: "Active", joinDate: "2021-02-14", performance: 85, attendance: 90 },
  { id: "E8", name: "Neha Shah", role: "DevOps Lead", department: "DevOps", status: "Active", joinDate: "2020-05-22", performance: 87, attendance: 91 },
  { id: "E9", name: "Priya Menon", role: "HR Manager", department: "Attendance", status: "Active", joinDate: "2021-08-01", performance: 84, attendance: 89 },
  { id: "E10", name: "Ramesh Iyer", role: "Gallery Manager", department: "Gallery Managers", status: "Active", joinDate: "2019-12-15", performance: 86, attendance: 93 },
  { id: "E11", name: "Sanjay Rao", role: "BDE Lead", department: "BDE", status: "Active", joinDate: "2020-10-01", performance: 82, attendance: 88 },
  { id: "E12", name: "Nisha Shah", role: "BDO Lead", department: "BDO", status: "On Leave", joinDate: "2020-04-10", performance: 79, attendance: 82 },
  { id: "E13", name: "Ravi Kumar", role: "Operations Manager", department: "Operations", status: "Active", joinDate: "2021-06-20", performance: 80, attendance: 85 },
  { id: "E14", name: "Sunita Pillai", role: "Telecalling Lead", department: "Telecalling", status: "Active", joinDate: "2020-11-05", performance: 78, attendance: 84 },
  { id: "E15", name: "Arjun Mehta", role: "Content Lead", department: "Content", status: "Active", joinDate: "2021-03-18", performance: 81, attendance: 87 },
];

const MOCK_LEADS = [
  { id: "L1", name: "Vikram Patil", source: "Instagram", gallery: "Pune Gallery", status: "Qualified", createdAt: "2026-08-26", value: 850000 },
  { id: "L2", name: "Sneha Sharma", source: "Facebook", gallery: "Mumbai Gallery", status: "Interested", createdAt: "2026-08-26", value: 420000 },
  { id: "L3", name: "Rahul Jain", source: "Google Ads", gallery: "Nashik Gallery", status: "Contacted", createdAt: "2026-08-25", value: 280000 },
  { id: "L4", name: "Priya Kulkarni", source: "WhatsApp", gallery: "Nagpur Gallery", status: "Converted", createdAt: "2026-08-24", value: 1200000 },
  { id: "L5", name: "Amit Deshmukh", source: "YouTube", gallery: "Kolhapur Gallery", status: "Follow-up", createdAt: "2026-08-23", value: 320000 },
  { id: "L6", name: "Neha Reddy", source: "LinkedIn", gallery: "Aurangabad Gallery", status: "New", createdAt: "2026-08-26", value: 150000 },
  { id: "L7", name: "Vikas Sharma", source: "SEO", gallery: "Solapur Gallery", status: "Lost", createdAt: "2026-08-22", value: 0 },
  { id: "L8", name: "Rupali Patil", source: "Instagram", gallery: "Pune Gallery", status: "Qualified", createdAt: "2026-08-21", value: 680000 },
  { id: "L9", name: "Suresh Reddy", source: "Facebook", gallery: "Mumbai Gallery", status: "Interested", createdAt: "2026-08-20", value: 350000 },
  { id: "L10", name: "Kiran Joshi", source: "Google Ads", gallery: "Nashik Gallery", status: "Converted", createdAt: "2026-08-19", value: 950000 },
];

const MOCK_CAMPAIGNS = [
  { id: "C1", name: "Summer Sale 2026", channel: "Instagram", budget: 500000, spent: 380000, leads: 420, conversions: 98, revenue: 2400000, status: "Active", startDate: "2026-06-01", endDate: "2026-08-31" },
  { id: "C2", name: "Festival Special", channel: "Facebook", budget: 800000, spent: 620000, leads: 580, conversions: 132, revenue: 3200000, status: "Active", startDate: "2026-07-15", endDate: "2026-09-15" },
  { id: "C3", name: "New Gallery Launch", channel: "Google Ads", budget: 300000, spent: 280000, leads: 210, conversions: 48, revenue: 1200000, status: "Completed", startDate: "2026-05-01", endDate: "2026-07-31" },
  { id: "C4", name: "Brand Awareness", channel: "YouTube", budget: 600000, spent: 450000, leads: 340, conversions: 76, revenue: 1800000, status: "Active", startDate: "2026-08-01", endDate: "2026-10-31" },
  { id: "C5", name: "WhatsApp Marketing", channel: "WhatsApp", budget: 200000, spent: 150000, leads: 280, conversions: 64, revenue: 1500000, status: "Completed", startDate: "2026-04-01", endDate: "2026-06-30" },
];

const MOCK_VENDORS = [
  { id: "V1", name: "Sunrise Supplies", service: "Gallery Equipment", status: "Active", revenue: 4500000, payments: 3200000, outstanding: 1300000, performance: 92 },
  { id: "V2", name: "Tech Solutions Inc", service: "Software Licensing", status: "Active", revenue: 2800000, payments: 2100000, outstanding: 700000, performance: 88 },
  { id: "V3", name: "Global Logistics", service: "Shipping & Logistics", status: "Active", revenue: 1800000, payments: 1400000, outstanding: 400000, performance: 85 },
  { id: "V4", name: "Creative Agency", service: "Marketing & Advertising", status: "Pending Approval", revenue: 0, payments: 0, outstanding: 0, performance: 0 },
  { id: "V5", name: "Secure IT", service: "Cybersecurity", status: "Active", revenue: 1200000, payments: 950000, outstanding: 250000, performance: 90 },
];

const MOCK_RISKS = [
  { id: "R1", category: "Financial", level: "High", description: "Rising operational costs in 3 galleries", department: "Finance", owner: "Rajiv Shah", identifiedDate: "2026-08-20", impact: "Profit margin reduction of 5%", probability: "High", mitigation: "Cost optimization review", status: "In Progress", escalationLevel: "CFO" },
  { id: "R2", category: "Security", level: "Critical", description: "Potential data breach in CRM system", department: "Technology", owner: "Rahul Sharma", identifiedDate: "2026-08-22", impact: "Customer data exposure", probability: "Medium", mitigation: "Security audit and patch", status: "Open", escalationLevel: "CMD" },
  { id: "R3", category: "Compliance", level: "High", description: "New regulatory requirements for franchise operations", department: "Legal", owner: "Anita Desai", identifiedDate: "2026-08-18", impact: "Potential legal penalties", probability: "High", mitigation: "Compliance review", status: "In Progress", escalationLevel: "CEO" },
  { id: "R4", category: "Operational", level: "Medium", description: "Supply chain disruption for gallery equipment", department: "Operations", owner: "Ravi Kumar", identifiedDate: "2026-08-15", impact: "Delayed gallery launches", probability: "Medium", mitigation: "Alternate suppliers identified", status: "In Progress", escalationLevel: "Department" },
  { id: "R5", category: "Reputation", level: "Low", description: "Negative social media feedback", department: "Marketing", owner: "Kiran Joshi", identifiedDate: "2026-08-10", impact: "Brand perception", probability: "Low", mitigation: "Social listening and response", status: "Resolved", escalationLevel: "Department" },
];

const MOCK_STRATEGIC_GOALS = [
  { id: "SG1", goal: "Achieve ₹50 Crore Annual Revenue", department: "Finance", owner: "Rajiv Shah", startDate: "2026-01-01", targetDate: "2026-12-31", kpi: "Annual Revenue", target: 500000000, currentValue: 482500000, progress: 96.5, status: "In Progress", priority: "High" },
  { id: "SG2", goal: "Expand to 50 Galleries", department: "Gallery Operations", owner: "Anita Desai", startDate: "2026-01-01", targetDate: "2026-12-31", kpi: "Total Galleries", target: 50, currentValue: 47, progress: 94, status: "In Progress", priority: "High" },
  { id: "SG3", goal: "Increase Customer Base to 30,000", department: "Marketing", owner: "Kiran Joshi", startDate: "2026-01-01", targetDate: "2026-12-31", kpi: "Total Customers", target: 30000, currentValue: 24892, progress: 83, status: "In Progress", priority: "Medium" },
  { id: "SG4", goal: "Launch 10 New Franchises", department: "Franchise", owner: "Vikram Singh", startDate: "2026-01-01", targetDate: "2026-12-31", kpi: "Franchise Count", target: 10, currentValue: 4, progress: 40, status: "In Progress", priority: "High" },
  { id: "SG5", goal: "Improve Employee Satisfaction to 90%", department: "HR", owner: "Meera Reddy", startDate: "2026-01-01", targetDate: "2026-12-31", kpi: "Satisfaction Score", target: 90, currentValue: 82, progress: 91, status: "In Progress", priority: "Medium" },
  { id: "SG6", goal: "Complete AI/ML Integration", department: "AI/ML", owner: "Dr. Priya Joshi", startDate: "2026-04-01", targetDate: "2026-09-30", kpi: "Integration Progress", target: 100, currentValue: 65, progress: 65, status: "In Progress", priority: "High" },
];

const MOCK_EXPANSION_PROPOSALS = [
  { id: "EP1", city: "Surat", type: "Franchise", investment: 3500000, expectedRevenue: 2800000, expectedROI: 25, status: "Management Approval", stage: 4, approvalStatus: "Pending" },
  { id: "EP2", city: "Vadodara", type: "Franchise", investment: 2800000, expectedRevenue: 2100000, expectedROI: 20, status: "Financial Evaluation", stage: 3, approvalStatus: "Pending" },
  { id: "EP3", city: "Indore", type: "Gallery", investment: 5000000, expectedRevenue: 4200000, expectedROI: 28, status: "Agreement", stage: 5, approvalStatus: "Approved" },
  { id: "EP4", city: "Hyderabad", type: "Franchise", investment: 5000000, expectedRevenue: 4200000, expectedROI: 24, status: "Proposed", stage: 1, approvalStatus: "Pending" },
  { id: "EP5", city: "Nasik", type: "Gallery", investment: 3800000, expectedRevenue: 3200000, expectedROI: 26, status: "Launch", stage: 8, approvalStatus: "Approved" },
];

const MOCK_NOTIFICATIONS = [
  { id: "N1", message: "New franchise application from Surat requires CMD approval", time: "10:25 AM", read: false, type: "approval", priority: "high" },
  { id: "N2", message: "Critical security alert: Potential data breach in CRM", time: "09:45 AM", read: false, type: "risk", priority: "high" },
  { id: "N3", message: "Q3 revenue target achieved - 96.5% progress", time: "Yesterday", read: false, type: "report", priority: "medium" },
  { id: "N4", message: "New gallery proposal from Nagpur awaiting approval", time: "Yesterday", read: true, type: "approval", priority: "medium" },
  { id: "N5", message: "CFO approved major expense request", time: "2 days ago", read: true, type: "system", priority: "low" },
  { id: "N6", message: "Franchise agreement signed for Indore", time: "2 days ago", read: true, type: "system", priority: "low" },
  { id: "N7", message: "Strategic goal update: 50 Galleries target at 94%", time: "3 days ago", read: true, type: "report", priority: "medium" },
  { id: "N8", message: "Risk mitigation plan required for operational risk", time: "3 days ago", read: true, type: "risk", priority: "medium" },
];

const MOCK_ACTIVITY_LOGS = [
  { id: "AL1", user: "CMD", action: "Approved ₹30,00,000 franchise agreement", module: "Franchise", recordId: "F003", previousValue: "Pending", newValue: "Approved", date: "2026-08-26", time: "11:30 AM", ip: "192.168.1.1", device: "Desktop - Chrome", reason: "Due diligence completed", approvalReference: "F003" },
  { id: "AL2", user: "CMD", action: "Rejected marketing budget request", module: "Marketing", recordId: "M001", previousValue: "Pending", newValue: "Rejected", date: "2026-08-25", time: "04:15 PM", ip: "192.168.1.1", device: "Desktop - Chrome", reason: "Budget already allocated", approvalReference: "M001" },
  { id: "AL3", user: "CMD", action: "Approved new gallery in Nagpur", module: "Gallery", recordId: "G10", previousValue: "Pending", newValue: "Approved", date: "2026-08-24", time: "10:00 AM", ip: "192.168.1.1", device: "Mobile - Safari", reason: "Strong business case", approvalReference: "A002" },
  { id: "AL4", user: "CMD", action: "Changed strategic target for revenue", module: "Strategy", recordId: "SG1", previousValue: "₹45 Crore", newValue: "₹50 Crore", date: "2026-08-23", time: "09:30 AM", ip: "192.168.1.1", device: "Desktop - Chrome", reason: "Growth acceleration", approvalReference: "SG1" },
  { id: "AL5", user: "CMD", action: "Approved senior hiring for Marketing Director", module: "HR", recordId: "E16", previousValue: "Pending", newValue: "Approved", date: "2026-08-22", time: "02:45 PM", ip: "192.168.1.1", device: "Desktop - Chrome", reason: "Strong candidate", approvalReference: "A004" },
];

// ============================================================
// 3. UTILITY COMPONENTS
// ============================================================

const StatusBadge = ({ status }) => {
  const colors = {
    "Active": "bg-green-500",
    "Operational": "bg-green-500",
    "On Leave": "bg-yellow-500",
    "On Notice": "bg-orange-500",
    "Inactive": "bg-gray-400",
    "Pending": "bg-yellow-500",
    "Approved": "bg-green-500",
    "Rejected": "bg-red-500",
    "Under Review": "bg-blue-500",
    "Paid": "bg-green-500",
    "Partial": "bg-orange-500",
    "Verified": "bg-green-500",
    "Failed": "bg-red-500",
    "Under Setup": "bg-blue-500",
    "Pending Approval": "bg-yellow-500",
    "Underperforming": "bg-red-500",
    "Open": "bg-red-500",
    "In Progress": "bg-blue-500",
    "Resolved": "bg-green-500",
    "Closed": "bg-gray-400",
    "Completed": "bg-green-500",
    "Draft": "bg-gray-400",
    "Paused": "bg-orange-500",
    "High": "bg-red-500",
    "Medium": "bg-yellow-500",
    "Low": "bg-blue-500",
    "Critical": "bg-red-600",
    "Proposed": "bg-gray-400",
    "Location Research": "bg-blue-300",
    "Financial Evaluation": "bg-blue-400",
    "Management Approval": "bg-yellow-500",
    "Agreement": "bg-green-300",
    "Payment": "bg-green-400",
    "Setup": "bg-green-500",
    "Launch": "bg-purple-500",
    "Signed": "bg-green-500",
    "New": "bg-blue-500",
    "Contacted": "bg-indigo-500",
    "Interested": "bg-yellow-500",
    "Follow-up": "bg-orange-500",
    "Qualified": "bg-purple-500",
    "Converted": "bg-green-500",
    "Lost": "bg-red-500",
    "Metro": "bg-purple-500",
    "Urban": "bg-blue-500",
    "Rural": "bg-green-500",
    "Changes Required": "bg-orange-500",
    "In Review": "bg-purple-500",
    "Merged": "bg-purple-600",
    "CMD": "bg-indigo-600",
    "CEO": "bg-blue-600",
    "CTO": "bg-cyan-600",
    "CFO": "bg-emerald-600",
    "Department": "bg-gray-500",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${colors[status] || "bg-gray-500"}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const colors = {
    "Critical": "bg-red-600",
    "High": "bg-red-500",
    "Medium": "bg-yellow-500",
    "Low": "bg-blue-500",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${colors[priority] || "bg-gray-500"}`}>
      {priority}
    </span>
  );
};

const ProgressBar = ({ value, color = "bg-blue-600", label }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs">
        {label && <span className="text-gray-600">{label}</span>}
        <span className="font-medium text-gray-700">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
};

const ChangeIndicator = ({ change, type }) => {
  if (type === "neutral") return <span className="text-gray-400 text-xs">0%</span>;
  return (
    <span className={`text-xs font-medium flex items-center gap-0.5 ${type === "up" ? "text-green-600" : "text-red-500"}`}>
      {type === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(change)}%
    </span>
  );
};

// ============================================================
// 4. MAIN DASHBOARD COMPONENT
// ============================================================

export default function CMDDashboard() {
  const { user, logout } = useAuth();

  // ---- STATE ----
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showApprovals, setShowApprovals] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());

  // ---- EFFECTS ----
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ---- HANDLERS ----
  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out of CMD Command Center?")) {
      await logout();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
  };

  const handleApprovalDecision = (id, decision) => {
    setMOCK_APPROVALS(prev => prev.map(a => a.id === id ? { ...a, cmdDecision: decision, decisionDate: new Date().toISOString().split('T')[0] } : a));
    setShowApprovalModal(false);
    alert(`✅ Approval ${decision.toLowerCase()} for #${id}`);
  };

  const handleRiskUpdate = (id, status, remarks) => {
    setMOCK_RISKS(prev => prev.map(r => r.id === id ? { ...r, status, cmdRemarks: remarks || r.cmdRemarks } : r));
    setShowRiskModal(false);
    alert(`✅ Risk #${id} updated to ${status}`);
  };

  const handleMarkNotificationRead = (id) => {
    setMOCK_NOTIFICATIONS(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setMOCK_NOTIFICATIONS(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ---- MOCK STATE WITH SETTERS ----
  const [mockApprovals, setMOCK_APPROVALS] = useState(MOCK_APPROVALS);
  const [mockRisks, setMOCK_RISKS] = useState(MOCK_RISKS);
  const [mockNotifications, setMOCK_NOTIFICATIONS] = useState(MOCK_NOTIFICATIONS);
  const [mockLeads, setMOCK_LEADS] = useState(MOCK_LEADS);
  const [mockExpansion, setMOCK_EXPANSION] = useState(MOCK_EXPANSION_PROPOSALS);
  const [mockGoals, setMOCK_GOALS] = useState(MOCK_STRATEGIC_GOALS);

  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const pendingApprovals = mockApprovals.filter(a => a.cmdDecision === "Pending").length;
  const criticalRisks = mockRisks.filter(r => r.level === "Critical" && r.status !== "Resolved" && r.status !== "Closed").length;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ---- SIDEBAR ---- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-auto
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">eP</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">ePay CRM</span>
              <span className="block text-xs text-indigo-600 font-medium">CMD Command Center</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Command Center</div>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700">
                  <LayoutDashboard size={18} />
                  <span className="font-medium">Dashboard</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Business</div>
            <ul className="space-y-1">
              {["Business Overview", "Revenue", "Profitability", "Business Targets", "Strategic KPIs"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Business Overview" && <PieChart size={18} />}
                    {item === "Revenue" && <DollarSign size={18} />}
                    {item === "Profitability" && <TrendingUp size={18} />}
                    {item === "Business Targets" && <Target size={18} />}
                    {item === "Strategic KPIs" && <Gauge size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Galleries</div>
            <ul className="space-y-1">
              {["All Galleries", "Gallery Performance", "Gallery Revenue", "Gallery Expenses", "Expansion"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "All Galleries" && <Store size={18} />}
                    {item === "Gallery Performance" && <BarChart size={18} />}
                    {item === "Gallery Revenue" && <DollarSign size={18} />}
                    {item === "Gallery Expenses" && <CreditCard size={18} />}
                    {item === "Expansion" && <Plus size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Franchise</div>
            <ul className="space-y-1">
              {["Applications", "Agreements", "Payments", "Franchise Network", "Franchise Performance"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Applications" && <FileText size={18} />}
                    {item === "Agreements" && <FileCheck size={18} />}
                    {item === "Payments" && <Wallet size={18} />}
                    {item === "Franchise Network" && <Users size={18} />}
                    {item === "Franchise Network" && <UsersIcon size={18} />}
                    {item === "Franchise Performance" && <Activity size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Finance</div>
            <ul className="space-y-1">
              {["Financial Overview", "Revenue", "Expenses", "Profit", "Cash Flow", "Financial Reports"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Financial Overview" && <Landmark size={18} />}
                    {item === "Revenue" && <DollarSign size={18} />}
                    {item === "Expenses" && <CreditCard size={18} />}
                    {item === "Profit" && <TrendingUp size={18} />}
                    {item === "Cash Flow" && <Wallet size={18} />}
                    {item === "Financial Reports" && <FileBarChart size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sales & CRM</div>
            <ul className="space-y-1">
              {["Sales", "Customers", "Leads", "Orders", "Membership", "Complaints"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Sales" && <ShoppingBag size={18} />}
                    {item === "Customers" && <Users size={18} />}
                    {item === "Leads" && <Activity size={18} />}
                    {item === "Orders" && <ShoppingCart size={18} />}
                    {item === "Membership" && <BadgeCheck size={18} />}
                    {item === "Complaints" && <AlertCircle size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Marketing</div>
            <ul className="space-y-1">
              {["Marketing Overview", "Campaigns", "Social Media", "Advertising", "Lead Generation", "Marketing ROI"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Marketing Overview" && <PieChart size={18} />}
                    {item === "Campaigns" && <FileText size={18} />}
                    {item === "Social Media" && <UsersIcon size={18} />}
                    {item === "Advertising" && <Volume2 size={18} />}
                    {item === "Lead Generation" && <Target size={18} />}
                    {item === "Marketing ROI" && <TrendingUp size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Organization</div>
            <ul className="space-y-1">
              {["Employees", "Departments", "Performance", "Recruitment", "HR Overview"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Employees" && <UsersIcon size={18} />}
                    {item === "Departments" && <Building2 size={18} />}
                    {item === "Performance" && <BarChart size={18} />}
                    {item === "Recruitment" && <UserPlus size={18} />}
                    {item === "HR Overview" && <Briefcase size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Technology</div>
            <ul className="space-y-1">
              {["System Status", "Projects", "Critical Issues", "Security", "CTO Reports"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "System Status" && <Server size={18} />}
                    {item === "Projects" && <FolderKanban size={18} />}
                    {item === "Critical Issues" && <AlertTriangle size={18} />}
                    {item === "Security" && <Shield size={18} />}
                    {item === "CTO Reports" && <FileCode size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vendors</div>
            <ul className="space-y-1">
              {["Vendors", "Vendor Performance", "Payments", "Commissions"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Vendors" && <Truck size={18} />}
                    {item === "Vendor Performance" && <Activity size={18} />}
                    {item === "Payments" && <Receipt size={18} />}
                    {item === "Commissions" && <DollarSign size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Risk & Compliance</div>
            <ul className="space-y-1">
              {["Risk Center", "Security Alerts", "Legal", "Compliance"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Risk Center" && <ShieldAlert size={18} />}
                    {item === "Security Alerts" && <BellRing size={18} />}
                    {item === "Legal" && <FileCheck2 size={18} />}
                    {item === "Compliance" && <BadgeCheck size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Approval Center</div>
            <ul className="space-y-1">
              {["Pending Approvals", "Approved", "Rejected", "Approval History"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Pending Approvals" && <Clock size={18} />}
                    {item === "Approved" && <CheckCircle size={18} />}
                    {item === "Rejected" && <XCircle size={18} />}
                    {item === "Approval History" && <FileText size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Reports</div>
            <ul className="space-y-1">
              {["Executive MIS", "Financial", "Sales", "Marketing", "HR", "Technology", "Gallery", "Custom Reports"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Executive MIS" && <FileSpreadsheet size={18} />}
                    {item === "Financial" && <FileBarChart size={18} />}
                    {item === "Sales" && <FilePieChart size={18} />}
                    {item === "Marketing" && <FileText size={18} />}
                    {item === "HR" && <UsersIcon size={18} />}
                    {item === "Technology" && <FileCode size={18} />}
                    {item === "Gallery" && <Store size={18} />}
                    {item === "Custom Reports" && <FileSearch size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Settings</div>
            <ul className="space-y-1">
              {["CMD Preferences", "Security", "Approval Rules", "Audit Logs"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "CMD Preferences" && <Settings2 size={18} />}
                    {item === "Security" && <Lock size={18} />}
                    {item === "Approval Rules" && <FileCheck size={18} />}
                    {item === "Audit Logs" && <FileText size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700 text-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "CM"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{user?.name || "CMD User"}</div>
              <div className="text-xs text-gray-500 truncate">{user?.designation || "Chairman & Managing Director"}</div>
            </div>
            <button onClick={handleLogout} className="p-1 hover:bg-gray-100 rounded text-gray-500" title="Log Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ---- MAIN CONTENT ---- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ---- HEADER ---- */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1 mr-2 rounded hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-7 h-7 bg-indigo-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">eP</span>
              </div>
            </div>
            <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">CMD Command Center</h1>
          </div>

          {/* Date & Time */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5 mx-4">
            <Calendar size={14} />
            <span>{currentTime.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span className="text-gray-400">|</span>
            <Clock size={14} />
            <span>{currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>

          {/* Search */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 flex-1 max-w-sm">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search business data..."
              className="bg-transparent border-none outline-none text-sm px-2 w-full text-gray-700"
            />
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Critical Alerts */}
            {criticalRisks > 0 && (
              <button className="relative p-1.5 rounded hover:bg-gray-100">
                <AlertTriangle size={20} className="text-red-500" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {criticalRisks}
                </span>
              </button>
            )}

            {/* Approval Center */}
            <div className="relative">
              <button
                onClick={() => setShowApprovals(!showApprovals)}
                className="relative p-1.5 rounded hover:bg-gray-100"
              >
                <FileCheck size={20} className="text-gray-600" />
                {pendingApprovals > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {pendingApprovals}
                  </span>
                )}
              </button>
              {showApprovals && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                    <span className="font-semibold text-sm">Pending Approvals</span>
                    <button onClick={() => setShowApprovals(false)} className="text-xs text-blue-600 hover:underline">View all</button>
                  </div>
                  {mockApprovals.filter(a => a.cmdDecision === "Pending").length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No pending approvals</div>
                  ) : (
                    mockApprovals.filter(a => a.cmdDecision === "Pending").map((a) => (
                      <div key={a.id} className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-medium text-gray-800">{a.type}</div>
                            <div className="text-xs text-gray-500">{a.requestedBy} · {a.department}</div>
                            <div className="text-xs font-medium text-gray-700">₹{a.amount.toLocaleString()}</div>
                          </div>
                          <StatusBadge status="Pending" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded hover:bg-gray-100"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                    <span className="font-semibold text-sm">Notifications</span>
                    <button onClick={handleMarkAllRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                  </div>
                  {mockNotifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                  ) : (
                    mockNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!n.read ? "bg-indigo-50" : ""}`}
                        onClick={() => handleMarkNotificationRead(n.id)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            {n.type === "approval" && <FileCheck size={14} className="text-amber-500" />}
                            {n.type === "risk" && <AlertTriangle size={14} className="text-red-500" />}
                            {n.type === "report" && <FileText size={14} className="text-blue-500" />}
                            {n.type === "system" && <Bell size={14} className="text-gray-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-800">{n.message}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{n.time}</div>
                          </div>
                          {n.priority === "high" && <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 animate-pulse" />}
                          {!n.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <button className="p-1.5 rounded hover:bg-gray-100 relative">
              <MessageSquare size={20} className="text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 text-white text-[10px] rounded-full flex items-center justify-center">5</span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 ml-1">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700 text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "CM"}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-gray-800 leading-none">{user?.name ? user.name.split(" ")[0] : "CMD"}</div>
                <div className="text-[10px] text-gray-500 font-medium">Owner</div>
              </div>
            </div>

            {/* Secure Mode */}
            <button className="hidden sm:flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
              <Shield size={14} />
              Secure
            </button>
          </div>
        </header>

        {/* ---- DASHBOARD CONTENT ---- */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Executive Overview - KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {MOCK_KPIS.map((kpi, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-500 text-sm font-medium">{kpi.label}</div>
                    <div className={`${kpi.color || "text-gray-400"}`}>{kpi.icon}</div>
                  </div>
                  <div className="text-xl font-bold text-gray-800 mt-1">{kpi.value}</div>
                  {kpi.change !== undefined && (
                    <div className="flex items-center gap-1 mt-1">
                      <ChangeIndicator change={kpi.change} type={kpi.changeType || "neutral"} />
                      <span className="text-xs text-gray-400">vs last period</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Business Command Center */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Performance</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Today's Revenue</div>
                  <div className="text-sm font-bold text-gray-800">₹18.2L</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Monthly Revenue</div>
                  <div className="text-sm font-bold text-blue-600">₹4.82Cr</div>
                  <div className="text-xs text-green-600">+12.5%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Annual Revenue</div>
                  <div className="text-sm font-bold text-indigo-600">₹48.25Cr</div>
                  <div className="text-xs text-green-600">+18.7%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Gross Profit</div>
                  <div className="text-sm font-bold text-green-600">₹25.13Cr</div>
                  <div className="text-xs text-green-600">52.1%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Net Profit</div>
                  <div className="text-sm font-bold text-emerald-600">₹18.92Cr</div>
                  <div className="text-xs text-green-600">39.2%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Profit Margin</div>
                  <div className="text-sm font-bold text-purple-600">39.2%</div>
                  <div className="text-xs text-green-600">+2.1%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Expense Ratio</div>
                  <div className="text-sm font-bold text-rose-600">47.9%</div>
                  <div className="text-xs text-red-500">-1.2%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Sales Target</div>
                  <div className="text-sm font-bold text-amber-600">₹50Cr</div>
                  <div className="text-xs text-green-600">96.5%</div>
                </div>
              </div>
            </div>

            {/* Gallery Network */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Gallery Network</h2>
                  <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-lg font-bold text-gray-800">47</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Operational</div>
                    <div className="text-lg font-bold text-green-600">42</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Under Setup</div>
                    <div className="text-lg font-bold text-blue-600">3</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Pending Approval</div>
                    <div className="text-lg font-bold text-yellow-600">1</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Underperforming</div>
                    <div className="text-lg font-bold text-red-500">2</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Top Performer</div>
                    <div className="text-lg font-bold text-purple-600">Pune</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Gallery Ranking</h3>
                  {MOCK_GALLERIES.slice(0, 5).map((g, idx) => (
                    <div key={g.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 w-5">{idx + 1}.</span>
                        <span className="text-sm font-medium text-gray-800">{g.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-indigo-600">₹{(g.revenue / 100000).toFixed(1)}L</span>
                        <StatusBadge status={g.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Franchise Command Center */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Franchise Command Center</h2>
                  <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Applications</div>
                    <div className="text-lg font-bold text-gray-800">12</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Pending Approvals</div>
                    <div className="text-lg font-bold text-yellow-600">4</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Approved</div>
                    <div className="text-lg font-bold text-green-600">6</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Active Franchise</div>
                    <div className="text-lg font-bold text-blue-600">4</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Franchise Revenue</div>
                    <div className="text-lg font-bold text-indigo-600">₹8.4Cr</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Franchise Fees</div>
                    <div className="text-lg font-bold text-emerald-600">₹3.2Cr</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Recent Applications</h3>
                  {MOCK_FRANCHISE_APPLICATIONS.slice(0, 4).map((app) => (
                    <div key={app.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{app.applicant}</div>
                        <div className="text-xs text-gray-500">{app.city} · {app.cityCategory}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">₹{(app.franchiseFee / 100000).toFixed(1)}L</span>
                        <StatusBadge status={app.approvalStatus} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Command Center */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Financial Command Center</h2>
                <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                  View Full Financials <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Total Revenue</div>
                  <div className="text-sm font-bold text-gray-800">₹48.25Cr</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Total Expenses</div>
                  <div className="text-sm font-bold text-rose-600">₹23.12Cr</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Net Profit</div>
                  <div className="text-sm font-bold text-green-600">₹18.92Cr</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Cash Flow</div>
                  <div className="text-sm font-bold text-blue-600">₹3.8Cr</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Receivables</div>
                  <div className="text-sm font-bold text-amber-600">₹6.78Cr</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Payables</div>
                  <div className="text-sm font-bold text-red-500">₹3.42Cr</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Salary Expense</div>
                  <div className="text-sm font-bold text-gray-700">₹8.4Cr</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Marketing Expense</div>
                  <div className="text-sm font-bold text-purple-600">₹4.2Cr</div>
                </div>
              </div>
            </div>

            {/* Approval Center - Main */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Approval Center</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{pendingApprovals} pending</span>
                  <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2 font-medium">ID</th>
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Requested By</th>
                      <th className="pb-2 font-medium">Department</th>
                      <th className="pb-2 font-medium text-right">Amount</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockApprovals.slice(0, 5).map((a) => (
                      <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 font-mono text-xs text-gray-500">{a.id}</td>
                        <td className="py-2 font-medium text-gray-800">{a.type}</td>
                        <td className="py-2 text-gray-600">{a.requestedBy}</td>
                        <td className="py-2 text-gray-600">{a.department}</td>
                        <td className="py-2 text-right font-medium text-gray-800">₹{a.amount.toLocaleString()}</td>
                        <td className="py-2">
                          {a.cmdDecision === "Pending" ? (
                            <StatusBadge status="Pending" />
                          ) : a.cmdDecision === "Approved" ? (
                            <StatusBadge status="Approved" />
                          ) : (
                            <StatusBadge status="Rejected" />
                          )}
                        </td>
                        <td className="py-2">
                          {a.cmdDecision === "Pending" && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setSelectedApproval(a);
                                  setShowApprovalModal(true);
                                }}
                                className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
                              >
                                Review
                              </button>
                            </div>
                          )}
                          {a.cmdDecision !== "Pending" && (
                            <span className="text-xs text-gray-400">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Organization Overview + Employee */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Organization Overview</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Total Employees</div>
                    <div className="text-xl font-bold text-gray-800">386</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Departments</div>
                    <div className="text-xl font-bold text-gray-800">23</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">New Joiners</div>
                    <div className="text-xl font-bold text-green-600">8</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">On Leave</div>
                    <div className="text-xl font-bold text-yellow-600">12</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">On Notice</div>
                    <div className="text-xl font-bold text-orange-500">3</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Open Positions</div>
                    <div className="text-xl font-bold text-blue-600">15</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Attendance:</span> 94% · <span className="font-medium">Avg Performance:</span> 86%
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Department Headcount</h2>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {MOCK_DEPARTMENTS.slice(0, 10).map((dept) => (
                    <div key={dept.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">{dept.name}</span>
                        <span className="text-xs text-gray-400">{dept.head}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-700">{dept.employeeCount}</span>
                        <div className="w-20">
                          <ProgressBar value={(dept.spent / dept.budget) * 100} color={(dept.spent / dept.budget) > 0.9 ? "bg-rose-500" : (dept.spent / dept.budget) > 0.75 ? "bg-yellow-500" : "bg-green-500"} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales & Customer + Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales & Customer Command Center</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Today's Sales</div>
                    <div className="text-sm font-bold text-gray-800">₹18.2L</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Monthly Sales</div>
                    <div className="text-sm font-bold text-blue-600">₹4.82Cr</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Annual Sales</div>
                    <div className="text-sm font-bold text-indigo-600">₹48.25Cr</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Total Customers</div>
                    <div className="text-sm font-bold text-gray-800">24,892</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">New Customers</div>
                    <div className="text-sm font-bold text-green-600">1,847</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Conversion Rate</div>
                    <div className="text-sm font-bold text-purple-600">24.8%</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Lead Command Center</h2>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">Total Leads: <span className="font-bold text-gray-800">3,421</span></div>
                  <div className="text-sm text-gray-600">Today: <span className="font-bold text-blue-600">47</span></div>
                </div>
                <div className="space-y-2">
                  {["New", "Contacted", "Interested", "Follow-up", "Qualified", "Converted", "Lost"].map((status) => {
                    const count = mockLeads.filter(l => l.status === status).length;
                    const colors = {
                      "New": "bg-blue-500",
                      "Contacted": "bg-indigo-500",
                      "Interested": "bg-yellow-500",
                      "Follow-up": "bg-orange-500",
                      "Qualified": "bg-purple-500",
                      "Converted": "bg-green-500",
                      "Lost": "bg-red-500",
                    };
                    return (
                      <div key={status} className="flex items-center gap-2">
                        <span className="w-24 text-xs text-gray-600">{status}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div className={`${colors[status]} h-1.5 rounded-full transition-all`} style={{ width: `${(count / mockLeads.length) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Marketing + Technology */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Marketing Command Center</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Budget</div>
                    <div className="text-sm font-bold text-gray-800">₹5.2Cr</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Used</div>
                    <div className="text-sm font-bold text-blue-600">₹4.68Cr</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Active Campaigns</div>
                    <div className="text-sm font-bold text-green-600">3</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">ROAS</div>
                    <div className="text-sm font-bold text-purple-600">4.2x</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Channel Performance</h3>
                  {["Instagram", "Facebook", "Google Ads", "YouTube", "WhatsApp", "SEO"].map((channel) => {
                    const campaign = MOCK_CAMPAIGNS.find(c => c.channel === channel);
                    const leads = campaign ? campaign.leads : 0;
                    const maxLeads = Math.max(...MOCK_CAMPAIGNS.map(c => c.leads));
                    return (
                      <div key={channel} className="flex items-center gap-2">
                        <span className="w-24 text-xs text-gray-600">{channel}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: maxLeads > 0 ? `${(leads / maxLeads) * 100}%` : "0%" }} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-10 text-right">{leads}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Technology Command Center</h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">System Status</div>
                    <div className="text-sm font-bold text-green-600">All Operational</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Critical Bugs</div>
                    <div className="text-sm font-bold text-red-500">2</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Open Incidents</div>
                    <div className="text-sm font-bold text-yellow-600">3</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Security Alerts</div>
                    <div className="text-sm font-bold text-red-500">1</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">CTO Escalations</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                    <AlertTriangle size={16} className="text-red-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-red-700">Production Issue</div>
                      <div className="text-xs text-red-600">CRM Login Failure · CTO Investigating</div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
                    <AlertCircle size={16} className="text-yellow-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-yellow-700">Major Bug</div>
                      <div className="text-xs text-yellow-600">Payment API · Developer Assigned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendors + Risk & Compliance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Vendor Command Center</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Total Vendors</div>
                    <div className="text-lg font-bold text-gray-800">24</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Active</div>
                    <div className="text-lg font-bold text-green-600">18</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Pending Approval</div>
                    <div className="text-lg font-bold text-yellow-600">3</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Vendor Revenue</div>
                    <div className="text-lg font-bold text-indigo-600">₹12.6Cr</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {MOCK_VENDORS.map((v) => (
                    <div key={v.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{v.name}</div>
                        <div className="text-xs text-gray-500">{v.service}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-600">₹{(v.revenue / 100000).toFixed(1)}L</span>
                        <StatusBadge status={v.status} />
                        <div className="w-12">
                          <ProgressBar value={v.performance} color={v.performance > 85 ? "bg-green-500" : v.performance > 70 ? "bg-yellow-500" : "bg-red-500"} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Risk & Compliance</h2>
                  <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Open Risks</div>
                    <div className="text-lg font-bold text-red-500">{mockRisks.filter(r => r.status !== "Resolved" && r.status !== "Closed").length}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Critical</div>
                    <div className="text-lg font-bold text-red-600">{mockRisks.filter(r => r.level === "Critical" && r.status !== "Resolved").length}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">High</div>
                    <div className="text-lg font-bold text-orange-500">{mockRisks.filter(r => r.level === "High" && r.status !== "Resolved").length}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Resolved</div>
                    <div className="text-lg font-bold text-green-600">{mockRisks.filter(r => r.status === "Resolved" || r.status === "Closed").length}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {mockRisks.filter(r => r.status !== "Resolved" && r.status !== "Closed").slice(0, 4).map((risk) => (
                    <div key={risk.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setSelectedRisk(risk); setShowRiskModal(true); }}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${risk.level === "Critical" ? "bg-red-600 animate-pulse" : risk.level === "High" ? "bg-red-500" : risk.level === "Medium" ? "bg-yellow-500" : "bg-blue-500"}`} />
                          <span className="text-sm font-medium text-gray-800">{risk.category}</span>
                          <PriorityBadge priority={risk.level} />
                          <StatusBadge status={risk.status} />
                        </div>
                        <div className="text-xs text-gray-500">{risk.description}</div>
                      </div>
                      <div className="text-xs text-gray-400">{risk.owner}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Planning + Expansion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Strategic Planning</h2>
                  <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {MOCK_STRATEGIC_GOALS.slice(0, 5).map((goal) => (
                    <div key={goal.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">{goal.goal}</span>
                            <StatusBadge status={goal.status} />
                            <PriorityBadge priority={goal.priority} />
                          </div>
                          <div className="text-xs text-gray-500">{goal.department} · {goal.owner} · Due: {goal.targetDate}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-700">{goal.progress}%</div>
                        </div>
                      </div>
                      <ProgressBar value={goal.progress} color={goal.progress > 80 ? "bg-green-600" : goal.progress > 50 ? "bg-blue-600" : "bg-yellow-600"} />
                      <div className="text-xs text-gray-400 mt-1">{goal.currentValue} / {goal.target} {goal.kpi}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Expansion Dashboard</h2>
                  <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {MOCK_EXPANSION_PROPOSALS.map((proposal) => (
                    <div key={proposal.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">{proposal.city}</span>
                            <StatusBadge status={proposal.type} />
                            <StatusBadge status={proposal.status} />
                          </div>
                          <div className="text-xs text-gray-500">Investment: ₹{(proposal.investment / 100000).toFixed(1)}L · Expected ROI: {proposal.expectedROI}%</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600">Stage {proposal.stage}/8</span>
                          {proposal.approvalStatus === "Approved" ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : proposal.approvalStatus === "Pending" ? (
                            <Clock size={16} className="text-yellow-500" />
                          ) : (
                            <XCircle size={16} className="text-red-500" />
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={(proposal.stage / 8) * 100} color={proposal.stage > 6 ? "bg-green-600" : proposal.stage > 4 ? "bg-blue-600" : "bg-yellow-600"} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">CMD Activity & Audit Log</h2>
                <button className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                  View Full Log <ChevronRight size={16} />
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {MOCK_ACTIVITY_LOGS.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-800">{log.action}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-3">
                        <span>{log.module}</span>
                        <span>·</span>
                        <span>{log.date} at {log.time}</span>
                        <span>·</span>
                        <span className="text-gray-500">{log.device}</span>
                        {log.reason && <span className="text-gray-500">· Reason: {log.reason}</span>}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{log.approvalReference}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-200">
              ePay CRM — CMD Command Center v2.0 · © 2026 ePay Inc. · All financial data is read-level secured.
            </div>
          </div>
        </main>
      </div>

      {/* ---- MODALS ---- */}

      {/* Approval Modal */}
      {showApprovalModal && selectedApproval && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">Approval Review: {selectedApproval.id}</h3>
              <button onClick={() => setShowApprovalModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div className="font-medium text-gray-800">{selectedApproval.type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Department</div>
                  <div className="font-medium text-gray-800">{selectedApproval.department}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Requested By</div>
                  <div className="font-medium text-gray-800">{selectedApproval.requestedBy}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium text-gray-800 text-lg text-indigo-600">₹{selectedApproval.amount.toLocaleString()}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Reason</div>
                  <div className="text-gray-800 bg-gray-50 rounded-lg p-2">{selectedApproval.reason}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Supporting Documents</div>
                  <div className="flex gap-2 flex-wrap">
                    {selectedApproval.supportingDocs.map((doc, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-xs text-gray-600">
                        <FileText size={12} /> {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-500 mb-2">Approval Status</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2"><span className="text-gray-500">Manager:</span> <StatusBadge status={selectedApproval.managerApproval} /></div>
                  <div className="flex items-center gap-2"><span className="text-gray-500">Dept Head:</span> <StatusBadge status={selectedApproval.departmentHeadApproval} /></div>
                  <div className="flex items-center gap-2"><span className="text-gray-500">CFO:</span> <StatusBadge status={selectedApproval.cfoApproval} /></div>
                  <div className="flex items-center gap-2"><span className="text-gray-500">CTO:</span> <StatusBadge status={selectedApproval.ctoApproval} /></div>
                  <div className="flex items-center gap-2"><span className="text-gray-500">CEO:</span> <StatusBadge status={selectedApproval.ceoApproval} /></div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-500 mb-2">CMD Decision</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprovalDecision(selectedApproval.id, "Approved")}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleApprovalDecision(selectedApproval.id, "Rejected")}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Modal */}
      {showRiskModal && selectedRisk && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">Risk: {selectedRisk.category}</h3>
              <button onClick={() => setShowRiskModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Category</div>
                  <div className="font-medium text-gray-800">{selectedRisk.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Level</div>
                  <PriorityBadge priority={selectedRisk.level} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Department</div>
                  <div className="font-medium text-gray-800">{selectedRisk.department}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Owner</div>
                  <div className="font-medium text-gray-800">{selectedRisk.owner}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Description</div>
                  <div className="text-gray-800 bg-gray-50 rounded-lg p-2">{selectedRisk.description}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Impact</div>
                  <div className="font-medium text-gray-800">{selectedRisk.impact}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Probability</div>
                  <PriorityBadge priority={selectedRisk.probability} />
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Mitigation</div>
                  <div className="text-gray-800">{selectedRisk.mitigation}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <StatusBadge status={selectedRisk.status} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Escalation Level</div>
                  <StatusBadge status={selectedRisk.escalationLevel} />
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Identified Date</div>
                  <div className="text-gray-800">{selectedRisk.identifiedDate}</div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-500 mb-2">CMD Action</div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => handleRiskUpdate(selectedRisk.id, "In Progress")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => handleRiskUpdate(selectedRisk.id, "Resolved")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handleRiskUpdate(selectedRisk.id, "Closed")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
                  >
                    Close Risk
                  </button>
                  <button
                    onClick={() => setShowRiskModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
                <div className="mt-3">
                  <div className="text-sm text-gray-500">CMD Remarks</div>
                  <textarea
                    placeholder="Add your remarks here..."
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    onChange={(e) => setSelectedRisk(prev => prev ? { ...prev, cmdRemarks: e.target.value } : null)}
                    value={selectedRisk.cmdRemarks || ""}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
