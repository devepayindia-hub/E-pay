'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import { useAuth } from '@/lib/auth-context';
import { ALL_ROLES } from '@/lib/rbac';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  Crown, Cpu, Database, Server, RefreshCw, UserPlus, Users, 
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Search, Filter, 
  Trash2, Edit3, Lock, Mail, Building, MapPin, Activity, 
  AlertCircle, ChevronDown, Check, KeyRound, UserCheck, Eye, EyeOff,
  Clock, ThumbsUp, ThumbsDown, CheckCircle, AlertTriangle, Radio
} from 'lucide-react';

const ROLE_CATEGORIES = {
  'Top Management': ['superadmin', 'admin', 'ceo', 'md', 'cfo', 'cgo', 'cmo', 'cto', 'td'],
  'Operations & Regional': ['head-ops', 'ops-mgr', 'asst-ops-mgr', 'biz-ops-mgr', 'ops-exec', 'ops-coord', 'gallery-ops-mgr', 'franchise-ops-mgr', 'regional-ops-mgr', 'area-ops-mgr', 'sd', 'state-head', 'gdm', 'gm', 'gm-ops', 'owner', 'hq-head', 'hq-manager', 'crm-admin'],
  'Sales & Business Dev': ['bdm', 'sales-mgr', 'sales-exec', 'biz-growth-mgr', 'channel-dev-mgr', 'franchise-dev-mgr', 'relationship-mgr', 'field-sales-exec', 'tele-sales-exec', 'bde', 'bdo', 'telecalling'],
  'Training & Education': ['head-training', 'training-manager', 'td-manager', 'biz-training-manager', 'prod-training-exec', 'sales-trainer', 'bd-trainer', 'leadership-trainer', 'training-coord', 'training-exec'],
  'Marketing & Brand': ['marketing-mgr', 'digital-mktg-mgr', 'digital-mktg-exec', 'brand-mktg-mgr', 'mktg-coord', 'campaign-mgr', 'perf-mktg-exec', 'content-mktg-exec', 'mktg-ops-exec', 'marketing', 'marketing-exec', 'social'],
  'Operations Execution': ['cust-ops-exec', 'service-ops-exec', 'quality-exec', 'mis-ops-exec', 'doc-exec', 'kyc-exec', 'inventory-ops-exec', 'asset-mgmt-exec', 'complaint-exec'],
  'Finance & Human Resources': ['finance', 'accountant', 'hr', 'referral'],
  'Services & Portals': ['support', 'customer', 'commerce', 'devhub', 'franchise']
};

