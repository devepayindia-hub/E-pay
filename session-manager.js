/**
 * Session Manager for ePay CRM
 * Handles comprehensive session-based data management
 * All data is organized and saved per user session
 */

const SessionManager = {
    // Current session data
    currentSession: null,
    sessionListeners: [],
    
    /**
     * Initialize session manager
     * Creates or restores user session
     */
    init: async function() {
        try {
            // Check for existing session in localStorage
            const savedSession = localStorage.getItem('epay_current_session');
            if (savedSession) {
                this.currentSession = JSON.parse(savedSession);
                console.log('[Session] Restored existing session:', this.currentSession.sessionId);
                
                // Verify session is still valid in Firebase
                await this.verifySession();
            } else {
                // Create new session
                await this.createNewSession();
            }
            
            // Set up session heartbeat
            this.startHeartbeat();
            
            // Notify listeners
            this.notifyListeners('sessionInitialized', this.currentSession);
            
            return this.currentSession;
        } catch (error) {
            console.error('[Session] Initialization failed:', error);
            // Create fallback session
            this.currentSession = this.createFallbackSession();
            return this.currentSession;
        }
    },
    
    /**
     * Create a new user session
     */
    createNewSession: async function() {
        const sessionId = this.generateSessionId();
        const timestamp = new Date().toISOString();
        
        // Determine user info (from auth or localStorage)
        const userInfo = this.getUserInfo();
        
        this.currentSession = {
            sessionId: sessionId,
            userId: userInfo.userId || 'anonymous',
            email: userInfo.email || 'anonymous@epay.in',
            role: userInfo.role || 'guest',
            displayName: userInfo.displayName || 'Guest User',
            startTime: timestamp,
            lastActivity: timestamp,
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            ipAddress: null, // Will be filled by backend if needed
            deviceInfo: this.getDeviceInfo(),
            activities: [],
            data: {
                leads: [],
                travelLeads: [],
                formData: {},
                userPreferences: {},
                temporaryData: {}
            }
        };
        
        // Save to localStorage
        this.saveSessionLocally();
        
        // Save to Firebase
        try {
            if (window.FirebaseServices) {
                const { db } = window.FirebaseServices;
                await db.collection('sessions').doc(sessionId).set({
                    ...this.currentSession,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('[Session] New session saved to Firebase:', sessionId);
            }
        } catch (error) {
            console.error('[Session] Failed to save to Firebase:', error);
        }
        
        console.log('[Session] New session created:', sessionId);
        return this.currentSession;
    },
    
    /**
     * Verify existing session is still valid
     */
    verifySession: async function() {
        if (!this.currentSession || !window.FirebaseServices) return;
        
        try {
            const { db } = window.FirebaseServices;
            const sessionRef = db.collection('sessions').doc(this.currentSession.sessionId);
            const doc = await sessionRef.get();
            
            if (!doc.exists) {
                console.log('[Session] Session not found in Firebase, creating new one');
                await this.createNewSession();
            } else {
                // Update last activity
                await sessionRef.update({
                    lastActivity: firebase.firestore.FieldValue.serverTimestamp(),
                    page: window.location.pathname
                });
            }
        } catch (error) {
            console.error('[Session] Verification failed:', error);
        }
    },
    
    /**
     * Generate unique session ID
     */
    generateSessionId: function() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    /**
     * Get user information from various sources
     */
    getUserInfo: function() {
        // Try to get from localStorage (staff login)
        const role = localStorage.getItem('crm-role');
        const storedUser = localStorage.getItem('epay_user_info');
        
        if (storedUser) {
            return JSON.parse(storedUser);
        }
        
        // Try to get from Firebase Auth
        if (window.FirebaseServices && window.FirebaseServices.auth) {
            const user = window.FirebaseServices.auth.currentUser;
            if (user) {
                return {
                    userId: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email.split('@')[0],
                    role: role || 'user'
                };
            }
        }
        
        // Return anonymous user info
        return {
            userId: 'anonymous_' + Date.now(),
            email: 'anonymous@epay.in',
            displayName: 'Guest User',
            role: role || 'guest'
        };
    },
    
    /**
     * Get device information
     */
    getDeviceInfo: function() {
        return {
            platform: navigator.platform,
            browser: this.getBrowserInfo(),
            screen: {
                width: window.screen.width,
                height: window.screen.height
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled
        };
    },
    
    /**
     * Get browser information
     */
    getBrowserInfo: function() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        else if (ua.includes('Opera')) browser = 'Opera';
        
        return browser;
    },
    
    /**
     * Create fallback session for offline/error scenarios
     */
    createFallbackSession: function() {
        const sessionId = this.generateSessionId();
        return {
            sessionId: sessionId,
            userId: 'fallback_user',
            email: 'fallback@epay.in',
            role: 'guest',
            displayName: 'Fallback User',
            startTime: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            page: window.location.pathname,
            isFallback: true,
            data: {
                leads: [],
                travelLeads: [],
                formData: {},
                userPreferences: {},
                temporaryData: {}
            }
        };
    },
    
    /**
     * Save session locally
     */
    saveSessionLocally: function() {
        try {
            localStorage.setItem('epay_current_session', JSON.stringify(this.currentSession));
        } catch (error) {
            console.error('[Session] Failed to save session locally:', error);
        }
    },
    
    /**
     * Start heartbeat to keep session alive
     */
    startHeartbeat: function() {
        // Update last activity every 30 seconds
        this.heartbeatInterval = setInterval(() => {
            this.updateActivity();
        }, 30000);
        
        // Track page changes
        window.addEventListener('beforeunload', () => {
            this.updateActivity();
        });
        
        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.updateActivity();
            }
        });
    },
    
    /**
     * Update session activity
     */
    updateActivity: async function() {
        if (!this.currentSession) return;
        
        this.currentSession.lastActivity = new Date().toISOString();
        this.currentSession.page = window.location.pathname;
        this.saveSessionLocally();
        
        // Update in Firebase
        try {
            if (window.FirebaseServices) {
                const { db } = window.FirebaseServices;
                await db.collection('sessions').doc(this.currentSession.sessionId).update({
                    lastActivity: firebase.firestore.FieldValue.serverTimestamp(),
                    page: this.currentSession.page
                });
            }
        } catch (error) {
            console.error('[Session] Failed to update activity:', error);
        }
    },
    
    /**
     * Add activity to session
     */
    addActivity: function(activityType, activityData = {}) {
        if (!this.currentSession) return;
        
        const activity = {
            type: activityType,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            data: activityData
        };
        
        this.currentSession.activities.push(activity);
        
        // Keep only last 100 activities
        if (this.currentSession.activities.length > 100) {
            this.currentSession.activities = this.currentSession.activities.slice(-100);
        }
        
        this.saveSessionLocally();
        
        // Sync to Firebase periodically
        this.syncActivities();
    },
    
    /**
     * Sync activities to Firebase
     */
    syncActivities: async function() {
        if (!this.currentSession || !window.FirebaseServices) return;
        
        try {
            const { db } = window.FirebaseServices;
            await db.collection('sessions').doc(this.currentSession.sessionId).update({
                activities: this.currentSession.activities,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('[Session] Failed to sync activities:', error);
        }
    },
    
    /**
     * Save data to session
     */
    saveData: async function(dataKey, dataValue, category = 'temporaryData') {
        if (!this.currentSession) {
            await this.init();
        }
        
        this.currentSession.data[category][dataKey] = dataValue;
        this.saveSessionLocally();
        
        // Add activity
        this.addActivity('data_saved', { key: dataKey, category: category });
        
        // Sync to Firebase
        try {
            if (window.FirebaseServices) {
                const { db } = window.FirebaseServices;
                await db.collection('sessions').doc(this.currentSession.sessionId).update({
                    [`data.${category}.${dataKey}`]: dataValue,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        } catch (error) {
            console.error('[Session] Failed to save data:', error);
        }
        
        return { success: true, sessionId: this.currentSession.sessionId };
    },
    
    /**
     * Get data from session
     */
    getData: function(dataKey, category = 'temporaryData') {
        if (!this.currentSession) return null;
        return this.currentSession.data[category][dataKey] || null;
    },
    
    /**
     * Save lead data to session
     */
    saveLead: async function(leadData) {
        const leadWithSession = {
            ...leadData,
            sessionId: this.currentSession.sessionId,
            userId: this.currentSession.userId,
            sessionData: {
                page: this.currentSession.page,
                timestamp: new Date().toISOString()
            }
        };
        
        // Add to session data
        this.currentSession.data.leads.push(leadWithSession);
        this.saveSessionLocally();
        
        // Add activity
        this.addActivity('lead_created', { leadId: leadData.id || 'pending' });
        
        // Save to Firebase leads collection
        try {
            if (window.FirebaseServices) {
                const { db } = window.FirebaseServices;
                const leadRef = await db.collection('leads').add({
                    ...leadWithSession,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'new'
                });
                
                // Update session with lead reference
                await db.collection('sessions').doc(this.currentSession.sessionId).update({
                    'data.leads': this.currentSession.data.leads,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                return { success: true, leadId: leadRef.id, sessionId: this.currentSession.sessionId };
            }
        } catch (error) {
            console.error('[Session] Failed to save lead:', error);
        }
        
        return { success: true, sessionId: this.currentSession.sessionId, fallback: true };
    },
    
    /**
     * Save travel lead to session
     */
    saveTravelLead: async function(travelLeadData) {
        const leadWithSession = {
            ...travelLeadData,
            sessionId: this.currentSession.sessionId,
            userId: this.currentSession.userId,
            sessionData: {
                page: this.currentSession.page,
                timestamp: new Date().toISOString()
            }
        };
        
        // Add to session data
        this.currentSession.data.travelLeads.push(leadWithSession);
        this.saveSessionLocally();
        
        // Add activity
        this.addActivity('travel_lead_created', { type: travelLeadData.type });
        
        // Save to Firebase travel_leads collection
        try {
            if (window.FirebaseServices) {
                const { db } = window.FirebaseServices;
                const leadRef = await db.collection('travel_leads').add({
                    ...leadWithSession,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'pending'
                });
                
                // Update session
                await db.collection('sessions').doc(this.currentSession.sessionId).update({
                    'data.travelLeads': this.currentSession.data.travelLeads,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                return { success: true, leadId: leadRef.id, sessionId: this.currentSession.sessionId };
            }
        } catch (error) {
            console.error('[Session] Failed to save travel lead:', error);
        }
        
        return { success: true, sessionId: this.currentSession.sessionId, fallback: true };
    },
    
    /**
     * Save form data to session
     */
    saveFormData: async function(formId, formData) {
        return this.saveData(formId, formData, 'formData');
    },
    
    /**
     * Get form data from session
     */
    getFormData: function(formId) {
        return this.getData(formId, 'formData');
    },
    
    /**
     * Save user preferences
     */
    savePreferences: async function(preferences) {
        return this.saveData('user', preferences, 'userPreferences');
    },
    
    /**
     * Get user preferences
     */
    getPreferences: function() {
        return this.getData('user', 'userPreferences');
    },
    
    /**
     * End current session
     */
    endSession: async function() {
        if (!this.currentSession) return;
        
        // Stop heartbeat
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        
        // Update session end time
        this.currentSession.endTime = new Date().toISOString();
        this.currentSession.duration = this.calculateDuration();
        
        // Save final state
        this.saveSessionLocally();
        
        // Update in Firebase
        try {
            if (window.FirebaseServices) {
                const { db } = window.FirebaseServices;
                await db.collection('sessions').doc(this.currentSession.sessionId).update({
                    endTime: firebase.firestore.FieldValue.serverTimestamp(),
                    duration: this.currentSession.duration,
                    status: 'completed'
                });
            }
        } catch (error) {
            console.error('[Session] Failed to end session:', error);
        }
        
        // Clear local session
        localStorage.removeItem('epay_current_session');
        this.currentSession = null;
        
        // Update presence
        try {
            if (window.FirebaseDataService) {
                await FirebaseDataService.removePresence(this.currentSession?.userId);
            }
        } catch (error) {
            console.error('[Session] Failed to remove presence:', error);
        }
        
        console.log('[Session] Session ended');
    },
    
    /**
     * Calculate session duration
     */
    calculateDuration: function() {
        if (!this.currentSession || !this.currentSession.startTime) return 0;
        
        const start = new Date(this.currentSession.startTime).getTime();
        const end = new Date().getTime();
        return Math.floor((end - start) / 1000); // Duration in seconds
    },
    
    /**
     * Get current session info
     */
    getCurrentSession: function() {
        return this.currentSession;
    },
    
    /**
     * Add session listener
     */
    addListener: function(callback) {
        this.sessionListeners.push(callback);
    },
    
    /**
     * Remove session listener
     */
    removeListener: function(callback) {
        this.sessionListeners = this.sessionListeners.filter(cb => cb !== callback);
    },
    
    /**
     * Notify all listeners
     */
    notifyListeners: function(event, data) {
        this.sessionListeners.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('[Session] Listener error:', error);
            }
        });
    },
    
    /**
     * Get session statistics
     */
    getSessionStats: function() {
        if (!this.currentSession) return null;
        
        return {
            sessionId: this.currentSession.sessionId,
            userId: this.currentSession.userId,
            duration: this.calculateDuration(),
            activitiesCount: this.currentSession.activities.length,
            leadsCount: this.currentSession.data.leads.length,
            travelLeadsCount: this.currentSession.data.travelLeads.length,
            pagesVisited: [...new Set(this.currentSession.activities.map(a => a.page))].length,
            deviceInfo: this.currentSession.deviceInfo
        };
    }
};

// Make SessionManager globally available
window.SessionManager = SessionManager;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SessionManager.init());
} else {
    SessionManager.init();
}

console.log('[Session] Session Manager loaded');