/**
 * Session Sync Manager - Multi-Tab Session Synchronization
 * Implements BroadcastChannel API for cross-tab session communication
 * Handles login/logout synchronization and token refresh coordination
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 * 
 * Features:
 * - BroadcastChannel-based session sync across tabs
 * - Fallback to localStorage events for older browsers
 * - Token refresh coordination to prevent duplicate refreshes
 * - Session restoration from other tabs
 * - Graceful degradation for unsupported browsers
 */

class SessionSyncManager {
    constructor() {
        this.channel = null;
        this.isBroadcastChannelSupported = typeof BroadcastChannel !== 'undefined';
        this.listeners = new Map(); // Event listeners
        this.refreshPromise = null; // Coordinate token refresh across tabs
        this.tabId = this._generateTabId(); // Unique identifier for this tab
        this.isInitialized = false;
    }

    /**
     * Initialize session sync manager
     * Sets up BroadcastChannel or localStorage listeners
     * 
     * @param {AuthService} authService - AuthService instance for auth state access
     * @returns {void}
     */
    initialize(authService) {
        try {
            if (this.isInitialized) {
                console.warn('[SessionSyncManager] Already initialized');
                return;
            }

            this.authService = authService;

            if (this.isBroadcastChannelSupported) {
                this._initializeBroadcastChannel();
            } else {
                console.warn('[SessionSyncManager] BroadcastChannel not supported, using storage events');
                this._initializeStorageEvents();
            }

            this.isInitialized = true;
            console.info('[SessionSyncManager] Initialized successfully', { tabId: this.tabId });
        } catch (error) {
            console.error('[SessionSyncManager] Initialization failed:', error);
            throw error;
        }
    }

    /**
     * Broadcast login event to other tabs
     * Called when user logs in on this tab
     * 
     * @param {Object} userData - User data object with uid, email, role, etc.
     * @returns {void}
     */
    broadcastLogin(userData) {
        try {
            const message = {
                type: 'LOGIN',
                tabId: this.tabId,
                uid: userData.uid,
                email: userData.email,
                displayName: userData.displayName,
                photoURL: userData.photoURL,
                role: userData.role,
                timestamp: Date.now()
            };

            this._broadcast(message);
            console.info('[SessionSyncManager] Broadcasting login to other tabs', { uid: userData.uid });
        } catch (error) {
            console.error('[SessionSyncManager] Failed to broadcast login:', error);
        }
    }

    /**
     * Broadcast logout event to other tabs
     * Called when user logs out on this tab
     * 
     * @returns {void}
     */
    broadcastLogout() {
        try {
            const message = {
                type: 'LOGOUT',
                tabId: this.tabId,
                timestamp: Date.now()
            };

            this._broadcast(message);
            console.info('[SessionSyncManager] Broadcasting logout to other tabs');
        } catch (error) {
            console.error('[SessionSyncManager] Failed to broadcast logout:', error);
        }
    }

    /**
     * Broadcast session revocation (for admin-disabled users)
     * Forces other tabs to log out immediately
     * 
     * @param {string} uid - User ID being revoked
     * @param {string} reason - Reason for revocation
     * @returns {void}
     */
    broadcastSessionRevocation(uid, reason) {
        try {
            const message = {
                type: 'SESSION_REVOKED',
                tabId: this.tabId,
                uid,
                reason,
                timestamp: Date.now()
            };

            this._broadcast(message);
            console.warn('[SessionSyncManager] Broadcasting session revocation to other tabs', { uid, reason });
        } catch (error) {
            console.error('[SessionSyncManager] Failed to broadcast session revocation:', error);
        }
    }

    /**
     * Coordinate token refresh across tabs
     * Prevents multiple tabs from requesting refresh simultaneously
     * Other tabs wait for first tab's result
     * 
     * @returns {Promise<string>} Refreshed token
     */
    async coordinateTokenRefresh() {
        try {
            // If already refreshing, wait for the result
            if (this.refreshPromise) {
                console.debug('[SessionSyncManager] Token refresh in progress on another tab, waiting...');
                return await this.refreshPromise;
            }

            // This tab will perform the refresh
            this.refreshPromise = this._performTokenRefresh();
            const token = await this.refreshPromise;
            this.refreshPromise = null;

            return token;
        } catch (error) {
            this.refreshPromise = null;
            throw error;
        }
    }

