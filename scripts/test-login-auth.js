// Simulated authentication logic verification with multi-user seed accounts
const SEED_USERS = [
  // Super Admin & Leadership
  { uid: 'USR_SUPERADMIN_ROOT_001', email: 'superadmin@epay.in', aliases: ['admin@epay.in'], passwordHash: 'Admin@2026!', role: 'superadmin', name: 'Super Admin', status: 'active' },
  { uid: 'USR_ADMIN_002', email: 'admin.ops@epay.in', passwordHash: 'AdminOps@2026', role: 'admin', name: 'Priya Sharma', status: 'active' },
  { uid: 'USR_CEO_003', email: 'ceo@epay.in', aliases: ['ceo.epayindia@gmail.com', 'ceo@epay'], passwordHash: 'CeoPass@2026', alternatePasswords: ['ceo@2026'], role: 'ceo', name: 'Rajesh Singhania', status: 'active' },
  { uid: 'USR_CEO_004', email: 'ceo.epayindia@gmail.com', passwordHash: 'CeoPass@2026', alternatePasswords: ['ceo@2026'], role: 'ceo', name: 'CEO User', status: 'active' },
  { uid: 'USR_CTO_004', email: 'cto@epay.in', aliases: ['cto@epay'], passwordHash: 'cto@2026', alternatePasswords: ['CtoPass@2026'], role: 'cto', name: 'Dr. Aris Thorne', status: 'active' },
  { uid: 'USR_CFO_005', email: 'cfo@epay.in', aliases: ['cfo@epay'], passwordHash: 'cfo@2026', alternatePasswords: ['CfoPass@2026'], role: 'finance', name: 'Chief Financial Officer', status: 'active' },
  { uid: 'USR_CMD_006', email: 'cmd@epay.in', aliases: ['cmd@epay'], passwordHash: 'cmd@2026', alternatePasswords: ['CmdPass@2026'], role: 'superadmin', name: 'Chairman & Managing Director', status: 'active' },

  // HR Team (Multiple Users & Custom Mappings)
  { uid: 'USR_HR_001', email: 'hr1@epay.in', aliases: ['riddhi@epay.in', 'riddhi@epay', 'hr1@epay', 'hr.manager@epay.in'], passwordHash: 'HrPass@2026', role: 'hr', name: 'Riddhi Sharma', status: 'active' },
  { uid: 'USR_HR_002', email: 'hr2@epay.in', aliases: ['anjali@epay.in', 'anjali@epay', 'hr2@epay', 'hr.recruiter@epay.in'], passwordHash: 'HrPass@2026', role: 'hr', name: 'Anjali Roy', status: 'active' },
  { uid: 'USR_HR_003', email: 'tanvi@epay.in', aliases: ['tanvi@epay', 'hr.operations@epay.in'], passwordHash: 'HrPass@2026', role: 'hr', name: 'Tanvi Verma', status: 'active' },

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
  { uid: 'USR_SUPP_002', email: 'support.agent@epay.in', passwordHash: 'SuppPass@2026', role: 'support', name: 'Alok Saxena', status: 'active' },

  // Telecalling
  { uid: 'USR_TELE_001', email: 'telecaller1@epay.in', aliases: ['neha@epay.in', 'neha@epay', 'neha.sharma@epay.in'], passwordHash: 'TelePass@2026', role: 'telecalling', name: 'Neha Sharma', status: 'active' },
  { uid: 'USR_TELE_002', email: 'neha@epay.in', aliases: ['neha@epay'], passwordHash: 'TelePass@2026', role: 'telecalling', name: 'Neha Sharma', status: 'active' }
];

function findUserInRegistry(registry, searchEmail) {
  if (!searchEmail || !Array.isArray(registry)) return null;
  let clean = searchEmail.trim().toLowerCase();
  if (clean.endsWith('@epay')) {
    clean = clean + '.in';
  }
  return registry.find(u => {
    if (!u) return false;
    const mainEmail = (u.email || '').trim().toLowerCase();
    if (mainEmail === clean) return true;
    if (Array.isArray(u.aliases) && u.aliases.some(a => {
      const cleanA = (a || '').trim().toLowerCase();
      return cleanA === clean || cleanA === searchEmail.trim().toLowerCase();
    })) return true;
    const prefix = clean.includes('@') ? clean.split('@')[0] : clean;
    const mainPrefix = mainEmail.includes('@') ? mainEmail.split('@')[0] : mainEmail;
    if (prefix && mainPrefix === prefix && (clean.endsWith('@epay.in') || clean.endsWith('@epayindia.com') || clean.endsWith('@epay'))) return true;
    return false;
  });
}

