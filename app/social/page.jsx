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
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Send,
  Image,
  Video,
  FileText,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Plus,
  Filter,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  RefreshCw,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Phone,
  Mail,
  Globe,
  MapPin,
  Upload,
  Paperclip,
  Star,
  Award,
  Zap,
  Sparkles,
  Flame,
  Target,
  Settings,
  LayoutDashboard,
  FolderKanban,
  List,
  Inbox,
  Megaphone,
  Share,
  Link,
  Hash,
  Tag,
  Folder,
  Film,
  File,
  CheckSquare,
  Square,
  Circle,
  CircleDot,
  CircleOff,
  Loader2,
  Shield,
  UserCheck,
  UserX,
  UserMinus,
  Reply,
  Forward,
  Bookmark,
  Flag,
  MoreVertical,
  Copy,
  Download,
  Printer,
  EyeOff,
  RefreshCcw,
  Save,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListOrdered,
  Link2,
  ImagePlus,
  Smile,
  AtSign,
  DollarSign,
  CreditCard,
  Wallet,
  Minus,
  Gauge,
  Timer,
  Coffee,
  Briefcase,
  Building2,
  Home,
  Store,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Package,
  Box,
  Clipboard,
  FileCheck2,
  FileCheck,
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
  BellOff,
  Volume2,
  VolumeX,
  Mic,
  Camera,
} from "lucide-react";

// Local Aliases to avoid duplicate imports
const InstagramIcon = Instagram;
const FacebookIcon = Facebook;
const YoutubeIcon = Youtube;
const LinkedinIcon = Linkedin;
const TwitterIcon = Twitter;
const MessageCircleIcon2 = MessageCircle;
const GlobeIcon = Globe;
const UsersIcon = Users;
const UsersIcon2 = Users;

// ============================================================
// 1. MOCK DATA
// ============================================================

const MOCK_CONTENT = [
  {
    id: "C001",
    title: "Summer Collection Launch",
    type: "Post",
    platform: "Instagram",
    campaign: "Summer Sale 2026",
    caption: "Check out our new summer collection! 🌞 #SummerVibes #NewCollection",
    creative: "summer_post.jpg",
    hashtags: ["#SummerVibes", "#NewCollection", "#Fashion"],
    scheduledDate: "2026-08-27",
    scheduledTime: "10:00 AM",
    status: "Scheduled",
    approvalStatus: "Approved",
    approvedBy: "Kiran Joshi",
    category: "Product Launch",
    cta: "Shop Now",
    landingPage: "https://epay.com/summer",
    targetAudience: "18-35, Fashion Enthusiasts",
  },
  {
    id: "C002",
    title: "Behind the Scenes",
    type: "Reel",
    platform: "Instagram",
    campaign: "Brand Awareness",
    caption: "Go behind the scenes of our latest shoot! 🎬 #BTS #CreativeProcess",
    creative: "bts_reel.mp4",
    hashtags: ["#BTS", "#CreativeProcess", "#FilmMaking"],
    scheduledDate: "2026-08-28",
    scheduledTime: "02:00 PM",
    status: "Pending Approval",
    approvalStatus: "Pending",
    reviewer: "Rahul Sharma",
    category: "Behind the Scenes",
    cta: "Watch Now",
    targetAudience: "18-45, Creative Professionals",
  },
  {
    id: "C003",
    title: "Customer Testimonial",
    type: "Video",
    platform: "YouTube",
    campaign: "Testimonial Campaign",
    caption: "Hear from our happy customer! #Testimonial #CustomerLove",
    creative: "testimonial_video.mp4",
    hashtags: ["#Testimonial", "#CustomerLove", "#HappyCustomer"],
    scheduledDate: "2026-08-26",
    scheduledTime: "09:30 AM",
    status: "Published",
    approvalStatus: "Approved",
    approvedBy: "Kiran Joshi",
    publishedUrl: "https://youtube.com/watch?v=abc123",
    category: "Testimonial",
    cta: "Learn More",
    landingPage: "https://epay.com/testimonials",
    targetAudience: "All Customers",
  },
  {
    id: "C004",
    title: "Product Feature: AI Integration",
    type: "Carousel",
    platform: "LinkedIn",
    campaign: "Tech Showcase",
    caption: "Discover how our AI integration is transforming the industry. #AI #TechInnovation",
    creative: "ai_carousel.pdf",
    hashtags: ["#AI", "#TechInnovation", "#DigitalTransformation"],
    scheduledDate: "2026-08-29",
    scheduledTime: "11:00 AM",
    status: "Draft",
    approvalStatus: "Pending",
    category: "Technology",
    cta: "Read More",
    targetAudience: "B2B, Tech Professionals",
  },
  {
    id: "C005",
    title: "Flash Sale Announcement",
    type: "Post",
    platform: "Facebook",
    campaign: "Flash Sale",
    caption: "24-hour flash sale! Don't miss out! 🔥 #FlashSale #Deals",
    creative: "flash_sale.jpg",
    hashtags: ["#FlashSale", "#Deals", "#LimitedTime"],
    scheduledDate: "2026-08-25",
    scheduledTime: "08:00 AM",
    status: "Published",
    approvalStatus: "Approved",
    approvedBy: "Kiran Joshi",
    publishedUrl: "https://facebook.com/post/xyz",
    category: "Promotion",
    cta: "Shop Now",
    landingPage: "https://epay.com/flashsale",
    targetAudience: "All Customers",
  },
  {
    id: "C006",
    title: "Employee Spotlight",
    type: "Post",
    platform: "LinkedIn",
    campaign: "Employee Engagement",
    caption: "Meet our amazing team member! #EmployeeSpotlight #TeamWork",
    creative: "employee_spotlight.jpg",
    hashtags: ["#EmployeeSpotlight", "#TeamWork", "#CompanyCulture"],
    scheduledDate: "2026-08-30",
    scheduledTime: "03:00 PM",
    status: "Pending Approval",
    approvalStatus: "Pending",
    reviewer: "Meera Reddy",
    category: "Culture",
    cta: "Learn More",
    targetAudience: "Employees, Prospective Hires",
  },
  {
    id: "C007",
    title: "Weekly Roundup",
    type: "Article",
    platform: "X",
    campaign: "Content Marketing",
    caption: "Our weekly roundup of top stories! #WeeklyRoundup #News",
    creative: "roundup_article.pdf",
    hashtags: ["#WeeklyRoundup", "#News", "#IndustryUpdates"],
    scheduledDate: "2026-08-31",
    scheduledTime: "12:00 PM",
    status: "Draft",
    approvalStatus: "Pending",
    category: "Newsletter",
    cta: "Read More",
    targetAudience: "Industry Professionals",
  },
  {
    id: "C008",
    title: "Holiday Special",
    type: "Story",
    platform: "Instagram",
    campaign: "Holiday Promo",
    caption: "Celebrate the holidays with us! 🎄 #HolidaySpecial #Festive",
    creative: "holiday_story.jpg",
    hashtags: ["#HolidaySpecial", "#Festive", "#Celebration"],
    scheduledDate: "2026-08-27",
    scheduledTime: "06:00 PM",
    status: "Published",
    approvalStatus: "Approved",
    approvedBy: "Kiran Joshi",
    publishedUrl: "https://instagram.com/story/xyz",
    category: "Seasonal",
    cta: "Shop Now",
    targetAudience: "All Customers",
  },
];

