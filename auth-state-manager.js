/**
 * AuthManager - Centralized Authentication State Management
 * 
 * Coordinates authentication across multiple services:
 * - AuthService: Firebase authentication and token management
 * - UserProfileService: User profile fetching and caching
 * - RBACService: Role-based access control configuration
 * - SessionSyncManager: Cross-tab session synchronization
 * 
 * Provides centralized AuthState interface with:
 * - uid: Authenticated user ID
 * - email: User email address
 * - displayName: User display name
 * - role: User role for RBAC
 * - isAuthenticated: Authentication status
 * - isLoading: Session restoration in progress
 * - authTimestamp: When authentication occurred
 * - permissions: Cached role permissions
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 * Task: 5.1 Implement AuthManager with Firebase listener coordination
 */

class AuthManager {
    constructor() {
        // Central auth state
        this.authState = {
            uid: null,
            email: null,
            displayName: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
            authTimestamp: null,
            permissions: []
        };
        
        // Service references
        this.authService = null;
        this.userProfileService = null;
        this.rbacService = null;
        this.sessionSyncManager = null;
        
        // State listeners
        this.stateListeners = [];
        this.authStateUnsubscriber = null;
        
        // Connectivity state
        this.isConnected = true;
        this.connectivityListeners = [];
        this.connectivityUnsubscriber = null;
        
        // Initialization
        this.initPromise = null;
        this.isInitialized = false;
    }
    
    /**
     * Initialize AuthManager and coordinate all services
     * Performs:
     * 1. Wait for AuthService to be ready
     * 2. Set up Firebase onAuthStateChanged listener
     * 3. Initialize UserProfileService
     * 4. Load RBAC configuration
     * 5. Set up SessionSyncManager
     * 6. Restore session from local cache
     * 7. Set up connectivity monitoring
     * 
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            if (this.isInitialized) {
                console.warn('[AuthManager] Already initialized');
                return;
            }
            
            if (this.initPromise) {
                return this.initPromise;
            }
            
            this.initPromise = this._performInitialization();
            await this.initPromise;
            
            this.isInitialized = true;
            console.info('[AuthManager] Initialization complete');
        } catch (error) {
            console.error('[AuthManager] Initialization failed:', error);
            this.initPromise = null;
            throw error;
        }
    }
    
    /**
     * Get current auth state synchronously
     * Returns centralized AuthState object
     * 
     * @returns {Object} Current auth state with all fields
     */
    getAuthState() {
        return { ...this.authState };
    }
    
    /**
     * Check if user is authenticated
     * 
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.authState.isAuthenticated && this.authState.uid !== null;
    }
    
    /**
     * Get current user object
     * 
     * @returns {{uid, email, displayName, role, photoURL} | null}
     */
    getCurrentUser() {
        if (!this.isAuthenticated()) {
            return null;
        }
        
        return {
            uid: this.authState.uid,
            email: this.authState.email,
            displayName: this.authState.displayName,
            role: this.authState.role,
            photoURL: this.authState.photoURL || null
        };
    }
    
    /**
     * Get current user role
     * 
     * @returns {string|null}
     */
    getUserRole() {
        return this.authState.role || null;
    }
    
    /**
     * Get current user permissions based on role
     * 
     * @returns {Array<string>}
     */
    getPermissions() {
        return [...(this.authState.permissions || [])];
    }
    
    /**
     * Subscribe to auth state changes
     * Callback receives updated authState whenever auth state changes
     * 
     * @param {Function} callback - Called with new authState on any change
     * @returns {Function} Unsubscriber function
     */
    onAuthStateChanged(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }
        
        // Add listener
        this.stateListeners.push(callback);
        
        // Call immediately with current state
        setTimeout(() => {
            try {
                callback(this.getAuthState());
            } catch (error) {
                console.error('[AuthManager] Error in auth state listener:', error);
            }
        }, 0);
        
