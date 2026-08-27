// Simulated authentication logic verification with multi-user seed accounts
const SEED_USERS = [
  // Super Admin & Leadership
  { uid: 'USR_SUPERADMIN_ROOT_001', email: 'superadmin@epay.in', passwordHash: 'Admin@2026!', role: 'superadmin', name: 'Super Admin', status: 'active' },
  { uid: 'USR_ADMIN_002', email: 'admin.ops@epay.in', passwordHash: 'AdminOps@2026', role: 'admin', name: 'Priya Sharma', status: 'active' },
  { uid: 'USR_CEO_003', email: 'ceo@epay.in', passwordHash: 'CeoPass@2026', role: 'ceo', name: 'Rajesh Singhania', status: 'active' },
  { uid: 'USR_CTO_004', email: 'cto@epay.in', passwordHash: 'CtoPass@2026', role: 'cto', name: 'Dr. Aris Thorne', status: 'active' },

  // HR Team (Multiple Users)
  { uid: 'USR_HR_001', email: 'hr.manager@epay.in', passwordHash: 'HrPass@2026', role: 'hr', name: 'Pooja Sharma', status: 'active' },
  { uid: 'USR_HR_002', email: 'hr.recruiter@epay.in', passwordHash: 'HrPass@2026', role: 'hr', name: 'Ananya Roy', status: 'active' },
  { uid: 'USR_HR_003', email: 'hr.operations@epay.in', passwordHash: 'HrPass@2026', role: 'hr', name: 'Rajesh Verma', status: 'active' },

  // Developers & DevHub (Multiple Users)
  { uid: 'USR_DEV_001', email: 'developer.lead@epay.in', passwordHash: 'DevPass@2026', role: 'devhub', name: 'Vikramaditya Singh', status: 'active' },
  { uid: 'USR_DEV_002', email: 'developer.frontend@epay.in', passwordHash: 'DevPass@2026', role: 'devhub', name: 'Rahul Deshmukh', status: 'active' },
  { uid: 'USR_DEV_003', email: 'developer.backend@epay.in', passwordHash: 'DevPass@2026', role: 'devhub', name: 'Sneha Kulkarni', status: 'active' },

  // Sales & Biz Dev (Multiple Users)
  { uid: 'USR_SALES_001', email: 'sales.mgr@epay.in', passwordHash: 'SalesPass@2026', role: 'sales-mgr', name: 'Amit Kumar', status: 'active' },
  { uid: 'USR_SALES_002', email: 'sales.exec1@epay.in', passwordHash: 'SalesPass@2026', role: 'sales-exec', name: 'Rohan Mehta', status: 'active' },
  { uid: 'USR_SALES_003', email: 'sales.exec2@epay.in', passwordHash: 'SalesPass@2026', role: 'sales-exec', name: 'Priya Patel', status: 'active' },

  // Operations (Multiple Users)
  { uid: 'USR_OPS_001', email: 'ops.mgr@epay.in', passwordHash: 'OpsPass@2026', role: 'ops-mgr', name: 'Suresh Nair', status: 'active' },
  { uid: 'USR_OPS_002', email: 'ops.exec@epay.in', passwordHash: 'OpsPass@2026', role: 'ops-exec', name: 'Manish Gupta', status: 'active' },

  // Technical Support (Multiple Users)
  { uid: 'USR_SUPP_001', email: 'support.lead@epay.in', passwordHash: 'SuppPass@2026', role: 'support', name: 'Deepak Rao', status: 'active' },
  { uid: 'USR_SUPP_002', email: 'support.agent@epay.in', passwordHash: 'SuppPass@2026', role: 'support', name: 'Alok Saxena', status: 'active' }
];

function testLogin(email, password, registry = SEED_USERS) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Please enter both your work email and password.' };
  }

  const matchedUser = registry.find(u => u.email.toLowerCase() === cleanEmail);

  if (!matchedUser) {
    return { success: false, error: `Access Denied: No registered account found with email "${cleanEmail}". Only staff authorized by Super Admin can sign in.` };
  }

  if (matchedUser.passwordHash && matchedUser.passwordHash !== cleanPassword) {
    return { success: false, error: `Access Denied: Incorrect password for "${cleanEmail}". Please check your credentials.` };
  }

  if (matchedUser.status !== 'active') {
    return { success: false, error: 'Your account is currently inactive or suspended.' };
  }

  return { success: true, role: matchedUser.role, name: matchedUser.name };
}

