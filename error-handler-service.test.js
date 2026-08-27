/**
 * Unit Tests for ErrorHandlerService
 * 
 * Tests cover:
 * - Error classification (retriable vs permanent)
 * - Error message mapping
 * - Exponential backoff retry logic
 * - Error handling and notifications
 * 
 * Requirements: 9.1, 9.2, 9.3
 * Task: 7.4 Write unit tests for ErrorHandlerService retry logic
 */

const ErrorHandlerService = require('./error-handler-service');

// Mock implementations for testing
class MockTimer {
    constructor() {
        this.timers = [];
        this.currentTime = 0;
    }
    
    setTimeout(callback, delay) {
        const id = this.timers.length;
        this.timers.push({ callback, delay, time: this.currentTime + delay, id });
        return id;
    }
    
    clearTimeout(id) {
        this.timers = this.timers.filter(t => t.id !== id);
    }
    
    async advanceBy(ms) {
        this.currentTime += ms;
        const toRun = this.timers.filter(t => t.time <= this.currentTime);
        toRun.forEach(t => t.callback());
        this.timers = this.timers.filter(t => t.time > this.currentTime);
    }
}

describe('ErrorHandlerService', () => {
    let errorHandler;
    let notificationCalls;
    let loggingCalls;
    
    beforeEach(() => {
        errorHandler = new ErrorHandlerService();
        notificationCalls = [];
        loggingCalls = [];
        
        // Register mock callbacks
        errorHandler.onErrorNotification((message, duration, level) => {
            notificationCalls.push({ message, duration, level });
        });
        
        errorHandler.onErrorLogging((error, context) => {
            loggingCalls.push({ error, context });
        });
    });
    
    // ============================================
    // Tests: isRetriableError
    // ============================================
    
    describe('isRetriableError', () => {
        test('should return true for network timeout error', () => {
            const error = { code: 'network-error', message: 'Network timeout' };
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });
        
        test('should return true for too-many-requests error', () => {
            const error = { code: 'auth/too-many-requests', message: 'Too many requests' };
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });
        
        test('should return true for service unavailable error', () => {
            const error = { code: 'service-unavailable', message: 'Service unavailable' };
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });
        
        test('should return true for timeout error', () => {
            const error = { code: 'timeout', message: 'Request timeout' };
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });
        
        test('should return false for permission-denied error', () => {
            const error = { code: 'permission-denied', message: 'Permission denied' };
            expect(errorHandler.isRetriableError(error)).toBe(false);
        });
        
        test('should return false for invalid-argument error', () => {
            const error = { code: 'invalid-argument', message: 'Invalid argument' };
            expect(errorHandler.isRetriableError(error)).toBe(false);
        });
        
        test('should return false for user-not-found error', () => {
            const error = { code: 'auth/user-not-found', message: 'User not found' };
            expect(errorHandler.isRetriableError(error)).toBe(false);
        });
        
        test('should return false for wrong-password error', () => {
            const error = { code: 'auth/wrong-password', message: 'Wrong password' };
            expect(errorHandler.isRetriableError(error)).toBe(false);
        });
    });
    
    // ============================================
    // Tests: isPermanentError
    // ============================================
    
    describe('isPermanentError', () => {
        test('should return true for permission-denied error', () => {
            const error = { code: 'permission-denied', message: 'Permission denied' };
            expect(errorHandler.isPermanentError(error)).toBe(true);
        });
        
        test('should return true for user-not-found error', () => {
            const error = { code: 'auth/user-not-found', message: 'User not found' };
            expect(errorHandler.isPermanentError(error)).toBe(true);
        });
        
        test('should return false for network error', () => {
            const error = { code: 'network-error', message: 'Network error' };
            expect(errorHandler.isPermanentError(error)).toBe(false);
        });
        
        test('should return false for too-many-requests error', () => {
            const error = { code: 'auth/too-many-requests', message: 'Too many requests' };
            expect(errorHandler.isPermanentError(error)).toBe(false);
        });
    });
    
    // ============================================
    // Tests: getErrorMessage
    // ============================================
    
    describe('getErrorMessage', () => {
        test('should map auth/user-not-found to user-friendly message', () => {
            const error = { code: 'auth/user-not-found', message: 'User not found' };
            const message = errorHandler.getErrorMessage(error);
            expect(message).toContain('No user found');
        });
        
        test('should map auth/wrong-password to user-friendly message', () => {
            const error = { code: 'auth/wrong-password', message: 'Wrong password' };
            const message = errorHandler.getErrorMessage(error);
            expect(message).toContain('Incorrect password');
        });
        
        test('should map permission-denied to user-friendly message', () => {
            const error = { code: 'permission-denied', message: 'Permission denied' };
            const message = errorHandler.getErrorMessage(error);
            expect(message).toContain('do not have permission');
        });
        
        test('should map network-error to user-friendly message', () => {
            const error = { code: 'network-error', message: 'Network error' };
            const message = errorHandler.getErrorMessage(error);
            expect(message).toContain('Network connection error');
        });
        
        test('should return generic message for unmapped error codes', () => {
            const error = { code: 'unknown-error', message: 'Unknown error' };
            const message = errorHandler.getErrorMessage(error);
            expect(message).toBeTruthy();
        });
    });
    
    // ============================================
    // Tests: executeWithRetry - Success Cases
    // ============================================
    
    describe('executeWithRetry - success cases', () => {
        test('should succeed on first attempt', async () => {
            let attemptCount = 0;
            const operation = jest.fn(async () => {
                attemptCount++;
                return 'success';
            });
            
            const result = await errorHandler.executeWithRetry(operation);
            
            expect(result).toBe('success');
            expect(attemptCount).toBe(1);
            expect(operation).toHaveBeenCalledTimes(1);
        });
        
        test('should return value from successful operation', async () => {
            const expectedValue = { uid: '123', email: 'user@example.com' };
            const operation = jest.fn(async () => expectedValue);
            
            const result = await errorHandler.executeWithRetry(operation);
            
            expect(result).toEqual(expectedValue);
        });
        
        test('should succeed after transient failure on second attempt', async () => {
            let attemptCount = 0;
            const operation = jest.fn(async () => {
                attemptCount++;
                if (attemptCount === 1) {
                    throw { code: 'timeout', message: 'Timeout' };
                }
                return 'success';
            });
            
            const result = await errorHandler.executeWithRetry(operation, {
                maxRetries: 2,
                initialDelayMs: 10
            });
            
            expect(result).toBe('success');
            expect(attemptCount).toBe(2);
            expect(operation).toHaveBeenCalledTimes(2);
        });
        
        test('should succeed after multiple transient failures', async () => {
            let attemptCount = 0;
            const operation = jest.fn(async () => {
                attemptCount++;
                if (attemptCount < 3) {
                    throw { code: 'service-unavailable', message: 'Service unavailable' };
                }
                return 'success';
            });
            
            const result = await errorHandler.executeWithRetry(operation, {
                maxRetries: 3,
                initialDelayMs: 10
            });
            
            expect(result).toBe('success');
            expect(attemptCount).toBe(3);
            expect(operation).toHaveBeenCalledTimes(3);
        });
    });
    
    // ============================================
    // Tests: executeWithRetry - Failure Cases
    // ============================================
    
    describe('executeWithRetry - failure cases', () => {
        test('should fail with permanent error on first attempt', async () => {
            const operation = jest.fn(async () => {
                throw { code: 'permission-denied', message: 'Permission denied' };
            });
            
            try {
                await errorHandler.executeWithRetry(operation, { maxRetries: 3 });
                fail('Should have thrown error');
            } catch (error) {
                expect(error.code).toBe('permission-denied');
            }
            
            expect(operation).toHaveBeenCalledTimes(1);
        });
        
        test('should fail after exhausting retries for retriable error', async () => {
            const operation = jest.fn(async () => {
                throw { code: 'timeout', message: 'Timeout' };
            });
            
            try {
                await errorHandler.executeWithRetry(operation, {
                    maxRetries: 2,
                    initialDelayMs: 10
                });
                fail('Should have thrown error');
            } catch (error) {
                expect(error.code).toBe('timeout');
            }
            
            expect(operation).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
        });
        
        test('should throw same error that exhausted retries', async () => {
            const originalError = { code: 'service-unavailable', message: 'Service unavailable' };
            const operation = jest.fn(async () => {
                throw originalError;
            });
            
            try {
                await errorHandler.executeWithRetry(operation, {
                    maxRetries: 1,
                    initialDelayMs: 10
                });
            } catch (error) {
                expect(error).toEqual(originalError);
            }
        });
    });
    
    // ============================================
    // Tests: Exponential Backoff Delays
    // ============================================
    
    describe('exponential backoff delays', () => {
        test('should calculate correct backoff delay for retry 0', () => {
            const delay = errorHandler.calculateBackoffDelay(0, 100, 10000);
            expect(delay).toBe(100); // 100 * 2^0 = 100
        });
        
        test('should calculate correct backoff delay for retry 1', () => {
            const delay = errorHandler.calculateBackoffDelay(1, 100, 10000);
            expect(delay).toBe(200); // 100 * 2^1 = 200
        });
        
        test('should calculate correct backoff delay for retry 2', () => {
            const delay = errorHandler.calculateBackoffDelay(2, 100, 10000);
            expect(delay).toBe(400); // 100 * 2^2 = 400
        });
        
        test('should calculate correct backoff delay for retry 3', () => {
            const delay = errorHandler.calculateBackoffDelay(3, 100, 10000);
            expect(delay).toBe(800); // 100 * 2^3 = 800
        });
        
        test('should cap backoff delay at maxDelayMs', () => {
            const delay = errorHandler.calculateBackoffDelay(10, 100, 10000);
            expect(delay).toBeLessThanOrEqual(10000);
        });
        
        test('should follow pattern: 100ms → 200ms → 400ms → ...', () => {
            const delays = [];
            for (let i = 0; i < 5; i++) {
                delays.push(errorHandler.calculateBackoffDelay(i, 100, 10000));
            }
            
            expect(delays).toEqual([100, 200, 400, 800, 1600]);
        });
    });
    
    // ============================================
    // Tests: Error Handling and Notifications
    // ============================================
    
    describe('error handling', () => {
        test('should log errors to monitoring service', () => {
            const error = { code: 'timeout', message: 'Request timeout' };
            const context = { operationName: 'login', userId: 'user123' };
            
            errorHandler.handleError(error, context);
            
            expect(loggingCalls.length).toBeGreaterThan(0);
        });
        
        test('should display error notifications for user-facing errors', () => {
            const error = { code: 'auth/wrong-password', message: 'Wrong password' };
            const context = { operationName: 'login' };
            
            errorHandler.handleError(error, context);
            
            expect(notificationCalls.length).toBeGreaterThan(0);
        });
        
        test('should classify error with correct properties', () => {
            const error = { code: 'timeout', message: 'Timeout' };
            const context = { operationName: 'firestore-read' };
            
            const classified = errorHandler.handleError(error, context);
            
            expect(classified.code).toBe('timeout');
            expect(classified.isRetriable).toBe(true);
            expect(classified.isPermanent).toBe(false);
            expect(classified.userMessage).toBeTruthy();
        });
    });
    
    // ============================================
    // Tests: Network Error Detection
    // ============================================
    
    describe('network error detection', () => {
        test('should detect network-error as network error', () => {
            const error = { code: 'network-error', message: 'Network timeout' };
            expect(errorHandler.isNetworkError(error)).toBe(true);
        });
        
        test('should detect timeout as network error', () => {
            const error = { code: 'timeout', message: 'Request timeout' };
            expect(errorHandler.isNetworkError(error)).toBe(true);
        });
        
        test('should detect auth/network-request-failed as network error', () => {
            const error = { code: 'auth/network-request-failed', message: 'Network failed' };
            expect(errorHandler.isNetworkError(error)).toBe(true);
        });
        
        test('should not detect permission-denied as network error', () => {
            const error = { code: 'permission-denied', message: 'Permission denied' };
            expect(errorHandler.isNetworkError(error)).toBe(false);
        });
    });
    
    // ============================================
    // Tests: Error Normalization
    // ============================================
    
    describe('error normalization', () => {
        test('should normalize Firebase error objects', () => {
            const error = { code: 'auth/user-not-found', message: 'User not found' };
            const normalized = errorHandler.normalizeError(error);
            
            expect(normalized.code).toBe('auth/user-not-found');
            expect(normalized.message).toBe('User not found');
        });
        
        test('should normalize standard Error objects', () => {
            const error = new Error('Something went wrong');
            const normalized = errorHandler.normalizeError(error);
            
            expect(normalized.code).toBe('Error');
            expect(normalized.message).toBe('Something went wrong');
        });
        
        test('should normalize string errors', () => {
            const error = 'Simple error message';
            const normalized = errorHandler.normalizeError(error);
            
            expect(normalized.code).toBe('error');
            expect(normalized.message).toBe('Simple error message');
        });
        
        test('should handle null/undefined errors', () => {
            const normalized1 = errorHandler.normalizeError(null);
            const normalized2 = errorHandler.normalizeError(undefined);
            
            expect(normalized1.code).toBe('unknown-error');
            expect(normalized2.code).toBe('unknown-error');
        });
    });
    
    // ============================================
    // Tests: Retry Configuration
    // ============================================
    
    describe('retry configuration', () => {
        test('should return config for login operation', () => {
            const config = errorHandler.getRetryConfig('login');
            
            expect(config.maxRetries).toBe(2);
            expect(config.initialDelayMs).toBe(100);
        });
        
        test('should return config for firestore-read operation', () => {
            const config = errorHandler.getRetryConfig('firestore-read');
            
            expect(config.maxRetries).toBe(3);
            expect(config.initialDelayMs).toBe(100);
        });
        
        test('should return config for firestore-write operation', () => {
            const config = errorHandler.getRetryConfig('firestore-write');
            
            expect(config.maxRetries).toBe(3);
        });
        
        test('should return default config for unknown operation', () => {
            const config = errorHandler.getRetryConfig('unknown-operation');
            
            expect(config.maxRetries).toBe(3);
            expect(config.initialDelayMs).toBe(100);
        });
    });
    
    // ============================================
    // Tests: onRetry Callback
    // ============================================
    
    describe('onRetry callback', () => {
        test('should call onRetry callback on retriable error', async () => {
            const onRetryCallback = jest.fn();
            let attemptCount = 0;
            
            const operation = jest.fn(async () => {
                attemptCount++;
                if (attemptCount === 1) {
                    throw { code: 'timeout', message: 'Timeout' };
                }
                return 'success';
            });
            
            await errorHandler.executeWithRetry(operation, {
                maxRetries: 2,
                initialDelayMs: 10,
                onRetry: onRetryCallback
            });
            
            expect(onRetryCallback).toHaveBeenCalled();
            const callArgs = onRetryCallback.mock.calls[0];
            expect(callArgs[0].code).toBe('timeout');
            expect(callArgs[1]).toBe(1); // attempt number
            expect(callArgs[2]).toBeGreaterThan(0); // delay in ms
        });
        
        test('should not call onRetry for permanent errors', async () => {
            const onRetryCallback = jest.fn();
            
            const operation = jest.fn(async () => {
                throw { code: 'permission-denied', message: 'Permission denied' };
            });
            
            try {
                await errorHandler.executeWithRetry(operation, {
                    maxRetries: 2,
                    initialDelayMs: 10,
                    onRetry: onRetryCallback
                });
            } catch (error) {
                // Expected to fail
            }
            
            expect(onRetryCallback).not.toHaveBeenCalled();
        });
    });
});

// Run tests if this file is executed directly
if (typeof describe === 'undefined') {
    console.log('Running with test framework (Jest)');
}
