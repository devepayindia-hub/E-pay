/**
 * RBACService - Role-Based Access Control Engine
 * 
 * Manages role-based access control for portal and feature access:
 * - Load role configurations from Firestore role_configs collection
 * - Cache configurations with 1-hour TTL
 * - Validate portal access for roles
 * - Validate feature access for roles
 * - Dynamic sidebar generation based on role permissions
 * 
 * Requirements: 3.1, 3.2, 3.3
 * Task: 4.1 Implement RBACService with role configuration management
 */

class RBACService {
    constructor() {
        // Role configuration cache
        this.roleConfigCache = new Map();
        this.roleConfigTimestamps = new Map();
        
        // Configuration
        this.configCacheTTL = 60 * 60 * 1000; // 1 hour in milliseconds
        this.firestoreCollectionName = 'role_configs';
        
        // Firestore references
        this.db = null;
        this.roleConfigsRef = null;
        this.listener = null;
        
        // Role change listeners
        this.roleChangeListeners = [];
        
        // Initialization state
        this.isInitialized = false;
        this.initPromise = null;
        
        console.info('[RBACService] Created');
    }
    
    /**
     * Initialize RBACService
     * - Wait for Firebase to be ready
     * - Get Firestore instance
     * - Load role configurations
     * 
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isInitialized) {
            return;
        }
        
        if (this.initPromise) {
            return this.initPromise;
        }
        
        this.initPromise = this._performInit();
        return this.initPromise;
    }
    
    /**
     * Perform initialization
     * 
     * @private
     * @returns {Promise<void>}
     */
    async _performInit() {
        try {
            // Wait for Firebase to be available
            if (typeof firebase === 'undefined') {
                await new Promise(resolve => {
                    const checkFirebase = () => {
                        if (typeof firebase !== 'undefined') {
                            resolve();
                        } else {
                            setTimeout(checkFirebase, 100);
                        }
                    };
                    checkFirebase();
                });
            }
            
            // Get Firestore instance
            this.db = firebase.firestore();
            this.roleConfigsRef = this.db.collection(this.firestoreCollectionName);
            
            // Load role configurations
            await this.loadRoleConfig();
            
            this.isInitialized = true;
            console.info('[RBACService] Initialized successfully');
        } catch (error) {
            console.error('[RBACService] Initialization error:', error);
            throw error;
        }
    }
    
    /**
     * Load role configurations from Firestore
     * Caches all role configurations in memory with TTL
     * 
     * @returns {Promise<Map>} Map of roleId -> roleConfig
     */
    async loadRoleConfig() {
        try {
            if (!this.db) {
                await this.init();
            }
            
            console.info('[RBACService] Loading role configurations from Firestore');
            
            // Fetch all role configurations
            const snapshot = await this.roleConfigsRef.get();
            
            if (snapshot.empty) {
                console.warn('[RBACService] No role configurations found in Firestore');
                return new Map();
            }
            
            // Clear existing cache
            this.roleConfigCache.clear();
            this.roleConfigTimestamps.clear();
            
            // Cache all role configurations
            const now = Date.now();
            const roleConfigs = new Map();
            
            snapshot.forEach(doc => {
                const roleId = doc.id;
                const roleConfig = doc.data();
                
                // Validate required fields
                if (!roleConfig.role || !Array.isArray(roleConfig.accessible_portals)) {
                    console.warn(`[RBACService] Invalid role config for ${roleId}:`, roleConfig);
                    return;
                }
                
                this.roleConfigCache.set(roleId, roleConfig);
                this.roleConfigTimestamps.set(roleId, now);
                roleConfigs.set(roleId, roleConfig);
                
                console.debug(`[RBACService] Cached role config: ${roleId}`, roleConfig);
            });
            
            console.info(`[RBACService] Loaded ${roleConfigs.size} role configurations`);
            
            return roleConfigs;
        } catch (error) {
            console.error('[RBACService] Error loading role configurations:', error);
            throw error;
        }
    }
    
