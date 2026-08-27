/**
 * ErrorHandlerService - Firebase Error Classification and Retry Logic
 * 
 * Provides comprehensive error handling for Firebase operations:
 * - Classify Firebase errors as retriable vs permanent
 * - Exponential backoff retry logic with configurable delays
 * - User-friendly error message mapping
 * - Error context logging and monitoring integration
 * - Network error detection and distinction
 * 
 * Requirements: 9.1, 9.2, 9.3
 * Task: 7.1 Implement ErrorHandlerService with Firebase error classification
 */

class ErrorHandlerService {
    constructor() {
        // Configuration
        this.retryableErrorCodes = new Set([
            // Network errors
            'network-error',
            'timeout',
            'auth/network-request-failed',
            
            // Transient Firebase errors
            'auth/too-many-requests',
            'error/too-many-requests',
            'resource-exhausted',
            'service-unavailable',
            'unavailable',
            'internal',
            'aborted',
            'deadline-exceeded',
            
            // Temporary state errors
            'auth/temporarily-disabled'
        ]);
        
        // Permanent Firebase errors that should not be retried
        this.permanentErrorCodes = new Set([
            // Authentication errors
            'auth/user-not-found',
            'auth/wrong-password',
            'auth/invalid-email',
            'auth/user-disabled',
            'auth/operation-not-allowed',
            'auth/email-already-in-use',
            'auth/weak-password',
            'auth/invalid-api-key',
            'auth/invalid-credential',
            'auth/invalid-verification-code',
            'auth/expired-action-code',
            'auth/missing-email',
            'auth/account-exists-with-different-credential',
            'auth/app-not-authorized',
            'auth/requires-recent-login',
            
            // Authorization/Permission errors
            'permission-denied',
            'auth/insufficient-permission',
            'auth/permission-denied',
            
            // Invalid arguments
            'invalid-argument',
            'auth/invalid-argument',
            
            // Authentication required
            'unauthenticated',
            'auth/unauthenticated',
            
            // Not found errors
            'not-found',
            'auth/user-not-found',
            
            // Data validation errors
            'failed-precondition',
            'auth/failed-precondition',
            
            // Configuration errors
            'auth/operation-not-allowed'
        ]);
        
        // Error message mapping for user-friendly display
        this.errorMessages = {
            // Authentication errors
            'auth/user-not-found': 'No user found with this email address',
            'auth/wrong-password': 'Incorrect password',
            'auth/invalid-email': 'Invalid email address format',
            'auth/user-disabled': 'This user account has been disabled',
            'auth/operation-not-allowed': 'Email/password authentication is not enabled',
            'auth/email-already-in-use': 'Email address is already in use',
            'auth/weak-password': 'Password is too weak. Use at least 6 characters',
            'auth/missing-email': 'Email address is required',
            'auth/account-exists-with-different-credential': 'Email already associated with another account',
            'auth/invalid-credential': 'Invalid authentication credentials',
            'auth/invalid-verification-code': 'Invalid verification code',
            'auth/expired-action-code': 'Password reset link has expired',
            'auth/requires-recent-login': 'Please log in again to perform this action',
            
            // Rate limiting errors
            'auth/too-many-requests': 'Too many failed login attempts. Please try again later',
            'error/too-many-requests': 'Too many requests. Please try again later',
            
            // Network errors
            'auth/network-request-failed': 'Network connection error. Please check your internet connection',
            'network-error': 'Network connection error. Please check your internet connection',
            'timeout': 'Request timed out. Please check your internet connection and try again',
            'auth/timeout': 'Request timed out. Please try again',
            
            // Service errors
            'service-unavailable': 'Service is temporarily unavailable. Please try again later',
            'unavailable': 'Service is temporarily unavailable. Please try again later',
            'internal': 'Internal server error. Please try again later',
            
            // Permission errors
            'permission-denied': 'You do not have permission to perform this action',
            'auth/permission-denied': 'You do not have permission to perform this action',
            'auth/insufficient-permission': 'Insufficient permissions. Please contact an administrator',
            
            // Not found errors
            'not-found': 'The requested resource was not found',
            
            // Generic errors
            'unknown-error': 'An unexpected error occurred. Please try again',
            'error': 'An error occurred. Please try again'
        };
        
        // Retry configuration
        this.defaultMaxRetries = 3;
        this.defaultInitialDelayMs = 100;
        this.defaultMaxDelayMs = 10000; // 10 seconds
        this.exponentialBackoffFactor = 2;
        
        // Error notifications callback
        this.errorNotificationCallback = null;
        
        // Error logging callback
        this.errorLoggingCallback = null;
    }
    
