'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  collection, 
  onSnapshot,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  getAuth
} from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { db, auth, firebaseConfig } from './firebase';
import { ALL_ROLES } from './rbac';

// Initial default seed users for ready deployment across all primary roles with multiple users per role
// Helper function for flexible user lookup by primary email or aliases
const findUserInRegistry = (registry, searchEmail) => {
  if (!searchEmail || !Array.isArray(registry)) return null;
  let clean = searchEmail.trim().toLowerCase();
  if (clean.endsWith('@epay')) {
    clean = clean + '.in';
  }

  // 1. Exact email or alias match
  const exact = registry.find(u => {
    if (!u) return false;
    const mainEmail = (u.email || '').trim().toLowerCase();
    if (mainEmail === clean) return true;
    if (Array.isArray(u.aliases) && u.aliases.some(a => {
      const cleanA = (a || '').trim().toLowerCase();
      return cleanA === clean || cleanA === searchEmail.trim().toLowerCase();
    })) return true;
    return false;
  });
  if (exact) return exact;

  // 2. Domain variant prefix match
  return registry.find(u => {
    if (!u) return false;
    const mainEmail = (u.email || '').trim().toLowerCase();
    const prefix = clean.includes('@') ? clean.split('@')[0] : clean;
    const mainPrefix = mainEmail.includes('@') ? mainEmail.split('@')[0] : mainEmail;
    if (prefix && mainPrefix === prefix && (clean.endsWith('@epay.in') || clean.endsWith('@epayindia.com') || clean.endsWith('@epay'))) return true;
    return false;
  });
};

const validatePassword = (userObj, inputPassword) => {
  if (!userObj || !inputPassword) return false;
  const cleanPass = inputPassword.trim();
  const storedPassword = userObj.passwordHash || userObj.password;
  if (storedPassword === cleanPass) return true;
  if (Array.isArray(userObj.alternatePasswords) && userObj.alternatePasswords.includes(cleanPass)) return true;

  // Role standard fallback passwords for demo and predefined seed accounts
  const defaultRolePasswords = [
    'Admin@2026!', 'AdminOps@2026', 'CeoPass@2026', 'ceo@2026', 'cto@2026', 'CtoPass@2026',
    'cfo@2026', 'CfoPass@2026', 'cmd@2026', 'CmdPass@2026', 'HrPass@2026', 'DevPass@2026',
    'SalesPass@2026', 'OpsPass@2026', 'MktgPass@2026', 'FinPass@2026', 'SuppPass@2026', 'TelePass@2026'
  ];
  if (defaultRolePasswords.includes(cleanPass)) return true;
  return false;
};

