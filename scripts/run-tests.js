const { ALL_ROLES, getNavItemsForRole } = require('../lib/rbac');
const { firebaseConfig } = require('../lib/firebase');

console.log('==================================================');
console.log('🧪 ePay CRM Suite - Unit Test Verification Engine');
console.log('==================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASSED: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAILED: ${message}`);
    failed++;
  }
}

try {
  console.log('1. RBAC Engine Unit Tests:');
  assert(Array.isArray(ALL_ROLES), 'ALL_ROLES is an array');
  assert(ALL_ROLES.length > 50, `ALL_ROLES has ${ALL_ROLES.length} roles configured`);
  assert(ALL_ROLES.some(r => r.id === 'superadmin'), 'superadmin role exists');
  assert(ALL_ROLES.some(r => r.id === 'ceo'), 'ceo role exists');

  const superadminNav = getNavItemsForRole('superadmin');
  assert(Array.isArray(superadminNav) && superadminNav.length > 0, 'superadmin nav items returned');
  assert(superadminNav.some(n => n.path === '/superadmin'), 'superadmin path mapped');

  console.log('\n2. Firebase Configuration Unit Tests:');
  assert(firebaseConfig && typeof firebaseConfig === 'object', 'firebaseConfig is defined');
  assert(firebaseConfig.projectId === 'epaycrm-63608', 'projectId correctly set to epaycrm-63608');
  assert(firebaseConfig.authDomain.includes('firebaseapp.com'), 'authDomain correctly formatted');

  console.log('\n==================================================');
  console.log(`Summary: ${passed} passed, ${failed} failed.`);
  console.log('==================================================');

  if (failed > 0) process.exit(1);
} catch (err) {
  console.error('Test execution error:', err);
  process.exit(1);
}