    /**
     * Register callback for error notifications
     * Called when user-facing errors need to be displayed
     * 
     * @param {Function} callback - Receives (message, duration, errorLevel)
     */
    onErrorNotification(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        this.errorNotificationCallback = callback;
    }
    
    /**
     * Register callback for error logging to monitoring service
     * Called to log errors for analysis and debugging
     * 
     * @param {Function} callback - Receives (error, context)
     */
    onErrorLogging(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        this.errorLoggingCallback = callback;
    }
    
    /**
     * Handle error with classification, logging, and user notification
     * 
     * @param {Error|Object} error - Error object to handle
     * @param {Object} context - Error context with operation name, userId, etc
     * @returns {Object} Classified error with handled/retriable/permanent status
     */
    handleError(error, context = {}) {
        try {
            // Normalize error object
            const normalizedError = this.normalizeError(error);
            
            // Classify error
            const classification = {
                code: normalizedError.code,
                message: normalizedError.message,
                isRetriable: this.isRetriableError(normalizedError),
                isPermanent: this.isPermanentError(normalizedError),
                isNetworkError: this.isNetworkError(normalizedError),
                userMessage: this.getUserFriendlyMessage(normalizedError),
                context: context,
                timestamp: new Date().toISOString()
            };
            
            // Log error to monitoring service
            this.logToMonitoring(normalizedError, context, classification);
            
            // Display user-friendly notification if applicable
            this.displayErrorNotification(classification);
            
            console.error('[ErrorHandlerService] Error handled:', classification);
            
            return classification;
        } catch (handlingError) {
            console.error('[ErrorHandlerService] Error handling failed:', handlingError);
            
            // Fallback error handling
            return {
                code: 'handler-error',
                message: 'Error handler encountered an error',
                isRetriable: false,
                isPermanent: true,
                userMessage: 'An unexpected error occurred',
                context: context,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    /**
     * Check if error is retriable (transient, likely to succeed on retry)
     * 
     * @param {Error|Object} error - Error to classify
     * @returns {boolean} True if error should be retried
     */
    isRetriableError(error) {
        const normalized = this.normalizeError(error);
        
        // Check against retriable codes
        if (this.retryableErrorCodes.has(normalized.code)) {
            return true;
        }
        
        // Check error message patterns for transient indicators
        const message = normalized.message.toLowerCase();
        if (message.includes('timeout') || 
            message.includes('temporarily') ||
            message.includes('unavailable') ||
            message.includes('network')) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Check if error is permanent (will not succeed on retry)
     * 
     * @param {Error|Object} error - Error to classify
     * @returns {boolean} True if error is permanent
     */
    isPermanentError(error) {
        const normalized = this.normalizeError(error);
        return this.permanentErrorCodes.has(normalized.code);
    }
    
    /**
     * Check if error is network-related
     * 
     * @param {Error|Object} error - Error to classify
     * @returns {boolean} True if error is network-related
     */
    isNetworkError(error) {
        const normalized = this.normalizeError(error);
        
        const networkErrorPatterns = [
            'network',
            'timeout',
            'unavailable',
            'connection',
            'offline'
        ];
        
        const code = normalized.code.toLowerCase();
        const message = normalized.message.toLowerCase();
        
        return networkErrorPatterns.some(pattern => 
            code.includes(pattern) || message.includes(pattern)
        );
    }
    
    /**
     * Get user-friendly error message
     * Maps error code to human-readable text
     * 
     * @param {Error|Object} error - Error to get message for
     * @returns {string} User-friendly error message
     */
    getErrorMessage(error) {
        const normalized = this.normalizeError(error);
        return this.getUserFriendlyMessage(normalized);
    }
    
    /**
     * Execute operation with exponential backoff retry logic
     * 
     * Retry strategy:
     * - 1st attempt: immediate
     * - 2nd attempt: 100ms delay
     * - 3rd attempt: 200ms delay
     * - 4th attempt: 400ms delay (capped at maxDelayMs)
     * - Etc.
     * 
     * @param {Function} operation - Async function to execute
     * @param {Object} options - Retry options
     *   - maxRetries: Max retry attempts (default: 3)
     *   - initialDelayMs: Initial retry delay in ms (default: 100)
     *   - maxDelayMs: Maximum retry delay in ms (default: 10000)
     *   - onRetry: Callback on retry (error, attemptNumber, nextDelayMs)
     * @returns {Promise<*>} Result of successful operation
     * @throws {Error} Error if all retries exhausted
     */
    async executeWithRetry(operation, options = {}) {
        const maxRetries = options.maxRetries !== undefined ? options.maxRetries : this.defaultMaxRetries;
        const initialDelayMs = options.initialDelayMs !== undefined ? options.initialDelayMs : this.defaultInitialDelayMs;
        const maxDelayMs = options.maxDelayMs !== undefined ? options.maxDelayMs : this.defaultMaxDelayMs;
        const onRetry = options.onRetry;
        
        if (typeof operation !== 'function') {
            throw new Error('Operation must be a function');
        }
        
        let lastError = null;
        let attemptNumber = 0;
        
        while (attemptNumber <= maxRetries) {
            try {
                attemptNumber++;
                
                console.debug(`[ErrorHandlerService] Executing operation (attempt ${attemptNumber}/${maxRetries + 1})`);
                
                const result = await operation();
                
                if (attemptNumber > 1) {
                    console.info(`[ErrorHandlerService] Operation succeeded on attempt ${attemptNumber}`);
                }
                
                return result;
            } catch (error) {
                lastError = error;
                
                const normalized = this.normalizeError(error);
                const isRetriable = this.isRetriableError(normalized);
                const isLastAttempt = attemptNumber > maxRetries;
                
                if (!isRetriable || isLastAttempt) {
                    console.error(`[ErrorHandlerService] Operation failed (not retriable or max retries exceeded):`, normalized);
                    throw error;
                }
                
                // Calculate exponential backoff delay
                const delayMs = this.calculateBackoffDelay(
                    attemptNumber - 1,
                    initialDelayMs,
                    maxDelayMs
                );
                
                console.warn(`[ErrorHandlerService] Retriable error on attempt ${attemptNumber}, retrying in ${delayMs}ms:`, normalized.code);
                
                // Call retry callback if provided
                if (typeof onRetry === 'function') {
                    try {
                        onRetry(normalized, attemptNumber, delayMs);
                    } catch (callbackError) {
                        console.error('[ErrorHandlerService] Error in onRetry callback:', callbackError);
                    }
                }
                
                // Wait before retrying
                await this.delay(delayMs);
            }
        }
        
        // All retries exhausted
        console.error(`[ErrorHandlerService] All ${maxRetries + 1} retry attempts failed`);
        throw lastError;
    }
    
    /**
     * Calculate exponential backoff delay
     * Formula: min(maxDelayMs, initialDelayMs * (2 ^ retryCount))
     * 
     * @private
     * @param {number} retryCount - Retry attempt count (0-based)
     * @param {number} initialDelayMs - Initial delay in milliseconds
     * @param {number} maxDelayMs - Maximum delay in milliseconds
     * @returns {number} Delay in milliseconds
     */
    calculateBackoffDelay(retryCount, initialDelayMs, maxDelayMs) {
        const exponentialDelay = initialDelayMs * Math.pow(this.exponentialBackoffFactor, retryCount);
        return Math.min(maxDelayMs, exponentialDelay);
    }
    
    /**
     * Delay execution by specified milliseconds
     * 
     * @private
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Normalize error object to standard format
     * Handles Firebase errors, standard errors, and plain objects
     * 
     * @private
     * @param {Error|Object|string} error - Error to normalize
     * @returns {Object} Normalized error with code and message
     */
    normalizeError(error) {
        if (!error) {
            return {
                code: 'unknown-error',
                message: 'Unknown error',
                originalError: null
            };
        }
        
        // String error
        if (typeof error === 'string') {
            return {
                code: 'error',
                message: error,
                originalError: error
            };
        }
        
        // Object with code and message
        if (error.code) {
            return {
                code: error.code,
                message: error.message || error.code,
                originalError: error
            };
        }
        
        // Standard Error object
        if (error.message) {
            // Try to extract error code from message or name
            const code = error.name || 'error';
            return {
                code: code,
                message: error.message,
                originalError: error
            };
        }
        
        // Fallback
        return {
            code: 'unknown-error',
            message: String(error),
            originalError: error
        };
    }
    
    /**
     * Get user-friendly error message for display
     * 
     * @private
     * @param {Object} normalized - Normalized error object
     * @returns {string} User-friendly message
     */
    getUserFriendlyMessage(normalized) {
        // Direct mapping
        if (this.errorMessages[normalized.code]) {
            return this.errorMessages[normalized.code];
        }
        
        // Try partial matches
        for (const [code, message] of Object.entries(this.errorMessages)) {
            if (normalized.code.includes(code) || code.includes(normalized.code)) {
                return message;
            }
        }
        
        // Fallback to generic message
        return this.errorMessages['unknown-error'];
    }
    
    /**
     * Log error to monitoring service (Firebase Crashlytics or similar)
     * 
     * @private
     * @param {Object} normalized - Normalized error object
     * @param {Object} context - Error context
     * @param {Object} classification - Error classification result
     */
    logToMonitoring(normalized, context, classification) {
        try {
            if (typeof this.errorLoggingCallback === 'function') {
                this.errorLoggingCallback({
                    code: normalized.code,
                    message: normalized.message,
                    context: context,
                    classification: classification,
                    stack: normalized.originalError?.stack,
                    timestamp: new Date().toISOString(),
                    userId: context.userId,
                    operationName: context.operationName,
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
                });
            }
            
            // Try Firebase Crashlytics if available
            if (typeof firebase !== 'undefined' && firebase.crashlytics) {
                try {
                    firebase.crashlytics().recordError(new Error(
                        `[${context.operationName || 'Unknown'}] ${normalized.code}: ${normalized.message}`
                    ));
                } catch (crashlyticsError) {
                    console.debug('[ErrorHandlerService] Crashlytics logging failed:', crashlyticsError);
                }
            }
        } catch (loggingError) {
            console.error('[ErrorHandlerService] Error logging failed:', loggingError);
        }
    }
    
    /**
     * Display error notification to user
     * Uses registered callback or falls back to console
     * 
     * @private
     * @param {Object} classification - Error classification with userMessage
     */
    displayErrorNotification(classification) {
        try {
            // Determine notification type based on error characteristics
            const isTransient = classification.isRetriable && !classification.isPermanent;
            const errorLevel = classification.isPermanent ? 'error' : 
                               isTransient ? 'warning' : 'error';
            
            // Only show user-visible errors (not technical errors)
            const shouldNotify = !classification.code.includes('handler');
            
            if (shouldNotify && typeof this.errorNotificationCallback === 'function') {
                // Duration: 3 seconds for transient, 5+ for permanent
                const duration = isTransient ? 3000 : 5000;
                
                this.errorNotificationCallback(
                    classification.userMessage,
                    duration,
                    errorLevel
                );
            }
        } catch (notificationError) {
            console.error('[ErrorHandlerService] Error notification failed:', notificationError);
        }
    }
    
    /**
     * Get error retry configuration for operation
     * 
     * @param {string} operationType - Type of operation (login, firestore-read, firestore-write, etc)
     * @returns {Object} Retry configuration with maxRetries, initialDelayMs, maxDelayMs
     */
    getRetryConfig(operationType) {
        const configs = {
            'login': {
                maxRetries: 2,
                initialDelayMs: 100,
                maxDelayMs: 5000
            },
            'firestore-read': {
                maxRetries: 3,
                initialDelayMs: 100,
                maxDelayMs: 10000
            },
            'firestore-write': {
                maxRetries: 3,
                initialDelayMs: 100,
                maxDelayMs: 10000
            },
            'realtime-db': {
                maxRetries: 3,
                initialDelayMs: 100,
                maxDelayMs: 10000
            },
            'token-refresh': {
                maxRetries: 2,
                initialDelayMs: 500,
                maxDelayMs: 5000
            },
            'default': {
                maxRetries: this.defaultMaxRetries,
                initialDelayMs: this.defaultInitialDelayMs,
                maxDelayMs: this.defaultMaxDelayMs
            }
        };
        
        return configs[operationType] || configs['default'];
    }
}

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandlerService;
}

// Create singleton instance
let errorHandlerServiceInstance = null;

/**
 * Get or create ErrorHandlerService singleton
 * 
 * @returns {ErrorHandlerService}
 */
function getErrorHandlerService() {
    if (!errorHandlerServiceInstance) {
        errorHandlerServiceInstance = new ErrorHandlerService();
    }
    return errorHandlerServiceInstance;
}

// Expose globally
if (typeof window !== 'undefined') {
    window.ErrorHandlerService = ErrorHandlerService;
    window.getErrorHandlerService = getErrorHandlerService;
}
