/**
 * Unit Tests for AuthService
 * Tests auth state listeners, event emission, and session management
 * 
 * Requirements: 1.1, 1.2, 1.3
 */

describe('AuthService', () => {
    let authService;
    let mockAuth;
    let mockUser;

    beforeEach(() => {
        // Reset AuthService singleton
        authService = new AuthService();
        
        // Mock Firebase Auth
        mockUser = {
            uid: 'test-user-123',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: null,
            getIdToken: jest.fn().mockResolvedValue('test-token-123')
        };

        mockAuth = {
            onAuthStateChanged: jest.fn(),
            signInWithEmailAndPassword: jest.fn(),
            signOut: jest.fn(),
            currentUser: mockUser,
            sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
            confirmPasswordReset: jest.fn().mockResolvedValue(undefined)
        };

        // Mock session/local storage
        Storage.prototype.getItem = jest.fn();
        Storage.prototype.setItem = jest.fn();
        Storage.prototype.removeItem = jest.fn();
    });

    afterEach(() => {
        authService.cleanup();
    });

    describe('initialization', () => {
        test('should initialize with Firebase Auth instance', async () => {
            mockAuth.onAuthStateChanged.mockImplementation((callback) => {
                // Simulate user logged in
                setTimeout(() => callback(mockUser), 10);
                return jest.fn(); // Return unsubscriber
            });

            await authService.initialize(mockAuth);

            expect(authService.initialized).toBe(true);
            expect(authService.auth).toBe(mockAuth);
            expect(mockAuth.onAuthStateChanged).toHaveBeenCalled();
        });

        test('should emit initialized event after initialization', async () => {
            const initListener = jest.fn();
            
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());

            await authService.initialize(mockAuth);
            authService.subscribe('initialized', initListener);

            // Wait for event
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(initListener).toHaveBeenCalled();
        });

        test('should not initialize twice', async () => {
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());

            await authService.initialize(mockAuth);
            
            // Try to initialize again
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
            await authService.initialize(mockAuth);

            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Already initialized'));
            warnSpy.mockRestore();
        });
    });

    describe('onAuthStateChanged listener', () => {
        test('should emit authStateChanged event when user logs in', async () => {
            const stateChangeListener = jest.fn();
            
            // Set up listener to capture the callback
            let firebaseCallback;
            mockAuth.onAuthStateChanged.mockImplementation((callback) => {
                firebaseCallback = callback;
                return jest.fn();
            });

            await authService.initialize(mockAuth);
            authService.subscribe('authStateChanged', stateChangeListener);

            // Trigger login
            await firebaseCallback(mockUser);

            expect(stateChangeListener).toHaveBeenCalled();
            expect(stateChangeListener).toHaveBeenCalledWith(
                expect.objectContaining({
                    user: expect.objectContaining({
                        uid: 'test-user-123',
                        email: 'test@example.com',
                        isAuthenticated: true
                    }),
                    isAuthenticated: true
                })
            );
        });

        test('should emit authStateChanged event when user logs out', async () => {
            const stateChangeListener = jest.fn();
            
            let firebaseCallback;
            mockAuth.onAuthStateChanged.mockImplementation((callback) => {
                firebaseCallback = callback;
                return jest.fn();
            });

            await authService.initialize(mockAuth);
            
            // First trigger login
            await firebaseCallback(mockUser);
            stateChangeListener.mockClear();

            // Then trigger logout
            authService.subscribe('authStateChanged', stateChangeListener);
            await firebaseCallback(null);

            expect(stateChangeListener).toHaveBeenCalledWith(
                expect.objectContaining({
                    user: null,
                    isAuthenticated: false
                })
            );
        });

        test('should trigger callback within 100ms of Firebase state change', async () => {
            let firebaseCallback;
            mockAuth.onAuthStateChanged.mockImplementation((callback) => {
                firebaseCallback = callback;
                return jest.fn();
            });

            await authService.initialize(mockAuth);

            // Measure callback execution time
            const startTime = performance.now();
            await firebaseCallback(mockUser);
            const endTime = performance.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(100);
        });

        test('should set current user after login', async () => {
            let firebaseCallback;
            mockAuth.onAuthStateChanged.mockImplementation((callback) => {
                firebaseCallback = callback;
                return jest.fn();
            });

            await authService.initialize(mockAuth);

            expect(authService.getCurrentUser()).toBeNull();

            await firebaseCallback(mockUser);

            const currentUser = authService.getCurrentUser();
            expect(currentUser).toEqual(
                expect.objectContaining({
                    uid: 'test-user-123',
                    email: 'test@example.com',
                    isAuthenticated: true
                })
            );
        });

        test('should clear current user after logout', async () => {
            let firebaseCallback;
            mockAuth.onAuthStateChanged.mockImplementation((callback) => {
                firebaseCallback = callback;
                return jest.fn();
            });

            await authService.initialize(mockAuth);

            // Login
            await firebaseCallback(mockUser);
            expect(authService.getCurrentUser()).not.toBeNull();

            // Logout
            await firebaseCallback(null);
            expect(authService.getCurrentUser()).toBeNull();
        });
    });

    describe('login/logout workflows', () => {
        test('should emit login event on successful login', async () => {
            const loginListener = jest.fn();
            
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            mockAuth.signInWithEmailAndPassword.mockResolvedValue({
                user: mockUser
            });

            await authService.initialize(mockAuth);
            authService.subscribe('login', loginListener);

            await authService.login('test@example.com', 'password123');

            expect(loginListener).toHaveBeenCalled();
            expect(loginListener).toHaveBeenCalledWith(
                expect.objectContaining({
                    user: expect.objectContaining({
                        uid: 'test-user-123',
                        email: 'test@example.com'
                    })
                })
            );
        });

        test('should emit loginFailed event on failed login', async () => {
            const loginFailedListener = jest.fn();
            
            const error = new Error('Invalid credentials');
            error.code = 'auth/wrong-password';
            
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            mockAuth.signInWithEmailAndPassword.mockRejectedValue(error);

            await authService.initialize(mockAuth);
            authService.subscribe('loginFailed', loginFailedListener);

            try {
                await authService.login('test@example.com', 'wrongpassword');
            } catch (e) {
                // Expected to throw
            }

            expect(loginFailedListener).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'test@example.com',
                    errorCode: 'auth/wrong-password'
                })
            );
        });

        test('should emit logout event on logout', async () => {
            const logoutListener = jest.fn();
            
            let firebaseCallback;
            mockAuth.onAuthStateChanged.mockImplementation((callback) => {
                firebaseCallback = callback;
                return jest.fn();
            });
            mockAuth.signOut.mockResolvedValue(undefined);

            await authService.initialize(mockAuth);
            
            // Login first
            await firebaseCallback(mockUser);
            authService.subscribe('logout', logoutListener);

            // Then logout
            await authService.logout();

            expect(logoutListener).toHaveBeenCalled();
        });

        test('should clear token on logout', async () => {
            let firebaseCallback;
            mockAuth.onAuthStateChanged.mockImplementation((callback) => {
                firebaseCallback = callback;
                return jest.fn();
            });
            mockAuth.signOut.mockResolvedValue(undefined);

            await authService.initialize(mockAuth);
            
            // Login first
            await firebaseCallback(mockUser);
            
            // Verify token was stored
            expect(sessionStorage.setItem).toHaveBeenCalledWith(
                'firebase_token',
                expect.anything()
            );

            // Logout
            await authService.logout();

            // Verify token was cleared
            expect(sessionStorage.removeItem).toHaveBeenCalledWith('firebase_token');
        });
    });

    describe('onAuthStateChanged subscription', () => {
        test('should call callback on auth state change', async () => {
            const callback = jest.fn();
            
            let firebaseCallback;
            mockAuth.onAuthStateChanged.mockImplementation((callback) => {
                firebaseCallback = callback;
                return jest.fn();
            });

            await authService.initialize(mockAuth);
            authService.onAuthStateChanged(callback);

            await firebaseCallback(mockUser);

            expect(callback).toHaveBeenCalled();
        });

        test('should return unsubscriber function', async () => {
            const callback = jest.fn();
            
            let firebaseCallback;
            mockAuth.onAuthStateChanged.mockImplementation((cb) => {
                firebaseCallback = cb;
                return jest.fn();
            });

            await authService.initialize(mockAuth);
            const unsubscribe = authService.onAuthStateChanged(callback);

            // Verify unsubscriber is a function
            expect(typeof unsubscribe).toBe('function');

            // Trigger event
            await firebaseCallback(mockUser);
            expect(callback).toHaveBeenCalledTimes(1);

            // Unsubscribe
            unsubscribe();

            // Trigger event again - callback should not be called
            await firebaseCallback(mockUser);
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    describe('user state', () => {
        test('should return null for current user when not authenticated', async () => {
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            
            await authService.initialize(mockAuth);

            expect(authService.getCurrentUser()).toBeNull();
            expect(authService.isAuthenticated()).toBe(false);
        });

        test('should return current user when authenticated', async () => {
            let firebaseCallback;
            mockAuth.onAuthStateChanged.mockImplementation((callback) => {
                firebaseCallback = callback;
                return jest.fn();
            });

            await authService.initialize(mockAuth);
            await firebaseCallback(mockUser);

            expect(authService.isAuthenticated()).toBe(true);
            expect(authService.getCurrentUser()).toEqual(
                expect.objectContaining({
                    uid: 'test-user-123',
                    isAuthenticated: true
                })
            );
        });
    });

    describe('event emission', () => {
        test('should emit events as window CustomEvents', async () => {
            const eventListener = jest.fn();
            const eventType = 'auth:testEvent';
            
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            await authService.initialize(mockAuth);

            window.addEventListener(eventType, eventListener);

            // Manually emit event through private method
            authService._emitEvent('testEvent', { data: 'test' });

            expect(eventListener).toHaveBeenCalled();
            expect(eventListener).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { data: 'test' }
                })
            );

            window.removeEventListener(eventType, eventListener);
        });

        test('should not fail if listener throws error', async () => {
            const throwingListener = jest.fn().mockImplementation(() => {
                throw new Error('Listener error');
            });
            const normalListener = jest.fn();

            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            await authService.initialize(mockAuth);

            authService.subscribe('testEvent', throwingListener);
            authService.subscribe('testEvent', normalListener);

            const errorSpy = jest.spyOn(console, 'error').mockImplementation();
            authService._emitEvent('testEvent', { data: 'test' });

            // Both listeners should have been called
            expect(throwingListener).toHaveBeenCalled();
            expect(normalListener).toHaveBeenCalled();

            errorSpy.mockRestore();
        });
    });

    describe('cleanup', () => {
        test('should unsubscribe Firebase listeners', async () => {
            const unsubscribe = jest.fn();
            mockAuth.onAuthStateChanged.mockImplementation(() => unsubscribe);

            await authService.initialize(mockAuth);
            authService.cleanup();

            expect(unsubscribe).toHaveBeenCalled();
        });

        test('should clear all event listeners', async () => {
            const listener = jest.fn();
            
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            await authService.initialize(mockAuth);

            authService.subscribe('authStateChanged', listener);
            expect(authService.listeners.size).toBeGreaterThan(0);

            authService.cleanup();

            expect(authService.listeners.size).toBe(0);
        });

        test('should set initialized to false', async () => {
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            
            await authService.initialize(mockAuth);
            expect(authService.initialized).toBe(true);

            authService.cleanup();

            expect(authService.initialized).toBe(false);
        });
    });

    describe('password reset', () => {
        test('should send password reset email', async () => {
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            
            await authService.initialize(mockAuth);

            await authService.sendPasswordResetEmail('test@example.com');

            expect(mockAuth.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
        });

        test('should emit passwordResetEmailSent event', async () => {
            const listener = jest.fn();
            
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            await authService.initialize(mockAuth);

            authService.subscribe('passwordResetEmailSent', listener);

            await authService.sendPasswordResetEmail('test@example.com');

            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'test@example.com'
                })
            );
        });

        test('should confirm password reset', async () => {
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            
            await authService.initialize(mockAuth);

            await authService.confirmPasswordReset('reset-code-123', 'newpassword123');

            expect(mockAuth.confirmPasswordReset).toHaveBeenCalledWith('reset-code-123', 'newpassword123');
        });
    });

    describe('token management', () => {
        test('should get token via getToken()', async () => {
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            mockAuth.currentUser = mockUser;

            await authService.initialize(mockAuth);

            const token = await authService.getToken();

            expect(token).toBe('test-token-123');
            expect(mockUser.getIdToken).toHaveBeenCalled();
        });

        test('should store token on successful auth', async () => {
            let firebaseCallback;
            mockAuth.onAuthStateChanged.mockImplementation((callback) => {
                firebaseCallback = callback;
                return jest.fn();
            });

            await authService.initialize(mockAuth);
            await firebaseCallback(mockUser);

            expect(sessionStorage.setItem).toHaveBeenCalledWith(
                'firebase_token',
                'test-token-123'
            );
        });

        test('should throw error when getting token without authentication', async () => {
            mockAuth.onAuthStateChanged.mockImplementation(() => jest.fn());
            mockAuth.currentUser = null;

            await authService.initialize(mockAuth);

            await expect(authService.getToken()).rejects.toThrow('User not authenticated');
        });
    });
});