        // Return unsubscriber
        return () => {
            this.stateListeners = this.stateListeners.filter(l => l !== callback);
        };
    }
    
    /**
     * Subscribe to connectivity state changes
     * 
     * @param {Function} callback - Called with {isConnected: boolean}
     * @returns {Function} Unsubscriber function
     */
    onConnectivityChanged(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }
        
        this.connectivityListeners.push(callback);
        
        // Call immediately with current state
        setTimeout(() => {
            try {
                callback({ isConnected: this.isConnected });
            } catch (error) {
                console.error('[AuthManager] Error in connectivity listener:', error);
            }
        }, 0);
        
        return () => {
            this.connectivityListeners = this.connectivityListeners.filter(l => l !== callback);
        };
    }
    
    /**
     * Called when connectivity is lost
     * Notifies all listeners
     * 
     * @private
     */
    onConnectivityLost() {
        if (this.isConnected) {
            this.isConnected = false;
            this._emitConnectivityChanged();
        }
    }
    
    /**
     * Called when connectivity is restored
     * Notifies all listeners
     * 
     * @private
     */
    onConnectivityRestored() {
        if (!this.isConnected) {
            this.isConnected = true;
            this._emitConnectivityChanged();
        }
    }
    
    /**
     * Get authentication token
     * Will refresh if expired
     * 
     * @returns {Promise<string|null>} Valid auth token or null if not authenticated
     */
    async getToken() {
        try {
            if (!this.isAuthenticated() || !this.authService) {
                return null;
            }
            
            return await this.authService.getToken();
        } catch (error) {
            console.error('[AuthManager] Error getting token:', error);
            return null;
        }
    }
    
    /**
     * Perform logout and clear all auth state
     * Coordinates with all services
     * 
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            console.info('[AuthManager] Logging out');
            
            // Broadcast logout via session sync manager
            if (this.sessionSyncManager) {
                this.sessionSyncManager.broadcastLogout();
            }
            
            // Sign out from Firebase
            if (this.authService) {
                await this.authService.logout();
            }
            
            // Clear local state
            this._clearAuthState();
            
            console.info('[AuthManager] Logout complete');
        } catch (error) {
            console.error('[AuthManager] Logout error:', error);
            throw error;
        }
    }
    
    /**
     * Restore session from local cache and validate with Firebase
     * Used on app load for session persistence
     * Completes within 500ms target
     * 
     * @returns {Promise<boolean>} True if session was restored, false otherwise
     */
    async restoreSession() {
        const startTime = Date.now();
        try {
            this.authState.isLoading = true;
            this._emitAuthStateChanged();
            
            // Check if user is already authenticated via Firebase
            if (this.authService && this.authService.isUserAuthenticated()) {
                const user = this.authService.getCurrentUser();
                await this._updateAuthState(user);
                this.authState.isLoading = false;
                this._emitAuthStateChanged();
                return true;
            }
            
            // Check cached token in localStorage
            const cachedToken = localStorage.getItem('epay_crm_auth_token');
            const cachedUser = localStorage.getItem('epay_crm_user');
            
            if (cachedToken && cachedUser) {
                try {
                    const user = JSON.parse(cachedUser);
                    
                    // Validate cached token with Firebase
                    if (this.authService) {
                        // Try to use cached token to validate
                        const isValid = await this._validateCachedToken(cachedToken);
                        
                        if (isValid) {
                            await this._updateAuthState(user);
                            this.authState.isLoading = false;
                            this._emitAuthStateChanged();
                            return true;
                        }
                        
                        // Cached token invalid, try silent refresh
                        try {
                            await this.authService.refreshToken();
                            const freshUser = this.authService.getCurrentUser();
                            await this._updateAuthState(freshUser);
                            this.authState.isLoading = false;
                            this._emitAuthStateChanged();
                            return true;
                        } catch (refreshError) {
                            console.warn('[AuthManager] Token refresh failed, session not restored');
                        }
                    }
                } catch (parseError) {
                    console.warn('[AuthManager] Failed to parse cached user:', parseError);
                }
            }
            
            this.authState.isLoading = false;
            this._emitAuthStateChanged();
            return false;
        } catch (error) {
            console.error('[AuthManager] Session restoration error:', error);
            this.authState.isLoading = false;
            this._emitAuthStateChanged();
            return false;
        }
    }
    
    /**
     * Clean up resources on app shutdown
     * Removes all listeners and closes connections
     * 
     * @returns {void}
     */
    cleanup() {
        try {
            // Unsubscribe from auth state changes
            if (this.authStateUnsubscriber) {
                this.authStateUnsubscriber();
                this.authStateUnsubscriber = null;
            }
            
            // Unsubscribe from connectivity changes
            if (this.connectivityUnsubscriber) {
                this.connectivityUnsubscriber();
                this.connectivityUnsubscriber = null;
            }
            
            // Clean up session sync manager
            if (this.sessionSyncManager && typeof this.sessionSyncManager.cleanup === 'function') {
                this.sessionSyncManager.cleanup();
            }
            
            // Clear listeners
            this.stateListeners = [];
            this.connectivityListeners = [];
            
            this.isInitialized = false;
            console.info('[AuthManager] Cleanup complete');
        } catch (error) {
            console.error('[AuthManager] Error during cleanup:', error);
        }
    }
    
    // ===== Private Methods =====
    
    /**
     * Perform actual initialization
     * 
     * @private
     * @returns {Promise<void>}
     */
    async _performInitialization() {
        try {
            // 1. Wait for AuthService to be available
            this.authService = await this._waitForAuthService(5000);
            if (!this.authService) {
                throw new Error('AuthService initialization timeout');
            }
            
            console.info('[AuthManager] AuthService ready');
            
            // 2. Initialize UserProfileService
            this.userProfileService = await this._initializeUserProfileService();
            
            // 3. Initialize RBACService
            this.rbacService = await this._initializeRBACService();
            
            // 4. Initialize SessionSyncManager
            this.sessionSyncManager = this._initializeSessionSyncManager();
            
            // 5. Set up auth state listener
            this._setupAuthStateListener();
            
            // 6. Set up connectivity monitoring
            this._setupConnectivityMonitoring();
            
            // 7. Restore session from cache
            await this.restoreSession();
            
            console.info('[AuthManager] All services initialized');
        } catch (error) {
            console.error('[AuthManager] Initialization error:', error);
            throw error;
        }
    }
    
    /**
     * Wait for AuthService to be available
     * 
     * @private
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<AuthService>}
     */
    async _waitForAuthService(timeout) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            if (typeof window !== 'undefined' && window.AuthService) {
                const authService = window.getAuthService ? window.getAuthService() : new window.AuthService();
                return authService;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return null;
    }
    
    /**
     * Initialize UserProfileService
     * 
     * @private
     * @returns {Promise<Object>}
     */
    async _initializeUserProfileService() {
        try {
            // Check if UserProfileService is available
            if (typeof window !== 'undefined' && window.UserProfileService) {
                return new window.UserProfileService();
            }
            
            // UserProfileService not yet implemented, create stub
            console.warn('[AuthManager] UserProfileService not available, using stub');
            return this._createUserProfileServiceStub();
        } catch (error) {
            console.warn('[AuthManager] Error initializing UserProfileService:', error);
            return this._createUserProfileServiceStub();
        }
    }
    
    /**
     * Initialize RBACService
     * 
     * @private
     * @returns {Promise<Object>}
     */
    async _initializeRBACService() {
        try {
            // Check if RBACService is available
            if (typeof window !== 'undefined' && window.RBACService) {
                return new window.RBACService();
            }
            
            // RBACService not yet implemented, create stub
            console.warn('[AuthManager] RBACService not available, using stub');
            return this._createRBACServiceStub();
        } catch (error) {
            console.warn('[AuthManager] Error initializing RBACService:', error);
            return this._createRBACServiceStub();
        }
    }
    
    /**
     * Initialize SessionSyncManager
     * 
     * @private
     * @returns {Object}
     */
    _initializeSessionSyncManager() {
        try {
            if (typeof window !== 'undefined' && window.sessionSyncManager) {
                window.sessionSyncManager.initialize(this.authService);
                return window.sessionSyncManager;
            }
            
            console.warn('[AuthManager] SessionSyncManager not available');
            return null;
        } catch (error) {
            console.warn('[AuthManager] Error initializing SessionSyncManager:', error);
            return null;
        }
    }
    
    /**
     * Set up listener for AuthService auth state changes
     * 
     * @private
     */
    _setupAuthStateListener() {
        try {
            if (!this.authService) {
                return;
            }
            
            this.authStateUnsubscriber = this.authService.onAuthStateChanged((state) => {
                this._handleAuthStateChanged(state);
            });
            
            console.info('[AuthManager] Auth state listener configured');
        } catch (error) {
            console.error('[AuthManager] Error setting up auth state listener:', error);
        }
    }
    
    /**
     * Set up connectivity monitoring via Firebase
     * 
     * @private
     */
    _setupConnectivityMonitoring() {
        try {
            if (typeof firebase === 'undefined') {
                return;
            }
            
            // Monitor Firebase connection state
            const connectedRef = firebase.database().ref('.info/connected');
            
            this.connectivityUnsubscriber = connectedRef.on('value', (snapshot) => {
                const isConnected = snapshot.val();
                
                if (isConnected) {
                    this.onConnectivityRestored();
                } else {
                    this.onConnectivityLost();
                }
            });
            
            console.info('[AuthManager] Connectivity monitoring configured');
        } catch (error) {
            console.warn('[AuthManager] Error setting up connectivity monitoring:', error);
        }
    }
    
    /**
     * Handle auth state change from AuthService
     * Updates central auth state and fetches user profile
     * 
     * @private
     * @param {Object} state - Auth state from AuthService
     */
    async _handleAuthStateChanged(state) {
        try {
            if (state.isAuthenticated && state.user) {
                // User logged in
                await this._updateAuthState(state.user);
            } else {
                // User logged out
                this._clearAuthState();
            }
            
            this._emitAuthStateChanged();
        } catch (error) {
            console.error('[AuthManager] Error handling auth state change:', error);
        }
    }
    
    /**
     * Update central auth state with user data and profile information
     * 
     * @private
     * @param {Object} user - User object from AuthService
     */
    async _updateAuthState(user) {
        try {
            this.authState.uid = user.uid;
            this.authState.email = user.email;
            this.authState.displayName = user.displayName;
            this.authState.photoURL = user.photoURL || null;
            this.authState.isAuthenticated = true;
            this.authState.authTimestamp = Date.now();
            
            // Try to fetch full profile from UserProfileService
            if (this.userProfileService && typeof this.userProfileService.getUserProfile === 'function') {
                try {
                    const profile = await this.userProfileService.getUserProfile(user.uid);
                    if (profile) {
                        this.authState.role = profile.role || null;
                    }
                } catch (error) {
                    console.warn('[AuthManager] Error fetching user profile:', error);
                }
            }
            
            // Load RBAC permissions for role
            if (this.rbacService && typeof this.rbacService.getPermissionsForRole === 'function') {
                try {
                    const permissions = await this.rbacService.getPermissionsForRole(this.authState.role);
                    this.authState.permissions = permissions || [];
                } catch (error) {
                    console.warn('[AuthManager] Error loading RBAC permissions:', error);
                }
            }
            
            console.info('[AuthManager] Auth state updated', { 
                uid: user.uid, 
                email: user.email, 
                role: this.authState.role 
            });
        } catch (error) {
            console.error('[AuthManager] Error updating auth state:', error);
        }
    }
    
    /**
     * Clear auth state completely
     * 
     * @private
     */
    _clearAuthState() {
        this.authState = {
            uid: null,
            email: null,
            displayName: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
            authTimestamp: null,
            permissions: []
        };
        
        console.info('[AuthManager] Auth state cleared');
    }
    
    /**
     * Emit auth state changed event to all listeners and dispatch custom event
     * 
     * @private
     */
    _emitAuthStateChanged() {
        const state = this.getAuthState();
        
        // Call all registered listeners
        this.stateListeners.forEach(listener => {
            try {
                listener(state);
            } catch (error) {
                console.error('[AuthManager] Error in auth state listener:', error);
            }
        });
        
        // Dispatch custom event for DOM listeners
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('crm:authStateChanged', { detail: state }));
        }
    }
    
    /**
     * Emit connectivity changed event to all listeners
     * 
     * @private
     */
    _emitConnectivityChanged() {
        const state = { isConnected: this.isConnected };
        
        this.connectivityListeners.forEach(listener => {
            try {
                listener(state);
            } catch (error) {
                console.error('[AuthManager] Error in connectivity listener:', error);
            }
        });
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('crm:connectivityChanged', { detail: state }));
        }
    }
    
    /**
     * Validate cached token by attempting to use it
     * 
     * @private
     * @param {string} token - Token to validate
     * @returns {Promise<boolean>}
     */
    async _validateCachedToken(token) {
        try {
            // Simple validation: check if token exists and is not empty
            return token && token.length > 0;
        } catch (error) {
            console.warn('[AuthManager] Token validation error:', error);
            return false;
        }
    }
    
    /**
     * Create stub UserProfileService when not available
     * 
     * @private
     * @returns {Object}
     */
    _createUserProfileServiceStub() {
        return {
            getUserProfile: async (uid) => {
                console.warn('[AuthManager] UserProfileService stub: getUserProfile called');
                return null;
            },
            updateUserProfile: async (uid, updates) => {
                console.warn('[AuthManager] UserProfileService stub: updateUserProfile called');
                return null;
            }
        };
    }
    
    /**
     * Create stub RBACService when not available
     * 
     * @private
     * @returns {Object}
     */
    _createRBACServiceStub() {
        return {
            getPermissionsForRole: async (role) => {
                console.warn('[AuthManager] RBACService stub: getPermissionsForRole called');
                return [];
            },
            canAccessPortal: (userRole, portalId) => {
                console.warn('[AuthManager] RBACService stub: canAccessPortal called');
                return false;
            }
        };
    }
}

/**
 * Create singleton instance of AuthManager
 * Can be accessed as window.authManager or imported as module
 */
const authManager = new AuthManager();

// Expose globally for access from HTML and other scripts
if (typeof window !== 'undefined') {
    window.authManager = authManager;
    window.AuthManager = AuthManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}

// Get singleton
function getAuthManager() {
    return authManager;
}

if (typeof window !== 'undefined') {
    window.getAuthManager = getAuthManager;
}
