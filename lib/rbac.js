/**
 * Centralized RBAC (Role-Based Access Control) & Portal Navigation Engine
 */

export const ALL_ROLES = [
  { id: 'superadmin', label: 'Super Admin', color: 'bg-purple-600' },
  { id: 'admin', label: 'Admin', color: 'bg-indigo-600' },
  { id: 'ceo', label: 'CEO (Executive Command)', color: 'bg-emerald-600' },
  { id: 'cmd', label: 'CMD (Chairman & Managing Director)', color: 'bg-indigo-700' },
  { id: 'md', label: 'Managing Director', color: 'bg-indigo-600' },
  { id: 'cfo', label: 'CFO (Financial System)', color: 'bg-green-600' },
  { id: 'cgo', label: 'CGO (Gallery Network)', color: 'bg-teal-600' },
  { id: 'cmo', label: 'CMO (Marketing System)', color: 'bg-amber-600' },
  { id: 'cto', label: 'CTO (Technology Center)', color: 'bg-cyan-600' },
  { id: 'td', label: 'Technical Director', color: 'bg-purple-600' },
  { id: 'social', label: 'Gallery Social Manager', color: 'bg-indigo-600' },
  { id: 'sd', label: 'State Director', color: 'bg-sky-600' },
  { id: 'state-head', label: 'State Head Manager', color: 'bg-blue-600' },
  { id: 'crm-admin', label: 'CRM System Admin', color: 'bg-indigo-600' },
  { id: 'referral', label: 'Referral Management', color: 'bg-purple-600' },
  { id: 'assistant-manager', label: 'Assistant Manager', color: 'bg-emerald-600' },
  { id: 'bde', label: 'BDE (Business Development)', color: 'bg-teal-600' },
  { id: 'bdo', label: 'BDO (Field Operations)', color: 'bg-green-600' },
  { id: 'hr', label: 'HR Manager', color: 'bg-pink-600' },
  { id: 'finance', label: 'Finance Head', color: 'bg-emerald-600' },
  { id: 'telecalling', label: 'Telecaller', color: 'bg-blue-600' },
  { id: 'marketing', label: 'Digital Marketing', color: 'bg-amber-600' },
  { id: 'support', label: 'Tech Support', color: 'bg-teal-600' },
  { id: 'devhub', label: 'Developer', color: 'bg-cyan-600' },
  { id: 'gdm', label: 'Gallery District Manager', color: 'bg-green-600' },
  { id: 'gm', label: 'Gallery Manager', color: 'bg-emerald-600' },
  { id: 'gm-ops', label: 'General Manager (Operations)', color: 'bg-teal-600' },
  { id: 'owner', label: 'Master Portfolio Owner', color: 'bg-indigo-600' },
  { id: 'hq-head', label: 'HQ Head', color: 'bg-green-600' },
  { id: 'hq-manager', label: 'HQ Manager', color: 'bg-emerald-600' },
  { id: 'marketing-exec', label: 'Marketing Executive', color: 'bg-amber-600' },
  { id: 'franchise', label: 'Franchise Admin', color: 'bg-violet-600' },
  { id: 'customer', label: 'Customer', color: 'bg-slate-600' },
  { id: 'head-training', label: 'Head of Training & Biz Dev', color: 'bg-green-600' },
  { id: 'training-manager', label: 'Training Manager', color: 'bg-emerald-600' },
  { id: 'td-manager', label: 'Training & Dev Manager', color: 'bg-teal-600' },
  { id: 'biz-training-manager', label: 'Business Training Manager', color: 'bg-green-700' },
  { id: 'prod-training-exec', label: 'Product Training Executive', color: 'bg-cyan-600' },
  { id: 'sales-trainer', label: 'Sales Trainer', color: 'bg-purple-600' },
  { id: 'bd-trainer', label: 'Business Development Trainer', color: 'bg-indigo-600' },
  { id: 'leadership-trainer', label: 'Leadership Dev Trainer', color: 'bg-amber-600' },
  { id: 'training-coord', label: 'Training Coordinator', color: 'bg-blue-600' },
  { id: 'training-exec', label: 'Training Executive', color: 'bg-emerald-600' },
  { id: 'marketing-mgr', label: 'Marketing Manager', color: 'bg-amber-600' },
  { id: 'digital-mktg-mgr', label: 'Digital Marketing Manager', color: 'bg-amber-700' },
  { id: 'digital-mktg-exec', label: 'Digital Marketing Executive', color: 'bg-amber-500' },
  { id: 'brand-mktg-mgr', label: 'Brand Marketing Manager', color: 'bg-rose-600' },
  { id: 'mktg-coord', label: 'Marketing Coordinator', color: 'bg-pink-600' },
  { id: 'campaign-mgr', label: 'Campaign Manager', color: 'bg-purple-600' },
  { id: 'perf-mktg-exec', label: 'Performance Marketing Exec', color: 'bg-violet-600' },
  { id: 'content-mktg-exec', label: 'Content Marketing Exec', color: 'bg-sky-600' },
  { id: 'mktg-ops-exec', label: 'Marketing Operations Exec', color: 'bg-teal-600' },
  { id: 'bdm', label: 'Business Development Manager', color: 'bg-teal-600' },
  { id: 'sales-mgr', label: 'Sales Manager', color: 'bg-emerald-600' },
  { id: 'sales-exec', label: 'Sales Executive', color: 'bg-green-600' },
  { id: 'biz-growth-mgr', label: 'Business Growth Manager', color: 'bg-indigo-600' },
  { id: 'channel-dev-mgr', label: 'Channel Development Manager', color: 'bg-purple-600' },
  { id: 'franchise-dev-mgr', label: 'Franchise/Gallery Dev Manager', color: 'bg-violet-600' },
  { id: 'relationship-mgr', label: 'Relationship Manager', color: 'bg-blue-600' },
  { id: 'field-sales-exec', label: 'Field Sales Executive', color: 'bg-emerald-700' },
  { id: 'tele-sales-exec', label: 'Tele Sales Executive', color: 'bg-cyan-600' },
  { id: 'head-ops', label: 'Head of Operations', color: 'bg-emerald-800' },
  { id: 'ops-mgr', label: 'Operations Manager', color: 'bg-teal-700' },
  { id: 'asst-ops-mgr', label: 'Assistant Operations Manager', color: 'bg-teal-600' },
  { id: 'biz-ops-mgr', label: 'Business Operations Manager', color: 'bg-indigo-700' },
  { id: 'ops-exec', label: 'Operations Executive', color: 'bg-green-600' },
  { id: 'ops-coord', label: 'Operations Coordinator', color: 'bg-emerald-600' },
  { id: 'gallery-ops-mgr', label: 'Gallery Operations Manager', color: 'bg-green-700' },
  { id: 'franchise-ops-mgr', label: 'Franchise Operations Manager', color: 'bg-purple-700' },
  { id: 'regional-ops-mgr', label: 'Regional Operations Manager', color: 'bg-sky-700' },
  { id: 'area-ops-mgr', label: 'Area Operations Manager', color: 'bg-blue-700' },
  { id: 'cust-ops-exec', label: 'Customer Operations Executive', color: 'bg-cyan-700' },
  { id: 'service-ops-exec', label: 'Service Operations Executive', color: 'bg-[#10b981]' },
  { id: 'quality-exec', label: 'Process & Quality Executive', color: 'bg-emerald-600' },
  { id: 'mis-ops-exec', label: 'MIS & Operations Executive', color: 'bg-teal-600' },
  { id: 'doc-exec', label: 'Documentation Executive', color: 'bg-slate-600' },
  { id: 'kyc-exec', label: 'KYC & Verification Executive', color: 'bg-indigo-600' },
  { id: 'inventory-ops-exec', label: 'Inventory Operations Executive', color: 'bg-amber-600' },
  { id: 'asset-mgmt-exec', label: 'Asset Management Executive', color: 'bg-purple-600' },
  { id: 'complaint-exec', label: 'Complaint & Escalation Executive', color: 'bg-rose-600' }
];

