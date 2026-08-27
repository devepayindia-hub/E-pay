"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  Search,
  Bell,
  MessageSquare,
  HelpCircle,
  User,
  LogOut,
  Clock,
  Coffee,
  Zap,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  Bug as BugIcon,
  GitPullRequest,
  FileText,
  AlertTriangle,
  Award,
  Target,
  Users,
  Settings,
  FolderKanban,
  LayoutDashboard,
  Activity,
  Code,
  CheckSquare,
  BarChart,
  BookOpen,
  Key,
  Mail,
  LifeBuoy,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Play,
  Pause,
  StopCircle,
  Eye,
  Edit,
  Send,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  GitBranch,
  GitCommit,
  GitMerge,
  Server,
  CalendarDays,
  Clock as ClockIcon,
  UserCheck,
  UserX,
  UserMinus,
  Users as UsersIcon,
  Briefcase,
  Star,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Paperclip,
  Upload,
  Check,
  Circle,
  CircleDot,
  CircleOff,
  Loader2,
  Home,
  FolderTree,
  GitPullRequestArrow,
  Shield,
  FileCode,
  MessageCircle,
  Phone,
  Video,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Settings2,
  UserCircle2,
  File as FileIcon,
  Folder as FolderIcon,
  BookMarked,
  GraduationCap,
  Trophy,
  Flame,
  Sparkles,
} from "lucide-react";

// ============================================================
// 2. MOCK DATA
// ============================================================
const MOCK_TASKS = [
  {
    id: "DEV-1042",
    title: "Implement Firebase Authentication",
    project: "ePay CRM",
    priority: "High",
    progress: 75,
    due: "Today",
    status: "In Progress",
  },
  {
    id: "DEV-1048",
    title: "Design Dashboard UI",
    project: "ePay CRM",
    priority: "Medium",
    progress: 60,
    due: "Tomorrow",
    status: "In Progress",
  },
  {
    id: "DEV-1051",
    title: "API Integration for Payments",
    project: "ePay CRM",
    priority: "High",
    progress: 50,
    due: "Today",
    status: "Pending",
  },
  {
    id: "DEV-1035",
    title: "Fix Login Redirect Bug",
    project: "ePay Gallery",
    priority: "High",
    progress: 90,
    due: "Today",
    status: "In Progress",
  },
  {
    id: "DEV-1028",
    title: "Write Unit Tests",
    project: "ePay CRM",
    priority: "Low",
    progress: 30,
    due: "Tomorrow",
    status: "Pending",
  },
  {
    id: "DEV-1055",
    title: "Database Migration",
    project: "ePay CRM",
    priority: "High",
    progress: 20,
    due: "Today",
    status: "Blocked",
  },
  {
    id: "DEV-1040",
    title: "Review PR #284",
    project: "ePay CRM",
    priority: "Medium",
    progress: 0,
    due: "Today",
    status: "Pending",
  },
  {
    id: "DEV-1058",
    title: "Update Documentation",
    project: "ePay CRM",
    priority: "Low",
    progress: 45,
    due: "Today",
    status: "In Progress",
  },
  {
    id: "DEV-1060",
    title: "Deploy to Staging",
    project: "ePay CRM",
    priority: "High",
    progress: 100,
    due: "Yesterday",
    status: "Completed",
  },
  {
    id: "DEV-1062",
    title: "Optimize Bundle Size",
    project: "ePay Gallery",
    priority: "Medium",
    progress: 25,
    due: "Today",
    status: "Pending",
  },
  {
    id: "DEV-1065",
    title: "Implement Dark Mode",
    project: "ePay CRM",
    priority: "Low",
    progress: 10,
    due: "Tomorrow",
    status: "Pending",
  },
  {
    id: "DEV-1068",
    title: "Fix Notification System",
    project: "ePay CRM",
    priority: "High",
    progress: 55,
    due: "Today",
    status: "In Progress",
  },
];

const MOCK_PROJECTS = [
  {
    id: "1",
    name: "ePay CRM",
    progress: 78,
    sprint: "Sprint 12",
    tasks: 12,
    bugs: 3,
    prs: 2,
    due: "05 Sep 2026",
  },
  {
    id: "2",
    name: "ePay Gallery Website",
    progress: 64,
    sprint: "Sprint 5",
    tasks: 8,
    bugs: 1,
    prs: 1,
    due: "31 Aug 2026",
  },
  {
    id: "3",
    name: "ePay HR Module",
    progress: 42,
    sprint: "Sprint 3",
    tasks: 6,
    bugs: 2,
    prs: 1,
    due: "15 Sep 2026",
  },
];

const MOCK_PRS = [
  {
    id: "#284",
    title: "CRM Authentication",
    project: "CRM",
    status: "In Review",
    reviewer: "Tech Lead",
  },
  {
    id: "#281",
    title: "Gallery UI Fixes",
    project: "Gallery",
    status: "Approved",
    reviewer: "CTO",
  },
  {
    id: "#278",
    title: "HR Dashboard",
    project: "HR",
    status: "Changes Required",
    reviewer: "Lead",
  },
  {
    id: "#275",
    title: "Payment Integration",
    project: "CRM",
    status: "Draft",
    reviewer: "Tech Lead",
  },
];