    /**
     * Request token refresh from other tabs
     * Broadcasts refresh request and waits for response
     * 
     * @returns {Promise<string>} Token from responding tab
     */
    async requestTokenRefreshFromOtherTabs() {
        return new Promise((resolve, reject) => {
            const requestId = this._generateRequestId();
            const timeout = setTimeout(() => {
                this._removeListener(requestId);
                reject(new Error('Token refresh request timeout'));
            }, 5000); // 5 second timeout

            const responseHandler = (data) => {
                if (data.requestId === requestId && data.type === 'TOKEN_REFRESH_RESPONSE') {
                    clearTimeout(timeout);
                    this._removeListener(requestId);
                    if (data.token) {
                        resolve(data.token);
                    } else {
                        reject(new Error(data.error || 'Token refresh failed'));
                    }
                }
            };

            this._addListener(requestId, responseHandler);

            // Broadcast refresh request
            const message = {
                type: 'TOKEN_REFRESH_REQUEST',
                tabId: this.tabId,
                requestId,
                timestamp: Date.now()
            };
            this._broadcast(message);
        });
    }

    /**
     * Subscribe to session sync events
     * 
     * @param {string} eventType - Event type (LOGIN, LOGOUT, SESSION_REVOKED, TOKEN_REFRESH_REQUEST)
     * @param {Function} callback - Callback function(messageData)
     * @returns {Function} Unsubscriber function
     */
    subscribe(eventType, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }

        const listeners = this.listeners.get(eventType);
        listeners.push(callback);

        // Return unsubscriber function
        return () => {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }

    /**
     * Subscribe to login events on other tabs
     * 
     * @param {Function} callback - Callback function(messageData)
     * @returns {Function} Unsubscriber function
     */
    onRemoteLogin(callback) {
        return this.subscribe('LOGIN', callback);
    }

    /**
     * Subscribe to logout events on other tabs
     * 
     * @param {Function} callback - Callback function(messageData)
     * @returns {Function} Unsubscriber function
     */
    onRemoteLogout(callback) {
        return this.subscribe('LOGOUT', callback);
    }

    /**
     * Subscribe to session revocation events
     * 
     * @param {Function} callback - Callback function(messageData)
     * @returns {Function} Unsubscriber function
     */
    onSessionRevoked(callback) {
        return this.subscribe('SESSION_REVOKED', callback);
    }

    /**
     * Check if this tab is the primary tab
     * Used for coordinating operations that should only happen once across tabs
     * 
     * @returns {boolean} True if this is the primary tab
     */
    isPrimaryTab() {
        try {
            const primaryTabId = localStorage.getItem('primaryTabId');
            if (!primaryTabId) {
                // No primary tab set yet, claim it
                localStorage.setItem('primaryTabId', this.tabId);
                return true;
            }
            return primaryTabId === this.tabId;
        } catch (error) {
            console.error('[SessionSyncManager] Failed to check primary tab status:', error);
            return false;
        }
    }

    /**
     * Get all active tab IDs across browser tabs
     * 
     * @returns {Array<string>} Array of active tab IDs
     */
    getActiveTabIds() {
        try {
            const activeTabsJson = localStorage.getItem('activeTabIds');
            return activeTabsJson ? JSON.parse(activeTabsJson) : [this.tabId];
        } catch (error) {
            console.error('[SessionSyncManager] Failed to get active tab IDs:', error);
            return [this.tabId];
        }
    }

    /**
     * Clean up resources on app shutdown
     * Closes BroadcastChannel and removes listeners
     * 
     * @returns {void}
     */
    cleanup() {
        try {
            if (this.channel) {
                this.channel.close();
                this.channel = null;
            }

            if (!this.isBroadcastChannelSupported) {
                window.removeEventListener('storage', this._storageEventListener);
            }

            this.listeners.clear();
            this.isInitialized = false;

            console.info('[SessionSyncManager] Cleanup complete');
        } catch (error) {
            console.error('[SessionSyncManager] Error during cleanup:', error);
        }
    }

    // ===== Private Methods =====

    /**
     * Initialize BroadcastChannel for cross-tab communication
     * 
     * @private
     */
    _initializeBroadcastChannel() {
        try {
            this.channel = new BroadcastChannel('epay-crm-session-sync');

            this.channel.onmessage = (event) => {
                this._handleMessage(event.data);
            };

            this.channel.onerror = (error) => {
                console.error('[SessionSyncManager] BroadcastChannel error:', error);
            };

            console.info('[SessionSyncManager] BroadcastChannel initialized');
        } catch (error) {
            console.error('[SessionSyncManager] Failed to initialize BroadcastChannel:', error);
            // Fallback to storage events
            this._initializeStorageEvents();
        }
    }

