/**
 * RBACService Unit Tests
 * 
 * Tests for role-based access control functionality:
 * - Role configuration loading from Firestore
 * - Portal access validation
 * - Feature access validation
 * - Cache management and TTL
 * - Real-time role changes
 * 
 * Requirements: 3.1, 3.2, 3.3
 */

const RBACService = require('./rbac-service');

describe('RBACService', () => {
    let rbacService;
    let mockFirestore;
    let mockCollection;
    let mockDoc;
    
    beforeEach(() => {
        // Clear any existing instance
        if (typeof window !== 'undefined') {
            window.rbacServiceInstance = null;
        }
        
        // Mock Firestore
        mockDoc = {
            exists: true,
            id: 'admin',
            data: () => ({
                role: 'admin',
                accessible_portals: ['admin-portal', 'dashboard', 'compliance'],
                accessible_features: ['user-management', 'settings', 'audit-logs'],
                portal_display_names: {
                    'admin-portal': 'Admin Portal',
                    'dashboard': 'Dashboard',
                    'compliance': 'Compliance'
                },
                portal_icons: {
                    'admin-portal': 'admin-icon',
                    'dashboard': 'dashboard-icon',
                    'compliance': 'compliance-icon'
                },
                portal_order: {
                    'admin-portal': 1,
                    'dashboard': 2,
                    'compliance': 3
                }
            })
        };
        
        mockCollection = {
            doc: jest.fn().mockReturnValue(mockDoc),
            get: jest.fn().mockResolvedValue({
                empty: false,
                forEach: function(callback) {
                    callback({
                        id: 'admin',
                        data: () => mockDoc.data()
                    });
                    callback({
                        id: 'user',
                        data: () => ({
                            role: 'user',
                            accessible_portals: ['dashboard', 'profile'],
                            accessible_features: ['profile-view']
                        })
                    });
                }
            }),
            onSnapshot: jest.fn()
        };
        
        mockFirestore = {
            collection: jest.fn().mockReturnValue(mockCollection)
        };
        
        // Mock Firebase globally
        global.firebase = {
            firestore: jest.fn().mockReturnValue(mockFirestore)
        };
        
        // Create service instance
        rbacService = new RBACService();
    });
    
    afterEach(() => {
        if (rbacService) {
            rbacService.destroy();
        }
        delete global.firebase;
    });
    
    describe('Initialization', () => {
        test('should initialize successfully', async () => {
            await rbacService.init();
            
            expect(rbacService.isInitialized).toBe(true);
            expect(rbacService.db).not.toBeNull();
            expect(rbacService.roleConfigsRef).not.toBeNull();
        });
        
        test('should load role configurations on init', async () => {
            await rbacService.init();
            
            expect(mockCollection.get).toHaveBeenCalled();
            expect(rbacService.roleConfigCache.size).toBe(2);
        });
        
        test('should handle multiple init calls gracefully', async () => {
            await rbacService.init();
            const firstSize = rbacService.roleConfigCache.size;
            
            await rbacService.init();
            const secondSize = rbacService.roleConfigCache.size;
            
            expect(firstSize).toBe(secondSize);
            expect(mockCollection.get).toHaveBeenCalledTimes(1);
        });
    });
    
    describe('canAccessPortal', () => {
        beforeEach(async () => {
            await rbacService.init();
        });
        
        test('should return true if portal is in accessible_portals', async () => {
            const hasAccess = await rbacService.canAccessPortal('admin', 'admin-portal');
            
            expect(hasAccess).toBe(true);
        });
        
        test('should return false if portal is not in accessible_portals', async () => {
            const hasAccess = await rbacService.canAccessPortal('admin', 'unknown-portal');
            
            expect(hasAccess).toBe(false);
        });
        
        test('should return false for non-existent role', async () => {
            mockDoc.exists = false;
            mockDoc.data = () => null;
            
            const hasAccess = await rbacService.canAccessPortal('non-existent', 'admin-portal');
            
            expect(hasAccess).toBe(false);
        });
        
        test('should return false if userRole is null or undefined', async () => {
            const hasAccess1 = await rbacService.canAccessPortal(null, 'admin-portal');
            const hasAccess2 = await rbacService.canAccessPortal(undefined, 'admin-portal');
            
            expect(hasAccess1).toBe(false);
            expect(hasAccess2).toBe(false);
        });
        
        test('should return false if portalId is null or undefined', async () => {
            const hasAccess1 = await rbacService.canAccessPortal('admin', null);
            const hasAccess2 = await rbacService.canAccessPortal('admin', undefined);
            
            expect(hasAccess1).toBe(false);
            expect(hasAccess2).toBe(false);
        });
    });
    
    describe('canAccessFeature', () => {
        beforeEach(async () => {
            await rbacService.init();
        });
        
        test('should return true if feature is in accessible_features', async () => {
            const hasAccess = await rbacService.canAccessFeature('admin', 'user-management');
            
            expect(hasAccess).toBe(true);
        });
        
        test('should return false if feature is not in accessible_features', async () => {
            const hasAccess = await rbacService.canAccessFeature('admin', 'unknown-feature');
            
            expect(hasAccess).toBe(false);
        });
        
        test('should return false for role without accessible_features', async () => {
            mockDoc.data = () => ({
                role: 'limited',
                accessible_portals: ['dashboard']
                // No accessible_features
            });
            
            const hasAccess = await rbacService.canAccessFeature('limited', 'user-management');
            
            expect(hasAccess).toBe(false);
        });
    });
    
    describe('getRoleConfig', () => {
        beforeEach(async () => {
            await rbacService.init();
        });
        
        test('should retrieve role config from Firestore', async () => {
            const config = await rbacService.getRoleConfig('admin');
            
            expect(config).not.toBeNull();
            expect(config.role).toBe('admin');
            expect(config.accessible_portals).toContain('admin-portal');
        });
        
        test('should cache role config for subsequent calls', async () => {
            const config1 = await rbacService.getRoleConfig('admin');
            const config2 = await rbacService.getRoleConfig('admin');
            
            // Second call should use cache, so Firestore.doc should not be called again
            expect(config1).toEqual(config2);
        });
        
        test('should return null for non-existent role', async () => {
            mockDoc.exists = false;
            
            const config = await rbacService.getRoleConfig('non-existent');
            
            expect(config).toBeNull();
        });
        
        test('should return null if role is null or undefined', async () => {
            const config1 = await rbacService.getRoleConfig(null);
            const config2 = await rbacService.getRoleConfig(undefined);
            
            expect(config1).toBeNull();
            expect(config2).toBeNull();
        });
    });
    
    describe('getAccessiblePortals', () => {
        beforeEach(async () => {
            await rbacService.init();
        });
        
        test('should return array of accessible portals', async () => {
            const portals = await rbacService.getAccessiblePortals('admin');
            
            expect(Array.isArray(portals)).toBe(true);
            expect(portals).toContain('admin-portal');
            expect(portals).toContain('dashboard');
            expect(portals).toContain('compliance');
        });
        
        test('should return empty array for non-existent role', async () => {
            mockDoc.exists = false;
            
            const portals = await rbacService.getAccessiblePortals('non-existent');
            
            expect(portals).toEqual([]);
        });
    });
    
    describe('getAccessibleFeatures', () => {
        beforeEach(async () => {
            await rbacService.init();
        });
        
        test('should return array of accessible features', async () => {
            const features = await rbacService.getAccessibleFeatures('admin');
            
            expect(Array.isArray(features)).toBe(true);
            expect(features).toContain('user-management');
            expect(features).toContain('settings');
            expect(features).toContain('audit-logs');
        });
        
        test('should return empty array if accessible_features is not defined', async () => {
            mockDoc.data = () => ({
                role: 'limited',
                accessible_portals: ['dashboard']
            });
            
            const features = await rbacService.getAccessibleFeatures('limited');
            
            expect(features).toEqual([]);
        });
    });
    
    describe('getSidebarConfig', () => {
        beforeEach(async () => {
            await rbacService.init();
        });
        
        test('should return sidebar configuration sorted by order', async () => {
            const sidebar = await rbacService.getSidebarConfig('admin');
            
            expect(Array.isArray(sidebar)).toBe(true);
            expect(sidebar.length).toBe(3);
            
            // Check structure
            expect(sidebar[0]).toHaveProperty('portalId');
            expect(sidebar[0]).toHaveProperty('displayName');
            expect(sidebar[0]).toHaveProperty('icon');
            expect(sidebar[0]).toHaveProperty('order');
        });
        
        test('should sort portals by order', async () => {
            const sidebar = await rbacService.getSidebarConfig('admin');
            
            expect(sidebar[0].order).toBe(1);
            expect(sidebar[1].order).toBe(2);
            expect(sidebar[2].order).toBe(3);
        });
        
        test('should use formatted name if displayName not provided', async () => {
            // Create a config without portal display names
            const userRoleConfig = {
                role: 'user',
                accessible_portals: ['admin-portal', 'user-dashboard'],
                portal_display_names: {
                    'admin-portal': 'Admin Portal'
                    // 'user-dashboard' not provided
                }
            };
            
            // Cache the role directly
            rbacService.roleConfigCache.set('test-user', userRoleConfig);
            rbacService.roleConfigTimestamps.set('test-user', Date.now());
            
            const sidebar = await rbacService.getSidebarConfig('test-user');
            
            // Verify we have both portals
            expect(sidebar.length).toBe(2);
            
            // First portal uses provided display name
            const adminPortal = sidebar.find(p => p.portalId === 'admin-portal');
            expect(adminPortal).not.toBeUndefined();
            expect(adminPortal.displayName).toBe('Admin Portal');
            
            // Second portal uses formatted name
            const userDashboard = sidebar.find(p => p.portalId === 'user-dashboard');
            expect(userDashboard).not.toBeUndefined();
            expect(userDashboard.displayName).toBe('User Dashboard');
        });
    });
    
    describe('Cache Management', () => {
        beforeEach(async () => {
            await rbacService.init();
        });
        
        test('should mark cache as expired after TTL', async () => {
            const config = await rbacService.getRoleConfig('admin');
            
            // Cache should be valid immediately
            expect(rbacService.isCacheValid('admin')).toBe(true);
            
            // Simulate cache expiration by setting timestamp to past
            rbacService.roleConfigTimestamps.set('admin', Date.now() - rbacService.configCacheTTL - 1000);
            
            expect(rbacService.isCacheValid('admin')).toBe(false);
        });
        
        test('should clear specific role from cache', async () => {
            await rbacService.init();
            expect(rbacService.roleConfigCache.has('admin')).toBe(true);
            
            rbacService.roleConfigCache.delete('admin');
            
            expect(rbacService.roleConfigCache.has('admin')).toBe(false);
        });
        
        test('should clear all cache', async () => {
            await rbacService.init();
            expect(rbacService.roleConfigCache.size).toBeGreaterThan(0);
            
            rbacService.clearCache();
            
            expect(rbacService.roleConfigCache.size).toBe(0);
            expect(rbacService.roleConfigTimestamps.size).toBe(0);
        });
    });
    
    describe('getRoleConfigSync', () => {
        beforeEach(async () => {
            await rbacService.init();
        });
        
        test('should retrieve role config synchronously from cache', () => {
            const config = rbacService.getRoleConfigSync('admin');
            
            expect(config).not.toBeNull();
            expect(config.role).toBe('admin');
        });
        
        test('should return null if role not in cache', () => {
            const config = rbacService.getRoleConfigSync('non-existent');
            
            expect(config).toBeNull();
        });
    });
    
    describe('getCachedRoles', () => {
        beforeEach(async () => {
            await rbacService.init();
        });
        
        test('should return array of cached role identifiers', () => {
            const roles = rbacService.getCachedRoles();
            
            expect(Array.isArray(roles)).toBe(true);
            expect(roles).toContain('admin');
            expect(roles).toContain('user');
        });
    });
    
    describe('getCacheStats', () => {
        beforeEach(async () => {
            await rbacService.init();
        });
        
        test('should return cache statistics', () => {
            const stats = rbacService.getCacheStats();
            
            expect(stats).toHaveProperty('cachedRoles');
            expect(stats).toHaveProperty('cacheSize');
            expect(stats).toHaveProperty('isInitialized');
            expect(stats).toHaveProperty('hasCacheTTL');
            expect(stats).toHaveProperty('roles');
            
            expect(stats.isInitialized).toBe(true);
            expect(stats.cachedRoles).toBe(2);
        });
    });
    
    describe('Role Change Listeners', () => {
        beforeEach(async () => {
            await rbacService.init();
        });
        
        test('should register and call role change listener', () => {
            const mockCallback = jest.fn();
            
            rbacService.onRoleConfigChanged(mockCallback);
            
            rbacService.notifyRoleChangeListeners({
                roleId: 'admin',
                type: 'modified',
                config: { role: 'admin' }
            });
            
            expect(mockCallback).toHaveBeenCalledWith({
                roleId: 'admin',
                type: 'modified',
                config: { role: 'admin' }
            });
        });
        
        test('should allow unsubscribe from role change listener', () => {
            const mockCallback = jest.fn();
            const unsubscribe = rbacService.onRoleConfigChanged(mockCallback);
            
            unsubscribe();
            
            rbacService.notifyRoleChangeListeners({
                roleId: 'admin',
                type: 'modified',
                config: { role: 'admin' }
            });
            
            expect(mockCallback).not.toHaveBeenCalled();
        });
    });
    
    describe('Error Handling', () => {
        test('should handle invalid role configurations', async () => {
            mockCollection.get.mockResolvedValue({
                empty: false,
                forEach: function(callback) {
                    callback({
                        id: 'invalid',
                        data: () => ({
                            // Missing 'role' and 'accessible_portals'
                        })
                    });
                }
            });
            
            rbacService.clearCache();
            await rbacService.loadRoleConfig();
            
            // Invalid config should not be cached
            expect(rbacService.roleConfigCache.has('invalid')).toBe(false);
        });
    });
});