const MOCK_BUGS = [
  {
    id: "BUG-421",
    title: "Firebase login redirect failure",
    priority: "High",
    project: "CRM",
    status: "In Progress",
    due: "Today",
  },
  {
    id: "BUG-418",
    title: "Dashboard not loading on Safari",
    priority: "Medium",
    project: "CRM",
    status: "In Progress",
    due: "Tomorrow",
  },
  {
    id: "BUG-415",
    title: "Payment gateway timeout",
    priority: "Critical",
    project: "CRM",
    status: "Pending",
    due: "Today",
  },
  {
    id: "BUG-410",
    title: "UI glitch in mobile view",
    priority: "Low",
    project: "Gallery",
    status: "In Progress",
    due: "Tomorrow",
  },
  {
    id: "BUG-408",
    title: "API rate limiting issue",
    priority: "High",
    project: "CRM",
    status: "Pending",
    due: "Today",
  },
  {
    id: "BUG-405",
    title: "Email notification not sending",
    priority: "Medium",
    project: "CRM",
    status: "In Progress",
    due: "Today",
  },
  {
    id: "BUG-402",
    title: "Image upload failing",
    priority: "Medium",
    project: "Gallery",
    status: "Pending",
    due: "Tomorrow",
  },
  {
    id: "BUG-398",
    title: "CSV export formatting error",
    priority: "Low",
    project: "HR",
    status: "In Progress",
    due: "Today",
  },
];

const MOCK_BLOCKERS = [
  {
    id: "1",
    title: "Firebase Production Access",
    description: "Waiting for CTO approval",
    created: "10:25 AM",
    status: "Active",
  },
  {
    id: "2",
    title: "API Documentation",
    description: "Waiting for Backend Team",
    created: "Yesterday",
    status: "Active",
  },
  {
    id: "3",
    title: "Database Connection String",
    description: "Needs to be updated in production",
    created: "2 days ago",
    status: "In Progress",
  },
];

const MOCK_NOTIFICATIONS = [
  { id: "1", message: "New task assigned by Technical Lead", time: "2 min ago", read: false, type: "task" },
  { id: "2", message: "PR #284 requires changes", time: "15 min ago", read: false, type: "pr" },
  { id: "3", message: "Task #DEV-1042 is due today", time: "1 hour ago", read: false, type: "task" },
  { id: "4", message: "CTO approved Production Access", time: "2 hours ago", read: true, type: "system" },
  { id: "5", message: "Daily report is pending", time: "4 hours ago", read: true, type: "report" },
  { id: "6", message: "Sprint deadline approaching", time: "Yesterday", read: true, type: "system" },
  { id: "7", message: "New comment on PR #281", time: "Yesterday", read: true, type: "pr" },
  { id: "8", message: "Bug #421 marked for review", time: "Yesterday", read: true, type: "bug" },
];

const MOCK_TEAM = [
  { id: "1", name: "Rahul Sharma", role: "Technical Lead", status: "Online" },
  { id: "2", name: "Amit Patel", role: "Backend Developer", status: "Online" },
  { id: "3", name: "Priya Shah", role: "Android Developer", status: "Away" },
  { id: "4", name: "Neha Joshi", role: "UI Developer", status: "Offline" },
  { id: "5", name: "Vikram Singh", role: "DevOps Engineer", status: "Online" },
];

const MOCK_GOALS = [
  { id: "1", title: "Complete CRM Authentication", target: "Q3", progress: 100, deadline: "15 Aug 2026", status: "Completed" },
  { id: "2", title: "Improve TypeScript Skills", target: "Q3", progress: 75, deadline: "30 Sep 2026", status: "In Progress" },
  { id: "3", title: "Complete Firebase Security Training", target: "Q3", progress: 40, deadline: "30 Sep 2026", status: "In Progress" },
  { id: "4", title: "Reduce High-Priority Bugs", target: "Q3", progress: 60, deadline: "30 Sep 2026", status: "In Progress" },
];

const MOCK_SKILLS = [
  { name: "React", level: 90 },
  { name: "Next.js", level: 82 },
  { name: "Node.js", level: 80 },
  { name: "Firebase", level: 72 },
  { name: "TypeScript", level: 85 },
  { name: "MongoDB", level: 65 },
  { name: "GraphQL", level: 55 },
  { name: "Docker", level: 60 },
];

const MOCK_BREAKS = [
  { id: "1", type: "Lunch", start: "01:15 PM", end: "01:45 PM", duration: "30 min" },
  { id: "2", type: "Tea", start: "04:20 PM", end: "04:32 PM", duration: "12 min" },
];