const MOCK_PLATFORMS = [
  {
    id: "P1",
    name: "Instagram",
    accountName: "ePay_Official",
    accountId: "123456789",
    followers: 45200,
    following: 1200,
    posts: 480,
    reach: 125000,
    impressions: 280000,
    engagement: 18500,
    engagementRate: 4.1,
    leads: 230,
    growth: 5.6,
    lastSync: "2026-08-27 10:00 AM",
  },
  {
    id: "P2",
    name: "Facebook",
    accountName: "ePayBusiness",
    accountId: "987654321",
    followers: 38400,
    following: 800,
    posts: 320,
    reach: 98000,
    impressions: 210000,
    engagement: 14200,
    engagementRate: 3.7,
    leads: 185,
    growth: 3.2,
    lastSync: "2026-08-27 09:45 AM",
  },
  {
    id: "P3",
    name: "YouTube",
    accountName: "ePayTV",
    accountId: "456789123",
    followers: 12800,
    following: 150,
    posts: 120,
    reach: 42000,
    impressions: 89000,
    engagement: 6800,
    engagementRate: 5.3,
    leads: 75,
    growth: 8.1,
    lastSync: "2026-08-27 09:30 AM",
  },
  {
    id: "P4",
    name: "LinkedIn",
    accountName: "ePay_Company",
    accountId: "321654987",
    followers: 25600,
    following: 450,
    posts: 210,
    reach: 58000,
    impressions: 120000,
    engagement: 9200,
    engagementRate: 3.8,
    leads: 120,
    growth: 4.5,
    lastSync: "2026-08-27 09:15 AM",
  },
  {
    id: "P5",
    name: "X",
    accountName: "@ePay_Official",
    accountId: "654987321",
    followers: 18200,
    following: 300,
    posts: 450,
    reach: 35000,
    impressions: 78000,
    engagement: 5600,
    engagementRate: 3.1,
    leads: 65,
    growth: 2.0,
    lastSync: "2026-08-27 09:00 AM",
  },
  {
    id: "P6",
    name: "WhatsApp",
    accountName: "ePay WhatsApp Business",
    accountId: "111222333",
    followers: 0,
    following: 0,
    posts: 0,
    reach: 0,
    impressions: 0,
    engagement: 0,
    engagementRate: 0,
    leads: 340,
    growth: 0,
    lastSync: "2026-08-27 08:30 AM",
  },
  {
    id: "P7",
    name: "Google Business Profile",
    accountName: "ePay Galleries",
    accountId: "222333444",
    followers: 0,
    following: 0,
    posts: 60,
    reach: 12000,
    impressions: 25000,
    engagement: 1200,
    engagementRate: 4.8,
    leads: 45,
    growth: 0,
    lastSync: "2026-08-27 08:00 AM",
  },
];

