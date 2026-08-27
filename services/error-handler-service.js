/**
 * ErrorHandlerService - Firebase Error Classification and Retry Logic
 * Manages Firebase error classification, retry strategies with exponential backoff,
 * and error notification for user-facing operations
 * 
 * Requirements: 9.1, 9.2, 9.3
 */

class ErrorHandlerService {
    constructor() {
        // Error classification mapping
        this.retriableErrorCodes = new Set([
            'network-error',
            'timeout',
            'too-many-requests',
            'unavailable',
            'internal',
            'service-unavailable',
            'aborted',
            'deadline-exceeded'
        ]);

        this.permanentErrorCodes = new Set([
            'permission-denied',
            'invalid-argument',
            'unauthenticated',
            'not-found',
            'already-exists',
            'failed-precondition',
            'out-of-range',
            'unimplemented',
            'invalid-credential',
            'user-disabled',
            'user-not-found',
            'wrong-password',
            'email-already-in-use',
            'weak-password',
            'invalid-email'
        ]);

        // Firebase error code mapping to user-friendly messages
        this.errorMessages = {
            // Authentication errors
            'user-not-found': 'User account not found. Please check your email and try again.',
            'wrong-password': 'Incorrect password. Please try again or use forgot password.',
            'user-disabled': 'This account has been disabled. Please contact support.',
            'too-many-requests': 'Too many login attempts. Please try again later.',
            'invalid-email': 'Please enter a valid email address.',
            'email-already-in-use': 'An account with this email already exists.',
            'weak-password': 'Password must be at least 6 characters long.',
            'invalid-credential': 'Invalid login credentials. Please try again.',
            'operation-not-allowed': 'This operation is not allowed. Please contact support.',

            // Firestore/Database errors
            'permission-denied': 'You do not have permission to perform this action.',
            'not-found': 'The requested resource was not found.',
            'already-exists': 'This resource already exists.',
            'failed-precondition': 'The operation cannot be completed at this time.',
            'invalid-argument': 'Invalid data provided. Please check your input.',
            'out-of-range': 'The provided value is out of the allowed range.',
            'unauthenticated': 'Your session has expired. Please log in again.',

            // Network errors
            'network-error': 'Network connection error. Please check your internet connection.',
            'timeout': 'Request timed out. Please try again.',
            'service-unavailable': 'Service is currently unavailable. Please try again later.',
            'unavailable': 'Service is currently unavailable. Please try again later.',
            'internal': 'An internal server error occurred. Please try again later.',
            'aborted': 'Operation was aborted. Please try again.',
            'deadline-exceeded': 'Request took too long. Please try again.',

            // Generic
            'unknown': 'An unexpected error occurred. Please try again.',
            'default': 'An error occurred. Please try again or contact support.'
        };

        // Notification manager
        this.notificationQueue = [];
        this.activeNotifications = new Map();
    }

    /**
     * Classify error as retriable or permanent
     * Returns true if operation can be retried
     * 
     * @param {Error} error - The error to classify
     * @returns {boolean} - True if retriable, false if permanent
     */
    isRetriableError(error) {
        if (!error) return false;

        // Check Firebase-specific error codes
        const errorCode = error.code || error.message;
        
        // If it's a known retriable error code, it's retriable
        if (this.retriableErrorCodes.has(errorCode)) {
            return true;
        }

        // If it's a known permanent error code, it's not retriable
        if (this.permanentErrorCodes.has(errorCode)) {
            return false;
        }

        // Network-related errors are retriable
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            return true;
        }

        // TimeoutError is retriable
        if (error instanceof Error && error.name === 'TimeoutError') {
            return true;
        }

