/**
 * PresenceService - Real-Time User Presence Tracking
 * 
 * Provides real-time user presence tracking using Firebase Realtime Database.
 * Tracks user login/logout, activity, inactivity status, and provides
 * presence querying capabilities.
 * 
 * Features:
 * - Record user login with presence data
 * - Record user activity to update last activity timestamp
 * - Automatic inactivity detection (15 minutes default)
 * - Graceful disconnect handling with onDisconnect handlers
 * - Query active users in real-time
 * - Clean up orphaned presence records
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
 * Task: 6.1 Implement PresenceService with RTDB integration
 */

class PresenceService {
    constructor() {
        // Reference to Firebase Realtime Database
        this.realtimeDB = null;
        this.presenceRef = null;
        
        // Activity tracking
        this.activityTimers = {}; // Map of userId -> inactivity timeout
        this.lastActivityTime = {}; // Map of userId -> last activity timestamp
        
        // Listeners tracking
        this.presenceListeners = [];
        this.unsubscribeFunctions = [];
        
        // Configuration
        this.inactivityThresholdMs = 15 * 60 * 1000; // 15 minutes default
        this.orphanedRecordThresholdMs = 24 * 60 * 60 * 1000; // 24 hours
        this.cleanupIntervalMs = 6 * 60 * 60 * 1000; // 6 hours
        
        // Track if service is initialized
        this.isInitialized = false;
        this.cleanupInterval = null;
        
        // Initialize service
        this.init();
    }
    