const MOCK_LEADS = [
  {
    id: "L001",
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    email: "priya.sharma@email.com",
    platform: "Instagram",
    campaign: "Summer Sale 2026",
    source: "Instagram Ad",
    interestedService: "Gallery Visit",
    leadStatus: "Qualified",
    assignedTelecaller: "Sneha Patel",
    followUpDate: "2026-08-28",
    conversionStatus: "Pending",
  },
  {
    id: "L002",
    name: "Rahul Verma",
    phone: "+91 87654 32109",
    email: "rahul.v@email.com",
    platform: "Facebook",
    campaign: "Flash Sale",
    source: "Facebook Post",
    interestedService: "Franchise Inquiry",
    leadStatus: "Contacted",
    assignedTelecaller: "Amit Kumar",
    followUpDate: "2026-08-29",
    conversionStatus: "Pending",
  },
  {
    id: "L003",
    name: "Neha Reddy",
    phone: "+91 76543 21098",
    email: "neha.reddy@email.com",
    platform: "YouTube",
    campaign: "Testimonial Campaign",
    source: "YouTube Video",
    interestedService: "Membership",
    leadStatus: "Converted",
    assignedTelecaller: "Ravi Singh",
    followUpDate: "2026-08-20",
    conversionStatus: "Converted",
  },
  {
    id: "L004",
    name: "Vikram Patil",
    phone: "+91 65432 10987",
    email: "vikram.p@email.com",
    platform: "LinkedIn",
    campaign: "Tech Showcase",
    source: "LinkedIn Ad",
    interestedService: "CRM Demo",
    leadStatus: "New",
    assignedTelecaller: "Anita Desai",
    followUpDate: "2026-08-30",
    conversionStatus: "Pending",
  },
  {
    id: "L005",
    name: "Sneha Kulkarni",
    phone: "+91 54321 09876",
    email: "sneha.k@email.com",
    platform: "X",
    campaign: "Content Marketing",
    source: "X Post",
    interestedService: "Gallery Visit",
    leadStatus: "Follow-up",
    assignedTelecaller: "Sneha Patel",
    followUpDate: "2026-08-27",
    conversionStatus: "Pending",
  },
  {
    id: "L006",
    name: "Amit Jain",
    phone: "+91 43210 98765",
    email: "amit.j@email.com",
    platform: "WhatsApp",
    campaign: "Brand Awareness",
    source: "WhatsApp Broadcast",
    interestedService: "Franchise Inquiry",
    leadStatus: "Qualified",
    assignedTelecaller: "Rahul Sharma",
    followUpDate: "2026-08-28",
    conversionStatus: "Pending",
  },
];

const MOCK_INBOX = [
  {
    id: "IM001",
    platform: "Instagram",
    customer: "Aisha Khan",
    message: "Hi! I'm interested in your services. Can you tell me more?",
    conversationId: "IG-12345",
    receivedTime: "2026-08-27 09:30 AM",
    assignedExecutive: "Neha Joshi",
    status: "Replied",
    responseTime: "5 min",
    leadCreated: true,
  },
  {
    id: "IM002",
    platform: "Facebook",
    customer: "Rohit Shah",
    message: "When is your next gallery opening?",
    conversationId: "FB-67890",
    receivedTime: "2026-08-27 08:45 AM",
    assignedExecutive: "Priya Menon",
    status: "Resolved",
    responseTime: "12 min",
    resolution: "Shared event details",
    leadCreated: false,
  },
  {
    id: "IM003",
    platform: "YouTube",
    customer: "Sunita Reddy",
    message: "Great video! Can I get a quote for your services?",
    conversationId: "YT-11223",
    receivedTime: "2026-08-26 04:20 PM",
    assignedExecutive: "Ravi Kumar",
    status: "New",
    responseTime: "-",
    leadCreated: true,
  },
  {
    id: "IM004",
    platform: "LinkedIn",
    customer: "Vivek Singh",
    message: "I saw your post about AI integration. Very impressive!",
    conversationId: "LI-33445",
    receivedTime: "2026-08-26 02:15 PM",
    assignedExecutive: "Anita Desai",
    status: "Read",
    responseTime: "1 hour",
    leadCreated: false,
  },
  {
    id: "IM005",
    platform: "X",
    customer: "Meera Iyer",
    message: "Is there a discount for bulk orders?",
    conversationId: "X-55667",
    receivedTime: "2026-08-26 11:00 AM",
    assignedExecutive: "Suresh Reddy",
    status: "Replied",
    responseTime: "20 min",
    leadCreated: true,
  },
  {
    id: "IM006",
    platform: "WhatsApp",
    customer: "Anuj Patel",
    message: "Please send me the brochure.",
    conversationId: "WA-77889",
    receivedTime: "2026-08-25 05:30 PM",
    assignedExecutive: "Kiran Joshi",
    status: "Resolved",
    responseTime: "8 min",
    resolution: "Sent brochure",
    leadCreated: false,
  },
];

