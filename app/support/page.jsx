"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Calendar,
  Clock,
  Ticket,
  List,
  AlertTriangle,
  BookOpen,
  BarChart,
  Target,
  CalendarDays,
  FileText,
  Settings2,
  Menu,
  RefreshCw,
  Eye,
  CheckCircle,
  Plus,
  X,
} from "lucide-react";

// ============================================================
// 1. MOCK DATA GENERATION
// ============================================================

const generateMockTickets = (count) => {
  const customers = ["Rahul Patil", "Priya Shah", "Amit Kumar", "Sneha Reddy", "Vikram Singh", "Neha Joshi", "Rajesh Nair", "Anita Desai", "Suresh Rao", "Meera Pillai"];
  const sources = ["Gallery", "Customer", "Employee", "Other"];
  const services = ["CRM", "Website", "Mobile App", "Payment", "Booking", "Gallery System", "Email", "Firebase", "API", "Hardware", "Network"];
  const categories = ["Login & Account", "Website", "CRM", "Mobile App", "Payment", "Booking", "Gallery System", "Hardware", "Network", "Email", "Firebase", "API", "Other"];
  const priorities = ["Critical", "High", "Medium", "Low"];
  const statuses = [
    "New", "Assigned", "In Progress", "Waiting for Customer", "Escalated", "Resolved", "Closed"
  ];
  const slaOptions = ["2 Hours", "4 Hours", "8 Hours", "24 Hours", "48 Hours"];

  const tickets = [];
  for (let i = 1; i <= count; i++) {
    const id = `TS-2026-${String(482 + i).padStart(4, "0")}`;
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const sla = slaOptions[Math.floor(Math.random() * slaOptions.length)];
    const slaDeadline = new Date(Date.now() + 1000 * 60 * 60 * (Math.floor(Math.random() * 12) + 2)).toLocaleString();
    const createdAt = new Date(Date.now() - 1000 * 60 * 60 * (Math.floor(Math.random() * 48) + 2)).toLocaleString();

    // Determine SLA status
    let slaStatus = "On Track";
    if (Math.random() > 0.7) slaStatus = "At Risk";
    if (Math.random() > 0.9) slaStatus = "Breached";

    tickets.push({
      id,
      customer,
      customerId: `CUST${String(Math.floor(Math.random() * 1000) + 1000)}`,
      employeeId: Math.random() > 0.5 ? `EMP${String(Math.floor(Math.random() * 500) + 1000)}` : undefined,
      galleryId: Math.random() > 0.5 ? `GAL${String(Math.floor(Math.random() * 50) + 10)}` : undefined,
      source,
      service,
      category,
      subcategory: Math.random() > 0.6 ? "Sub-issue" : undefined,
      issue: `Issue with ${service} - ${category}`,
      description: `Customer reported a problem with ${service}. Details: ${Math.random() > 0.5 ? "Cannot access" : "Error occurs"} when trying to ${category.toLowerCase()}.`,
      priority,
      severity: priority,
      status,
      assignedTo: status === "New" ? "Unassigned" : "Support Executive",
      createdBy: "System",
      createdAt,
      firstResponseTime: status !== "New" ? `${Math.floor(Math.random() * 30) + 5} min` : undefined,
      resolutionTime: status === "Resolved" || status === "Closed" ? `${Math.floor(Math.random() * 60) + 10} min` : undefined,
      sla,
      slaDeadline,
      slaStatus,
      customerResponse: Math.random() > 0.7 ? "Customer confirmed issue persists" : undefined,
      supportRemarks: Math.random() > 0.6 ? "Attempting to reproduce" : undefined,
      resolution: status === "Resolved" || status === "Closed" ? "Issue resolved by restarting service" : undefined,
      resolvedDate: status === "Resolved" || status === "Closed" ? new Date(Date.now() - 1000 * 60 * 30).toLocaleString() : undefined,
      closedDate: status === "Closed" ? new Date(Date.now() - 1000 * 60 * 10).toLocaleString() : undefined,
      customerRating: status === "Closed" ? Math.floor(Math.random() * 5) + 1 : undefined,
      attachments: Math.random() > 0.5 ? ["screenshot.png", "log.txt"] : undefined,
      escalated: status === "Escalated" ? true : false,
      escalationId: status === "Escalated" ? `ESC-${String(Math.floor(Math.random() * 1000) + 100)}` : undefined,
    });
  }
  return tickets;
};