function validatePassword(userObj, inputPassword) {
  if (!userObj || !inputPassword) return false;
  const cleanPass = inputPassword.trim();
  const storedPassword = userObj.passwordHash || userObj.password;
  if (storedPassword === cleanPass) return true;
  if (Array.isArray(userObj.alternatePasswords) && userObj.alternatePasswords.includes(cleanPass)) return true;
  return false;
}

function testLogin(email, password, registry = SEED_USERS) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Please enter both your work email and password.' };
  }

  const matchedUser = findUserInRegistry(registry, cleanEmail);

  if (!matchedUser) {
    return { success: false, error: `Access Denied: No registered account found with email "${cleanEmail}". Only staff authorized by Super Admin can sign in.` };
  }

  if (!validatePassword(matchedUser, cleanPassword)) {
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

// Test 14: CEO Gmail Login (ceo.epayindia@gmail.com)
const t14 = testLogin('ceo.epayindia@gmail.com', 'CeoPass@2026');
console.log('Test 14 [CEO Gmail - ceo.epayindia@gmail.com]:', t14.success ? `PASSED (Authenticated as ${t14.role} - ${t14.name})` : `FAIL (${t14.error})`);

// Test 15: Telecaller Neha Alias (neha@epay.in)
const t15 = testLogin('neha@epay.in', 'TelePass@2026');
console.log('Test 15 [Telecaller Alias - neha@epay.in]:', t15.success ? `PASSED (Authenticated as ${t15.role} - ${t15.name})` : `FAIL (${t15.error})`);

// Test 16: HR1 (hr1@epay.in & riddhi@epay)
const t16 = testLogin('hr1@epay.in', 'HrPass@2026');
console.log('Test 16 [HR1 - hr1@epay.in]:', t16.success ? `PASSED (Authenticated as ${t16.role} - ${t16.name})` : `FAIL (${t16.error})`);

const t17 = testLogin('riddhi@epay', 'HrPass@2026');
console.log('Test 17 [HR Riddhi Alias - riddhi@epay]:', t17.success ? `PASSED (Authenticated as ${t17.role} - ${t17.name})` : `FAIL (${t17.error})`);

// Test 18: HR2 (hr2@epay.in & anjali@epay)
const t18 = testLogin('hr2@epay.in', 'HrPass@2026');
console.log('Test 18 [HR2 - hr2@epay.in]:', t18.success ? `PASSED (Authenticated as ${t18.role} - ${t18.name})` : `FAIL (${t18.error})`);

const t19 = testLogin('anjali@epay', 'HrPass@2026');
console.log('Test 19 [HR Anjali Alias - anjali@epay]:', t19.success ? `PASSED (Authenticated as ${t19.role} - ${t19.name})` : `FAIL (${t19.error})`);

// Test 20: Tanvi (tanvi@epay.in & tanvi@epay)
const t20 = testLogin('tanvi@epay', 'HrPass@2026');
console.log('Test 20 [HR Tanvi Alias - tanvi@epay]:', t20.success ? `PASSED (Authenticated as ${t20.role} - ${t20.name})` : `FAIL (${t20.error})`);

// Test 21: CFO (cfo@epay.in = cfo@2026)
const t21 = testLogin('cfo@epay.in', 'cfo@2026');
console.log('Test 21 [CFO - cfo@epay.in / cfo@2026]:', t21.success ? `PASSED (Authenticated as ${t21.role} - ${t21.name})` : `FAIL (${t21.error})`);

// Test 22: CMD (cmd@epay.in = cmd@2026)
const t22 = testLogin('cmd@epay.in', 'cmd@2026');
console.log('Test 22 [CMD - cmd@epay.in / cmd@2026]:', t22.success ? `PASSED (Authenticated as ${t22.role} - ${t22.name})` : `FAIL (${t22.error})`);

// Test 23: CTO (cto@epay.in = cto@2026)
const t23 = testLogin('cto@epay.in', 'cto@2026');
console.log('Test 23 [CTO - cto@epay.in / cto@2026]:', t23.success ? `PASSED (Authenticated as ${t23.role} - ${t23.name})` : `FAIL (${t23.error})`);

console.log('-----------------------------------------');
