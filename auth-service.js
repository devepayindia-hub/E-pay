/**
 * AuthService - Firebase Authentication Integration
 * 
 * Provides complete authentication functionality:
 * - Email/password login and logout
 * - Session token management and refresh
 * - Password reset workflow
 * - Auth state change listeners
 * - Local encrypted token storage
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 * Task: 2.1 Implement AuthService with Firebase Authentication integration
 */

class AuthService {
    constructor() {
        // Auth state
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authToken = null;
        this.authTimestamp = null;
        
        // Listeners and unsubscribers
        this.authStateListeners = [];
        this.unsubscribeAuthStateChanged = null;
        
        // Token refresh tracking
        this.tokenRefreshTimeout = null;
        this.refreshPromise = null;
        
        // Configuration
        this.tokenStorageKey = 'epay_crm_auth_token';
        this.userStorageKey = 'epay_crm_user';
        this.tokenExpirationKey = 'epay_crm_token_exp';
        this.tokenRefreshThreshold = 5 * 60 * 1000; // Refresh if less than 5 mins remaining
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize AuthService
     * - Wait for Firebase to be ready
     * - Set up auth state listener
     * - Restore session from local storage
     */
    init() {
        // Wait for Firebase to be available
        if (typeof firebase === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        try {
            this.auth = firebase.auth();
            
            // Set up persistent auth state listener
            this.unsubscribeAuthStateChanged = this.auth.onAuthStateChanged((user) => {
                this.handleAuthStateChanged(user);
            });
            
            console.info('[AuthService] Initialized successfully');
        } catch (error) {
            console.error('[AuthService] Initialization error:', error);
        }
    }
    
    /**
     * Handle Firebase auth state changes
     * Updates internal state and notifies listeners
     * 
     * @param {firebase.User|null} user - Firebase user object or null
     */
    handleAuthStateChanged(user) {
        if (user) {
            // User is signed in
            this.currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                isAnonymous: user.isAnonymous,
                metadata: user.metadata
            };
            
            this.isAuthenticated = true;
            this.authTimestamp = Date.now();
            
            // Get and store auth token
            user.getIdToken(/* forceRefresh */ false)
                .then(token => {
                    this.authToken = token;
                    this.storeToken(token);
                    
                    // Calculate token expiration
                    const tokenExpiresIn = user.stsTokenManager ? user.stsTokenManager.expirationTime : null;
                    if (tokenExpiresIn) {
                        this.setupTokenRefresh(tokenExpiresIn - Date.now());
                    }
                })
                .catch(error => {
                    console.error('[AuthService] Error getting ID token:', error);
                });
            
            // Cache user data
            this.cacheUser(this.currentUser);
            
            // Store current timestamp for session validation
            localStorage.setItem(this.authTimestamp.toString(), JSON.stringify(this.currentUser));
            
            console.info('[AuthService] User authenticated', { uid: user.uid, email: user.email });
        } else {
            // User is signed out
            this.currentUser = null;
            this.isAuthenticated = false;
            this.authToken = null;
            
            // Clear stored data
            this.clearStoredAuthData();
            
            // Cancel any pending token refresh
            if (this.tokenRefreshTimeout) {
                clearTimeout(this.tokenRefreshTimeout);
                this.tokenRefreshTimeout = null;
            }
            
            console.info('[AuthService] User signed out');
        }
        
        // Emit auth state changed event
        this.emitAuthStateChanged();
    }
    
    /**
     * Login with email and password
     * 
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<{uid, email, displayName, role}>} User object on success
     * @throws {Error} Firebase auth error with specific error codes:
     *   - 'user-not-found': No user with this email
     *   - 'wrong-password': Invalid password
     *   - 'too-many-requests': Account temporarily disabled (too many failed attempts)
     *   - 'invalid-email': Invalid email format
     *   - 'user-disabled': User account has been disabled
     *   - 'operation-not-allowed': Email/password not enabled
     */
    async login(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
            
            // Validate email format
            if (!this.isValidEmail(email)) {
                throw { code: 'invalid-email', message: 'Invalid email format' };
            }
            
            console.info('[AuthService] Attempting login for:', email);
            
            // Firebase sign in
            const credential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = credential.user;
            
            // Get ID token for API requests
            const token = await user.getIdToken();
            this.authToken = token;
            
            // Build user object
            const userObj = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || email.split('@')[0],
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                authProvider: 'firebase',
                loginTime: new Date().toISOString()
            };
            
            // Store token securely
            this.storeToken(token);
            this.cacheUser(userObj);
            
            // Setup token refresh
            const expiresIn = user.stsTokenManager ? user.stsTokenManager.expirationTime - Date.now() : 3600000;
            this.setupTokenRefresh(expiresIn);
            
            console.info('[AuthService] Login successful:', { uid: user.uid, email: email });
            
            return userObj;
        } catch (error) {
            console.error('[AuthService] Login error:', error.code || error.message);
            
            // Map Firebase errors to standard codes
            const mappedError = this.mapFirebaseError(error);
            throw mappedError;
        }
    }
    
    /**
     * Logout current user
     * - Signs out from Firebase
     * - Clears stored session data
     * - Notifies listeners
     * 
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            console.info('[AuthService] Logging out user');
            
            // Cancel token refresh
            if (this.tokenRefreshTimeout) {
                clearTimeout(this.tokenRefreshTimeout);
                this.tokenRefreshTimeout = null;
            }
            
            // Firebase sign out
            await this.auth.signOut();
            
            // Clear local data
            this.clearStoredAuthData();
            this.currentUser = null;
            this.isAuthenticated = false;
            this.authToken = null;
            
            console.info('[AuthService] Logout successful');
            return true;
        } catch (error) {
            console.error('[AuthService] Logout error:', error);
            throw error;
        }
    }
    
    /**
     * Get current authenticated user
     * 
     * @returns {{uid, email, displayName, photoURL, emailVerified} | null}
     */
    getCurrentUser() {
        return this.currentUser;
    }
    
    /**
     * Check if user is currently authenticated
     * 
     * @returns {boolean}
     */
    isUserAuthenticated() {
        return this.isAuthenticated && this.currentUser !== null;
    }
    
    /**
     * Get current auth token
     * Refreshes token if it's about to expire
     * 
     * @returns {Promise<string>} Valid auth token
     */
    async getToken() {
        try {
            if (!this.isAuthenticated || !this.auth.currentUser) {
                return null;
            }
            
            // Check if token needs refresh
            if (this.isTokenExpiringSoon()) {
                return await this.refreshToken();
            }
            
            return this.authToken || await this.auth.currentUser.getIdToken();
        } catch (error) {
            console.error('[AuthService] Error getting token:', error);
            throw error;
        }
    }
    
    /**
     * Refresh auth token
     * Prevents duplicate refresh requests through refreshPromise queue
     * 
     * @returns {Promise<string>} New auth token
     */
    async refreshToken() {
        try {
            // If a refresh is already in progress, wait for it
            if (this.refreshPromise) {
                return this.refreshPromise;
            }
            
            if (!this.auth.currentUser) {
                throw new Error('No user authenticated - cannot refresh token');
            }
            
            // Create refresh promise
            this.refreshPromise = this.auth.currentUser.getIdToken(/* forceRefresh */ true);
            
            const newToken = await this.refreshPromise;
            this.authToken = newToken;
            this.storeToken(newToken);
            
            // Setup new refresh
            const expiresIn = this.auth.currentUser.stsTokenManager 
                ? this.auth.currentUser.stsTokenManager.expirationTime - Date.now() 
                : 3600000;
            this.setupTokenRefresh(expiresIn);
            
            console.info('[AuthService] Token refreshed successfully');
            
            // Clear refresh promise
            this.refreshPromise = null;
            
            return newToken;
        } catch (error) {
            this.refreshPromise = null;
            console.error('[AuthService] Token refresh failed:', error);
            throw error;
        }
    }
    
    /**
     * Send password reset email
     * Sends Firebase password reset link to user's email
     * 
     * @param {string} email - User email address
     * @returns {Promise<void>}
     */
    async sendPasswordResetEmail(email) {
        try {
            if (!email) {
                throw new Error('Email is required');
            }
            
            if (!this.isValidEmail(email)) {
                throw { code: 'invalid-email', message: 'Invalid email format' };
            }
            
            console.info('[AuthService] Sending password reset email to:', email);
            
            // Send Firebase password reset email
            await this.auth.sendPasswordResetEmail(email);
            
            console.info('[AuthService] Password reset email sent successfully');
            return true;
        } catch (error) {
            console.error('[AuthService] Password reset email error:', error.code || error.message);
            
            const mappedError = this.mapFirebaseError(error);
            throw mappedError;
        }
    }
    
    /**
     * Confirm password reset with reset code and new password
     * Called after user clicks password reset link in email
     * 
     * @param {string} code - Password reset code from email link
     * @param {string} newPassword - New password
     * @returns {Promise<string>} User email on success
     */
    async confirmPasswordReset(code, newPassword) {
        try {
            if (!code || !newPassword) {
                throw new Error('Reset code and new password are required');
            }
            
            if (!this.isValidPassword(newPassword)) {
                throw {
                    code: 'weak-password',
                    message: 'Password must be at least 6 characters'
                };
            }
            
            console.info('[AuthService] Confirming password reset');
            
            // Verify reset code first
            const email = await this.auth.verifyPasswordResetCode(code);
            
            // Complete password reset
            await this.auth.confirmPasswordReset(code, newPassword);
            
            console.info('[AuthService] Password reset successful for:', email);
            
            return email;
        } catch (error) {
            console.error('[AuthService] Password reset error:', error.code || error.message);
            
            const mappedError = this.mapFirebaseError(error);
            throw mappedError;
        }
    }
    
    /**
     * Subscribe to auth state changes
     * Callback receives {isAuthenticated, user, timestamp}
     * 
     * @param {Function} callback - Called when auth state changes
     * @returns {Function} Unsubscribe function
     */
    onAuthStateChanged(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        
        // Add listener to list
        this.authStateListeners.push(callback);
        
        // Call immediately with current state
        setTimeout(() => {
            callback({
                isAuthenticated: this.isAuthenticated,
                user: this.currentUser,
                timestamp: this.authTimestamp
            });
        }, 0);
        
        // Return unsubscribe function
        return () => {
            this.authStateListeners = this.authStateListeners.filter(l => l !== callback);
        };
    }
    
    /**
     * Emit auth state changed event to all listeners
     * Ensures listeners are called within 100ms of state change
     * 
     * @private
     */
    emitAuthStateChanged() {
        const state = {
            isAuthenticated: this.isAuthenticated,
            user: this.currentUser,
            timestamp: this.authTimestamp
        };
        
        // Call all registered listeners synchronously
        this.authStateListeners.forEach(listener => {
            try {
                listener(state);
            } catch (error) {
                console.error('[AuthService] Error in auth state listener:', error);
            }
        });
        
        // Dispatch custom event for DOM listeners
        window.dispatchEvent(new CustomEvent('crm:authStateChanged', { detail: state }));
    }
    
    /**
     * Setup automatic token refresh before expiration
     * Refresh token when it has less than 5 minutes remaining
     * 
     * @private
     * @param {number} expiresInMs - Time until token expires in milliseconds
     */
    setupTokenRefresh(expiresInMs) {
        if (this.tokenRefreshTimeout) {
            clearTimeout(this.tokenRefreshTimeout);
        }
        
        // Refresh when 5 minutes remain
        const refreshAt = expiresInMs - this.tokenRefreshThreshold;
        const delay = Math.max(1000, refreshAt); // At least 1 second
        
        this.tokenRefreshTimeout = setTimeout(() => {
            if (this.isAuthenticated) {
                this.refreshToken().catch(error => {
                    console.error('[AuthService] Automatic token refresh failed:', error);
                });
            }
        }, delay);
        
        console.debug('[AuthService] Token refresh scheduled in', (delay / 1000).toFixed(1), 'seconds');
    }
    
    /**
     * Check if current token is expiring soon
     * 
     * @private
     * @returns {boolean}
     */
    isTokenExpiringSoon() {
        if (!this.auth.currentUser || !this.auth.currentUser.stsTokenManager) {
            return false;
        }
        
        const expirationTime = this.auth.currentUser.stsTokenManager.expirationTime;
        const timeUntilExpiration = expirationTime - Date.now();
        
        return timeUntilExpiration < this.tokenRefreshThreshold;
    }
    
    /**
     * Store encrypted token in local storage
     * Uses encryptToken if available, otherwise stores as-is
     * 
     * @private
     * @param {string} token - Auth token to store
     */
    storeToken(token) {
        try {
            // Try to encrypt token if crypto utilities available
            let storedToken = token;
            if (typeof encryptToken === 'function') {
                storedToken = encryptToken(token);
            }
            
            localStorage.setItem(this.tokenStorageKey, storedToken);
            
            // Store expiration time
            if (this.auth.currentUser && this.auth.currentUser.stsTokenManager) {
                localStorage.setItem(
                    this.tokenExpirationKey,
                    this.auth.currentUser.stsTokenManager.expirationTime
                );
            }
        } catch (error) {
            console.error('[AuthService] Error storing token:', error);
        }
    }
    
    /**
     * Cache user data in local storage
     * 
     * @private
     * @param {Object} user - User object to cache
     */
    cacheUser(user) {
        try {
            localStorage.setItem(this.userStorageKey, JSON.stringify(user));
        } catch (error) {
            console.error('[AuthService] Error caching user:', error);
        }
    }
    
    /**
     * Clear all stored auth data
     * 
     * @private
     */
    clearStoredAuthData() {
        try {
            localStorage.removeItem(this.tokenStorageKey);
            localStorage.removeItem(this.userStorageKey);
            localStorage.removeItem(this.tokenExpirationKey);
        } catch (error) {
            console.error('[AuthService] Error clearing stored auth data:', error);
        }
    }
    
    /**
     * Validate email format
     * 
     * @private
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Validate password strength
     * Minimum 6 characters required by Firebase
     * 
     * @private
     * @param {string} password - Password to validate
     * @returns {boolean}
     */
    isValidPassword(password) {
        return password && password.length >= 6;
    }
    
    /**
     * Map Firebase error codes to standardized format
     * 
     * @private
     * @param {Error} error - Firebase error object
     * @returns {Error} Mapped error with standardized code
     */
    mapFirebaseError(error) {
        // Already mapped
        if (error.code) {
            return error;
        }
        
        // Firebase auth errors
        const errorMap = {
            'auth/user-not-found': { code: 'user-not-found', message: 'No user found with this email address' },
            'auth/wrong-password': { code: 'wrong-password', message: 'Incorrect password' },
            'auth/too-many-requests': { code: 'too-many-requests', message: 'Too many failed login attempts. Please try again later' },
            'auth/invalid-email': { code: 'invalid-email', message: 'Invalid email address format' },
            'auth/user-disabled': { code: 'user-disabled', message: 'This user account has been disabled' },
            'auth/operation-not-allowed': { code: 'operation-not-allowed', message: 'Email/password authentication is not enabled' },
            'auth/email-already-in-use': { code: 'email-already-in-use', message: 'Email address is already in use' },
            'auth/weak-password': { code: 'weak-password', message: 'Password is too weak' },
            'auth/account-exists-with-different-credential': { code: 'account-exists-with-different-credential', message: 'Email already associated with another account' },
            'auth/invalid-credential': { code: 'invalid-credential', message: 'Invalid authentication credentials' },
            'auth/invalid-verification-code': { code: 'invalid-verification-code', message: 'Invalid verification code' },
            'auth/expired-action-code': { code: 'expired-action-code', message: 'Password reset link has expired' }
        };
        
        const mapped = errorMap[error.code] || {
            code: error.code || 'unknown-error',
            message: error.message || 'An authentication error occurred'
        };
        
        return mapped;
    }
    
    /**
     * Clean up resources on service destroy
     * Should be called before app shutdown
     */
    destroy() {
        if (this.unsubscribeAuthStateChanged) {
            this.unsubscribeAuthStateChanged();
        }
        
        if (this.tokenRefreshTimeout) {
            clearTimeout(this.tokenRefreshTimeout);
        }
        
        this.authStateListeners = [];
        console.info('[AuthService] Destroyed');
    }
}

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}

// Create singleton instance
let authServiceInstance = null;

/**
 * Get or create AuthService singleton
 * 
 * @returns {AuthService}
 */
function getAuthService() {
    if (!authServiceInstance) {
        authServiceInstance = new AuthService();
    }
    return authServiceInstance;
}

// Expose globally
if (typeof window !== 'undefined') {
    window.AuthService = AuthService;
    window.getAuthService = getAuthService;
}
