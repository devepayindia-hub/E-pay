'use client';

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const App = () => {
  // ---------- State ----------
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [activeReport, setActiveReport] = useState('daily-ops');

  // Modal states
  const [modals, setModals] = useState({
    addLead: false,
    addEmployee: false,
    addTask: false,
    ticket: false,
    reassignment: false,
    addBranch: false,
    addUser: false,
  });

  // Table data (static for demo)
  const [employees] = useState([
    { id: 'EMP001', name: 'Rahul Sharma', photo: 'https://i.pravatar.cc/30?img=1', designation: 'Telecaller', dept: 'Telecalling', team: 'Alpha', branch: 'Mumbai', status: 'Active', login: 'Online', tasks: '12/8', productivity: '92%' },
    { id: 'EMP002', name: 'Priya Mehta', photo: 'https://i.pravatar.cc/30?img=2', designation: 'Sr. Telecaller', dept: 'Telecalling', team: 'Beta', branch: 'Delhi', status: 'Active', login: 'Available', tasks: '15/10', productivity: '95%' },
    { id: 'EMP003', name: 'Ankit Verma', photo: 'https://i.pravatar.cc/30?img=3', designation: 'BDE', dept: 'Sales', team: 'Alpha', branch: 'Bangalore', status: 'Leave', login: 'Offline', tasks: '8/5', productivity: '78%' },
    { id: 'EMP004', name: 'Sunita Rao', photo: 'https://i.pravatar.cc/30?img=4', designation: 'Telecaller', dept: 'Telecalling', team: 'Alpha', branch: 'Mumbai', status: 'Active', login: 'On Call', tasks: '18/14', productivity: '89%' },
    { id: 'EMP005', name: 'Vikram Singh', photo: 'https://i.pravatar.cc/30?img=5', designation: 'Team Lead', dept: 'Telecalling', team: 'Beta', branch: 'Delhi', status: 'Inactive', login: 'Offline', tasks: '22/18', productivity: '96%' },
  ]);

  const [leads] = useState([
    { id: 'L1001', name: 'Amit Kumar', mobile: '9876543210', alt: '--', email: 'amit@x.com', whatsapp: '9876543210', source: 'Google Ads', campaign: 'Q3 Push', type: 'Hot', priority: 'High', score: '85', status: 'New', stage: 'Prospecting', assigned: 'Rahul S.', followup: '2026-08-08', age: '6d' },
    { id: 'L1002', name: 'Sneha Patel', mobile: '9876543211', alt: '9876543211', email: 'sneha@y.com', whatsapp: '9876543211', source: 'Meta Ads', campaign: 'Retarget', type: 'Warm', priority: 'Medium', score: '72', status: 'Contacted', stage: 'Engaged', assigned: 'Priya M.', followup: '2026-08-07', age: '10d' },
    { id: 'L1003', name: 'Rajesh Iyer', mobile: '9876543212', alt: '--', email: 'rajesh@z.com', whatsapp: '--', source: 'Organic', campaign: 'SEO', type: 'Cold', priority: 'Low', score: '45', status: 'Lost', stage: 'Lost', assigned: '--', followup: '--', age: '23d' },
    { id: 'L1004', name: 'Kiran Joshi', mobile: '9876543213', alt: '--', email: 'kiran@a.com', whatsapp: '9876543213', source: 'LinkedIn', campaign: 'B2B', type: 'Warm', priority: 'High', score: '88', status: 'Qualified', stage: 'Negotiation', assigned: 'Ankit V.', followup: '2026-08-09', age: '4d' },
  ]);

  // Allocation data
  const [allocationData, setAllocationData] = useState([
    { tc: 'TC-001', capacity: 100, assigned: 100, remaining: 0, status: 'Full' },
    { tc: 'TC-002', capacity: 100, assigned: 75, remaining: 25, status: 'Available' },
    { tc: 'TC-003', capacity: 100, assigned: 100, remaining: 0, status: 'Full' },
    { tc: 'TC-004', capacity: 100, assigned: 62, remaining: 38, status: 'Available' },
  ]);

  // ---------- Utility ----------
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, [activeTab]);

  const toggleModal = (name) => {
    setModals((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const runAllocation = () => {
    showToast('Allocation engine executed. Leads assigned based on capacity & rules.', 'success');
    setAllocationData([
      { tc: 'TC-001', capacity: 100, assigned: 100, remaining: 0, status: 'Full' },
      { tc: 'TC-002', capacity: 100, assigned: 100, remaining: 0, status: 'Full' },
      { tc: 'TC-003', capacity: 100, assigned: 100, remaining: 0, status: 'Full' },
      { tc: 'TC-004', capacity: 100, assigned: 100, remaining: 0, status: 'Full' },
    ]);
  };

  const globalSearch = (value) => {
    setSearchTerm(value);
    // In a real app, you would filter table rows; here we just store term
  };

  // ---------- Render helpers ----------
  const renderStatusBadge = (status) => {
    const map = {
      'Active': 'success',
      'Inactive': 'danger',
      'Leave': 'warning',
      'New': 'warning',
      'Contacted': 'info',
      'Lost': 'danger',
      'Qualified': 'success',
      'Available': 'secondary',
      'Online': 'info',
      'On Call': 'info',
      'Offline': 'danger',
      'Full': 'danger',
      'Normal': 'success',
      'Open': 'warning',
      'In Progress': 'info',
      'Completed': 'success',
      'Pending': 'warning',
      'Approved': 'success',
      'On Track': 'success',
      'Expiring Soon': 'warning',
      'Resolved': 'success',
    };
    const cls = map[status] || 'secondary';
    return <span className={`status-badge ${cls}`}>{status}</span>;
  };

  // ---------- Navigation items ----------
  const navItems = [
    { tab: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { section: 'Core Ops' },
    { tab: 'admin-profile', icon: 'fa-id-badge', label: 'Admin Profile' },
    { tab: 'org-ops', icon: 'fa-building', label: 'Org Operations' },
    { tab: 'employees', icon: 'fa-users', label: 'Employees' },
    { section: 'Lead Operations' },
    { tab: 'leads', icon: 'fa-bullseye', label: 'All Leads' },
    { tab: 'lead-add', icon: 'fa-plus', label: 'Add Lead', sub: true },
    { tab: 'lead-import', icon: 'fa-upload', label: 'Import', sub: true },
    { tab: 'allocation', icon: 'fa-random', label: 'Allocation', sub: true },
    { tab: 'capacity', icon: 'fa-tachometer-alt', label: 'Capacity', sub: true },
    { tab: 'reassign', icon: 'fa-exchange-alt', label: 'Reassignment', sub: true },
    { tab: 'history', icon: 'fa-history', label: 'History', sub: true },
    { tab: 'followups', icon: 'fa-calendar-check', label: 'Follow-ups', sub: true },
    { tab: 'ageing', icon: 'fa-hourglass-half', label: 'Ageing', sub: true },
    { section: 'Telecalling & BDE' },
    { tab: 'tele-daily', icon: 'fa-phone-alt', label: 'Telecalling' },
    { tab: 'bde', icon: 'fa-handshake', label: 'BDE Ops' },
    { section: 'Vendor & Procurement' },
    { tab: 'vendors', icon: 'fa-truck', label: 'Vendors' },
    { tab: 'vendor-contracts', icon: 'fa-file-signature', label: 'Contracts', sub: true },
    { tab: 'vendor-purchase', icon: 'fa-receipt', label: 'Purchases', sub: true },
    { section: 'Assets & Subscriptions' },
    { tab: 'assets', icon: 'fa-laptop', label: 'Assets' },
    { tab: 'subscriptions', icon: 'fa-cloud', label: 'Subscriptions' },
    { section: 'Support & Tasks' },
    { tab: 'tickets', icon: 'fa-ticket-alt', label: 'Tickets' },
    { tab: 'tasks', icon: 'fa-tasks', label: 'Tasks' },
    { tab: 'approvals', icon: 'fa-check-double', label: 'Approvals' },
    { section: 'Exceptions & Reports' },
    { tab: 'exceptions', icon: 'fa-exclamation-triangle', label: 'Exceptions' },
    { tab: 'reports', icon: 'fa-file-alt', label: 'Report Center' },
    { section: 'Branches & Settings' },
    { tab: 'branches', icon: 'fa-store', label: 'Branches' },
    { tab: 'settings', icon: 'fa-cog', label: 'Settings' },
    { tab: 'audit', icon: 'fa-clipboard-list', label: 'Audit Log' },
  ];

  // ---------- Render tab panes (all) ----------
  // Due to length, I'll define each pane as a function and call them conditionally.

  // Dashboard pane (already defined inline above, but we'll move it to a function)
  const renderDashboard = () => (
    <>
      <div className="page-header">
        <div><h1>Dashboard</h1><div className="sub">Real-time operational overview</div></div>
        <button className="btn btn-primary" onClick={() => showToast('Dashboard refreshed', 'success')}>
          <i className="fas fa-sync"></i> Refresh
        </button>
      </div>
      <div className="filter-bar">
        <div className="filter-group"><label>Date</label><input type="date" defaultValue="2026-08-07" /></div>
        <div className="filter-group"><label>Branch</label><select><option>All Branches</option><option>Mumbai</option><option>Delhi</option><option>Bangalore</option></select></div>
        <div className="filter-group"><label>Department</label><select><option>All</option><option>Telecalling</option><option>Sales</option></select></div>
        <button className="btn btn-primary" onClick={() => showToast('Filters applied', 'success')}>Apply</button>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card"><span className="label"><i className="fas fa-user"></i> Active Employees</span><span className="value">148</span><span className="trend up"><i className="fas fa-arrow-up"></i> +6</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-bullseye"></i> Leads Today</span><span className="value">2,450</span><span className="trend up"><i className="fas fa-arrow-up"></i> +12%</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-phone"></i> Leads Allocated</span><span className="value">2,310</span><span className="trend up"><i className="fas fa-arrow-up"></i> +8%</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-calendar"></i> Follow-ups Due</span><span className="value">684</span><span className="trend up"><i className="fas fa-arrow-up"></i> +5%</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-exclamation-triangle"></i> Overdue Follow-ups</span><span className="value">87</span><span className="trend down"><i className="fas fa-arrow-down"></i> -3%</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-tasks"></i> Open Tasks</span><span className="value">326</span><span className="trend up"><i className="fas fa-arrow-up"></i> +2%</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-bell"></i> Escalations</span><span className="value">14</span><span className="trend down"><i className="fas fa-arrow-down"></i> -2</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-code"></i> Active Projects</span><span className="value">31</span><span className="trend up"><i className="fas fa-arrow-up"></i> +4</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-ban"></i> Project Blockers</span><span className="value">8</span><span className="trend down"><i className="fas fa-arrow-down"></i> -1</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-truck"></i> Active Vendors</span><span className="value">47</span><span className="trend up"><i className="fas fa-arrow-up"></i> +3</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-file-contract"></i> Contracts Expiring</span><span className="value">6</span><span className="trend up"><i className="fas fa-arrow-up"></i> +2</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-file-invoice"></i> Pending Invoices</span><span className="value">18</span><span className="trend down"><i className="fas fa-arrow-down"></i> -4</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-check-double"></i> Pending Approvals</span><span className="value">23</span><span className="trend down"><i className="fas fa-arrow-down"></i> -3</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-cloud"></i> Subscriptions Renewing</span><span className="value">9</span><span className="trend up"><i className="fas fa-arrow-up"></i> +1</span></div>
        <div className="kpi-card"><span className="label"><i className="fas fa-star"></i> Overall Ops Score</span><span className="value">91%</span><span className="trend up"><i className="fas fa-arrow-up"></i> +2%</span></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="report-card"><h4 className="font-semibold text-sm mb-3"><i className="fas fa-chart-line text-green-500 mr-2"></i>Lead Allocation (last 7 days)</h4>
          <Line data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ label: 'Leads Allocated', data: [280, 310, 290, 350, 320, 180, 0], borderColor: '#059669', tension: 0.2, fill: false, pointBackgroundColor: '#059669' }]
          }} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="report-card"><h4 className="font-semibold text-sm mb-3"><i className="fas fa-chart-bar text-emerald-500 mr-2"></i>Department Workload</h4>
          <Bar data={{
            labels: ['Telecalling', 'Sales', 'Development', 'Support'],
            datasets: [{ label: 'Workload %', data: [85, 72, 60, 45], backgroundColor: ['#059669', '#10b981', '#f59e0b', '#ef4444'] }]
          }} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { max: 100 } } }} />
        </div>
      </div>
    </>
  );

  // Admin Profile pane
  const renderAdminProfile = () => (
    <>
      <div className="page-header"><h1>Admin Profile</h1><button className="btn btn-outline" onClick={() => showToast('Edit mode', 'success')}><i className="fas fa-edit"></i> Edit</button></div>
      <div className="report-card">
        <div className="field-grid">
          <div className="field-item"><span className="fname">Admin ID</span><span className="fvalue">ADM-1001</span></div>
          <div className="field-item"><span className="fname">Employee ID</span><span className="fvalue">EMP-0042</span></div>
          <div className="field-item"><span className="fname">Full Name</span><span className="fvalue">Yashraj Sathe</span></div>
          <div className="field-item"><span className="fname">Profile Photo</span><span className="fvalue"><img src="https://i.pravatar.cc/40?img=11" className="w-8 h-8 rounded-full border" alt="profile" /></span></div>
          <div className="field-item"><span className="fname">Official Email</span><span className="fvalue">yashraj@epay.in</span></div>
          <div className="field-item"><span className="fname">Official Mobile</span><span className="fvalue">+91 98765 43210</span></div>
          <div className="field-item"><span className="fname">Department</span><span className="fvalue">Operations</span></div>
          <div className="field-item"><span className="fname">Designation</span><span className="fvalue">Operations Manager</span></div>
          <div className="field-item"><span className="fname">Reporting Manager</span><span className="fvalue">Mr. Vikram Singh</span></div>
          <div className="field-item"><span className="fname">Branch</span><span className="fvalue">Mumbai Central</span></div>
          <div className="field-item"><span className="fname">Office Location</span><span className="fvalue">BKC, Mumbai</span></div>
          <div className="field-item"><span className="fname">Joining Date</span><span className="fvalue">2023-04-15</span></div>
          <div className="field-item"><span className="fname">Employment Type</span><span className="fvalue">Full-Time</span></div>
          <div className="field-item"><span className="fname">Shift</span><span className="fvalue">Day (9:00 AM – 6:00 PM)</span></div>
          <div className="field-item"><span className="fname">Work Mode</span><span className="fvalue">Hybrid</span></div>
          <div className="field-item"><span className="fname">Account Status</span><span className="fvalue">{renderStatusBadge('Active')}</span></div>
          <div className="field-item"><span className="fname">Last Login</span><span className="fvalue">2026-08-07 10:23 AM</span></div>
          <div className="field-item"><span className="fname">Current Login Status</span><span className="fvalue">{renderStatusBadge('Online')}</span></div>
          <div className="field-item"><span className="fname">Login Device</span><span className="fvalue">Chrome / Windows</span></div>
          <div className="field-item"><span className="fname">Last Activity</span><span className="fvalue">2 mins ago</span></div>
        </div>
      </div>
    </>
  );

  // Org Ops pane
  const renderOrgOps = () => (
    <>
      <div className="page-header"><h1>Organization Operations</h1></div>
      <div className="report-card">
        <div className="field-grid">
          <div className="field-item"><span className="fname">Organization</span><span className="fvalue">ePay Digital Pvt Ltd</span></div>
          <div className="field-item"><span className="fname">Business Unit</span><span className="fvalue">CRM &amp; Marketing</span></div>
          <div className="field-item"><span className="fname">Branch</span><span className="fvalue">Mumbai Central</span></div>
          <div className="field-item"><span className="fname">Branch Code</span><span className="fvalue">BR-MUM-001</span></div>
          <div className="field-item"><span className="fname">Department</span><span className="fvalue">Operations</span></div>
          <div className="field-item"><span className="fname">Team</span><span className="fvalue">Alpha</span></div>
          <div className="field-item"><span className="fname">Team Lead</span><span className="fvalue">Rahul Sharma</span></div>
          <div className="field-item"><span className="fname">Department Head</span><span className="fvalue">Mr. Desai</span></div>
          <div className="field-item"><span className="fname">Employee Count</span><span className="fvalue">148</span></div>
          <div className="field-item"><span className="fname">Active Employee Count</span><span className="fvalue">142</span></div>
          <div className="field-item"><span className="fname">Present Employee Count</span><span className="fvalue">134</span></div>
          <div className="field-item"><span className="fname">Absent Employee Count</span><span className="fvalue">8</span></div>
          <div className="field-item"><span className="fname">Employees on Leave</span><span className="fvalue">6</span></div>
          <div className="field-item"><span className="fname">Remote Employees</span><span className="fvalue">12</span></div>
          <div className="field-item"><span className="fname">Department Target</span><span className="fvalue">50,00,000</span></div>
          <div className="field-item"><span className="fname">Department Achievement</span><span className="fvalue">46,20,000 (92.4%)</span></div>
          <div className="field-item"><span className="fname">Department Productivity</span><span className="fvalue">87%</span></div>
          <div className="field-item"><span className="fname">Open Department Tasks</span><span className="fvalue">326</span></div>
          <div className="field-item"><span className="fname">Overdue Department Tasks</span><span className="fvalue">68</span></div>
          <div className="field-item"><span className="fname">Department Status</span><span className="fvalue">{renderStatusBadge('Active')}</span></div>
        </div>
      </div>
    </>
  );

  // Employees pane
  const renderEmployees = () => (
    <>
      <div className="page-header"><h1>Employees</h1><button className="btn btn-primary" onClick={() => toggleModal('addEmployee')}><i className="fas fa-user-plus"></i> Add</button></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table>
            <thead><tr><th>Emp ID</th><th>Name</th><th>Photo</th><th>Designation</th><th>Dept</th><th>Team</th><th>Branch</th><th>Status</th><th>Login</th><th>Tasks</th><th>Productivity</th><th>Action</th></tr></thead>
            <tbody>
              {employees.filter(emp => {
                const s = searchTerm.toLowerCase();
                return emp.name.toLowerCase().includes(s) || emp.id.toLowerCase().includes(s) || emp.dept.toLowerCase().includes(s);
              }).map(emp => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td><img src={emp.photo} className="w-8 h-8 rounded-full border" alt={emp.name} /></td>
                  <td>{emp.designation}</td>
                  <td>{emp.dept}</td>
                  <td>{emp.team}</td>
                  <td>{emp.branch}</td>
                  <td>{renderStatusBadge(emp.status)}</td>
                  <td>{renderStatusBadge(emp.login)}</td>
                  <td>{emp.tasks}</td>
                  <td>{emp.productivity}</td>
                  <td><i className="fas fa-edit text-green-500 cursor-pointer" onClick={() => showToast('Edit employee ' + emp.id, 'success')}></i></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination"><span>Showing 1–5 of 142</span><div className="pages"><button className="active-page">1</button><button>2</button><button>3</button><button>…</button></div></div>
      </div>
      <p className="text-xs text-gray-500">* Includes 60+ employee fields: ID, Name, Photo, Designation, Department, Team, Reporting Manager, Branch, Joining Date, Employment Status, Type, Shift, Work Location, Attendance, Leave, Login, Activity, Assigned/Completed/Pending/Overdue Tasks, Productivity, Target, Achievement, Rating, Projects, Approvals, Escalations, Remarks.</p>
    </>
  );

  // Leads pane
  const renderLeads = () => (
    <>
      <div className="page-header"><h1>All Leads</h1><div><button className="btn btn-primary" onClick={() => toggleModal('addLead')}><i className="fas fa-plus"></i> Add</button><button className="btn btn-outline ml-2" onClick={() => showToast('Export started', 'success')}><i className="fas fa-download"></i> Export</button></div></div>
      <div className="filter-bar">
        <div className="filter-group"><label>Source</label><select><option>All</option><option>Google Ads</option><option>Meta</option></select></div>
        <div className="filter-group"><label>Status</label><select><option>All</option><option>New</option><option>Contacted</option></select></div>
        <div className="filter-group"><label>Priority</label><select><option>All</option><option>High</option><option>Medium</option></select></div>
        <button className="btn btn-primary" onClick={() => showToast('Filters applied', 'success')}>Apply</button>
      </div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table>
            <thead><tr><th>Lead ID</th><th>Name</th><th>Mobile</th><th>Alt</th><th>Email</th><th>WhatsApp</th><th>Source</th><th>Campaign</th><th>Type</th><th>Priority</th><th>Score</th><th>Status</th><th>Stage</th><th>Assigned To</th><th>Follow-up</th><th>Age</th><th>Action</th></tr></thead>
            <tbody>
              {leads.filter(lead => {
                const s = searchTerm.toLowerCase();
                return lead.name.toLowerCase().includes(s) || lead.id.toLowerCase().includes(s) || lead.mobile.includes(s);
              }).map(lead => (
                <tr key={lead.id}>
                  <td>{lead.id}</td>
                  <td>{lead.name}</td>
                  <td>{lead.mobile}</td>
                  <td>{lead.alt}</td>
                  <td>{lead.email}</td>
                  <td>{lead.whatsapp}</td>
                  <td>{lead.source}</td>
                  <td>{lead.campaign}</td>
                  <td>{lead.type}</td>
                  <td>{lead.priority}</td>
                  <td>{lead.score}</td>
                  <td>{renderStatusBadge(lead.status)}</td>
                  <td>{lead.stage}</td>
                  <td>{lead.assigned}</td>
                  <td>{lead.followup}</td>
                  <td>{lead.age}</td>
                  <td><i className="fas fa-edit text-green-500 cursor-pointer" onClick={() => showToast('Edit lead ' + lead.id, 'success')}></i> <i className="fas fa-phone text-green-500 cursor-pointer" onClick={() => showToast('Calling ' + lead.mobile, 'success')}></i></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination"><span>1–4 of 1,240</span><div className="pages"><button className="active-page">1</button><button>2</button><button>3</button><button>…</button></div></div>
      </div>
      <div className="bg-green-50 border border-green-200 p-3 rounded text-xs"><i className="fas fa-info-circle mr-2"></i> 40+ fields: Lead ID, Name, Mobile, Alt, Email, WhatsApp, Source, Campaign, Type, Category, Priority, Score, Temperature, Status, Stage, Branch, Assigned Dept/Team/BDE/Telecaller, Assignment Date/Time, Received/First/Last Contact, Next Follow-up, Age, Attempts, Connected, Follow-up Count, Conversion, Lost Reason, Duplicate Status, Previous Owner, Reassignment Reason, Remarks, Created/Updated By.</div>
    </>
  );

  // Add Lead pane
  const renderLeadAdd = () => (
    <>
      <div className="page-header"><h1>Add Lead</h1></div>
      <div className="report-card">
        <form onSubmit={(e) => { e.preventDefault(); showToast('Lead added successfully!', 'success'); }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium">Lead Name *</label><input type="text" className="w-full border rounded p-2 text-sm" required /></div>
            <div><label className="block text-xs font-medium">Mobile *</label><input type="text" className="w-full border rounded p-2 text-sm" required /></div>
            <div><label className="block text-xs font-medium">Alternate Mobile</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-xs font-medium">WhatsApp</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-xs font-medium">Email</label><input type="email" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-xs font-medium">City</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-xs font-medium">State</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-xs font-medium">Product/Service</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-xs font-medium">Lead Source</label><select className="w-full border rounded p-2 text-sm"><option>Google Ads</option><option>Meta Ads</option><option>Organic</option></select></div>
            <div><label className="block text-xs font-medium">Campaign</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-xs font-medium">Priority</label><select className="w-full border rounded p-2 text-sm"><option>High</option><option>Medium</option><option>Low</option></select></div>
            <div><label className="block text-xs font-medium">Requirement</label><textarea className="w-full border rounded p-2 text-sm" rows="2"></textarea></div>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Save Lead</button>
            <button type="button" className="btn btn-outline" onClick={() => showToast('Queued for allocation', 'success')}>Queue for Allocation</button>
            <button type="button" className="btn btn-outline" onClick={() => showToast('Saved as unassigned', 'success')}>Save Unassigned</button>
          </div>
        </form>
        <p className="text-xs text-gray-500 mt-3">* After save: Duplicate Check ? Validation ? Lead Scoring ? Allocation Eligibility</p>
      </div>
    </>
  );

  // Lead Import pane
  const renderLeadImport = () => (
    <>
      <div className="page-header"><h1>Bulk Import</h1></div>
      <div className="report-card">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 border-2 border-dashed border-green-200 rounded-lg p-8 text-center">
            <i className="fas fa-cloud-upload-alt text-4xl text-green-400 mb-2"></i>
            <p className="text-sm text-gray-600">Upload Excel / CSV</p>
            <input type="file" className="mt-2 text-sm" />
            <button className="btn btn-primary mt-4" onClick={() => showToast('File uploaded & validated', 'success')}><i className="fas fa-upload"></i> Upload &amp; Validate</button>
          </div>
          <div className="flex-1 text-sm">
            <p className="font-semibold">Import Fields:</p>
            <ul className="list-disc list-inside text-gray-600"> <li>Lead Name, Mobile, Email, City, State, Product, Source, Campaign, Priority, Remarks</li></ul>
            <div className="mt-3 p-3 bg-green-50 rounded text-xs"><span className="font-medium">Validation Rules:</span> Duplicate Mobile, Invalid Mobile, Missing Name, Blacklisted Number</div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs"><span>Total: 1,245</span><span className="text-emerald-600">Imported: 1,023</span><span className="text-amber-600">Duplicates: 112</span><span className="text-red-500">Invalid: 110</span></div>
          </div>
        </div>
      </div>
    </>
  );

  // Allocation pane
  const renderAllocation = () => (
    <>
      <div className="page-header"><h1>Allocation Engine</h1><button className="btn btn-primary" onClick={runAllocation}><i className="fas fa-play"></i> Run Allocation</button></div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white p-3 rounded border text-sm"><span className="text-gray-500">Leads in Pool</span><div className="text-2xl font-bold">1,240</div></div>
        <div className="bg-white p-3 rounded border text-sm"><span className="text-gray-500">Eligible</span><div className="text-2xl font-bold">876</div></div>
        <div className="bg-white p-3 rounded border text-sm"><span className="text-gray-500">Allocated Today</span><div className="text-2xl font-bold">312</div></div>
      </div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Telecaller</th><th>Capacity</th><th>Assigned</th><th>Remaining</th><th>Status</th></tr></thead>
            <tbody>
              {allocationData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.tc}</td>
                  <td>{row.capacity}</td>
                  <td>{row.assigned}</td>
                  <td>{row.remaining}</td>
                  <td>{renderStatusBadge(row.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 p-3 rounded text-xs"><i className="fas fa-info-circle mr-2"></i> Allocation fields: Allocation ID, Batch ID, Date, Time, Method, Rule, Telecaller Capacity, Current Assigned, Remaining, Status, Priority, Branch/Team Capacity, Daily Limit, Duplicate Check, Availability, Skill/Language/Location Match, Failure Reason.</div>
    </>
  );

  // Capacity pane
  const renderCapacity = () => (
    <>
      <div className="page-header"><h1>Telecaller Workload</h1></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Telecaller</th><th>Shift</th><th>Login</th><th>Availability</th><th>Capacity</th><th>Assigned</th><th>Contacted</th><th>Pending</th><th>Follow-ups</th><th>Overdue</th><th>Calls</th><th>Connected</th><th>Remaining</th><th>Workload %</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>TC-001</td><td>Morning</td><td>Active</td><td>On Call</td><td>100</td><td>100</td><td>82</td><td>18</td><td>12</td><td>0</td><td>95</td><td>54</td><td>0</td><td>100%</td><td>{renderStatusBadge('Full')}</td></tr>
              <tr><td>TC-002</td><td>Morning</td><td>Active</td><td>Available</td><td>100</td><td>75</td><td>57</td><td>18</td><td>14</td><td>2</td><td>98</td><td>68</td><td>25</td><td>75%</td><td>{renderStatusBadge('Normal')}</td></tr>
              <tr><td>TC-003</td><td>Evening</td><td>Active</td><td>Break</td><td>100</td><td>100</td><td>70</td><td>30</td><td>20</td><td>5</td><td>112</td><td>78</td><td>0</td><td>100%</td><td>{renderStatusBadge('Full')}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-white p-2 rounded border text-center"><span className="text-emerald-600 font-bold">0–70%</span> Normal</div>
        <div className="bg-white p-2 rounded border text-center"><span className="text-amber-600 font-bold">71–90%</span> High</div>
        <div className="bg-white p-2 rounded border text-center"><span className="text-red-600 font-bold">91–100%</span> Full</div>
        <div className="bg-white p-2 rounded border text-center"><span className="text-red-800 font-bold">100%+</span> Exception</div>
      </div>
    </>
  );

  // Reassignment pane
  const renderReassign = () => (
    <>
      <div className="page-header"><h1>Reassignment</h1><button className="btn btn-primary" onClick={() => toggleModal('reassignment')}><i className="fas fa-exchange-alt"></i> Reassign</button></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Lead ID</th><th>Current</th><th>New</th><th>Reason</th><th>Date</th><th>Approval</th></tr></thead>
            <tbody><tr><td>L1005</td><td>TC-001</td><td>TC-004</td><td>Workload Balancing</td><td>2026-08-07</td><td>{renderStatusBadge('Approved')}</td></tr>
              <tr><td>L1008</td><td>TC-002</td><td>TC-003</td><td>Skill Mismatch</td><td>2026-08-06</td><td>{renderStatusBadge('Pending')}</td></tr>
            </tbody></table>
        </div>
      </div>
      <p className="text-xs text-gray-500">* Reassignment fields: Lead ID, Current Telecaller, New Telecaller, Reason, Date, Reassigned By, Approval Required, Remarks. Reasons: Leave, Absent, Branch Transfer, Workload, Wrong Assignment, Skill Mismatch, Customer Request, Escalation.</p>
    </>
  );

  // History pane
  const renderHistory = () => (
    <>
      <div className="page-header"><h1>Assignment History</h1></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Assignment ID</th><th>Lead</th><th>Previous</th><th>New</th><th>Reason</th><th>Date</th><th>Batch ID</th></tr></thead>
            <tbody><tr><td>AH001</td><td>L1005</td><td>TC-001</td><td>TC-004</td><td>Workload</td><td>2026-08-07</td><td>B2026-08-07-01</td></tr>
              <tr><td>AH002</td><td>L1008</td><td>TC-002</td><td>TC-003</td><td>Skill</td><td>2026-08-06</td><td>B2026-08-06-03</td></tr>
            </tbody></table>
        </div>
      </div>
    </>
  );

  // Follow-ups pane
  const renderFollowups = () => (
    <>
      <div className="page-header"><h1>Follow-up Management</h1></div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        <div className="bg-white p-3 rounded border text-center"><div className="text-xs text-gray-500">Today</div><div className="text-xl font-bold">456</div></div>
        <div className="bg-white p-3 rounded border text-center"><div className="text-xs text-gray-500">Completed</div><div className="text-xl font-bold text-emerald-600">382</div></div>
        <div className="bg-white p-3 rounded border text-center"><div className="text-xs text-gray-500">Pending</div><div className="text-xl font-bold text-amber-600">74</div></div>
        <div className="bg-white p-3 rounded border text-center"><div className="text-xs text-gray-500">Overdue</div><div className="text-xl font-bold text-red-500">68</div></div>
        <div className="bg-white p-3 rounded border text-center"><div className="text-xs text-gray-500">Rescheduled</div><div className="text-xl font-bold text-green-600">12</div></div>
      </div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Follow-up ID</th><th>Lead</th><th>Telecaller</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th><th>Outcome</th><th>Action</th></tr></thead>
            <tbody><tr><td>FU001</td><td>L1002</td><td>Priya M.</td><td>2026-08-07</td><td>11:30 AM</td><td>Call</td><td>{renderStatusBadge('Completed')}</td><td>Interested</td><td><i className="fas fa-eye text-gray-500"></i></td></tr>
              <tr><td>FU002</td><td>L1004</td><td>Ankit V.</td><td>2026-08-07</td><td>2:00 PM</td><td>WhatsApp</td><td>{renderStatusBadge('Pending')}</td><td>--</td><td><i className="fas fa-eye text-gray-500"></i></td></tr>
            </tbody></table>
        </div>
      </div>
      <p className="text-xs text-gray-500">* Follow-up fields: ID, Lead ID, Customer ID, Assigned Employee, Type, Date, Time, Priority, Status, Previous/Next Follow-up, Attempt, Outcome, Remarks, Reschedule Reason, Completion Date/Time, Overdue Days, Escalation Status/Reason.</p>
    </>
  );

  // Ageing pane
  const renderAgeing = () => (
    <>
      <div className="page-header"><h1>Lead Ageing</h1></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Lead ID</th><th>Name</th><th>Source</th><th>Created</th><th>Assigned</th><th>Telecaller</th><th>Last Contact</th><th>Next Follow-up</th><th>Age</th><th>Status</th></tr></thead>
            <tbody><tr><td>L1001</td><td>Amit</td><td>Google</td><td>2026-08-01</td><td>2026-08-01</td><td>Rahul</td><td>2026-08-05</td><td>2026-08-08</td><td>6d</td><td>{renderStatusBadge('Active')}</td></tr>
              <tr><td>L1002</td><td>Sneha</td><td>Meta</td><td>2026-07-28</td><td>2026-07-28</td><td>Priya</td><td>2026-08-06</td><td>2026-08-07</td><td>10d</td><td>{renderStatusBadge('Contacted')}</td></tr>
              <tr><td>L1003</td><td>Rajesh</td><td>Organic</td><td>2026-07-15</td><td>--</td><td>--</td><td>--</td><td>--</td><td>23d</td><td>{renderStatusBadge('Unassigned')}</td></tr>
            </tbody></table>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-gray-100 px-3 py-1 rounded">0–1D: 45</span>
        <span className="bg-gray-100 px-3 py-1 rounded">2–3D: 78</span>
        <span className="bg-gray-100 px-3 py-1 rounded">4–7D: 112</span>
        <span className="bg-gray-100 px-3 py-1 rounded">8–15D: 89</span>
        <span className="bg-gray-100 px-3 py-1 rounded">16–30D: 43</span>
        <span className="bg-gray-100 px-3 py-1 rounded">30+D: 12</span>
      </div>
    </>
  );

  // Telecalling pane
  const renderTeleDaily = () => (
    <>
      <div className="page-header"><h1>Telecalling Performance</h1></div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        <div className="bg-white p-3 rounded border text-center"><div className="text-xs text-gray-500">Assigned</div><div className="text-xl font-bold">312</div></div>
        <div className="bg-white p-3 rounded border text-center"><div className="text-xs text-gray-500">Worked</div><div className="text-xl font-bold">234</div></div>
        <div className="bg-white p-3 rounded border text-center"><div className="text-xs text-gray-500">Calls</div><div className="text-xl font-bold">1,283</div></div>
        <div className="bg-white p-3 rounded border text-center"><div className="text-xs text-gray-500">Connected</div><div className="text-xl font-bold">821</div></div>
        <div className="bg-white p-3 rounded border text-center"><div className="text-xs text-gray-500">Conversion</div><div className="text-xl font-bold">14.2%</div></div>
      </div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Telecaller</th><th>Assigned</th><th>Worked</th><th>Calls</th><th>Connected</th><th>Contact Rate</th><th>Follow-ups</th><th>Overdue</th><th>Qualified</th><th>Converted</th><th>Conversion %</th><th>Productivity</th></tr></thead>
            <tbody><tr><td>TC-001</td><td>100</td><td>82</td><td>95</td><td>54</td><td>56.8%</td><td>12</td><td>0</td><td>38</td><td>31</td><td>38%</td><td>92</td></tr>
              <tr><td>TC-002</td><td>75</td><td>57</td><td>98</td><td>68</td><td>69.4%</td><td>14</td><td>2</td><td>32</td><td>27</td><td>43%</td><td>95</td></tr>
              <tr><td>TC-003</td><td>100</td><td>70</td><td>112</td><td>78</td><td>69.6%</td><td>20</td><td>5</td><td>35</td><td>30</td><td>35%</td><td>88</td></tr>
            </tbody></table>
        </div>
      </div>
      <p className="text-xs text-gray-500">* Fields: Telecaller ID, Name, Shift, Daily Capacity, Leads Assigned/Remaining/Worked/Pending, Calls Made/Connected/Missed/Busy/Wrong, Call Back Requests, Avg Call Duration, Contact Rate, Follow-ups Created/Completed/Overdue, Qualified/Converted, Conversion Rate, Productivity, Target, Achievement.</p>
    </>
  );

  // BDE pane
  const renderBDE = () => (
    <>
      <div className="page-header"><h1>BDE Operations</h1></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>BDE ID</th><th>Name</th><th>Assigned</th><th>Active</th><th>Meetings Sched</th><th>Completed</th><th>Proposals</th><th>Sent</th><th>Negotiations</th><th>Won</th><th>Lost</th><th>Pipeline Value</th><th>Won Value</th><th>Conversion %</th><th>Target</th><th>Achievement</th><th>Productivity</th></tr></thead>
            <tbody><tr><td>BDE001</td><td>Ankit Verma</td><td>85</td><td>62</td><td>18</td><td>14</td><td>12</td><td>10</td><td>8</td><td>6</td><td>4</td><td>28L</td><td>18L</td><td>64%</td><td>25L</td><td>72%</td><td>88</td></tr>
              <tr><td>BDE002</td><td>Priya Reddy</td><td>92</td><td>70</td><td>22</td><td>19</td><td>16</td><td>14</td><td>11</td><td>9</td><td>5</td><td>35L</td><td>27L</td><td>77%</td><td>30L</td><td>90%</td><td>96</td></tr>
            </tbody></table>
        </div>
      </div>
      <p className="text-xs text-gray-500">* BDE fields: ID, Name, Assigned/Active Leads, Meetings Scheduled/Completed, Proposals Created/Sent, Negotiations, Won/Lost Deals, Pipeline Value, Won Value, Conversion Rate, Target, Achievement, Productivity, Last Activity, Pending Follow-ups, Remarks.</p>
    </>
  );

  // Vendors pane
  const renderVendors = () => (
    <>
      <div className="page-header"><h1>Vendors</h1><button className="btn btn-primary" onClick={() => toggleModal('addUser')}><i className="fas fa-plus"></i> Add</button></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Vendor ID</th><th>Name</th><th>Category</th><th>Type</th><th>Contact</th><th>Mobile</th><th>Email</th><th>GST</th><th>PAN</th><th>Service</th><th>Status</th><th>Rating</th><th>SLA</th><th>Action</th></tr></thead>
            <tbody><tr><td>VEN001</td><td>TechServe</td><td>IT Services</td><td>Corporate</td><td>Mr. Kumar</td><td>9876543210</td><td>info@techserve.com</td><td>GSTIN123</td><td>PAN123</td><td>Cloud Hosting</td><td>{renderStatusBadge('Active')}</td><td>4.5</td><td>99.5%</td><td><i className="fas fa-edit text-green-500 cursor-pointer" onClick={() => showToast('Edit vendor', 'success')}></i></td></tr>
              <tr><td>VEN002</td><td>DataSoft</td><td>Software</td><td>MSME</td><td>Ms. Shah</td><td>9876543211</td><td>sales@datasoft.com</td><td>GSTIN456</td><td>PAN456</td><td>CRM License</td><td>{renderStatusBadge('Active')}</td><td>4.2</td><td>98%</td><td><i className="fas fa-edit text-green-500 cursor-pointer" onClick={() => showToast('Edit vendor', 'success')}></i></td></tr>
            </tbody></table>
        </div>
      </div>
      <p className="text-xs text-gray-500">* Vendor fields: ID, Name, Category, Type, Contact Person, Mobile, Email, Address, GST, PAN, Bank Details, Service Category, Services, Internal Owner, Manager, Contract Start/End/Renewal, Payment Terms, Credit Period, Status, Rating, SLA, Response Time, Delivery Performance, Quality/Cost Score, Compliance, Documents, Remarks.</p>
    </>
  );

  // Contracts pane
  const renderVendorContracts = () => (
    <>
      <div className="page-header"><h1>Vendor Contracts</h1></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Contract ID</th><th>Vendor</th><th>Type</th><th>Value</th><th>Start</th><th>End</th><th>Renewal</th><th>Notice</th><th>Payment</th><th>SLA</th><th>Penalty</th><th>Renewal Status</th><th>Owner</th></tr></thead>
            <tbody><tr><td>CT001</td><td>TechServe</td><td>Service</td><td>12L</td><td>2025-01-01</td><td>2026-12-31</td><td>2026-11-01</td><td>30 days</td><td>Monthly</td><td>99.5%</td><td>5%</td><td>{renderStatusBadge('On Track')}</td><td>Mr. Desai</td></tr>
              <tr><td>CT002</td><td>DataSoft</td><td>License</td><td>8L</td><td>2025-06-01</td><td>2026-05-31</td><td>2026-04-01</td><td>60 days</td><td>Quarterly</td><td>98%</td><td>--</td><td>{renderStatusBadge('Expiring Soon')}</td><td>Ms. Gupta</td></tr>
            </tbody></table>
        </div>
      </div>
    </>
  );

  // Purchase pane
  const renderVendorPurchase = () => (
    <>
      <div className="page-header"><h1>Purchase &amp; Invoices</h1></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>PR ID</th><th>Requested By</th><th>Dept</th><th>Vendor</th><th>Item</th><th>Qty</th><th>Est. Cost</th><th>Approved Cost</th><th>PO ID</th><th>PO Date</th><th>Invoice #</th><th>Inv Date</th><th>Amount</th><th>Tax</th><th>Total</th><th>Due Date</th><th>Approval</th><th>Payment</th></tr></thead>
            <tbody><tr><td>PR001</td><td>Rahul S.</td><td>Telecalling</td><td>TechServe</td><td>Cloud Hosting</td><td>1</td><td>1,20,000</td><td>1,10,000</td><td>PO-001</td><td>2026-08-01</td><td>INV-101</td><td>2026-08-05</td><td>1,10,000</td><td>19,800</td><td>1,29,800</td><td>2026-08-20</td><td>{renderStatusBadge('Approved')}</td><td>{renderStatusBadge('Pending')}</td></tr>
            </tbody></table>
        </div>
      </div>
    </>
  );

  // Assets pane
  const renderAssets = () => (
    <>
      <div className="page-header"><h1>Assets</h1><button className="btn btn-primary" onClick={() => toggleModal('addLead')}><i className="fas fa-plus"></i> Add</button></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Asset ID</th><th>Type</th><th>Name</th><th>Serial</th><th>Purchase Date</th><th>Cost</th><th>Vendor</th><th>Warranty Start</th><th>End</th><th>Assigned To</th><th>Dept</th><th>Branch</th><th>Condition</th><th>Status</th></tr></thead>
            <tbody><tr><td>AST001</td><td>Laptop</td><td>Dell XPS</td><td>SN-001</td><td>2025-06-01</td><td>85,000</td><td>TechServe</td><td>2025-06-01</td><td>2027-05-31</td><td>Rahul S.</td><td>Telecalling</td><td>Mumbai</td><td>Good</td><td>{renderStatusBadge('Active')}</td></tr>
            </tbody></table>
        </div>
      </div>
    </>
  );

  // Subscriptions pane
  const renderSubscriptions = () => (
    <>
      <div className="page-header"><h1>Subscriptions</h1></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Sub ID</th><th>Software</th><th>Vendor</th><th>Category</th><th>Dept</th><th>Owner</th><th>Users</th><th>License</th><th>Cost</th><th>Billing</th><th>Start</th><th>Renewal</th><th>Auto Renew</th><th>Payment</th><th>Status</th><th>Alert</th></tr></thead>
            <tbody><tr><td>SUB001</td><td>Salesforce</td><td>DataSoft</td><td>CRM</td><td>Sales</td><td>Mr. Desai</td><td>25</td><td>Enterprise</td><td>2,50,000</td><td>Annual</td><td>2025-01-01</td><td>2026-01-01</td><td>✓</td><td>{renderStatusBadge('Paid')}</td><td>{renderStatusBadge('Active')}</td><td>✓</td></tr>
            </tbody></table>
        </div>
      </div>
    </>
  );

  // Tickets pane
  const renderTickets = () => (
    <>
      <div className="page-header"><h1>Support Tickets</h1><button className="btn btn-primary" onClick={() => toggleModal('ticket')}><i className="fas fa-plus"></i> New</button></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Ticket ID</th><th>Customer</th><th>Category</th><th>Subcategory</th><th>Priority</th><th>Dept</th><th>Branch</th><th>Assigned To</th><th>Created</th><th>Due Date</th><th>SLA</th><th>Status</th><th>Resolution</th><th>Closed</th><th>Rating</th></tr></thead>
            <tbody><tr><td>TKT001</td><td>Rajesh Iyer</td><td>Lead Correction</td><td>Data</td><td>High</td><td>Ops</td><td>Mumbai</td><td>Rahul S.</td><td>2026-08-05</td><td>2026-08-08</td><td>On Track</td><td>{renderStatusBadge('Open')}</td><td>--</td><td>--</td><td>--</td></tr>
              <tr><td>TKT002</td><td>Priya Sharma</td><td>Allocation</td><td>Engine</td><td>Medium</td><td>Ops</td><td>Delhi</td><td>Ankit V.</td><td>2026-08-06</td><td>2026-08-09</td><td>At Risk</td><td>{renderStatusBadge('In Progress')}</td><td>--</td><td>--</td><td>--</td></tr>
            </tbody></table>
        </div>
      </div>
    </>
  );

  // Tasks pane
  const renderTasks = () => (
    <>
      <div className="page-header"><h1>Tasks</h1><button className="btn btn-primary" onClick={() => toggleModal('addTask')}><i className="fas fa-plus"></i> Create</button></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Task ID</th><th>Name</th><th>Category</th><th>Dept</th><th>Assigned By</th><th>Assigned To</th><th>Priority</th><th>Start</th><th>Due</th><th>Status</th><th>Progress</th><th>Dependency</th><th>Blocker</th><th>Escalation</th><th>Action</th></tr></thead>
            <tbody><tr><td>TSK001</td><td>Review pending leads</td><td>QA</td><td>Telecalling</td><td>Manager</td><td>Rahul S.</td><td>High</td><td>2026-08-01</td><td>2026-08-08</td><td>{renderStatusBadge('In Progress')}</td><td>60%</td><td>--</td><td>--</td><td>No</td><td><i className="fas fa-edit text-green-500 cursor-pointer" onClick={() => showToast('Edit task', 'success')}></i></td></tr>
              <tr><td>TSK002</td><td>Import Q3 data</td><td>Data</td><td>Ops</td><td>Admin</td><td>Priya M.</td><td>Medium</td><td>2026-08-05</td><td>2026-08-10</td><td>{renderStatusBadge('Pending')}</td><td>0%</td><td>--</td><td>--</td><td>No</td><td><i className="fas fa-edit text-green-500 cursor-pointer" onClick={() => showToast('Edit task', 'success')}></i></td></tr>
            </tbody></table>
        </div>
      </div>
    </>
  );

  // Approvals pane
  const renderApprovals = () => (
    <>
      <div className="page-header"><h1>Approval Center</h1></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Request ID</th><th>Type</th><th>Requested By</th><th>Dept</th><th>Branch</th><th>Priority</th><th>Description</th><th>Current Approver</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody><tr><td>APR001</td><td>Lead Reassignment</td><td>Ankit V.</td><td>Telecalling</td><td>Mumbai</td><td>High</td><td>Reassign L1005</td><td>Admin</td><td>{renderStatusBadge('Pending')}</td><td>2026-08-07</td><td><button className="btn btn-success btn-sm" onClick={() => showToast('Approved', 'success')}>Approve</button> <button className="btn btn-danger btn-sm" onClick={() => showToast('Rejected', 'error')}>Reject</button></td></tr>
              <tr><td>APR002</td><td>Bulk Import</td><td>Priya M.</td><td>Telecalling</td><td>Delhi</td><td>Medium</td><td>Import 500 leads</td><td>Admin</td><td>{renderStatusBadge('Approved')}</td><td>2026-08-06</td><td>--</td></tr>
            </tbody></table>
        </div>
      </div>
    </>
  );

  // Exceptions pane
  const renderExceptions = () => (
    <>
      <div className="page-header"><h1>Exception Report</h1></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Exception ID</th><th>Type</th><th>Module</th><th>Record ID</th><th>Dept</th><th>Employee</th><th>Priority</th><th>Severity</th><th>Detected Date</th><th>Detected By</th><th>Assigned To</th><th>Escalation Level</th><th>Escalation Date</th><th>Resolution Status</th><th>Resolution Date</th><th>Remarks</th></tr></thead>
            <tbody><tr><td>EXC001</td><td>Capacity Exceeded</td><td>Allocation</td><td>TC-001</td><td>Telecalling</td><td>Rahul S.</td><td>High</td><td>Critical</td><td>2026-08-07</td><td>System</td><td>Admin</td><td>L1</td><td>2026-08-07</td><td>{renderStatusBadge('Open')}</td><td>--</td><td>--</td></tr>
              <tr><td>EXC002</td><td>Duplicate Lead</td><td>Lead</td><td>L1002</td><td>Telecalling</td><td>--</td><td>Medium</td><td>Major</td><td>2026-08-06</td><td>System</td><td>Priya M.</td><td>L1</td><td>2026-08-06</td><td>{renderStatusBadge('Resolved')}</td><td>2026-08-07</td><td>Merged</td></tr>
            </tbody></table>
        </div>
      </div>
      <p className="text-xs text-gray-500">* Automatically detects: Capacity exceeded, Duplicate assignment, Repeated reassignment, Unassigned, Untouched leads, No follow-up, Overdue follow-ups, Absent with active leads, Inactive, Outside branch/team, Invalid data, Duplicate mobile/email.</p>
    </>
  );

  // Reports Center pane
  const renderReports = () => {
    const getReportContent = () => {
      switch (activeReport) {
        case 'daily-ops':
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 p-4 rounded"><span className="font-bold">Morning</span><br />New Leads: 87<br />Available: 1,240<br />Attendance: 92%<br />Capacity: 78%</div>
              <div className="bg-green-50 p-4 rounded"><span className="font-bold">Midday</span><br />Allocated: 312<br />Worked: 234<br />Calls: 1,283<br />Contact Rate: 64%</div>
              <div className="bg-green-50 p-4 rounded"><span className="font-bold">End of Day</span><br />Assigned: 312<br />Worked: 234<br />Pending: 78<br />Follow-ups: 382<br />Conversion: 14.2%</div>
            </div>
          );
        case 'weekly-ops':
          return (
            <div className="table-wrap"><table><thead><tr><th>Department</th><th>Target</th><th>Achievement</th><th>Productivity</th><th>Leads</th><th>Conversion</th><th>SLA</th><th>Rating</th></tr></thead><tbody><tr><td>Telecalling</td><td>25L</td><td>22.4L</td><td>89%</td><td>1,240</td><td>14.2%</td><td>97%</td><td>4.2</td></tr><tr><td>Sales</td><td>30L</td><td>27.6L</td><td>92%</td><td>890</td><td>22%</td><td>95%</td><td>4.5</td></tr></tbody></table></div>
          );
        case 'monthly-ops':
          return (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><b>Workforce</b><br />Total: 148<br />Active: 142<br />Attendance: 94%</div>
              <div><b>Lead Ops</b><br />Total: 8,450<br />Unique: 7,820<br />Allocated: 6,980<br />Worked: 5,210<br />Conversion: 14.2%</div>
              <div><b>Telecalling</b><br />Calls: 28,400<br />Connected: 18,900<br />Contact Rate: 66.5%<br />Follow-ups: 12,340</div>
              <div><b>Operations</b><br />Tickets: 45<br />SLA: 94%<br />Tasks: 320<br />Exceptions: 87</div>
            </div>
          );
        case 'lead-alloc':
          return (
            <div className="table-wrap"><table><thead><tr><th>Date</th><th>Branch</th><th>Total</th><th>Valid</th><th>Duplicate</th><th>Invalid</th><th>Available</th><th>Allocated</th><th>Pending</th><th>Alloc %</th><th>Telecallers</th></tr></thead><tbody><tr><td>2026-08-07</td><td>Mumbai</td><td>245</td><td>210</td><td>12</td><td>23</td><td>187</td><td>160</td><td>27</td><td>85%</td><td>18</td></tr><tr><td>2026-08-07</td><td>Delhi</td><td>180</td><td>162</td><td>8</td><td>10</td><td>152</td><td>130</td><td>22</td><td>86%</td><td>12</td></tr></tbody></table></div>
          );
        case 'tele-productivity':
          return (
            <div className="table-wrap"><table><thead><tr><th>Telecaller</th><th>Assigned</th><th>Worked</th><th>Calls</th><th>Connected</th><th>Contact Rate</th><th>Follow-ups</th><th>Completion</th><th>Avg Calls/Lead</th><th>Conversion</th><th>Score</th></tr></thead><tbody><tr><td>TC-001</td><td>100</td><td>82</td><td>95</td><td>54</td><td>56.8%</td><td>12</td><td>83%</td><td>1.16</td><td>38%</td><td>92</td></tr><tr><td>TC-002</td><td>75</td><td>57</td><td>98</td><td>68</td><td>69.4%</td><td>14</td><td>86%</td><td>1.72</td><td>43%</td><td>95</td></tr></tbody></table></div>
          );
        case 'bde-pipeline':
          return (
            <div className="table-wrap"><table><thead><tr><th>BDE</th><th>Leads</th><th>Meetings</th><th>Proposals</th><th>Negotiations</th><th>Won</th><th>Lost</th><th>Pipeline Value</th><th>Won Value</th><th>Conversion</th></tr></thead><tbody><tr><td>Ankit</td><td>85</td><td>18</td><td>12</td><td>8</td><td>6</td><td>4</td><td>28L</td><td>18L</td><td>64%</td></tr><tr><td>Priya</td><td>92</td><td>22</td><td>16</td><td>11</td><td>9</td><td>5</td><td>35L</td><td>27L</td><td>77%</td></tr></tbody></table></div>
          );
        case 'vendor-perf':
          return (
            <div className="table-wrap"><table><thead><tr><th>Vendor</th><th>Category</th><th>SLA</th><th>Response Time</th><th>Delivery</th><th>Quality</th><th>Cost Score</th><th>Compliance</th><th>Rating</th></tr></thead><tbody><tr><td>TechServe</td><td>IT</td><td>99.5%</td><td>2h</td><td>98%</td><td>4.5</td><td>4.2</td><td>✓</td><td>4.5</td></tr><tr><td>DataSoft</td><td>Software</td><td>98%</td><td>4h</td><td>95%</td><td>4.2</td><td>4.0</td><td>✓</td><td>4.2</td></tr></tbody></table></div>
          );
        case 'project-progress':
          return (
            <div className="table-wrap"><table><thead><tr><th>Project</th><th>Progress</th><th>Tasks</th><th>Completed</th><th>Pending</th><th>Overdue</th><th>Blockers</th><th>QA</th><th>UAT</th><th>Deployment</th></tr></thead><tbody><tr><td>CRM 2.0</td><td>67%</td><td>48</td><td>32</td><td>16</td><td>2</td><td>2</td><td>In Progress</td><td>Pending</td><td>Pending</td></tr></tbody></table></div>
          );
        case 'exception':
          return (
            <div className="table-wrap"><table><thead><tr><th>Exception</th><th>Count</th><th>Details</th></tr></thead><tbody><tr><td>Capacity Exceeded</td><td>2</td><td>TC-001, TC-003</td></tr><tr><td>Unassigned Leads</td><td>203</td><td>--</td></tr><tr><td>Overdue Follow-ups</td><td>68</td><td>--</td></tr><tr><td>Duplicate Mobile</td><td>14</td><td>--</td></tr></tbody></table></div>
          );
        default:
          return <div>Select a report</div>;
      }
    };

    return (
      <>
        <div className="page-header"><h1>Report Center</h1></div>
        <div className="tabs" id="reportTabs">
          {['daily-ops', 'weekly-ops', 'monthly-ops', 'lead-alloc', 'tele-productivity', 'bde-pipeline', 'vendor-perf', 'project-progress', 'exception'].map((r) => (
            <button key={r} className={activeReport === r ? 'active' : ''} onClick={() => setActiveReport(r)}>
              {r.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
        <div className="report-card">
          {getReportContent()}
        </div>
      </>
    );
  };

  // Branches pane
  const renderBranches = () => (
    <>
      <div className="page-header"><h1>Branches</h1><button className="btn btn-primary" onClick={() => toggleModal('addBranch')}><i className="fas fa-plus"></i> Add</button></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Branch ID</th><th>Code</th><th>Name</th><th>Type</th><th>Address</th><th>City</th><th>State</th><th>Pincode</th><th>Manager</th><th>Ops Manager</th><th>Employees</th><th>Telecallers</th><th>Capacity</th><th>Status</th></tr></thead>
            <tbody><tr><td>BR001</td><td>MUM-001</td><td>Mumbai Central</td><td>Main</td><td>BKC</td><td>Mumbai</td><td>MH</td><td>400051</td><td>Mr. Desai</td><td>Ms. Rao</td><td>45</td><td>18</td><td>1,800</td><td>{renderStatusBadge('Active')}</td></tr>
              <tr><td>BR002</td><td>DEL-001</td><td>Delhi South</td><td>Branch</td><td>GK</td><td>Delhi</td><td>DL</td><td>110048</td><td>Ms. Gupta</td><td>Mr. Singh</td><td>32</td><td>12</td><td>1,200</td><td>{renderStatusBadge('Active')}</td></tr>
            </tbody></table>
        </div>
      </div>
    </>
  );

  // Settings pane
  const renderSettings = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Operational Settings</h1>
      <div className="bg-white p-6 rounded-lg border space-y-5">
        <div className="flex justify-between items-center border-b pb-3"><span className="font-medium">Max Daily Leads per Telecaller</span><span><input type="number" defaultValue="100" className="border rounded p-1 w-20" /> <button className="btn btn-primary btn-sm" onClick={() => showToast('Updated', 'success')}>Save</button></span></div>
        <div className="flex justify-between items-center border-b pb-3"><span className="font-medium">Duplicate Prevention (Mobile)</span><span><input type="checkbox" defaultChecked /> Enabled</span></div>
        <div className="flex justify-between items-center border-b pb-3"><span className="font-medium">Auto-allocation on Import</span><span><input type="checkbox" /> Disabled</span></div>
        <div className="flex justify-between items-center"><span className="font-medium">Admin Override Logging</span><span><input type="checkbox" defaultChecked /> Enabled</span></div>
      </div>
    </>
  );

  // Audit pane
  const renderAudit = () => (
    <>
      <div className="page-header"><h1>Audit Log</h1></div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table><thead><tr><th>Activity ID</th><th>Admin ID</th><th>User</th><th>Module</th><th>Action</th><th>Record ID</th><th>Previous Value</th><th>New Value</th><th>Date</th><th>Time</th><th>IP</th><th>Device</th><th>Browser</th><th>Status</th><th>Remarks</th></tr></thead>
            <tbody><tr><td>ACT001</td><td>ADM-1001</td><td>admin@epay.com</td><td>Allocation</td><td>Allocate</td><td>L1005</td><td>Unassigned</td><td>TC-004</td><td>2026-08-07</td><td>10:23</td><td>192.168.1.1</td><td>Laptop</td><td>Chrome</td><td>{renderStatusBadge('Success')}</td><td>--</td></tr>
              <tr><td>ACT002</td><td>ADM-1001</td><td>admin@epay.com</td><td>Reassignment</td><td>Reassign</td><td>L1008</td><td>TC-002</td><td>TC-003</td><td>2026-08-06</td><td>17:40</td><td>192.168.1.1</td><td>Laptop</td><td>Chrome</td><td>{renderStatusBadge('Success')}</td><td>Skill mismatch</td></tr>
            </tbody></table>
        </div>
      </div>
    </>
  );

  // ---------- Main render ----------
  return (
    <div className="app-container">
      <style>{`
        /* ===== GREEN THEME ===== */
        :root {
          --green-50: #ecfdf5;
          --green-100: #d1fae5;
          --green-200: #a7f3d0;
          --green-300: #6ee7b7;
          --green-400: #34d399;
          --green-500: #10b981;
          --green-600: #059669;
          --green-700: #047857;
          --green-800: #065f46;
          --green-900: #064e3b;
          --white: #ffffff;
          --off-white: #f4fbf8;
          --surface: #e6f4ee;
          --text: #0a2e1f;
          --text-secondary: #1b4d3a;
          --text-muted: #2b5e47;
          --border: #b8d9cc;
          --border-light: #d5ede2;
          --radius-sm: 10px;
          --radius: 14px;
          --radius-lg: 20px;
          --radius-xl: 28px;
          --shadow-sm: 0 1px 3px rgba(5, 150, 105, 0.08), 0 1px 2px rgba(5, 150, 105, 0.05);
          --shadow: 0 4px 20px rgba(5, 150, 105, 0.10), 0 1px 4px rgba(5, 150, 105, 0.06);
          --shadow-md: 0 8px 30px rgba(5, 150, 105, 0.12), 0 2px 8px rgba(5, 150, 105, 0.06);
          --shadow-lg: 0 20px 50px rgba(5, 150, 105, 0.14), 0 6px 16px rgba(5, 150, 105, 0.08);
          --shadow-green: 0 8px 30px rgba(5, 150, 105, 0.20), 0 2px 8px rgba(5, 150, 105, 0.10);
          --shadow-green-lg: 0 20px 50px rgba(5, 150, 105, 0.25), 0 6px 16px rgba(5, 150, 105, 0.12);
          --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --transition-smooth: 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          --transition-bounce: 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          --glass: rgba(255, 255, 255, 0.6);
          --glass-border: rgba(5, 150, 105, 0.15);
          --purple: #0f7b5a;
          --purple-light: #16a34a;
          --purple-dim: rgba(5, 150, 105, 0.08);
          --cyan: #059669;
          --emerald: #10b981;
          --amber: #d97706;
          --amber-dim: rgba(217, 119, 6, 0.12);
          --emerald-dim: rgba(16, 185, 129, 0.12);
          --ink: #f0faf5;
          --ink-2: #e3f3eb;
          --ink-3: #d3ece1;
          --muted: #2b5e47;
          --border: #b0d5c4;
        }
        * { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f0faf5; margin: 0; padding: 0; height: 100vh; overflow: hidden; display: flex; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #d5ede2; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #34d399; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #059669; }

        .app-container { display: flex; height: 100vh; width: 100%; overflow: hidden; }

        /* Sidebar */
        #sidebar {
          width: 270px;
          background: #0b1f16;
          color: #d1fae5;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100vh;
          overflow-y: auto;
          position: sticky;
          top: 0;
          border-right: 1px solid #1a3a2e;
          transition: transform 0.3s ease, width 0.3s ease;
          z-index: 50;
        }
        #sidebar .brand {
          padding: 20px 24px;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          border-bottom: 1px solid #1a3a2e;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        #sidebar .brand i { font-size: 24px; color: #34d399; }
        #sidebar .nav { flex: 1; padding: 12px 0 20px 0; overflow-y: auto; }
        #sidebar .nav-section {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 12px 24px 6px 24px;
          color: #6ee7b7;
          font-weight: 600;
        }
        #sidebar .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 24px;
          color: #a7f3d0;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border-left: 3px solid transparent;
          transition: all 0.15s;
          text-decoration: none;
        }
        #sidebar .nav-item:hover {
          background: #1a3a2e;
          color: #fff;
          border-left-color: #34d399;
        }
        #sidebar .nav-item.active {
          background: #1a3a2e;
          color: #fff;
          border-left-color: #34d399;
        }
        #sidebar .nav-item i { width: 18px; text-align: center; font-size: 14px; }
        #sidebar .nav-item .badge {
          margin-left: auto;
          background: #34d399;
          color: #0b1f16;
          font-size: 9px;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 600;
        }
        .nav-sub .nav-item { padding-left: 44px; font-size: 12px; }
        .nav-sub .nav-item i { font-size: 12px; }

        /* Main */
        #main {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px 40px 32px;
          background: #f0faf5;
          display: flex;
          flex-direction: column;
        }

        /* Top header */
        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
          background: #fff;
          padding: 12px 24px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(5, 150, 105, 0.06);
          border: 1px solid #b8d9cc;
          flex-shrink: 0;
        }
        .top-header .hamburger { display: none; background: none; border: none; font-size: 22px; color: #0a2e1f; cursor: pointer; }
        .top-header .search-wrap { position: relative; flex: 1 1 300px; }
        .top-header .search-wrap input {
          width: 100%;
          padding: 10px 16px 10px 42px;
          border: 1px solid #b8d9cc;
          border-radius: 40px;
          font-size: 13px;
          outline: none;
          background: #f8fafc;
          transition: 0.2s;
        }
        .top-header .search-wrap input:focus {
          border-color: #059669;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);
        }
        .top-header .search-wrap i { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #2b5e47; }
        .top-header .actions { display: flex; align-items: center; gap: 20px; }
        .top-header .actions .avatar {
          width: 36px; height: 36px; border-radius: 50%; background: #059669;
          display: flex; align-items: center; justify-content: center; color: #fff;
          font-weight: 600; font-size: 14px; cursor: pointer;
        }
        .top-header .actions .avatar:hover { background: #047857; }

        /* Page header */
        .page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
        .page-header h1 { font-size: 22px; font-weight: 700; color: #0a2e1f; margin: 0; }
        .page-header .sub { color: #2b5e47; font-size: 13px; }

        /* KPI cards */
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 14px; margin-bottom: 24px; }
        .kpi-card {
          background: #fff; border-radius: 14px; padding: 16px 18px; border: 1px solid #b8d9cc;
          box-shadow: 0 1px 3px rgba(5, 150, 105, 0.04); transition: all 0.2s;
          display: flex; flex-direction: column;
        }
        .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(5, 150, 105, 0.08); border-color: #34d399; }
        .kpi-card .label { font-size: 11px; color: #2b5e47; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px; display: flex; align-items: center; gap: 6px; }
        .kpi-card .label i { color: #059669; }
        .kpi-card .value { font-size: 26px; font-weight: 700; color: #0a2e1f; margin: 4px 0 2px; }
        .kpi-card .trend { font-size: 11px; display: flex; align-items: center; gap: 4px; }
        .kpi-card .trend.up { color: #10b981; }
        .kpi-card .trend.down { color: #ef4444; }

        /* Filter bar */
        .filter-bar {
          background: #fff; border-radius: 14px; padding: 14px 20px; border: 1px solid #b8d9cc;
          display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: flex-end; margin-bottom: 24px;
        }
        .filter-group { display: flex; flex-direction: column; gap: 4px; }
        .filter-group label { font-size: 11px; font-weight: 600; color: #1b4d3a; }
        .filter-group select, .filter-group input {
          padding: 7px 12px; border: 1px solid #b8d9cc; border-radius: 8px; font-size: 12px;
          background: #fff; outline: none; min-width: 130px; transition: 0.2s;
        }
        .filter-group select:focus, .filter-group input:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12); }

        /* Tables */
        .table-wrap { background: #fff; border-radius: 14px; border: 1px solid #b8d9cc; overflow: hidden; margin-bottom: 20px; }
        .table-scroll { overflow-x: auto; padding: 0 0 4px 0; }
        .table-wrap table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .table-wrap th {
          background: #ecfdf5; text-align: left; padding: 12px 14px; font-weight: 600;
          color: #065f46; border-bottom: 1px solid #b8d9cc; white-space: nowrap;
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;
        }
        .table-wrap td { padding: 10px 14px; border-bottom: 1px solid #f0faf5; vertical-align: middle; }
        .table-wrap tr:hover td { background: #f4fbf8; }
        .status-badge {
          display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 10px; font-weight: 600;
        }
        .status-badge.success { background: #d1fae5; color: #065f46; }
        .status-badge.danger { background: #fee2e2; color: #991b1b; }
        .status-badge.warning { background: #fef3c7; color: #92400e; }
        .status-badge.info { background: #dbeafe; color: #1e40af; }
        .status-badge.secondary { background: #e2e8f0; color: #475569; }

        /* Pagination */
        .pagination { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-top: 1px solid #b8d9cc; flex-wrap: wrap; gap: 8px; font-size: 12px; color: #1b4d3a; }
        .pagination .pages { display: flex; gap: 4px; }
        .pagination .pages button {
          padding: 4px 10px; border: 1px solid #b8d9cc; border-radius: 6px; background: #fff;
          cursor: pointer; transition: 0.15s; font-size: 12px;
        }
        .pagination .pages button.active-page { background: #059669; color: #fff; border-color: #059669; }
        .pagination .pages button:hover:not(.active-page) { background: #ecfdf5; }

        /* Tabs */
        .tabs { display: flex; border-bottom: 2px solid #b8d9cc; margin-bottom: 20px; gap: 4px; flex-wrap: wrap; }
        .tabs button {
          padding: 8px 18px; font-weight: 600; font-size: 13px; background: transparent; border: none;
          color: #2b5e47; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px;
          transition: 0.2s; white-space: nowrap;
        }
        .tabs button:hover { color: #0a2e1f; }
        .tabs button.active { color: #059669; border-bottom-color: #059669; }

        /* Report cards */
        .report-card { background: #fff; border-radius: 14px; padding: 20px 24px; border: 1px solid #b8d9cc; margin-bottom: 20px; }
        .field-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 6px 24px; }
        .field-grid .field-item { font-size: 12px; padding: 6px 0; border-bottom: 1px dashed #ecfdf5; display: flex; justify-content: space-between; }
        .field-grid .field-item .fname { color: #2b5e47; }
        .field-grid .field-item .fvalue { font-weight: 500; color: #0a2e1f; }

        /* Buttons */
        .btn { padding: 8px 18px; border-radius: 8px; font-weight: 600; font-size: 12px; border: none; cursor: pointer; transition: 0.15s; display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary { background: #059669; color: #fff; }
        .btn-primary:hover { background: #047857; }
        .btn-outline { background: transparent; border: 1px solid #b8d9cc; color: #0a2e1f; }
        .btn-outline:hover { background: #ecfdf5; }
        .btn-success { background: #10b981; color: #fff; }
        .btn-success:hover { background: #059669; }
        .btn-danger { background: #ef4444; color: #fff; }
        .btn-danger:hover { background: #dc2626; }
        .btn-sm { padding: 4px 12px; font-size: 11px; }

        /* Toast */
        .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
        .toast {
          background: #fff; border-radius: 12px; padding: 12px 18px; box-shadow: 0 8px 24px rgba(5, 150, 105, 0.12);
          border-left: 4px solid #059669; min-width: 220px; animation: slideInRight 0.3s ease;
          font-size: 13px; display: flex; align-items: center; gap: 10px;
        }
        .toast.success { border-left-color: #10b981; }
        .toast.error { border-left-color: #ef4444; }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        /* Backdrop */
        .backdrop { display: none; position: fixed; inset: 0; background: rgba(10, 46, 31, 0.3); z-index: 90; }
        .backdrop.open { display: block; }

        /* Responsive */
        @media (max-width: 768px) {
          #sidebar { position: fixed; top: 0; left: 0; height: 100vh; width: 280px; transform: translateX(-100%); z-index: 100; }
          #sidebar.open { transform: translateX(0); }
          .top-header .hamburger { display: block; }
          #main { padding: 16px; }
          .kpi-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
          .filter-bar { flex-direction: column; align-items: stretch; }
          .field-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Sidebar */}
      <aside id="sidebar" className={isSidebarOpen ? 'open' : ''}>
        <div className="brand">
          <i className="fas fa-shield-alt"></i>
          <span>Ops Admin</span>
        </div>
        <nav className="nav">
          {navItems.map((item, idx) => {
            if (item.section) {
              return <div key={`section-${idx}`} className="nav-section">{item.section}</div>;
            }
            const isActive = activeTab === item.tab;
            const cls = `nav-item${item.sub ? ' nav-sub' : ''}${isActive ? ' active' : ''}`;
            return (
              <a key={item.tab} className={cls} href="#" onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.tab);
                if (window.innerWidth <= 768) toggleSidebar();
              }}>
                <i className={`fas ${item.icon}`}></i> {item.label}
                {item.tab === 'leads' && <span className="badge">1,240</span>}
                {item.tab === 'tickets' && <span className="badge">12</span>}
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Backdrop */}
      <div className={`backdrop ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>

      {/* Main content */}
      <div id="main">
        <header className="top-header">
          <button className="hamburger" onClick={toggleSidebar}><i className="fas fa-bars"></i></button>
          <div className="search-wrap">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search employees, leads, vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="actions">
            <span className="text-sm text-gray-600 hidden sm:inline">Last updated: <span id="lastUpdated">{lastUpdated}</span></span>
            <i className="far fa-bell text-gray-500 text-lg cursor-pointer hover:text-gray-700" onClick={() => showToast('No new notifications')}></i>
            <div className="avatar" onClick={() => showToast('Yashraj Sathe – Operations Manager')}>YS</div>
          </div>
        </header>

        {/* Tab panes */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'admin-profile' && renderAdminProfile()}
        {activeTab === 'org-ops' && renderOrgOps()}
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'leads' && renderLeads()}
        {activeTab === 'lead-add' && renderLeadAdd()}
        {activeTab === 'lead-import' && renderLeadImport()}
        {activeTab === 'allocation' && renderAllocation()}
        {activeTab === 'capacity' && renderCapacity()}
        {activeTab === 'reassign' && renderReassign()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'followups' && renderFollowups()}
        {activeTab === 'ageing' && renderAgeing()}
        {activeTab === 'tele-daily' && renderTeleDaily()}
        {activeTab === 'bde' && renderBDE()}
        {activeTab === 'vendors' && renderVendors()}
        {activeTab === 'vendor-contracts' && renderVendorContracts()}
        {activeTab === 'vendor-purchase' && renderVendorPurchase()}
        {activeTab === 'assets' && renderAssets()}
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'tickets' && renderTickets()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'approvals' && renderApprovals()}
        {activeTab === 'exceptions' && renderExceptions()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'branches' && renderBranches()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'audit' && renderAudit()}
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <i className={`fas fa-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i> {toast.message}
          </div>
        </div>
      )}

      {/* Modals (simple placeholders) */}
      {modals.addLead && (
        <div className="modal-overlay active" onClick={() => toggleModal('addLead')}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Add Lead</h2>
            <p>Modal content for adding a lead. (Implement form here)</p>
            <button className="btn btn-primary" onClick={() => { toggleModal('addLead'); showToast('Lead added', 'success'); }}>Save</button>
            <button className="btn btn-outline" onClick={() => toggleModal('addLead')}>Cancel</button>
          </div>
        </div>
      )}
      {/* Similarly for other modals – you can expand as needed */}
    </div>
  );
};

export default App;