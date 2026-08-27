/**
 * SessionTimerService - User Session Time Tracking
 * 
 * Manages active session tracking for users with the following features:
 * - Auto-start on user login
 * - Auto-pause during 1-2 PM break time
 * - Auto-stop at 6 PM (end of shift)
 * - Count only active time (15 min inactivity threshold triggers pause)
 * - Display timer in HH:MM:SS format
 * - Persist session data to Firestore (session_timers collection)
 * - Track by date for daily reporting
 * 
 * Firestore Collection: session_timers/{uid}
 * Fields: uid, email, displayName, startTime, totalActiveTime, status, lastActivityTime, dayDate
 * 
 * Status values: 'active', 'paused', 'stopped', 'break'
 */

class SessionTimerService {
    constructor() {
        // Timer configuration
        this.INACTIVITY_THRESHOLD = 15 * 60 * 1000; // 15 minutes
        this.BREAK_START_HOUR = 13; // 1 PM (24-hour format)
        this.BREAK_END_HOUR = 14; // 2 PM
        this.SHIFT_END_HOUR = 18; // 6 PM
        
        // Firestore setup
        this.db = null;
        this.sessionTimersRef = null;
        this.collectionName = 'session_timers';
        
        // Active session state
        this.currentSession = null;
        this.timerInterval = null;
        this.inactivityTimeout = null;
        this.breakCheckInterval = null;
        this.shiftEndCheckInterval = null;
        
        // User data
        this.currentUser = null;
        
        // Activity tracking
        this.lastActivityTime = Date.now();
        this.activityListeners = ['mousedown', 'keydown', 'scroll', 'touch', 'click'];
        
        // State listeners
        this.stateListeners = [];
        
        // Initialization state
        this.isInitialized = false;
        this.isRunning = false;
        
        console.info('[SessionTimerService] Created');
    }
    
