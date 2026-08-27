/**
 * Unit Tests for PresenceService
 * 
 * Tests cover:
 * - recordLogin creates presence record with correct fields
 * - recordActivity updates lastActivityTime
 * - updateInactivityStatus changes status to away after 15 minutes
 * - getActiveUsers returns array of PresenceRecords
 * - getUserPresence fetches single user presence data
 * - recordLogout deletes presence record
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 * Task: 6.5 Write unit tests for PresenceService operations
 */

// Import PresenceService
const PresenceService = require('./presence-service.js');

// Mock Firebase for testing
const createMockFirebase = () => {
    let dataStore = {};
    const listeners = {};
    const onDisconnectHandlers = {};
    
    // Helper to get nested value
    const getNestedValue = (path) => {
        const parts = path.split('/').filter(p => p);
        let current = dataStore;
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return undefined;
            }
        }
        return current;
    };
    
    // Helper to set nested value
    const setNestedValue = (path, value) => {
        const parts = path.split('/').filter(p => p);
        let current = dataStore;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!(part in current)) {
                current[part] = {};
            }
            current = current[part];
        }
        if (value === null) {
            delete current[parts[parts.length - 1]];
        } else {
            current[parts[parts.length - 1]] = JSON.parse(JSON.stringify(value));
        }
    };
    
    const mockRef = (path) => {
        return {
            set(value) {
                setNestedValue(path, value);
                notifyListeners();
                return Promise.resolve();
            },
            remove() {
                setNestedValue(path, null);
                notifyListeners();
                return Promise.resolve();
            },
            update(updates) {
                Object.entries(updates).forEach(([updatePath, value]) => {
                    setNestedValue(updatePath, value);
                });
                notifyListeners();
                return Promise.resolve();
            },
            once(event) {
                if (event === 'value') {
                    const value = getNestedValue(path);
                    return Promise.resolve({
                        val: () => value,
                        exists: () => !!value
                    });
                }
                return Promise.reject(new Error('Unsupported event: ' + event));
            },
            on(event, callback) {
                if (!listeners[path]) {
                    listeners[path] = [];
                }
                listeners[path].push(callback);
                // Trigger immediate callback
                const value = getNestedValue(path);
                callback({
                    val: () => value,
                    exists: () => !!value
                });
                return callback;
            },
            off(event, callback) {
                if (listeners[path]) {
                    listeners[path] = listeners[path].filter(cb => cb !== callback);
                }
            },
            child(childPath) {
                return mockRef(path + '/' + childPath);
            },
            onDisconnect() {
                return {
                    set(value) {
                        onDisconnectHandlers[path] = value;
                        return Promise.resolve();
                    }
                };
            }
        };
    };
    
    const notifyListeners = () => {
        // Notify listeners on 'presence' path if data changed
        if (listeners['presence']) {
            const presenceData = getNestedValue('presence');
            listeners['presence'].forEach(cb => cb({
                val: () => presenceData,
                exists: () => !!presenceData
            }));
        }
    };
    
    return {
        database() {
            return {
                ref(path) {
                    return mockRef(path);
                },
                getDataStore: () => dataStore,
                getOnDisconnectHandlers: () => onDisconnectHandlers,
                resetDataStore: () => { dataStore = {}; }
            };
        },
        auth() {
            return {
                currentUser: { uid: 'test-user-123' }
            };
        }
    };
};

// Set up global Firebase mock
global.firebase = createMockFirebase();