const MOCK_TICKETS = generateMockTickets(25);

const MOCK_ESCALATIONS = [
  {
    id: "ESC-101",
    ticketId: "TS-2026-00482",
    escalatedTo: "Technical Lead",
    escalationType: "Technical Problem",
    priority: "High",
    errorMessage: "API timeout after 30 seconds",
    logs: "[ERROR] TimeoutException at line 42",
    screenshot: "error_screenshot.png",
    environment: "Production",
    stepsToReproduce: "1. Login\n2. Click on Payment\n3. Wait for timeout",
    expectedResult: "Payment processed successfully",
    actualResult: "Error: Request Timeout",
    developerAssigned: "Rahul Sharma",
    escalationDate: "2026-08-27 10:15 AM",
    status: "In Progress",
  },
  {
    id: "ESC-102",
    ticketId: "TS-2026-00485",
    escalatedTo: "Developer",
    escalationType: "Database Issue",
    priority: "Critical",
    errorMessage: "Database connection failed",
    logs: "Failed to connect to MongoDB",
    environment: "Staging",
    stepsToReproduce: "1. Access CRM Dashboard\n2. Load data\n3. Error appears",
    expectedResult: "Data loads successfully",
    actualResult: "Error: Connection refused",
    developerAssigned: "Amit Kumar",
    escalationDate: "2026-08-26 04:30 PM",
    status: "Open",
  },
];

const MOCK_KNOWLEDGE_ARTICLES = [
  {
    id: "KB001",
    title: "How to reset CRM password",
    category: "Login & Account",
    problem: "User forgot password and cannot log in",
    solution: "Use the 'Forgot Password' link on the login page and follow the instructions.",
    steps: [
      "Go to login page",
      "Click on 'Forgot Password'",
      "Enter registered email",
      "Check email for reset link",
      "Set new password and confirm",
    ],
    attachments: ["reset_guide.pdf"],
    createdBy: "Support Admin",
    updatedBy: "Support Admin",
    updatedAt: "2026-08-20",
    version: 2,
    status: "Published",
  },
  {
    id: "KB002",
    title: "Payment gateway timeout resolution",
    category: "Payment",
    problem: "Payment requests time out frequently",
    solution: "Increase timeout settings in the configuration file.",
    steps: [
      "Access server config file",
      "Locate 'timeout' parameter",
      "Increase to 60 seconds",
      "Restart the service",
    ],
    attachments: ["config_sample.txt"],
    createdBy: "Tech Lead",
    updatedBy: "Tech Lead",
    updatedAt: "2026-08-18",
    version: 1,
    status: "Published",
  },
  {
    id: "KB003",
    title: "Mobile app sync issue",
    category: "Mobile App",
    problem: "App data not syncing with server",
    solution: "Clear app cache and force sync.",
    steps: [
      "Open app settings",
      "Clear cache",
      "Force stop the app",
      "Restart and check sync",
    ],
    attachments: [],
    createdBy: "Support Admin",
    updatedBy: "Support Admin",
    updatedAt: "2026-08-15",
    version: 1,
    status: "Published",
  },
  {
    id: "KB004",
    title: "Gallery system downtime",
    category: "Gallery System",
    problem: "Gallery system shows downtime alerts",
    solution: "Check network connectivity and restart the local server.",
    steps: [
      "Ping the server IP",
      "Check service logs",
      "Restart service using command: systemctl restart gallery",
    ],
    attachments: ["downtime_analysis.pdf"],
    createdBy: "Network Admin",
    updatedBy: "Network Admin",
    updatedAt: "2026-08-10",
    version: 2,
    status: "Published",
  },
  {
    id: "KB005",
    title: "Email not sending from CRM",
    category: "Email",
    problem: "Emails stuck in outbox",
    solution: "Check SMTP settings and restart email queue.",
    steps: [
      "Verify SMTP credentials",
      "Check email queue status",
      "Restart email service",
    ],
    attachments: [],
    createdBy: "Support Admin",
    updatedBy: "Support Admin",
    updatedAt: "2026-08-05",
    version: 1,
    status: "Draft",
  },
];