    /**
     * Initialize SessionTimerService
     * - Wait for Firebase to be ready
     * - Get Firestore instance
     * - Set up activity listeners
     * 
     * @param {Object} user - Current user object with uid, email, displayName
     * @returns {Promise<void>}
     */
    async init(user) {
        try {
            if (this.isInitialized) {
                console.warn('[SessionTimerService] Already initialized');
                return;
            }
            
            if (!user || !user.uid) {
                throw new Error('User object with uid is required');
            }
            
            // Wait for Firebase to be available
            if (typeof firebase === 'undefined') {
                await this._waitForFirebase();
            }
            
            // Get Firestore instance
            this.db = firebase.firestore();
            this.sessionTimersRef = this.db.collection(this.collectionName);
            
            // Store user information
            this.currentUser = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || 'Unknown User'
            };
            
            // Set up activity listeners
            this._setupActivityListeners();
            
            // Set up periodic checks for break and shift end times
            this._setupPeriodicChecks();
            
            this.isInitialized = true;
            console.info('[SessionTimerService] Initialized successfully');
        } catch (error) {
            console.error('[SessionTimerService] Initialization error:', error);
            throw error;
        }
    }
    
    /**
     * Start a new session timer
     * Creates new session document in Firestore and starts counting active time
     * 
     * @returns {Promise<void>}
     */
    async startSession() {
        try {
            if (!this.isInitialized) {
                throw new Error('SessionTimerService not initialized. Call init() first.');
            }
            
            if (this.isRunning) {
                console.warn('[SessionTimerService] Session already running');
                return;
            }
            
            const now = Date.now();
            const today = this._getTodayDateString();
            
            // Create new session
            this.currentSession = {
                uid: this.currentUser.uid,
                email: this.currentUser.email,
                displayName: this.currentUser.displayName,
                startTime: now,
                totalActiveTime: 0, // in milliseconds
                status: 'active',
                lastActivityTime: now,
                dayDate: today,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Save to Firestore
            await this._saveSessionToFirestore();
            
            // Start timer updates
            this._startTimerInterval();
            
            // Reset inactivity timeout
            this._resetInactivityTimeout();
            
            this.isRunning = true;
            this.lastActivityTime = now;
            
            this._emitStateChanged({
                status: 'active',
                totalTime: 0,
                isRunning: true
            });
            
            console.info('[SessionTimerService] Session started', {
                uid: this.currentUser.uid,
                startTime: new Date(now).toISOString()
            });
        } catch (error) {
            console.error('[SessionTimerService] Error starting session:', error);
            throw error;
        }
    }
    
    /**
     * Stop the current session timer
     * Updates Firestore with final session data and status
     * 
     * @returns {Promise<void>}
     */
    async stopSession() {
        try {
            if (!this.isRunning || !this.currentSession) {
                console.warn('[SessionTimerService] No active session to stop');
                return;
            }
            
            // Clear all intervals and timeouts
            this._clearAllTimers();
            
            // Update session status
            this.currentSession.status = 'stopped';
            this.currentSession.endTime = Date.now();
            this.currentSession.updatedAt = new Date();
            
            // Save final state to Firestore
            await this._saveSessionToFirestore();
            
            this.isRunning = false;
            
            this._emitStateChanged({
                status: 'stopped',
                totalTime: this.currentSession.totalActiveTime,
                isRunning: false
            });
            
            console.info('[SessionTimerService] Session stopped', {
                uid: this.currentUser.uid,
                totalActiveTime: this._formatTime(this.currentSession.totalActiveTime)
            });
            
            // Clear current session
            this.currentSession = null;
        } catch (error) {
            console.error('[SessionTimerService] Error stopping session:', error);
            throw error;
        }
    }
    
    /**
     * Pause session timer (manual pause)
     * Pauses active time accumulation
     * 
     * @returns {Promise<void>}
     */
    async pauseSession() {
        try {
            if (!this.isRunning || !this.currentSession) {
                console.warn('[SessionTimerService] No active session to pause');
                return;
            }
            
            this.currentSession.status = 'paused';
            this.currentSession.pausedAt = Date.now();
            this.currentSession.updatedAt = new Date();
            
            // Stop updating active time
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            
            // Clear inactivity timeout
            if (this.inactivityTimeout) {
                clearTimeout(this.inactivityTimeout);
                this.inactivityTimeout = null;
            }
            
            // Save to Firestore
            await this._saveSessionToFirestore();
            
            this._emitStateChanged({
                status: 'paused',
                totalTime: this.currentSession.totalActiveTime,
                isRunning: false
            });
            
            console.info('[SessionTimerService] Session paused');
        } catch (error) {
            console.error('[SessionTimerService] Error pausing session:', error);
            throw error;
        }
    }
    
    /**
     * Resume paused session
     * Resumes active time accumulation
     * 
     * @returns {Promise<void>}
     */
    async resumeSession() {
        try {
            if (!this.currentSession || this.currentSession.status !== 'paused') {
                console.warn('[SessionTimerService] No paused session to resume');
                return;
            }
            
            this.currentSession.status = 'active';
            this.currentSession.updatedAt = new Date();
            
            // If there's a pausedAt time, add the pause duration to totalPauseTime
            if (this.currentSession.pausedAt) {
                const pauseDuration = Date.now() - this.currentSession.pausedAt;
                if (!this.currentSession.totalPauseTime) {
                    this.currentSession.totalPauseTime = 0;
                }
                this.currentSession.totalPauseTime += pauseDuration;
                delete this.currentSession.pausedAt;
            }
            
            // Start timer updates again
            this._startTimerInterval();
            
            // Reset inactivity timeout
            this._resetInactivityTimeout();
            
            // Update last activity time
            this.lastActivityTime = Date.now();
            
            // Save to Firestore
            await this._saveSessionToFirestore();
            
            this._emitStateChanged({
                status: 'active',
                totalTime: this.currentSession.totalActiveTime,
                isRunning: true
            });
            
            console.info('[SessionTimerService] Session resumed');
        } catch (error) {
            console.error('[SessionTimerService] Error resuming session:', error);
            throw error;
        }
    }
    
    /**
     * Get current session state
     * 
     * @returns {Object} Current session information
     */
    getCurrentSession() {
        if (!this.currentSession) {
            return null;
        }
        
        return {
            ...this.currentSession,
            formattedTime: this._formatTime(this.currentSession.totalActiveTime)
        };
    }
    
    /**
     * Get current timer display in HH:MM:SS format
     * 
     * @returns {string} Formatted time string (e.g., "02:30:45")
     */
    getFormattedTime() {
        if (!this.currentSession) {
            return '00:00:00';
        }
        
        return this._formatTime(this.currentSession.totalActiveTime);
    }
    
    /**
     * Subscribe to session state changes
     * Listener called whenever session status or time updates
     * 
     * @param {Function} callback - Called with session state updates
     * @returns {Function} Unsubscriber function
     */
    onStateChanged(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        
        this.stateListeners.push(callback);
        
        // Call immediately with current state
        if (this.currentSession) {
            setTimeout(() => {
                try {
                    callback({
                        status: this.currentSession.status,
                        totalTime: this.currentSession.totalActiveTime,
                        formattedTime: this._formatTime(this.currentSession.totalActiveTime),
                        isRunning: this.isRunning
                    });
                } catch (error) {
                    console.error('[SessionTimerService] Error in state listener:', error);
                }
            }, 0);
        }
        
        // Return unsubscriber
        return () => {
            this.stateListeners = this.stateListeners.filter(l => l !== callback);
        };
    }
    
    /**
     * Get session history for a specific date
     * 
     * @param {string} [dateString] - Date string (YYYY-MM-DD), defaults to today
     * @returns {Promise<Array>} Array of session records for the date
     */
    async getSessionHistory(dateString) {
        try {
            if (!this.isInitialized) {
                throw new Error('SessionTimerService not initialized');
            }
            
            const date = dateString || this._getTodayDateString();
            
            // Query Firestore for sessions on this date
            // Note: This assumes we're querying by uid and dayDate
            const snapshot = await this.sessionTimersRef
                .where('uid', '==', this.currentUser.uid)
                .where('dayDate', '==', date)
                .get();
            
            const sessions = [];
            snapshot.forEach(doc => {
                sessions.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return sessions;
        } catch (error) {
            console.error('[SessionTimerService] Error getting session history:', error);
            return [];
        }
    }
    
    /**
     * Get total active time for a specific date
     * 
     * @param {string} [dateString] - Date string (YYYY-MM-DD), defaults to today
     * @returns {Promise<number>} Total active time in milliseconds
     */
    async getTotalTimeForDate(dateString) {
        try {
            const sessions = await this.getSessionHistory(dateString);
            
            let totalTime = 0;
            sessions.forEach(session => {
                if (session.totalActiveTime) {
                    totalTime += session.totalActiveTime;
                }
            });
            
            return totalTime;
        } catch (error) {
            console.error('[SessionTimerService] Error calculating total time:', error);
            return 0;
        }
    }
    
    /**
     * Clean up resources on service destruction
     * 
     * @returns {void}
     */
    destroy() {
        try {
            // Stop session if running
            if (this.isRunning) {
                this.stopSession().catch(err => 
                    console.error('[SessionTimerService] Error stopping session on destroy:', err)
                );
            }
            
            // Clear all timers
            this._clearAllTimers();
            
            // Remove activity listeners
            this._removeActivityListeners();
            
            // Clear state listeners
            this.stateListeners = [];
            
            // Clear current session
            this.currentSession = null;
            this.currentUser = null;
            
            this.isInitialized = false;
            this.isRunning = false;
            
            console.info('[SessionTimerService] Destroyed');
        } catch (error) {
            console.error('[SessionTimerService] Error during destroy:', error);
        }
    }
    
    // ===== Private Methods =====
    
    /**
     * Wait for Firebase to be available
     * 
     * @private
     * @returns {Promise<void>}
     */
    async _waitForFirebase() {
        const timeout = 5000; // 5 seconds
        const startTime = Date.now();
        
        return new Promise((resolve, reject) => {
            const checkFirebase = () => {
                if (typeof firebase !== 'undefined') {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Firebase initialization timeout'));
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            
            checkFirebase();
        });
    }
    
    /**
     * Set up activity event listeners
     * 
     * @private
     */
    _setupActivityListeners() {
        this.activityListeners.forEach(eventName => {
            document.addEventListener(eventName, () => {
                this._recordActivity();
            }, { passive: true });
        });
        
        console.debug('[SessionTimerService] Activity listeners configured');
    }
    
    /**
     * Remove activity event listeners
     * 
     * @private
     */
    _removeActivityListeners() {
        this.activityListeners.forEach(eventName => {
            document.removeEventListener(eventName, () => {
                this._recordActivity();
            });
        });
    }
    
    /**
     * Record user activity and reset inactivity timeout
     * 
     * @private
     */
    _recordActivity() {
        if (!this.isRunning || !this.currentSession) {
            return;
        }
        
        this.lastActivityTime = Date.now();
        this.currentSession.lastActivityTime = this.lastActivityTime;
        
        // Reset inactivity timeout
        this._resetInactivityTimeout();
    }
    
    /**
     * Reset inactivity timeout
     * If user is inactive for INACTIVITY_THRESHOLD, pause the session
     * 
     * @private
     */
    _resetInactivityTimeout() {
        // Clear existing timeout
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
        
        // Set new timeout
        this.inactivityTimeout = setTimeout(async () => {
            if (this.isRunning && this.currentSession && this.currentSession.status === 'active') {
                console.info('[SessionTimerService] Inactivity detected, pausing session');
                await this.pauseSession();
            }
        }, this.INACTIVITY_THRESHOLD);
    }
    
    /**
     * Start the timer interval for updating active time
     * 
     * @private
     */
    _startTimerInterval() {
        if (this.timerInterval) {
            return; // Already running
        }
        
        const startTime = Date.now();
        const initialTotalTime = this.currentSession.totalActiveTime || 0;
        
        this.timerInterval = setInterval(() => {
            if (this.currentSession && this.currentSession.status === 'active') {
                // Calculate elapsed time since timer started
                const elapsed = Date.now() - startTime;
                this.currentSession.totalActiveTime = initialTotalTime + elapsed;
                
                // Emit state change for UI updates
                this._emitStateChanged({
                    status: 'active',
                    totalTime: this.currentSession.totalActiveTime,
                    formattedTime: this._formatTime(this.currentSession.totalActiveTime),
                    isRunning: true
                });
                
                // Save to Firestore every 30 seconds
                if (Math.floor(this.currentSession.totalActiveTime / 30000) % 1 === 0) {
                    this._saveSessionToFirestore().catch(err =>
                        console.error('[SessionTimerService] Error saving session:', err)
                    );
                }
            }
        }, 1000); // Update every second
    }
    
    /**
     * Set up periodic checks for break time and shift end
     * 
     * @private
     */
    _setupPeriodicChecks() {
        // Check every minute if we should auto-pause/stop
        this.breakCheckInterval = setInterval(() => {
            if (this.isRunning && this.currentSession) {
                this._checkBreakTime();
                this._checkShiftEnd();
            }
        }, 60 * 1000); // Every minute
    }
    
    /**
     * Check if current time is within break hours (1-2 PM)
     * Auto-pause session during break
     * 
     * @private
     */
    async _checkBreakTime() {
        const now = new Date();
        const hour = now.getHours();
        const isBreakTime = hour >= this.BREAK_START_HOUR && hour < this.BREAK_END_HOUR;
        
        if (isBreakTime && this.currentSession.status === 'active') {
            console.info('[SessionTimerService] Break time detected, pausing session');
            this.currentSession.status = 'break';
            await this.pauseSession();
        } else if (!isBreakTime && this.currentSession.status === 'break') {
            console.info('[SessionTimerService] Break time ended, resuming session');
            await this.resumeSession();
        }
    }
    
    /**
     * Check if current time has reached shift end (6 PM)
     * Auto-stop session at end of shift
     * 
     * @private
     */
    async _checkShiftEnd() {
        const now = new Date();
        const hour = now.getHours();
        
        if (hour >= this.SHIFT_END_HOUR && this.isRunning) {
            console.info('[SessionTimerService] Shift end time reached, stopping session');
            await this.stopSession();
        }
    }
    
    /**
     * Save current session to Firestore
     * 
     * @private
     * @returns {Promise<void>}
     */
    async _saveSessionToFirestore() {
        try {
            if (!this.currentSession || !this.db) {
                return;
            }
            
            const docId = `${this.currentUser.uid}_${this.currentSession.dayDate}_${this.currentSession.startTime}`;
            
            await this.sessionTimersRef.doc(docId).set(
                this.currentSession,
                { merge: true }
            );
            
            console.debug('[SessionTimerService] Session saved to Firestore');
        } catch (error) {
            console.error('[SessionTimerService] Error saving session to Firestore:', error);
        }
    }
    
    /**
     * Clear all active timers and intervals
     * 
     * @private
     */
    _clearAllTimers() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
            this.inactivityTimeout = null;
        }
        
        if (this.breakCheckInterval) {
            clearInterval(this.breakCheckInterval);
            this.breakCheckInterval = null;
        }
        
        if (this.shiftEndCheckInterval) {
            clearInterval(this.shiftEndCheckInterval);
            this.shiftEndCheckInterval = null;
        }
    }
    
    /**
     * Format milliseconds to HH:MM:SS string
     * 
     * @private
     * @param {number} ms - Milliseconds to format
     * @returns {string} Formatted time (HH:MM:SS)
     */
    _formatTime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    /**
     * Get today's date as string in YYYY-MM-DD format
     * 
     * @private
     * @returns {string}
     */
    _getTodayDateString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }
    
    /**
     * Emit state changed event to all listeners
     * 
     * @private
     * @param {Object} state - State update object
     */
    _emitStateChanged(state) {
        this.stateListeners.forEach(listener => {
            try {
                listener(state);
            } catch (error) {
                console.error('[SessionTimerService] Error in state listener:', error);
            }
        });
    }
}

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionTimerService;
}

// Expose globally
if (typeof window !== 'undefined') {
    window.SessionTimerService = SessionTimerService;
}