    /**
     * Initialize PresenceService
     * Waits for Firebase to be available and gets reference to Realtime Database
     */
    init() {
        // Wait for Firebase to be available
        if (typeof firebase === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        try {
            // Get Realtime Database reference
            this.realtimeDB = firebase.database();
            this.presenceRef = this.realtimeDB.ref('presence');
            
            this.isInitialized = true;
            
            console.info('[PresenceService] Initialized successfully');
            
            // Setup periodic cleanup of orphaned records
            this.setupOrphanedRecordCleanup();
        } catch (error) {
            console.error('[PresenceService] Initialization error:', error);
            setTimeout(() => this.init(), 1000);
        }
    }
    
    /**
     * Record user login - creates presence record in RTDB
     * 
     * On login: create presence record in presence/{userId} with all required fields:
     * - displayName, role, loginTime, lastActivityTime, online, status
     * 
     * @param {string} userId - User's unique ID
     * @param {string} displayName - User's display name (1-255 chars)
     * @param {string} role - User's role (admin, accountant, affiliate, BDE, BDO, CFO, CGO, CMO, arrival_manager, assistant_manager)
     * @param {number} loginTime - Unix timestamp (milliseconds) when user logged in
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async recordLogin(userId, displayName, role, loginTime) {
        if (!this.isInitialized) {
            return { success: false, error: 'PresenceService not initialized' };
        }
        
        try {
            // Validate inputs
            if (!userId || !displayName || !role) {
                throw new Error('userId, displayName, and role are required');
            }
            
            // Validate displayName length (1-255 characters)
            if (displayName.length < 1 || displayName.length > 255) {
                throw new Error('displayName must be between 1 and 255 characters');
            }
            
            // Validate role - must be one of predefined roles
            const validRoles = ['admin', 'accountant', 'affiliate', 'BDE', 'BDO', 'CFO', 'CGO', 'CMO', 'arrival_manager', 'assistant_manager'];
            if (!validRoles.includes(role)) {
                throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
            }
            
            // Validate loginTime
            if (typeof loginTime !== 'number' || loginTime < 0) {
                throw new Error('loginTime must be a non-negative number (Unix timestamp in milliseconds)');
            }
            
            // Create presence record with all required fields
            const presenceData = {
                displayName: displayName,
                role: role,
                loginTime: loginTime,
                lastActivityTime: loginTime, // Initially same as loginTime
                online: true,
                status: 'active'
            };
            
            // Write presence record to RTDB
            await this.realtimeDB
                .ref(`presence/${userId}`)
                .set(presenceData);
            
            // Setup onDisconnect handler to mark user offline if connection is lost
            await this.setupOnDisconnectHandler(userId);
            
            // Initialize activity tracking for this user
            this.lastActivityTime[userId] = loginTime;
            this.setupInactivityTimer(userId);
            
            console.info('[PresenceService] Login recorded for user:', userId);
            
            return { success: true };
        } catch (error) {
            console.error('[PresenceService] recordLogin error:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Record user activity - updates lastActivityTime
     * 
     * Must update lastActivityTime without violating constraint that lastActivityTime >= loginTime
     * Resets the inactivity timer
     * 
     * @param {string} userId - User's unique ID
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async recordActivity(userId) {
        if (!this.isInitialized) {
            return { success: false, error: 'PresenceService not initialized' };
        }
        
        try {
            if (!userId) {
                throw new Error('userId is required');
            }
            
            const currentTime = Date.now();
            
            // Update lastActivityTime in RTDB
            await this.realtimeDB
                .ref(`presence/${userId}/lastActivityTime`)
                .set(currentTime);
            
            // Track last activity time locally
            this.lastActivityTime[userId] = currentTime;
            
            // Reset inactivity timer
            this.setupInactivityTimer(userId);
            
            console.debug('[PresenceService] Activity recorded for user:', userId);
            
            return { success: true };
        } catch (error) {
            console.error('[PresenceService] recordActivity error:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Update inactivity status - marks user as 'away' after inactivity period
     * 
     * After 15 minutes of no activity, updates status to 'away'
     * Only updates status field, leaves other fields unchanged
     * 
     * @param {string} userId - User's unique ID
     * @param {number} inactivityThresholdMs - Inactivity threshold in milliseconds (default: 15 minutes)
     * @returns {Promise<{success: boolean, reason?: string, error?: string}>}
     */
    async updateInactivityStatus(userId, inactivityThresholdMs = this.inactivityThresholdMs) {
        if (!this.isInitialized) {
            return { success: false, error: 'PresenceService not initialized' };
        }
        
        try {
            if (!userId) {
                throw new Error('userId is required');
            }
            
            // Get current presence record to check inactivity
            const snapshot = await this.realtimeDB
                .ref(`presence/${userId}`)
                .once('value');
            
            if (!snapshot.exists()) {
                return { success: false, error: 'Presence record not found' };
            }
            
            const presenceData = snapshot.val();
            const timeSinceActivity = Date.now() - presenceData.lastActivityTime;
            
            // Check if user is inactive
            if (timeSinceActivity >= inactivityThresholdMs) {
                // Update only status field to 'away'
                await this.realtimeDB
                    .ref(`presence/${userId}/status`)
                    .set('away');
                
                console.info('[PresenceService] User marked as away:', userId);
                
                return { success: true };
            } else {
                return { success: false, reason: 'User not inactive yet' };
            }
        } catch (error) {
            console.error('[PresenceService] updateInactivityStatus error:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Record user logout - deletes presence record from RTDB
     * 
     * Removes the entire presence record for the user
     * 
     * @param {string} userId - User's unique ID
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async recordLogout(userId) {
        if (!this.isInitialized) {
            return { success: false, error: 'PresenceService not initialized' };
        }
        
        try {
            if (!userId) {
                throw new Error('userId is required');
            }
            
            // Clear activity timer for this user
            if (this.activityTimers[userId]) {
                clearTimeout(this.activityTimers[userId]);
                delete this.activityTimers[userId];
            }
            
            // Clear last activity time
            delete this.lastActivityTime[userId];
            
            // Delete presence record from RTDB
            await this.realtimeDB
                .ref(`presence/${userId}`)
                .remove();
            
            console.info('[PresenceService] Logout recorded for user:', userId);
            
            return { success: true };
        } catch (error) {
            console.error('[PresenceService] recordLogout error:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Get list of active users
     * 
     * Queries all presence records and filters for online users
     * Calculates time elapsed since login for each user
     * 
     * @returns {Promise<{success: boolean, users?: Array, error?: string}>}
     */
    async getActiveUsers() {
        if (!this.isInitialized) {
            return { success: false, error: 'PresenceService not initialized' };
        }
        
        try {
            // Read all presence records from RTDB
            const snapshot = await this.presenceRef.once('value');
            
            if (!snapshot.exists()) {
                return { success: true, users: [] };
            }
            
            const presenceMap = snapshot.val();
            const users = [];
            
            // Filter for online users and calculate time elapsed
            Object.entries(presenceMap).forEach(([userId, presenceData]) => {
                if (presenceData.online === true) {
                    const timeElapsed = Date.now() - presenceData.loginTime;
                    users.push({
                        userId,
                        displayName: presenceData.displayName,
                        role: presenceData.role,
                        loginTime: presenceData.loginTime,
                        lastActivityTime: presenceData.lastActivityTime,
                        online: presenceData.online,
                        status: presenceData.status,
                        loginDurationMs: timeElapsed
                    });
                }
            });
            
            console.debug('[PresenceService] Retrieved active users count:', users.length);
            
            return { success: true, users };
        } catch (error) {
            console.error('[PresenceService] getActiveUsers error:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Get presence data for a single user
     * 
     * Fetches presence record for specific user
     * Calculates time elapsed since login
     * 
     * @param {string} userId - User's unique ID
     * @returns {Promise<{success: boolean, presence?: Object|null, error?: string}>}
     */
    async getUserPresence(userId) {
        if (!this.isInitialized) {
            return { success: false, error: 'PresenceService not initialized' };
        }
        
        try {
            if (!userId) {
                throw new Error('userId is required');
            }
            
            const snapshot = await this.realtimeDB
                .ref(`presence/${userId}`)
                .once('value');
            
            if (!snapshot.exists()) {
                return { success: true, presence: null };
            }
            
            const presenceData = snapshot.val();
            const timeElapsed = Date.now() - presenceData.loginTime;
            
            return {
                success: true,
                presence: {
                    userId,
                    displayName: presenceData.displayName,
                    role: presenceData.role,
                    loginTime: presenceData.loginTime,
                    lastActivityTime: presenceData.lastActivityTime,
                    online: presenceData.online,
                    status: presenceData.status,
                    loginDurationMs: timeElapsed
                }
            };
        } catch (error) {
            console.error('[PresenceService] getUserPresence error:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Subscribe to real-time presence changes
     * 
     * Listens for all presence changes and calls callback with updated list
     * Returns unsubscribe function for cleanup
     * 
     * @param {Function} callback - Called with {success, users, error} on presence changes
     * @returns {Function} Unsubscribe function
     */
    onPresenceChanged(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        
        try {
            // Set up listener for presence changes
            const presenceListener = this.presenceRef.on('value', (snapshot) => {
                try {
                    if (snapshot.exists()) {
                        const presenceMap = snapshot.val();
                        const users = [];
                        
                        Object.entries(presenceMap).forEach(([userId, presenceData]) => {
                            users.push({
                                userId,
                                displayName: presenceData.displayName,
                                role: presenceData.role,
                                loginTime: presenceData.loginTime,
                                lastActivityTime: presenceData.lastActivityTime,
                                online: presenceData.online,
                                status: presenceData.status,
                                loginDurationMs: Date.now() - presenceData.loginTime
                            });
                        });
                        
                        callback({ success: true, users });
                    } else {
                        callback({ success: true, users: [] });
                    }
                } catch (error) {
                    console.error('[PresenceService] Error in presence listener callback:', error);
                    callback({ success: false, error: error.message });
                }
            });
            
            // Track this listener for cleanup
            this.presenceListeners.push(callback);
            
            // Return unsubscribe function
            const unsubscribe = () => {
                this.presenceRef.off('value', presenceListener);
                this.presenceListeners = this.presenceListeners.filter(l => l !== callback);
            };
            
            this.unsubscribeFunctions.push(unsubscribe);
            
            return unsubscribe;
        } catch (error) {
            console.error('[PresenceService] onPresenceChanged error:', error.message);
            return () => {};
        }
    }
    
    /**
     * Setup onDisconnect handler for graceful offline handling
     * 
     * When browser connection is lost, updates user's online status to false
     * This ensures presence data reflects true connection state
     * 
     * @private
     * @param {string} userId - User's unique ID
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async setupOnDisconnectHandler(userId) {
        try {
            if (!userId) {
                throw new Error('userId is required');
            }
            
            const userPresenceRef = this.realtimeDB.ref(`presence/${userId}`);
            
            // When connection is lost, update online to false
            await userPresenceRef.child('online').onDisconnect().set(false);
            
            console.debug('[PresenceService] onDisconnect handler set for user:', userId);
            
            return { success: true };
        } catch (error) {
            console.error('[PresenceService] setupOnDisconnectHandler error:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Clean up orphaned presence records older than 24 hours
     * 
     * Deletes presence records with loginTime older than threshold
     * Logs deletion count for monitoring
     * 
     * @param {number} maxAgeMs - Maximum age in milliseconds (default: 24 hours)
     * @returns {Promise<{success: boolean, deletedCount?: number, error?: string}>}
     */
    async cleanupOrphanedRecords(maxAgeMs = this.orphanedRecordThresholdMs) {
        if (!this.isInitialized) {
            return { success: false, error: 'PresenceService not initialized' };
        }
        
        try {
            const snapshot = await this.presenceRef.once('value');
            
            if (!snapshot.exists()) {
                return { success: true, deletedCount: 0 };
            }
            
            const presenceMap = snapshot.val();
            const cutoffTime = Date.now() - maxAgeMs;
            let deletedCount = 0;
            
            const updates = {};
            Object.entries(presenceMap).forEach(([userId, presenceData]) => {
                // Delete records with loginTime older than cutoff
                if (presenceData.loginTime < cutoffTime) {
                    updates[`presence/${userId}`] = null;
                    deletedCount++;
                }
            });
            
            // Batch update to delete all orphaned records
            if (deletedCount > 0) {
                await this.realtimeDB.ref().update(updates);
                console.info('[PresenceService] Cleaned up orphaned records:', deletedCount);
            }
            
            return { success: true, deletedCount };
        } catch (error) {
            console.error('[PresenceService] cleanupOrphanedRecords error:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Setup periodic cleanup of orphaned records
     * Runs cleanup every 6 hours during off-peak time
     * 
     * @private
     */
    setupOrphanedRecordCleanup() {
        // Run cleanup at app startup
        this.cleanupOrphanedRecords().catch(error => {
            console.error('[PresenceService] Initial cleanup failed:', error);
        });
        
        // Schedule periodic cleanup every 6 hours
        this.cleanupInterval = setInterval(() => {
            this.cleanupOrphanedRecords().catch(error => {
                console.error('[PresenceService] Periodic cleanup failed:', error);
            });
        }, this.cleanupIntervalMs);
    }
    
    /**
     * Setup inactivity timer for a user
     * 
     * After 15 minutes of no activity, updates status to 'away'
     * 
     * @private
     * @param {string} userId - User's unique ID
     */
    setupInactivityTimer(userId) {
        // Clear existing timer
        if (this.activityTimers[userId]) {
            clearTimeout(this.activityTimers[userId]);
        }
        
        // Set new timer to check inactivity after threshold
        this.activityTimers[userId] = setTimeout(() => {
            this.updateInactivityStatus(userId).catch(error => {
                console.error('[PresenceService] Inactivity update failed for user:', userId, error);
            });
        }, this.inactivityThresholdMs);
    }
    
    /**
     * Clean up resources on service destroy
     * Should be called before app shutdown
     */
    destroy() {
        try {
            // Clear all activity timers
            Object.values(this.activityTimers).forEach(timer => clearTimeout(timer));
            this.activityTimers = {};
            
            // Clear cleanup interval
            if (this.cleanupInterval) {
                clearInterval(this.cleanupInterval);
            }
            
            // Unsubscribe from all listeners
            this.unsubscribeFunctions.forEach(unsubscribe => {
                try {
                    unsubscribe();
                } catch (error) {
                    console.error('[PresenceService] Error unsubscribing listener:', error);
                }
            });
            
            this.presenceListeners = [];
            this.unsubscribeFunctions = [];
            
            this.isInitialized = false;
            
            console.info('[PresenceService] Destroyed');
        } catch (error) {
            console.error('[PresenceService] Error during destroy:', error);
        }
    }
}

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresenceService;
}

// Create singleton instance
let presenceServiceInstance = null;

/**
 * Get or create PresenceService singleton
 * 
 * @returns {PresenceService}
 */
function getPresenceService() {
    if (!presenceServiceInstance) {
        presenceServiceInstance = new PresenceService();
    }
    return presenceServiceInstance;
}

// Expose globally
if (typeof window !== 'undefined') {
    window.PresenceService = PresenceService;
    window.getPresenceService = getPresenceService;
}