// ============================================================
// 3. UTILITY COMPONENTS
// ============================================================
const StatusBadge = ({ status }) => {
  const colors = {
    "Online": "bg-green-500",
    "Away": "bg-yellow-500",
    "Offline": "bg-gray-400",
    "Working": "bg-green-500",
    "On Break": "bg-yellow-500",
    "In Progress": "bg-blue-500",
    "Pending": "bg-yellow-500",
    "Blocked": "bg-red-500",
    "Completed": "bg-green-500",
    "Overdue": "bg-red-500",
    "High": "bg-red-500",
    "Medium": "bg-yellow-500",
    "Low": "bg-blue-500",
    "Critical": "bg-red-600",
    "Draft": "bg-gray-400",
    "Open": "bg-blue-500",
    "In Review": "bg-purple-500",
    "Changes Required": "bg-orange-500",
    "Approved": "bg-green-500",
    "Merged": "bg-purple-600",
    "Rejected": "bg-red-500",
    "Active": "bg-red-500",
    "Resolved": "bg-green-500",
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

const ProgressBar = ({ value, color = "bg-blue-600" }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
};

// ============================================================
// 4. MAIN DASHBOARD COMPONENT
// ============================================================
export default function DeveloperDashboard() {
  const { user, activeSession, activeBreak, startBreak, endBreak, logout } = useAuth();

  // ---- STATE ----
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Work status derived from auth context
  const isCheckedIn = !!activeSession;
  const workStatus = activeBreak ? "On Break" : (isCheckedIn ? "Working" : "Offline");
  
  const [loginTime, setLoginTime] = useState("09:42 AM");
  const [workingTime, setWorkingTime] = useState(384); // minutes
  const [breakTime, setBreakTime] = useState(42);
  const [activeTime, setActiveTime] = useState(342);
  const [overtime, setOvertime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(isCheckedIn);

  // Break
  const isBreakActive = !!activeBreak;
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [breakElapsed, setBreakElapsed] = useState(0);
  const [breaks, setBreaks] = useState(MOCK_BREAKS);

  // Tasks
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Projects
  const [projects, setProjects] = useState(MOCK_PROJECTS);

  // PRs
  const [prs, setPrs] = useState(MOCK_PRS);

  // Bugs
  const [bugs, setBugs] = useState(MOCK_BUGS);
  const [selectedBug, setSelectedBug] = useState(null);
  const [showBugModal, setShowBugModal] = useState(false);

  // Blockers
  const [blockers, setBlockers] = useState(MOCK_BLOCKERS);
  const [showBlockerModal, setShowBlockerModal] = useState(false);
  const [newBlocker, setNewBlocker] = useState({ title: "", description: "" });

  // Notifications
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => !n.read).length);

  // Daily Report
  const [dailyReport, setDailyReport] = useState({
    workCompleted: "",
    workInProgress: "",
    bugsFixed: "",
    problemsFaced: "",
    blockers: "",
    hoursWorked: "8",
    tomorrowPlan: "",
    remarks: "",
    attachments: [],
    submitted: false,
  });
  const [showReportModal, setShowReportModal] = useState(false);

  // Performance
  const [performance] = useState({
    overall: 91,
    taskCompletion: 94,
    codeQuality: 90,
    bugResolution: 88,
    deadlineAdherence: 93,
    codeReviews: 92,
    attendance: 96,
  });

  // Goals
  const [goals, setGoals] = useState(MOCK_GOALS);

  // Skills
  const [skills] = useState(MOCK_SKILLS);

  // Team
  const [team] = useState(MOCK_TEAM);

  // Quick Actions
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Current sprint
  const [sprint] = useState({
    name: "Sprint 12",
    start: "15 Aug 2026",
    end: "05 Sep 2026",
    goal: "Complete CRM Authentication and Payment Integration",
    assigned: 25,
    completed: 18,
    remaining: 7,
    bugs: 4,
    progress: 72,
    deadline: "05 Sep 2026",
  });

  // Git activity
  const [gitActivity] = useState({
    commits: 8,
    pullRequests: 2,
    prsMerged: 1,
    codeReviews: 3,
    branchesCreated: 1,
    bugsFixed: 2,
    deployments: 1,
    recent: [
      { time: "10:42 AM", action: "Commit pushed", detail: "feature/crm-login" },
      { time: "09:55 AM", action: "Pull Request #284 created", detail: "" },
      { time: "09:20 AM", action: "Bug #421 marked Fixed", detail: "" },
      { time: "08:58 AM", action: "Development server deployed", detail: "" },
    ],
  });

  // Attendance
  const [attendance] = useState({
    percentage: 96,
    workingDays: 22,
    present: 21,
    leave: 1,
    lateDays: 2,
    totalHours: 176,
    overtime: 8,
    avgDailyHours: 8,
  });

  // ---- EFFECTS ----
  useEffect(() => {
    // Update unread count
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Sync timer running state with isCheckedIn
  useEffect(() => {
    setIsTimerRunning(isCheckedIn && !isBreakActive);
  }, [isCheckedIn, isBreakActive]);

  // Timer for working time
  useEffect(() => {
    let interval;
    if (isTimerRunning && isCheckedIn) {
      interval = setInterval(() => {
        setWorkingTime(prev => prev + 1 / 60);
        setActiveTime(prev => prev + 1 / 60);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isCheckedIn]);

  // Break timer
  useEffect(() => {
    let interval;
    if (isBreakActive) {
      interval = setInterval(() => {
        setBreakElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreakActive]);

  // Sync login time if session is active
  useEffect(() => {
    if (activeSession && activeSession.loginTime) {
      try {
        const date = new Date(activeSession.loginTime);
        setLoginTime(date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
      } catch (e) {}
    }
  }, [activeSession]);

  // ---- HANDLERS ----

  // Check-in / Check-out integration
  const handleCheckInOut = async () => {
    if (isCheckedIn) {
      if (confirm("Are you sure you want to Check Out and sign out of CRM?")) {
        await logout();
        if (typeof window !== 'undefined') window.location.href = "/login";
      }
    } else {
      if (typeof window !== 'undefined') window.location.href = "/login";
    }
  };

  // Break management integration
  const handleStartBreak = async () => {
    if (isBreakActive) return;
    try {
      const now = new Date();
      setBreakStartTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
      setBreakElapsed(0);
      if (startBreak) await startBreak("TEA");
    } catch (e) {
      console.warn("Failed to start break in context:", e);
    }
  };

  const handleEndBreak = async () => {
    if (!isBreakActive) return;
    try {
      if (endBreak) await endBreak();
      const now = new Date();
      const endTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const duration = Math.round(breakElapsed / 60);
      const newBreak = {
        id: Date.now().toString(),
        type: "Break",
        start: breakStartTime || now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        end: endTime,
        duration: `${duration} min`,
      };
      setBreaks(prev => [...prev, newBreak]);
      setBreakTime(prev => prev + duration);
      setBreakStartTime(null);
      setBreakElapsed(0);
    } catch (e) {
      console.warn("Failed to end break in context:", e);
    }
  };

  // Task actions
  const handleTaskAction = (task, action) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    setShowTaskModal(false);
  };

  // Bug actions
  const handleBugAction = (bug, action) => {
    setSelectedBug(bug);
    setShowBugModal(true);
  };

  const handleBugUpdate = (bugId, updates) => {
    setBugs(prev => prev.map(b => b.id === bugId ? { ...b, ...updates } : b));
    setShowBugModal(false);
  };

  // Blocker actions
  const handleReportBlocker = () => {
    if (newBlocker.title.trim() === "" || newBlocker.description.trim() === "") return;
    const blocker = {
      id: Date.now().toString(),
      title: newBlocker.title,
      description: newBlocker.description,
      created: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      status: "Active",
    };
    setBlockers(prev => [...prev, blocker]);
    setNewBlocker({ title: "", description: "" });
    setShowBlockerModal(false);
    alert(`🔔 Blocker reported: "${newBlocker.title}" - Technical Lead has been notified.`);
  };

  // Daily Report
  const handleSubmitReport = () => {
    if (
      dailyReport.workCompleted.trim() === "" ||
      dailyReport.workInProgress.trim() === "" ||
      dailyReport.tomorrowPlan.trim() === ""
    ) {
      alert("Please fill in Work Completed, Work In Progress, and Tomorrow's Plan.");
      return;
    }
    setDailyReport(prev => ({ ...prev, submitted: true }));
    setShowReportModal(false);
    alert("✅ Daily report submitted successfully!");
  };

  // Notification actions
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Quick actions
  const handleQuickAction = (action) => {
    switch (action) {
      case "Create Task Request":
        alert("📝 Opening task request form...");
        break;
      case "Report Bug":
        alert("🐛 Opening bug report form...");
        break;
      case "Create Pull Request":
        alert("🔀 Opening PR creation form...");
        break;
      case "Daily Report":
        setShowReportModal(true);
        break;
      case "Report Blocker":
        setShowBlockerModal(true);
        break;
      case "Request Overtime":
        alert("⏰ Opening overtime request form...");
        break;
      case "Apply Leave":
        alert("🏖 Opening leave application form...");
        break;
      case "Request Training":
        alert("📚 Opening training request form...");
        break;
      case "Contact Technical Lead":
        alert("💬 Opening chat with Technical Lead...");
        break;
      default:
        alert(`Action: ${action}`);
    }
    setShowQuickActions(false);
  };

  // Format time
  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m`;
  };

  const formatBreakTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Count tasks by status
  const taskCounts = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Completed").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    pending: tasks.filter(t => t.status === "Pending").length,
    blocked: tasks.filter(t => t.status === "Blocked").length,
    overdue: tasks.filter(t => t.status === "Overdue").length,
  };

  // Count bugs by priority
  const bugCounts = {
    critical: bugs.filter(b => b.priority === "Critical").length,
    high: bugs.filter(b => b.priority === "High").length,
    medium: bugs.filter(b => b.priority === "Medium").length,
    low: bugs.filter(b => b.priority === "Low").length,
  };

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
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">eP</span>
            </div>
            <span className="font-bold text-gray-800">ePay CRM</span>
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
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main</div>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
                  <LayoutDashboard size={18} />
                  <span className="font-medium">Dashboard</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">My Development</div>
            <ul className="space-y-1">
              {["My Projects", "My Tasks", "My Sprints", "My Bugs", "Pull Requests", "Code Reviews", "Git Activity", "Deployments"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "My Projects" && <FolderKanban size={18} />}
                    {item === "My Tasks" && <CheckSquare size={18} />}
                    {item === "My Sprints" && <Calendar size={18} />}
                    {item === "My Bugs" && <BugIcon size={18} />}
                    {item === "Pull Requests" && <GitPullRequest size={18} />}
                    {item === "Code Reviews" && <Eye size={18} />}
                    {item === "Git Activity" && <GitCommit size={18} />}
                    {item === "Deployments" && <Server size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Attendance</div>
            <ul className="space-y-1">
              {["Attendance", "Working Hours", "Breaks", "Login History", "Overtime", "Leave"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Attendance" && <UserCheck size={18} />}
                    {item === "Working Hours" && <Clock size={18} />}
                    {item === "Breaks" && <Coffee size={18} />}
                    {item === "Login History" && <ClockIcon size={18} />}
                    {item === "Overtime" && <Zap size={18} />}
                    {item === "Leave" && <CalendarDays size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Performance</div>
            <ul className="space-y-1">
              {["My Performance", "Goals", "Skill Matrix", "Training"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "My Performance" && <BarChart size={18} />}
                    {item === "Goals" && <Target size={18} />}
                    {item === "Skill Matrix" && <BookOpen size={18} />}
                    {item === "Training" && <GraduationCap size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Reports</div>
            <ul className="space-y-1">
              {["Daily Reports", "Weekly Reports", "Monthly Reports"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <FileText size={18} />
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Access</div>
            <ul className="space-y-1">
              {["My Permissions", "Repository Access", "Environment Access", "Access Requests"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <Shield size={18} />
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Profile</div>
            <ul className="space-y-1">
              {["My Profile", "Documents", "Assets", "Settings"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "My Profile" && <User size={18} />}
                    {item === "Documents" && <FileIcon size={18} />}
                    {item === "Assets" && <FolderIcon size={18} />}
                    {item === "Settings" && <Settings size={18} />}
                    <span className="text-sm">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Communication</div>
            <ul className="space-y-1">
              {["Notifications", "Messages", "Support"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    {item === "Notifications" && <Bell size={18} />}
                    {item === "Messages" && <MessageSquare size={18} />}
                    {item === "Support" && <LifeBuoy size={18} />}
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
            <div className="w-8 h-8 bg-blue-600/10 rounded-full flex items-center justify-center font-bold text-blue-600 uppercase text-xs">
              {user?.name ? user.name.slice(0, 2) : "DV"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{user?.name || "Developer"}</div>
              <div className="text-xs text-gray-500 truncate">{user?.designation || "Software Engineer"}</div>
            </div>
            <button onClick={handleCheckInOut} className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors" title="Check Out & Log Out">
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
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">eP</span>
              </div>
            </div>
            <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">Developer Dashboard</h1>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 mx-4 flex-1 max-w-md">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks, projects, bugs..."
              className="bg-transparent border-none outline-none text-sm px-2 w-full text-gray-700"
            />
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5">
              <FolderKanban size={14} />
              <span>Sprint 12</span>
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
                    <button onClick={handleMarkAllRead} className="text-xs text-blue-600 hover:underline">
                      Mark all read
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!n.read ? "bg-blue-50" : ""}`}
                        onClick={() => handleMarkRead(n.id)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            {n.type === "task" && <CheckSquare size={14} className="text-blue-500" />}
                            {n.type === "pr" && <GitPullRequest size={14} className="text-purple-500" />}
                            {n.type === "bug" && <BugIcon size={14} className="text-red-500" />}
                            {n.type === "system" && <Bell size={14} className="text-gray-500" />}
                            {n.type === "report" && <FileText size={14} className="text-green-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-800">{n.message}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{n.time}</div>
                          </div>
                          {!n.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />}
                        </div>
                      </div>
                    ))
                  )}
                  <div className="p-2 text-center border-t border-gray-100">
                    <button className="text-xs text-blue-600 hover:underline">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <button className="p-1.5 rounded hover:bg-gray-100 relative">
              <MessageSquare size={20} className="text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 text-white text-[10px] rounded-full flex items-center justify-center">3</span>
            </button>

            {/* Help */}
            <button className="p-1.5 rounded hover:bg-gray-100 hidden sm:block">
              <HelpCircle size={20} className="text-gray-600" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 ml-1">
              <div className="w-8 h-8 bg-blue-600/10 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "DV"}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-gray-800 leading-none">{user?.name ? user.name.split(" ")[0] : "John"}</div>
                <div className="text-[10px] text-gray-500 font-medium">Devhub</div>
              </div>
            </div>

            {/* Check-in/out */}
            <button
              onClick={handleCheckInOut}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${isCheckedIn
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              {isCheckedIn ? "Check Out" : "Check In"}
            </button>
          </div>
        </header>

        {/* ---- DASHBOARD CONTENT ---- */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Status Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${workStatus === "Working" ? "bg-green-500 animate-pulse" : workStatus === "On Break" ? "bg-yellow-500 animate-pulse" : "bg-gray-400"}`} />
                    <span className="font-semibold text-gray-800">{workStatus}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>Login: {loginTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <ClockIcon size={16} />
                    <span>Work: {formatTime(workingTime)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Coffee size={16} />
                    <span>Break: {formatTime(breakTime)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Zap size={16} />
                    <span>Active: {formatTime(activeTime)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <TrendingUp size={16} className="text-orange-500" />
                    <span>Overtime: {formatTime(overtime)}</span>
                  </div>
                </div>
                {/* Break controls */}
                <div className="flex items-center gap-2">
                  {isBreakActive ? (
                    <button
                      onClick={handleEndBreak}
                      className="px-4 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 flex items-center gap-2"
                    >
                      <StopCircle size={16} />
                      End Break ({formatBreakTime(breakElapsed)})
                    </button>
                  ) : (
                    <button
                      onClick={handleStartBreak}
                      disabled={!isCheckedIn}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${!isCheckedIn ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`}
                    >
                      <Coffee size={16} />
                      Start Break
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckSquare size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{taskCounts.total}</div>
                    <div className="text-xs text-gray-500">Tasks</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FolderKanban size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{projects.length}</div>
                    <div className="text-xs text-gray-500">Projects</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <BugIcon size={20} className="text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{bugs.length}</div>
                    <div className="text-xs text-gray-500">Bugs</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <GitPullRequest size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{prs.length}</div>
                    <div className="text-xs text-gray-500">PRs</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <BarChart size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{performance.overall}%</div>
                    <div className="text-xs text-gray-500">Performance</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <UserCheck size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{attendance.percentage}%</div>
                    <div className="text-xs text-gray-500">Attendance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row: Tasks + Sprint */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tasks */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">My Tasks</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 text-xs">Total: <span className="font-medium">{taskCounts.total}</span></span>
                    <span className="text-green-600 text-xs">Completed: <span className="font-medium">{taskCounts.completed}</span></span>
                    <span className="text-blue-600 text-xs">In Progress: <span className="font-medium">{taskCounts.inProgress}</span></span>
                    <span className="text-yellow-600 text-xs">Pending: <span className="font-medium">{taskCounts.pending}</span></span>
                    <span className="text-red-600 text-xs">Blocked: <span className="font-medium">{taskCounts.blocked}</span></span>
                    <span className="text-orange-600 text-xs">Overdue: <span className="font-medium">{taskCounts.overdue}</span></span>
                  </div>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {tasks.slice(0, 6).map((task) => (
                    <div key={task.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-gray-500">{task.id}</span>
                            <span className="font-medium text-gray-800 text-sm">{task.title}</span>
                            <PriorityBadge priority={task.priority} />
                            <StatusBadge status={task.status} />
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{task.project}</span>
                            <span>Due: {task.due}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <ProgressBar value={task.progress} color={task.progress > 70 ? "bg-green-600" : task.progress > 40 ? "bg-yellow-600" : "bg-red-500"} />
                            <span className="text-xs text-gray-500">{task.progress}%</span>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => handleTaskAction(task, "open")} className="p-1 hover:bg-gray-200 rounded text-blue-600" title="Open">
                              <Eye size={14} />
                            </button>
                            <button onClick={() => handleTaskAction(task, "update")} className="p-1 hover:bg-gray-200 rounded text-green-600" title="Update">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => handleTaskAction(task, "submit")} className="p-1 hover:bg-gray-200 rounded text-purple-600" title="Submit for Review">
                              <Send size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Sprint */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Sprint</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-xl font-bold text-gray-800">{sprint.name}</div>
                    <div className="text-sm text-gray-500">{sprint.start} → {sprint.end}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">{sprint.completed} / {sprint.assigned} tasks completed</div>
                    <div className="mt-2">
                      <ProgressBar value={sprint.progress} />
                      <div className="text-right text-sm font-medium text-gray-700 mt-1">{sprint.progress}%</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="text-gray-500">Remaining</div>
                      <div className="font-bold text-gray-800">{sprint.remaining}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="text-gray-500">Bugs</div>
                      <div className="font-bold text-gray-800">{sprint.bugs}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Goal:</span> {sprint.goal}
                  </div>
                  <div className="text-sm text-orange-600 flex items-center gap-1">
                    <AlertTriangle size={14} />
                    <span>Deadline: {sprint.deadline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row: Projects + Git Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projects */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">My Projects</h2>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-800">{project.name}</div>
                          <div className="text-xs text-gray-500">{project.sprint}</div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{project.tasks} Tasks</span>
                            <span>{project.bugs} Bugs</span>
                            <span>{project.prs} PRs</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-700">{project.progress}%</div>
                          <div className="text-xs text-gray-500">Due: {project.due}</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={project.progress} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Git Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Git / Development Activity</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <GitCommit size={18} className="text-blue-600 mx-auto" />
                    <div className="text-lg font-bold text-gray-800">{gitActivity.commits}</div>
                    <div className="text-xs text-gray-500">Commits</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <GitPullRequest size={18} className="text-purple-600 mx-auto" />
                    <div className="text-lg font-bold text-gray-800">{gitActivity.pullRequests}</div>
                    <div className="text-xs text-gray-500">PRs</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <GitMerge size={18} className="text-green-600 mx-auto" />
                    <div className="text-lg font-bold text-gray-800">{gitActivity.prsMerged}</div>
                    <div className="text-xs text-gray-500">Merged</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <Eye size={18} className="text-yellow-600 mx-auto" />
                    <div className="text-lg font-bold text-gray-800">{gitActivity.codeReviews}</div>
                    <div className="text-xs text-gray-500">Reviews</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Recent Activity</h3>
                  {gitActivity.recent.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm border-b border-gray-100 pb-2 last:border-0">
                      <span className="text-xs text-gray-400 w-14 flex-shrink-0">{item.time}</span>
                      <span className="text-gray-700">{item.action}</span>
                      {item.detail && <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.detail}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row: Pull Requests + Bug Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pull Requests */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Pull Requests</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-2 font-medium">PR</th>
                        <th className="pb-2 font-medium">Project</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Reviewer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prs.map((pr) => (
                        <tr key={pr.id} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 font-mono text-blue-600">{pr.id}</td>
                          <td className="py-2">{pr.project}</td>
                          <td className="py-2"><StatusBadge status={pr.status} /></td>
                          <td className="py-2 text-gray-600">{pr.reviewer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bug Tracker */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Bug Tracker</h2>
                <div className="flex gap-4 mb-4 flex-wrap">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-600 rounded-full"></span> Critical: {bugCounts.critical}</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> High: {bugCounts.high}</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Medium: {bugCounts.medium}</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Low: {bugCounts.low}</div>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {bugs.slice(0, 4).map((bug) => (
                    <div key={bug.id} className="bg-gray-50 rounded-lg p-2 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-500">{bug.id}</span>
                          <span className="text-sm text-gray-800">{bug.title}</span>
                          <PriorityBadge priority={bug.priority} />
                        </div>
                        <div className="text-xs text-gray-500">{bug.project} · Due: {bug.due}</div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleBugAction(bug, "view")} className="p-1 hover:bg-gray-200 rounded text-blue-600"><Eye size={14} /></button>
                        <button onClick={() => handleBugAction(bug, "update")} className="p-1 hover:bg-gray-200 rounded text-green-600"><Edit size={14} /></button>
                        <button onClick={() => handleBugAction(bug, "resolve")} className="p-1 hover:bg-gray-200 rounded text-purple-600"><Check size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row: Blockers + Daily Report */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Blockers */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Active Blockers</h2>
                  <button
                    onClick={() => setShowBlockerModal(true)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 flex items-center gap-1"
                  >
                    <AlertTriangle size={14} />
                    Report Blocker
                  </button>
                </div>
                {blockers.filter(b => b.status === "Active" || b.status === "In Progress").length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">No active blockers 🎉</div>
                ) : (
                  <div className="space-y-2">
                    {blockers.filter(b => b.status === "Active" || b.status === "In Progress").map((blocker) => (
                      <div key={blocker.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${blocker.status === "Active" ? "bg-red-500 animate-pulse" : "bg-yellow-500"}`} />
                            <span className="font-medium text-gray-800">{blocker.title}</span>
                            <StatusBadge status={blocker.status} />
                          </div>
                          <div className="text-sm text-gray-500">{blocker.description}</div>
                          <div className="text-xs text-gray-400">Created: {blocker.created}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Daily Report */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Today's Daily Report</h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${dailyReport.submitted ? "text-green-600" : "text-yellow-600"}`}>
                      {dailyReport.submitted ? "✅ Submitted" : "⚠️ Not Submitted"}
                    </span>
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      {dailyReport.submitted ? "Edit Report" : "Submit Daily Report"}
                    </button>
                  </div>
                </div>
                {dailyReport.submitted ? (
                  <div className="bg-green-50 rounded-lg p-4 text-center text-green-700">
                    <CheckCircle size={24} className="mx-auto mb-2" />
                    <p className="font-medium">Report submitted successfully!</p>
                    <p className="text-sm text-green-600">You can edit it using the button above.</p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 rounded-lg p-4 text-center text-yellow-700">
                    <AlertCircle size={24} className="mx-auto mb-2" />
                    <p className="font-medium">Daily report not submitted yet</p>
                    <p className="text-sm text-yellow-600">Please submit your daily report before EOD.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Row: Attendance + Performance + Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Attendance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attendance</span>
                    <span className="font-medium text-gray-800">{attendance.percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Working Days</span>
                    <span className="font-medium text-gray-800">{attendance.workingDays}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Present</span>
                    <span className="font-medium text-green-600">{attendance.present}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Leave</span>
                    <span className="font-medium text-red-600">{attendance.leave}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Late Days</span>
                    <span className="font-medium text-yellow-600">{attendance.lateDays}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Hours</span>
                    <span className="font-medium text-gray-800">{attendance.totalHours}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Overtime</span>
                    <span className="font-medium text-orange-600">{attendance.overtime}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg. Daily Hours</span>
                    <span className="font-medium text-gray-800">{attendance.avgDailyHours}h</span>
                  </div>
                  <button className="w-full mt-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    View Attendance
                  </button>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">My Performance — August 2026</h2>
                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-gray-800">{performance.overall}%</div>
                  <div className="text-sm text-gray-500">Overall Score</div>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(performance).filter(([k]) => k !== "overall").map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium text-gray-800">{value}%</span>
                      </div>
                      <ProgressBar value={value} color={value > 90 ? "bg-green-600" : value > 75 ? "bg-blue-600" : value > 60 ? "bg-yellow-600" : "bg-red-500"} />
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                  View Full Performance
                </button>
              </div>

              {/* Goals */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">My Goals — Q3</h2>
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div key={goal.id} className="bg-gray-50 rounded-lg p-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${goal.status === "Completed" ? "text-green-600" : "text-gray-800"}`}>
                              {goal.status === "Completed" ? "✓ " : ""}{goal.title}
                            </span>
                            <StatusBadge status={goal.status} />
                          </div>
                          <div className="text-xs text-gray-500">Target: {goal.target} · Deadline: {goal.deadline}</div>
                        </div>
                        <div className="text-sm font-medium text-gray-700">{goal.progress}%</div>
                      </div>
                      <ProgressBar value={goal.progress} color={goal.progress === 100 ? "bg-green-600" : "bg-blue-600"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row: Skill Matrix + Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skill Matrix */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Skill Matrix</h2>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    View Skill Profile
                  </button>
                </div>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{skill.name}</span>
                        <span className="font-medium text-gray-800">{skill.level}%</span>
                      </div>
                      <ProgressBar value={skill.level} color={skill.level > 80 ? "bg-green-600" : skill.level > 60 ? "bg-blue-600" : "bg-yellow-600"} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Team */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Team</h2>
                <div className="space-y-3">
                  {team.map((member) => (
                    <div key={member.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${member.status === "Online" ? "bg-green-500" : member.status === "Away" ? "bg-yellow-500" : "bg-gray-400"}`} />
                          <span className="text-xs text-gray-500">{member.status}</span>
                        </div>
                        <button className="p-1 hover:bg-gray-200 rounded text-blue-600" title="Message">
                          <MessageSquare size={14} />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="View Profile">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Plus, label: "Create Task Request" },
                  { icon: BugIcon, label: "Report Bug" },
                  { icon: GitPullRequest, label: "Create Pull Request" },
                  { icon: FileText, label: "Daily Report" },
                  { icon: AlertTriangle, label: "Report Blocker" },
                  { icon: Clock, label: "Request Overtime" },
                  { icon: CalendarDays, label: "Apply Leave" },
                  { icon: BookOpen, label: "Request Training" },
                  { icon: MessageSquare, label: "Contact Technical Lead" },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.label)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors border border-gray-200"
                  >
                    <action.icon size={16} />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-200">
              ePay CRM — Developer Dashboard v2.0 · © 2026 ePay Inc.
            </div>
          </div>
        </main>
      </div>

      {/* ---- MODALS ---- */}

      {/* Task Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Task: {selectedTask.id}</h3>
              <button onClick={() => setShowTaskModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-sm text-gray-500">Title</div>
                <div className="font-medium text-gray-800">{selectedTask.title}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Project</div>
                <div className="text-gray-800">{selectedTask.project}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Priority</div>
                <PriorityBadge priority={selectedTask.priority} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Progress</div>
                <div className="flex items-center gap-3">
                  <ProgressBar value={selectedTask.progress} />
                  <span className="text-sm font-medium">{selectedTask.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedTask.progress}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, progress: val } : t));
                    setSelectedTask(prev => prev ? { ...prev, progress: val } : null);
                  }}
                  className="w-full mt-1"
                />
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <select
                  value={selectedTask.status}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: val } : t));
                    setSelectedTask(prev => prev ? { ...prev, status: val } : null);
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div>
                <div className="text-sm text-gray-500">Due</div>
                <div className="text-gray-800">{selectedTask.due}</div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button onClick={() => handleTaskUpdate(selectedTask.id, {})} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Update Task
                </button>
                <button onClick={() => setShowTaskModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bug Modal */}
      {showBugModal && selectedBug && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Bug: {selectedBug.id}</h3>
              <button onClick={() => setShowBugModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-sm text-gray-500">Title</div>
                <div className="font-medium text-gray-800">{selectedBug.title}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Priority</div>
                <PriorityBadge priority={selectedBug.priority} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Project</div>
                <div className="text-gray-800">{selectedBug.project}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <select
                  value={selectedBug.status}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBugs(prev => prev.map(b => b.id === selectedBug.id ? { ...b, status: val } : b));
                    setSelectedBug(prev => prev ? { ...prev, status: val } : null);
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Closed">Closed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <div className="text-sm text-gray-500">Due</div>
                <div className="text-gray-800">{selectedBug.due}</div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button onClick={() => handleBugUpdate(selectedBug.id, {})} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Update Bug
                </button>
                <button onClick={() => setShowBugModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blocker Modal */}
      {showBlockerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Report Blocker</h3>
              <button onClick={() => setShowBlockerModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-sm text-gray-500">Title</div>
                <input
                  type="text"
                  value={newBlocker.title}
                  onChange={(e) => setNewBlocker(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What is blocking you?"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="text-sm text-gray-500">Description</div>
                <textarea
                  value={newBlocker.description}
                  onChange={(e) => setNewBlocker(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide more details..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="text-xs text-gray-500">
                <AlertTriangle size={14} className="inline mr-1" />
                This will automatically notify the Technical Lead.
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleReportBlocker} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                  Report Blocker
                </button>
                <button onClick={() => setShowBlockerModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">Daily Report</h3>
              <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700">Work Completed <span className="text-red-500">*</span></div>
                <textarea
                  value={dailyReport.workCompleted}
                  onChange={(e) => setDailyReport(prev => ({ ...prev, workCompleted: e.target.value }))}
                  placeholder="What did you accomplish today?"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Work In Progress <span className="text-red-500">*</span></div>
                <textarea
                  value={dailyReport.workInProgress}
                  onChange={(e) => setDailyReport(prev => ({ ...prev, workInProgress: e.target.value }))}
                  placeholder="What are you currently working on?"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Bugs Fixed</div>
                <input
                  type="text"
                  value={dailyReport.bugsFixed}
                  onChange={(e) => setDailyReport(prev => ({ ...prev, bugsFixed: e.target.value }))}
                  placeholder="List any bugs you fixed"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Problems Faced</div>
                <textarea
                  value={dailyReport.problemsFaced}
                  onChange={(e) => setDailyReport(prev => ({ ...prev, problemsFaced: e.target.value }))}
                  placeholder="Any challenges or problems?"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Blockers</div>
                <input
                  type="text"
                  value={dailyReport.blockers}
                  onChange={(e) => setDailyReport(prev => ({ ...prev, blockers: e.target.value }))}
                  placeholder="Any blockers?"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Hours Worked</div>
                <input
                  type="number"
                  value={dailyReport.hoursWorked}
                  onChange={(e) => setDailyReport(prev => ({ ...prev, hoursWorked: e.target.value }))}
                  min="0"
                  max="24"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Tomorrow's Plan <span className="text-red-500">*</span></div>
                <textarea
                  value={dailyReport.tomorrowPlan}
                  onChange={(e) => setDailyReport(prev => ({ ...prev, tomorrowPlan: e.target.value }))}
                  placeholder="What do you plan to work on tomorrow?"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Remarks</div>
                <textarea
                  value={dailyReport.remarks}
                  onChange={(e) => setDailyReport(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Any additional remarks?"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Attachments</div>
                <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                  <Paperclip size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Click to upload files</span>
                  <Upload size={14} className="text-gray-400 ml-auto" />
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button onClick={handleSubmitReport} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  {dailyReport.submitted ? "Update Report" : "Submit Report"}
                </button>
                <button onClick={() => setShowReportModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