    /**
     * Get role configuration for a specific role
     * Checks cache first, then loads from Firestore if needed or cache expired
     * 
     * @param {string} role - Role identifier
     * @returns {Promise<Object|null>} Role configuration object or null if not found
     */
    async getRoleConfig(role) {
        try {
            if (!role) {
                return null;
            }
            
            // Check if in cache and not expired
            if (this.isCacheValid(role)) {
                const cached = this.roleConfigCache.get(role);
                console.debug('[RBACService] Role config retrieved from cache:', role);
                return cached;
            }
            
            // Cache expired or not found, load from Firestore
            if (!this.db) {
                await this.init();
            }
            
            const doc = await this.roleConfigsRef.doc(role).get();
            
            if (!doc.exists) {
                console.warn(`[RBACService] Role configuration not found: ${role}`);
                return null;
            }
            
            const roleConfig = doc.data();
            
            // Validate required fields
            if (!roleConfig.role || !Array.isArray(roleConfig.accessible_portals)) {
                console.warn(`[RBACService] Invalid role config for ${role}:`, roleConfig);
                return null;
            }
            
            // Cache it
            this.roleConfigCache.set(role, roleConfig);
            this.roleConfigTimestamps.set(role, Date.now());
            
            console.debug('[RBACService] Role config loaded from Firestore:', role);
            
            return roleConfig;
        } catch (error) {
            console.error(`[RBACService] Error getting role config for ${role}:`, error);
            return null;
        }
    }
    
    /**
     * Check if user role can access a specific portal
     * 
     * @param {string} userRole - User's role identifier
     * @param {string} portalId - Portal identifier to check access for
     * @returns {Promise<boolean>} True if role has access, false otherwise
     */
    async canAccessPortal(userRole, portalId) {
        try {
            if (!userRole || !portalId) {
                return false;
            }
            
            const roleConfig = await this.getRoleConfig(userRole);
            
            if (!roleConfig) {
                console.warn(`[RBACService] Role configuration not found: ${userRole}`);
                return false;
            }
            
            // Check if portal is in accessible_portals array
            const hasAccess = Array.isArray(roleConfig.accessible_portals) &&
                             roleConfig.accessible_portals.includes(portalId);
            
            console.debug(`[RBACService] Portal access check - Role: ${userRole}, Portal: ${portalId}, Access: ${hasAccess}`);
            
            return hasAccess;
        } catch (error) {
            console.error('[RBACService] Error checking portal access:', error);
            return false;
        }
    }
    
    /**
     * Check if user role can access a specific feature
     * 
     * @param {string} userRole - User's role identifier
     * @param {string} featureId - Feature identifier to check access for
     * @returns {Promise<boolean>} True if role has access, false otherwise
     */
    async canAccessFeature(userRole, featureId) {
        try {
            if (!userRole || !featureId) {
                return false;
            }
            
            const roleConfig = await this.getRoleConfig(userRole);
            
            if (!roleConfig) {
                console.warn(`[RBACService] Role configuration not found: ${userRole}`);
                return false;
            }
            
            // Check if feature is in accessible_features array
            const hasAccess = Array.isArray(roleConfig.accessible_features) &&
                             roleConfig.accessible_features.includes(featureId);
            
            console.debug(`[RBACService] Feature access check - Role: ${userRole}, Feature: ${featureId}, Access: ${hasAccess}`);
            
            return hasAccess;
        } catch (error) {
            console.error('[RBACService] Error checking feature access:', error);
            return false;
        }
    }
    
    /**
     * Get all accessible portals for a role
     * 
     * @param {string} userRole - User's role identifier
     * @returns {Promise<Array<string>>} Array of accessible portal IDs
     */
    async getAccessiblePortals(userRole) {
        try {
            if (!userRole) {
                return [];
            }
            
            const roleConfig = await this.getRoleConfig(userRole);
            
            if (!roleConfig || !Array.isArray(roleConfig.accessible_portals)) {
                return [];
            }
            
            return roleConfig.accessible_portals;
        } catch (error) {
            console.error('[RBACService] Error getting accessible portals:', error);
            return [];
        }
    }
    
