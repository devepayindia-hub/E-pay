/**
 * CallingService - VoIP Call Management
 * 
 * Handles outbound and inbound call management with features:
 * - Make outbound calls
 * - End active calls
 * - Log call history
 * - Track call duration
 * - Support Twilio integration
 * 
 * Integrates with Twilio for call handling
 * Logs all calls to Firestore (call_logs collection)
 * 
 * Firestore Collection: call_logs/{docId}
 * Fields: uid, phoneNumber, callType, duration, startTime, endTime, status, recipientName, notes
 * 
 * Requires Twilio API credentials configured in environment or constructor
 */

class CallingService {
    constructor(twilioConfig = {}) {
        // Twilio configuration
        this.twilioConfig = {
            accountSid: twilioConfig.accountSid || null,
            authToken: twilioConfig.authToken || null,
            fromNumber: twilioConfig.fromNumber || null,
            ...twilioConfig
        };
        
        this.twilioBaseUrl = 'https://api.twilio.com/2010-04-01';
        
        // Firestore setup
        this.db = null;
        this.callLogsRef = null;
        this.collectionName = 'call_logs';
        
        // Active calls tracking
        this.activeCalls = new Map();
        this.callTimers = new Map();
        
        // Call configuration
        this.callTypes = {
            OUTBOUND: 'outbound',
            INBOUND: 'inbound',
            MISSED: 'missed'
        };
        
        this.callStatus = {
            INITIATED: 'initiated',
            RINGING: 'ringing',
            ACTIVE: 'active',
            COMPLETED: 'completed',
            FAILED: 'failed',
            CANCELLED: 'cancelled'
        };
        
        // State listeners
        this.stateListeners = [];
        
        // Initialization state
        this.isInitialized = false;
        
        console.info('[CallingService] Created');
    }
    
    /**
     * Initialize CallingService
     * - Wait for Firebase to be ready
     * - Get Firestore instance
     * - Validate Twilio credentials
     * 
     * @param {Object} [config] - Optional configuration object
     * @returns {Promise<void>}
     */
    async init(config = {}) {
        try {
            if (this.isInitialized) {
                console.warn('[CallingService] Already initialized');
                return;
            }
            
            // Update configuration if provided
            Object.assign(this.twilioConfig, config);
            
            // Wait for Firebase to be available
            if (typeof firebase === 'undefined') {
                await this._waitForFirebase();
            }
            
            // Get Firestore instance
            this.db = firebase.firestore();
            this.callLogsRef = this.db.collection(this.collectionName);
            
            // Validate Twilio credentials
            if (!this.twilioConfig.accountSid || !this.twilioConfig.authToken) {
                console.warn('[CallingService] Twilio credentials not configured. Calling will fail.');
            }
            
            this.isInitialized = true;
            console.info('[CallingService] Initialized successfully');
        } catch (error) {
            console.error('[CallingService] Initialization error:', error);
            throw error;
        }
    }
    
