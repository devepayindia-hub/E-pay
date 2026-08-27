/**
 * UserProfileService - Firestore User Profile Management
 * 
 * Provides complete user profile CRUD operations with Firestore integration:
 * - Create user profiles with validation
 * - Fetch profiles with automatic lastLogin update
 * - Update profile information
 * - Deactivate users (soft delete)
 * - Local profile caching for performance
 * - Profile data consistency validation
 * 
 * Firestore Collection Schema:
 * - users/{uid}
 *   - uid: string (document ID, matches Firebase Auth UID)
 *   - email: string (user email)
 *   - displayName: string (user display name)
 *   - photoURL: string (optional, user profile photo)
 *   - role: string (user role: admin, manager, user, etc.)
 *   - createdAt: Timestamp (profile creation time)
 *   - lastLogin: Timestamp (last login time, auto-updated)
 *   - isActive: boolean (true=active, false=deactivated)
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 * Task: 3.1 Implement UserProfileService with Firestore CRUD operations
 */

class UserProfileService {
    constructor() {
        // Firestore reference
        this.db = null;
        this.usersCollection = 'users';
        
        // Local cache
        this.profileCache = new Map(); // uid -> profile object
        this.cacheTimestamps = new Map(); // uid -> last cache time
        this.cacheTTL = 5 * 60 * 1000; // 5 minute cache TTL
        
        // Configuration
        this.requiredProfileFields = ['uid', 'email', 'displayName', 'role'];
        this.validRoles = ['admin', 'manager', 'supervisor', 'user', 'accountant', 'guest'];
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize UserProfileService
     * Waits for Firebase and Firestore to be ready
     */
    init() {
        // Wait for Firebase to be available
        if (typeof firebase === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        try {
            this.db = firebase.firestore();
            console.info('[UserProfileService] Initialized successfully');
        } catch (error) {
            console.error('[UserProfileService] Initialization error:', error);
            setTimeout(() => this.init(), 1000);
        }
    }
    
    /**
     * Create a new user profile in Firestore
     * Validates all required fields and consistency
     * 
     * @param {string} uid - Firebase Auth UID (unique identifier)
     * @param {string} email - User email address
     * @param {string} displayName - Display name (can be any string)
     * @param {string} role - User role (must be in validRoles list)
     * @param {Object} additionalData - Optional additional profile fields (photoURL, etc.)
     * @returns {Promise<Object>} Created profile object with timestamps
     * @throws {Error} If validation fails or Firestore write fails
     */
    async createUserProfile(uid, email, displayName, role, additionalData = {}) {
        try {
            // Validate required inputs
            if (!uid || !email || !displayName || !role) {
                throw {
                    code: 'missing-fields',
                    message: 'uid, email, displayName, and role are required'
                };
            }
            
            // Validate uid format (should be alphanumeric)
            if (typeof uid !== 'string' || uid.length < 10) {
                throw {
                    code: 'invalid-uid',
                    message: 'uid must be a valid Firebase UID'
                };
            }
            
            // Validate email format
            if (!this.isValidEmail(email)) {
                throw {
                    code: 'invalid-email',
                    message: 'Invalid email format'
                };
            }
            
            // Validate displayName
            if (typeof displayName !== 'string' || displayName.trim().length === 0) {
                throw {
                    code: 'invalid-displayName',
                    message: 'displayName must be a non-empty string'
                };
            }
            
            // Validate role
            if (!this.validRoles.includes(role)) {
                throw {
                    code: 'invalid-role',
                    message: `role must be one of: ${this.validRoles.join(', ')}`
                };
            }
            
            console.info('[UserProfileService] Creating user profile:', { uid, email, role });
            
            // Create profile object with validated data
            const now = new Date();
            const profileData = {
                uid,
                email: email.toLowerCase(), // Normalize email
                displayName: displayName.trim(),
                role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                isActive: true,
                photoURL: additionalData.photoURL || null,
                ...additionalData
            };
            
            // Write to Firestore
            const userRef = this.db.collection(this.usersCollection).doc(uid);
            await userRef.set(profileData, { merge: false }); // Use set() to ensure it doesn't merge with existing
            
            // Store in local cache
            const cachedProfile = {
                ...profileData,
                createdAt: now,
                lastLogin: now
            };
            this.profileCache.set(uid, cachedProfile);
            this.cacheTimestamps.set(uid, Date.now());
            
            console.info('[UserProfileService] User profile created successfully:', uid);
            
            return cachedProfile;
        } catch (error) {
            console.error('[UserProfileService] Error creating user profile:', error.code || error.message);
            throw this.mapFirestoreError(error);
        }
    }
    
    /**
     * Retrieve a user profile from Firestore
     * Auto-updates lastLogin timestamp on fetch
     * Uses local cache if available and fresh
     * 
     * @param {string} uid - Firebase Auth UID
     * @param {boolean} forceRefresh - Force fetch from Firestore, skip cache
     * @returns {Promise<Object>} User profile object or null if not found
     * @throws {Error} If Firestore read fails
     */
    async getUserProfile(uid, forceRefresh = false) {
        try {
            if (!uid) {
                throw new Error('uid is required');
            }
            
            // Check cache first (unless forceRefresh is true)
            if (!forceRefresh && this.isProfileCached(uid)) {
                console.debug('[UserProfileService] Returning cached profile:', uid);
                return this.profileCache.get(uid);
            }
            
            console.debug('[UserProfileService] Fetching profile from Firestore:', uid);
            
            // Fetch from Firestore
            const userRef = this.db.collection(this.usersCollection).doc(uid);
            const doc = await userRef.get();
            
            if (!doc.exists) {
                console.warn('[UserProfileService] Profile not found:', uid);
                return null;
            }
            
            const profileData = doc.data();
            
            // Auto-update lastLogin timestamp
            try {
                await userRef.update({
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
                profileData.lastLogin = new Date(); // Update cache immediately
            } catch (updateError) {
                console.warn('[UserProfileService] Failed to update lastLogin:', updateError);
            }
            
            // Store in cache
            this.profileCache.set(uid, profileData);
            this.cacheTimestamps.set(uid, Date.now());
            
            console.info('[UserProfileService] User profile fetched successfully:', uid);
            
            return profileData;
        } catch (error) {
            console.error('[UserProfileService] Error fetching user profile:', error.code || error.message);
            throw this.mapFirestoreError(error);
        }
    }
    
    /**
     * Update user profile information
     * Clears profile cache after update
     * 
     * @param {string} uid - Firebase Auth UID
     * @param {Object} updates - Object containing fields to update
     *   - displayName: string
     *   - photoURL: string
     *   - role: string (must be in validRoles)
     *   - or any other profile field
     * @returns {Promise<Object>} Updated profile object
     * @throws {Error} If validation fails or Firestore write fails
     */
    async updateUserProfile(uid, updates) {
        // Validate before try block - let sync errors propagate immediately
        if (!uid) {
            throw new Error('uid is required');
        }
        
        if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
            throw new Error('updates object with at least one field is required');
        }
        
        try {
            // Validate fields being updated - this will throw if invalid
            const validatedUpdates = this.validateProfileUpdates(updates);
            
            console.info('[UserProfileService] Updating user profile:', { uid, fields: Object.keys(validatedUpdates) });
            
            // Update in Firestore
            const userRef = this.db.collection(this.usersCollection).doc(uid);
            await userRef.update({
                ...validatedUpdates,
                lastModified: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Clear cache for this profile
            this.profileCache.delete(uid);
            this.cacheTimestamps.delete(uid);
            
            // Fetch fresh profile from Firestore
            const updatedProfile = await this.getUserProfile(uid, true);
            
            console.info('[UserProfileService] User profile updated successfully:', uid);
            
            return updatedProfile;
        } catch (error) {
            console.error('[UserProfileService] Error updating user profile:', error.code || error.message);
            throw this.mapFirestoreError(error);
        }
    }
    
    /**
     * Deactivate a user (soft delete)
     * Sets isActive to false, does not delete the profile
     * User can be reactivated by updating isActive to true
     * 
     * @param {string} uid - Firebase Auth UID
     * @returns {Promise<Object>} Updated profile with isActive=false
     * @throws {Error} If Firestore write fails
     */
    async deactivateUser(uid) {
        try {
            if (!uid) {
                throw new Error('uid is required');
            }
            
            // Update isActive to false
            const userRef = this.db.collection(this.usersCollection).doc(uid);
            await userRef.update({
                isActive: false,
                deactivatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Clear cache
            this.profileCache.delete(uid);
            this.cacheTimestamps.delete(uid);
            
            // Fetch and return updated profile
            const updatedProfile = await this.getUserProfile(uid, true);
            
            console.info('[UserProfileService] User deactivated successfully:', uid);
            
            return updatedProfile;
        } catch (error) {
            console.error('[UserProfileService] Error deactivating user:', error.code || error.message);
            throw this.mapFirestoreError(error);
        }
    }
    
    /**
     * Get profile from local cache
     * Returns null if not in cache or cache is stale
     * 
     * @param {string} uid - Firebase Auth UID
     * @returns {Object|null} Cached profile or null
     */
    getProfileFromCache(uid) {
        if (!uid) {
            return null;
        }
        
        if (this.isProfileCached(uid)) {
            return this.profileCache.get(uid);
        }
        
        return null;
    }
    
    /**
     * Clear profile cache for a specific user or all users
     * 
     * @param {string} uid - Optional specific uid to clear, if not provided clears all
     */
    clearProfileCache(uid) {
        if (uid) {
            this.profileCache.delete(uid);
            this.cacheTimestamps.delete(uid);
            console.debug('[UserProfileService] Cleared cache for user:', uid);
        } else {
            this.profileCache.clear();
            this.cacheTimestamps.clear();
            console.debug('[UserProfileService] Cleared all profile cache');
        }
    }
    
    /**
     * Get multiple user profiles
     * Batch fetch profiles by UIDs
     * 
     * @param {string[]} uids - Array of Firebase Auth UIDs
     * @returns {Promise<Object[]>} Array of profile objects
     */
    async getUserProfiles(uids) {
        try {
            if (!Array.isArray(uids) || uids.length === 0) {
                return [];
            }
            
            console.debug('[UserProfileService] Fetching multiple profiles:', uids.length);
            
            // Firestore limits batch gets to 10 documents
            const batchSize = 10;
            const profiles = [];
            
            for (let i = 0; i < uids.length; i += batchSize) {
                const batch = uids.slice(i, i + batchSize);
                
                // Check cache first
                const uncachedUids = batch.filter(uid => !this.isProfileCached(uid));
                
                if (uncachedUids.length > 0) {
                    // Fetch uncached profiles using document IDs
                    // Since each document ID is a UID, we can use simple collection queries
                    const snapshot = await this.db.collection(this.usersCollection)
                        .where('uid', 'in', uncachedUids)
                        .get();
                    
                    snapshot.docs.forEach(doc => {
                        const profile = doc.data();
                        this.profileCache.set(doc.id, profile);
                        this.cacheTimestamps.set(doc.id, Date.now());
                        profiles.push(profile);
                    });
                }
                
                // Add cached profiles
                batch.forEach(uid => {
                    if (this.isProfileCached(uid)) {
                        profiles.push(this.profileCache.get(uid));
                    }
                });
            }
            
            return profiles;
        } catch (error) {
            console.error('[UserProfileService] Error fetching multiple profiles:', error.code || error.message);
            throw this.mapFirestoreError(error);
        }
    }
    
    /**
     * Check if a profile exists and is active
     * 
     * @param {string} uid - Firebase Auth UID
     * @returns {Promise<boolean>} true if profile exists and is active
     */
    async isProfileActive(uid) {
        try {
            const profile = await this.getUserProfile(uid);
            return profile ? profile.isActive === true : false;
        } catch (error) {
            console.error('[UserProfileService] Error checking if profile is active:', error);
            return false;
        }
    }
    
    /**
     * Check if a profile is cached and fresh
     * 
     * @private
     * @param {string} uid - Firebase Auth UID
     * @returns {boolean}
     */
    isProfileCached(uid) {
        if (!this.profileCache.has(uid)) {
            return false;
        }
        
        const cacheTime = this.cacheTimestamps.get(uid);
        const age = Date.now() - cacheTime;
        
        return age < this.cacheTTL;
    }
    
    /**
     * Validate profile update data
     * 
     * @private
     * @param {Object} updates - Fields to validate
     * @returns {Object} Validated updates
     * @throws {Error} If validation fails
     */
    validateProfileUpdates(updates) {
        const validated = {};
        
        // Validate displayName if present
        if ('displayName' in updates) {
            if (typeof updates.displayName !== 'string' || updates.displayName.trim().length === 0) {
                throw new Error('displayName must be a non-empty string');
            }
            validated.displayName = updates.displayName.trim();
        }
        
        // Validate role if present
        if ('role' in updates) {
            if (!this.validRoles.includes(updates.role)) {
                throw new Error(`role must be one of: ${this.validRoles.join(', ')}`);
            }
            validated.role = updates.role;
        }
        
        // Validate photoURL if present
        if ('photoURL' in updates) {
            if (updates.photoURL !== null && typeof updates.photoURL !== 'string') {
                throw new Error('photoURL must be a string or null');
            }
            validated.photoURL = updates.photoURL;
        }
        
        // Validate isActive if present
        if ('isActive' in updates) {
            if (typeof updates.isActive !== 'boolean') {
                throw new Error('isActive must be a boolean');
            }
            validated.isActive = updates.isActive;
        }
        
        // Allow any other custom fields as-is (don't validate them)
        Object.keys(updates).forEach(key => {
            if (!['displayName', 'role', 'photoURL', 'isActive', 'uid', 'email', 'createdAt', 'lastLogin'].includes(key)) {
                validated[key] = updates[key];
            }
        });
        
        return validated;
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
     * Map Firestore error codes to standardized format
     * 
     * @private
     * @param {Error} error - Firestore error object
     * @returns {Error} Mapped error with standardized code
     */
    mapFirestoreError(error) {
        // Already mapped
        if (error.code && !error.code.startsWith('firestore/')) {
            return error;
        }
        
        // Firestore errors
        const errorMap = {
            'permission-denied': { code: 'permission-denied', message: 'You do not have permission to perform this operation' },
            'not-found': { code: 'not-found', message: 'The requested profile was not found' },
            'already-exists': { code: 'already-exists', message: 'This profile already exists' },
            'invalid-argument': { code: 'invalid-argument', message: 'Invalid argument provided' },
            'unavailable': { code: 'unavailable', message: 'Service is unavailable. Please try again later' },
            'unauthenticated': { code: 'unauthenticated', message: 'You must be authenticated to perform this operation' },
            'deadline-exceeded': { code: 'deadline-exceeded', message: 'Operation timed out. Please try again' },
            'internal': { code: 'internal', message: 'An internal error occurred' }
        };
        
        // Extract error code (format: "firestore/permission-denied" or just "permission-denied")
        const code = error.code ? error.code.replace('firestore/', '') : null;
        const mapped = errorMap[code] || {
            code: code || 'unknown-error',
            message: error.message || 'An error occurred'
        };
        
        return mapped;
    }
    
    /**
     * Get cache statistics
     * Useful for debugging and monitoring
     * 
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            cachedProfiles: this.profileCache.size,
            cacheTTL: this.cacheTTL,
            cacheItems: Array.from(this.profileCache.entries()).map(([uid, profile]) => ({
                uid,
                displayName: profile.displayName,
                cachedAt: new Date(this.cacheTimestamps.get(uid))
            }))
        };
    }
    
    /**
     * Clean up resources
     * Should be called before service is destroyed
     */
    destroy() {
        this.profileCache.clear();
        this.cacheTimestamps.clear();
        console.info('[UserProfileService] Destroyed');
    }
}

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserProfileService;
}

// Create singleton instance
let userProfileServiceInstance = null;

/**
 * Get or create UserProfileService singleton
 * 
 * @returns {UserProfileService}
 */
function getUserProfileService() {
    if (!userProfileServiceInstance) {
        userProfileServiceInstance = new UserProfileService();
    }
    return userProfileServiceInstance;
}

// Expose globally
if (typeof window !== 'undefined') {
    window.UserProfileService = UserProfileService;
    window.getUserProfileService = getUserProfileService;
}