const MOCK_STATS = {
  openTickets: 28,
  newTickets: 12,
  assignedToMe: 9,
  inProgress: 6,
  waitingCustomer: 3,
  escalated: 4,
  resolvedToday: 15,
  slaBreached: 1,
  ticketsAssigned: 45,
  ticketsResolved: 38,
  firstResponseTime: "12 min",
  avgResolutionTime: "45 min",
  slaCompliance: 96,
  escalationRate: 8.5,
  reopenedTickets: 2,
  customerSatisfaction: 4.7,
  pendingTickets: 18,
  criticalTickets: 3,
  closedToday: 10,
  closedThisMonth: 320,
};

// ============================================================
// 2. UTILITY COMPONENTS
// ============================================================

const StatusBadge = ({ status }) => {
  const colors = {
    "New": "bg-blue-500",
    "Assigned": "bg-indigo-500",
    "In Progress": "bg-yellow-500",
    "Waiting for Customer": "bg-orange-500",
    "Escalated": "bg-red-500",
    "Resolved": "bg-green-500",
    "Closed": "bg-gray-500",
    "On Track": "bg-green-500",
    "At Risk": "bg-yellow-500",
    "Breached": "bg-red-500",
    "Published": "bg-green-500",
    "Draft": "bg-gray-400",
    "Archived": "bg-gray-500",
    "Open": "bg-red-500",
    "Critical": "bg-red-600",
    "High": "bg-red-500",
    "Medium": "bg-yellow-500",
    "Low": "bg-blue-500",
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

// ============================================================
// 3. MAIN DASHBOARD COMPONENT
// ============================================================

export default function TechnicalSupportDashboard() {
  // ---- STATE ----
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [escalations, setEscalations] = useState(MOCK_ESCALATIONS);
  const [knowledgeArticles, setKnowledgeArticles] = useState(MOCK_KNOWLEDGE_ARTICLES);
  const [stats] = useState(MOCK_STATS);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("tickets");
  const [currentDate] = useState(new Date());

  // ---- HANDLERS ----

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleUpdateTicket = (id, updates) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, ...updates });
    }
  };

  const handleEscalateTicket = (ticketId, escalationData) => {
    const newEscalation = {
      id: `ESC-${String(escalations.length + 100)}`,
      ticketId,
      escalatedTo: escalationData.escalatedTo || "Technical Lead",
      escalationType: escalationData.escalationType || "Technical Problem",
      priority: escalationData.priority || "High",
      stepsToReproduce: escalationData.stepsToReproduce || "",
      expectedResult: escalationData.expectedResult || "",
      actualResult: escalationData.actualResult || "",
      escalationDate: new Date().toLocaleString(),
      status: "Open",
      ...escalationData,
    };
    setEscalations(prev => [...prev, newEscalation]);
    handleUpdateTicket(ticketId, { status: "Escalated", escalated: true, escalationId: newEscalation.id });
    setShowEscalationModal(false);
    alert(`Ticket ${ticketId} escalated to ${newEscalation.escalatedTo}`);
  };

  const handleResolveTicket = (id) => {
    handleUpdateTicket(id, {
      status: "Resolved",
      resolvedDate: new Date().toLocaleString(),
      resolution: "Issue resolved by support team.",
    });
    alert(`Ticket ${id} marked as Resolved`);
  };

  const handleCloseTicket = (id) => {
    handleUpdateTicket(id, {
      status: "Closed",
      closedDate: new Date().toLocaleString(),
    });
    alert(`Ticket ${id} closed`);
  };

  const handleAddNote = (id, note) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      const currentRemarks = ticket.supportRemarks || "";
      const updatedRemarks = currentRemarks ? `${currentRemarks}\n${note}` : note;
      handleUpdateTicket(id, { supportRemarks: updatedRemarks });
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus !== "All" && ticket.status !== filterStatus) return false;
    if (filterPriority !== "All" && ticket.priority !== filterPriority) return false;
    if (filterCategory !== "All" && ticket.category !== filterCategory) return false;
    if (searchTerm && !ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) && !ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) && !ticket.issue.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // ---- RENDER ----
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
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">eP</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">ePay CRM</span>
              <span className="block text-xs text-orange-600 font-medium">Technical Support</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Support</div>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-orange-50 text-orange-700">
                  <Ticket size={18} />
                  <span className="font-medium">Dashboard</span>
                </a>
              </li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><List size={18} /><span className="text-sm">All Tickets</span></a></li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><AlertTriangle size={18} /><span className="text-sm">Escalations</span></a></li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><BookOpen size={18} /><span className="text-sm">Knowledge Base</span></a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Performance</div>
            <ul className="space-y-1">
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><BarChart size={18} /><span className="text-sm">My Stats</span></a></li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><Target size={18} /><span className="text-sm">SLA Reports</span></a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Common</div>
            <ul className="space-y-1">
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><Bell size={18} /><span className="text-sm">Notifications</span></a></li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><MessageSquare size={18} /><span className="text-sm">Messages</span></a></li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><CalendarDays size={18} /><span className="text-sm">Attendance</span></a></li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><FileText size={18} /><span className="text-sm">Daily Report</span></a></li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><Settings2 size={18} /><span className="text-sm">Profile</span></a></li>
            </ul>
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">Support Executive</div>
              <div className="text-xs text-gray-500">Agent</div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded"><LogOut size={16} className="text-gray-500" /></button>
          </div>
        </div>
      </aside>

      {/* ---- MAIN CONTENT ---- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ---- HEADER ---- */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1 mr-2 rounded hover:bg-gray-100">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">eP</span>
              </div>
            </div>
            <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">Technical Support Dashboard</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5 mx-4">
            <Calendar size={14} />
            <span>{currentDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span className="text-gray-400">|</span>
            <Clock size={14} />
            <span>{currentDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 flex-1 max-w-sm">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search tickets..." className="bg-transparent border-none outline-none text-sm px-2 w-full text-gray-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-1.5 rounded hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">5</span>
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100 relative">
              <MessageSquare size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2 ml-1">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-orange-600" />
              </div>
            </div>
            <button className="p-1.5 rounded hover:bg-gray-100"><LogOut size={18} className="text-gray-500" /></button>
          </div>
        </header>

        {/* ---- DASHBOARD CONTENT ---- */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Open Tickets</div>
                <div className="text-2xl font-bold text-gray-800">{stats.openTickets}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">New Tickets</div>
                <div className="text-2xl font-bold text-blue-600">{stats.newTickets}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Assigned To Me</div>
                <div className="text-2xl font-bold text-indigo-600">{stats.assignedToMe}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">In Progress</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Waiting Customer</div>
                <div className="text-2xl font-bold text-orange-600">{stats.waitingCustomer}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Escalated</div>
                <div className="text-2xl font-bold text-red-500">{stats.escalated}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Resolved Today</div>
                <div className="text-2xl font-bold text-green-600">{stats.resolvedToday}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">SLA Breached</div>
                <div className="text-2xl font-bold text-red-600">{stats.slaBreached}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex gap-1">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "tickets" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setActiveTab("tickets")}
              >
                <Ticket size={16} className="inline mr-2" /> Tickets
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "knowledge" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setActiveTab("knowledge")}
              >
                <BookOpen size={16} className="inline mr-2" /> Knowledge Base
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "performance" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setActiveTab("performance")}
              >
                <BarChart size={16} className="inline mr-2" /> Performance
              </button>
            </div>

            {/* Tickets Tab */}
            {activeTab === "tickets" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <h2 className="text-lg font-semibold text-gray-800">Ticket Queue</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="All">All Status</option>
                      <option value="New">New</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting for Customer">Waiting for Customer</option>
                      <option value="Escalated">Escalated</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                      <option value="All">All Priority</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                      <option value="All">All Categories</option>
                      <option value="Login & Account">Login & Account</option>
                      <option value="Website">Website</option>
                      <option value="CRM">CRM</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="Payment">Payment</option>
                      <option value="Booking">Booking</option>
                      <option value="Gallery System">Gallery System</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Network">Network</option>
                      <option value="Email">Email</option>
                      <option value="Firebase">Firebase</option>
                      <option value="API">API</option>
                      <option value="Other">Other</option>
                    </select>
                    <button className="p-1.5 bg-gray-100 rounded hover:bg-gray-200" onClick={() => { setFilterStatus("All"); setFilterPriority("All"); setFilterCategory("All"); setSearchTerm(""); }}>
                      <RefreshCw size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-2 font-medium">Ticket</th>
                        <th className="pb-2 font-medium">Customer</th>
                        <th className="pb-2 font-medium">Category</th>
                        <th className="pb-2 font-medium">Priority</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">SLA</th>
                        <th className="pb-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.slice(0, 15).map((ticket) => (
                        <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => handleSelectTicket(ticket)}>
                          <td className="py-2 font-mono text-xs text-gray-500">{ticket.id}</td>
                          <td className="py-2 font-medium text-gray-800">{ticket.customer}</td>
                          <td className="py-2 text-gray-600">{ticket.category}</td>
                          <td className="py-2"><PriorityBadge priority={ticket.priority} /></td>
                          <td className="py-2"><StatusBadge status={ticket.status} /></td>
                          <td className="py-2">
                            <span className={`text-xs font-medium ${ticket.slaStatus === "On Track" ? "text-green-600" : ticket.slaStatus === "At Risk" ? "text-yellow-600" : "text-red-600"}`}>
                              {ticket.slaStatus}
                            </span>
                            <div className="text-xs text-gray-400">{ticket.sla}</div>
                          </td>
                          <td className="py-2">
                            <button className="p-1 hover:bg-gray-200 rounded text-blue-600" onClick={(e) => { e.stopPropagation(); handleSelectTicket(ticket); }}>
                              <Eye size={14} />
                            </button>
                            {ticket.status !== "Closed" && (
                              <button className="p-1 hover:bg-gray-200 rounded text-green-600 ml-1" onClick={(e) => { e.stopPropagation(); handleResolveTicket(ticket.id); }}>
                                <CheckCircle size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredTickets.length === 0 && (
                        <tr><td colSpan={7} className="py-4 text-center text-gray-500">No tickets match your filters.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Knowledge Base Tab */}
            {activeTab === "knowledge" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Knowledge Base</h2>
                  <button className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-1">
                    <Plus size={16} /> New Article
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {knowledgeArticles.map((article) => (
                    <div key={article.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedArticle(article); setShowKnowledgeModal(true); }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{article.title}</h3>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>{article.category}</span>
                            <span>·</span>
                            <span>v{article.version}</span>
                            <span>·</span>
                            <StatusBadge status={article.status} />
                          </div>
                          <div className="text-sm text-gray-600 mt-1 line-clamp-2">{article.problem}</div>
                        </div>
                        <span className="text-xs text-gray-400">Updated: {article.updatedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === "performance" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Support Performance</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  <div><span className="text-gray-500 text-sm">Tickets Assigned</span><div className="font-bold">{stats.ticketsAssigned}</div></div>
                  <div><span className="text-gray-500 text-sm">Tickets Resolved</span><div className="font-bold text-green-600">{stats.ticketsResolved}</div></div>
                  <div><span className="text-gray-500 text-sm">First Response Time</span><div className="font-bold">{stats.firstResponseTime}</div></div>
                  <div><span className="text-gray-500 text-sm">Avg Resolution Time</span><div className="font-bold">{stats.avgResolutionTime}</div></div>
                  <div><span className="text-gray-500 text-sm">SLA Compliance</span><div className="font-bold text-blue-600">{stats.slaCompliance}%</div></div>
                  <div><span className="text-gray-500 text-sm">Escalation Rate</span><div className="font-bold text-yellow-600">{stats.escalationRate}%</div></div>
                  <div><span className="text-gray-500 text-sm">Reopened Tickets</span><div className="font-bold text-orange-500">{stats.reopenedTickets}</div></div>
                  <div><span className="text-gray-500 text-sm">Customer Satisfaction</span><div className="font-bold text-green-600">{stats.customerSatisfaction} ★</div></div>
                  <div><span className="text-gray-500 text-sm">Pending Tickets</span><div className="font-bold text-red-500">{stats.pendingTickets}</div></div>
                  <div><span className="text-gray-500 text-sm">Critical Tickets</span><div className="font-bold text-red-600">{stats.criticalTickets}</div></div>
                  <div><span className="text-gray-500 text-sm">Closed Today</span><div className="font-bold text-gray-800">{stats.closedToday}</div></div>
                  <div><span className="text-gray-500 text-sm">Closed This Month</span><div className="font-bold text-gray-800">{stats.closedThisMonth}</div></div>
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">SLA Compliance Trend</h3>
                  <ProgressBar value={stats.slaCompliance} color="bg-green-600" />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ---- TICKET DETAIL MODAL ---- */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">{selectedTicket.id} - {selectedTicket.customer}</h3>
              <button onClick={() => setShowTicketModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-sm text-gray-500">Customer</span><div className="font-medium">{selectedTicket.customer}</div></div>
                <div><span className="text-sm text-gray-500">Source</span><div className="font-medium">{selectedTicket.source}</div></div>
                <div><span className="text-sm text-gray-500">Service</span><div className="font-medium">{selectedTicket.service}</div></div>
                <div><span className="text-sm text-gray-500">Category</span><div className="font-medium">{selectedTicket.category}</div></div>
                <div><span className="text-sm text-gray-500">Priority</span><div><PriorityBadge priority={selectedTicket.priority} /></div></div>
                <div><span className="text-sm text-gray-500">Status</span><div><StatusBadge status={selectedTicket.status} /></div></div>
                <div className="col-span-2"><span className="text-sm text-gray-500">Issue</span><div className="font-medium">{selectedTicket.issue}</div></div>
                <div className="col-span-2"><span className="text-sm text-gray-500">Description</span><div className="bg-gray-50 p-2 rounded text-gray-700">{selectedTicket.description}</div></div>
                <div><span className="text-sm text-gray-500">Created</span><div className="text-sm">{selectedTicket.createdAt}</div></div>
                <div><span className="text-sm text-gray-500">SLA</span><div className="text-sm">{selectedTicket.sla} - Deadline: {selectedTicket.slaDeadline}</div></div>
                <div className="col-span-2"><span className="text-sm text-gray-500">SLA Status</span><div><StatusBadge status={selectedTicket.slaStatus} /></div></div>
                {selectedTicket.supportRemarks && <div className="col-span-2"><span className="text-sm text-gray-500">Support Remarks</span><div className="bg-gray-50 p-2 rounded text-gray-700">{selectedTicket.supportRemarks}</div></div>}
                {selectedTicket.resolution && <div className="col-span-2"><span className="text-sm text-gray-500">Resolution</span><div className="bg-green-50 p-2 rounded text-gray-700">{selectedTicket.resolution}</div></div>}
                {selectedTicket.customerRating && <div><span className="text-sm text-gray-500">Customer Rating</span><div className="font-medium">{selectedTicket.customerRating} ★</div></div>}
                {selectedTicket.escalated && <div><span className="text-sm text-gray-500">Escalated</span><div className="font-medium text-red-500">Yes (ID: {selectedTicket.escalationId})</div></div>}
              </div>
              <div className="border-t border-gray-200 pt-4 flex flex-wrap gap-2">
                {selectedTicket.status === "New" && (
                  <button onClick={() => handleUpdateTicket(selectedTicket.id, { status: "Assigned" })} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">Assign</button>
                )}
                {selectedTicket.status === "Assigned" && (
                  <button onClick={() => handleUpdateTicket(selectedTicket.id, { status: "In Progress" })} className="px-3 py-1.5 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700">Start Progress</button>
                )}
                {(selectedTicket.status === "In Progress" || selectedTicket.status === "Assigned") && (
                  <>
                    <button onClick={() => handleUpdateTicket(selectedTicket.id, { status: "Waiting for Customer" })} className="px-3 py-1.5 bg-orange-600 text-white rounded text-sm font-medium hover:bg-orange-700">Wait for Customer</button>
                    <button onClick={() => { setShowEscalationModal(true); }} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">Escalate</button>
                  </>
                )}
                {(selectedTicket.status === "In Progress" || selectedTicket.status === "Waiting for Customer") && (
                  <button onClick={() => handleResolveTicket(selectedTicket.id)} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700">Resolve</button>
                )}
                {selectedTicket.status === "Resolved" && (
                  <button onClick={() => handleCloseTicket(selectedTicket.id)} className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700">Close</button>
                )}
                <button onClick={() => { const note = prompt("Enter note:"); if (note) handleAddNote(selectedTicket.id, note); }} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300">Add Note</button>
                <button onClick={() => setShowTicketModal(false)} className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded text-sm font-medium hover:bg-gray-200">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- ESCALATION MODAL ---- */}
      {showEscalationModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">Escalate Ticket: {selectedTicket.id}</h3>
              <button onClick={() => setShowEscalationModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Escalate To</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" id="escTo">
                  <option value="Technical Lead">Technical Lead</option>
                  <option value="Developer">Developer</option>
                  <option value="CTO">CTO</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Escalation Type</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" id="escType">
                  <option value="Technical Problem">Technical Problem</option>
                  <option value="Database Issue">Database Issue</option>
                  <option value="API Failure">API Failure</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Priority</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" id="escPriority">
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Error Message</label>
                <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" id="escError" placeholder="Error message" />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Steps to Reproduce</label>
                <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" rows={3} id="escSteps" placeholder="1. ... 2. ..." />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Expected Result</label>
                <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" id="escExpected" placeholder="What should happen" />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Actual Result</label>
                <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" id="escActual" placeholder="What actually happened" />
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    const escalatedTo = document.getElementById("escTo")?.value;
                    const escalationType = document.getElementById("escType")?.value;
                    const priority = document.getElementById("escPriority")?.value;
                    const errorMessage = document.getElementById("escError")?.value;
                    const stepsToReproduce = document.getElementById("escSteps")?.value;
                    const expectedResult = document.getElementById("escExpected")?.value;
                    const actualResult = document.getElementById("escActual")?.value;
                    handleEscalateTicket(selectedTicket.id, {
                      escalatedTo,
                      escalationType,
                      priority,
                      errorMessage,
                      stepsToReproduce,
                      expectedResult,
                      actualResult,
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Escalate
                </button>
                <button onClick={() => setShowEscalationModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- KNOWLEDGE ARTICLE MODAL ---- */}
      {showKnowledgeModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">{selectedArticle.title}</h3>
              <button onClick={() => setShowKnowledgeModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-sm text-gray-500">Category</span><div className="font-medium">{selectedArticle.category}</div></div>
                <div><span className="text-sm text-gray-500">Status</span><div><StatusBadge status={selectedArticle.status} /></div></div>
                <div className="col-span-2"><span className="text-sm text-gray-500">Problem</span><div className="bg-gray-50 p-2 rounded">{selectedArticle.problem}</div></div>
                <div className="col-span-2"><span className="text-sm text-gray-500">Solution</span><div className="bg-gray-50 p-2 rounded">{selectedArticle.solution}</div></div>
                <div className="col-span-2"><span className="text-sm text-gray-500">Steps</span><div className="bg-gray-50 p-2 rounded"><ol className="list-decimal ml-4 space-y-1">{selectedArticle.steps.map((step, i) => <li key={i}>{step}</li>)}</ol></div></div>
                <div><span className="text-sm text-gray-500">Version</span><div>v{selectedArticle.version}</div></div>
                <div><span className="text-sm text-gray-500">Updated</span><div>{selectedArticle.updatedAt}</div></div>
                <div><span className="text-sm text-gray-500">Created By</span><div>{selectedArticle.createdBy}</div></div>
                <div><span className="text-sm text-gray-500">Updated By</span><div>{selectedArticle.updatedBy}</div></div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Edit</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300" onClick={() => setShowKnowledgeModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
