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
  Phone,
  PhoneCall,
  PhoneOff,
  History,
  Bookmark,
  Settings2,
  Menu,
  X,
  RefreshCw,
  BarChart,
  Target,
  CheckCircle,
  XCircle,
  CalendarDays,
  MessageCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// Local Aliases to avoid duplicate imports and collisions
const PhoneIcon2 = Phone;
const PhoneCallIcon2 = PhoneCall;
const PhoneOffIcon2 = PhoneOff;
const HistoryIcon = History;
const BookmarkIcon = Bookmark;
const TrendingUpIcon = TrendingUp;
const TrendingDownIcon = TrendingDown;

// ============================================================
// 1. MOCK DATA GENERATION
// ============================================================

const generateMockLeads = (count) => {
  const sources = ["Instagram", "Facebook", "YouTube", "LinkedIn", "X", "WhatsApp", "Google Ads", "SEO", "Referral"];
  const campaigns = ["Summer Sale 2026", "Travel Promotion", "Visa Assistance", "Tech Showcase", "Brand Awareness", "Festival Special", "New Gallery Launch"];
  const services = ["Visa Assistance", "Gallery Visit", "Franchise Inquiry", "Membership", "CRM Demo", "Travel Package", "Event Planning"];
  const priorities = ["High", "Medium", "Low"];
  const statuses = [
    "New", "Called", "Connected", "Not Connected", "Interested", "Follow-up", "Converted", "Not Interested"
  ];

  const leads = [];
  for (let i = 1; i <= count; i++) {
    const id = `EP-${10000 + i}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const lastContact = Math.random() > 0.5 ? `Yesterday` : `Today ${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`;
    const nextFollowUp = Math.random() > 0.6 ? `Today ${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}` : undefined;

    leads.push({
      id,
      name: `Customer ${i}`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      source,
      campaign,
      service,
      priority,
      status,
      lastContact: Math.random() > 0.3 ? lastContact : undefined,
      nextFollowUp: nextFollowUp,
      followUpTime: nextFollowUp,
      notes: Math.random() > 0.7 ? `Interested in ${service}` : undefined,
      assignedTo: "Telecaller 1",
      callHistory: [],
    });
  }
  return leads;
};

const MOCK_LEADS = generateMockLeads(100);

const MOCK_FOLLOW_UPS = [
  {
    id: "FU001",
    leadId: "EP-10001",
    leadName: "Customer 1",
    phone: "+91 9876543210",
    date: "2026-08-27",
    time: "11:30 AM",
    type: "Call",
    reason: "Interested in Visa Assistance",
    assignedTelecaller: "Telecaller 1",
    status: "Pending",
  },
  {
    id: "FU002",
    leadId: "EP-10005",
    leadName: "Customer 5",
    phone: "+91 9876543210",
    date: "2026-08-27",
    time: "02:00 PM",
    type: "WhatsApp",
    reason: "Follow-up on gallery visit",
    assignedTelecaller: "Telecaller 1",
    status: "Pending",
  },
  {
    id: "FU003",
    leadId: "EP-10012",
    leadName: "Customer 12",
    phone: "+91 9876543210",
    date: "2026-08-26",
    time: "10:00 AM",
    type: "Call",
    reason: "Callback requested",
    assignedTelecaller: "Telecaller 2",
    status: "Completed",
    outcome: "Converted",
  },
];

const MOCK_STATS = {
  assigned: 100,
  called: 64,
  connected: 42,
  notConnected: 22,
  interested: 16,
  followups: 12,
  converted: 5,
  pending: 36,
  connectionRate: 65.6,
  conversionRate: 7.8,
  avgCallDuration: "4:32",
  dailyTarget: 80,
  targetAchievement: 80,
  missedCalls: 4,
  pendingCalls: 36,
};

// ============================================================
// 2. UTILITY COMPONENTS
// ============================================================

const StatusBadge = ({ status }) => {
  const colors = {
    "New": "bg-blue-500",
    "Called": "bg-indigo-500",
    "Connected": "bg-green-500",
    "Not Connected": "bg-gray-400",
    "Interested": "bg-yellow-500",
    "Follow-up": "bg-orange-500",
    "Converted": "bg-green-600",
    "Not Interested": "bg-red-500",
    "Do Not Contact": "bg-red-600",
    "Duplicate": "bg-gray-500",
    "Invalid": "bg-gray-400",
    "Pending": "bg-yellow-500",
    "Completed": "bg-green-500",
    "Cancelled": "bg-gray-400",
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
      {type === "up" ? <TrendingUpIcon size={12} /> : <TrendingDownIcon size={12} />}
      {Math.abs(change)}%
    </span>
  );
};

// ============================================================
// 3. MAIN DASHBOARD COMPONENT
// ============================================================

export default function TelecallingDashboard() {
  // ---- STATE ----
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [followUps, setFollowUps] = useState(MOCK_FOLLOW_UPS);
  const [stats, setStats] = useState(MOCK_STATS);
  const [currentDate] = useState(new Date());
  const [callTimer, setCallTimer] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callInterval, setCallInterval] = useState(null);
  const [callOutcome, setCallOutcome] = useState("");
  const [callNotes, setCallNotes] = useState("");
  const [showCallOutcomeModal, setShowCallOutcomeModal] = useState(false);

  // Filter state
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // ---- EFFECTS ----
  useEffect(() => {
    // Auto-update stats based on leads
    const updateStats = () => {
      const total = leads.length;
      const called = leads.filter(l => l.status === "Called" || l.status === "Connected" || l.status === "Interested" || l.status === "Follow-up" || l.status === "Converted" || l.status === "Not Interested" || l.status === "Do Not Contact").length;
      const connected = leads.filter(l => l.status === "Connected" || l.status === "Interested" || l.status === "Follow-up" || l.status === "Converted").length;
      const notConnected = leads.filter(l => l.status === "Not Connected").length;
      const interested = leads.filter(l => l.status === "Interested" || l.status === "Follow-up").length;
      const followups = leads.filter(l => l.status === "Follow-up").length;
      const converted = leads.filter(l => l.status === "Converted").length;
      const pending = leads.filter(l => l.status === "New" || l.status === "Not Connected").length;

      setStats(prev => ({
        ...prev,
        assigned: total,
        called,
        connected,
        notConnected,
        interested,
        followups,
        converted,
        pending,
        connectionRate: called > 0 ? (connected / called) * 100 : 0,
        conversionRate: called > 0 ? (converted / called) * 100 : 0,
        pendingCalls: pending,
      }));
    };
    updateStats();
  }, [leads]);

  // ---- HANDLERS ----

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    setShowCallModal(true);
    setCallTimer(0);
    setIsCallActive(false);
    if (callInterval) clearInterval(callInterval);
    setCallOutcome("");
    setCallNotes("");
  };

  const handleStartCall = () => {
    if (!selectedLead) return;
    setIsCallActive(true);
    setCallTimer(0);
    const interval = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);
    setCallInterval(interval);
    // Update lead status
    setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: "Called" } : l));
  };

  const handleEndCall = () => {
    if (callInterval) clearInterval(callInterval);
    setIsCallActive(false);
    setShowCallOutcomeModal(true);
  };

  const handleCallOutcomeSubmit = () => {
    if (!selectedLead) return;
    // Update lead with call outcome
    const updatedLead = {
      ...selectedLead,
      status: callOutcome === "Connected" ? "Connected" : callOutcome === "Interested" ? "Interested" : callOutcome === "Not Interested" ? "Not Interested" : callOutcome === "Converted" ? "Converted" : selectedLead.status,
    };
    // If interested, set follow-up
    if (callOutcome === "Interested" || callOutcome === "Highly Interested" || callOutcome === "Callback") {
      // Create a follow-up
      const newFollowUp = {
        id: `FU${String(followUps.length + 1).padStart(3, "0")}`,
        leadId: selectedLead.id,
        leadName: selectedLead.name,
        phone: selectedLead.phone,
        date: new Date().toISOString().split("T")[0],
        time: "10:00 AM", // default
        type: "Call",
        reason: callOutcome === "Callback" ? "Callback requested" : "Interested in service",
        assignedTelecaller: "Telecaller 1",
        status: "Pending",
      };
      setFollowUps(prev => [...prev, newFollowUp]);
      updatedLead.status = "Follow-up";
    }
    setLeads(prev => prev.map(l => l.id === selectedLead.id ? updatedLead : l));
    setShowCallOutcomeModal(false);
    setShowCallModal(false);
    setCallOutcome("");
    setCallNotes("");
  };

  const handleScheduleFollowUp = (lead) => {
    setSelectedLead(lead);
    setShowFollowUpModal(true);
  };

  const handleCreateFollowUp = (leadId, data) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const newFollowUp = {
      id: `FU${String(followUps.length + 1).padStart(3, "0")}`,
      leadId: lead.id,
      leadName: lead.name,
      phone: lead.phone,
      date: data.date || new Date().toISOString().split("T")[0],
      time: data.time || "10:00 AM",
      type: data.type || "Call",
      reason: data.reason || "Follow-up",
      assignedTelecaller: "Telecaller 1",
      status: "Pending",
    };
    setFollowUps(prev => [...prev, newFollowUp]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: "Follow-up" } : l));
    setShowFollowUpModal(false);
  };

  const handleAddNote = (leadId) => {
    if (!noteText.trim()) return;
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes: l.notes ? l.notes + "\n" + noteText : noteText } : l));
    setNoteText("");
    setShowNoteModal(false);
  };

  const handleMarkConverted = (leadId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: "Converted" } : l));
  };

  const handleMarkNotInterested = (leadId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: "Not Interested" } : l));
  };

  const handleEscalate = (leadId) => {
    alert(`Lead ${leadId} escalated to supervisor.`);
  };

  // Filter leads for queue
  const filteredLeads = leads.filter(lead => {
    if (filterStatus !== "All" && lead.status !== filterStatus) return false;
    if (filterPriority !== "All" && lead.priority !== filterPriority) return false;
    if (searchTerm && !lead.name.toLowerCase().includes(searchTerm.toLowerCase()) && !lead.phone.includes(searchTerm) && !lead.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Format timer
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

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
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">eP</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">ePay CRM</span>
              <span className="block text-xs text-blue-600 font-medium">Telecalling</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main</div>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
                  <PhoneIcon2 size={18} />
                  <span className="font-medium">Dashboard</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Calls</div>
            <ul className="space-y-1">
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><PhoneCallIcon2 size={18} /><span className="text-sm">Call Queue</span></a></li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><HistoryIcon size={18} /><span className="text-sm">Call History</span></a></li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><BookmarkIcon size={18} /><span className="text-sm">Follow-ups</span></a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Performance</div>
            <ul className="space-y-1">
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><BarChart size={18} /><span className="text-sm">My Stats</span></a></li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><Target size={18} /><span className="text-sm">Targets</span></a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Settings</div>
            <ul className="space-y-1">
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><Settings2 size={18} /><span className="text-sm">Preferences</span></a></li>
              <li><a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"><LogOut size={18} /><span className="text-sm">Logout</span></a></li>
            </ul>
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">Telecaller 1</div>
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
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">eP</span>
              </div>
            </div>
            <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">Telecalling Dashboard</h1>
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
            <input type="text" placeholder="Search leads..." className="bg-transparent border-none outline-none text-sm px-2 w-full text-gray-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-1.5 rounded hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">3</span>
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100 relative">
              <MessageSquare size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2 ml-1">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-blue-600" />
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
                <div className="text-gray-500 text-xs">Assigned Leads</div>
                <div className="text-2xl font-bold text-gray-800">{stats.assigned}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Called</div>
                <div className="text-2xl font-bold text-blue-600">{stats.called}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Connected</div>
                <div className="text-2xl font-bold text-green-600">{stats.connected}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Not Connected</div>
                <div className="text-2xl font-bold text-gray-400">{stats.notConnected}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Interested</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.interested}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Follow-ups</div>
                <div className="text-2xl font-bold text-orange-600">{stats.followups}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Converted</div>
                <div className="text-2xl font-bold text-green-700">{stats.converted}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-gray-500 text-xs">Pending Calls</div>
                <div className="text-2xl font-bold text-red-500">{stats.pending}</div>
              </div>
            </div>

            {/* Queue + Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-semibold text-gray-800">Lead Queue</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="All">All Status</option>
                    <option value="New">New</option>
                    <option value="Called">Called</option>
                    <option value="Connected">Connected</option>
                    <option value="Not Connected">Not Connected</option>
                    <option value="Interested">Interested</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Converted">Converted</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                  <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="All">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <button className="p-1.5 bg-gray-100 rounded hover:bg-gray-200" onClick={() => { setFilterStatus("All"); setFilterPriority("All"); setSearchTerm(""); }}>
                    <RefreshCw size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {filteredLeads.slice(0, 20).map((lead) => (
                  <div key={lead.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-gray-500">{lead.id}</span>
                          <span className="font-medium text-gray-800">{lead.name}</span>
                          <PriorityBadge priority={lead.priority} />
                          <StatusBadge status={lead.status} />
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span>{lead.phone}</span>
                          <span className="mx-2">·</span>
                          <span>{lead.source}</span>
                          <span className="mx-2">·</span>
                          <span>{lead.campaign}</span>
                          <span className="mx-2">·</span>
                          <span className="text-gray-500">{lead.service}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {lead.lastContact && <span>Last Contact: {lead.lastContact}</span>}
                          {lead.nextFollowUp && <span className="ml-3">Next Follow-up: {lead.nextFollowUp}</span>}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleSelectLead(lead)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
                        >
                          <PhoneIcon2 size={14} /> Call Now
                        </button>
                        <button onClick={() => handleMarkConverted(lead.id)} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Convert">
                          <CheckCircle size={16} />
                        </button>
                        <button onClick={() => handleMarkNotInterested(lead.id)} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Not Interested">
                          <XCircle size={16} />
                        </button>
                        <button onClick={() => handleScheduleFollowUp(lead)} className="p-1.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200" title="Follow-up">
                          <CalendarDays size={16} />
                        </button>
                        <button onClick={() => { setSelectedLead(lead); setShowNoteModal(true); }} className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" title="Add Note">
                          <MessageCircle size={16} />
                        </button>
                        <button onClick={() => handleEscalate(lead.id)} className="p-1.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200" title="Escalate">
                          <AlertTriangle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredLeads.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No leads match your filters.</div>
                )}
              </div>
            </div>

            {/* Performance Mini */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Telecaller Performance</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                <div><span className="text-gray-500 text-sm">Calls Assigned</span><div className="font-bold">{stats.assigned}</div></div>
                <div><span className="text-gray-500 text-sm">Calls Made</span><div className="font-bold text-blue-600">{stats.called}</div></div>
                <div><span className="text-gray-500 text-sm">Connected</span><div className="font-bold text-green-600">{stats.connected}</div></div>
                <div><span className="text-gray-500 text-sm">Connection Rate</span><div className="font-bold">{stats.connectionRate.toFixed(1)}%</div></div>
                <div><span className="text-gray-500 text-sm">Interested</span><div className="font-bold text-yellow-600">{stats.interested}</div></div>
                <div><span className="text-gray-500 text-sm">Follow-ups</span><div className="font-bold text-orange-600">{stats.followups}</div></div>
                <div><span className="text-gray-500 text-sm">Conversions</span><div className="font-bold text-green-700">{stats.converted}</div></div>
                <div><span className="text-gray-500 text-sm">Conversion Rate</span><div className="font-bold">{stats.conversionRate.toFixed(1)}%</div></div>
                <div><span className="text-gray-500 text-sm">Avg Call Duration</span><div className="font-bold">{stats.avgCallDuration}</div></div>
                <div><span className="text-gray-500 text-sm">Daily Target</span><div className="font-bold">{stats.dailyTarget}</div></div>
                <div><span className="text-gray-500 text-sm">Target Achievement</span><div className="font-bold text-blue-600">{stats.targetAchievement}%</div></div>
                <div><span className="text-gray-500 text-sm">Pending Calls</span><div className="font-bold text-red-500">{stats.pendingCalls}</div></div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ---- CALL MODAL ---- */}
      {showCallModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Calling: {selectedLead.name}</h3>
              <button onClick={() => { setShowCallModal(false); if (callInterval) clearInterval(callInterval); }} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">ID:</span> {selectedLead.id}</div>
                  <div><span className="text-gray-500">Phone:</span> {selectedLead.phone}</div>
                  <div><span className="text-gray-500">Source:</span> {selectedLead.source}</div>
                  <div><span className="text-gray-500">Campaign:</span> {selectedLead.campaign}</div>
                  <div className="col-span-2"><span className="text-gray-500">Service:</span> {selectedLead.service}</div>
                  <div className="col-span-2"><span className="text-gray-500">Priority:</span> <PriorityBadge priority={selectedLead.priority} /></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{formatTimer(callTimer)}</div>
                <div className="text-sm text-gray-500">{isCallActive ? "Call in progress..." : "Ready to call"}</div>
              </div>
              <div className="flex justify-center gap-4">
                {!isCallActive ? (
                  <button onClick={handleStartCall} className="px-6 py-2 bg-green-600 text-white rounded-full flex items-center gap-2 hover:bg-green-700">
                    <PhoneIcon2 size={20} /> Call
                  </button>
                ) : (
                  <button onClick={handleEndCall} className="px-6 py-2 bg-red-600 text-white rounded-full flex items-center gap-2 hover:bg-red-700">
                    <PhoneOffIcon2 size={20} /> End Call
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-400 text-center">
                {selectedLead.lastContact && <div>Last Contact: {selectedLead.lastContact}</div>}
                {selectedLead.nextFollowUp && <div>Next Follow-up: {selectedLead.nextFollowUp}</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- CALL OUTCOME MODAL ---- */}
      {showCallOutcomeModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Call Outcome</h3>
              <button onClick={() => setShowCallOutcomeModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Outcome</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={callOutcome} onChange={(e) => setCallOutcome(e.target.value)}>
                  <option value="">Select outcome</option>
                  <option value="Connected">Connected</option>
                  <option value="Interested">Interested</option>
                  <option value="Highly Interested">Highly Interested</option>
                  <option value="Need Information">Need Information</option>
                  <option value="Callback">Callback</option>
                  <option value="Appointment Required">Appointment Required</option>
                  <option value="Converted">Converted</option>
                  <option value="Not Connected">Not Connected</option>
                  <option value="Busy">Busy</option>
                  <option value="No Answer">No Answer</option>
                  <option value="Switched Off">Switched Off</option>
                  <option value="Invalid Number">Invalid Number</option>
                  <option value="Out of Coverage">Out of Coverage</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Wrong Number">Wrong Number</option>
                  <option value="Already Purchased">Already Purchased</option>
                  <option value="Duplicate Lead">Duplicate Lead</option>
                  <option value="Do Not Contact">Do Not Contact</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Notes</label>
                <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} value={callNotes} onChange={(e) => setCallNotes(e.target.value)} placeholder="Add notes..." />
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button onClick={handleCallOutcomeSubmit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Submit</button>
                <button onClick={() => setShowCallOutcomeModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- FOLLOW-UP MODAL ---- */}
      {showFollowUpModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Schedule Follow-up</h3>
              <button onClick={() => setShowFollowUpModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Lead</label>
                <div className="font-medium">{selectedLead.name} ({selectedLead.id})</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Date</label>
                <input type="date" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue={new Date().toISOString().split("T")[0]} id="followUpDate" />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Time</label>
                <input type="time" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="10:00" id="followUpTime" />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Type</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" id="followUpType">
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="SMS">SMS</option>
                  <option value="Email">Email</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Reason</label>
                <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Reason for follow-up" id="followUpReason" />
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    const date = document.getElementById("followUpDate")?.value;
                    const time = document.getElementById("followUpTime")?.value;
                    const type = document.getElementById("followUpType")?.value;
                    const reason = document.getElementById("followUpReason")?.value;
                    handleCreateFollowUp(selectedLead.id, { date, time, type, reason });
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Schedule
                </button>
                <button onClick={() => setShowFollowUpModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- NOTE MODAL ---- */}
      {showNoteModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Add Note for {selectedLead.name}</h3>
              <button onClick={() => setShowNoteModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={4} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Enter note..." />
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button onClick={() => handleAddNote(selectedLead.id)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Add Note</button>
                <button onClick={() => setShowNoteModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
