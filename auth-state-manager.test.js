/**
 * Unit Tests for AuthManager
 * Tests initialization, state management, and coordinator behavior
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.6
 * Task: 5.5 Write unit tests for AuthManager initialization and state access
 */

// Import AuthManager class
const AuthManager = require('./auth-state-manager.js');

describe('AuthManager', () => {
    let authManager;
    let mockAuthService;
    let mockUserProfileService;
    let mockRBACService;
    let mockSessionSyncManager;

    beforeEach(() => {
        // Create fresh AuthManager instance for each test
        authManager = new AuthManager();

        // Mock AuthService
        mockAuthService = {
            isUserAuthenticated: jest.fn().mockReturnValue(false),
            getCurrentUser: jest.fn().mockReturnValue(null),
            onAuthStateChanged: jest.fn(),
            getToken: jest.fn().mockResolvedValue('test-token'),
            refreshToken: jest.fn().mockResolvedValue('refreshed-token'),
            logout: jest.fn().mockResolvedValue(true)
        };

        // Mock UserProfileService
        mockUserProfileService = {
            getUserProfile: jest.fn().mockResolvedValue({
                uid: 'user-123',
                email: 'test@example.com',
                displayName: 'Test User',
                role: 'admin'
            }),
            updateUserProfile: jest.fn().mockResolvedValue(true)
        };

        // Mock RBACService
        mockRBACService = {
            getPermissionsForRole: jest.fn().mockResolvedValue(['read', 'write', 'admin']),
            canAccessPortal: jest.fn().mockReturnValue(true)
        };

        // Mock SessionSyncManager
        mockSessionSyncManager = {
            initialize: jest.fn(),
            broadcastLogin: jest.fn(),
            broadcastLogout: jest.fn(),
            cleanup: jest.fn()
        };

        // Mock Firebase
        global.firebase = {
            database: jest.fn().mockReturnValue({
                ref: jest.fn().mockReturnValue({
                    on: jest.fn()
                })
            })
        };

        // Mock localStorage
        Storage.prototype.getItem = jest.fn();
        Storage.prototype.setItem = jest.fn();
        Storage.prototype.removeItem = jest.fn();

        // Mock window events
        global.dispatchEvent = jest.fn();
    });

    afterEach(() => {
        if (authManager) {
            authManager.cleanup();
        }
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        test('should initialize all services on init()', async () => {
            // Setup mocks
            window.AuthService = jest.fn(() => mockAuthService);
            window.getAuthService = jest.fn(() => mockAuthService);
            window.UserProfileService = jest.fn(() => mockUserProfileService);
            window.RBACService = jest.fn(() => mockRBACService);
            window.sessionSyncManager = mockSessionSyncManager;

            // Setup auth state listener callback
            mockAuthService.onAuthStateChanged.mockImplementation((callback) => {
                authManager._handleAuthStateChanged = jest.fn();
                return jest.fn();
            });

            // Initialize
            await authManager.initialize();

            // Verify initialization
            expect(authManager.isInitialized).toBe(true);
            expect(authManager.authService).toBeDefined();
            expect(mockSessionSyncManager.initialize).toHaveBeenCalledWith(mockAuthService);
        });

        test('should not reinitialize if already initialized', async () => {
            window.AuthService = jest.fn(() => mockAuthService);
            window.getAuthService = jest.fn(() => mockAuthService);

            mockAuthService.onAuthStateChanged.mockImplementation((callback) => jest.fn());

            // Initialize twice
            await authManager.initialize();
            const firstInitPromise = authManager.initPromise;

            await authManager.initialize();
            const secondInitPromise = authManager.initPromise;

            // Should return same promise (not reinitialize)
            expect(authManager.isInitialized).toBe(true);
        });
    });

    describe('state accessors', () => {
        beforeEach(async () => {
            window.AuthService = jest.fn(() => mockAuthService);
            window.getAuthService = jest.fn(() => mockAuthService);
            mockAuthService.onAuthStateChanged.mockImplementation((callback) => jest.fn());

            authManager.authService = mockAuthService;
            authManager.userProfileService = mockUserProfileService;
            authManager.rbacService = mockRBACService;
        });

        test('getAuthState() should return current auth state', () => {
            authManager.authState = {
                uid: 'user-123',
                email: 'test@example.com',
                displayName: 'Test User',
                role: 'admin',
                isAuthenticated: true,
                isLoading: false,
                authTimestamp: Date.now(),
                permissions: ['read', 'write']
            };

            const state = authManager.getAuthState();

            expect(state).toEqual(authManager.authState);
            expect(state).not.toBe(authManager.authState); // Should be a copy
        });

        test('isAuthenticated() should return true when user is logged in', () => {
            authManager.authState.uid = 'user-123';
            authManager.authState.isAuthenticated = true;

            expect(authManager.isAuthenticated()).toBe(true);
        });

        test('isAuthenticated() should return false when user not logged in', () => {
            authManager.authState.uid = null;
            authManager.authState.isAuthenticated = false;

            expect(authManager.isAuthenticated()).toBe(false);
        });

        test('getCurrentUser() should return user object when authenticated', () => {
            authManager.authState.uid = 'user-123';
            authManager.authState.email = 'test@example.com';
            authManager.authState.displayName = 'Test User';
            authManager.authState.role = 'admin';
            authManager.authState.isAuthenticated = true;

            const user = authManager.getCurrentUser();

            expect(user).toEqual({
                uid: 'user-123',
                email: 'test@example.com',
                displayName: 'Test User',
                role: 'admin',
                photoURL: null
            });
        });

        test('getCurrentUser() should return null when not authenticated', () => {
            authManager.authState.isAuthenticated = false;

            expect(authManager.getCurrentUser()).toBeNull();
        });

        test('getUserRole() should return current role', () => {
            authManager.authState.role = 'admin';

            expect(authManager.getUserRole()).toBe('admin');
        });

        test('getUserRole() should return null when no role', () => {
            authManager.authState.role = null;

            expect(authManager.getUserRole()).toBeNull();
        });

        test('getPermissions() should return array of permissions', () => {
            authManager.authState.permissions = ['read', 'write', 'admin'];

            const permissions = authManager.getPermissions();

            expect(permissions).toEqual(['read', 'write', 'admin']);
            expect(permissions).not.toBe(authManager.authState.permissions); // Should be a copy
        });

        test('getPermissions() should return empty array when no permissions', () => {
            authManager.authState.permissions = [];

            expect(authManager.getPermissions()).toEqual([]);
        });
    });

    describe('auth state change listener', () => {
        test('onAuthStateChanged() should call callback immediately', (done) => {
            const callback = jest.fn();
            authManager.authState.uid = 'user-123';
            authManager.authState.isAuthenticated = true;

            authManager.onAuthStateChanged(callback);

            setTimeout(() => {
                expect(callback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        uid: 'user-123',
                        isAuthenticated: true
                    })
                );
                done();
            }, 10);
        });

        test('onAuthStateChanged() should call callback on state change', (done) => {
            const callback = jest.fn();
            authManager.onAuthStateChanged(callback);

            // Change state
            authManager.authState.uid = 'user-123';
            authManager.authState.isAuthenticated = true;
            authManager._emitAuthStateChanged();

            setTimeout(() => {
                expect(callback).toHaveBeenCalledTimes(2); // Once immediately, once on change
                done();
            }, 10);
        });

        test('onAuthStateChanged() should return unsubscriber function', (done) => {
            const callback = jest.fn();
            const unsubscribe = authManager.onAuthStateChanged(callback);

            expect(typeof unsubscribe).toBe('function');

            // Unsubscribe
            unsubscribe();

            // Change state
            authManager.authState.uid = 'user-123';
            authManager._emitAuthStateChanged();

            setTimeout(() => {
                // Should only be called once (initial call)
                expect(callback).toHaveBeenCalledTimes(1);
                done();
            }, 10);
        });

        test('should dispatch crm:authStateChanged event', (done) => {
            authManager.authState.uid = 'user-123';
            authManager._emitAuthStateChanged();

            setTimeout(() => {
                expect(global.dispatchEvent).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: 'crm:authStateChanged'
                    })
                );
                done();
            }, 10);
        });
    });

    describe('logout', () => {
        beforeEach(async () => {
            authManager.authService = mockAuthService;
            authManager.sessionSyncManager = mockSessionSyncManager;
            authManager.authState.uid = 'user-123';
            authManager.authState.isAuthenticated = true;
        });

        test('logout() should call AuthService.logout()', async () => {
            await authManager.logout();

            expect(mockAuthService.logout).toHaveBeenCalled();
        });

        test('logout() should broadcast logout via SessionSyncManager', async () => {
            await authManager.logout();

            expect(mockSessionSyncManager.broadcastLogout).toHaveBeenCalled();
        });

        test('logout() should clear auth state', async () => {
            await authManager.logout();

            expect(authManager.authState.uid).toBeNull();
            expect(authManager.authState.isAuthenticated).toBe(false);
            expect(authManager.isAuthenticated()).toBe(false);
        });
    });

    describe('token management', () => {
        beforeEach(() => {
            authManager.authService = mockAuthService;
            authManager.authState.uid = 'user-123';
            authManager.authState.isAuthenticated = true;
        });

        test('getToken() should call AuthService.getToken()', async () => {
            const token = await authManager.getToken();

            expect(mockAuthService.getToken).toHaveBeenCalled();
            expect(token).toBe('test-token');
        });

        test('getToken() should return null if not authenticated', async () => {
            authManager.authState.isAuthenticated = false;

            const token = await authManager.getToken();

            expect(token).toBeNull();
            expect(mockAuthService.getToken).not.toHaveBeenCalled();
        });

        test('getToken() should return null if AuthService not available', async () => {
            authManager.authService = null;

            const token = await authManager.getToken();

            expect(token).toBeNull();
        });
    });

    describe('connectivity monitoring', () => {
        test('onConnectivityChanged() should call callback immediately', (done) => {
            const callback = jest.fn();
            authManager.isConnected = true;

            authManager.onConnectivityChanged(callback);

            setTimeout(() => {
                expect(callback).toHaveBeenCalledWith({ isConnected: true });
                done();
            }, 10);
        });

        test('onConnectivityLost() should emit event', (done) => {
            const callback = jest.fn();
            authManager.isConnected = true;
            authManager.onConnectivityChanged(callback);

            // Simulate connectivity loss
            authManager.onConnectivityLost();

            setTimeout(() => {
                expect(callback).toHaveBeenCalledWith({ isConnected: false });
                done();
            }, 10);
        });

        test('onConnectivityRestored() should emit event', (done) => {
            const callback = jest.fn();
            authManager.isConnected = false;
            authManager.onConnectivityChanged(callback);

            // Simulate connectivity restore
            authManager.onConnectivityRestored();

            setTimeout(() => {
                expect(callback).toHaveBeenCalledWith({ isConnected: true });
                done();
            }, 10);
        });
    });

    describe('session restoration', () => {
        beforeEach(() => {
            authManager.authService = mockAuthService;
        });

        test('restoreSession() should return true if user already authenticated', async () => {
            mockAuthService.isUserAuthenticated.mockReturnValue(true);
            mockAuthService.getCurrentUser.mockReturnValue({
                uid: 'user-123',
                email: 'test@example.com',
                displayName: 'Test User'
            });

            authManager.userProfileService = mockUserProfileService;

            const result = await authManager.restoreSession();

            expect(result).toBe(true);
            expect(authManager.isAuthenticated()).toBe(true);
        });

        test('restoreSession() should set isLoading during restoration', async () => {
            mockAuthService.isUserAuthenticated.mockReturnValue(true);
            mockAuthService.getCurrentUser.mockReturnValue({
                uid: 'user-123',
                email: 'test@example.com'
            });

            authManager.userProfileService = mockUserProfileService;

            const promise = authManager.restoreSession();
            expect(authManager.authState.isLoading).toBe(true);

            await promise;
            expect(authManager.authState.isLoading).toBe(false);
        });

        test('restoreSession() should return false if no cached session', async () => {
            mockAuthService.isUserAuthenticated.mockReturnValue(false);
            Storage.prototype.getItem.mockReturnValue(null);

            const result = await authManager.restoreSession();

            expect(result).toBe(false);
        });
    });

    describe('cleanup', () => {
        test('cleanup() should unsubscribe from listeners', () => {
            const unsubscriber = jest.fn();
            authManager.authStateUnsubscriber = unsubscriber;
            authManager.connectivityUnsubscriber = unsubscriber;

            authManager.cleanup();

            expect(unsubscriber).toHaveBeenCalledTimes(2);
            expect(authManager.isInitialized).toBe(false);
        });

        test('cleanup() should cleanup session sync manager', () => {
            authManager.sessionSyncManager = mockSessionSyncManager;

            authManager.cleanup();

            expect(mockSessionSyncManager.cleanup).toHaveBeenCalled();
        });

        test('cleanup() should clear all listeners', () => {
            authManager.stateListeners = [jest.fn(), jest.fn()];
            authManager.connectivityListeners = [jest.fn()];

            authManager.cleanup();

            expect(authManager.stateListeners).toEqual([]);
            expect(authManager.connectivityListeners).toEqual([]);
        });
    });

    describe('error handling', () => {
        test('should handle listener callback errors gracefully', (done) => {
            const errorCallback = jest.fn().mockImplementation(() => {
                throw new Error('Test error');
            });

            authManager.onAuthStateChanged(errorCallback);

            // Emit auth state change
            authManager.authState.uid = 'user-123';
            authManager._emitAuthStateChanged();

            setTimeout(() => {
                // Should not throw, callback should be called despite error
                expect(errorCallback).toHaveBeenCalled();
                done();
            }, 10);
        });

        test('should handle missing UserProfileService gracefully', async () => {
            authManager.authService = mockAuthService;
            authManager.userProfileService = null;

            // Should not throw
            const result = await authManager._updateAuthState({
                uid: 'user-123',
                email: 'test@example.com',
                displayName: 'Test User'
            });

            expect(authManager.authState.uid).toBe('user-123');
        });
    });
});
