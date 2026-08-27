'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { useAuth } from '@/lib/auth-context';



// ============================================================================
// FULL CTO TECHNOLOGY COMMAND CENTRE — ePAY DIGITAL GALLERY
// Enterprise ERP + CRM + Gallery Systems + Cloud Infrastructure + DevOps
// ============================================================================
const STORAGE_KEY = 'epay_cto_crm_v4';

const defaultCtoDb = () => ({
  user: {
    name: 'Siddharth Varma',
    role: 'Chief Technology Officer (CTO)',
    company: 'ePay Digital Gallery India Pvt Ltd',
    avatar: 'SV',
    email: 'cto@epaygallery.com'
  },
  systemHealth: {
    overallHealth: 96,
    appHealth: 99.8,
    apiHealth: 99.9,
    serverHealth: 98.7,
    dbHealth: 99.5,
    backupHealth: 100,
    securityScore: 94,
    deploymentStatus: 'STABLE'
  },
  // 1. EXECUTIVE KPI MATRIX
  kpi: {
    productionIncidents: 1,
    criticalBugs: 2,
    failedDeployments: 1,
    apiFailures: 2,
    securityAlerts: 4,
    backupFailures: 0,
    sslDomainExpiry: 3,
    pendingReleases: 2,
    activeProjects: 8,
    projectsOnTrack: 6,
    projectsDelayed: 2,
    activeDevelopers: 18,
    activeTasks: 74,
    blockedTasks: 5,
    techSpend: 520000,
    techBudget: 575000,
    pendingApprovals: 4,
    slaMet: 96.2,
    avgResponseTime: '184ms'
  },
  // 2. TECHNOLOGY CONTROL CENTRE ANOMALIES
  controlCenterIssues: [
    { id: 'TECH-101', severity: 'critical', title: '3 Critical Production Bugs Open (Payment Callback, SMS Delay, Invoice PDF)', type: 'Bugs & Defects', count: 3, impact: 'High User Friction', status: 'In Fix' },
    { id: 'TECH-102', severity: 'critical', title: '2 Third-Party API Integrations Experiencing Degradation (SMS DLT & Travel GDS)', type: 'APIs & Gateways', count: 2, impact: '2.8% Error Rate', status: 'Escalated to Vendor' },
    { id: 'TECH-103', severity: 'important', title: '5 Developers Blocked on External Dependencies & API Keys', type: 'Dev Workload', count: 5, impact: 'Sprint Velocity -14%', status: 'Action Needed' },
    { id: 'TECH-104', severity: 'important', title: '7 Pull Requests Awaiting Architectural & Security Review (>24h)', type: 'Code Review', count: 7, impact: 'Release Staging Delayed', status: 'Review Due' },
    { id: 'TECH-105', severity: 'critical', title: '1 Production Incident (Payment Gateway Webhook Timeout)', type: 'Incidents', count: 1, impact: 'P0 Critical Incident', status: 'Investigating' },
    { id: 'TECH-106', severity: 'important', title: '1 Database Slow Query Performance Alert (PostgreSQL Leads Table)', type: 'Database Performance', count: 1, impact: 'Query Latency > 1.2s', status: 'Index Rebuilding' },
    { id: 'TECH-107', severity: 'important', title: '3 SSL Certificates Expiring within 30 Days (*.epaygallery.com)', type: 'Security & SSL', count: 3, impact: 'Auto-Renew Pending', status: 'Renewal Active' },
    { id: 'TECH-108', severity: 'important', title: '4 Enterprise Software Licenses Expiring in 15 Days (Figma, JetBrains)', type: 'License Mgmt', count: 4, impact: 'Finance Approval Due', status: 'Renewal Scheduled' }
  ],
  // 3. APPLICATION PORTFOLIO (14 Core Applications)
  applications: [
    { id: 'APP-01', name: 'ePay CRM', version: '2.4.1', env: 'Production', status: '🟢 Operational', frontend: 'Next.js / React', backend: 'Node.js Microservices', database: 'PostgreSQL 16', lastDeploy: '2026-08-25', uptime: '99.9%', openCritical: 2, openMajor: 7, owner: 'Rahul Sen (Lead)' },
    { id: 'APP-02', name: 'ePay ERP & Accounting', version: '4.0.0', env: 'Production', status: '🟢 Operational', frontend: 'React / Tailwind', backend: 'Go Core Engine', database: 'PostgreSQL / Timescale', lastDeploy: '2026-08-24', uptime: '99.95%', openCritical: 0, openMajor: 3, owner: 'Vikas Shah' },
    { id: 'APP-03', name: 'ePay HRMS Suite', version: '3.2.0', env: 'Production', status: '🟢 Operational', frontend: 'Next.js App Router', backend: 'Express.js API', database: 'PostgreSQL', lastDeploy: '2026-08-23', uptime: '99.8%', openCritical: 0, openMajor: 2, owner: 'Priya Sharma' },
    { id: 'APP-04', name: 'Finance Control Centre', version: '4.0.0', env: 'Production', status: '🟢 Operational', frontend: 'React Enterprise', backend: 'Spring Boot Services', database: 'PostgreSQL', lastDeploy: '2026-08-25', uptime: '99.99%', openCritical: 0, openMajor: 1, owner: 'Anil Deshmukh' },
    { id: 'APP-05', name: 'Gallery POS & Portal', version: '2.1.2', env: 'Production', status: '🟢 Operational', frontend: 'React Desktop / PWA', backend: 'GraphQL Service', database: 'Redis + PostgreSQL', lastDeploy: '2026-08-22', uptime: '99.7%', openCritical: 1, openMajor: 4, owner: 'Amit Shinde' },
    { id: 'APP-06', name: 'Customer Mobile App', version: '3.1.0', env: 'Production', status: '🟢 Stable', frontend: 'Flutter / Android Native', backend: 'FastAPI Gateway', database: 'PostgreSQL', lastDeploy: '2026-08-20', uptime: '99.9%', openCritical: 0, openMajor: 5, owner: 'Karan Mehra' },
    { id: 'APP-07', name: 'B2B Vendor Portal', version: '1.8.0', env: 'Production', status: '🟢 Operational', frontend: 'React SPA', backend: 'Node.js', database: 'MySQL 8', lastDeploy: '2026-08-15', uptime: '99.6%', openCritical: 0, openMajor: 2, owner: 'Sneha Kulkarni' },
    { id: 'APP-08', name: 'Digital Marketing Portal', version: '2.0.4', env: 'Production', status: '🟢 Operational', frontend: 'Next.js', backend: 'Python Analytics', database: 'ClickHouse', lastDeploy: '2026-08-24', uptime: '99.8%', openCritical: 0, openMajor: 3, owner: 'Sunil Kumar' },
    { id: 'APP-09', name: 'ePay Travel & Tour Portal', version: '3.0.1', env: 'Production', status: '🟡 Degraded', frontend: 'React / Next.js', backend: 'GDS Integration Hub', database: 'PostgreSQL', lastDeploy: '2026-08-25', uptime: '97.2%', openCritical: 1, openMajor: 8, owner: 'Rajesh Varma' },
    { id: 'APP-10', name: 'API Gateway & Auth Service', version: '5.2.0', env: 'Production', status: '🟢 Operational', frontend: 'Nginx / Kong', backend: 'Go Auth Daemon', database: 'Redis Cluster', lastDeploy: '2026-08-21', uptime: '99.99%', openCritical: 0, openMajor: 0, owner: 'DevOps Lead' }
  ],
  // 4. PROJECTS (8 Active Engineering Projects)
  projects: [
    { id: 'PRJ-01', name: 'ePay CRM 2.5 (Automated Lead AI)', bizOwner: 'Sales & Marketing', techLead: 'Rahul Sen', devs: 5, qa: 'Sneha P', startDate: '2026-07-01', targetDate: '2026-09-15', priority: 'High', budget: 1200000, spent: 850000, progress: 72, risk: 'Low', status: 'On Track' },
    { id: 'PRJ-02', name: 'Android Customer App 3.2 (Offline Biometric KYC)', bizOwner: 'Operations', techLead: 'Karan Mehra', devs: 4, qa: 'Aditya K', startDate: '2026-07-15', targetDate: '2026-08-30', priority: 'Critical', budget: 800000, spent: 620000, progress: 88, risk: 'Low', status: 'On Track' },
    { id: 'PRJ-03', name: 'Payment Gateway 2.0 (Direct Bank Multi-Settlement)', bizOwner: 'Finance', techLead: 'Ankit Sharma', devs: 3, qa: 'Sneha P', startDate: '2026-06-15', targetDate: '2026-08-28', priority: 'Critical', budget: 600000, spent: 510000, progress: 60, risk: 'High', status: 'At Risk' },
    { id: 'PRJ-04', name: 'AI Travel Recommendation & Visa Engine', bizOwner: 'Travel Ops', techLead: 'Sneha Kulkarni', devs: 3, qa: 'Aditya K', startDate: '2026-08-01', targetDate: '2026-09-30', priority: 'Medium', budget: 400000, spent: 180000, progress: 42, risk: 'Medium', status: 'On Track' },
    { id: 'PRJ-05', name: 'Gallery POS Offline Sync & Receipt Hardware V2', bizOwner: 'Retail Galleries', techLead: 'Amit Shinde', devs: 3, qa: 'Rohan J', startDate: '2026-07-20', targetDate: '2026-09-10', priority: 'High', budget: 550000, spent: 340000, progress: 54, risk: 'Low', status: 'On Track' }
  ],
  // 5. CURRENT SPRINT (Sprint 24)
  sprint: {
    name: 'Sprint 24 (Q3 Enterprise Hardening)',
    startDate: '2026-08-16',
    endDate: '2026-08-30',
    totalTasks: 85,
    completed: 62,
    inProgress: 15,
    blocked: 5,
    qaPending: 3,
    velocity: '48 Story Points',
    completionRate: 72.9,
    carryForward: 4,
    bugRate: '4.2%'
  },
  // 6. DEVELOPER TASKING
  developerTasks: [
    { id: 'TSK-881', dev: 'Rahul Sen', project: 'CRM 2.5', module: 'Lead Allocation', type: 'Feature', title: 'Implement dynamic round-robin lead allocation algorithm', priority: 'High', deadline: '2026-08-26', estHours: 16, actHours: 12, status: 'Code Review' },
    { id: 'TSK-882', dev: 'Ankit Sharma', project: 'Payment GW 2.0', module: 'Razorpay Webhook', type: 'Bug Fix', title: 'Handle webhook signature retry idempotency key', priority: 'Critical', deadline: '2026-08-25', estHours: 8, actHours: 6, status: 'In Progress' },
    { id: 'TSK-883', dev: 'Karan Mehra', project: 'Android App', module: 'Auth & Fingerprint', type: 'Feature', title: 'Biometric passkey authentication for staff login', priority: 'High', deadline: '2026-08-27', estHours: 20, actHours: 18, status: 'QA' },
    { id: 'TSK-884', dev: 'Sneha Kulkarni', project: 'AI Travel', module: 'GDS Connector', type: 'Integration', title: 'Integrate Amadeus Flight Search GDS REST API', priority: 'Medium', deadline: '2026-08-28', estHours: 24, actHours: 10, status: 'Blocked (API Key)' },
    { id: 'TSK-885', dev: 'Amit Shinde', project: 'Gallery POS', module: 'Printer Driver', type: 'Hardware', title: 'Bluetooth thermal receipt auto-cutting integration', priority: 'Medium', deadline: '2026-08-29', estHours: 12, actHours: 8, status: 'In Progress' }
  ],
  // 7. BUGS & DEFECTS (P0–P3)
  bugs: [
    { id: 'BUG-101', app: 'Payment Gateway', module: 'Webhook Processor', env: 'Production', severity: 'P0 — Critical', priority: 'P0', reporter: 'Anil Deshmukh (CFO)', dev: 'Ankit Sharma', qa: 'Sneha P', title: 'Payment callback webhook timeout leading to unconfirmed booking states', created: '2026-08-25 10:42', sla: 'Immediate (<2h)', status: 'Fix In Progress' },
    { id: 'BUG-102', app: 'ePay Travel', module: 'Flight GDS Search', env: 'Production', severity: 'P0 — Critical', priority: 'P0', reporter: 'Customer Support', dev: 'Sneha Kulkarni', qa: 'Aditya K', title: 'GDS pricing discrepancy of ₹1,200 on international flight bookings', created: '2026-08-25 11:15', sla: 'Immediate (<2h)', status: 'Investigation' },
    { id: 'BUG-103', app: 'ePay CRM', module: 'Lead Export', env: 'Production', severity: 'P1 — High', priority: 'P1', reporter: 'Sales Head', dev: 'Rahul Sen', qa: 'Sneha P', title: 'CSV export timeout when fetching leads exceeding 25,000 rows', created: '2026-08-24 16:30', sla: '4 Hours', status: 'Fix Ready for QA' },
    { id: 'BUG-104', app: 'Customer App', module: 'Push Notifications', env: 'Production', severity: 'P2 — Medium', priority: 'P2', reporter: 'Marketing', dev: 'Karan Mehra', qa: 'Aditya K', title: 'FCM push notification token refresh failing on Android 14', created: '2026-08-24 14:00', sla: '24 Hours', status: 'Scheduled' }
  ],
  // 8. PRODUCTION INCIDENTS
  incidents: [
    { id: 'INC-1024', service: 'Payment Gateway Settlement Webhook', severity: 'Critical P0', started: '2026-08-25 10:42 AM', detected: '2026-08-25 10:44 AM', owner: 'DevOps Lead & Ankit Sharma', status: 'Investigating (Mitigation Active)', rca: 'HDFC gateway connection pool saturation on worker node #3', impact: '18 Transactions Queued' },
    { id: 'INC-1023', service: 'SMS DLT Gateway Gateway Drop', severity: 'Major P1', started: '2026-08-24 02:15 PM', detected: '2026-08-24 02:18 PM', owner: 'Vikram Singh (DevOps)', status: 'Resolved & Verified', rca: 'Route 4 provider failover switched successfully to ValueFirst backup', impact: 'OTP Delivery Latency (3 mins)' }
  ],
  // 9. DEPLOYMENT & DEVOPS PIPELINE
  environments: [
    { env: 'Production (Live)', version: 'v2.4.1', status: '🟢 Stable', lastDeploy: '2026-08-25 04:30 AM', deployer: 'CI/CD Automated (GitHub Actions)', buildNo: '#1482', duration: '4m 12s', rollbackReady: true },
    { env: 'UAT / Staging', version: 'v2.5.0-rc2', status: '🟡 Testing', lastDeploy: '2026-08-25 01:15 PM', deployer: 'Sneha P (QA Lead)', buildNo: '#1490', duration: '3m 45s', rollbackReady: true },
    { env: 'Development (QA)', version: 'v2.5.0-dev', status: '🟢 Active', lastDeploy: '2026-08-25 02:30 PM', deployer: 'Rahul Sen', buildNo: '#1495', duration: '2m 50s', rollbackReady: true }
  ],
  // 10. SERVERS & CLOUD INFRASTRUCTURE
  servers: [
    { name: 'Prod-App-Cluster (K8s Master)', cpu: 42, ram: 68, disk: 74, net: 'Normal', uptime: '99.98%', status: '🟢 Healthy' },
    { name: 'Prod-DB-Primary (PostgreSQL 16 HA)', cpu: 58, ram: 79, disk: 81, net: 'Normal', uptime: '99.99%', status: '🟢 Healthy' },
    { name: 'Prod-Redis-Cluster (Cache & Sessions)', cpu: 18, ram: 44, disk: 32, net: 'Low', uptime: '100%', status: '🟢 Healthy' },
    { name: 'Prod-Worker-Node #03 (Async Jobs)', cpu: 88, ram: 84, disk: 65, net: 'High', uptime: '99.85%', status: '🟠 High Load Alert' }
  ],
  // 11. API HEALTH & USAGE
  apis: [
    { name: 'Razorpay / PayU Gateway API', provider: 'Razorpay India', health: 99.9, reqCount: '482k / mo', avgLatency: '142ms', cost: '₹48,200', status: '🟢 Healthy' },
    { name: 'Amadeus / Sabre Travel GDS API', provider: 'Amadeus Global', health: 97.2, reqCount: '128k / mo', avgLatency: '380ms', cost: '₹1,24,000', status: '🟡 Latency Alert' },
    { name: 'ValueFirst SMS & WhatsApp DLT', provider: 'ValueFirst / Gupshup', health: 99.7, reqCount: '620k / mo', avgLatency: '95ms', cost: '₹34,500', status: '🟢 Healthy' },
    { name: 'SendGrid Enterprise Email API', provider: 'Twilio SendGrid', health: 99.9, reqCount: '340k / mo', avgLatency: '110ms', cost: '₹18,500', status: '🟢 Healthy' },
    { name: 'Google Maps Places & Geocoding API', provider: 'Google Cloud Platform', health: 99.95, reqCount: '890k / mo', avgLatency: '65ms', cost: '₹62,000', status: '🟢 Healthy' }
  ],
  // 12. SECURITY MONITORING & AUDIT
  security: {
    score: 94,
    criticalVulnerabilities: 0,
    highVulnerabilities: 2,
    mediumVulnerabilities: 7,
    failedLoginsToday: 18,
    suspiciousSessions: 3,
    lastAudit: '2026-08-20 (OWASP Top 10 Certified)'
  },
  // 13. BACKUP STATUS & DISASTER RECOVERY
  backups: [
    { type: 'PostgreSQL Core Database', lastRun: '2026-08-25 04:00 AM', size: '14.2 GB', duration: '8m 20s', status: '🟢 Completed', encrypted: true, verified: true, lastRestoreTest: '2026-08-21' },
    { type: 'Media & File Storage (S3 / Wasabi)', lastRun: '2026-08-25 05:00 AM', size: '184.6 GB', duration: '22m 15s', status: '🟢 Completed', encrypted: true, verified: true, lastRestoreTest: '2026-08-21' },
    { type: 'System Configs & K8s Manifests', lastRun: '2026-08-25 06:00 AM', size: '420 MB', duration: '1m 10s', status: '🟢 Completed', encrypted: true, verified: true, lastRestoreTest: '2026-08-21' }
  ],
  // 14. TECHNOLOGY FINANCE & BUDGET
  finance: {
    cloudBudget: 200000,
    cloudActual: 184500,
    apiBudget: 150000,
    apiActual: 162000, // +8% Alert
    softwareBudget: 125000,
    softwareActual: 98000,
    securityBudget: 50000,
    securityActual: 42000,
    hostingBudget: 50000,
    hostingActual: 33500,
    totalBudget: 575000,
    totalActual: 520000
  },
  // 15. CTO NOTEPAD & IDEAS
  notes: [
    { id: 'NOT-1', title: 'Microservices vs Monolith Architecture Evaluation', date: '2026-08-24', tag: 'Architecture', content: 'Evaluating Go-based gRPC services for the travel booking search engine to cut latency from 380ms down to <100ms.', pinned: true },
    { id: 'NOT-2', title: 'Passkey & Biometric Authentication Rollout Plan', date: '2026-08-23', tag: 'Security', content: 'Roll out FIDO2 / WebAuthn for all Gallery managers to prevent password sharing across shared till terminals.', pinned: true },
    { id: 'NOT-3', title: 'AWS Cloud Cost Optimization Audit', date: '2026-08-22', tag: 'Finance', content: 'Turn down dev/staging idle nodes over weekends to save ₹28,000 monthly.', pinned: false }
  ],
  // 16. MEETINGS & CALENDAR
  meetings: [
    { id: 'MTG-01', time: '10:00 AM', title: 'Engineering Sprint 24 Daily Standup & Blockers', location: 'Google Meet / Conf Room A', attendees: 'Dev Leads & Scrum Master', status: 'Completed' },
    { id: 'MTG-02', time: '12:00 PM', title: 'Security & Penetration Testing Review (Q3)', location: 'HQ Tech Lab', attendees: 'CISO / Security Analyst & DevOps', status: 'Completed' },
    { id: 'MTG-03', time: '03:00 PM', title: 'Amadeus Travel GDS Integration & SLA Renegotiation', location: 'Virtual Video Call', attendees: 'Amadeus Technical Rep & Tech Lead', status: 'Scheduled (In 15m)' },
    { id: 'MTG-04', time: '05:00 PM', title: 'ePay CRM 2.5 Production Release Planning Gate', location: 'Board Room', attendees: 'CTO, QA Lead, DevOps, Product Head', status: 'Scheduled' }
  ],
  // 17. ARCHITECTURE DECISION RECORDS (ADR)
  adrs: [
    { id: 'ADR-001', title: 'Database Architecture for CRM + ERP Multi-Tenant Partitioning', context: 'Scalability for 100+ Gallery expansion across India', options: 'Single Shared DB, Database-per-Tenant, Schema Partitioning', selected: 'PostgreSQL Row-Level Security (RLS) + Schema Partitioning', impact: 'CRM, ERP, HRMS, Finance', status: 'Approved by CTO' },
    { id: 'ADR-002', title: 'Event-Driven Message Broker for Real-Time Financial Sync', context: 'Ensuring zero dropped webhook payments between Gateway and ERP', options: 'RabbitMQ, Apache Kafka, Redis Streams', selected: 'Redis Streams with ACK Consumer Groups', impact: 'Payment Gateway, Settlement, Notification', status: 'Approved by CTO' }
  ],
  // 18. TECHNOLOGY RISK REGISTER
  risks: [
    { id: 'RSK-01', system: 'Payment Gateway Integration', risk: 'Single vendor reliance on Razorpay without instant fallback switch', prob: 'Medium', impact: 'Critical', score: 'HIGH RISK', owner: 'Ankit Sharma', mitigation: 'Implement dynamic secondary gateway failover to PayU India', deadline: '2026-08-30', status: 'In Implementation' },
    { id: 'RSK-02', system: 'PostgreSQL Database', risk: 'Single Primary DB node spike during festive high-volume flash sales', prob: 'Low', impact: 'High', score: 'MEDIUM RISK', owner: 'Vikram Singh (DevOps)', mitigation: 'Deploy read-replicas with PgBouncer connection pooling', deadline: '2026-09-10', status: 'Planned' }
  ]
});

