import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "AIzaSyCa9Ay3kJxJ_wNQjwLpTEYk_gHoGkk077U",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "epaycrm-63608.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "epaycrm-63608",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "epaycrm-63608.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "230938995927",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "1:230938995927:web:74cb545097857710e61492"
};

console.log('Connecting to Firebase Project ID:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SEED_USERS = [
  // Super Admin & Executive Leadership
  { uid: 'USR_SUPERADMIN_ROOT_001', email: 'superadmin@epay.in', role: 'superadmin', name: 'Super Admin', employeeId: 'EMP-2026-0001', designation: 'Platform Super Administrator', department: 'Top Management', status: 'active' },
  { uid: 'USR_ADMIN_002', email: 'admin.ops@epay.in', role: 'admin', name: 'Priya Sharma', employeeId: 'EMP-2026-0003', designation: 'System Operations Administrator', department: 'Administration', status: 'active' },
  { uid: 'USR_CEO_003', email: 'ceo@epay.in', role: 'ceo', name: 'Rajesh Singhania', employeeId: 'EMP-2026-0004', designation: 'Chief Executive Officer', department: 'Executive Command', status: 'active' },
  { uid: 'USR_CTO_004', email: 'cto@epay.in', role: 'cto', name: 'Dr. Aris Thorne', employeeId: 'EMP-2026-0005', designation: 'Chief Technology Officer', department: 'Technology Center', status: 'active' },

  // Human Resources (HR) - Multiple Users
  { uid: 'USR_HR_001', email: 'hr.manager@epay.in', role: 'hr', name: 'Pooja Sharma', employeeId: 'EMP-2026-0002', designation: 'HR Manager', department: 'Human Resources', status: 'active' },
  { uid: 'USR_HR_002', email: 'hr.recruiter@epay.in', role: 'hr', name: 'Ananya Roy', employeeId: 'EMP-2026-0010', designation: 'HR Talent Acquisition Specialist', department: 'Human Resources', status: 'active' },
  { uid: 'USR_HR_003', email: 'hr.operations@epay.in', role: 'hr', name: 'Rajesh Verma', employeeId: 'EMP-2026-0011', designation: 'HR Operations Executive', department: 'Human Resources', status: 'active' },

  // Developers & DevHub - Multiple Users
  { uid: 'USR_DEV_001', email: 'developer.lead@epay.in', role: 'devhub', name: 'Vikramaditya Singh', employeeId: 'EMP-2026-0020', designation: 'Lead Systems Architect & Developer', department: 'Engineering & DevHub', status: 'active' },
  { uid: 'USR_DEV_002', email: 'developer.frontend@epay.in', role: 'devhub', name: 'Rahul Deshmukh', employeeId: 'EMP-2026-0021', designation: 'Senior Frontend Developer', department: 'Engineering & DevHub', status: 'active' },
  { uid: 'USR_DEV_003', email: 'developer.backend@epay.in', role: 'devhub', name: 'Sneha Kulkarni', employeeId: 'EMP-2026-0022', designation: 'Cloud & Backend Engineer', department: 'Engineering & DevHub', status: 'active' },

  // Sales & Business Dev - Multiple Users
  { uid: 'USR_SALES_001', email: 'sales.mgr@epay.in', role: 'sales-mgr', name: 'Amit Kumar', employeeId: 'EMP-2026-0030', designation: 'National Sales Manager', department: 'Sales & Business Dev', status: 'active' },
  { uid: 'USR_SALES_002', email: 'sales.exec1@epay.in', role: 'sales-exec', name: 'Rohan Mehta', employeeId: 'EMP-2026-0031', designation: 'Field Sales Executive', department: 'Sales & Business Dev', status: 'active' },
  { uid: 'USR_SALES_003', email: 'sales.exec2@epay.in', role: 'sales-exec', name: 'Priya Patel', employeeId: 'EMP-2026-0032', designation: 'Senior Sales Executive', department: 'Sales & Business Dev', status: 'active' },

  // Operations - Multiple Users
  { uid: 'USR_OPS_001', email: 'ops.mgr@epay.in', role: 'ops-mgr', name: 'Suresh Nair', employeeId: 'EMP-2026-0040', designation: 'Operations Manager', department: 'Operations', status: 'active' },
  { uid: 'USR_OPS_002', email: 'ops.exec@epay.in', role: 'ops-exec', name: 'Manish Gupta', employeeId: 'EMP-2026-0041', designation: 'Operations Executive', department: 'Operations', status: 'active' },

  // Digital Marketing - Multiple Users
  { uid: 'USR_MKTG_001', email: 'marketing.lead@epay.in', role: 'marketing', name: 'Kavita Rane', employeeId: 'EMP-2026-0050', designation: 'Digital Marketing Lead', department: 'Marketing & Brand', status: 'active' },
  { uid: 'USR_MKTG_002', email: 'marketing.exec@epay.in', role: 'marketing-exec', name: 'Aditya Joshi', employeeId: 'EMP-2026-0051', designation: 'Performance Marketing Specialist', department: 'Marketing & Brand', status: 'active' },

  // Finance & Accounting - Multiple Users
  { uid: 'USR_FIN_001', email: 'finance.head@epay.in', role: 'finance', name: 'Rakesh Agarwal', employeeId: 'EMP-2026-0060', designation: 'Head of Finance', department: 'Finance & Accounts', status: 'active' },
  { uid: 'USR_FIN_002', email: 'finance.exec@epay.in', role: 'finance', name: 'Meera Iyer', employeeId: 'EMP-2026-0061', designation: 'Senior Accountant', department: 'Finance & Accounts', status: 'active' },

  // Technical Support - Multiple Users
  { uid: 'USR_SUPP_001', email: 'support.lead@epay.in', role: 'support', name: 'Deepak Rao', employeeId: 'EMP-2026-0070', designation: 'Tech Support Team Lead', department: 'Tech Support', status: 'active' },
  { uid: 'USR_SUPP_002', email: 'support.agent@epay.in', role: 'support', name: 'Alok Saxena', employeeId: 'EMP-2026-0071', designation: 'Customer Support Executive', department: 'Tech Support', status: 'active' },

  // Telecalling Team - Multiple Users
  { uid: 'USR_TELE_001', email: 'telecaller1@epay.in', role: 'telecalling', name: 'Neha Sharma', employeeId: 'EMP-2026-0080', designation: 'Senior Telecalling Specialist', department: 'Telecalling & Outreach', status: 'active' },
  { uid: 'USR_TELE_002', email: 'telecaller2@epay.in', role: 'telecalling', name: 'Karan Malhotra', employeeId: 'EMP-2026-0081', designation: 'Telecalling Agent', department: 'Telecalling & Outreach', status: 'active' }
];