const MOCK_CAMPAIGNS = [
  {
    id: "CAM001",
    name: "Summer Sale 2026",
    platform: "Instagram",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    budget: 500000,
    spent: 380000,
    reach: 125000,
    impressions: 280000,
    engagement: 18500,
    leads: 230,
    conversions: 45,
    status: "Active",
  },
  {
    id: "CAM002",
    name: "Flash Sale",
    platform: "Facebook",
    startDate: "2026-08-24",
    endDate: "2026-08-25",
    budget: 200000,
    spent: 180000,
    reach: 98000,
    impressions: 210000,
    engagement: 14200,
    leads: 185,
    conversions: 32,
    status: "Completed",
  },
  {
    id: "CAM003",
    name: "Brand Awareness",
    platform: "YouTube",
    startDate: "2026-07-01",
    endDate: "2026-09-30",
    budget: 300000,
    spent: 220000,
    reach: 42000,
    impressions: 89000,
    engagement: 6800,
    leads: 75,
    conversions: 12,
    status: "Active",
  },
  {
    id: "CAM004",
    name: "Tech Showcase",
    platform: "LinkedIn",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    budget: 250000,
    spent: 210000,
    reach: 58000,
    impressions: 120000,
    engagement: 9200,
    leads: 120,
    conversions: 18,
    status: "Active",
  },
  {
    id: "CAM005",
    name: "Content Marketing",
    platform: "X",
    startDate: "2026-08-15",
    endDate: "2026-09-15",
    budget: 150000,
    spent: 90000,
    reach: 35000,
    impressions: 78000,
    engagement: 5600,
    leads: 65,
    conversions: 8,
    status: "Draft",
  },
];

const MOCK_PERFORMANCE = {
  postsPublished: 8,
  reach: 125000,
  impressions: 280000,
  engagement: 18500,
  followersGrowth: 1200,
  leadsGenerated: 230,
  conversions: 45,
  responseRate: 92.5,
  averageResponseTime: "6 min",
};

// ============================================================
// 2. UTILITY COMPONENTS
// ============================================================