export default function CTOPage() {
  const { logActivity, approveUser, rejectUser, getAllUsers } = useAuth();
  const [db, setDb] = useState(defaultCtoDb());
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [activeToast, setActiveToast] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [actionNotice, setActionNotice] = useState('');

  const fetchUsers = useCallback(async () => {
    if (getAllUsers) {
      try {
        const list = await getAllUsers();
        setUsersList(list || []);
      } catch (err) {}
    }
  }, [getAllUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleApproveUser = async (targetUser) => {
    try {
      await approveUser(targetUser.uid);
      await logActivity('EMPLOYEE_APPROVED_BY_CTO', {
        employeeCode: targetUser.employeeId,
        name: targetUser.name,
        email: targetUser.email
      });
      setActionNotice(`✅ Approved ${targetUser.name}! Account is now active.`);
      showToast(`Approved ${targetUser.name}!`, 'success');
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to approve user.');
    }
  };

  const handleRejectUser = async (targetUser) => {
    const reason = prompt('Enter rejection reason:', 'Role profile mismatch or incorrect details.');
    if (reason === null) return;
    try {
      await rejectUser(targetUser.uid, reason);
      await logActivity('EMPLOYEE_REJECTED_BY_CTO', {
        employeeCode: targetUser.employeeId,
        name: targetUser.name,
        email: targetUser.email,
        reason
      });
      setActionNotice(`❌ Rejected onboarding request for ${targetUser.name}.`);
      showToast(`Rejected request for ${targetUser.name}`, 'error');
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to reject user.');
    }
  };

  // Live Firestore database subscriptions
  const { data: tasksData, add: addDeveloperTask } = useFirestore('tasks', defaultCtoDb().developerTasks);
  const { data: bugsData, add: addBug } = useFirestore('bugs', defaultCtoDb().bugs);
  const { data: notesData, add: addNote } = useFirestore('notes', defaultCtoDb().notes);

  // Sync Firestore live queries to state db
  useEffect(() => {
    if (tasksData) {
      setDb(prev => ({ ...prev, developerTasks: tasksData }));
    }
  }, [tasksData]);

  useEffect(() => {
    if (bugsData) {
      setDb(prev => ({ ...prev, bugs: bugsData }));
    }
  }, [bugsData]);

  useEffect(() => {
    if (notesData) {
      setDb(prev => ({ ...prev, notes: notesData }));
    }
  }, [notesData]);

  // Load persistence
  useEffect(() => {

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDb(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load CTO state', e);
    }
  }, []);

  const saveDb = (updated) => {
    setDb(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save CTO state', e);
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
      case 'bugCentre':
        return db.bugs.filter(b => b.severity.includes('Critical') || b.severity.includes('P0')).length;
      case 'incidents':
        return db.incidents.filter(i => i.status.includes('Investigating')).length;
      case 'devTasks':
        return db.developerTasks.filter(t => t.status === 'In Progress' || t.status === 'Code Review').length;
      case 'security':
        return db.security.suspiciousSessions;
      case 'apiCentre':
        return db.apis.filter(a => a.status.includes('Alert')).length;
      default:
        return 0;
    }
  };

  // 18 NAVIGATION GROUPS
  const navSections = [
    {
      group: 'COMMAND & ESSENTIALS',
      items: [
        { id: 'dashboard', label: '🏠 CTO Dashboard', icon: 'fa-gauge-high' },
        { id: 'controlCentre', label: '🎛️ Technology Control Centre', icon: 'fa-tower-broadcast' },
        { id: 'criticalAlerts', label: '🚨 Critical Alerts', icon: 'fa-triangle-exclamation' },
        { id: 'actionRequired', label: '⚡ Action Required', icon: 'fa-bolt' },
        { id: 'userApprovals', label: '👥 Onboarding Approvals', icon: 'fa-user-check' },
        { id: 'ctoTasks', label: '📋 CTO Tasks', icon: 'fa-list-check' },
        { id: 'ctoNotepad', label: '📝 CTO Notepad', icon: 'fa-note-sticky' },
        { id: 'meetingsCalendar', label: '📅 Meetings & Calendar', icon: 'fa-calendar-days' }
      ]
    },
    {
      group: 'PRODUCT & APPLICATIONS',
      items: [
        { id: 'appPortfolio', label: '💻 Application Portfolio (14)', icon: 'fa-cubes' }
      ]
    },
    {
      group: 'DEVELOPMENT & CODE',
      items: [
        { id: 'devDashboard', label: '🧑💻 Development Dashboard', icon: 'fa-code-branch' },
        { id: 'projects', label: '📁 Projects Management', icon: 'fa-folder-tree' },
        { id: 'sprints', label: '🏃 Sprint 24 Hardening', icon: 'fa-person-running' },
        { id: 'devTasks', label: '📌 Developer Tasking', icon: 'fa-tasks' },
        { id: 'codeReviews', label: '🔍 Code Reviews & PRs', icon: 'fa-code-pull-request' }
      ]
    },
    {
      group: 'BUG & INCIDENT MANAGEMENT',
      items: [
        { id: 'bugCentre', label: '🐞 Bug Command Centre', icon: 'fa-bug' },
        { id: 'incidents', label: '🚨 Production Incidents', icon: 'fa-fire-extinguisher' },
        { id: 'rcaCentre', label: '🔍 Root Cause Analysis (RCA)', icon: 'fa-magnifying-glass-chart' }
      ]
    },
    {
      group: 'DEPLOYMENT & DEVOPS',
      items: [
        { id: 'deploymentCentre', label: '🚀 Deployment & CI/CD', icon: 'fa-rocket' },
        { id: 'releaseMgmt', label: '📦 Release Gate & Rollback', icon: 'fa-box-archive' }
      ]
    },
    {
      group: 'INFRASTRUCTURE & CLOUD',
      items: [
        { id: 'infrastructure', label: '🖥️ Server & Cloud Monitoring', icon: 'fa-server' },
        { id: 'databases', label: '🗄️ Database & Storage', icon: 'fa-database' }
      ]
    },
    {
      group: 'API & INTEGRATIONS',
      items: [
        { id: 'apiCentre', label: '🔌 API Command Centre', icon: 'fa-network-wired' },
        { id: 'webhooks', label: '🪝 Webhooks & Integrations', icon: 'fa-plug' }
      ]
    },
    {
      group: 'SECURITY & GOVERNANCE',
      items: [
        { id: 'security', label: '🔐 Security Command Centre', icon: 'fa-shield-halved' },
        { id: 'accessControl', label: '🛡️ Access Control & Sessions', icon: 'fa-user-lock' }
      ]
    },
    {
      group: 'BACKUP & DISASTER RECOVERY',
      items: [
        { id: 'backups', label: '💾 Backup & Disaster Recovery', icon: 'fa-floppy-disk' }
      ]
    },
    {
      group: 'PERFORMANCE & ANALYTICS',
      items: [
        { id: 'perfAnalytics', label: '📊 Performance & APM', icon: 'fa-chart-simple' }
      ]
    },
    {
      group: 'TEAM & IT ASSETS',
      items: [
        { id: 'techTeam', label: '👥 Technology Team & Workload', icon: 'fa-users-gear' },
        { id: 'itAssets', label: '💻 IT Devices & Software Licenses', icon: 'fa-laptop-code' }
      ]
    },
    {
      group: 'QA & CHANGE MANAGEMENT',
      items: [
        { id: 'qaTesting', label: '🧪 QA & Release Quality Gate', icon: 'fa-vial-circle-check' },
        { id: 'changeManagement', label: '🧩 Change Requests & Roadmap', icon: 'fa-diagram-project' }
      ]
    },
    {
      group: 'FINANCE & ARCHITECTURE',
      items: [
        { id: 'techFinance', label: '💰 Technology Finance & Budget', icon: 'fa-wallet' },
        { id: 'adrs', label: '📚 Architecture Decision Records', icon: 'fa-book-atlas' },
        { id: 'risks', label: '⚠️ Technology Risk Register', icon: 'fa-shield-virus' },
        { id: 'emergencyCentre', label: '🚨 Emergency Command Centre', icon: 'fa-tower-cell' }
      ]
    }
  ];

  // Action handlers
  const handleCreateTask = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newTask = {
      id: 'TSK-' + Math.floor(1000 + Math.random() * 9000),
      dev: form.dev.value,
      project: form.project.value,
      module: form.module.value,
      type: form.type.value,
      title: form.title.value,
      priority: form.priority.value,
      deadline: form.deadline.value,
      estHours: Number(form.estHours.value) || 8,
      actHours: 0,
      status: 'Assigned'
    };

    // Save directly to live database
    await addDeveloperTask(newTask);
    await logActivity('CTO_ASSIGNED_DEVELOPER_TASK', { taskId: newTask.id, dev: newTask.dev, title: newTask.title });

    saveDb({
      ...db,
      developerTasks: [newTask, ...db.developerTasks],
      kpi: { ...db.kpi, activeTasks: db.kpi.activeTasks + 1 }
    });
    showToast(`Task assigned to ${newTask.dev}!`, 'success');
    setActiveModal(null);
  };

  const handleCreateBug = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newBug = {
      id: 'BUG-' + Math.floor(100 + Math.random() * 900),
      app: form.app.value,
      module: form.module.value,
      env: form.env.value,
      severity: form.severity.value,
      priority: form.priority.value,
      reporter: db.user.name,
      dev: form.dev.value,
      qa: 'Sneha P',
      title: form.title.value,
      created: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sla: form.severity.value.includes('P0') ? 'Immediate (<2h)' : '24 Hours',
      status: 'Open'
    };

    // Save directly to live database
    await addBug(newBug);
    await logActivity('CTO_LOGGED_BUG', { bugId: newBug.id, severity: newBug.severity, title: newBug.title });

    saveDb({
      ...db,
      bugs: [newBug, ...db.bugs],
      kpi: { ...db.kpi, criticalBugs: form.severity.value.includes('P0') ? db.kpi.criticalBugs + 1 : db.kpi.criticalBugs }
    });
    showToast(`Bug ${newBug.id} logged and prioritized!`, 'success');
    setActiveModal(null);
  };

  const handleAddNote = async () => {
    if (!newNoteTitle.trim()) return;
    const note = {
      title: newNoteTitle,
      content: newNoteContent,
      date: new Date().toISOString().slice(0, 10),
      tag: 'Technical Note',
      pinned: false
    };

    // Save directly to live database
    await addNote(note);
    await logActivity('CTO_ADDED_TECHNICAL_NOTE', { title: newNoteTitle });

    setNewNoteTitle('');
    setNewNoteContent('');
    showToast('Saved to CTO Notepad!', 'success');
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
        
        #sidebar { width: var(--sidebar-width); height: 100vh; background: #042f2e; color: #ccfbf1; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; z-index: 100; transition: transform 0.3s ease; overflow-y: auto; padding-bottom: 16px; border-right: 1px solid rgba(255, 255, 255, 0.08); }
        #sidebar .brand { padding: 18px 20px; font-size: 20px; font-weight: 700; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        #sidebar .brand i { color: #5eead4; font-size: 22px; }
        #sidebar .brand span { color: #fff; }
        #sidebar .brand small { font-size: 10px; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 12px; margin-left: auto; color: #99f6e4; }
        
        .nav-section { padding: 14px 18px 4px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700; color: #5eead4; opacity: 0.7; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 16px; margin: 2px 8px; border-radius: 8px; cursor: pointer; transition: all 0.2s; color: #99f6e4; font-size: 12.5px; font-weight: 500; }
        .nav-item:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
        .nav-item.active { background: rgba(20, 184, 166, 0.25); color: #fff; box-shadow: inset 0 0 0 1px rgba(20, 184, 166, 0.3); font-weight: 600; }
        .nav-item i { width: 16px; text-align: center; font-size: 13px; }
        .nav-item .badge { margin-left: auto; background: #dc2626; color: #fff; font-size: 10px; padding: 1px 7px; border-radius: 10px; font-weight: 700; }
        
        .sidebar-footer { margin-top: auto; padding: 12px 18px; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 10px; background: #02201f; }
        .sidebar-footer .avatar { width: 34px; height: 34px; border-radius: 50%; background: #0d9488; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
        
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
        .badge-status.active, .badge-status.stable, .badge-status.completed, .badge-status.resolved { background: #dcfce7; color: #065f46; }
        .badge-status.pending, .badge-status.in-progress, .badge-status.scheduled { background: #fef3c7; color: #92400e; }
        .badge-status.critical, .badge-status.error, .badge-status.degraded { background: #fee2e2; color: #991b1b; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(4, 47, 46, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-box { background: #fff; width: 100%; max-width: 720px; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); max-height: 90vh; overflow-y: auto; padding: 24px; border: 1px solid #d1fae5; }
        .modal-box .m-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d1fae5; padding-bottom: 12px; margin-bottom: 16px; }
        .modal-box .m-header h3 { font-size: 17px; font-weight: 700; color: #064e3b; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .form-group { margin-bottom: 12px; }
        .form-group label { display: block; font-size: 11.5px; font-weight: 600; color: #064e3b; margin-bottom: 4px; text-transform: uppercase; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 8px 12px; border: 1px solid #d1fae5; border-radius: 8px; font-size: 13px; outline: none; background: #fff; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #059669; box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.15); }
        
        .toast { position: fixed; bottom: 24px; right: 24px; background: #042f2e; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 9999; border-left: 4px solid #34d399; }
        .toast.error { border-left-color: #ef4444; }
        `
      }} />

      {/* SIDEBAR */}
      <aside id="sidebar" className={sidebarOpen ? 'open' : ''}>
        <div className="brand">
          <i className="fas fa-microchip"></i>
          <span>ePAY <span style={{ color: '#5eead4' }}>CTO TECH</span></span>
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
            <div style={{ fontSize: 10, color: '#99f6e4' }}>{db.user.role}</div>
          </div>
          <button className="btn btn-sm btn-outline" style={{ border: 'none', color: '#99f6e4' }} title="Emergency Command">
            <i className="fas fa-tower-cell"></i>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div id="main">
        {/* HEADER */}
        <header id="header">
          <div className="header-title">
            <i className="fas fa-server" style={{ color: '#059669' }}></i>
            <span>{currentPage.toUpperCase()} — CTO Technology Command Engine</span>
            <span style={{ fontSize: 11, background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: 6, marginLeft: 8 }}>
              Overall Health: {db.systemHealth.overallHealth}%
            </span>
          </div>

          <div className="header-actions">
            <div style={{ display: 'flex', alignItems: 'center', background: '#ecfdf5', borderRadius: 8, padding: '4px 12px', border: '1px solid #d1fae5' }}>
              <i className="fas fa-search" style={{ color: '#6b7280', fontSize: 12, marginRight: 6 }}></i>
              <input
                type="text"
                placeholder="Search microservices, bugs, APIs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12, width: 160 }}
              />
            </div>
            
            <button className="btn btn-outline btn-sm" onClick={() => setActiveModal('new_task')}>
              <i className="fas fa-plus"></i> Assign Task
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setActiveModal('new_bug')}>
              <i className="fas fa-bug"></i> Log Critical Bug
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => showToast('Dispatched automated health scan across 14 clusters', 'info')}>
              <i className="fas fa-rotate"></i> Scan Health
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
          {/* 1. CTO EXECUTIVE DASHBOARD */}
          {/* ========================================================== */}
          {currentPage === 'dashboard' && (
            <div>
              {/* SYSTEM HEALTH TOP BAR */}
              <div style={{ background: '#042f2e', color: '#fff', borderRadius: 12, padding: 18, marginBottom: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#5eead4', fontWeight: 700, textTransform: 'uppercase' }}>System Health Matrix</span>
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Overall Technology Health: <span style={{ color: '#34d399' }}>{db.systemHealth.overallHealth}%</span></h2>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span className="badge-status active" style={{ padding: '6px 12px' }}>🟢 DEPLOYMENT: {db.systemHealth.deploymentStatus}</span>
                    <span className="badge-status active" style={{ padding: '6px 12px' }}>🔒 SECURITY: GOOD</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#99f6e4' }}>APP HEALTH</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>{db.systemHealth.appHealth}%</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#99f6e4' }}>API HEALTH</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>{db.systemHealth.apiHealth}%</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#99f6e4' }}>SERVER HEALTH</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>{db.systemHealth.serverHealth}%</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#99f6e4' }}>DATABASE HEALTH</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>{db.systemHealth.dbHealth}%</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#99f6e4' }}>BACKUP HEALTH</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>{db.systemHealth.backupHealth}%</div>
                  </div>
                </div>
              </div>

              {/* CRITICAL EXECUTIVE KPI CARDS */}
              <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-label">🔴 Prod Incidents</div><div className="kpi-val" style={{ color: '#dc2626' }}>{db.kpi.productionIncidents} Incident</div><div className="kpi-sub red">Payment Webhook</div></div>
                <div className="kpi-card"><div className="kpi-label">🔴 Critical Bugs</div><div className="kpi-val" style={{ color: '#dc2626' }}>{db.kpi.criticalBugs} P0 Bugs</div><div className="kpi-sub red">Immediate Fix Due</div></div>
                <div className="kpi-card"><div className="kpi-label">🟠 Failed Deploys</div><div className="kpi-val" style={{ color: '#d97706' }}>{db.kpi.failedDeployments} Build</div><div className="kpi-sub orange">Staging Re-queued</div></div>
                <div className="kpi-card"><div className="kpi-label">🟠 API Failures</div><div className="kpi-val" style={{ color: '#d97706' }}>{db.kpi.apiFailures} Integrations</div><div className="kpi-sub orange">Amadeus & SMS</div></div>
                <div className="kpi-card"><div className="kpi-label">🟠 Security Alerts</div><div className="kpi-val" style={{ color: '#d97706' }}>{db.kpi.securityAlerts} Warnings</div><div className="kpi-sub orange">3 Suspicious Logins</div></div>
                <div className="kpi-card"><div className="kpi-label">🟡 SSL / Domain Expiry</div><div className="kpi-val" style={{ color: '#b45309' }}>{db.kpi.sslDomainExpiry} Domains</div><div className="kpi-sub orange">&lt; 30 Days Left</div></div>
                <div className="kpi-card"><div className="kpi-label">Active Projects</div><div className="kpi-val">{db.kpi.activeProjects} Projects</div><div className="kpi-sub green">6 On Track, 2 Risk</div></div>
                <div className="kpi-card"><div className="kpi-label">Engineering Team</div><div className="kpi-val">{db.kpi.activeDevelopers} Devs</div><div className="kpi-sub green">74 Tasks Active</div></div>
                <div className="kpi-card"><div className="kpi-label">Tech Spend / Budget</div><div className="kpi-val">₹5.20L</div><div className="kpi-sub green">Budget: ₹5.75L</div></div>
                <div className="kpi-card"><div className="kpi-label">SLA Compliance</div><div className="kpi-val">{db.kpi.slaMet}%</div><div className="kpi-sub green">Target: 95.0%</div></div>
              </div>

              {/* QUICK CONTROL OVERVIEW */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-fire-flame-curved" style={{ color: '#dc2626' }}></i> Active Production Incidents & Critical Bugs</h3>
                    <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('bugCentre')}>View All</button>
                  </div>
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Service / Module</th><th>Severity</th><th>Owner</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {db.bugs.slice(0, 3).map(b => (
                        <tr key={b.id}>
                          <td><code>{b.id}</code></td>
                          <td><strong>{b.title}</strong></td>
                          <td><span className={'badge-status ' + (b.severity.includes('P0') ? 'critical' : 'pending')}>{b.severity}</span></td>
                          <td>{b.dev}</td>
                          <td><span className="badge-status pending">{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-calendar-check" style={{ color: '#059669' }}></i> Today's CTO Schedule & Release Gates</h3>
                    <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('meetingsCalendar')}>Full Schedule</button>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Time</th><th>Meeting / Action Gate</th><th>Attendees</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {db.meetings.map(m => (
                        <tr key={m.id}>
                          <td><strong>{m.time}</strong></td>
                          <td><strong>{m.title}</strong></td>
                          <td>{m.attendees}</td>
                          <td><span className={'badge-status ' + (m.status === 'Completed' ? 'active' : 'pending')}>{m.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* USER ONBOARDING APPROVALS */}
          {/* ========================================================== */}
          {currentPage === 'userApprovals' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}>
                    <i className="fas fa-user-check"></i> Onboarding Approvals Queue
                  </h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>
                    Authorise pending employee user account registrations submitted by HR
                  </p>
                </div>
              </div>

              {actionNotice && (
                <div style={{ padding: 12, background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                  {actionNotice}
                </div>
              )}

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.filter(u => u.status === 'pending_approval').length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '30px 0', color: '#6b7280' }}>
                            No pending onboarding authorization requests in queue.
                          </td>
                        </tr>
                      ) : (
                        usersList.filter(u => u.status === 'pending_approval').map(u => (
                          <tr key={u.uid}>
                            <td><code>{u.employeeId || 'Pending'}</code></td>
                            <td><strong>{u.name}</strong></td>
                            <td>{u.email}</td>
                            <td><span className="badge-doc blue">{u.role?.toUpperCase()}</span></td>
                            <td>{u.department || '—'}</td>
                            <td>{u.designation || '—'}</td>
                            <td><span className="status-badge pending">Pending Approval</span></td>
                            <td>
                              <div className="flex gap-8">
                                <button className="btn btn-xs btn-success" onClick={() => handleApproveUser(u)}>
                                  ✓ Approve
                                </button>
                                <button className="btn btn-xs btn-danger" onClick={() => handleRejectUser(u)}>
                                  ✗ Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 2. TECHNOLOGY CONTROL CENTRE & 3. CRITICAL ALERTS */}
          {/* ========================================================== */}
          {(currentPage === 'controlCentre' || currentPage === 'criticalAlerts') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-tower-broadcast"></i> Technology Control Centre</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Real-Time Anomaly & Blocker Watchlist across 14 Microservices and 8 Projects</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Re-scanned all 14 application clusters', 'success')}>
                  <i className="fas fa-rotate"></i> Re-scan Control Centre
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Severity</th>
                      <th>Control Anomaly / Issue Description</th>
                      <th>Module Area</th>
                      <th>Items Count</th>
                      <th>Impact Description</th>
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
                        <td>{issue.type}</td>
                        <td><span className="badge-status pending">{issue.count} Records</span></td>
                        <td><strong style={{ color: '#064e3b' }}>{issue.impact}</strong></td>
                        <td><span className={'badge-status ' + (issue.severity === 'critical' ? 'critical' : 'pending')}>{issue.status}</span></td>
                        <td>
                          <button className="btn btn-xs btn-outline" onClick={() => showToast(`Opening command view for ${issue.title}`, 'info')}>
                            Resolve Issue
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
          {/* 4. ACTION REQUIRED & 5. CTO TASKS */}
          {/* ========================================================== */}
          {(currentPage === 'actionRequired' || currentPage === 'ctoTasks') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-bolt"></i> CTO Daily Action Centre & Priority Workspace</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Morning Health Check, Architecture Approvals & High-Risk Interventions</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_task')}>
                  <i className="fas fa-plus"></i> New Task Assignment
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-check-double"></i> Today's CTO Personal Priorities (6/8 Completed)</h3>
                </div>
                <table>
                  <thead>
                    <tr><th>#</th><th>Priority Task Item</th><th>Category</th><th>Deadline</th><th>Related Lead</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>1</td><td><strong>Review production health and payment webhook latency</strong></td><td>Production</td><td>09:00 AM</td><td>Vikram Singh</td><td><span className="badge-status active">Completed</span></td><td>—</td></tr>
                    <tr><td>2</td><td><strong>Approve CRM 2.5 UAT Release Quality Gate</strong></td><td>Release Gate</td><td>11:30 AM</td><td>Sneha P (QA)</td><td><span className="badge-status active">Completed</span></td><td>—</td></tr>
                    <tr><td>3</td><td><strong>Resolve Amadeus Travel GDS integration latency spike</strong></td><td>API SLA</td><td>03:00 PM</td><td>Sneha Kulkarni</td><td><span className="badge-status pending">In Progress</span></td><td><button className="btn btn-xs btn-primary" onClick={() => showToast('Attending GDS technical bridge call', 'info')}>Join Bridge</button></td></tr>
                    <tr><td>4</td><td><strong>Sign off on AWS Cloud Reserved Instances (3yr commitment)</strong></td><td>Cost Optimization</td><td>05:00 PM</td><td>DevOps Lead</td><td><span className="badge-status pending">Pending Approval</span></td><td><button className="btn btn-xs btn-primary" onClick={() => showToast('Approved AWS Reserved Instances', 'success')}>Approve</button></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 6. CTO NOTEPAD */}
          {/* ========================================================== */}
          {currentPage === 'ctoNotepad' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-note-sticky"></i> CTO Management Notepad & Technical Ideas</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Private Architecture Thoughts, Tech Discussions & Vendor Decisions</p>
                </div>
              </div>

              <div style={{ background: '#fff', padding: 18, borderRadius: 12, border: '1px solid #d1fae5', marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, color: '#064e3b', marginBottom: 10 }}>Write New Technical Note / Decision Memo</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                  <input
                    type="text"
                    placeholder="Note Title (e.g. Distributed Caching Strategy for Mobile App)"
                    value={newNoteTitle}
                    onChange={e => setNewNoteTitle(e.target.value)}
                    style={{ padding: 10, border: '1px solid #d1fae5', borderRadius: 8, fontSize: 13, outline: 'none' }}
                  />
                  <textarea
                    placeholder="Write detailed architecture considerations, options, team assignments..."
                    value={newNoteContent}
                    onChange={e => setNewNoteContent(e.target.value)}
                    rows={3}
                    style={{ padding: 10, border: '1px solid #d1fae5', borderRadius: 8, fontSize: 13, outline: 'none' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary btn-sm" onClick={handleAddNote}>
                      <i className="fas fa-save"></i> Save Note
                    </button>
                  </div>
                </div>
              </div>

              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-list"></i> Saved Technical Memos & Decisions</h3>
                </div>
                <table>
                  <thead>
                    <tr><th>Title</th><th>Tag</th><th>Date</th><th>Content Summary</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {db.notes.map(n => (
                      <tr key={n.id}>
                        <td><strong>{n.title}</strong></td>
                        <td><span className="badge-status active">{n.tag}</span></td>
                        <td>{n.date}</td>
                        <td style={{ maxWidth: 360, fontSize: 12 }}>{n.content}</td>
                        <td>
                          <button className="btn btn-xs btn-outline" onClick={() => showToast(`Opened full memo: ${n.title}`, 'info')}>
                            View Note
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
          {/* 7. MEETINGS & CALENDAR */}
          {currentPage === 'meetingsCalendar' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-calendar-days"></i> Meetings & Technical Review Calendar</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Sprint Reviews, Architecture Gates, Vendor Negotiations & 1-on-1s</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Opening Meeting Scheduler...', 'info')}>
                  <i className="fas fa-plus"></i> Schedule Meeting
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Time</th><th>Meeting Agenda</th><th>Location / Link</th><th>Key Attendees</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {db.meetings.map(m => (
                      <tr key={m.id}>
                        <td><strong>{m.time}</strong></td>
                        <td><strong>{m.title}</strong></td>
                        <td><code>{m.location}</code></td>
                        <td>{m.attendees}</td>
                        <td><span className={'badge-status ' + (m.status === 'Completed' ? 'active' : 'pending')}>{m.status}</span></td>
                        <td>
                          <button className="btn btn-xs btn-primary" onClick={() => showToast(`Entering meeting room for ${m.title}`, 'success')}>
                            Launch Room
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
          {/* PRODUCT & APPLICATIONS: APPLICATION PORTFOLIO */}
          {/* ========================================================== */}
          {currentPage === 'appPortfolio' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-cubes"></i> Application Portfolio (14 Core Applications)</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Application Profiles, Versions, Tech Stacks, Uptime & Defect Density</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Opening App Master Registration...', 'info')}>
                  <i className="fas fa-plus"></i> Register Application
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Application Name</th>
                      <th>Version</th>
                      <th>Status</th>
                      <th>Frontend</th>
                      <th>Backend</th>
                      <th>Database</th>
                      <th>Last Deployment</th>
                      <th>Uptime</th>
                      <th>Bugs (Crit / Maj)</th>
                      <th>Tech Lead</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.applications.map(app => (
                      <tr key={app.id}>
                        <td><strong>{app.name}</strong></td>
                        <td><code>{app.version}</code></td>
                        <td><span className={'badge-status ' + (app.status.includes('Operational') || app.status.includes('Stable') ? 'active' : 'degraded')}>{app.status}</span></td>
                        <td>{app.frontend}</td>
                        <td>{app.backend}</td>
                        <td>{app.database}</td>
                        <td>{app.lastDeploy}</td>
                        <td><strong style={{ color: app.uptime.startsWith('99') ? '#059669' : '#dc2626' }}>{app.uptime}</strong></td>
                        <td>
                          <span style={{ color: app.openCritical > 0 ? '#dc2626' : '#059669', fontWeight: 700 }}>
                            {app.openCritical} Crit / {app.openMajor} Maj
                          </span>
                        </td>
                        <td>{app.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* DEVELOPMENT: PROJECTS MANAGEMENT */}
          {/* ========================================================== */}
          {(currentPage === 'devDashboard' || currentPage === 'projects') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-folder-tree"></i> Engineering Project Management</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>8 Active Projects, Technical Leads, Delivery Progress & Budget Controls</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Opening Project Initialization Wizard...', 'info')}>
                  <i className="fas fa-plus"></i> Initialize Project
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Business Owner</th>
                      <th>Tech Lead</th>
                      <th>Progress %</th>
                      <th>Budget (Allocated vs Spent)</th>
                      <th>Target Date</th>
                      <th>Risk</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.projects.map(p => (
                      <tr key={p.id}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.bizOwner}</td>
                        <td>{p.techLead} ({p.devs} devs)</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${p.progress}%`, height: '100%', background: p.progress > 70 ? '#059669' : '#d97706' }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700 }}>{p.progress}%</span>
                          </div>
                        </td>
                        <td>₹{(p.spent / 100000).toFixed(1)}L / ₹{(p.budget / 100000).toFixed(1)}L</td>
                        <td>{p.targetDate}</td>
                        <td><span className={'badge-status ' + (p.risk === 'Low' ? 'active' : p.risk === 'Medium' ? 'pending' : 'critical')}>{p.risk} Risk</span></td>
                        <td><span className={'badge-status ' + (p.status === 'On Track' ? 'active' : 'critical')}>{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* DEVELOPMENT: SPRINTS (Sprint 24) */}
          {/* ========================================================== */}
          {currentPage === 'sprints' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-person-running"></i> {db.sprint.name}</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Active Sprint Period: {db.sprint.startDate} to {db.sprint.endDate}</p>
                </div>
                <span className="badge-status active" style={{ padding: '6px 14px' }}>Velocity: {db.sprint.velocity}</span>
              </div>

              <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-label">Total Sprint Tasks</div><div className="kpi-val">{db.sprint.totalTasks} Tasks</div><div className="kpi-sub green">85 Story Points</div></div>
                <div className="kpi-card"><div className="kpi-label">Completed</div><div className="kpi-val" style={{ color: '#059669' }}>{db.sprint.completed} Done</div><div className="kpi-sub green">{db.sprint.completionRate}% Done</div></div>
                <div className="kpi-card"><div className="kpi-label">In Progress</div><div className="kpi-val">{db.sprint.inProgress} Tasks</div><div className="kpi-sub orange">Active Coding</div></div>
                <div className="kpi-card"><div className="kpi-label">Blocked Tasks</div><div className="kpi-val" style={{ color: '#dc2626' }}>{db.sprint.blocked} Blocked</div><div className="kpi-sub red">Needs CTO Unblock</div></div>
              </div>

              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-list-check"></i> Developer Task Allocations & Statuses</h3>
                </div>
                <table>
                  <thead>
                    <tr><th>Task ID</th><th>Developer</th><th>Project & Module</th><th>Task Title</th><th>Priority</th><th>Deadline</th><th>Est / Actual Hrs</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {db.developerTasks.map(t => (
                      <tr key={t.id}>
                        <td><code>{t.id}</code></td>
                        <td><strong>{t.dev}</strong></td>
                        <td>{t.project} <small>({t.module})</small></td>
                        <td>{t.title}</td>
                        <td><span className={'badge-status ' + (t.priority === 'Critical' ? 'critical' : 'pending')}>{t.priority}</span></td>
                        <td>{t.deadline}</td>
                        <td>{t.estHours}h / {t.actHours}h</td>
                        <td><span className={'badge-status ' + (t.status === 'Code Review' ? 'active' : t.status.includes('Blocked') ? 'critical' : 'pending')}>{t.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* DEVELOPMENT: DEVELOPER TASKING */}
          {/* ========================================================== */}
          {currentPage === 'devTasks' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-tasks"></i> CTO Developer Tasking & Daily Tracking</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Morning Priorities, Evening Standup Submissions & Output Metrics</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('new_task')}>
                  <i className="fas fa-plus"></i> Direct CTO Task Assignment
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Task ID</th><th>Developer</th><th>Project</th><th>Title</th><th>Priority</th><th>Deadline</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {db.developerTasks.map(t => (
                      <tr key={t.id}>
                        <td><code>{t.id}</code></td>
                        <td><strong>{t.dev}</strong></td>
                        <td>{t.project}</td>
                        <td><strong>{t.title}</strong></td>
                        <td><span className={'badge-status ' + (t.priority === 'Critical' ? 'critical' : 'pending')}>{t.priority}</span></td>
                        <td>{t.deadline}</td>
                        <td><span className="badge-status pending">{t.status}</span></td>
                        <td>
                          <button className="btn btn-xs btn-outline" onClick={() => showToast(`Reassigned ${t.id} priority`, 'info')}>
                            Modify
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
          {/* CODE REVIEWS & PULL REQUESTS */}
          {/* ========================================================== */}
          {currentPage === 'codeReviews' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-code-pull-request"></i> Code Review & Pull Request Control</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>PRs: 12 Open, 7 Awaiting Review, 3 Approved, 2 Changes Requested</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Synced pull requests from GitHub enterprise', 'success')}>
                  <i className="fas fa-sync"></i> Refresh Git PRs
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>PR #</th><th>Repository</th><th>Branch</th><th>Developer</th><th>Title</th><th>Files Changed</th><th>Review Age</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>PR-342</code></td><td>epay-crm-microservices</td><td><code>feat/lead-scoring-ai</code></td><td>Rahul Sen</td><td><strong>Add AI vector similarity lead ranking engine</strong></td><td>18 files (+420/-110)</td><td>4 hours</td><td><span className="badge-status pending">Awaiting CTO Review</span></td><td><button className="btn btn-xs btn-primary" onClick={() => showToast('Approved PR-342 for Staging merge', 'success')}>Approve PR</button></td></tr>
                    <tr><td><code>PR-341</code></td><td>epay-payment-engine</td><td><code>fix/webhook-retry</code></td><td>Ankit Sharma</td><td><strong>Fix idempotent signature retry backoff algorithm</strong></td><td>4 files (+85/-12)</td><td>1 day</td><td><span className="badge-status critical">Overdue Review (&gt;24h)</span></td><td><button className="btn btn-xs btn-primary" onClick={() => showToast('Merged PR-341 into Master', 'success')}>Approve PR</button></td></tr>
                    <tr><td><code>PR-340</code></td><td>epay-customer-android</td><td><code>feat/biometric-passkey</code></td><td>Karan Mehra</td><td><strong>Implement Android 14 Credential Manager FIDO2</strong></td><td>24 files (+890/-210)</td><td>2 days</td><td><span className="badge-status active">QA Approved</span></td><td><button className="btn btn-xs btn-primary" onClick={() => showToast('Approved for Release build', 'success')}>Merge</button></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* BUG COMMAND CENTRE & PRODUCTION INCIDENTS */}
          {/* ========================================================== */}
          {(currentPage === 'bugCentre' || currentPage === 'incidents' || currentPage === 'rcaCentre') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-bug"></i> Bug & Incident Command Centre</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>P0/P1 SLA Tracking, Incident Response & Root Cause Analysis (RCA)</p>
                </div>
                <button className="btn btn-sm btn-danger" onClick={() => setActiveModal('new_bug')}>
                  <i className="fas fa-plus"></i> Report Incident / Bug
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-triangle-exclamation" style={{ color: '#dc2626' }}></i> Active Production Incidents</h3>
                </div>
                <table>
                  <thead>
                    <tr><th>Incident ID</th><th>Affected Service</th><th>Severity</th><th>Detected At</th><th>Incident Commander</th><th>Status</th><th>Impact</th></tr>
                  </thead>
                  <tbody>
                    {db.incidents.map(inc => (
                      <tr key={inc.id}>
                        <td><code>{inc.id}</code></td>
                        <td><strong>{inc.service}</strong></td>
                        <td><span className="badge-status critical">{inc.severity}</span></td>
                        <td>{inc.detected}</td>
                        <td>{inc.owner}</td>
                        <td><span className="badge-status critical">{inc.status}</span></td>
                        <td><strong>{inc.impact}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-wrap">
                <div className="table-header">
                  <h3><i className="fas fa-bugs"></i> Critical Defect Queue (P0 - Immediate SLA)</h3>
                </div>
                <table>
                  <thead>
                    <tr><th>Bug ID</th><th>Application & Module</th><th>Severity</th><th>Title</th><th>Assigned Dev</th><th>Created</th><th>SLA Target</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {db.bugs.map(b => (
                      <tr key={b.id}>
                        <td><code>{b.id}</code></td>
                        <td>{b.app} <small>({b.module})</small></td>
                        <td><span className={'badge-status ' + (b.severity.includes('P0') ? 'critical' : 'pending')}>{b.severity}</span></td>
                        <td><strong>{b.title}</strong></td>
                        <td>{b.dev}</td>
                        <td>{b.created}</td>
                        <td><strong>{b.sla}</strong></td>
                        <td><span className="badge-status pending">{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* DEPLOYMENT & CI/CD & RELEASE MANAGEMENT */}
          {/* ========================================================== */}
          {(currentPage === 'deploymentCentre' || currentPage === 'releaseMgmt') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-rocket"></i> Deployment & Release Gate Centre</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Dev, Staging, UAT & Production Environments with 1-Click Rollback</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Triggered automated production build verification', 'success')}>
                  <i className="fas fa-play"></i> Trigger Pipeline Build
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Environment</th><th>Current Version</th><th>Status</th><th>Last Deployed</th><th>Deployer</th><th>Build #</th><th>Duration</th><th>Rollback</th></tr>
                  </thead>
                  <tbody>
                    {db.environments.map((e, idx) => (
                      <tr key={idx}>
                        <td><strong>{e.env}</strong></td>
                        <td><code>{e.version}</code></td>
                        <td><span className={'badge-status ' + (e.status.includes('Stable') || e.status.includes('Active') ? 'active' : 'pending')}>{e.status}</span></td>
                        <td>{e.lastDeploy}</td>
                        <td>{e.deployer}</td>
                        <td><code>{e.buildNo}</code></td>
                        <td>{e.duration}</td>
                        <td>
                          <button className="btn btn-xs btn-danger" onClick={() => showToast(`Rollback triggered for ${e.env} to previous stable artifact`, 'error')}>
                            Rollback
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
          {/* INFRASTRUCTURE & CLOUD MONITORING */}
          {/* ========================================================== */}
          {(currentPage === 'infrastructure' || currentPage === 'databases') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-server"></i> Server, Cloud & Database Infrastructure</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Cluster Health, CPU, Memory, Disk Space & High-Availability Metrics</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Refreshed AWS CloudWatch telemetry', 'success')}>
                  <i className="fas fa-sync"></i> Refresh Telemetry
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Cluster Node Name</th><th>CPU Load</th><th>Memory (RAM)</th><th>Disk Usage</th><th>Network</th><th>Uptime</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {db.servers.map((s, idx) => (
                      <tr key={idx}>
                        <td><strong>{s.name}</strong></td>
                        <td>
                          <strong style={{ color: s.cpu > 80 ? '#dc2626' : '#059669' }}>{s.cpu}%</strong>
                        </td>
                        <td>
                          <strong style={{ color: s.ram > 80 ? '#dc2626' : '#059669' }}>{s.ram}%</strong>
                        </td>
                        <td>{s.disk}%</td>
                        <td>{s.net}</td>
                        <td>{s.uptime}</td>
                        <td><span className={'badge-status ' + (s.status.includes('Healthy') ? 'active' : 'pending')}>{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* API COMMAND CENTRE & WEBHOOKS */}
          {/* ========================================================== */}
          {(currentPage === 'apiCentre' || currentPage === 'webhooks') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-network-wired"></i> API Command Centre & Third-Party Integrations</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Travel GDS, Payment Gateways, SMS, WhatsApp, Email & Cost Monitoring</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Dispatched API Health Ping to all providers', 'success')}>
                  <i className="fas fa-heart-pulse"></i> Ping All APIs
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Integration Name</th><th>Provider</th><th>Health Uptime</th><th>Monthly Usage</th><th>Avg Latency</th><th>Monthly Cost</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {db.apis.map((a, idx) => (
                      <tr key={idx}>
                        <td><strong>{a.name}</strong></td>
                        <td>{a.provider}</td>
                        <td><strong style={{ color: a.health > 99 ? '#059669' : '#dc2626' }}>{a.health}%</strong></td>
                        <td>{a.reqCount}</td>
                        <td><code>{a.avgLatency}</code></td>
                        <td><strong>{a.cost}</strong></td>
                        <td><span className={'badge-status ' + (a.status.includes('Healthy') ? 'active' : 'critical')}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SECURITY COMMAND CENTRE & SESSIONS */}
          {/* ========================================================== */}
          {(currentPage === 'security' || currentPage === 'accessControl') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-shield-halved"></i> Security Command Centre & Threat Monitor</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Vulnerability Scans, Failed Logins, Suspicious Sessions & Access Controls</p>
                </div>
                <button className="btn btn-sm btn-danger" onClick={() => showToast('Terminated 3 suspicious sessions across non-recognized IP ranges', 'success')}>
                  <i className="fas fa-user-slash"></i> Revoke Suspicious Sessions
                </button>
              </div>

              <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-label">Security Score</div><div className="kpi-val" style={{ color: '#059669' }}>{db.security.score}%</div><div className="kpi-sub green">OWASP Top 10 Pass</div></div>
                <div className="kpi-card"><div className="kpi-label">Critical CVEs</div><div className="kpi-val">{db.security.criticalVulnerabilities}</div><div className="kpi-sub green">0 Critical Vulnerabilities</div></div>
                <div className="kpi-card"><div className="kpi-label">Failed Logins Today</div><div className="kpi-val" style={{ color: '#d97706' }}>{db.security.failedLoginsToday}</div><div className="kpi-sub orange">IP Rate-Limited</div></div>
                <div className="kpi-card"><div className="kpi-label">Suspicious Sessions</div><div className="kpi-val" style={{ color: '#dc2626' }}>{db.security.suspiciousSessions}</div><div className="kpi-sub red">Requires Revocation</div></div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* BACKUP & DISASTER RECOVERY */}
          {/* ========================================================== */}
          {currentPage === 'backups' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-floppy-disk"></i> Backup Command Centre & Disaster Recovery (DR)</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Automated Daily Backups, Encryption & Restore Verification</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Disaster Recovery Dry Run Restore Test successful!', 'success')}>
                  <i className="fas fa-clock-rotate-left"></i> Run DR Restore Test
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Backup Stream</th><th>Last Completed</th><th>Storage Size</th><th>Duration</th><th>Encryption</th><th>Verification</th><th>Last Restore Test</th></tr>
                  </thead>
                  <tbody>
                    {db.backups.map((b, idx) => (
                      <tr key={idx}>
                        <td><strong>{b.type}</strong></td>
                        <td>{b.lastRun}</td>
                        <td><code>{b.size}</code></td>
                        <td>{b.duration}</td>
                        <td><span className="badge-status active">AES-256</span></td>
                        <td><span className="badge-status active">Verified</span></td>
                        <td><strong>{b.lastRestoreTest}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* PERFORMANCE & APM */}
          {/* ========================================================== */}
          {currentPage === 'perfAnalytics' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}><i className="fas fa-chart-simple"></i> Application Performance Monitoring (APM)</h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Average Latency: {db.kpi.avgResponseTime} | Error Rate: 0.04%</p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Subsystem</th><th>Response Time</th><th>Throughput</th><th>Error Rate</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>ePay CRM Core API</strong></td><td>124ms</td><td>4,200 req/min</td><td>0.01%</td><td><span className="badge-status active">Optimal</span></td></tr>
                    <tr><td><strong>Payment Gateway Callback Service</strong></td><td>142ms</td><td>850 req/min</td><td>0.00%</td><td><span className="badge-status active">Optimal</span></td></tr>
                    <tr><td><strong>Amadeus Travel Search GDS</strong></td><td>380ms</td><td>1,200 req/min</td><td>2.40%</td><td><span className="badge-status critical">Latency Alert</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TEAM, QA, FINANCE, ARCHITECTURE & RISK REGISTERS */}
          {/* ========================================================== */}
          {(currentPage === 'techTeam' || currentPage === 'itAssets' || currentPage === 'qaTesting' || currentPage === 'changeManagement' || currentPage === 'techFinance' || currentPage === 'adrs' || currentPage === 'risks' || currentPage === 'emergencyCentre') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#064e3b', fontWeight: 700 }}>
                    <i className="fas fa-sliders"></i> {currentPage.toUpperCase()} — CTO Control Panel
                  </h2>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Technology Team Workload, Architecture Decision Records (ADRs) & Risk Register</p>
                </div>
              </div>

              {/* ADRs TABLE */}
              {currentPage === 'adrs' && (
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-book-atlas"></i> Architecture Decision Records (ADR)</h3>
                  </div>
                  <table>
                    <thead>
                      <tr><th>ADR ID</th><th>Decision Title</th><th>Context</th><th>Selected Architecture</th><th>Impacted Services</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {db.adrs.map(a => (
                        <tr key={a.id}>
                          <td><code>{a.id}</code></td>
                          <td><strong>{a.title}</strong></td>
                          <td style={{ fontSize: 12 }}>{a.context}</td>
                          <td><strong style={{ color: '#059669' }}>{a.selected}</strong></td>
                          <td>{a.impact}</td>
                          <td><span className="badge-status active">{a.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RISKS TABLE */}
              {currentPage === 'risks' && (
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-shield-virus"></i> Technology Risk Register</h3>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Risk ID</th><th>Subsystem</th><th>Identified Risk</th><th>Severity</th><th>Mitigation Plan</th><th>Owner</th><th>Deadline</th></tr>
                    </thead>
                    <tbody>
                      {db.risks.map(r => (
                        <tr key={r.id}>
                          <td><code>{r.id}</code></td>
                          <td><strong>{r.system}</strong></td>
                          <td style={{ fontSize: 12 }}>{r.risk}</td>
                          <td><span className={'badge-status ' + (r.score.includes('HIGH') ? 'critical' : 'pending')}>{r.score}</span></td>
                          <td>{r.mitigation}</td>
                          <td>{r.owner}</td>
                          <td>{r.deadline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TECH FINANCE VIEW */}
              {currentPage === 'techFinance' && (
                <div className="table-wrap">
                  <div className="table-header">
                    <h3><i className="fas fa-wallet"></i> Technology Budget vs Actual Spend (August 2026)</h3>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Cost Category</th><th>Allocated Budget</th><th>Actual Spend</th><th>Variance</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      <tr><td><strong>Cloud Infrastructure (AWS)</strong></td><td>₹2,00,000</td><td>₹1,84,500</td><td>-₹15,500</td><td><span className="badge-status active">Within Budget</span></td></tr>
                      <tr><td><strong>Third-Party APIs (GDS, Payment, SMS)</strong></td><td>₹1,50,000</td><td>₹1,62,000</td><td>+₹12,000</td><td><span className="badge-status critical">+8% Overrun</span></td></tr>
                      <tr><td><strong>Enterprise Software SaaS</strong></td><td>₹1,25,000</td><td>₹98,000</td><td>-₹27,000</td><td><span className="badge-status active">Favorable</span></td></tr>
                      <tr style={{ background: '#ecfdf5', fontWeight: 700 }}><td>TOTAL TECHNOLOGY SPEND:</td><td>₹5,75,000</td><td style={{ color: '#047857' }}>₹5,20,000</td><td>-₹55,000</td><td><span className="badge-status active">90.4% Spent</span></td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* EMERGENCY COMMAND CENTRE */}
              {currentPage === 'emergencyCentre' && (
                <div style={{ background: '#fee2e2', border: '2px solid #ef4444', borderRadius: 12, padding: 24 }}>
                  <h3 style={{ color: '#991b1b', fontSize: 18, marginBottom: 8 }}><i className="fas fa-tower-cell"></i> 🚨 TECHNOLOGY EMERGENCY COMMAND</h3>
                  <p style={{ fontSize: 13, color: '#7f1d1d', marginBottom: 16 }}>Broadcast critical system incident alerts to CEO, CFO, and all 4 Gallery Retail Operations.</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-danger" onClick={() => showToast('Dispatched P0 Emergency Broadcast to Executive Team', 'error')}>
                      <i className="fas fa-bullhorn"></i> Broadcast Emergency Red Alert
                    </button>
                    <button className="btn btn-outline" onClick={() => showToast('Activated Read-Only Safe Mode for Gallery Portals', 'info')}>
                      Activate Safe-Mode Read Only
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* MODAL: ASSIGN DEVELOPER TASK */}
      {/* ========================================================== */}
      {activeModal === 'new_task' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-plus" style={{ color: '#059669' }}></i> Assign Direct CTO Developer Task</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-row">
                <div className="form-group">
                  <label>Assign To Developer *</label>
                  <select name="dev">
                    <option value="Rahul Sen">Rahul Sen (CRM Lead)</option>
                    <option value="Ankit Sharma">Ankit Sharma (Payment Backend)</option>
                    <option value="Karan Mehra">Karan Mehra (Mobile Lead)</option>
                    <option value="Sneha Kulkarni">Sneha Kulkarni (Integration)</option>
                    <option value="Amit Shinde">Amit Shinde (POS Systems)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Project *</label>
                  <select name="project">
                    <option value="CRM 2.5">ePay CRM 2.5</option>
                    <option value="Payment GW 2.0">Payment Gateway 2.0</option>
                    <option value="Android App">Android Customer App</option>
                    <option value="AI Travel">AI Travel & Visa Engine</option>
                    <option value="Gallery POS">Gallery POS Offline V2</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Module</label>
                  <input type="text" name="module" defaultValue="Core Backend" required />
                </div>
                <div className="form-group">
                  <label>Task Type</label>
                  <select name="type">
                    <option value="Feature">Feature Development</option>
                    <option value="Bug Fix">Bug Fix / Hotfix</option>
                    <option value="Architecture">Architecture Refactor</option>
                    <option value="Security">Security Hardening</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority *</label>
                  <select name="priority">
                    <option value="Critical">Critical (P0)</option>
                    <option value="High">High (P1)</option>
                    <option value="Medium">Medium (P2)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Deadline *</label>
                  <input type="date" name="deadline" defaultValue="2026-08-28" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Estimated Hours</label>
                  <input type="number" name="estHours" defaultValue="8" />
                </div>
              </div>
              <div className="form-group">
                <label>Task Title / Instructions *</label>
                <textarea name="title" required placeholder="Specify exact implementation details and acceptance criteria..."></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Dispatch Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: REPORT CRITICAL BUG */}
      {/* ========================================================== */}
      {activeModal === 'new_bug' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="m-header">
              <h3><i className="fas fa-bug" style={{ color: '#dc2626' }}></i> Log Critical Incident / Production Defect</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleCreateBug}>
              <div className="form-row">
                <div className="form-group">
                  <label>Application *</label>
                  <select name="app">
                    <option value="Payment Gateway">ePay Payment Gateway</option>
                    <option value="ePay CRM">ePay CRM</option>
                    <option value="ePay ERP">ePay ERP & Accounting</option>
                    <option value="Customer App">Android Customer App</option>
                    <option value="ePay Travel">ePay Travel Portal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Module Area *</label>
                  <input type="text" name="module" defaultValue="API Webhooks" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Severity Level *</label>
                  <select name="severity">
                    <option value="P0 — Critical">P0 — Critical (Immediate SLA)</option>
                    <option value="P1 — High">P1 — High (4h SLA)</option>
                    <option value="P2 — Medium">P2 — Medium (24h SLA)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Environment</label>
                  <select name="env">
                    <option value="Production">Production</option>
                    <option value="UAT / Staging">UAT / Staging</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Assign Lead Developer *</label>
                  <select name="dev">
                    <option value="Ankit Sharma">Ankit Sharma (Payment)</option>
                    <option value="Rahul Sen">Rahul Sen (CRM)</option>
                    <option value="Karan Mehra">Karan Mehra (Mobile)</option>
                    <option value="Sneha Kulkarni">Sneha Kulkarni (APIs)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority">
                    <option value="P0">P0 (Blocker)</option>
                    <option value="P1">P1 (Urgent)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Bug Title & Steps to Reproduce *</label>
                <textarea name="title" required placeholder="Detailed description of defect, steps to reproduce, and impact..."></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-danger">Log & Trigger SLA Alert</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