    /**
     * Make an outbound call
     * Initiates a call to the specified phone number
     * 
     * @param {Object} params - Call parameters
     * @param {string} params.phoneNumber - Target phone number (E.164 format)
     * @param {string} params.userId - User ID making the call
     * @param {string} [params.recipientName] - Name of recipient for logging
     * @param {string} [params.notes] - Call notes
     * @returns {Promise<{success: boolean, callId: string, error: string|null}>}
     */
    async makeCall(params) {
        try {
            if (!this.isInitialized) {
                throw new Error('CallingService not initialized. Call init() first.');
            }
            
            const { phoneNumber, userId, recipientName = null, notes = null } = params;
            
            if (!phoneNumber) {
                throw new Error('Phone number is required');
            }
            
            if (!userId) {
                throw new Error('User ID is required');
            }
            
            // Validate phone number format
            if (!this._isValidPhoneNumber(phoneNumber)) {
                throw new Error('Invalid phone number format. Use E.164 format (e.g., +1234567890)');
            }
            
            const callId = this._generateCallId();
            const now = Date.now();
            
            // Create call record
            const callRecord = {
                callId,
                uid: userId,
                phoneNumber,
                callType: this.callTypes.OUTBOUND,
                status: this.callStatus.INITIATED,
                recipientName: recipientName || null,
                notes: notes || null,
                startTime: now,
                initiatedAt: new Date(),
                updatedAt: new Date()
            };
            
            // Store in active calls
            this.activeCalls.set(callId, callRecord);
            
            // Initiate call via Twilio
            const result = await this._initiateTwilioCall({
                callId,
                phoneNumber,
                userId,
                recipientName
            });
            
            if (result.success) {
                callRecord.status = this.callStatus.RINGING;
                callRecord.twilioCallSid = result.twilioSid;
                
                // Save to Firestore
                await this._logCallToFirestore(callRecord);
                
                // Start call timer
                this._startCallTimer(callId);
                
                this._emitStateChanged({
                    event: 'call_initiated',
                    callId,
                    phoneNumber,
                    status: this.callStatus.RINGING
                });
                
                console.info('[CallingService] Call initiated', { callId, phoneNumber });
                
                return {
                    success: true,
                    callId,
                    error: null
                };
            } else {
                // Call failed
                callRecord.status = this.callStatus.FAILED;
                callRecord.error = result.error;
                
                await this._logCallToFirestore(callRecord);
                
                this.activeCalls.delete(callId);
                
                console.error('[CallingService] Call initiation failed:', result.error);
                
                return {
                    success: false,
                    callId: null,
                    error: result.error
                };
            }
        } catch (error) {
            console.error('[CallingService] Error making call:', error);
            return {
                success: false,
                callId: null,
                error: error.message
            };
        }
    }
    
    /**
     * End an active call
     * Terminates the specified call
     * 
     * @param {string} callId - Call ID to end
     * @returns {Promise<{success: boolean, duration: number, error: string|null}>}
     */
    async endCall(callId) {
        try {
            if (!callId) {
                throw new Error('Call ID is required');
            }
            
            const callRecord = this.activeCalls.get(callId);
            if (!callRecord) {
                throw new Error(`Call not found: ${callId}`);
            }
            
            // Stop call timer
            if (this.callTimers.has(callId)) {
                clearInterval(this.callTimers.get(callId));
                this.callTimers.delete(callId);
            }
            
            const now = Date.now();
            const duration = now - callRecord.startTime;
            
            // End Twilio call
            if (callRecord.twilioCallSid) {
                const result = await this._endTwilioCall(callRecord.twilioCallSid);
                if (!result.success) {
                    console.warn('[CallingService] Error ending Twilio call:', result.error);
                }
            }
            
            // Update call record
            callRecord.status = this.callStatus.COMPLETED;
            callRecord.endTime = now;
            callRecord.duration = duration;
            callRecord.updatedAt = new Date();
            
            // Save to Firestore
            await this._logCallToFirestore(callRecord);
            
            // Remove from active calls
            this.activeCalls.delete(callId);
            
            this._emitStateChanged({
                event: 'call_ended',
                callId,
                duration,
                formattedDuration: this._formatDuration(duration)
            });
            
            console.info('[CallingService] Call ended', { 
                callId, 
                duration: this._formatDuration(duration) 
            });
            
            return {
                success: true,
                duration,
                error: null
            };
        } catch (error) {
            console.error('[CallingService] Error ending call:', error);
            return {
                success: false,
                duration: 0,
                error: error.message
            };
        }
    }
    
    /**
     * Get active call information
     * 
     * @param {string} callId - Call ID
     * @returns {Object|null} Call information or null if not found
     */
    getActiveCall(callId) {
        return this.activeCalls.get(callId) || null;
    }
    
    /**
     * Get all active calls for a user
     * 
     * @param {string} userId - User ID
     * @returns {Array} Array of active calls for user
     */
    getActiveCallsByUser(userId) {
        const userCalls = [];
        
        this.activeCalls.forEach(call => {
            if (call.uid === userId) {
                userCalls.push(call);
            }
        });
        
        return userCalls;
    }
    
    /**
     * Get call history for a user
     * 
     * @param {string} userId - User ID
     * @param {number} [limit] - Limit number of results (default: 50)
     * @returns {Promise<Array>} Array of call records
     */
    async getCallHistory(userId, limit = 50) {
        try {
            if (!this.isInitialized) {
                throw new Error('CallingService not initialized');
            }
            
            const snapshot = await this.callLogsRef
                .where('uid', '==', userId)
                .orderBy('startTime', 'desc')
                .limit(limit)
                .get();
            
            const calls = [];
            snapshot.forEach(doc => {
                const callData = doc.data();
                calls.push({
                    id: doc.id,
                    ...callData,
                    formattedDuration: callData.duration ? 
                        this._formatDuration(callData.duration) : null
                });
            });
            
            return calls;
        } catch (error) {
            console.error('[CallingService] Error getting call history:', error);
            return [];
        }
    }
    