    /**
     * Get all accessible features for a role
     * 
     * @param {string} userRole - User's role identifier
     * @returns {Promise<Array<string>>} Array of accessible feature IDs
     */
    async getAccessibleFeatures(userRole) {
        try {
            if (!userRole) {
                return [];
            }
            
            const roleConfig = await this.getRoleConfig(userRole);
            
            if (!roleConfig || !Array.isArray(roleConfig.accessible_features)) {
                return [];
            }
            
            return roleConfig.accessible_features;
        } catch (error) {
            console.error('[RBACService] Error getting accessible features:', error);
            return [];
        }
    }
    
    /**
     * Get sidebar configuration for a role
     * Returns portal list with display names for dynamic sidebar generation
     * 
     * @param {string} userRole - User's role identifier
     * @returns {Promise<Array>} Array of sidebar portal configurations
     */
    async getSidebarConfig(userRole) {
        try {
            if (!userRole) {
                return [];
            }
            
            const roleConfig = await this.getRoleConfig(userRole);
            
            if (!roleConfig || !Array.isArray(roleConfig.accessible_portals)) {
                return [];
            }
            
            // Return portals with their display information
            const sidebarItems = roleConfig.accessible_portals.map(portalId => ({
                portalId,
                displayName: roleConfig.portal_display_names?.[portalId] || 
                            this.formatPortalName(portalId),
                icon: roleConfig.portal_icons?.[portalId] || null,
                order: roleConfig.portal_order?.[portalId] || 999
            }));
            
            // Sort by order
            sidebarItems.sort((a, b) => a.order - b.order);
            
            console.debug('[RBACService] Sidebar config for role:', userRole, sidebarItems);
            
            return sidebarItems;
        } catch (error) {
            console.error('[RBACService] Error getting sidebar config:', error);
            return [];
        }
    }
    
