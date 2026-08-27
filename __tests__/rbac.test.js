import { ALL_ROLES, getNavItemsForRole } from '@/lib/rbac';

describe('RBAC Engine Unit Tests', () => {
  test('ALL_ROLES should contain expected core role definitions', () => {
    expect(Array.isArray(ALL_ROLES)).toBe(true);
    expect(ALL_ROLES.length).toBeGreaterThan(10);
    
    const superadmin = ALL_ROLES.find(r => r.id === 'superadmin');
    expect(superadmin).toBeDefined();
    expect(superadmin.label).toBe('Super Admin');

    const ceo = ALL_ROLES.find(r => r.id === 'ceo');
    expect(ceo).toBeDefined();

    const hr = ALL_ROLES.find(r => r.id === 'hr');
    expect(hr).toBeDefined();
  });

  test('getNavItemsForRole should return superadmin nav items', () => {
    const navItems = getNavItemsForRole('superadmin');
    expect(Array.isArray(navItems)).toBe(true);
    expect(navItems.length).toBeGreaterThan(0);
    
    const superadminItem = navItems.find(item => item.id === 'superadmin');
    expect(superadminItem).toBeDefined();
    expect(superadminItem.path).toBe('/superadmin');
  });

  test('getNavItemsForRole should return fallback item when role is null or empty', () => {
    const navItems = getNavItemsForRole(null);
    expect(Array.isArray(navItems)).toBe(true);
    expect(navItems.length).toBe(1);
    expect(navItems[0].path).toBe('/');
  });
});