const CORE_ROLES = [
  { roleId: 'superadmin', name: 'Super Admin', code: 'superadmin', department: 'administration', scope: 'global', permissions: { '*': true, 'all': true } },
  { roleId: 'ceo', name: 'Chief Executive Officer', code: 'ceo', department: 'executive', scope: 'global', permissions: { 'dashboard.view': true, 'reports.finance.view': true } },
  { roleId: 'hr', name: 'HR Manager', code: 'hr', department: 'hr', scope: 'global', permissions: { 'employee.attendance.view': true, 'employee.attendance.approve': true } },
  { roleId: 'devhub', name: 'Developer', code: 'devhub', department: 'engineering', scope: 'global', permissions: { 'devhub.view': true, 'devhub.edit': true } },
  { roleId: 'sales-exec', name: 'Sales Executive', code: 'sales-exec', department: 'sales', scope: 'regional', permissions: { 'leads.create': true, 'leads.view': true } }
];

async function seed() {
  console.log('Seeding multi-user baseline collections into Firestore (' + firebaseConfig.projectId + ')...');
  
  for (const user of SEED_USERS) {
    try {
      await setDoc(doc(db, 'users', user.uid), user, { merge: true });
      await setDoc(doc(db, 'tenants', 'default', 'users', user.uid), user, { merge: true });
      await setDoc(doc(db, 'employees', user.employeeId), user, { merge: true });
      console.log(`✓ Seeded user: ${user.name} (${user.email}) - Role: ${user.role}`);
    } catch (e) {
      console.error(`✗ Failed seeding user ${user.email}:`, e.message);
    }
  }

  for (const role of CORE_ROLES) {
    try {
      await setDoc(doc(db, 'tenants', 'default', 'roles', role.roleId), role, { merge: true });
      console.log(`✓ Seeded role: ${role.name}`);
    } catch (e) {
      console.error(`✗ Failed seeding role ${role.roleId}:`, e.message);
    }
  }

  console.log('All baseline seeding completed!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding crashed:', err);
  process.exit(1);
});