    /**
     * Initialize storage event listeners for older browsers
     * Fallback when BroadcastChannel is not available
     * 
     * @private
     */
    _initializeStorageEvents() {
        this._storageEventListener = (event) => {
            if (event.key === 'sessionSyncMessage' && event.newValue) {
                try {
                    const data = JSON.parse(event.newValue);
                    // Ignore messages from same tab
                    if (data.tabId !== this.tabId) {
                        this._handleMessage(data);
                    }
                } catch (error) {
                    console.error('[SessionSyncManager] Failed to parse storage event:', error);
                }
            }
        };

        window.addEventListener('storage', this._storageEventListener);
        console.info('[SessionSyncManager] Storage event listeners initialized');
    }

    /**
     * Handle incoming message from other tabs
     * Routes message to appropriate handlers
     * 
     * @private
     * @param {Object} data - Message data
     */
    _handleMessage(data) {
        try {
            // Ignore messages from same tab
            if (data.tabId === this.tabId) {
                return;
            }

            const { type } = data;

            // Emit event to listeners
            if (this.listeners.has(type)) {
                const listeners = this.listeners.get(type);
                listeners.forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(`[SessionSyncManager] Error in ${type} listener:`, error);
                    }
                });
            }

            // Handle token refresh requests
            if (type === 'TOKEN_REFRESH_REQUEST' && this.authService) {
                this._handleTokenRefreshRequest(data);
            }
        } catch (error) {
            console.error('[SessionSyncManager] Error handling message:', error);
        }
    }

    /**
     * Broadcast message to other tabs
     * Uses BroadcastChannel if available, falls back to localStorage
     * 
     * @private
     * @param {Object} message - Message object
     */
    _broadcast(message) {
        if (this.channel && this.isBroadcastChannelSupported) {
            try {
                this.channel.postMessage(message);
            } catch (error) {
                console.error('[SessionSyncManager] Failed to broadcast via BroadcastChannel:', error);
            }
        } else {
            // Fallback to localStorage events
            try {
                localStorage.setItem('sessionSyncMessage', JSON.stringify(message));
                // Clear to ensure change event fires next time
                setTimeout(() => {
                    localStorage.removeItem('sessionSyncMessage');
                }, 100);
            } catch (error) {
                console.error('[SessionSyncManager] Failed to broadcast via localStorage:', error);
            }
        }
    }

    /**
     * Handle token refresh request from other tabs
     * 
     * @private
     * @param {Object} data - Request data with requestId
     */
    async _handleTokenRefreshRequest(data) {
        try {
            const { requestId } = data;
            
            // Perform token refresh
            const token = await this.authService.getToken();

            // Send response back
            const response = {
                type: 'TOKEN_REFRESH_RESPONSE',
                tabId: this.tabId,
                requestId,
                token,
                timestamp: Date.now()
            };

            this._broadcast(response);
        } catch (error) {
            console.error('[SessionSyncManager] Failed to handle token refresh request:', error);

            // Send error response
            const response = {
                type: 'TOKEN_REFRESH_RESPONSE',
                tabId: this.tabId,
                requestId: data.requestId,
                error: error.message,
                timestamp: Date.now()
            };

            this._broadcast(response);
        }
    }

    /**
     * Perform actual token refresh via AuthService
     * 
     * @private
     * @returns {Promise<string>} Refreshed token
     */
    async _performTokenRefresh() {
        if (!this.authService) {
            throw new Error('AuthService not available');
        }
        return await this.authService.getToken();
    }

    /**
     * Generate unique tab ID based on timestamp and random value
     * 
     * @private
     * @returns {string} Unique tab ID
     */
    _generateTabId() {
        return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Generate unique request ID
     * 
     * @private
     * @returns {string} Unique request ID
     */
    _generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Add one-time listener for specific request ID
     * Used for request-response patterns
     * 
     * @private
     * @param {string} requestId - Request ID
     * @param {Function} callback - Callback function
     */
    _addListener(requestId, callback) {
        if (!this.listeners.has('_requests')) {
            this.listeners.set('_requests', new Map());
        }
        this.listeners.get('_requests').set(requestId, callback);
    }

    /**
     * Remove one-time listener for specific request ID
     * 
     * @private
     * @param {string} requestId - Request ID
     */
    _removeListener(requestId) {
        if (this.listeners.has('_requests')) {
            this.listeners.get('_requests').delete(requestId);
        }
    }
}

/**
 * Create singleton instance of SessionSyncManager
 * Can be accessed as window.sessionSyncManager or imported as module
 */
const sessionSyncManager = new SessionSyncManager();

// Expose globally for access from HTML and other scripts
if (typeof window !== 'undefined') {
    window.sessionSyncManager = sessionSyncManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionSyncManager;
}