describe('PresenceService', () => {
    let presenceService;
    const testUserId = 'test-user-123';
    const testDisplayName = 'Test User';
    const testRole = 'admin';
    const loginTime = Date.now();
    
    beforeEach(() => {
        // Create fresh instance for each test
        presenceService = new PresenceService();
        // Speed up init for testing
        presenceService.isInitialized = true;
        presenceService.realtimeDB = global.firebase.database();
        presenceService.presenceRef = presenceService.realtimeDB.ref('presence');
        // Disable automatic cleanup for testing
        clearInterval(presenceService.cleanupInterval);
    });
    
    afterEach(() => {
        // Cleanup
        presenceService.destroy();
        // Reset mock data store
        global.firebase.database().resetDataStore();
    });
    
    // Test Suite 1: recordLogin
    describe('recordLogin', () => {
        test('creates presence record with correct fields', async () => {
            const result = await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
            
            expect(result.success).toBe(true);
            expect(result.error).toBeUndefined();
            
            // Verify presence record was created
            const snapshot = await presenceService.realtimeDB
                .ref(`presence/${testUserId}`)
                .once('value');
            
            expect(snapshot.exists()).toBe(true);
            const data = snapshot.val();
            
            expect(data.displayName).toBe(testDisplayName);
            expect(data.role).toBe(testRole);
            expect(data.loginTime).toBe(loginTime);
            expect(data.lastActivityTime).toBe(loginTime);
            expect(data.online).toBe(true);
            expect(data.status).toBe('active');
        });
        
        test('returns error when userId is missing', async () => {
            const result = await presenceService.recordLogin(
                '',
                testDisplayName,
                testRole,
                loginTime
            );
            
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.error).toContain('userId');
        });
        
        test('returns error when displayName is too long', async () => {
            const longDisplayName = 'a'.repeat(256);
            const result = await presenceService.recordLogin(
                testUserId,
                longDisplayName,
                testRole,
                loginTime
            );
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('255 characters');
        });
        
        test('returns error for invalid role', async () => {
            const result = await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                'invalid_role',
                loginTime
            );
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid role');
        });
        
        test('accepts valid role values', async () => {
            const validRoles = ['admin', 'accountant', 'affiliate', 'BDE', 'BDO', 'CFO', 'CGO', 'CMO', 'arrival_manager', 'assistant_manager'];
            
            for (const role of validRoles) {
                const userId = `user-${role}`;
                const result = await presenceService.recordLogin(
                    userId,
                    testDisplayName,
                    role,
                    loginTime
                );
                
                expect(result.success).toBe(true);
            }
        });
        
        test('returns error when loginTime is negative', async () => {
            const result = await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                -1000
            );
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('non-negative');
        });
        
        test('setups onDisconnect handler', async () => {
            const result = await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
            
            expect(result.success).toBe(true);
            
            // Verify onDisconnect handler was set
            const handlers = presenceService.realtimeDB.getOnDisconnectHandlers();
            expect(handlers[`presence/${testUserId}/online`]).toBe(false);
        });
    });
    
    // Test Suite 2: recordActivity
    describe('recordActivity', () => {
        beforeEach(async () => {
            // Setup: login user first
            await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
        });
        
        test('updates lastActivityTime', async () => {
            // Wait a bit to ensure different timestamps
            await new Promise(resolve => setTimeout(resolve, 10));
            
            const result = await presenceService.recordActivity(testUserId);
            expect(result.success).toBe(true);
            
            const snapshot = await presenceService.realtimeDB
                .ref(`presence/${testUserId}/lastActivityTime`)
                .once('value');
            
            const updatedTime = snapshot.val();
            expect(updatedTime).toBeGreaterThan(loginTime);
            expect(updatedTime).toBeLessThanOrEqual(Date.now());
        });
        
        test('returns error when userId is missing', async () => {
            const result = await presenceService.recordActivity('');
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });
    
    // Test Suite 3: updateInactivityStatus
    describe('updateInactivityStatus', () => {
        beforeEach(async () => {
            // Setup: login user first
            await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
        });
        
        test('returns not inactive when user is active', async () => {
            const result = await presenceService.updateInactivityStatus(testUserId);
            expect(result.success).toBe(false);
            expect(result.reason).toBe('User not inactive yet');
        });
        
        test('updates status to away when inactive', async () => {
            // Set last activity to past (more than 15 minutes ago)
            const pastTime = Date.now() - 20 * 60 * 1000; // 20 minutes ago
            await presenceService.realtimeDB
                .ref(`presence/${testUserId}/lastActivityTime`)
                .set(pastTime);
            
            const result = await presenceService.updateInactivityStatus(testUserId);
            expect(result.success).toBe(true);
            
            // Verify status was updated to 'away'
            const snapshot = await presenceService.realtimeDB
                .ref(`presence/${testUserId}/status`)
                .once('value');
            
            expect(snapshot.val()).toBe('away');
        });
        
        test('returns error when presence record not found', async () => {
            const result = await presenceService.updateInactivityStatus('nonexistent-user');
            expect(result.success).toBe(false);
            expect(result.error).toContain('not found');
        });
        
        test('uses custom inactivity threshold', async () => {
            const customThreshold = 5 * 60 * 1000; // 5 minutes
            
            // Set last activity to 6 minutes ago
            const pastTime = Date.now() - 6 * 60 * 1000;
            await presenceService.realtimeDB
                .ref(`presence/${testUserId}/lastActivityTime`)
                .set(pastTime);
            
            const result = await presenceService.updateInactivityStatus(
                testUserId,
                customThreshold
            );
            
            expect(result.success).toBe(true);
        });
    });
    
    // Test Suite 4: recordLogout
    describe('recordLogout', () => {
        beforeEach(async () => {
            // Setup: login user first
            await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
        });
        
        test('deletes presence record', async () => {
            // Verify record exists
            let snapshot = await presenceService.realtimeDB
                .ref(`presence/${testUserId}`)
                .once('value');
            expect(snapshot.exists()).toBe(true);
            
            // Record logout
            const result = await presenceService.recordLogout(testUserId);
            expect(result.success).toBe(true);
            
            // Verify record was deleted
            snapshot = await presenceService.realtimeDB
                .ref(`presence/${testUserId}`)
                .once('value');
            expect(snapshot.exists()).toBe(false);
        });
        
        test('clears activity timer', async () => {
            // Verify timer was set
            expect(presenceService.activityTimers[testUserId]).toBeDefined();
            
            // Record logout
            await presenceService.recordLogout(testUserId);
            
            // Verify timer was cleared
            expect(presenceService.activityTimers[testUserId]).toBeUndefined();
        });
        
        test('returns error when userId is missing', async () => {
            const result = await presenceService.recordLogout('');
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });
    
    // Test Suite 5: getActiveUsers
    describe('getActiveUsers', () => {
        test('returns empty array when no users present', async () => {
            const result = await presenceService.getActiveUsers();
            
            expect(result.success).toBe(true);
            expect(Array.isArray(result.users)).toBe(true);
            expect(result.users.length).toBe(0);
        });
        
        test('returns online users only', async () => {
            // Add online user
            await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
            
            // Add offline user
            await presenceService.realtimeDB.ref(`presence/offline-user`).set({
                displayName: 'Offline User',
                role: 'admin',
                loginTime: loginTime - 60000,
                lastActivityTime: loginTime - 60000,
                online: false,
                status: 'offline'
            });
            
            const result = await presenceService.getActiveUsers();
            
            expect(result.success).toBe(true);
            expect(result.users.length).toBe(1);
            expect(result.users[0].userId).toBe(testUserId);
            expect(result.users[0].online).toBe(true);
        });
        
        test('includes all required presence fields', async () => {
            await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
            
            const result = await presenceService.getActiveUsers();
            
            expect(result.success).toBe(true);
            expect(result.users.length).toBe(1);
            
            const user = result.users[0];
            expect(user.userId).toBe(testUserId);
            expect(user.displayName).toBe(testDisplayName);
            expect(user.role).toBe(testRole);
            expect(user.loginTime).toBe(loginTime);
            expect(typeof user.lastActivityTime).toBe('number');
            expect(user.online).toBe(true);
            expect(user.status).toBe('active');
            expect(typeof user.loginDurationMs).toBe('number');
        });
        
        test('calculates loginDurationMs correctly', async () => {
            await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
            
            // Wait a bit to allow time to pass
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const result = await presenceService.getActiveUsers();
            const user = result.users[0];
            
            expect(user.loginDurationMs).toBeGreaterThanOrEqual(50);
            expect(user.loginDurationMs).toBeLessThan(1000);
        });
    });
    
    // Test Suite 6: getUserPresence
    describe('getUserPresence', () => {
        test('returns null for nonexistent user', async () => {
            const result = await presenceService.getUserPresence('nonexistent-user');
            
            expect(result.success).toBe(true);
            expect(result.presence).toBeNull();
        });
        
        test('fetches presence data for existing user', async () => {
            // Setup: login user first
            await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
            
            const result = await presenceService.getUserPresence(testUserId);
            
            expect(result.success).toBe(true);
            expect(result.presence).not.toBeNull();
            expect(result.presence.userId).toBe(testUserId);
            expect(result.presence.displayName).toBe(testDisplayName);
            expect(result.presence.role).toBe(testRole);
            expect(result.presence.online).toBe(true);
            expect(result.presence.status).toBe('active');
        });
        
        test('returns error when userId is missing', async () => {
            const result = await presenceService.getUserPresence('');
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
        
        test('calculates loginDurationMs correctly', async () => {
            await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
            
            // Wait a bit
            await new Promise(resolve => setTimeout(resolve, 30));
            
            const result = await presenceService.getUserPresence(testUserId);
            
            expect(result.presence.loginDurationMs).toBeGreaterThanOrEqual(30);
        });
    });
    
    // Test Suite 7: onPresenceChanged (Real-time listener)
    describe('onPresenceChanged', () => {
        test('calls callback immediately with current data', async () => {
            const callback = jest.fn();
            
            presenceService.onPresenceChanged(callback);
            
            // Give callback time to execute
            await new Promise(resolve => setTimeout(resolve, 10));
            
            expect(callback).toHaveBeenCalled();
            expect(callback).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                users: expect.any(Array)
            }));
        });
        
        test('calls callback with users list', async () => {
            // Setup: login user first
            await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
            
            const callback = jest.fn();
            presenceService.onPresenceChanged(callback);
            
            await new Promise(resolve => setTimeout(resolve, 10));
            
            expect(callback).toHaveBeenCalled();
            const callArg = callback.mock.calls[callback.mock.calls.length - 1][0];
            expect(callArg.success).toBe(true);
            expect(Array.isArray(callArg.users)).toBe(true);
        });
        
        test('returns unsubscribe function', async () => {
            const callback = jest.fn();
            const unsubscribe = presenceService.onPresenceChanged(callback);
            
            expect(typeof unsubscribe).toBe('function');
            
            // Call unsubscribe
            unsubscribe();
            
            // Callback should no longer be in listeners list
            expect(presenceService.presenceListeners).not.toContain(callback);
        });
    });
    
    // Test Suite 8: cleanupOrphanedRecords
    describe('cleanupOrphanedRecords', () => {
        test('returns 0 deleted when no records present', async () => {
            const result = await presenceService.cleanupOrphanedRecords();
            
            expect(result.success).toBe(true);
            expect(result.deletedCount).toBe(0);
        });
        
        test('deletes records older than 24 hours', async () => {
            const oldLoginTime = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
            
            // Add old record
            await presenceService.realtimeDB.ref(`presence/old-user`).set({
                displayName: 'Old User',
                role: 'admin',
                loginTime: oldLoginTime,
                lastActivityTime: oldLoginTime,
                online: false,
                status: 'offline'
            });
            
            // Add recent record
            await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
            
            // Run cleanup
            const result = await presenceService.cleanupOrphanedRecords();
            
            expect(result.success).toBe(true);
            expect(result.deletedCount).toBe(1);
            
            // Verify old record was deleted
            const oldSnapshot = await presenceService.realtimeDB
                .ref(`presence/old-user`)
                .once('value');
            expect(oldSnapshot.exists()).toBe(false);
            
            // Verify recent record still exists
            const recentSnapshot = await presenceService.realtimeDB
                .ref(`presence/${testUserId}`)
                .once('value');
            expect(recentSnapshot.exists()).toBe(true);
        });
        
        test('uses custom maxAgeMs threshold', async () => {
            const customThreshold = 1 * 60 * 60 * 1000; // 1 hour
            const oldLoginTime = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago
            
            // Add old record
            await presenceService.realtimeDB.ref(`presence/old-user`).set({
                displayName: 'Old User',
                role: 'admin',
                loginTime: oldLoginTime,
                lastActivityTime: oldLoginTime,
                online: false,
                status: 'offline'
            });
            
            // Run cleanup with custom threshold
            const result = await presenceService.cleanupOrphanedRecords(customThreshold);
            
            expect(result.success).toBe(true);
            expect(result.deletedCount).toBe(1);
        });
    });
    
    // Test Suite 9: Integration - Full login/activity/logout flow
    describe('Integration - Full user flow', () => {
        test('complete login -> activity -> logout flow', async () => {
            // Login
            let result = await presenceService.recordLogin(
                testUserId,
                testDisplayName,
                testRole,
                loginTime
            );
            expect(result.success).toBe(true);
            
            // Get active users
            result = await presenceService.getActiveUsers();
            expect(result.success).toBe(true);
            expect(result.users.length).toBe(1);
            
            // Record activity
            await new Promise(resolve => setTimeout(resolve, 10));
            result = await presenceService.recordActivity(testUserId);
            expect(result.success).toBe(true);
            
            // Get user presence
            result = await presenceService.getUserPresence(testUserId);
            expect(result.success).toBe(true);
            expect(result.presence.status).toBe('active');
            
            // Logout
            result = await presenceService.recordLogout(testUserId);
            expect(result.success).toBe(true);
            
            // Verify user is gone
            result = await presenceService.getActiveUsers();
            expect(result.success).toBe(true);
            expect(result.users.length).toBe(0);
        });
    });
});