/**
 * Returns clean, organized, role-relevant navigation links
 */
export function getNavItemsForRole(userRole) {
  if (!userRole) return [{ id: 'dashboard', label: 'Main Portal', path: '/', icon: 'LayoutDashboard' }];

  const cleanRole = userRole.toLowerCase().trim();

  // 1. Super Admin Navigation (Organized Governance Modules)
  if (cleanRole === 'superadmin' || cleanRole === 'super-admin') {
    return [
      { id: 'superadmin', label: 'Super Admin Console', path: '/superadmin', icon: 'Crown' },
      { id: 'admin', label: 'Admin Control Panel', path: '/admin', icon: 'ShieldCheck' },
      { id: 'ceo', label: 'Executive Command', path: '/ceo', icon: 'Activity' },
      { id: 'cfo', label: 'Finance & Billing', path: '/cfo', icon: 'DollarSign' },
      { id: 'hr', label: 'HR & Personnel', path: '/hr', icon: 'Users' },
      { id: 'devhub', label: 'Developer System Hub', path: '/devhub', icon: 'Code' },
      { id: 'main', label: 'Public Portal Hub', path: '/', icon: 'Globe' }
    ];
  }

  // 2. Admin & System Operations
  if (cleanRole === 'admin' || cleanRole === 'crm-admin' || cleanRole === 'assistant-manager') {
    return [
      { id: 'admin', label: 'Admin Dashboard', path: '/admin', icon: 'ShieldCheck' },
      { id: 'hr', label: 'HR Operations', path: '/hr', icon: 'Users' },
      { id: 'finance', label: 'Finance & Invoicing', path: '/finance', icon: 'DollarSign' },
      { id: 'main', label: 'Public Portal', path: '/', icon: 'Globe' }
    ];
  }

  // 3. C-Suite & Executive Leadership
  if (['ceo', 'md', 'owner', 'cmd'].includes(cleanRole)) {
    return [
      { id: 'exec', label: 'Executive Dashboard', path: `/${cleanRole}`, icon: 'Crown' },
      { id: 'cfo', label: 'Financial Overview', path: '/cfo', icon: 'DollarSign' },
      { id: 'admin', label: 'Operations Command', path: '/admin', icon: 'ShieldCheck' },
      { id: 'hr', label: 'Headcount & HR', path: '/hr', icon: 'Users' },
      { id: 'main', label: 'Public Portal', path: '/', icon: 'Globe' }
    ];
  }

  // 4. Finance Leadership
  if (['cfo', 'finance', 'accountant'].includes(cleanRole)) {
    return [
      { id: 'finance-dash', label: 'Financial System', path: cleanRole === 'accountant' ? '/accountant' : `/${cleanRole}`, icon: 'DollarSign' },
      { id: 'billing', label: 'Billing & Ledgers', path: '/finance', icon: 'DollarSign' },
      { id: 'hr', label: 'Payroll & HR', path: '/hr', icon: 'Users' }
    ];
  }

  // 5. HR Leadership
  if (['hr', 'head-training', 'training-manager'].includes(cleanRole)) {
    return [
      { id: 'hr-dash', label: 'HR & People Operations', path: `/${cleanRole}`, icon: 'Users' },
      { id: 'training', label: 'Training Center', path: '/head-training', icon: 'GraduationCap' },
      { id: 'career', label: 'Career & Talent', path: '/career-hub', icon: 'Briefcase' }
    ];
  }

  // 6. Sales, Business Development & Field Ops
  if (['sales-exec', 'sales-mgr', 'bdm', 'bde', 'bdo', 'field-sales-exec', 'tele-sales-exec', 'telecalling', 'biz-growth-mgr', 'channel-dev-mgr', 'franchise-dev-mgr', 'relationship-mgr'].includes(cleanRole)) {
    return [
      { id: 'sales-dash', label: 'My Sales Dashboard', path: `/${cleanRole}`, icon: 'TrendingUp' },
      { id: 'telecalling', label: 'Telecalling Leads', path: '/telecalling', icon: 'PhoneCall' },
      { id: 'franchise', label: 'Franchise Network', path: '/franchise', icon: 'Building' }
    ];
  }

  // 7. Marketing Team
  if (['cmo', 'marketing', 'marketing-mgr', 'digital-mktg-mgr', 'digital-mktg-exec', 'brand-mktg-mgr', 'mktg-coord', 'campaign-mgr', 'perf-mktg-exec', 'content-mktg-exec', 'mktg-ops-exec', 'marketing-exec', 'social'].includes(cleanRole)) {
    return [
      { id: 'mktg-dash', label: 'Marketing Workspace', path: `/${cleanRole}`, icon: 'Megaphone' },
      { id: 'social', label: 'Social & Brand Ops', path: '/social', icon: 'Share2' },
      { id: 'campaigns', label: 'Campaign Manager', path: '/campaign-mgr', icon: 'Activity' }
    ];
  }

  // 8. Operations & Regional Management
  if (['head-ops', 'ops-mgr', 'asst-ops-mgr', 'biz-ops-mgr', 'ops-exec', 'ops-coord', 'gallery-ops-mgr', 'franchise-ops-mgr', 'regional-ops-mgr', 'area-ops-mgr', 'sd', 'state-head', 'gdm', 'gm', 'gm-ops', 'hq-head', 'hq-manager', 'cust-ops-exec', 'service-ops-exec', 'quality-exec', 'mis-ops-exec', 'doc-exec', 'kyc-exec', 'inventory-ops-exec', 'asset-mgmt-exec', 'complaint-exec'].includes(cleanRole)) {
    return [
      { id: 'ops-dash', label: 'Operations Command', path: `/${cleanRole}`, icon: 'Building' },
      { id: 'gallery-ops', label: 'Gallery Network', path: '/gallery-ops-mgr', icon: 'Store' },
      { id: 'hr-check', label: 'Attendance & Staff', path: '/hr', icon: 'Users' }
    ];
  }

  // 9. Technical & Support Portals
  if (['support', 'devhub', 'cto', 'td'].includes(cleanRole)) {
    return [
      { id: 'tech-dash', label: 'Technical Workspace', path: `/${cleanRole}`, icon: 'Code' },
      { id: 'support', label: 'Helpdesk & Tickets', path: '/support', icon: 'Headphones' },
      { id: 'ai', label: 'AI Intelligence', path: '/ai-assistant', icon: 'Sparkles' }
    ];
  }

  // Default fallback for any other role
  return [
    { id: 'my-dashboard', label: 'Role Dashboard', path: `/${cleanRole}`, icon: 'LayoutDashboard' },
    { id: 'main', label: 'Public Portal', path: '/', icon: 'Globe' }
  ];
}