    /**
     * Format portal ID to display name
     * Converts 'admin-portal' to 'Admin Portal'
     * 
     * @private
     * @param {string} portalId - Portal identifier
     * @returns {string} Formatted display name
     */
    formatPortalName(portalId) {
        return portalId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    /**
     * Refresh role configuration from Firestore
     * Clears cache for a specific role or all roles if no role specified
     * 
     * @param {string} [role] - Optional specific role to refresh
     * @returns {Promise<void>}
     */
    async refreshRoleConfig(role) {
        try {
            if (role) {
                // Clear cache for specific role
                this.roleConfigCache.delete(role);
                this.roleConfigTimestamps.delete(role);
                console.info(`[RBACService] Cleared cache for role: ${role}`);
                
                // Reload this role
                await this.getRoleConfig(role);
            } else {
                // Reload all roles
                await this.loadRoleConfig();
            }
        } catch (error) {
            console.error('[RBACService] Error refreshing role config:', error);
            throw error;
        }
    }
    
    /**
     * Check if a role configuration cache is still valid
     * 
     * @private
     * @param {string} role - Role identifier
     * @returns {boolean} True if cache is valid and not expired
     */
    isCacheValid(role) {
        if (!this.roleConfigCache.has(role)) {
            return false;
        }
        
        const timestamp = this.roleConfigTimestamps.get(role);
        if (!timestamp) {
            return false;
        }
        
        const age = Date.now() - timestamp;
        return age < this.configCacheTTL;
    }
    
    /**
     * Subscribe to role changes
     * Listener is called when role configuration changes in Firestore
     * 
     * @param {Function} callback - Called with role configuration changes
     * @returns {Function} Unsubscribe function
     */
    onRoleConfigChanged(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        
        this.roleChangeListeners.push(callback);
        
        // Set up Firestore real-time listener if not already set
        if (!this.listener && this.db) {
            this.setupRoleConfigListener();
        }
        
        // Return unsubscribe function
        return () => {
            this.roleChangeListeners = this.roleChangeListeners.filter(l => l !== callback);
        };
    }
    
    /**
     * Set up real-time listener for role configuration changes
     * 
     * @private
     */
    setupRoleConfigListener() {
        if (!this.db || this.listener) {
            return;
        }
        
        try {
            this.listener = this.roleConfigsRef.onSnapshot(
                (snapshot) => {
                    console.info('[RBACService] Role configurations changed');
                    
                    // Update cache with changed documents
                    const now = Date.now();
                    snapshot.docChanges().forEach(change => {
                        const roleId = change.doc.id;
                        const roleConfig = change.doc.data();
                        
                        if (change.type === 'added' || change.type === 'modified') {
                            this.roleConfigCache.set(roleId, roleConfig);
                            this.roleConfigTimestamps.set(roleId, now);
                            
                            console.debug(`[RBACService] Role config ${change.type}: ${roleId}`);
                            
                            // Notify listeners
                            this.notifyRoleChangeListeners({
                                roleId,
                                type: change.type,
                                config: roleConfig
                            });
                        } else if (change.type === 'removed') {
                            this.roleConfigCache.delete(roleId);
                            this.roleConfigTimestamps.delete(roleId);
                            
                            console.debug(`[RBACService] Role config removed: ${roleId}`);
                            
                            // Notify listeners
                            this.notifyRoleChangeListeners({
                                roleId,
                                type: 'removed',
                                config: null
                            });
                        }
                    });
                },
                (error) => {
                    console.error('[RBACService] Role config listener error:', error);
                }
            );
            
            console.info('[RBACService] Real-time listener set up for role configurations');
        } catch (error) {
            console.error('[RBACService] Error setting up role config listener:', error);
        }
    }
    
    /**
     * Notify all role change listeners
     * 
     * @private
     * @param {Object} change - Change event object
     */
    notifyRoleChangeListeners(change) {
        this.roleChangeListeners.forEach(listener => {
            try {
                listener(change);
            } catch (error) {
                console.error('[RBACService] Error in role change listener:', error);
            }
        });
    }
    
    /**
     * Get role configuration from cache
     * Use getRoleConfig instead for automatic loading from Firestore
     * This is a synchronous method for cases where you're certain cache is populated
     * 
     * @param {string} role - Role identifier
     * @returns {Object|null} Role configuration or null
     */
    getRoleConfigSync(role) {
        if (!role) {
            return null;
        }
        
        return this.roleConfigCache.get(role) || null;
    }
    
    /**
     * Get all cached roles
     * 
     * @returns {Array<string>} Array of role identifiers
     */
    getCachedRoles() {
        return Array.from(this.roleConfigCache.keys());
    }
    
    /**
     * Clear all role configuration cache
     * Useful for testing or manual refresh
     */
    clearCache() {
        this.roleConfigCache.clear();
        this.roleConfigTimestamps.clear();
        console.info('[RBACService] Cache cleared');
    }
    
    /**
     * Get cache statistics
     * 
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            cachedRoles: this.roleConfigCache.size,
            cacheSize: JSON.stringify(Array.from(this.roleConfigCache.values())).length,
            isInitialized: this.isInitialized,
            hasCacheTTL: this.configCacheTTL,
            roles: this.getCachedRoles()
        };
    }
    
    /**
     * Destroy service and clean up resources
     * Should be called before app shutdown
     */
    destroy() {
        // Unsubscribe from real-time listener
        if (this.listener) {
            this.listener();
            this.listener = null;
        }
        
        // Clear cache
        this.clearCache();
        
        // Clear listeners
        this.roleChangeListeners = [];
        
        console.info('[RBACService] Destroyed');
    }
}

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RBACService;
}

// Create singleton instance
let rbacServiceInstance = null;

/**
 * Get or create RBACService singleton
 * 
 * @returns {RBACService}
 */
function getRBACService() {
    if (!rbacServiceInstance) {
        rbacServiceInstance = new RBACService();
    }
    return rbacServiceInstance;
}

// Expose globally
if (typeof window !== 'undefined') {
    window.RBACService = RBACService;
    window.getRBACService = getRBACService;
}
