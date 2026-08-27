/**
 * Unit Tests for ErrorHandlerService
 * Tests error classification, retry logic, and notification handling
 * 
 * Requirements: 9.1, 9.2, 9.3
 */

describe('ErrorHandlerService', () => {
    let errorHandler;

    beforeEach(() => {
        // Create fresh instance for each test
        errorHandler = new ErrorHandlerService();

        // Clear any existing notifications
        errorHandler.clearAllNotifications();

        // Mock DOM
        document.body.innerHTML = '';
    });

    describe('isRetriableError', () => {
        it('should return true for network timeout errors', () => {
            const error = new Error('Network timeout');
            error.code = 'timeout';
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });

        it('should return true for too-many-requests errors', () => {
            const error = new Error('Too many requests');
            error.code = 'too-many-requests';
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });

        it('should return true for unavailable service errors', () => {
            const error = new Error('Service unavailable');
            error.code = 'unavailable';
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });

        it('should return true for service-unavailable errors', () => {
            const error = new Error('Service unavailable');
            error.code = 'service-unavailable';
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });

        it('should return true for internal server errors', () => {
            const error = new Error('Internal error');
            error.code = 'internal';
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });

        it('should return true for aborted operations', () => {
            const error = new Error('Operation aborted');
            error.code = 'aborted';
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });

        it('should return true for deadline-exceeded errors', () => {
            const error = new Error('Deadline exceeded');
            error.code = 'deadline-exceeded';
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });

        it('should return true for network-error', () => {
            const error = new Error('Network error');
            error.code = 'network-error';
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });

        it('should return false for permission-denied errors', () => {
            const error = new Error('Permission denied');
            error.code = 'permission-denied';
            expect(errorHandler.isRetriableError(error)).toBe(false);
        });

        it('should return false for invalid-argument errors', () => {
            const error = new Error('Invalid argument');
            error.code = 'invalid-argument';
            expect(errorHandler.isRetriableError(error)).toBe(false);
        });

        it('should return false for unauthenticated errors', () => {
            const error = new Error('Unauthenticated');
            error.code = 'unauthenticated';
            expect(errorHandler.isRetriableError(error)).toBe(false);
        });

        it('should return false for not-found errors', () => {
            const error = new Error('Not found');
            error.code = 'not-found';
            expect(errorHandler.isRetriableError(error)).toBe(false);
        });

        it('should return false for user-not-found errors', () => {
            const error = new Error('User not found');
            error.code = 'user-not-found';
            expect(errorHandler.isRetriableError(error)).toBe(false);
        });

        it('should return false for wrong-password errors', () => {
            const error = new Error('Wrong password');
            error.code = 'wrong-password';
            expect(errorHandler.isRetriableError(error)).toBe(false);
        });

        it('should return true for TypeError with Failed to fetch', () => {
            const error = new TypeError('Failed to fetch');
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });

        it('should return true for TimeoutError', () => {
            const error = new Error('Request timed out');
            error.name = 'TimeoutError';
            expect(errorHandler.isRetriableError(error)).toBe(true);
        });

        it('should return false for null error', () => {
            expect(errorHandler.isRetriableError(null)).toBe(false);
        });

        it('should return false for undefined error', () => {
            expect(errorHandler.isRetriableError(undefined)).toBe(false);
        });
    });

    describe('getErrorMessage', () => {
        it('should return user-friendly message for user-not-found', () => {
            const message = errorHandler.getErrorMessage('user-not-found');
            expect(message).toBe('User account not found. Please check your email and try again.');
        });

        it('should return user-friendly message for wrong-password', () => {
            const message = errorHandler.getErrorMessage('wrong-password');
            expect(message).toBe('Incorrect password. Please try again or use forgot password.');
        });

        it('should return user-friendly message for too-many-requests', () => {
            const message = errorHandler.getErrorMessage('too-many-requests');
            expect(message).toBe('Too many login attempts. Please try again later.');
        });

        it('should return user-friendly message for permission-denied', () => {
            const message = errorHandler.getErrorMessage('permission-denied');
            expect(message).toBe('You do not have permission to perform this action.');
        });

        it('should return user-friendly message for network-error', () => {
            const message = errorHandler.getErrorMessage('network-error');
            expect(message).toBe('Network connection error. Please check your internet connection.');
        });

        it('should return default message for unknown error code', () => {
            const message = errorHandler.getErrorMessage('unknown-error-code');
            expect(message).toBe('An error occurred. Please try again or contact support.');
        });

        it('should handle error object with code property', () => {
            const error = { code: 'wrong-password' };
            const message = errorHandler.getErrorMessage(error);
            expect(message).toBe('Incorrect password. Please try again or use forgot password.');
        });
    });

    describe('calculateBackoffDelay', () => {
        it('should calculate exponential backoff for first attempt', () => {
            const delay = errorHandler.calculateBackoffDelay(0, 100, 10000);
            // Should be around 100ms (with jitter)
            expect(delay).toBeGreaterThanOrEqual(100);
            expect(delay).toBeLessThanOrEqual(210); // 100 + 10% jitter
        });

        it('should calculate exponential backoff for second attempt', () => {
            const delay = errorHandler.calculateBackoffDelay(1, 100, 10000);
            // Should be around 200ms (with jitter)
            expect(delay).toBeGreaterThanOrEqual(200);
            expect(delay).toBeLessThanOrEqual(420); // 200 + 10% jitter
        });

        it('should calculate exponential backoff for third attempt', () => {
            const delay = errorHandler.calculateBackoffDelay(2, 100, 10000);
            // Should be around 400ms (with jitter)
            expect(delay).toBeGreaterThanOrEqual(400);
            expect(delay).toBeLessThanOrEqual(840); // 400 + 10% jitter
        });

        it('should cap delay at maximum value', () => {
            const delay = errorHandler.calculateBackoffDelay(10, 100, 10000);
            expect(delay).toBeLessThanOrEqual(10000);
        });

        it('should respect custom initial delay', () => {
            const delay = errorHandler.calculateBackoffDelay(0, 50, 5000);
            expect(delay).toBeGreaterThanOrEqual(50);
            expect(delay).toBeLessThanOrEqual(105); // 50 + 10% jitter
        });

        it('should respect custom maximum delay', () => {
            const delay = errorHandler.calculateBackoffDelay(10, 100, 5000);
            expect(delay).toBeLessThanOrEqual(5000);
        });
    });

    describe('executeWithRetry', () => {
        it('should succeed on first attempt', async () => {
            const operation = jest.fn().mockResolvedValue('success');
            const result = await errorHandler.executeWithRetry(operation, 3, 10);
            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(1);
        });

        it('should retry on retriable error and succeed', async () => {
            const error = new Error('Network timeout');
            error.code = 'timeout';

            const operation = jest.fn()
                .mockRejectedValueOnce(error)
                .mockResolvedValueOnce('success');

            const result = await errorHandler.executeWithRetry(operation, 3, 10);
            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(2);
        });

        it('should retry multiple times and succeed', async () => {
            const error = new Error('Network timeout');
            error.code = 'timeout';

            const operation = jest.fn()
                .mockRejectedValueOnce(error)
                .mockRejectedValueOnce(error)
                .mockResolvedValueOnce('success');

            const result = await errorHandler.executeWithRetry(operation, 3, 10);
            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(3);
        });

        it('should not retry on permanent error', async () => {
            const error = new Error('Permission denied');
            error.code = 'permission-denied';

            const operation = jest.fn().mockRejectedValueOnce(error);

            await expect(errorHandler.executeWithRetry(operation, 3, 10)).rejects.toThrow(error);
            expect(operation).toHaveBeenCalledTimes(1);
        });

        it('should throw error after max retries', async () => {
            const error = new Error('Network timeout');
            error.code = 'timeout';

            const operation = jest.fn().mockRejectedValue(error);

            await expect(errorHandler.executeWithRetry(operation, 2, 10)).rejects.toThrow(error);
            expect(operation).toHaveBeenCalledTimes(3); // initial + 2 retries
        });

        it('should respect maxRetries parameter', async () => {
            const error = new Error('Network timeout');
            error.code = 'timeout';

            const operation = jest.fn().mockRejectedValue(error);

            await expect(errorHandler.executeWithRetry(operation, 1, 10)).rejects.toThrow(error);
            expect(operation).toHaveBeenCalledTimes(2); // initial + 1 retry
        });

        it('should respect initialDelayMs parameter', async () => {
            jest.useFakeTimers();

            const error = new Error('Network timeout');
            error.code = 'timeout';

            const operation = jest.fn()
                .mockRejectedValueOnce(error)
                .mockResolvedValueOnce('success');

            const promise = errorHandler.executeWithRetry(operation, 3, 50);

            // Should wait before retrying
            jest.runOnlyPendingTimers();

            const result = await promise;
            expect(result).toBe('success');

            jest.useRealTimers();
        });
    });

    describe('handleError', () => {
        it('should handle retriable error and log it', async () => {
            const error = new Error('Network timeout');
            error.code = 'timeout';

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const result = await errorHandler.handleError(error, {
                operation: 'fetchUser',
                userId: 'user123',
                showNotification: false,
                logToMonitoring: false
            });

            expect(result.retriable).toBe(true);
            expect(result.code).toBe('timeout');
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it('should handle permanent error', async () => {
            const error = new Error('Permission denied');
            error.code = 'permission-denied';

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const result = await errorHandler.handleError(error, {
                operation: 'updateUser',
                userId: 'user123',
                showNotification: false,
                logToMonitoring: false
            });

            expect(result.retriable).toBe(false);
            expect(result.code).toBe('permission-denied');
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it('should generate user-friendly message', async () => {
            const error = new Error('User not found');
            error.code = 'user-not-found';

            const result = await errorHandler.handleError(error, {
                showNotification: false,
                logToMonitoring: false
            });

            expect(result.userMessage).toBe('User account not found. Please check your email and try again.');
        });

        it('should include context in result', async () => {
            const error = new Error('Error');
            error.code = 'unknown-error-code';

            const context = {
                operation: 'testOp',
                userId: 'user123'
            };

            const result = await errorHandler.handleError(error, {
                ...context,
                showNotification: false,
                logToMonitoring: false
            });

            expect(result.context.operation).toBe('testOp');
            expect(result.context.userId).toBe('user123');
        });
    });

    describe('displayErrorNotification', () => {
        it('should create toast notification element', () => {
            const message = 'Test error message';
            errorHandler.displayErrorNotification(message, 0, 'error');

            const container = document.getElementById('toast-container');
            expect(container).toBeTruthy();

            const notification = container.querySelector('.toast-notification');
            expect(notification).toBeTruthy();
            expect(notification).toHaveClass('toast-error');
        });

        it('should display correct message text', () => {
            const message = 'Test error message';
            errorHandler.displayErrorNotification(message, 0, 'error');

            const notification = document.querySelector('.toast-notification');
            const messageElement = notification.querySelector('.toast-message');
            expect(messageElement.textContent).toContain(message);
        });

        it('should create warning notification', () => {
            errorHandler.displayErrorNotification('Warning', 0, 'warning');
            const notification = document.querySelector('.toast-notification');
            expect(notification).toHaveClass('toast-warning');
        });

        it('should create success notification', () => {
            errorHandler.displayErrorNotification('Success', 0, 'success');
            const notification = document.querySelector('.toast-notification');
            expect(notification).toHaveClass('toast-success');
        });

        it('should create info notification', () => {
            errorHandler.displayErrorNotification('Info', 0, 'info');
            const notification = document.querySelector('.toast-notification');
            expect(notification).toHaveClass('toast-info');
        });

        it('should auto-dismiss after specified duration', async () => {
            jest.useFakeTimers();

            const message = 'Test message';
            const duration = 5000;

            errorHandler.displayErrorNotification(message, duration, 'error');

            // Advance timers
            jest.advanceTimersByTime(duration);

            // Give animation time to complete
            jest.advanceTimersByTime(300);

            const notification = document.querySelector('.toast-notification');
            expect(notification).toBeFalsy();

            jest.useRealTimers();
        });

        it('should not auto-dismiss if duration is 0', async () => {
            jest.useFakeTimers();

            const message = 'Test message';
            errorHandler.displayErrorNotification(message, 0, 'error');

            // Advance timers for a long time
            jest.advanceTimersByTime(10000);

            // Notification should still exist
            const notification = document.querySelector('.toast-notification');
            expect(notification).toBeTruthy();

            jest.useRealTimers();
        });

        it('should return notification ID', () => {
            const notificationId = errorHandler.displayErrorNotification('Test', 0, 'error');
            expect(typeof notificationId).toBe('string');
            expect(notificationId).toMatch(/^notification-/);
        });

        it('should escape HTML in message', () => {
            const maliciousMessage = '<script>alert("xss")</script>';
            errorHandler.displayErrorNotification(maliciousMessage, 0, 'error');

            const messageElement = document.querySelector('.toast-message');
            expect(messageElement.innerHTML).not.toContain('<script>');
            expect(messageElement.textContent).toContain('<script>');
        });
    });

    describe('dismissNotification', () => {
        it('should dismiss notification by ID', async () => {
            const notificationId = errorHandler.displayErrorNotification('Test', 0, 'error');

            jest.useFakeTimers();
            errorHandler.dismissNotification(notificationId);
            jest.advanceTimersByTime(300);
            jest.useRealTimers();

            const notification = document.querySelector('.toast-notification');
            expect(notification).toBeFalsy();
        });

        it('should handle close button click', async () => {
            errorHandler.displayErrorNotification('Test', 0, 'error');

            const closeButton = document.querySelector('.toast-close');
            expect(closeButton).toBeTruthy();

            jest.useFakeTimers();
            closeButton.click();
            jest.advanceTimersByTime(300);
            jest.useRealTimers();

            const notification = document.querySelector('.toast-notification');
            expect(notification).toBeFalsy();
        });
    });

    describe('clearAllNotifications', () => {
        it('should clear all active notifications', async () => {
            errorHandler.displayErrorNotification('Test 1', 0, 'error');
            errorHandler.displayErrorNotification('Test 2', 0, 'warning');
            errorHandler.displayErrorNotification('Test 3', 0, 'success');

            jest.useFakeTimers();
            errorHandler.clearAllNotifications();
            jest.advanceTimersByTime(300);
            jest.useRealTimers();

            const notifications = document.querySelectorAll('.toast-notification');
            expect(notifications.length).toBe(0);
        });
    });

    describe('escapeHtml', () => {
        it('should escape ampersand', () => {
            const result = errorHandler.escapeHtml('Tom & Jerry');
            expect(result).toBe('Tom &amp; Jerry');
        });

        it('should escape less than', () => {
            const result = errorHandler.escapeHtml('a < b');
            expect(result).toBe('a &lt; b');
        });

        it('should escape greater than', () => {
            const result = errorHandler.escapeHtml('a > b');
            expect(result).toBe('a &gt; b');
        });

        it('should escape double quotes', () => {
            const result = errorHandler.escapeHtml('He said "hello"');
            expect(result).toBe('He said &quot;hello&quot;');
        });

        it('should escape single quotes', () => {
            const result = errorHandler.escapeHtml("It's");
            expect(result).toBe('It&#039;s');
        });

        it('should escape all special characters', () => {
            const result = errorHandler.escapeHtml('<script>alert("xss")</script>');
            expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
        });
    });
});
