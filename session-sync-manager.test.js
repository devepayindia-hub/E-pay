/**
 * Unit Tests for SessionSyncManager
 * Tests multi-tab session synchronization and event broadcasting
 * 
 * Requirements: 10.1, 10.2, 10.3
 */

describe('SessionSyncManager', () => {
    let sessionSyncManager;
    let mockAuthService;

    beforeEach(() => {
        // Reset SessionSyncManager singleton
        sessionSyncManager = new SessionSyncManager();
        
        mockAuthService = {
            getToken: jest.fn().mockResolvedValue('test-token-123'),
            getCurrentUser: jest.fn().mockReturnValue({
                uid: 'test-user-123',
                email: 'test@example.com'
            })
        };

        // Mock localStorage
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn()
        };
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock
        });

        // Mock BroadcastChannel if it exists
        global.BroadcastChannel = jest.fn().mockImplementation(() => ({
            postMessage: jest.fn(),
            close: jest.fn(),
            onmessage: null,
            onerror: null
        }));
    });

    afterEach(() => {
        sessionSyncManager.cleanup();
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        test('should initialize successfully', () => {
            sessionSyncManager.initialize(mockAuthService);

            expect(sessionSyncManager.isInitialized).toBe(true);
            expect(sessionSyncManager.authService).toBe(mockAuthService);
        });

        test('should not initialize twice', () => {
            sessionSyncManager.initialize(mockAuthService);
            
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
            sessionSyncManager.initialize(mockAuthService);

            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Already initialized'));
            warnSpy.mockRestore();
        });

        test('should use BroadcastChannel when supported', () => {
            sessionSyncManager.isBroadcastChannelSupported = true;
            sessionSyncManager.initialize(mockAuthService);

            expect(global.BroadcastChannel).toHaveBeenCalled();
            expect(sessionSyncManager.channel).not.toBeNull();
        });

        test('should fallback to storage events when BroadcastChannel not supported', () => {
            sessionSyncManager.isBroadcastChannelSupported = false;
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

            sessionSyncManager.initialize(mockAuthService);

            expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
            addEventListenerSpy.mockRestore();
        });
    });

    describe('login broadcasting', () => {
        test('should broadcast login message to other tabs', () => {
            sessionSyncManager.isBroadcastChannelSupported = true;
            sessionSyncManager.initialize(mockAuthService);

            const userData = {
                uid: 'user-123',
                email: 'user@example.com',
                displayName: 'Test User',
                photoURL: null,
                role: 'admin'
            };

            sessionSyncManager.broadcastLogin(userData);

            expect(sessionSyncManager.channel.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'LOGIN',
                    uid: 'user-123',
                    email: 'user@example.com'
                })
            );
        });

        test('should include tab ID in login message', () => {
            sessionSyncManager.isBroadcastChannelSupported = true;
            sessionSyncManager.initialize(mockAuthService);

            const userData = {
                uid: 'user-123',
                email: 'user@example.com',
                displayName: 'Test User',
                photoURL: null,
                role: 'admin'
            };

            sessionSyncManager.broadcastLogin(userData);

            expect(sessionSyncManager.channel.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    tabId: sessionSyncManager.tabId
                })
            );
        });

        test('should handle broadcast errors gracefully', () => {
            const error = new Error('Broadcast failed');
            sessionSyncManager.channel = {
                postMessage: jest.fn().mockImplementation(() => {
                    throw error;
                })
            };

            sessionSyncManager.initialize(mockAuthService);

            const errorSpy = jest.spyOn(console, 'error').mockImplementation();

            const userData = {
                uid: 'user-123',
                email: 'user@example.com'
            };

            sessionSyncManager.broadcastLogin(userData);

            expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to broadcast login'), error);
            errorSpy.mockRestore();
        });
    });

    describe('logout broadcasting', () => {
        test('should broadcast logout message to other tabs', () => {
            sessionSyncManager.isBroadcastChannelSupported = true;
            sessionSyncManager.initialize(mockAuthService);

            sessionSyncManager.broadcastLogout();

            expect(sessionSyncManager.channel.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'LOGOUT',
                    tabId: sessionSyncManager.tabId
                })
            );
        });
    });

    describe('session revocation broadcasting', () => {
        test('should broadcast session revocation message', () => {
            sessionSyncManager.isBroadcastChannelSupported = true;
            sessionSyncManager.initialize(mockAuthService);

            sessionSyncManager.broadcastSessionRevocation('user-123', 'Account disabled by admin');

            expect(sessionSyncManager.channel.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'SESSION_REVOKED',
                    uid: 'user-123',
                    reason: 'Account disabled by admin'
                })
            );
        });
    });

    describe('event subscriptions', () => {
        test('should subscribe to remote login events', () => {
            sessionSyncManager.initialize(mockAuthService);

            const callback = jest.fn();
            sessionSyncManager.onRemoteLogin(callback);

            // Simulate receiving login message from another tab
            const message = {
                type: 'LOGIN',
                tabId: 'other-tab-id',
                uid: 'user-123',
                email: 'user@example.com',
                displayName: 'Test User'
            };

            sessionSyncManager._handleMessage(message);

            expect(callback).toHaveBeenCalledWith(message);
        });

        test('should subscribe to remote logout events', () => {
            sessionSyncManager.initialize(mockAuthService);

            const callback = jest.fn();
            sessionSyncManager.onRemoteLogout(callback);

            // Simulate receiving logout message from another tab
            const message = {
                type: 'LOGOUT',
                tabId: 'other-tab-id'
            };

            sessionSyncManager._handleMessage(message);

            expect(callback).toHaveBeenCalledWith(message);
        });

        test('should subscribe to session revocation events', () => {
            sessionSyncManager.initialize(mockAuthService);

            const callback = jest.fn();
            sessionSyncManager.onSessionRevoked(callback);

            // Simulate receiving revocation message from another tab
            const message = {
                type: 'SESSION_REVOKED',
                tabId: 'other-tab-id',
                uid: 'user-123',
                reason: 'Account disabled'
            };

            sessionSyncManager._handleMessage(message);

            expect(callback).toHaveBeenCalledWith(message);
        });

        test('should return unsubscriber function from subscribe', () => {
            sessionSyncManager.initialize(mockAuthService);

            const callback = jest.fn();
            const unsubscribe = sessionSyncManager.onRemoteLogin(callback);

            expect(typeof unsubscribe).toBe('function');

            // Simulate message
            const message = {
                type: 'LOGIN',
                tabId: 'other-tab-id'
            };

            sessionSyncManager._handleMessage(message);
            expect(callback).toHaveBeenCalledTimes(1);

            // Unsubscribe
            unsubscribe();

            // Simulate another message
            sessionSyncManager._handleMessage(message);
            expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
        });

        test('should ignore messages from same tab', () => {
            sessionSyncManager.initialize(mockAuthService);

            const callback = jest.fn();
            sessionSyncManager.onRemoteLogin(callback);

            // Simulate message from same tab
            const message = {
                type: 'LOGIN',
                tabId: sessionSyncManager.tabId
            };

            sessionSyncManager._handleMessage(message);

            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('token refresh coordination', () => {
        test('should coordinate token refresh across tabs', async () => {
            sessionSyncManager.initialize(mockAuthService);

            const token = await sessionSyncManager.coordinateTokenRefresh();

            expect(token).toBe('test-token-123');
            expect(mockAuthService.getToken).toHaveBeenCalled();
        });

        test('should wait for ongoing refresh instead of creating duplicate', async () => {
            sessionSyncManager.initialize(mockAuthService);

            // Start first refresh
            const refreshPromise1 = sessionSyncManager.coordinateTokenRefresh();
            
            // Start second refresh immediately
            const refreshPromise2 = sessionSyncManager.coordinateTokenRefresh();

            // Both should resolve to same value
            const [token1, token2] = await Promise.all([refreshPromise1, refreshPromise2]);

            expect(token1).toBe('test-token-123');
            expect(token2).toBe('test-token-123');
            
            // getToken should only be called once (for the first refresh)
            expect(mockAuthService.getToken).toHaveBeenCalledTimes(1);
        });

        test('should handle token refresh request from other tabs', async () => {
            sessionSyncManager.isBroadcastChannelSupported = true;
            sessionSyncManager.initialize(mockAuthService);

            // Simulate token refresh request from another tab
            const message = {
                type: 'TOKEN_REFRESH_REQUEST',
                tabId: 'other-tab-id',
                requestId: 'req-123'
            };

            sessionSyncManager._handleMessage(message);

            // Wait for async handling
            await new Promise(resolve => setTimeout(resolve, 50));

            // Should have requested token from AuthService
            expect(mockAuthService.getToken).toHaveBeenCalled();

            // Should have sent response via channel
            expect(sessionSyncManager.channel.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'TOKEN_REFRESH_RESPONSE',
                    token: 'test-token-123'
                })
            );
        });
    });

    describe('primary tab detection', () => {
        test('should identify as primary tab when no primary set', () => {
            window.localStorage.getItem.mockReturnValue(null);
            
            sessionSyncManager.initialize(mockAuthService);
            
            const isPrimary = sessionSyncManager.isPrimaryTab();

            expect(isPrimary).toBe(true);
            expect(window.localStorage.setItem).toHaveBeenCalledWith(
                'primaryTabId',
                sessionSyncManager.tabId
            );
        });

        test('should not identify as primary when another tab is primary', () => {
            window.localStorage.getItem.mockReturnValue('other-tab-id');
            
            sessionSyncManager.initialize(mockAuthService);
            
            const isPrimary = sessionSyncManager.isPrimaryTab();

            expect(isPrimary).toBe(false);
        });
    });

    describe('cleanup', () => {
        test('should close BroadcastChannel on cleanup', () => {
            sessionSyncManager.isBroadcastChannelSupported = true;
            sessionSyncManager.initialize(mockAuthService);

            expect(sessionSyncManager.channel).not.toBeNull();

            sessionSyncManager.cleanup();

            expect(sessionSyncManager.channel.close).toHaveBeenCalled();
            expect(sessionSyncManager.channel).toBeNull();
        });

        test('should remove storage event listeners on cleanup', () => {
            sessionSyncManager.isBroadcastChannelSupported = false;
            const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

            sessionSyncManager.initialize(mockAuthService);
            sessionSyncManager.cleanup();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
            removeEventListenerSpy.mockRestore();
        });

        test('should clear all listeners on cleanup', () => {
            sessionSyncManager.initialize(mockAuthService);

            sessionSyncManager.onRemoteLogin(jest.fn());
            sessionSyncManager.onRemoteLogout(jest.fn());

            expect(sessionSyncManager.listeners.size).toBeGreaterThan(0);

            sessionSyncManager.cleanup();

            expect(sessionSyncManager.listeners.size).toBe(0);
        });

        test('should set initialized to false on cleanup', () => {
            sessionSyncManager.initialize(mockAuthService);
            expect(sessionSyncManager.isInitialized).toBe(true);

            sessionSyncManager.cleanup();

            expect(sessionSyncManager.isInitialized).toBe(false);
        });
    });

    describe('message handling', () => {
        test('should not fail when handler throws error', () => {
            sessionSyncManager.initialize(mockAuthService);

            const throwingCallback = jest.fn().mockImplementation(() => {
                throw new Error('Callback error');
            });
            const normalCallback = jest.fn();

            sessionSyncManager.onRemoteLogin(throwingCallback);
            sessionSyncManager.onRemoteLogin(normalCallback);

            const errorSpy = jest.spyOn(console, 'error').mockImplementation();

            const message = {
                type: 'LOGIN',
                tabId: 'other-tab-id'
            };

            sessionSyncManager._handleMessage(message);

            expect(throwingCallback).toHaveBeenCalled();
            expect(normalCallback).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalled();

            errorSpy.mockRestore();
        });
    });

    describe('storage event fallback', () => {
        test('should handle storage events when BroadcastChannel unavailable', () => {
            sessionSyncManager.isBroadcastChannelSupported = false;
            sessionSyncManager.initialize(mockAuthService);

            const callback = jest.fn();
            sessionSyncManager.onRemoteLogin(callback);

            // Simulate storage event
            const message = {
                type: 'LOGIN',
                tabId: 'other-tab-id',
                uid: 'user-123'
            };

            const storageEvent = new StorageEvent('storage', {
                key: 'sessionSyncMessage',
                newValue: JSON.stringify(message)
            });

            window.dispatchEvent(storageEvent);

            expect(callback).toHaveBeenCalledWith(message);
        });

        test('should ignore storage events from same tab', () => {
            sessionSyncManager.isBroadcastChannelSupported = false;
            sessionSyncManager.initialize(mockAuthService);

            const callback = jest.fn();
            sessionSyncManager.onRemoteLogin(callback);

            // Simulate storage event from same tab
            const message = {
                type: 'LOGIN',
                tabId: sessionSyncManager.tabId
            };

            const storageEvent = new StorageEvent('storage', {
                key: 'sessionSyncMessage',
                newValue: JSON.stringify(message)
            });

            window.dispatchEvent(storageEvent);

            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('tab identification', () => {
        test('should generate unique tab ID on creation', () => {
            const manager1 = new SessionSyncManager();
            const manager2 = new SessionSyncManager();

            expect(manager1.tabId).not.toBe(manager2.tabId);
            expect(manager1.tabId).toMatch(/^tab_\d+_[a-z0-9]+$/);
        });
    });
});