export default function SuperAdminPage() {
  const { user, role, createUser, approveUser, rejectUser, updateUser, deleteUser, getAllUsers } = useAuth();

  const [activeTab, setActiveTab] = useState('users'); // users | pending | audit | telemetry
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [dataSourceFilter, setDataSourceFilter] = useState('real'); // 'real' | 'all'
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Add User Form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newUserRole, setNewUserRole] = useState('sales-exec');
  const [newUserEmpId, setNewUserEmpId] = useState('');
  const [newUserDept, setNewUserDept] = useState('Sales');
  const [newUserDesignation, setNewUserDesignation] = useState('Sales Executive');
  const [newUserSalary, setNewUserSalary] = useState('₹35,000/mo');
  const [newUserState, setNewUserState] = useState('MH');
  const [newUserDistrict, setNewUserDistrict] = useState('PUNE');
  const [newUserGallery, setNewUserGallery] = useState('GAL_PUNE_01');
  const [newUserReportsTo, setNewUserReportsTo] = useState('EMP-2026-0001');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit User Form state
  const [editRole, setEditRole] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Telemetry & Audit state
  const [auditLogs, setAuditLogs] = useState([
    { id: 'LOG-1001', actor: 'superadmin@epay.in', event: 'USER_CREATED', details: 'Provisioned Sales Executive account for Amit Kumar', timestamp: '2026-08-26 09:15' },
    { id: 'LOG-1002', actor: 'superadmin@epay.in', event: 'ROLE_CONFIG_SYNC', details: 'Synchronized RBAC permissions for 80+ enterprise roles', timestamp: '2026-08-26 08:30' },
    { id: 'LOG-1003', actor: 'SYSTEM_DAEMON', event: 'SYSTEM_BACKUP', details: 'Full encrypted snapshot of user registry & attendance tables', timestamp: '2026-08-26 04:00' },
    { id: 'LOG-1004', actor: 'SECURITY_SCANNER', event: 'VULNERABILITY_AUDIT', details: 'Zero security policy breaches detected in Firestore tenant rules', timestamp: '2026-08-25 23:55' }
  ]);

  // Load all users on mount & when dataSourceFilter changes
  const refreshUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const users = await getAllUsers({ includeSeedUsers: dataSourceFilter === 'all' });
      setUsersList(users || []);
    } catch (err) {
      console.warn('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, [getAllUsers, dataSourceFilter]);

  useEffect(() => {
    refreshUsers();

    let unsubUsers = null;
    let unsubAudit = null;

    if (db && typeof window !== 'undefined') {
      try {
        const usersCol = collection(db, 'tenants', 'default', 'users');
        unsubUsers = onSnapshot(usersCol, (snapshot) => {
          setIsFirestoreConnected(true);
          refreshUsers();
        }, (_err) => {
          setIsFirestoreConnected(false);
        });

        const auditCol = collection(db, 'tenants', 'default', 'auditLogs');
        unsubAudit = onSnapshot(auditCol, (snapshot) => {
          if (!snapshot.empty) {
            const logs = [];
            snapshot.forEach(d => {
              const data = d.data();
              logs.push({
                id: d.id,
                actor: data.actor || data.actorEmail || data.userEmail || 'superadmin@epay.in',
                event: data.eventType || data.event || 'AUDIT_LOG',
                details: data.details || data.reason || `Action performed for ${data.targetUserEmail || data.targetEmail || 'system'}`,
                timestamp: data.timestamp ? data.timestamp.slice(0, 16).replace('T', ' ') : new Date().toISOString().slice(0, 16).replace('T', ' ')
              });
            });
            logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setAuditLogs(logs);
          }
        }, (_err) => {});
      } catch (_e) {}
    }

    if (typeof window !== 'undefined') {
      const handleSync = () => refreshUsers();
      window.addEventListener('epay_users_updated', handleSync);
      window.addEventListener('storage', handleSync);
      return () => {
        if (unsubUsers) unsubUsers();
        if (unsubAudit) unsubAudit();
        window.removeEventListener('epay_users_updated', handleSync);
        window.removeEventListener('storage', handleSync);
      };
    }
  }, [refreshUsers]);

  // Handle Approve User
  const handleApproveUser = async (targetUser) => {
    try {
      await approveUser(targetUser.uid);
      const log = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        actor: user?.email || 'superadmin@epay.in',
        event: 'EMPLOYEE_APPROVED_BY_SUPERADMIN',
        details: `Approved & activated account for ${targetUser.name} (${targetUser.email}) with role ${targetUser.role?.toUpperCase()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
      setAuditLogs(prev => [log, ...prev]);
      setActionNotice(`✅ Approved ${targetUser.name}! Account is now active.`);
      setTimeout(() => setActionNotice(''), 4000);
      await refreshUsers();
    } catch (err) {
      alert(err.message || 'Failed to approve user.');
    }
  };

  // Handle Reject User
  const handleRejectUser = async (targetUser) => {
    const reason = prompt(`Enter rejection reason for candidate "${targetUser.name}":`, 'Application requirements not met');
    if (reason === null) return;

    try {
      await rejectUser(targetUser.uid, reason);
      const log = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        actor: user?.email || 'superadmin@epay.in',
        event: 'EMPLOYEE_REJECTED_BY_SUPERADMIN',
        details: `Rejected onboarding for ${targetUser.name} (${targetUser.email}). Reason: ${reason}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
      setAuditLogs(prev => [log, ...prev]);
      setActionNotice(`🚫 Rejected onboarding request for ${targetUser.name}.`);
      setTimeout(() => setActionNotice(''), 4000);
      await refreshUsers();
    } catch (err) {
      alert(err.message || 'Failed to reject user.');
    }
  };

  // Handle Add User Submit (Super Admin Direct Creation)
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      setFormError('Please fill in all mandatory fields (Name, Email, Password, Role).');
      return;
    }

    if (newUserPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: newUserName.trim(),
        email: newUserEmail.trim().toLowerCase(),
        password: newUserPassword.trim(),
        role: newUserRole,
        employeeId: newUserEmpId.trim() || `EMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        department: newUserDept.trim(),
        designation: newUserDesignation.trim(),
        salary: newUserSalary.trim(),
        stateId: newUserState.trim(),
        districtId: newUserDistrict.trim(),
        galleryId: newUserGallery.trim(),
        reportsTo: newUserReportsTo.trim()
      };

      const res = await createUser(payload);

      const newLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        actor: user?.email || 'superadmin@epay.in',
        event: 'USER_CREATED',
        details: `Directly provisioned ${newUserRole.toUpperCase()} account for ${payload.name} (${payload.email})`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
      setAuditLogs(prev => [newLog, ...prev]);

      setFormSuccess(`User ${payload.name} (${payload.email}) successfully provisioned and activated with role "${newUserRole}"!`);
      
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserEmpId('');
      
      await refreshUsers();

      setTimeout(() => {
        setFormSuccess('');
        setShowAddUserModal(false);
      }, 1500);

    } catch (err) {
      setFormError(err.message || 'Failed to create user. Please check data and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit User
  const openEditModal = (targetUser) => {
    setEditingUser(targetUser);
    setEditRole(targetUser.role || 'sales-exec');
    setEditStatus(targetUser.status || 'active');
    setEditDept(targetUser.department || 'Operations');
    setEditDesignation(targetUser.designation || targetUser.role?.toUpperCase());
    setShowEditUserModal(true);
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setEditSubmitting(true);
    try {
      await updateUser(editingUser.uid, {
        role: editRole,
        status: editStatus,
        department: editDept,
        designation: editDesignation
      });

      const newLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        actor: user?.email || 'superadmin@epay.in',
        event: 'USER_UPDATED',
        details: `Updated profile for ${editingUser.name} (${editingUser.email}): Role=${editRole}, Status=${editStatus}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
      setAuditLogs(prev => [newLog, ...prev]);

      setShowEditUserModal(false);
      await refreshUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user.');
    } finally {
      setEditSubmitting(false);
    }
  };

  // Toggle user status active/inactive
  const handleToggleStatus = async (targetUser) => {
    const newStatus = targetUser.status === 'active' ? 'inactive' : 'active';
    try {
      await updateUser(targetUser.uid, { status: newStatus });
      setUsersList(prev => prev.map(u => u.uid === targetUser.uid ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert(err.message || 'Failed to toggle status.');
    }
  };

  // Delete User
  const handleDeleteUser = async (targetUser) => {
    if (targetUser.email?.toLowerCase() === 'superadmin@epay.in') {
      alert('Root Super Admin account cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to delete user "${targetUser.name}" (${targetUser.email})? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteUser(targetUser);
      setUsersList(prev => prev.filter(u => u.uid !== targetUser.uid && u.email?.toLowerCase() !== targetUser.email?.toLowerCase()));
      setActionNotice(`🗑️ User ${targetUser.name} (${targetUser.email}) has been permanently deleted.`);
      setTimeout(() => setActionNotice(''), 4000);
      await refreshUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  // Filtered users
  const filteredUsers = usersList.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      (u.name && u.name.toLowerCase().includes(q)) || 
      (u.email && u.email.toLowerCase().includes(q)) || 
      (u.employeeId && u.employeeId.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q));

    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || (u.status || 'active') === selectedStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const pendingApprovalUsers = usersList.filter(u => u.status === 'pending_approval');
  const totalUsers = usersList.length;
  const activeUsersCount = usersList.filter(u => (u.status || 'active') === 'active').length;
  const execRolesCount = usersList.filter(u => ['superadmin', 'ceo', 'cfo', 'cto', 'cmo', 'cgo', 'md'].includes(u.role)).length;
  const fieldOpsCount = usersList.filter(u => ['bde', 'bdo', 'sales-exec', 'telecalling', 'gm', 'gallery-ops-mgr'].includes(u.role)).length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 md:p-8 flex-1 space-y-6 overflow-y-auto">
          {/* Action Notification Toast */}
          {actionNotice && (
            <div className="p-3.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
              <span>{actionNotice}</span>
              <button onClick={() => setActionNotice('')} className="text-purple-300 hover:text-white font-bold ml-4">✕</button>
            </div>
          )}

          {/* Top Banner Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap">
                    <span>Super Admin Governance & User Management</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                      Master Authority
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 border ${
                      dataSourceFilter === 'real'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${dataSourceFilter === 'real' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span>{dataSourceFilter === 'real' ? 'Real Firestore Users' : 'All Demo & Real Users'}</span>
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Exclusive user provisioning, HR onboarding approval governance, and enterprise platform security
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setNewUserEmpId(`EMP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                  setShowAddUserModal(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/25 flex items-center gap-2 transition-all active:scale-[0.99]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Staff User</span>
              </button>

              <button 
                onClick={refreshUsers}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
                title="Refresh User Directory"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin text-purple-400' : ''}`} />
                <span>Sync</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Staff Users" 
              value={totalUsers.toString()} 
              change="Authorized Personnel" 
              isPositive={true} 
              icon={Users} 
              color="purple" 
            />
            <StatCard 
              title="Pending HR Requests" 
              value={`${pendingApprovalUsers.length} Pending`} 
              change={pendingApprovalUsers.length > 0 ? "Requires Authorization" : "All Approved"} 
              isPositive={pendingApprovalUsers.length === 0} 
              icon={Clock} 
              color={pendingApprovalUsers.length > 0 ? "amber" : "emerald"} 
            />
            <StatCard 
              title="Active Accounts" 
              value={`${activeUsersCount} Active`} 
              change={`${totalUsers - activeUsersCount} Inactive/Pending`} 
              isPositive={true} 
              icon={ShieldCheck} 
              color="emerald" 
            />
            <StatCard 
              title="Executive Leadership" 
              value={execRolesCount.toString()} 
              change="C-Suite & Board" 
              isPositive={true} 
              icon={Crown} 
              color="blue" 
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold flex-wrap">
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Directory ({filteredUsers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all relative ${
                activeTab === 'pending'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Pending HR Approvals</span>
              {pendingApprovalUsers.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] animate-pulse">
                  {pendingApprovalUsers.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'audit'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Audit Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'telemetry'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Infrastructure Telemetry</span>
            </button>
          </div>

          {/* TAB 1: PENDING HR APPROVALS */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200">
                  <span className="font-bold text-amber-300">Super Admin Authorization Gate: </span>
                  Employees submitted by HR are held in pending status until you approve them. Once approved, credentials are fully activated in Firebase Auth and the employee can log into the CRM.
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                      <tr>
                        <th className="px-5 py-4">Candidate / Employee</th>
                        <th className="px-5 py-4">Work Email</th>
                        <th className="px-5 py-4">Requested Role</th>
                        <th className="px-5 py-4">Department & Salary</th>
                        <th className="px-5 py-4">Submitted By</th>
                        <th className="px-5 py-4">Submission Date</th>
                        <th className="px-5 py-4 text-right">Approval Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {pendingApprovalUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
                            <p className="font-semibold text-sm text-slate-200">No Pending Approvals</p>
                            <p className="text-xs text-slate-500 mt-1">All employee onboarding requests submitted by HR have been reviewed.</p>
                          </td>
                        </tr>
                      ) : (
                        pendingApprovalUsers.map((u) => (
                          <tr key={u.uid || u.email} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                                  {u.name ? u.name.slice(0, 2).toUpperCase() : 'EP'}
                                </div>
                                <div>
                                  <div className="font-bold text-white">{u.name}</div>
                                  <span className="text-[11px] text-slate-500 font-mono">{u.employeeId || 'EMP-XXXX'}</span>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="font-mono text-slate-300">{u.email}</span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/25">
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>{u.role ? u.role.toUpperCase() : 'STAFF'}</span>
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <div className="text-slate-300 font-medium">{u.department || 'Operations'}</div>
                              <div className="text-[11px] text-emerald-400 font-semibold">{u.salary || 'Standard CTC'}</div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-slate-300 font-mono text-[11px]">{u.createdBy || 'HR Department'}</span>
                            </td>

                            <td className="px-5 py-4 text-slate-400 text-[11px]">
                              {u.createdAt ? u.createdAt.slice(0, 10) : 'Today'}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleApproveUser(u)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>Approve & Activate</span>
                                </button>

                                <button
                                  onClick={() => handleRejectUser(u)}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                  <span>Reject</span>
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

          {/* TAB 2: USERS DIRECTORY & PROVISIONING */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, email, employee ID, role..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-xs">
                    <Database className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-slate-400 font-medium">Data Source:</span>
                    <select
                      value={dataSourceFilter}
                      onChange={(e) => setDataSourceFilter(e.target.value)}
                      className="bg-slate-800 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs font-bold text-purple-300 focus:outline-none focus:border-purple-400"
                    >
                      <option value="real">⚡ Real Users Only (Firestore DB)</option>
                      <option value="all">📦 All (Including Baseline Demo Users)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400 font-medium">Role:</span>
                    <select
                      value={selectedRoleFilter}
                      onChange={(e) => setSelectedRoleFilter(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="ALL">All Roles ({ALL_ROLES.length}+)</option>
                      {ALL_ROLES.map(r => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-medium">Status:</span>
                    <select
                      value={selectedStatusFilter}
                      onChange={(e) => setSelectedStatusFilter(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="ALL">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="pending_approval">Pending Approval</option>
                      <option value="inactive">Inactive Only</option>
                      <option value="rejected">Rejected Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                      <tr>
                        <th className="px-5 py-4">Employee / User</th>
                        <th className="px-5 py-4">Work Email</th>
                        <th className="px-5 py-4">Assigned Role</th>
                        <th className="px-5 py-4">Department / Gallery</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Created Date</th>
                        <th className="px-5 py-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                            <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                            <p className="font-semibold text-sm text-slate-300">No matching staff users found</p>
                            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or role filter.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const status = u.status || 'active';
                          const isActive = status === 'active';
                          const isPending = status === 'pending_approval';
                          const isRejected = status === 'rejected';
                          const isRoot = u.email?.toLowerCase() === 'superadmin@epay.in';

                          return (
                            <tr key={u.uid || u.email} className="hover:bg-slate-800/40 transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-xl border font-black text-xs flex items-center justify-center shrink-0 shadow-sm ${
                                    isPending 
                                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                                      : 'bg-purple-600/30 border-purple-500/40 text-purple-300'
                                  }`}>
                                    {u.name ? u.name.slice(0, 2).toUpperCase() : 'EP'}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white flex items-center gap-1.5">
                                      <span>{u.name}</span>
                                      {isRoot && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                          Root
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[11px] text-slate-500 font-mono">{u.employeeId || 'EMP-XXXX'}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <span className="font-mono text-slate-300">{u.email}</span>
                              </td>

                              <td className="px-5 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/25">
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>{u.role ? u.role.toUpperCase() : 'SUPERADMIN'}</span>
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <div className="text-slate-300 font-medium">{u.department || 'Operations'}</div>
                                <div className="text-[11px] text-slate-500">{u.galleryId || u.stateId || 'HQ Global'}</div>
                              </td>

                              <td className="px-5 py-4">
                                {isPending ? (
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                      <Clock className="w-3 h-3" />
                                      <span>Pending HR Request</span>
                                    </span>
                                    <button
                                      onClick={() => handleApproveUser(u)}
                                      className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow"
                                    >
                                      ✓ Approve
                                    </button>
                                  </div>
                                ) : isRejected ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                    <XCircle className="w-3 h-3" />
                                    <span>Rejected</span>
                                  </span>
                                ) : (
                                  <button
                                    disabled={isRoot}
                                    onClick={() => handleToggleStatus(u)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                                      isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                    } ${isRoot ? 'cursor-default' : 'cursor-pointer'}`}
                                    title={isRoot ? 'Root account always active' : 'Click to toggle status'}
                                  >
                                    {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                    <span>{isActive ? 'Active' : 'Inactive'}</span>
                                  </button>
                                )}
                              </td>

                              <td className="px-5 py-4 text-slate-400 text-[11px]">
                                {u.createdAt ? u.createdAt.slice(0, 10) : '2026-08-26'}
                              </td>

                              <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openEditModal(u)}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                                    title="Edit User Profile & Role"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {!isRoot && (
                                    <button
                                      onClick={() => handleDeleteUser(u)}
                                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                                      title="Revoke & Delete User"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <DataTable
                title="System Security & Administrative Governance Audit Log"
                headers={['Log ID', 'Actor Email / Identity', 'Event Type', 'Operation Details', 'Timestamp']}
                rows={auditLogs.map(l => [l.id, l.actor, l.event, l.details, l.timestamp])}
              />
            </div>
          )}

          {/* TAB 4: TELEMETRY & INFRASTRUCTURE */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard title="CPU Telemetry" value="12.4%" change="Optimal Load" isPositive={true} icon={Cpu} color="purple" />
                <StatCard title="Firestore Operations" value="1.42M ops/day" change="+8.5%" isPositive={true} icon={Database} color="blue" />
                <StatCard title="Server Nodes" value="8/8 Active" change="100% Uptime" isPositive={true} icon={Server} color="emerald" />
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  <span>Tenant Database Health & Security Rules</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                    <span className="font-bold text-white">Active Tenant Collection:</span>
                    <p className="font-mono text-purple-300">tenants/default/users</p>
                    <p className="text-slate-400">Strict RBAC verification enforced. HR submissions are queued in pending state until authorized by Super Admin.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                    <span className="font-bold text-white">Session Sync Engine:</span>
                    <p className="font-mono text-emerald-300">tenants/default/hr_attendance</p>
                    <p className="text-slate-400">Real-time attendance tracking with automatic break duration and idle timestamp calculations.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW STAFF USER (Exclusive to Super Admin Direct Creation) */}
      {/* ========================================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden my-8">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600" />

            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Super Admin Direct User Provisioning</h3>
                  <p className="text-xs text-slate-400">Instantly creates active credentials in Firebase Auth and Firestore</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Official Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rajesh.kumar@epay.in"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Initial Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 6 characters (e.g. Staff@2026!)"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Employee ID</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={newUserEmpId}
                    onChange={(e) => setNewUserEmpId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Assigned Platform Role *</label>
                <select
                  value={newUserRole}
                  onChange={(e) => {
                    const r = e.target.value;
                    setNewUserRole(r);
                    setNewUserDesignation(r.toUpperCase().replace(/-/g, ' '));
                  }}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                >
                  {Object.entries(ROLE_CATEGORIES).map(([cat, roles]) => (
                    <optgroup key={cat} label={cat} className="bg-slate-900 text-purple-300 font-bold">
                      {roles.map(rId => {
                        const found = ALL_ROLES.find(r => r.id === rId);
                        return (
                          <option key={rId} value={rId} className="bg-slate-800 text-white font-normal">
                            {found ? found.label : rId} ({rId})
                          </option>
                        );
                      })}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Department</label>
                  <input
                    type="text"
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Designation</label>
                  <input
                    type="text"
                    value={newUserDesignation}
                    onChange={(e) => setNewUserDesignation(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Provisioning...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Provision & Activate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT USER PROFILE & STATUS */}
      {/* ========================================================================= */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">Edit Staff User</h3>
                <p className="text-xs text-slate-400">{editingUser.name} ({editingUser.email})</p>
              </div>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Portal Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {ALL_ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.label} ({r.id})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="active">Active (Access Granted)</option>
                  <option value="pending_approval">Pending Super Admin Approval</option>
                  <option value="inactive">Inactive / Suspended</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Department</label>
                <input
                  type="text"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Designation</label>
                <input
                  type="text"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30"
                >
                  {editSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