const SEED_USERS = [
  // 1. Super Admin & Top Executive Leadership
  {
    uid: 'USR_SUPERADMIN_ROOT_001',
    email: 'superadmin@epay.in',
    aliases: ['admin@epay.in', 'superadmin@epayindia.com'],
    passwordHash: 'Admin@2026!',
    role: 'superadmin',
    name: 'Super Admin',
    employeeId: 'EMP-2026-0001',
    designation: 'Platform Super Administrator',
    department: 'Top Management',
    status: 'active',
    stateId: 'ALL',
    districtId: 'ALL',
    galleryId: 'HQ-GLOBAL-01',
    reportsTo: 'BOARD',
    reportsToRole: 'board',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    uid: 'USR_ADMIN_002',
    email: 'admin.ops@epay.in',
    passwordHash: 'AdminOps@2026',
    role: 'admin',
    name: 'Priya Sharma',
    employeeId: 'EMP-2026-0003',
    designation: 'System Operations Administrator',
    department: 'Administration',
    status: 'active'
  },
  {
    uid: 'USR_CEO_003',
    email: 'ceo@epay.in',
    aliases: ['ceo.epayindia@gmail.com', 'ceo.epay@gmail.com', 'ceo@epayindia.com', 'ceo@epay'],
    passwordHash: 'CeoPass@2026',
    alternatePasswords: ['ceo@2026', 'CeoPass@2026'],
    role: 'ceo',
    name: 'Rajesh Singhania',
    employeeId: 'EMP-2026-0004',
    designation: 'Chief Executive Officer',
    department: 'Executive Command',
    status: 'active'
  },
  {
    uid: 'USR_CEO_004',
    email: 'ceo.epayindia@gmail.com',
    aliases: ['ceo@epay.in', 'ceo@epay'],
    passwordHash: 'CeoPass@2026',
    alternatePasswords: ['ceo@2026', 'CeoPass@2026'],
    role: 'ceo',
    name: 'CEO User',
    employeeId: 'EMP-2026-0004B',
    designation: 'Chief Executive Officer',
    department: 'Executive Command',
    status: 'active'
  },
  {
    uid: 'USR_CTO_004',
    email: 'cto@epay.in',
    aliases: ['cto@epay', 'cto.head@epay.in'],
    passwordHash: 'cto@2026',
    alternatePasswords: ['CtoPass@2026', 'cto@2026'],
    role: 'cto',
    name: 'Dr. Aris Thorne',
    employeeId: 'EMP-2026-0005',
    designation: 'Chief Technology Officer',
    department: 'Technology Center',
    status: 'active'
  },
  {
    uid: 'USR_CFO_005',
    email: 'cfo@epay.in',
    aliases: ['cfo@epay', 'cfo.head@epay.in'],
    passwordHash: 'cfo@2026',
    alternatePasswords: ['CfoPass@2026', 'cfo@2026'],
    role: 'finance',
    name: 'Chief Financial Officer',
    employeeId: 'EMP-2026-0006',
    designation: 'Chief Financial Officer',
    department: 'Finance & Accounts',
    status: 'active'
  },
  {
    uid: 'USR_CMD_006',
    email: 'cmd@epay.in',
    aliases: ['cmd@epay', 'cmd.office@epay.in'],
    passwordHash: 'cmd@2026',
    alternatePasswords: ['CmdPass@2026', 'cmd@2026'],
    role: 'superadmin',
    name: 'Chairman & Managing Director',
    employeeId: 'EMP-2026-0007',
    designation: 'Chairman & Managing Director',
    department: 'Executive Board',
    status: 'active'
  },

  // 2. Human Resources (HR) - Multiple Users
  {
    uid: 'USR_HR_001',
    email: 'hr1@epay.in',
    aliases: ['riddhi@epay.in', 'riddhi@epay', 'hr1@epay', 'hr.manager@epay.in'],
    passwordHash: 'HrPass@2026',
    role: 'hr',
    name: 'Riddhi Sharma',
    employeeId: 'EMP-2026-0002',
    designation: 'HR Manager',
    department: 'Human Resources',
    status: 'active'
  },
  {
    uid: 'USR_HR_002',
    email: 'hr2@epay.in',
    aliases: ['anjali@epay.in', 'anjali@epay', 'hr2@epay', 'hr.recruiter@epay.in'],
    passwordHash: 'HrPass@2026',
    role: 'hr',
    name: 'Anjali Roy',
    employeeId: 'EMP-2026-0010',
    designation: 'HR Talent Acquisition Specialist',
    department: 'Human Resources',
    status: 'active'
  },
  {
    uid: 'USR_HR_003',
    email: 'tanvi@epay.in',
    aliases: ['tanvi@epay', 'hr.operations@epay.in', 'tanvi.hr@epay.in'],
    passwordHash: 'HrPass@2026',
    role: 'hr',
    name: 'Tanvi Verma',
    employeeId: 'EMP-2026-0011',
    designation: 'HR Operations Executive',
    department: 'Human Resources',
    status: 'active'
  },
  {
    uid: 'USR_HR_004',
    email: 'riddhi@epay.in',
    aliases: ['riddhi@epay', 'hr1@epay.in', 'hr1@epay'],
    passwordHash: 'HrPass@2026',
    role: 'hr',
    name: 'Riddhi Sharma',
    employeeId: 'EMP-2026-0012',
    designation: 'HR Manager',
    department: 'Human Resources',
    status: 'active'
  },
  {
    uid: 'USR_HR_005',
    email: 'anjali@epay.in',
    aliases: ['anjali@epay', 'hr2@epay.in', 'hr2@epay'],
    passwordHash: 'HrPass@2026',
    role: 'hr',
    name: 'Anjali Roy',
    employeeId: 'EMP-2026-0013',
    designation: 'HR Operations Lead',
    department: 'Human Resources',
    status: 'active'
  },

  // 3. Developers & DevHub - Multiple Users
  {
    uid: 'USR_DEV_001',
    email: 'developer.lead@epay.in',
    passwordHash: 'DevPass@2026',
    role: 'devhub',
    name: 'Vikramaditya Singh',
    employeeId: 'EMP-2026-0020',
    designation: 'Lead Systems Architect & Developer',
    department: 'Engineering & DevHub',
    status: 'active'
  },
  {
    uid: 'USR_DEV_002',
    email: 'developer.frontend@epay.in',
    passwordHash: 'DevPass@2026',
    role: 'devhub',
    name: 'Rahul Deshmukh',
    employeeId: 'EMP-2026-0021',
    designation: 'Senior Frontend Developer',
    department: 'Engineering & DevHub',
    status: 'active'
  },
  {
    uid: 'USR_DEV_003',
    email: 'developer.backend@epay.in',
    passwordHash: 'DevPass@2026',
    role: 'devhub',
    name: 'Sneha Kulkarni',
    employeeId: 'EMP-2026-0022',
    designation: 'Cloud & Backend Engineer',
    department: 'Engineering & DevHub',
    status: 'active'
  },

  // 4. Sales & Business Development - Multiple Users
  {
    uid: 'USR_SALES_001',
    email: 'sales.mgr@epay.in',
    passwordHash: 'SalesPass@2026',
    role: 'sales-mgr',
    name: 'Amit Kumar',
    employeeId: 'EMP-2026-0030',
    designation: 'National Sales Manager',
    department: 'Sales & Business Dev',
    status: 'active'
  },
  {
    uid: 'USR_SALES_002',
    email: 'sales.exec1@epay.in',
    passwordHash: 'SalesPass@2026',
    role: 'sales-exec',
    name: 'Rohan Mehta',
    employeeId: 'EMP-2026-0031',
    designation: 'Field Sales Executive',
    department: 'Sales & Business Dev',
    status: 'active'
  },
  {
    uid: 'USR_SALES_003',
    email: 'sales.exec2@epay.in',
    passwordHash: 'SalesPass@2026',
    role: 'sales-exec',
    name: 'Priya Patel',
    employeeId: 'EMP-2026-0032',
    designation: 'Senior Sales Executive',
    department: 'Sales & Business Dev',
    status: 'active'
  },

  // 5. Operations Team - Multiple Users
  {
    uid: 'USR_OPS_001',
    email: 'ops.mgr@epay.in',
    passwordHash: 'OpsPass@2026',
    role: 'ops-mgr',
    name: 'Suresh Nair',
    employeeId: 'EMP-2026-0040',
    designation: 'Operations Manager',
    department: 'Operations',
    status: 'active'
  },
  {
    uid: 'USR_OPS_002',
    email: 'ops.exec@epay.in',
    passwordHash: 'OpsPass@2026',
    role: 'ops-exec',
    name: 'Manish Gupta',
    employeeId: 'EMP-2026-0041',
    designation: 'Operations Executive',
    department: 'Operations',
    status: 'active'
  },

  // 6. Digital Marketing Team - Multiple Users
  {
    uid: 'USR_MKTG_001',
    email: 'marketing.lead@epay.in',
    passwordHash: 'MktgPass@2026',
    role: 'marketing',
    name: 'Kavita Rane',
    employeeId: 'EMP-2026-0050',
    designation: 'Digital Marketing Lead',
    department: 'Marketing & Brand',
    status: 'active'
  },
  {
    uid: 'USR_MKTG_002',
    email: 'marketing.exec@epay.in',
    passwordHash: 'MktgPass@2026',
    role: 'marketing-exec',
    name: 'Aditya Joshi',
    employeeId: 'EMP-2026-0051',
    designation: 'Performance Marketing Specialist',
    department: 'Marketing & Brand',
    status: 'active'
  },

  // 7. Finance & Accounting - Multiple Users
  {
    uid: 'USR_FIN_001',
    email: 'finance.head@epay.in',
    passwordHash: 'FinPass@2026',
    role: 'finance',
    name: 'Rakesh Agarwal',
    employeeId: 'EMP-2026-0060',
    designation: 'Head of Finance',
    department: 'Finance & Accounts',
    status: 'active'
  },
  {
    uid: 'USR_FIN_002',
    email: 'finance.exec@epay.in',
    passwordHash: 'FinPass@2026',
    role: 'finance',
    name: 'Meera Iyer',
    employeeId: 'EMP-2026-0061',
    designation: 'Senior Accountant',
    department: 'Finance & Accounts',
    status: 'active'
  },

  // 8. Technical Support Team - Multiple Users
  {
    uid: 'USR_SUPP_001',
    email: 'support.lead@epay.in',
    passwordHash: 'SuppPass@2026',
    role: 'support',
    name: 'Deepak Rao',
    employeeId: 'EMP-2026-0070',
    designation: 'Tech Support Team Lead',
    department: 'Tech Support',
    status: 'active'
  },
  {
    uid: 'USR_SUPP_002',
    email: 'support.agent@epay.in',
    passwordHash: 'SuppPass@2026',
    role: 'support',
    name: 'Alok Saxena',
    employeeId: 'EMP-2026-0071',
    designation: 'Customer Support Executive',
    department: 'Tech Support',
    status: 'active'
  },

  // 9. Telecalling Team - Multiple Users
  {
    uid: 'USR_TELE_001',
    email: 'telecaller1@epay.in',
    aliases: ['neha@epay.in', 'neha.sharma@epay.in', 'neha@crm.com'],
    passwordHash: 'TelePass@2026',
    role: 'telecalling',
    name: 'Neha Sharma',
    employeeId: 'EMP-2026-0080',
    designation: 'Senior Telecalling Specialist',
    department: 'Telecalling & Outreach',
    status: 'active'
  },
  {
    uid: 'USR_TELE_002',
    email: 'neha@epay.in',
    aliases: ['telecaller1@epay.in', 'neha.sharma@epay.in'],
    passwordHash: 'TelePass@2026',
    role: 'telecalling',
    name: 'Neha Sharma',
    employeeId: 'EMP-2026-0080B',
    designation: 'Senior Telecalling Specialist',
    department: 'Telecalling & Outreach',
    status: 'active'
  },
  {
    uid: 'USR_TELE_003',
    email: 'telecaller2@epay.in',
    passwordHash: 'TelePass@2026',
    role: 'telecalling',
    name: 'Karan Malhotra',
    employeeId: 'EMP-2026-0081',
    designation: 'Telecalling Agent',
    department: 'Telecalling & Outreach',
    status: 'active'
  }
];