const StatusBadge = ({ status }) => {
  const colors = {
    "Draft": "bg-slate-600/80 border-slate-500 text-slate-300",
    "Scheduled": "bg-blue-500/20 border-blue-500/50 text-blue-300",
    "Pending Approval": "bg-amber-500/20 border-amber-500/50 text-amber-300",
    "Published": "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
    "Rejected": "bg-rose-500/20 border-rose-500/50 text-rose-300",
    "Approved": "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
    "Pending": "bg-amber-500/20 border-amber-500/50 text-amber-300",
    "New": "bg-blue-500/20 border-blue-500/50 text-blue-300",
    "Contacted": "bg-indigo-500/20 border-indigo-500/50 text-indigo-300",
    "Follow-up": "bg-orange-500/20 border-orange-500/50 text-orange-300",
    "Qualified": "bg-violet-500/20 border-violet-500/50 text-violet-300",
    "Converted": "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
    "Lost": "bg-rose-500/20 border-rose-500/50 text-rose-300",
    "Read": "bg-slate-500/20 border-slate-500/50 text-slate-300",
    "Replied": "bg-cyan-500/20 border-cyan-500/50 text-cyan-300",
    "Resolved": "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
    "Active": "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
    "Completed": "bg-slate-500/20 border-slate-500/50 text-slate-300",
    "Paused": "bg-amber-500/20 border-amber-500/50 text-amber-300",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[status] || "bg-slate-500/20 border-slate-500/50 text-slate-300"}`}>
      {status}
    </span>
  );
};

const PlatformIcon = ({ platform }) => {
  const icons = {
    Instagram: <InstagramIcon size={16} className="text-pink-500" />,
    Facebook: <FacebookIcon size={16} className="text-blue-500" />,
    YouTube: <YoutubeIcon size={16} className="text-red-500" />,
    LinkedIn: <LinkedinIcon size={16} className="text-sky-500" />,
    X: <TwitterIcon size={16} className="text-slate-300" />,
    WhatsApp: <MessageCircleIcon2 size={16} className="text-emerald-500" />,
    "Google Business Profile": <GlobeIcon size={16} className="text-cyan-500" />,
  };
  return icons[platform] || <GlobeIcon size={16} className="text-slate-400" />;
};

const ProgressBar = ({ value, color = "bg-pink-600", label }) => {
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between items-center text-xs mb-1">
        {label && <span className="text-slate-400">{label}</span>}
        <span className="font-semibold text-slate-200">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
        <div className={`${color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
};

// ============================================================
// 3. MAIN DASHBOARD COMPONENT
// ============================================================

export default function SocialMediaDashboard() {
  // ---- STATE ----
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [showContentDetail, setShowContentDetail] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showInboxDetail, setShowInboxDetail] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentDate] = useState(new Date());

  // State for content list
  const [contentItems, setContentItems] = useState(MOCK_CONTENT);
  const [platforms, setPlatforms] = useState(MOCK_PLATFORMS);
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [inbox, setInbox] = useState(MOCK_INBOX);
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [performance] = useState(MOCK_PERFORMANCE);

  // ---- HANDLERS ----

  const handleCreateContent = (newContent) => {
    const content = {
      id: `C${String(contentItems.length + 1).padStart(3, "0")}`,
      title: newContent.title || "Untitled",
      type: newContent.type || "Post",
      platform: newContent.platform || "Instagram",
      campaign: newContent.campaign || "",
      caption: newContent.caption || "",
      creative: newContent.creative || "",
      hashtags: newContent.hashtags || [],
      scheduledDate: newContent.scheduledDate || new Date().toISOString().split("T")[0],
      scheduledTime: newContent.scheduledTime || "12:00 PM",
      status: newContent.status || "Draft",
      approvalStatus: "Pending",
      category: newContent.category || "",
      cta: newContent.cta || "",
      targetAudience: newContent.targetAudience || "",
    };
    setContentItems([...contentItems, content]);
    setShowCreateContent(false);
  };

  const handleUpdateContent = (id, updates) => {
    setContentItems(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    setShowContentDetail(false);
  };

  const handleDeleteContent = (id) => {
    setContentItems(prev => prev.filter(c => c.id !== id));
    setShowContentDetail(false);
  };

  const handleLeadUpdate = (id, updates) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    setShowLeadDetail(false);
  };

  const handleInboxUpdate = (id, updates) => {
    setInbox(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    setShowInboxDetail(false);
  };

  // ---- COMPUTED ----
  const today = new Date().toISOString().split("T")[0];
  const todayPosts = contentItems.filter(c => c.scheduledDate === today && c.status === "Published").length;
  const scheduledPosts = contentItems.filter(c => c.scheduledDate >= today && c.status === "Scheduled").length;
  const pendingApproval = contentItems.filter(c => c.approvalStatus === "Pending").length;
  const publishedTotal = contentItems.filter(c => c.status === "Published").length;
  const totalComments = 126;
  const totalMessages = inbox.length;
  const leadsGenerated = leads.length;
  const engagementRate = 8.4;
  const unreadCount = 3;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* ---- SIDEBAR ---- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-auto
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-pink-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
              <span className="text-white font-extrabold text-base">eP</span>
            </div>
            <div>
              <span className="font-bold text-slate-100 block text-sm tracking-wide">ePay CRM</span>
              <span className="block text-[10px] text-pink-500 font-bold uppercase tracking-widest leading-none">Social Hub</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Main</div>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-pink-600/20 to-pink-500/5 border border-pink-500/20 text-pink-400">
                  <LayoutDashboard size={18} />
                  <span className="font-semibold text-sm">Dashboard</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Content Workspace</div>
            <ul className="space-y-1">
              {[
                { name: "Content Calendar", icon: <CalendarDays size={18} /> },
                { name: "Content Management", icon: <FolderKanban size={18} /> },
                { name: "Campaigns", icon: <Megaphone size={18} /> }
              ].map((item) => (
                <li key={item.name}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors">
                    {item.icon}
                    <span className="text-sm font-medium">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Social Channels</div>
            <ul className="space-y-1">
              {[
                { name: "All Platforms", icon: <GlobeIcon size={18} className="text-slate-400" /> },
                { name: "Instagram", icon: <InstagramIcon size={18} className="text-pink-500" /> },
                { name: "Facebook", icon: <FacebookIcon size={18} className="text-blue-500" /> },
                { name: "YouTube", icon: <YoutubeIcon size={18} className="text-red-500" /> },
                { name: "LinkedIn", icon: <LinkedinIcon size={18} className="text-sky-500" /> },
                { name: "X", icon: <TwitterIcon size={18} className="text-slate-400" /> },
                { name: "WhatsApp", icon: <MessageCircleIcon2 size={18} className="text-emerald-500" /> },
                { name: "Google Business", icon: <GlobeIcon size={18} className="text-cyan-500" /> }
              ].map((item) => (
                <li key={item.name}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors">
                    {item.icon}
                    <span className="text-sm font-medium">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Engagement</div>
            <ul className="space-y-1">
              {[
                { name: "Leads Console", icon: <UsersIcon size={18} /> },
                { name: "Social Inbox", icon: <Inbox size={18} /> },
                { name: "Public Comments", icon: <MessageCircle size={18} /> },
                { name: "Direct Messages", icon: <Send size={18} /> }
              ].map((item) => (
                <li key={item.name}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors">
                    {item.icon}
                    <span className="text-sm font-medium">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">System Config</div>
            <ul className="space-y-1">
              {[
                { name: "Preferences", icon: <Settings2 size={18} /> },
                { name: "Integrations", icon: <Link size={18} /> },
                { name: "Team Settings", icon: <UsersIcon2 size={18} /> }
              ].map((item) => (
                <li key={item.name}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors">
                    {item.icon}
                    <span className="text-sm font-medium">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800 p-4 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-pink-500/10 border border-pink-500/20 rounded-full flex items-center justify-center">
              <User size={18} className="text-pink-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">Kiran Joshi</div>
              <div className="text-[10px] text-slate-400 truncate">Social Media Hub</div>
            </div>
            <button className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ---- MAIN CONTENT ---- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ---- HEADER ---- */}
        <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-bold text-slate-100 tracking-wide hidden sm:block">Command Hub</h1>
          </div>

          {/* Date & Time */}
          <div className="hidden md:flex items-center gap-2.5 text-xs text-slate-300 bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-2">
            <Calendar size={13} className="text-pink-500" />
            <span>{currentDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span className="text-slate-600">|</span>
            <Clock size={13} className="text-pink-500" />
            <span>{currentDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>

          {/* Search */}
          <div className="hidden lg:flex items-center bg-slate-800/50 border border-slate-700/30 rounded-xl px-3 py-1.5 w-80 max-w-sm">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns, tasks..."
              className="bg-transparent border-none outline-none text-xs px-2.5 w-full text-slate-200 placeholder-slate-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 text-slate-300 transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-600 border border-slate-900 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                    <span className="font-bold text-xs text-slate-200">Alerts</span>
                    <button onClick={() => setShowNotifications(false)} className="text-[10px] text-pink-500 font-bold hover:underline">Dismiss All</button>
                  </div>
                  <div className="divide-y divide-slate-800/60">
                    <div className="p-3 text-xs text-slate-300 hover:bg-slate-800/30">New customer comment on Instagram</div>
                    <div className="p-3 text-xs text-slate-300 hover:bg-slate-800/30">Campaign #C002 approved by Reviewer</div>
                    <div className="p-3 text-xs text-slate-300 hover:bg-slate-800/30">Lead Priya Sharma status updated to Qualified</div>
                  </div>
                </div>
              )}
            </div>

            {/* Social Inbox Shortcut */}
            <button className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 text-slate-300 transition-colors relative">
              <MessageSquare size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-600 border border-slate-900 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">6</span>
            </button>
          </div>
        </header>

        {/* ---- DASHBOARD CORE ---- */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                { label: "Posts Today", value: todayPosts, color: "text-slate-200" },
                { label: "Scheduled", value: scheduledPosts, color: "text-blue-400" },
                { label: "Pending Review", value: pendingApproval, color: "text-amber-400" },
                { label: "Published Total", value: publishedTotal, color: "text-emerald-400" },
                { label: "Total Comments", value: totalComments, color: "text-slate-300" },
                { label: "Inbox Messages", value: totalMessages, color: "text-purple-400" },
                { label: "New Leads", value: leadsGenerated, color: "text-indigo-400" },
                { label: "Avg Engagement", value: `${engagementRate}%`, color: "text-pink-400" },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4 hover:border-slate-700/50 transition-all">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{stat.label}</div>
                  <div className={`text-2xl font-bold tracking-tight mt-1.5 ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Main Content Calendar List */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-200 tracking-wide">Publishing Pipeline</h2>
                  <p className="text-xs text-slate-500">Upcoming calendar schedules and live campaigns status</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowCreateContent(true)} className="px-3.5 py-1.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-pink-500/20 transition-all flex items-center gap-1.5">
                    <Plus size={15} /> Create Content
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-800 pb-3">
                      <th className="pb-3 font-semibold uppercase tracking-wider">ID</th>
                      <th className="pb-3 font-semibold uppercase tracking-wider">Title</th>
                      <th className="pb-3 font-semibold uppercase tracking-wider">Channel</th>
                      <th className="pb-3 font-semibold uppercase tracking-wider">Type</th>
                      <th className="pb-3 font-semibold uppercase tracking-wider">Scheduled Date</th>
                      <th className="pb-3 font-semibold uppercase tracking-wider">Status</th>
                      <th className="pb-3 font-semibold uppercase tracking-wider">Approval</th>
                      <th className="pb-3 font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {contentItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3.5 font-mono text-slate-500">{item.id}</td>
                        <td className="py-3.5 font-semibold text-slate-200">{item.title}</td>
                        <td className="py-3.5">
                          <span className="flex items-center gap-1.5 bg-slate-800/40 border border-slate-700/30 px-2 py-0.5 rounded-lg w-max">
                            <PlatformIcon platform={item.platform} />
                            <span>{item.platform}</span>
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400 font-medium">{item.type}</td>
                        <td className="py-3.5 text-slate-400 font-medium">{item.scheduledDate} · {item.scheduledTime}</td>
                        <td className="py-3.5"><StatusBadge status={item.status} /></td>
                        <td className="py-3.5"><StatusBadge status={item.approvalStatus} /></td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => { setSelectedContent(item); setShowContentDetail(true); }}
                              className="p-1 bg-slate-800 hover:bg-slate-700 text-pink-400 rounded-lg transition-colors"
                            >
                              <Eye size={13} />
                            </button>
                            <button className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-colors">
                              <Edit size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Campaign Metrics & Social Accounts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Campaign Performance */}
              <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-6">
                <h2 className="text-base font-bold text-slate-200 tracking-wide mb-4">Ad Campaigns</h2>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm text-slate-200">{campaign.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{campaign.platform} · {campaign.startDate} to {campaign.endDate}</div>
                        </div>
                        <StatusBadge status={campaign.status} />
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs text-slate-400 py-1 border-y border-slate-800/60">
                        <div><div className="text-[9px] uppercase tracking-wider text-slate-500">Budget</div>₹{(campaign.budget/100000).toFixed(1)}L</div>
                        <div><div className="text-[9px] uppercase tracking-wider text-slate-500">Spent</div>₹{(campaign.spent/100000).toFixed(1)}L</div>
                        <div><div className="text-[9px] uppercase tracking-wider text-slate-500">Leads</div>{campaign.leads}</div>
                        <div><div className="text-[9px] uppercase tracking-wider text-slate-500">Conv</div>{campaign.conversions}</div>
                      </div>
                      <ProgressBar value={(campaign.spent / campaign.budget) * 100} color="bg-gradient-to-r from-pink-600 to-rose-500" label="Spent Ratio" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Accounts Reach Grid */}
              <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-6">
                <h2 className="text-base font-bold text-slate-200 tracking-wide mb-4">Connected Channel Registry</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <PlatformIcon platform={platform.name} />
                          <span className="text-xs font-semibold text-slate-200">{platform.name}</span>
                        </span>
                        <span className="text-[10px] text-slate-500">@{platform.accountName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-1.5 text-xs text-slate-400 mt-2">
                        <div>Followers: <span className="font-semibold text-slate-200">{platform.followers.toLocaleString()}</span></div>
                        <div>ER Rate: <span className="font-semibold text-slate-200">{platform.engagementRate}%</span></div>
                        <div>Reach: <span className="font-semibold text-slate-200">{(platform.reach/1000).toFixed(1)}K</span></div>
                        <div>Growth: <span className="font-semibold text-emerald-400">+{platform.growth}%</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Inbox & Social Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Social Leads */}
              <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-bold text-slate-200 tracking-wide">Recent Social Leads</h2>
                  <span className="text-xs text-pink-500 font-bold hover:underline cursor-pointer">View All</span>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {leads.map((lead) => (
                    <div key={lead.id} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700/40 transition-all cursor-pointer" onClick={() => { setSelectedLead(lead); setShowLeadDetail(true); }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm text-slate-200">{lead.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{lead.phone} · {lead.email}</div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <PlatformIcon platform={lead.platform} />
                            <span className="text-[10px] bg-slate-800/60 border border-slate-700/30 px-1.5 py-0.5 rounded text-slate-400 font-medium">{lead.campaign}</span>
                          </div>
                        </div>
                        <StatusBadge status={lead.leadStatus} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Inbox */}
              <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-bold text-slate-200 tracking-wide">Social Inbox Feed</h2>
                  <span className="text-xs text-pink-500 font-bold hover:underline cursor-pointer">View Feed</span>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {inbox.map((msg) => (
                    <div key={msg.id} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700/40 transition-all cursor-pointer" onClick={() => { setSelectedMessage(msg); setShowInboxDetail(true); }}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <PlatformIcon platform={msg.platform} />
                            <span className="text-xs font-semibold text-slate-200">{msg.customer}</span>
                            <StatusBadge status={msg.status} />
                          </div>
                          <div className="text-xs text-slate-400 truncate">{msg.message}</div>
                          <div className="text-[10px] text-slate-500">{msg.receivedTime} · Assigned: {msg.assignedExecutive}</div>
                        </div>
                        {msg.leadCreated && <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">Lead</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics Summary */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-6">
              <h2 className="text-base font-bold text-slate-200 tracking-wide mb-4">Telemetry Analytics Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                {[
                  { label: "Posts", val: performance.postsPublished },
                  { label: "Reach", val: performance.reach.toLocaleString() },
                  { label: "Impressions", val: performance.impressions.toLocaleString() },
                  { label: "Engagement", val: performance.engagement.toLocaleString() },
                  { label: "Growth", val: `+${performance.followersGrowth}` },
                  { label: "Leads", val: performance.leadsGenerated },
                  { label: "Conversions", val: performance.conversions },
                  { label: "Response", val: `${performance.responseRate}%` },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">{item.label}</div>
                    <div className="text-base font-bold text-slate-100 mt-1">{item.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-slate-600 py-4 border-t border-slate-900">
              ePay CRM — Enterprise Social Command Dashboard v2.0
            </div>
          </div>
        </main>
      </div>

      {/* ---- MODALS ---- */}

      {/* Create Content Modal */}
      {showCreateContent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
              <h3 className="text-base font-bold text-slate-200">Compose New Campaign Post</h3>
              <button onClick={() => setShowCreateContent(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Post Title</label>
                  <input
                    type="text"
                    id="newTitle"
                    placeholder="E.g., Festive season offers"
                    className="w-full rounded-xl bg-slate-850 border border-slate-800 px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Post Type</label>
                  <select id="newType" className="w-full rounded-xl bg-slate-850 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500">
                    <option value="Post">Post</option>
                    <option value="Reel">Reel</option>
                    <option value="Story">Story</option>
                    <option value="Video">Video</option>
                    <option value="Carousel">Carousel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Channel</label>
                  <select id="newPlatform" className="w-full rounded-xl bg-slate-850 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500">
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X">X</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Post Caption</label>
                  <textarea
                    id="newCaption"
                    placeholder="Write caption text, emojis, call to action..."
                    rows={3}
                    className="w-full rounded-xl bg-slate-850 border border-slate-800 px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    id="newDate"
                    className="w-full rounded-xl bg-slate-850 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    id="newTime"
                    className="w-full rounded-xl bg-slate-850 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    const title = document.getElementById("newTitle")?.value;
                    const type = document.getElementById("newType")?.value;
                    const platform = document.getElementById("newPlatform")?.value;
                    const caption = document.getElementById("newCaption")?.value;
                    const date = document.getElementById("newDate")?.value;
                    const time = document.getElementById("newTime")?.value;
                    handleCreateContent({ title, type, platform, caption, scheduledDate: date, scheduledTime: time });
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  Create Content
                </button>
                <button onClick={() => setShowCreateContent(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Detail Modal */}
      {showContentDetail && selectedContent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-200">{selectedContent.id} - {selectedContent.title}</h3>
              <button onClick={() => setShowContentDetail(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-slate-500 block mb-0.5">Platform</span><div className="font-semibold text-slate-200 flex items-center gap-1"><PlatformIcon platform={selectedContent.platform} /> {selectedContent.platform}</div></div>
                <div><span className="text-slate-500 block mb-0.5">Post Type</span><div className="font-semibold text-slate-200">{selectedContent.type}</div></div>
                <div className="col-span-2"><span className="text-slate-500 block mb-0.5">Caption</span><div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">{selectedContent.caption}</div></div>
                <div><span className="text-slate-500 block mb-0.5">Scheduled</span><div className="font-semibold text-slate-200">{selectedContent.scheduledDate} at {selectedContent.scheduledTime}</div></div>
                <div><span className="text-slate-500 block mb-0.5">Review Status</span><div><StatusBadge status={selectedContent.approvalStatus} /></div></div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <button onClick={() => handleUpdateContent(selectedContent.id, { status: "Published" })} className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">Publish</button>
                <button onClick={() => handleUpdateContent(selectedContent.id, { status: "Pending Approval" })} className="flex-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors">Review Request</button>
                <button onClick={() => handleDeleteContent(selectedContent.id)} className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {showLeadDetail && selectedLead && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-200">Social Lead Details</h3>
              <button onClick={() => setShowLeadDetail(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-2">
                <div><span className="text-slate-500 block mb-0.5">Lead Name</span><div className="font-semibold text-slate-200 text-sm">{selectedLead.name}</div></div>
                <div><span className="text-slate-500 block mb-0.5">Phone Number</span><div className="font-semibold text-slate-200">{selectedLead.phone}</div></div>
                <div><span className="text-slate-500 block mb-0.5">Email Address</span><div className="font-semibold text-slate-200">{selectedLead.email}</div></div>
                <div><span className="text-slate-500 block mb-0.5">Platform Acquisition</span><div className="font-semibold text-slate-200 flex items-center gap-1"><PlatformIcon platform={selectedLead.platform} /> {selectedLead.platform}</div></div>
                <div><span className="text-slate-500 block mb-0.5">Leads Status</span><div><StatusBadge status={selectedLead.leadStatus} /></div></div>
                <div><span className="text-slate-500 block mb-0.5">Assigned Agent</span><div className="font-semibold text-slate-200">{selectedLead.assignedTelecaller}</div></div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <button onClick={() => handleLeadUpdate(selectedLead.id, { leadStatus: "Converted", conversionStatus: "Converted" })} className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">Convert</button>
                <button onClick={() => handleLeadUpdate(selectedLead.id, { leadStatus: "Lost" })} className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors">Lost</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inbox Detail Modal */}
      {showInboxDetail && selectedMessage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-200">Reply to Message</h3>
              <button onClick={() => setShowInboxDetail(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-2.5">
                <div><span className="text-slate-500 block">Sender</span><div className="font-semibold text-slate-200 flex items-center gap-1"><PlatformIcon platform={selectedMessage.platform} /> {selectedMessage.customer}</div></div>
                <div><span className="text-slate-500 block">Message text</span><div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-slate-300 leading-relaxed mt-1">{selectedMessage.message}</div></div>
                <div><span className="text-slate-500 block">Received time</span><div className="font-semibold text-slate-200">{selectedMessage.receivedTime}</div></div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <button onClick={() => handleInboxUpdate(selectedMessage.id, { status: "Resolved" })} className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">Resolve</button>
                <button onClick={() => handleInboxUpdate(selectedMessage.id, { status: "Replied" })} className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">Mark Replied</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