export const SCOPE_LEVELS = {
  GLOBAL: 'GLOBAL',
  STATE: 'STATE',
  DISTRICT: 'DISTRICT',
  GALLERY: 'GALLERY',
  SELF: 'SELF'
};

export function hasPermission(userPermissions, permissionKey) {
  if (!userPermissions) return false;
  if (userPermissions['*'] || userPermissions['all'] || userPermissions['superadmin']) return true;
  return !!userPermissions[permissionKey];
}

export const ROLE_REDIRECTS = {
  // Top Management
  'super-admin': '/superadmin',
  'superadmin': '/superadmin',
  'ceo': '/ceo',
  'cmd': '/cmd',
  'cfo': '/cfo',
  'cto': '/cto',
  'cmo': '/cmo',
  'cgo': '/cgo',
  'md': '/md',
  'td': '/td',

  // Admin & Operations
  'admin': '/admin',
  'crm-admin': '/crm-admin',
  'crmadmin': '/crm-admin',
  'franchise-admin': '/franchise',
  'franchise': '/franchise',
  'general-manager': '/gm',
  'generalmanager': '/gm',
  'gm': '/gm',
  'gm-ops': '/gm-ops',
  'operations-manager': '/ops-mgr',
  'ops-mgr': '/ops-mgr',
  'asst-ops-mgr': '/asst-ops-mgr',
  'ops-exec': '/ops-exec',
  'ops-coord': '/ops-coord',
  'assistant-manager': '/assistant-manager',
  'head-ops': '/head-ops',

  // Gallery & Regional
  'gallery-owner': '/owner',
  'owner': '/owner',
  'gallery-manager': '/gallery-ops-mgr',
  'gallery-ops-mgr': '/gallery-ops-mgr',
  'franchise-ops-mgr': '/franchise-ops-mgr',
  'regional-ops-mgr': '/regional-ops-mgr',
  'area-ops-mgr': '/area-ops-mgr',
  'state-director': '/sd',
  'sd': '/sd',
  'state-head': '/state-head',
  'gdm': '/gdm',
  'hq-head': '/hq-head',
  'hq-manager': '/hq-manager',
  'social': '/social',

  // Sales & Business
  'bde': '/bde',
  'bdo': '/bdo',
  'bdm': '/bdm',
  'sales-mgr': '/sales-mgr',
  'sales-exec': '/sales-exec',
  'telecaller': '/telecalling',
  'telecalling': '/telecalling',
  'tele-sales-exec': '/tele-sales-exec',
  'field-sales-exec': '/field-sales-exec',
  'biz-growth-mgr': '/biz-growth-mgr',
  'channel-dev-mgr': '/channel-dev-mgr',
  'franchise-dev-mgr': '/franchise-dev-mgr',
  'relationship-mgr': '/relationship-mgr',

  // Training & Development
  'head-training': '/head-training',
  'training-manager': '/training-manager',
  'td-manager': '/td-manager',
  'biz-training-manager': '/biz-training-manager',
  'prod-training-exec': '/prod-training-exec',
  'sales-trainer': '/sales-trainer',
  'bd-trainer': '/bd-trainer',
  'leadership-trainer': '/leadership-trainer',
  'training-coord': '/training-coord',
  'training-exec': '/training-exec',

  // Marketing
  'marketing': '/marketing',
  'marketing-mgr': '/marketing-mgr',
  'marketing-exec': '/marketing-exec',
  'digital-mktg-mgr': '/digital-mktg-mgr',
  'digital-mktg-exec': '/digital-mktg-exec',
  'brand-mktg-mgr': '/brand-mktg-mgr',
  'mktg-coord': '/mktg-coord',
  'campaign-mgr': '/campaign-mgr',
  'perf-mktg-exec': '/perf-mktg-exec',
  'content-mktg-exec': '/content-mktg-exec',
  'mktg-ops-exec': '/mktg-ops-exec',

  // Operations Executive roles
  'cust-ops-exec': '/cust-ops-exec',
  'service-ops-exec': '/service-ops-exec',
  'quality-exec': '/quality-exec',
  'mis-ops-exec': '/mis-ops-exec',
  'doc-exec': '/doc-exec',
  'kyc-exec': '/kyc-exec',
  'inventory-ops-exec': '/inventory-ops-exec',
  'asset-mgmt-exec': '/asset-mgmt-exec',
  'complaint-exec': '/complaint-exec',

  // Finance & HR
  'finance': '/finance',
  'finance-head': '/finance',
  'accountant': '/accountant',
  'hr': '/hr',
  'referral': '/referral',

  // Services & Portals
  'support': '/support',
  'customer': '/customer',
  'commerce': '/commerce',
  'devhub': '/devhub',
  'developer': '/devhub',
  'startup': '/business-startup',
  'career': '/career-hub',
  'ai-assistant': '/ai-assistant',

  // Default
  'guest': '/'
};