console.log('--- AUTHENTICATION MULTI-USER SECURITY VALIDATION ---');

// Test 1: Dummy Non-existent Email
const t1 = testLogin('dummy@gmail.com', 'password123');
console.log('Test 1 [Dummy Email - dummy@gmail.com]:', t1.success ? 'FAIL (Allowed)' : `PASSED (Rejected: "${t1.error}")`);

// Test 2: Super Admin with WRONG password
const t2 = testLogin('superadmin@epay.in', 'WrongAdminPass99');
console.log('Test 2 [Superadmin Wrong Password]:', t2.success ? 'FAIL (Allowed)' : `PASSED (Rejected: "${t2.error}")`);

// Test 3: Super Admin with CORRECT password
const t3 = testLogin('superadmin@epay.in', 'Admin@2026!');
console.log('Test 3 [Superadmin Correct Credentials]:', t3.success ? `PASSED (Authenticated as ${t3.role} - ${t3.name})` : `FAIL (${t3.error})`);

// Test 4: HR Manager with CORRECT password
const t4 = testLogin('hr.manager@epay.in', 'HrPass@2026');
console.log('Test 4 [HR Manager - Pooja Sharma]:', t4.success ? `PASSED (Authenticated as ${t4.role} - ${t4.name})` : `FAIL (${t4.error})`);

// Test 5: HR Recruiter (Second HR User)
const t5 = testLogin('hr.recruiter@epay.in', 'HrPass@2026');
console.log('Test 5 [HR Recruiter - Ananya Roy]:', t5.success ? `PASSED (Authenticated as ${t5.role} - ${t5.name})` : `FAIL (${t5.error})`);

// Test 6: HR Operations (Third HR User)
const t6 = testLogin('hr.operations@epay.in', 'HrPass@2026');
console.log('Test 6 [HR Operations - Rajesh Verma]:', t6.success ? `PASSED (Authenticated as ${t6.role} - ${t6.name})` : `FAIL (${t6.error})`);

// Test 7: Lead Developer (First Developer User)
const t7 = testLogin('developer.lead@epay.in', 'DevPass@2026');
console.log('Test 7 [Lead Developer - Vikramaditya Singh]:', t7.success ? `PASSED (Authenticated as ${t7.role} - ${t7.name})` : `FAIL (${t7.error})`);

// Test 8: Frontend Developer (Second Developer User)
const t8 = testLogin('developer.frontend@epay.in', 'DevPass@2026');
console.log('Test 8 [Frontend Developer - Rahul Deshmukh]:', t8.success ? `PASSED (Authenticated as ${t8.role} - ${t8.name})` : `FAIL (${t8.error})`);

// Test 9: Backend Developer (Third Developer User)
const t9 = testLogin('developer.backend@epay.in', 'DevPass@2026');
console.log('Test 9 [Backend Developer - Sneha Kulkarni]:', t9.success ? `PASSED (Authenticated as ${t9.role} - ${t9.name})` : `FAIL (${t9.error})`);

// Test 10: Sales Manager
const t10 = testLogin('sales.mgr@epay.in', 'SalesPass@2026');
console.log('Test 10 [Sales Manager - Amit Kumar]:', t10.success ? `PASSED (Authenticated as ${t10.role} - ${t10.name})` : `FAIL (${t10.error})`);

// Test 11: Field Sales Executive
const t11 = testLogin('sales.exec1@epay.in', 'SalesPass@2026');
console.log('Test 11 [Field Sales Exec - Rohan Mehta]:', t11.success ? `PASSED (Authenticated as ${t11.role} - ${t11.name})` : `FAIL (${t11.error})`);

// Test 12: Operations Manager
const t12 = testLogin('ops.mgr@epay.in', 'OpsPass@2026');
console.log('Test 12 [Operations Manager - Suresh Nair]:', t12.success ? `PASSED (Authenticated as ${t12.role} - ${t12.name})` : `FAIL (${t12.error})`);

// Test 13: Support Lead
const t13 = testLogin('support.lead@epay.in', 'SuppPass@2026');
console.log('Test 13 [Support Lead - Deepak Rao]:', t13.success ? `PASSED (Authenticated as ${t13.role} - ${t13.name})` : `FAIL (${t13.error})`);

console.log('-----------------------------------------');