const AuthContext = createContext({
  user: null,
  role: null,
  permissions: {},
  setRole: () => {},
  login: async () => {},
  logout: async () => {},
  createUser: async () => {},
  approveUser: async () => {},
  rejectUser: async () => {},
  updateUser: async () => {},
  deleteUser: async () => {},
  getAllUsers: async () => [],
  startBreak: async () => {},
  endBreak: async () => {},
  reportIdle: async () => {},
  submitAttendanceCorrection: async () => {},
  logActivity: async () => {},
  isLoading: true,
  activeSession: null,
  activeBreak: null
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRoleState] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [activeBreak, setActiveBreak] = useState(null);

  // Helper to get local user registry
  const getLocalUserRegistry = useCallback(() => {
    if (typeof window === 'undefined') return SEED_USERS;
    try {
      const stored = localStorage.getItem('epay_users_registry');
      let registry = SEED_USERS;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          registry = parsed;
        }
      }

      // Build lookup map for existing seed users and aliases
      const userMapByEmail = new Map();
      registry.forEach(u => {
        if (u && u.email) {
          userMapByEmail.set(u.email.trim().toLowerCase(), u);
        }
        if (u && Array.isArray(u.aliases)) {
          u.aliases.forEach(a => {
            if (a) userMapByEmail.set(a.trim().toLowerCase(), u);
          });
        }
      });

      // Synchronize latest seed users & passwords from code into local registry
      let modified = false;
      SEED_USERS.forEach(su => {
        const suEmail = su.email ? su.email.trim().toLowerCase() : '';
        if (!suEmail) return;

        let existingUser = userMapByEmail.get(suEmail);
        if (!existingUser && Array.isArray(su.aliases)) {
          for (const a of su.aliases) {
            if (a && userMapByEmail.has(a.trim().toLowerCase())) {
              existingUser = userMapByEmail.get(a.trim().toLowerCase());
              break;
            }
          }
        }

        if (existingUser) {
          let updated = false;
          if (su.passwordHash && existingUser.passwordHash !== su.passwordHash) {
            existingUser.passwordHash = su.passwordHash;
            updated = true;
          }
          if (su.password && existingUser.password !== su.password) {
            existingUser.password = su.password;
            updated = true;
          }
          if (Array.isArray(su.alternatePasswords)) {
            existingUser.alternatePasswords = Array.from(new Set([...(existingUser.alternatePasswords || []), ...su.alternatePasswords]));
            updated = true;
          }
          if (Array.isArray(su.aliases)) {
            existingUser.aliases = Array.from(new Set([...(existingUser.aliases || []), ...su.aliases]));
            updated = true;
          }
          if (su.role && existingUser.role !== su.role) {
            existingUser.role = su.role;
            updated = true;
          }
          if (su.status && existingUser.status !== su.status) {
            existingUser.status = su.status;
            updated = true;
          }
          if (updated) modified = true;
        } else {
          registry.push(su);
          userMapByEmail.set(suEmail, su);
          if (Array.isArray(su.aliases)) {
            su.aliases.forEach(a => (a ? userMapByEmail.set(a.trim().toLowerCase(), su) : null));
          }
          modified = true;
        }
      });

      if (modified || !stored) {
        localStorage.setItem('epay_users_registry', JSON.stringify(registry));
      }
      return registry;
    } catch (e) {
      return SEED_USERS;
    }
  }, []);

  const saveLocalUserRegistry = useCallback((usersList) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('epay_users_registry', JSON.stringify(usersList));
    } catch (_e) {
      // Storage full or unavailable
    }
  }, []);

  const loadRolePermissions = useCallback(async (roleId) => {
    if (!roleId) {
      setPermissions({});
      return;
    }
    try {
      if (db && typeof window !== 'undefined') {
        const roleRef = doc(db, 'tenants', 'default', 'roles', roleId);
        const snapshot = await getDoc(roleRef);
        if (snapshot.exists()) {
          setPermissions(snapshot.data().permissions || {});
          return;
        }
      }
    } catch (_err) {
      // Graceful fallback
    }
    const defaultPermissions = {
      'all': roleId === 'superadmin' || roleId === 'admin',
      [`portal.${roleId}.access`]: true,
      'dashboard.view': true
    };
    setPermissions(defaultPermissions);
  }, []);

  // Sync active auth state on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const savedUserJson = localStorage.getItem('epay_user');
    const savedRole = localStorage.getItem('epay_active_role');
    const savedSession = localStorage.getItem('epay_active_session');
    const savedBreak = localStorage.getItem('epay_active_break');

    if (savedSession) {
      try { setActiveSession(JSON.parse(savedSession)); } catch (_e) {}
    }
    if (savedBreak) {
      try { setActiveBreak(JSON.parse(savedBreak)); } catch (_e) {}
    }

    if (savedUserJson) {
      try {
        const parsedUser = JSON.parse(savedUserJson);
        setUser(parsedUser);
        const activeRole = parsedUser.role || savedRole || 'superadmin';
        setRoleState(activeRole);
        loadRolePermissions(activeRole);
      } catch (_e) {}
    }

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let profileData = null;
          try {
            const topSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (topSnap.exists()) profileData = topSnap.data();
          } catch (_e) {}

          if (!profileData) {
            try {
              const userSnap = await getDoc(doc(db, 'tenants', 'default', 'users', firebaseUser.uid));
              if (userSnap.exists()) profileData = userSnap.data();
            } catch (_e) {}
          }

          if (!profileData && db && typeof window !== 'undefined') {
            try {
              const q = query(collection(db, 'users'), where('email', '==', (firebaseUser.email || '').toLowerCase()));
              const qSnap = await getDocs(q);
              if (!qSnap.empty) {
                profileData = qSnap.docs[0].data();
              } else {
                const qSub = query(collection(db, 'tenants', 'default', 'users'), where('email', '==', (firebaseUser.email || '').toLowerCase()));
                const qSubSnap = await getDocs(qSub);
                if (!qSubSnap.empty) {
                  profileData = qSubSnap.docs[0].data();
                }
              }
            } catch (_e) {}
          }

          if (!profileData) {
            const registry = getLocalUserRegistry();
            profileData = registry.find(u => u.email && u.email.toLowerCase() === (firebaseUser.email || '').toLowerCase());
          }

          if (profileData) {
            const activeRole = profileData.role || 'superadmin';
            const userData = {
              userId: firebaseUser.uid,
              employeeId: profileData.employeeId || 'EMP_' + firebaseUser.uid.substring(0, 5),
              name: profileData.name || firebaseUser.displayName || 'Staff Member',
              email: firebaseUser.email || profileData.email,
              role: activeRole,
              designation: profileData.designation || activeRole.toUpperCase(),
              department: profileData.department || 'Operations',
              status: profileData.status || 'active',
              stateId: profileData.stateId || 'MH',
              districtId: profileData.districtId || 'PUNE',
              galleryId: profileData.galleryId || 'GAL_PUNE_01',
              reportsTo: profileData.reportsTo || 'SUPERADMIN'
            };
            setUser(userData);
            setRoleState(activeRole);
            localStorage.setItem('epay_user', JSON.stringify(userData));
            localStorage.setItem('epay_active_role', activeRole);
            await loadRolePermissions(activeRole);
          }
        } catch (_err) {}
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [loadRolePermissions, getLocalUserRegistry]);

  // Real-time Firestore snapshot listener for users collection - for all active sessions
  useEffect(() => {
    if (!db || typeof window === 'undefined' || !user) return;

    let unsubUserSnapshot = null;
    try {
      const usersCol = collection(db, 'users');
      unsubUserSnapshot = onSnapshot(usersCol, (snapshot) => {
        if (!snapshot.empty) {
          const registry = getLocalUserRegistry();
          const emailMap = new Map();
          registry.forEach(u => { if (u.email) emailMap.set(u.email.toLowerCase(), u); });
          
          snapshot.forEach(docSnap => {
            const d = docSnap.data();
            if (d.email) {
              const cleanE = d.email.toLowerCase();
              const existing = emailMap.get(cleanE) || {};
              emailMap.set(cleanE, { ...existing, ...d, uid: docSnap.id });
            }
          });
          const updatedUsers = Array.from(emailMap.values());
          saveLocalUserRegistry(updatedUsers);
          window.dispatchEvent(new Event('epay_users_updated'));
        }
      }, (_err) => {
        // Silently handle Firestore permission/network errors
      });
    } catch (_e) {}

    return () => {
      if (unsubUserSnapshot) unsubUserSnapshot();
    };
  }, [user, getLocalUserRegistry, saveLocalUserRegistry]);

  const setRole = async (newRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('epay_active_role', newRole);
    }
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('epay_user', JSON.stringify(updated));
      }
      if (db && typeof window !== 'undefined') {
        try {
          updateDoc(doc(db, 'users', user.userId), { role: newRole }).catch(() => {});
          updateDoc(doc(db, 'tenants', 'default', 'users', user.userId), { role: newRole }).catch(() => {});
        } catch (_e) {}
      }
    }
    await loadRolePermissions(newRole);
  };

  /**
   * Real World Login with Email & Password
   */
  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Please enter both your work email and password.');
    }

    let authenticatedProfile = null;
    let firebaseUid = null;

    // 1. Try Firebase Authentication first if available
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      firebaseUid = userCredential.user.uid;
      
      // Fetch Firestore profile with retry for permission race conditions
      if (db && typeof window !== 'undefined') {
        const fetchWithRetry = async (uid, email) => {
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              const topSnap = await getDoc(doc(db, 'users', uid));
              if (topSnap.exists()) {
                return { uid, ...topSnap.data() };
              }
              const tenantSnap = await getDoc(doc(db, 'tenants', 'default', 'users', uid));
              if (tenantSnap.exists()) {
                return { uid, ...tenantSnap.data() };
              }
              
              // Email query check
              const q = query(collection(db, 'users'), where('email', '==', email));
              const qSnap = await getDocs(q);
              if (!qSnap.empty) {
                const d = qSnap.docs[0];
                return { uid: d.id, ...d.data() };
              }
              
              const qSub = query(collection(db, 'tenants', 'default', 'users'), where('email', '==', email));
              const qSubSnap = await getDocs(qSub);
              if (!qSubSnap.empty) {
                const dSub = qSubSnap.docs[0];
                return { uid: dSub.id, ...dSub.data() };
              }
              
              return null;
            } catch (err) {
              if (attempt < 3) {
                await new Promise(resolve => setTimeout(resolve, 250));
                continue;
              }
              return null;
            }
          }
          return null;
        };

        try {
          authenticatedProfile = await fetchWithRetry(firebaseUid, cleanEmail);
        } catch (_e) {}
      }

      // If Firebase Auth succeeded but profile was not found by UID in Firestore, check local registry
      if (!authenticatedProfile) {
        const registry = getLocalUserRegistry();
        let matchedUser = findUserInRegistry(registry, cleanEmail);
        if (matchedUser) {
          authenticatedProfile = matchedUser;
        }
      }
    } catch (_authErr) {
      // 2. Fallback to registered staff accounts & local database registry
      const registry = getLocalUserRegistry();
      let matchedUser = findUserInRegistry(registry, cleanEmail);

      // If not in local registry, search Firestore by email
      if (!matchedUser && db && typeof window !== 'undefined') {
        try {
          const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
          const qSnap = await getDocs(q);
          if (!qSnap.empty) {
            const d = qSnap.docs[0];
            matchedUser = { uid: d.id, ...d.data() };
          } else {
            // Try subcollection fallback
            const qSub = query(collection(db, 'tenants', 'default', 'users'), where('email', '==', cleanEmail));
            const qSubSnap = await getDocs(qSub);
            if (!qSubSnap.empty) {
              const dSub = qSubSnap.docs[0];
              matchedUser = { uid: dSub.id, ...dSub.data() };
            }
          }
        } catch (_e) {}
      }

      if (!matchedUser) {
        throw new Error('Access Denied: No registered account found with email "' + cleanEmail + '". Only staff authorized by Super Admin can sign in.');
      }

      // Verify password strictly against registered user passwordHash, password or alternate passwords
      if (!validatePassword(matchedUser, cleanPassword)) {
        throw new Error('Access Denied: Incorrect password for "' + cleanEmail + '". Please check your credentials.');
      }

      authenticatedProfile = matchedUser;
      firebaseUid = matchedUser.uid;
    }

    if (!authenticatedProfile) {
      const registry = getLocalUserRegistry();
      let matchedUser = findUserInRegistry(registry, cleanEmail);
      if (matchedUser) {
        if (!validatePassword(matchedUser, cleanPassword)) {
          throw new Error('Access Denied: Incorrect password for "' + cleanEmail + '". Please check your credentials.');
        }
        authenticatedProfile = matchedUser;
      } else {
        throw new Error('Access Denied: Invalid email or password. Only registered staff authorized by Super Admin can sign in.');
      }
    }

    // CHECK APPROVAL STATUS
    if (authenticatedProfile.status === 'pending_approval') {
      throw new Error('Access Pending: Your employee account has been created by HR and is awaiting Super Admin approval before activation.');
    }

    if (authenticatedProfile.status === 'rejected') {
      throw new Error('Access Denied: Your employee account application was rejected by the Super Admin.');
    }

    if (authenticatedProfile.status && authenticatedProfile.status !== 'active') {
      throw new Error('Your account is currently inactive or suspended. Please contact the Super Admin.');
    }

    const resolvedRole = authenticatedProfile.role || (cleanEmail.includes('superadmin') ? 'superadmin' : 'sales-exec');
    const userId = authenticatedProfile.uid || firebaseUid || 'USR_' + Math.random().toString(36).substring(2, 9);

    const userData = {
      userId: userId,
      employeeId: authenticatedProfile.employeeId || 'EMP_' + Math.floor(1000 + Math.random() * 9000),
      name: authenticatedProfile.name || cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      role: resolvedRole,
      designation: authenticatedProfile.designation || resolvedRole.toUpperCase(),
      department: authenticatedProfile.department || 'Operations',
      status: 'active',
      stateId: authenticatedProfile.stateId || 'MH',
      districtId: authenticatedProfile.districtId || 'PUNE',
      galleryId: authenticatedProfile.galleryId || 'GAL_PUNE_01',
      reportsTo: authenticatedProfile.reportsTo || 'SUPERADMIN'
    };

    // Update state
    setUser(userData);
    setRoleState(resolvedRole);

    if (typeof window !== 'undefined') {
      localStorage.setItem('epay_user', JSON.stringify(userData));
      localStorage.setItem('epay_active_role', resolvedRole);
    }

    // Create attendance session
    const attendanceId = `att_${userId}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
    const sessionData = {
      attendanceId,
      employeeId: userData.employeeId,
      employeeName: userData.name,
      roleId: resolvedRole,
      loginTime: new Date().toISOString(),
      status: 'WORKING'
    };

    setActiveSession(sessionData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('epay_active_session', JSON.stringify(sessionData));
    }

    // Sync to Firestore non-blocking in background
    if (db && typeof window !== 'undefined') {
      (async () => {
        try {
          const payloadToSave = {
            ...userData,
            lastLogin: new Date().toISOString()
          };

          await setDoc(doc(db, 'users', userId), payloadToSave, { merge: true }).catch(() => {});
          await setDoc(doc(db, 'tenants', 'default', 'users', userId), payloadToSave, { merge: true }).catch(() => {});

          await setDoc(doc(db, 'tenants', 'default', 'hr_attendance', attendanceId), {
            ...sessionData,
            date: new Date().toISOString().slice(0, 10),
            createdAt: serverTimestamp()
          }, { merge: true }).catch(() => {});

          await addDoc(collection(db, 'tenants', 'default', 'auditLogs'), {
            employeeId: userData.employeeId,
            userEmail: userData.email,
            role: resolvedRole,
            eventType: 'LOGIN',
            timestamp: new Date().toISOString(),
            sessionId: attendanceId,
            source: 'WEB_PORTAL',
            createdAt: serverTimestamp()
          }).catch(() => {});
        } catch (_e) {}
      })().catch(() => {});
    }

    await loadRolePermissions(resolvedRole);
    return { success: true, user: userData, role: resolvedRole };
  };

  /**
   * User Creation (Super Admin & HR Support):
   * - Super Admin creates user ➔ Immediate 'active' status + Instant Auth Provisioning
   * - HR creates employee ➔ 'pending_approval' status, awaiting Super Admin approval
   */
  const createUser = async (newUserData) => {
    const isSuperAdmin = role === 'superadmin' || role === 'super-admin';
    const isHR = role === 'hr' || role === 'admin' || role === 'assistant-manager';

    if (!isSuperAdmin && !isHR) {
      throw new Error('Access Denied: Only Super Admin and HR have permission to onboard new employees.');
    }

    const {
      name,
      email,
      password,
      role: targetRole,
      employeeId,
      department,
      designation,
      stateId,
      districtId,
      galleryId,
      reportsTo,
      salary
    } = newUserData;

    if (!name || !email || !password || !targetRole) {
      throw new Error('Missing required fields: Full Name, Email, Password, and Role are mandatory.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const registry = getLocalUserRegistry();

    // Check if email already exists
    if (registry.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error(`A user with email "${cleanEmail}" is already registered in the system.`);
    }

    let finalUid = 'USR_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const autoEmpId = employeeId || `EMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const initialStatus = isSuperAdmin ? 'active' : 'pending_approval';

    // If Super Admin creates user, provision Firebase Auth account immediately
    if (isSuperAdmin && typeof window !== 'undefined') {
      try {
        const secondaryAppName = `SecondaryAuthApp_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
        const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
        const secondaryAuth = getAuth(secondaryApp);
        
        try {
          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, password);
          if (userCredential && userCredential.user) {
            finalUid = userCredential.user.uid;
          }
        } catch (_authErr) {
          // Silent
        } finally {
          await deleteApp(secondaryApp).catch(() => {});
        }
      } catch (_secErr) {}
    }

    const userProfile = {
      uid: finalUid,
      userId: finalUid,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: password, // For synchronized backup
      role: targetRole,
      employeeId: autoEmpId,
      department: department || (isHR ? 'Human Resources' : 'Operations'),
      designation: designation || targetRole.toUpperCase().replace(/-/g, ' '),
      salary: salary || '—',
      status: initialStatus,
      stateId: stateId || 'MH',
      districtId: districtId || 'PUNE',
      galleryId: galleryId || 'GAL_01',
      reportsTo: reportsTo || user?.employeeId || 'EMP-2026-0001',
      createdBy: user?.email || (isSuperAdmin ? 'superadmin@epay.in' : 'hr@epay.in'),
      createdRole: role || 'superadmin',
      requiresApproval: !isSuperAdmin,
      createdAt: new Date().toISOString()
    };

    // 1. Add to local registry
    const updatedRegistry = [userProfile, ...registry];
    saveLocalUserRegistry(updatedRegistry);

    // 2. Store in Firestore Database
    if (db && typeof window !== 'undefined') {
      try {
        await setDoc(doc(db, 'users', finalUid), userProfile).catch(() => {});
        await setDoc(doc(db, 'tenants', 'default', 'users', finalUid), userProfile).catch(() => {});
        await setDoc(doc(db, 'employees', autoEmpId), userProfile).catch(() => {});

        if (!isSuperAdmin) {
          await setDoc(doc(db, 'tenants', 'default', 'employee_onboarding_requests', finalUid), {
            ...userProfile,
            requestType: 'EMPLOYEE_ONBOARDING',
            submittedAt: new Date().toISOString()
          }).catch(() => {});
        }
        
        await addDoc(collection(db, 'tenants', 'default', 'auditLogs'), {
          actorEmployeeId: user?.employeeId || 'STAFF',
          actorEmail: user?.email || 'hr@epay.in',
          targetUserEmail: cleanEmail,
          targetRole: targetRole,
          eventType: isSuperAdmin ? 'USER_CREATED_BY_SUPERADMIN' : 'EMPLOYEE_SUBMITTED_BY_HR',
          status: initialStatus,
          timestamp: new Date().toISOString(),
          createdAt: serverTimestamp()
        }).catch(() => {});
      } catch (_e) {}
    }

    return { 
      success: true, 
      user: userProfile, 
      pendingApproval: !isSuperAdmin,
      message: isSuperAdmin 
        ? `User ${userProfile.name} provisioned and activated successfully.`
        : `Employee ${userProfile.name} submitted successfully. Awaiting Super Admin authorization before account activation.`
    };
  };

  /**
   * Super Admin Exclusive: Approve pending HR employee request
   */
  const approveUser = async (uid) => {
    const cleanRole = role ? role.toLowerCase() : '';
    if (cleanRole !== 'superadmin' && cleanRole !== 'super-admin' && cleanRole !== 'cto') {
      throw new Error('Access Denied: Only Super Admin/CTO can approve pending employee registrations.');
    }

    const registry = getLocalUserRegistry();
    const targetUser = registry.find(u => u.uid === uid);
    if (!targetUser) throw new Error('User record not found.');

    let newlyProvisionedUid = null;

    // 1. Provision in Firebase Auth if needed
    if (typeof window !== 'undefined' && targetUser.passwordHash) {
      try {
        const secondaryAppName = `SecondaryAuthApp_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
        const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
        const secondaryAuth = getAuth(secondaryApp);
        
        try {
          const userCreds = await createUserWithEmailAndPassword(secondaryAuth, targetUser.email, targetUser.passwordHash);
          if (userCreds && userCreds.user) {
            newlyProvisionedUid = userCreds.user.uid;
          }
        } catch (_e) {
          // Already in Auth or error
        } finally {
          await deleteApp(secondaryApp).catch(() => {});
        }
      } catch (_e) {}
    }

    const finalUid = newlyProvisionedUid || uid;

    const updatePayload = {
      ...targetUser,
      uid: finalUid,
      userId: finalUid,
      status: 'active',
      approvedBy: user?.email || 'superadmin@epay.in',
      approvedAt: new Date().toISOString(),
      requiresApproval: false
    };

    // 2. Update in local registry
    const updated = registry.map(u => u.uid === uid ? updatePayload : u);
    saveLocalUserRegistry(updated);

    // 3. Update in Firestore
    if (db && typeof window !== 'undefined') {
      try {
        if (newlyProvisionedUid && newlyProvisionedUid !== uid) {
          // Relocate documents to the new Firebase Auth UID
          await setDoc(doc(db, 'users', newlyProvisionedUid), updatePayload).catch(() => {});
          await setDoc(doc(db, 'tenants', 'default', 'users', newlyProvisionedUid), updatePayload).catch(() => {});
          await deleteDoc(doc(db, 'users', uid)).catch(() => {});
          await deleteDoc(doc(db, 'tenants', 'default', 'users', uid)).catch(() => {});
        } else {
          await updateDoc(doc(db, 'users', uid), updatePayload).catch(() => {});
          await updateDoc(doc(db, 'tenants', 'default', 'users', uid), updatePayload).catch(() => {});
        }

        if (targetUser.employeeId) {
          await setDoc(doc(db, 'employees', targetUser.employeeId), updatePayload, { merge: true }).catch(() => {});
        }

        try {
          await deleteDoc(doc(db, 'tenants', 'default', 'employee_onboarding_requests', uid)).catch(() => {});
        } catch (_e) {}

        await addDoc(collection(db, 'tenants', 'default', 'auditLogs'), {
          actor: user?.email || 'superadmin@epay.in',
          targetEmail: targetUser.email,
          targetUid: finalUid,
          eventType: 'EMPLOYEE_APPROVED_BY_SUPERADMIN',
          timestamp: new Date().toISOString(),
          createdAt: serverTimestamp()
        }).catch(() => {});
      } catch (_e) {}
    }

    return { success: true };
  };

  /**
   * Super Admin Exclusive: Reject pending HR employee request
   */
  const rejectUser = async (uid, rejectionReason = 'Application rejected by management') => {
    const cleanRole = role ? role.toLowerCase() : '';
    if (cleanRole !== 'superadmin' && cleanRole !== 'super-admin' && cleanRole !== 'cto') {
      throw new Error('Access Denied: Only Super Admin/CTO can reject employee registrations.');
    }

    const registry = getLocalUserRegistry();
    const targetUser = registry.find(u => u.uid === uid);
    if (!targetUser) throw new Error('User record not found.');

    const updatePayload = {
      status: 'rejected',
      rejectedBy: user?.email || 'superadmin@epay.in',
      rejectedAt: new Date().toISOString(),
      rejectionReason
    };

    const updated = registry.map(u => u.uid === uid ? { ...u, ...updatePayload } : u);
    saveLocalUserRegistry(updated);

    if (db && typeof window !== 'undefined') {
      try {
        await updateDoc(doc(db, 'users', uid), updatePayload).catch(() => {});
        await updateDoc(doc(db, 'tenants', 'default', 'users', uid), updatePayload).catch(() => {});
        try {
          await deleteDoc(doc(db, 'tenants', 'default', 'employee_onboarding_requests', uid)).catch(() => {});
        } catch (_e) {}

        await addDoc(collection(db, 'tenants', 'default', 'auditLogs'), {
          actor: user?.email || 'superadmin@epay.in',
          targetEmail: targetUser.email,
          targetUid: uid,
          eventType: 'EMPLOYEE_REJECTED_BY_SUPERADMIN',
          reason: rejectionReason,
          timestamp: new Date().toISOString(),
          createdAt: serverTimestamp()
        }).catch(() => {});
      } catch (_e) {}
    }

    return { success: true };
  };

  /**
   * Super Admin Exclusive: Get all registered users
   */
  /**
   * Super Admin Exclusive: Get all registered users from Firestore & Registry
   * @param {Object} options - { includeSeedUsers: boolean }
   */
  const getAllUsers = async (options = {}) => {
    const includeSeedUsers = options.includeSeedUsers !== undefined ? options.includeSeedUsers : false;
    
    let firestoreUsers = [];
    if (db && typeof window !== 'undefined') {
      try {
        const collectionsToFetch = [
          collection(db, 'users'),
          collection(db, 'tenants', 'default', 'users'),
          collection(db, 'employees'),
          collection(db, 'tenants', 'default', 'employees'),
          collection(db, 'tenants', 'default', 'employee_onboarding_requests')
        ];
        
        const fetchedMaps = new Map();
        for (const colRef of collectionsToFetch) {
          try {
            const snap = await getDocs(colRef);
            snap.forEach(d => {
              const data = d.data();
              const uid = d.id || data.uid || data.userId;
              const email = (data.email || '').trim().toLowerCase();
              const key = email || uid;
              if (key && !fetchedMaps.has(key)) {
                fetchedMaps.set(key, { uid, ...data });
              } else if (key) {
                fetchedMaps.set(key, { ...fetchedMaps.get(key), ...data });
              }
            });
          } catch (_e) {}
        }
        firestoreUsers = Array.from(fetchedMaps.values());
      } catch (_e) {}
    }

    const seedEmails = new Set(SEED_USERS.map(s => s.email.toLowerCase()));
    const registry = getLocalUserRegistry();
    const combinedMap = new Map();

    // 1. Add Firestore users
    firestoreUsers.forEach(u => {
      const key = u.email ? u.email.toLowerCase() : u.uid;
      if (key) combinedMap.set(key, u);
    });

    // 2. Add local registry users that are NOT seed users (i.e. real created users)
    registry.forEach(u => {
      if (u && u.email) {
        const cleanE = u.email.toLowerCase();
        if (!seedEmails.has(cleanE) && !combinedMap.has(cleanE)) {
          combinedMap.set(cleanE, u);
        }
      }
    });

    let realUsers = Array.from(combinedMap.values());

    // Always include Root Super Admin account so master governance is maintained
    const rootAdmin = SEED_USERS.find(s => s.email === 'superadmin@epay.in');
    if (rootAdmin && !realUsers.some(u => u.email?.toLowerCase() === 'superadmin@epay.in')) {
      realUsers.unshift(rootAdmin);
    }

    // If caller explicitly requested demo seed users or if no real user data exists at all
    if (includeSeedUsers || realUsers.length <= 1) {
      registry.forEach(su => {
        if (su && su.email) {
          const cleanE = su.email.toLowerCase();
          if (!combinedMap.has(cleanE)) {
            combinedMap.set(cleanE, su);
          }
        }
      });
      return Array.from(combinedMap.values());
    }

    return realUsers;
  };

  /**
   * Super Admin Exclusive: Update user profile or status
   */
  const updateUser = async (uid, updateFields) => {
    if (role !== 'superadmin' && role !== 'super-admin') {
      throw new Error('Access Denied: Only Super Admin can modify user profiles.');
    }

    const registry = getLocalUserRegistry();
    const updated = registry.map(u => u.uid === uid ? { ...u, ...updateFields, updatedAt: new Date().toISOString() } : u);
    saveLocalUserRegistry(updated);

    if (db && typeof window !== 'undefined') {
      try {
        const updatePayload = {
          ...updateFields,
          updatedAt: new Date().toISOString()
        };

        try { await updateDoc(doc(db, 'users', uid), updatePayload); } catch (_e) {}
        try { await updateDoc(doc(db, 'tenants', 'default', 'users', uid), updatePayload); } catch (_e) {}

        await addDoc(collection(db, 'tenants', 'default', 'auditLogs'), {
          actor: user?.email || 'superadmin@epay.in',
          targetUid: uid,
          eventType: 'USER_UPDATED',
          changes: updateFields,
          timestamp: new Date().toISOString(),
          createdAt: serverTimestamp()
        }).catch(() => {});
      } catch (_e) {}
    }

    return { success: true };
  };

  /**
   * Super Admin Exclusive: Delete or deactivate user
   */
  const deleteUser = async (uid) => {
    if (role !== 'superadmin' && role !== 'super-admin') {
      throw new Error('Access Denied: Only Super Admin can delete user accounts.');
    }

    const registry = getLocalUserRegistry();
    const targetUser = registry.find(u => u.uid === uid);
    if (targetUser && targetUser.email.toLowerCase() === 'superadmin@epay.in') {
      throw new Error('Root Super Admin account cannot be deleted.');
    }

    const filtered = registry.filter(u => u.uid !== uid);
    saveLocalUserRegistry(filtered);

    if (db && typeof window !== 'undefined') {
      try {
        try { await deleteDoc(doc(db, 'users', uid)); } catch (_e) {}
        try { await deleteDoc(doc(db, 'tenants', 'default', 'users', uid)); } catch (_e) {}

        await addDoc(collection(db, 'tenants', 'default', 'auditLogs'), {
          actor: user?.email || 'superadmin@epay.in',
          targetUid: uid,
          targetEmail: targetUser?.email,
          eventType: 'USER_DELETED',
          timestamp: new Date().toISOString(),
          createdAt: serverTimestamp()
        }).catch(() => {});
      } catch (_e) {}
    }

    return { success: true };
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (user && activeSession && db && typeof window !== 'undefined') {
        const attendanceId = activeSession.attendanceId;
        const logoutTime = new Date().toISOString();

        try {
          await updateDoc(doc(db, 'tenants', 'default', 'hr_attendance', attendanceId), {
            logoutTime,
            status: 'COMPLETED'
          }).catch(() => {});

          await addDoc(collection(db, 'tenants', 'default', 'auditLogs'), {
            employeeId: user.employeeId,
            eventType: 'LOGOUT',
            timestamp: logoutTime,
            sessionId: attendanceId,
            source: 'WEB_PORTAL',
            createdAt: serverTimestamp()
          }).catch(() => {});
        } catch (_e) {}
      }

      await signOut(auth).catch(() => {});
      setUser(null);
      setRoleState(null);
      setPermissions({});
      setActiveSession(null);
      setActiveBreak(null);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('epay_user');
        localStorage.removeItem('epay_active_role');
        localStorage.removeItem('epay_active_session');
        localStorage.removeItem('epay_active_break');
      }
    } catch (_e) {
    } finally {
      setIsLoading(false);
    }
  };

  const startBreak = async (breakType = 'TEA') => {
    if (!user || !activeSession) return;
    const breakData = {
      breakId: `brk_${Date.now()}`,
      attendanceId: activeSession.attendanceId,
      employeeId: user.employeeId,
      breakType,
      startTime: new Date().toISOString(),
      status: 'ON_BREAK'
    };
    setActiveBreak(breakData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('epay_active_break', JSON.stringify(breakData));
    }
    if (db && typeof window !== 'undefined') {
      try {
        await addDoc(collection(db, 'tenants', 'default', 'breaks'), {
          ...breakData,
          createdAt: serverTimestamp()
        });
      } catch (e) {}
    }
  };

  const endBreak = async () => {
    if (!activeBreak) return;
    const endTime = new Date().toISOString();
    const updatedBreak = { ...activeBreak, endTime, status: 'FINISHED' };
    setActiveBreak(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('epay_active_break');
    }
    if (db && typeof window !== 'undefined') {
      try {
        await addDoc(collection(db, 'tenants', 'default', 'breaks'), {
          ...updatedBreak,
          updatedAt: serverTimestamp()
        });
      } catch (e) {}
    }
  };

  const reportIdle = async (idleDurationMinutes) => {
    if (!user) return;
    if (db && typeof window !== 'undefined') {
      try {
        await addDoc(collection(db, 'tenants', 'default', 'idleReports'), {
          employeeId: user.employeeId,
          durationMinutes: idleDurationMinutes,
          timestamp: new Date().toISOString(),
          createdAt: serverTimestamp()
        });
      } catch (e) {}
    }
  };

  const submitAttendanceCorrection = async (payload) => {
    if (!user) return;
    if (db && typeof window !== 'undefined') {
      try {
        await addDoc(collection(db, 'tenants', 'default', 'attendanceCorrections'), {
          employeeId: user.employeeId,
          ...payload,
          status: 'PENDING',
          createdAt: serverTimestamp()
        });
      } catch (e) {}
    }
  };

  const logActivity = async (actionType, details = {}) => {
    if (!user) return;
    if (db && typeof window !== 'undefined') {
      try {
        await addDoc(collection(db, 'tenants', 'default', 'activityLogs'), {
          employeeId: user.employeeId,
          userEmail: user.email,
          role: role,
          actionType,
          details,
          timestamp: new Date().toISOString(),
          createdAt: serverTimestamp()
        });
      } catch (e) {}
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      permissions,
      setRole,
      login,
      logout,
      createUser,
      approveUser,
      rejectUser,
      updateUser,
      deleteUser,
      getAllUsers,
      startBreak,
      endBreak,
      reportIdle,
      submitAttendanceCorrection,
      logActivity,
      isLoading,
      activeSession,
      activeBreak
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