        // Default: assume not retriable for safety
        return false;
    }

    /**
     * Get user-friendly error message
     * Maps Firebase error codes to readable messages
     * 
     * @param {Error} error - The error object
     * @returns {string} - User-friendly error message
     */
    getErrorMessage(errorCode) {
        if (typeof errorCode === 'object' && errorCode.code) {
            errorCode = errorCode.code;
        }

        return this.errorMessages[errorCode] || this.errorMessages.default;
    }

    /**
     * Calculate exponential backoff delay
     * Formula: (2^attempt - 1) * initialDelayMs, capped at maxDelayMs
     * 
     * @param {number} attempt - The attempt number (0-indexed)
     * @param {number} initialDelayMs - The initial delay in milliseconds
     * @param {number} maxDelayMs - The maximum delay in milliseconds
     * @returns {number} - The delay in milliseconds
     */
    calculateBackoffDelay(attempt, initialDelayMs = 100, maxDelayMs = 10000) {
        // Add jitter to prevent thundering herd
        const exponentialDelay = Math.pow(2, attempt) * initialDelayMs;
        const jitter = Math.random() * (exponentialDelay * 0.1); // 10% jitter
        const delay = exponentialDelay + jitter;

        // Cap at maximum delay
        return Math.min(delay, maxDelayMs);
    }

    /**
     * Execute operation with exponential backoff retry logic
     * Automatically retries on retriable errors
     * 
     * @param {Function} operation - Async function to execute
     * @param {number} maxRetries - Maximum number of retries (default: 3)
     * @param {number} initialDelayMs - Initial delay in milliseconds (default: 100)
     * @returns {Promise} - Result of successful operation
     * @throws {Error} - Final error if all retries fail
     */
    async executeWithRetry(operation, maxRetries = 3, initialDelayMs = 100) {
        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;

                // Check if error is retriable
                if (!this.isRetriableError(error)) {
                    // Permanent error - don't retry
                    throw error;
                }

                // If this was the last attempt, throw the error
                if (attempt === maxRetries) {
                    throw error;
                }

                // Calculate backoff delay
                const delay = this.calculateBackoffDelay(attempt, initialDelayMs);

                console.warn(`[ErrorHandler] Retrying operation (attempt ${attempt + 1}/${maxRetries + 1}) after ${delay}ms`, {
                    errorCode: error.code,
                    errorMessage: error.message
                });

                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw lastError;
    }

    /**
     * Handle error with context and optional retry
     * Logs error and optionally displays notification
     * 
     * @param {Error} error - The error to handle
     * @param {Object} context - Context information
     *   - operation: string describing the operation
     *   - userId: string with user ID
     *   - showNotification: boolean to display user notification
     *   - logToMonitoring: boolean to log to monitoring service
     * @returns {Object} - Error handling result
     */
    async handleError(error, context = {}) {
        const {
            operation = 'Unknown operation',
            userId = null,
            showNotification = true,
            logToMonitoring = true
        } = context;

        // Determine if error is retriable
        const retriable = this.isRetriableError(error);

        // Log error details
        console.error(`[ErrorHandler] Error in ${operation}:`, {
            code: error.code,
            message: error.message,
            retriable,
            userId,
            stack: error.stack
        });

        // Log to monitoring service
        if (logToMonitoring) {
            await this.logToMonitoring(error, context);
        }

        // Show user notification
        if (showNotification) {
            const userMessage = this.getErrorMessage(error.code || error.message);
            this.displayErrorNotification(userMessage, retriable ? 5000 : 0);
        }

        return {
            code: error.code,
            message: error.message,
            userMessage: this.getErrorMessage(error.code || error.message),
            retriable,
            context
        };
    }

    /**
     * Display error notification to user
     * Shows toast notification with auto-dismiss for transient errors
     * 
     * @param {string} message - The message to display
     * @param {number} duration - Duration in milliseconds (0 = persistent)
     * @param {string} type - Notification type (error, warning, info, success)
     */
    displayErrorNotification(message, duration = 5000, type = 'error') {
        const notificationId = `notification-${Date.now()}-${Math.random()}`;

        // Create notification element
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `toast-notification toast-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');

        // Build notification HTML
        notification.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">
                    ${type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
                </span>
                <span class="toast-message">${this.escapeHtml(message)}</span>
                <button class="toast-close" aria-label="Close notification" data-notification-id="${notificationId}">
                    ✕
                </button>
            </div>
        `;

        // Create container if it doesn't exist
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Add notification to container
        container.appendChild(notification);

        // Track notification
        this.activeNotifications.set(notificationId, {
            element: notification,
            timeout: null,
            type
        });

        // Add close button listener
        const closeButton = notification.querySelector('.toast-close');
        closeButton.addEventListener('click', () => this.dismissNotification(notificationId));

        // Auto-dismiss if duration > 0
        if (duration > 0) {
            const timeout = setTimeout(() => this.dismissNotification(notificationId), duration);
            this.activeNotifications.get(notificationId).timeout = timeout;
        }

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        return notificationId;
    }

    /**
     * Dismiss notification
     * 
     * @param {string} notificationId - The notification ID to dismiss
     */
    dismissNotification(notificationId) {
        const notification = this.activeNotifications.get(notificationId);
        if (!notification) return;

        // Clear timeout if exists
        if (notification.timeout) {
            clearTimeout(notification.timeout);
        }

        // Animate out
        notification.element.classList.remove('show');

        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }
            this.activeNotifications.delete(notificationId);
        }, 300);
    }

    /**
     * Log error to monitoring service (Firebase Crashlytics or similar)
     * Sends error telemetry for analysis and debugging
     * 
     * @param {Error} error - The error to log
     * @param {Object} context - Context information
     */
    async logToMonitoring(error, context = {}) {
        try {
            // Build error object
            const errorData = {
                code: error.code,
                message: error.message,
                stack: error.stack,
                name: error.name,
                timestamp: new Date().toISOString(),
                userId: context.userId || null,
                operation: context.operation || null,
                userAgent: navigator.userAgent,
                url: window.location.href,
                ...context
            };

            // Log to Firebase Crashlytics if available
            if (typeof firebase !== 'undefined' && firebase.crashlytics) {
                firebase.crashlytics().recordError(error);
                firebase.crashlytics().setCustomKey('context', JSON.stringify(context));
            }

            // Log to console in development
            console.debug('[ErrorHandler] Monitoring log:', errorData);

            // In production, send to monitoring endpoint
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                // Could send to external monitoring service here
                // await fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) });
            }
        } catch (err) {
            console.error('[ErrorHandler] Failed to log error to monitoring:', err);
        }
    }

    /**
     * Utility function to escape HTML special characters
     * Prevents XSS attacks in notifications
     * 
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Clear all active notifications
     */
    clearAllNotifications() {
        for (const [notificationId] of this.activeNotifications) {
            this.dismissNotification(notificationId);
        }
    }
}

// Export service
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandlerService;
}

// Expose globally for non-module usage
if (typeof window !== 'undefined') {
    window.ErrorHandlerService = ErrorHandlerService;
}