    /**
     * Get call history for a specific date
     * 
     * @param {string} userId - User ID
     * @param {Date|string} date - Date to get calls for
     * @returns {Promise<Array>} Array of call records for the date
     */
    async getCallHistoryForDate(userId, date) {
        try {
            if (!this.isInitialized) {
                throw new Error('CallingService not initialized');
            }
            
            const targetDate = typeof date === 'string' ? new Date(date) : date;
            const startOfDay = new Date(targetDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(targetDate);
            endOfDay.setHours(23, 59, 59, 999);
            
            const snapshot = await this.callLogsRef
                .where('uid', '==', userId)
                .where('startTime', '>=', startOfDay.getTime())
                .where('startTime', '<=', endOfDay.getTime())
                .orderBy('startTime', 'desc')
                .get();
            
            const calls = [];
            snapshot.forEach(doc => {
                const callData = doc.data();
                calls.push({
                    id: doc.id,
                    ...callData,
                    formattedDuration: callData.duration ? 
                        this._formatDuration(callData.duration) : null
                });
            });
            
            return calls;
        } catch (error) {
            console.error('[CallingService] Error getting call history for date:', error);
            return [];
        }
    }
    
    /**
     * Get call statistics
     * 
     * @param {string} userId - User ID
     * @param {string} [startDate] - Start date (YYYY-MM-DD)
     * @param {string} [endDate] - End date (YYYY-MM-DD)
     * @returns {Promise<Object>} Call statistics
     */
    async getCallStats(userId, startDate = null, endDate = null) {
        try {
            let calls = await this.getCallHistory(userId, 1000);
            
            // Filter by date range if provided
            if (startDate || endDate) {
                const start = startDate ? new Date(startDate).getTime() : 0;
                const end = endDate ? new Date(endDate).getTime() + 86400000 : Infinity;
                
                calls = calls.filter(call => 
                    call.startTime >= start && call.startTime <= end
                );
            }
            
            // Calculate statistics
            let totalDuration = 0;
            let outboundCount = 0;
            let inboundCount = 0;
            let missedCount = 0;
            let completedCount = 0;
            let failedCount = 0;
            
            calls.forEach(call => {
                if (call.callType === this.callTypes.OUTBOUND) outboundCount++;
                if (call.callType === this.callTypes.INBOUND) inboundCount++;
                if (call.callType === this.callTypes.MISSED) missedCount++;
                if (call.status === this.callStatus.COMPLETED) completedCount++;
                if (call.status === this.callStatus.FAILED) failedCount++;
                if (call.duration) totalDuration += call.duration;
            });
            
            return {
                totalCalls: calls.length,
                outboundCount,
                inboundCount,
                missedCount,
                completedCount,
                failedCount,
                totalDuration,
                formattedTotalDuration: this._formatDuration(totalDuration),
                averageDuration: calls.length > 0 ? totalDuration / calls.length : 0,
                formattedAverageDuration: calls.length > 0 ? 
                    this._formatDuration(totalDuration / calls.length) : 'N/A'
            };
        } catch (error) {
            console.error('[CallingService] Error getting call stats:', error);
            return null;
        }
    }
    
    /**
     * Subscribe to call state changes
     * Listener called for call events (initiated, ended, etc.)
     * 
     * @param {Function} callback - Called with call state updates
     * @returns {Function} Unsubscriber function
     */
    onStateChanged(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        
        this.stateListeners.push(callback);
        
        // Return unsubscriber
        return () => {
            this.stateListeners = this.stateListeners.filter(l => l !== callback);
        };
    }
    
    // ===== Private Methods =====
    
    /**
     * Wait for Firebase to be available
     * 
     * @private
     * @returns {Promise<void>}
     */
    async _waitForFirebase() {
        const timeout = 5000;
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
     * Initiate call via Twilio API
     * 
     * @private
     * @param {Object} params - Call parameters
     * @returns {Promise<{success: boolean, twilioSid: string|null, error: string|null}>}
     */
    async _initiateTwilioCall(params) {
        try {
            if (!this.twilioConfig.accountSid || !this.twilioConfig.authToken) {
                console.warn('[CallingService] Twilio not configured. Simulating call.');
                return {
                    success: true,
                    twilioSid: `SIMULATED_${params.callId}`,
                    error: null
                };
            }
            
            const auth = btoa(`${this.twilioConfig.accountSid}:${this.twilioConfig.authToken}`);
            
            const formData = new FormData();
            formData.append('From', this.twilioConfig.fromNumber);
            formData.append('To', params.phoneNumber);
            formData.append('Url', `${window.location.origin}/twilio/callback`);
            
            const response = await fetch(
                `${this.twilioBaseUrl}/Accounts/${this.twilioConfig.accountSid}/Calls.json`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${auth}`
                    },
                    body: formData
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    twilioSid: data.sid,
                    error: null
                };
            } else {
                const error = await response.text();
                return {
                    success: false,
                    twilioSid: null,
                    error: `Twilio error: ${response.status}`
                };
            }
        } catch (error) {
            console.error('[CallingService] Error initiating Twilio call:', error);
            return {
                success: false,
                twilioSid: null,
                error: error.message
            };
        }
    }
    
    /**
     * End call via Twilio API
     * 
     * @private
     * @param {string} callSid - Twilio call SID
     * @returns {Promise<{success: boolean, error: string|null}>}
     */
    async _endTwilioCall(callSid) {
        try {
            if (!this.twilioConfig.accountSid || !this.twilioConfig.authToken) {
                return { success: true, error: null };
            }
            
            const auth = btoa(`${this.twilioConfig.accountSid}:${this.twilioConfig.authToken}`);
            
            const response = await fetch(
                `${this.twilioBaseUrl}/Accounts/${this.twilioConfig.accountSid}/Calls/${callSid}.json`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'Status=completed'
                }
            );
            
            if (response.ok) {
                return { success: true, error: null };
            } else {
                return {
                    success: false,
                    error: `Twilio error: ${response.status}`
                };
            }
        } catch (error) {
            console.error('[CallingService] Error ending Twilio call:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Log call to Firestore
     * 
     * @private
     * @param {Object} callRecord - Call record to log
     * @returns {Promise<void>}
     */
    async _logCallToFirestore(callRecord) {
        try {
            if (!this.db) {
                return;
            }
            
            await this.callLogsRef.add({
                ...callRecord,
                createdAt: new Date()
            });
            
            console.debug('[CallingService] Call logged to Firestore');
        } catch (error) {
            console.error('[CallingService] Error logging call:', error);
        }
    }
    
    /**
     * Start call timer for tracking duration
     * 
     * @private
     * @param {string} callId - Call ID
     */
    _startCallTimer(callId) {
        if (this.callTimers.has(callId)) {
            return;
        }
        
        const timer = setInterval(() => {
            const call = this.activeCalls.get(callId);
            if (call && call.status === this.callStatus.ACTIVE) {
                const duration = Date.now() - call.startTime;
                
                this._emitStateChanged({
                    event: 'call_duration_update',
                    callId,
                    duration,
                    formattedDuration: this._formatDuration(duration)
                });
            }
        }, 1000);
        
        this.callTimers.set(callId, timer);
    }
    
    /**
     * Generate unique call ID
     * 
     * @private
     * @returns {string}
     */
    _generateCallId() {
        return `CALL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Validate phone number format (E.164)
     * 
     * @private
     * @param {string} phoneNumber - Phone number to validate
     * @returns {boolean}
     */
    _isValidPhoneNumber(phoneNumber) {
        const e164Regex = /^\+[1-9]\d{1,14}$/;
        return e164Regex.test(phoneNumber);
    }
    
    /**
     * Format duration in milliseconds to readable string
     * 
     * @private
     * @param {number} ms - Duration in milliseconds
     * @returns {string} Formatted duration (HH:MM:SS)
     */
    _formatDuration(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        
        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else if (minutes > 0) {
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            return `00:${String(seconds).padStart(2, '0')}`;
        }
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
                console.error('[CallingService] Error in state listener:', error);
            }
        });
    }
}

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CallingService;
}

// Expose globally
if (typeof window !== 'undefined') {
    window.CallingService = CallingService;
}
