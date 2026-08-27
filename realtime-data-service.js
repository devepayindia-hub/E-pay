/**
 * Real-time Data Service for ePay CRM
 * Provides unified Firebase operations for all pages
 * Replaces dummy data with real-time Firestore data
 */

const RealtimeDataService = {
    // Firebase services cache
    services: null,
    
    // Real-time listeners cache
    listeners: {},
    
    // Data cache for performance
    dataCache: {},
    
    /**
     * Initialize Firebase services
     */
    init: async function() {
        if (this.services) return this.services;
        
        return new Promise((resolve, reject) => {
            if (window.FirebaseServices) {
                this.services = window.FirebaseServices;
                console.log('[RealtimeDataService] Firebase services available');
                resolve(this.services);
                return;
            }
            
            // Wait for Firebase initialization
            window.addEventListener('firebaseInitialized', (event) => {
                this.services = window.FirebaseServices;
                console.log('[RealtimeDataService] Firebase initialized:', event.detail);
                resolve(this.services);
            });
            
            window.addEventListener('firebaseInitializationError', (event) => {
                console.error('[RealtimeDataService] Firebase init failed:', event.detail.error);
                reject(new Error(event.detail.error));
            });
            
            setTimeout(() => {
                if (!this.services) {
                    reject(new Error('Firebase initialization timeout'));
                }
            }, 10000);
        });
    },
    
    /**
     * Get current session info
     */
    getSessionInfo: function() {
        if (window.SessionManager && window.SessionManager.getCurrentSession()) {
            return window.SessionManager.getCurrentSession();
        }
        
        // Fallback to localStorage
        try {
            const role = localStorage.getItem('crm-role');
            const email = localStorage.getItem('crm-user-email');
            const name = localStorage.getItem('crm-user-name');
            
            if (role || email) {
                return {
                    userId: email || 'anonymous',
                    email: email || 'anonymous@epay.in',
                    role: role || 'guest',
                    displayName: name || 'Guest User'
                };
            }
        } catch (e) {}
        
        return {
            userId: 'anonymous',
            email: 'anonymous@epay.in',
            role: 'guest',
            displayName: 'Guest User'
        };
    },
    
    /**
     * Real-time leads listener
     */
    listenToLeads: function(callback, filters = {}) {
        this.init().then(({ db }) => {
            let query = db.collection('leads');
            
            // Apply filters
            if (filters.userId) {
                query = query.where('userId', '==', filters.userId);
            }
            if (filters.sessionId) {
                query = query.where('sessionId', '==', filters.sessionId);
            }
            if (filters.status) {
                query = query.where('status', '==', filters.status);
            }
            
            // Order by creation time
            query = query.orderBy('createdAt', 'desc');
            
            // Set up real-time listener
            const listener = query.onSnapshot(
                (snapshot) => {
                    const leads = [];
                    snapshot.forEach(doc => {
                        leads.push({ id: doc.id, ...doc.data() });
                    });
                    callback(leads);
                },
                (error) => {
                    console.error('[RealtimeDataService] Leads listener error:', error);
                    callback([], error);
                }
            );
            
            // Store listener for cleanup
            this.listeners['leads'] = listener;
        });
    },
    
    /**
     * Real-time travel leads listener
     */
    listenToTravelLeads: function(callback, filters = {}) {
        this.init().then(({ db }) => {
            let query = db.collection('travel_leads');
            
            // Apply filters
            if (filters.userId) {
                query = query.where('userId', '==', filters.userId);
            }
            if (filters.sessionId) {
                query = query.where('sessionId', '==', filters.sessionId);
            }
            if (filters.type) {
                query = query.where('type', '==', filters.type);
            }
            
            query = query.orderBy('createdAt', 'desc');
            
            const listener = query.onSnapshot(
                (snapshot) => {
                    const leads = [];
                    snapshot.forEach(doc => {
                        leads.push({ id: doc.id, ...doc.data() });
                    });
                    callback(leads);
                },
                (error) => {
                    console.error('[RealtimeDataService] Travel leads listener error:', error);
                    callback([], error);
                }
            );
            
            this.listeners['travelLeads'] = listener;
        });
    },
    
    /**
     * Real-time sessions listener
     */
    listenToSessions: function(callback, filters = {}) {
        this.init().then(({ db }) => {
            let query = db.collection('sessions');
            
            if (filters.userId) {
                query = query.where('userId', '==', filters.userId);
            }
            if (filters.role) {
                query = query.where('role', '==', filters.role);
            }
            
            query = query.orderBy('startTime', 'desc');
            
            const listener = query.onSnapshot(
                (snapshot) => {
                    const sessions = [];
                    snapshot.forEach(doc => {
                        sessions.push({ id: doc.id, ...doc.data() });
                    });
                    callback(sessions);
                },
                (error) => {
                    console.error('[RealtimeDataService] Sessions listener error:', error);
                    callback([], error);
                }
            );
            
            this.listeners['sessions'] = listener;
        });
    },
    
    /**
     * Real-time presence listener
     */
    listenToPresence: function(callback) {
        this.init().then(({ realtimeDB }) => {
            const presenceRef = realtimeDB.ref('presence');
            
            const listener = presenceRef.on('value', (snapshot) => {
                const presence = [];
                snapshot.forEach((child) => {
                    presence.push({ userId: child.key, ...child.val() });
                });
                callback(presence);
            });
            
            this.listeners['presence'] = listener;
        });
    },
    
    /**
     * Get dashboard statistics (real-time)
     */
    getDashboardStats: function(callback) {
        this.init().then(({ db }) => {
            const sessionInfo = this.getSessionInfo();
            
            // Listen to leads count
            db.collection('leads')
                .where('userId', '==', sessionInfo.userId)
                .onSnapshot(snapshot => {
                    const leadsCount = snapshot.size;
                    
                    // Listen to travel leads count
                    db.collection('travel_leads')
                        .where('userId', '==', sessionInfo.userId)
                        .onSnapshot(travelSnapshot => {
                            const travelLeadsCount = travelSnapshot.size;
                            
                            // Get today's activity
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            
                            db.collection('sessions')
                                .where('userId', '==', sessionInfo.userId)
                                .where('startTime', '>=', today.toISOString())
                                .onSnapshot(sessionSnapshot => {
                                    const todaySessions = sessionSnapshot.size;
                                    
                                    callback({
                                        leadsCount,
                                        travelLeadsCount,
                                        todaySessions,
                                        totalActivities: sessionInfo.activities?.length || 0
                                    });
                                });
                        });
                });
        });
    },
    
    /**
     * Get leads data for dashboard
     */
    getLeadsData: async function(limit = 10) {
        try {
            const { db } = await this.init();
            const sessionInfo = this.getSessionInfo();
            
            const snapshot = await db.collection('leads')
                .where('userId', '==', sessionInfo.userId)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();
            
            const leads = [];
            snapshot.forEach(doc => {
                leads.push({ id: doc.id, ...doc.data() });
            });
            
            return leads;
        } catch (error) {
            console.error('[RealtimeDataService] Error getting leads:', error);
            return [];
        }
    },
    
    /**
     * Get travel leads data
     */
    getTravelLeadsData: async function(limit = 10) {
        try {
            const { db } = await this.init();
            const sessionInfo = this.getSessionInfo();
            
            const snapshot = await db.collection('travel_leads')
                .where('userId', '==', sessionInfo.userId)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();
            
            const leads = [];
            snapshot.forEach(doc => {
                leads.push({ id: doc.id, ...doc.data() });
            });
            
            return leads;
        } catch (error) {
            console.error('[RealtimeDataService] Error getting travel leads:', error);
            return [];
        }
    },
    
    /**
     * Get user activity data
     */
    getActivityData: async function(limit = 20) {
        try {
            const { db } = await this.init();
            const sessionInfo = this.getSessionInfo();
            
            const snapshot = await db.collection('sessions')
                .where('userId', '==', sessionInfo.userId)
                .orderBy('startTime', 'desc')
                .limit(limit)
                .get();
            
            const activities = [];
            snapshot.forEach(doc => {
                const session = doc.data();
                if (session.activities) {
                    session.activities.forEach(activity => {
                        activities.push({
                            ...activity,
                            sessionId: doc.id,
                            sessionData: {
                                startTime: session.startTime,
                                page: session.page
                            }
                        });
                    });
                }
            });
            
            // Sort by timestamp and limit
            activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            return activities.slice(0, limit);
        } catch (error) {
            console.error('[RealtimeDataService] Error getting activity data:', error);
            return [];
        }
    },
    
    /**
     * Get all users (for admin dashboards)
     */
    getAllUsers: async function() {
        try {
            const { db } = await this.init();
            
            const snapshot = await db.collection('users')
                .orderBy('displayName')
                .get();
            
            const users = [];
            snapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });
            
            return users;
        } catch (error) {
            console.error('[RealtimeDataService] Error getting users:', error);
            return [];
        }
    },
    
    /**
     * Get all leads (for admin dashboards)
     */
    getAllLeads: async function(limit = 50) {
        try {
            const { db } = await this.init();
            
            const snapshot = await db.collection('leads')
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();
            
            const leads = [];
            snapshot.forEach(doc => {
                leads.push({ id: doc.id, ...doc.data() });
            });
            
            return leads;
        } catch (error) {
            console.error('[RealtimeDataService] Error getting all leads:', error);
            return [];
        }
    },
    
    /**
     * Create/update document in any collection
     */
    saveDocument: async function(collection, data, documentId = null) {
        try {
            const { db } = await this.init();
            const sessionInfo = this.getSessionInfo();
            
            // Add session context to all documents
            const dataWithSession = {
                ...data,
                sessionId: sessionInfo.sessionId,
                userId: sessionInfo.userId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            let docRef;
            if (documentId) {
                docRef = db.collection(collection).doc(documentId);
                await docRef.update(dataWithSession);
            } else {
                docRef = await db.collection(collection).add({
                    ...dataWithSession,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            console.log('[RealtimeDataService] Document saved:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('[RealtimeDataService] Error saving document:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Delete document
     */
    deleteDocument: async function(collection, documentId) {
        try {
            const { db } = await this.init();
            await db.collection(collection).doc(documentId).delete();
            console.log('[RealtimeDataService] Document deleted:', documentId);
            return { success: true };
        } catch (error) {
            console.error('[RealtimeDataService] Error deleting document:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Clean up all listeners
     */
    cleanupListeners: function() {
        Object.keys(this.listeners).forEach(key => {
            if (this.listeners[key]) {
                this.listeners[key]();
                delete this.listeners[key];
            }
        });
        console.log('[RealtimeDataService] All listeners cleaned up');
    },
    
    /**
     * Get collection data with real-time updates
     */
    getCollectionData: function(collection, callback, filters = {}) {
        this.init().then(({ db }) => {
            let query = db.collection(collection);
            
            // Apply common filters
            if (filters.userId) {
                query = query.where('userId', '==', filters.userId);
            }
            if (filters.sessionId) {
                query = query.where('sessionId', '==', filters.sessionId);
            }
            if (filters.orderBy) {
                query = query.orderBy(filters.orderBy, filters.orderDirection || 'desc');
            }
            if (filters.limit) {
                query = query.limit(filters.limit);
            }
            
            const listener = query.onSnapshot(
                (snapshot) => {
                    const data = [];
                    snapshot.forEach(doc => {
                        data.push({ id: doc.id, ...doc.data() });
                    });
                    callback(data);
                },
                (error) => {
                    console.error(`[RealtimeDataService] ${collection} listener error:`, error);
                    callback([], error);
                }
            );
            
            this.listeners[collection] = listener;
        });
    }
};

// Make RealtimeDataService globally available
window.RealtimeDataService = RealtimeDataService;

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
    RealtimeDataService.cleanupListeners();
});

console.log('[RealtimeDataService] Real-time Data Service loaded');