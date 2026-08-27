/**
 * Simple Unit Tests for ErrorHandlerService
 * Standalone tests without Jest dependency
 */

// Load the service
const ErrorHandlerService = require('./error-handler-service.js');

// Test utilities
let testCount = 0;
let passCount = 0;
let failCount = 0;

function test(description, fn) {
    testCount++;
    try {
        fn();
        passCount++;
        console.log(`✓ ${description}`);
    } catch (error) {
        failCount++;
        console.error(`✗ ${description}`);
        console.error(`  Error: ${error.message}`);
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected} but got ${actual}`);
    }
}

async function asyncTest(description, fn) {
    testCount++;
    try {
        await fn();
        passCount++;
        console.log(`✓ ${description}`);
    } catch (error) {
        failCount++;
        console.error(`✗ ${description}`);
        console.error(`  Error: ${error.message}`);
    }
}

// =============================================
// Test Suite
// =============================================

console.log('\n=== ErrorHandlerService Unit Tests ===\n');

// Tests: isRetriableError
console.log('--- isRetriableError ---');
const handler = new ErrorHandlerService();

test('should return true for network timeout error', () => {
    const error = { code: 'network-error', message: 'Network timeout' };
    assert(handler.isRetriableError(error) === true);
});

test('should return true for too-many-requests error', () => {
    const error = { code: 'auth/too-many-requests', message: 'Too many requests' };
    assert(handler.isRetriableError(error) === true);
});

test('should return true for service unavailable error', () => {
    const error = { code: 'service-unavailable', message: 'Service unavailable' };
    assert(handler.isRetriableError(error) === true);
});

test('should return true for timeout error', () => {
    const error = { code: 'timeout', message: 'Request timeout' };
    assert(handler.isRetriableError(error) === true);
});

test('should return false for permission-denied error', () => {
    const error = { code: 'permission-denied', message: 'Permission denied' };
    assert(handler.isRetriableError(error) === false);
});

test('should return false for invalid-argument error', () => {
    const error = { code: 'invalid-argument', message: 'Invalid argument' };
    assert(handler.isRetriableError(error) === false);
});

test('should return false for user-not-found error', () => {
    const error = { code: 'auth/user-not-found', message: 'User not found' };
    assert(handler.isRetriableError(error) === false);
});

// Tests: isPermanentError
console.log('\n--- isPermanentError ---');

test('should return true for permission-denied error', () => {
    const error = { code: 'permission-denied', message: 'Permission denied' };
    assert(handler.isPermanentError(error) === true);
});

test('should return true for user-not-found error', () => {
    const error = { code: 'auth/user-not-found', message: 'User not found' };
    assert(handler.isPermanentError(error) === true);
});

test('should return false for network error', () => {
    const error = { code: 'network-error', message: 'Network error' };
    assert(handler.isPermanentError(error) === false);
});

test('should return false for too-many-requests error', () => {
    const error = { code: 'auth/too-many-requests', message: 'Too many requests' };
    assert(handler.isPermanentError(error) === false);
});

// Tests: getErrorMessage
console.log('\n--- getErrorMessage ---');

test('should map auth/user-not-found to user-friendly message', () => {
    const error = { code: 'auth/user-not-found', message: 'User not found' };
    const message = handler.getErrorMessage(error);
    assert(message.includes('No user found'));
});

test('should map auth/wrong-password to user-friendly message', () => {
    const error = { code: 'auth/wrong-password', message: 'Wrong password' };
    const message = handler.getErrorMessage(error);
    assert(message.includes('Incorrect password'));
});

test('should map permission-denied to user-friendly message', () => {
    const error = { code: 'permission-denied', message: 'Permission denied' };
    const message = handler.getErrorMessage(error);
    assert(message.includes('do not have permission'));
});

test('should map network-error to user-friendly message', () => {
    const error = { code: 'network-error', message: 'Network error' };
    const message = handler.getErrorMessage(error);
    assert(message.includes('Network connection error'));
});

// Tests: Exponential Backoff Delays
console.log('\n--- calculateBackoffDelay ---');

test('should calculate correct backoff delay for retry 0', () => {
    const delay = handler.calculateBackoffDelay(0, 100, 10000);
    assertEqual(delay, 100, '100 * 2^0 should be 100');
});

test('should calculate correct backoff delay for retry 1', () => {
    const delay = handler.calculateBackoffDelay(1, 100, 10000);
    assertEqual(delay, 200, '100 * 2^1 should be 200');
});

test('should calculate correct backoff delay for retry 2', () => {
    const delay = handler.calculateBackoffDelay(2, 100, 10000);
    assertEqual(delay, 400, '100 * 2^2 should be 400');
});

test('should calculate correct backoff delay for retry 3', () => {
    const delay = handler.calculateBackoffDelay(3, 100, 10000);
    assertEqual(delay, 800, '100 * 2^3 should be 800');
});

test('should cap backoff delay at maxDelayMs', () => {
    const delay = handler.calculateBackoffDelay(10, 100, 10000);
    assert(delay <= 10000, `Delay ${delay} should not exceed maxDelayMs 10000`);
});

test('should follow pattern: 100ms → 200ms → 400ms → 800ms → 1600ms', () => {
    const delays = [];
    for (let i = 0; i < 5; i++) {
        delays.push(handler.calculateBackoffDelay(i, 100, 10000));
    }
    const expected = [100, 200, 400, 800, 1600];
    for (let i = 0; i < delays.length; i++) {
        assertEqual(delays[i], expected[i], `Delay at index ${i}`);
    }
});

// Tests: Error Normalization
console.log('\n--- normalizeError ---');

test('should normalize Firebase error objects', () => {
    const error = { code: 'auth/user-not-found', message: 'User not found' };
    const normalized = handler.normalizeError(error);
    assertEqual(normalized.code, 'auth/user-not-found');
    assertEqual(normalized.message, 'User not found');
});

test('should normalize standard Error objects', () => {
    const error = new Error('Something went wrong');
    const normalized = handler.normalizeError(error);
    assertEqual(normalized.code, 'Error');
    assertEqual(normalized.message, 'Something went wrong');
});

test('should normalize string errors', () => {
    const error = 'Simple error message';
    const normalized = handler.normalizeError(error);
    assertEqual(normalized.code, 'error');
    assertEqual(normalized.message, 'Simple error message');
});

test('should handle null/undefined errors', () => {
    const normalized1 = handler.normalizeError(null);
    const normalized2 = handler.normalizeError(undefined);
    assertEqual(normalized1.code, 'unknown-error');
    assertEqual(normalized2.code, 'unknown-error');
});

// Tests: Network Error Detection
console.log('\n--- isNetworkError ---');

test('should detect network-error as network error', () => {
    const error = { code: 'network-error', message: 'Network timeout' };
    assert(handler.isNetworkError(error) === true);
});

test('should detect timeout as network error', () => {
    const error = { code: 'timeout', message: 'Request timeout' };
    assert(handler.isNetworkError(error) === true);
});

test('should detect auth/network-request-failed as network error', () => {
    const error = { code: 'auth/network-request-failed', message: 'Network failed' };
    assert(handler.isNetworkError(error) === true);
});

test('should not detect permission-denied as network error', () => {
    const error = { code: 'permission-denied', message: 'Permission denied' };
    assert(handler.isNetworkError(error) === false);
});

// Tests: Retry Configuration
console.log('\n--- getRetryConfig ---');

test('should return config for login operation', () => {
    const config = handler.getRetryConfig('login');
    assert(config.maxRetries === 2);
    assert(config.initialDelayMs === 100);
});

test('should return config for firestore-read operation', () => {
    const config = handler.getRetryConfig('firestore-read');
    assert(config.maxRetries === 3);
    assert(config.initialDelayMs === 100);
});

test('should return config for firestore-write operation', () => {
    const config = handler.getRetryConfig('firestore-write');
    assert(config.maxRetries === 3);
});

test('should return default config for unknown operation', () => {
    const config = handler.getRetryConfig('unknown-operation');
    assert(config.maxRetries === 3);
    assert(config.initialDelayMs === 100);
});

// Tests: executeWithRetry (Async)
console.log('\n--- executeWithRetry ---');

async function runAsyncTests() {
    await asyncTest('should succeed on first attempt', async () => {
        let attemptCount = 0;
        const operation = async () => {
            attemptCount++;
            return 'success';
        };
        
        const result = await handler.executeWithRetry(operation);
        assertEqual(result, 'success');
        assertEqual(attemptCount, 1);
    });

    await asyncTest('should return value from successful operation', async () => {
        const expectedValue = { uid: '123', email: 'user@example.com' };
        const operation = async () => expectedValue;
        
        const result = await handler.executeWithRetry(operation);
        assert(result.uid === expectedValue.uid && result.email === expectedValue.email);
    });

    await asyncTest('should succeed after transient failure on second attempt', async () => {
        let attemptCount = 0;
        const operation = async () => {
            attemptCount++;
            if (attemptCount === 1) {
                throw { code: 'timeout', message: 'Timeout' };
            }
            return 'success';
        };
        
        const result = await handler.executeWithRetry(operation, {
            maxRetries: 2,
            initialDelayMs: 10
        });
        
        assertEqual(result, 'success');
        assertEqual(attemptCount, 2);
    });

    await asyncTest('should succeed after multiple transient failures', async () => {
        let attemptCount = 0;
        const operation = async () => {
            attemptCount++;
            if (attemptCount < 3) {
                throw { code: 'service-unavailable', message: 'Service unavailable' };
            }
            return 'success';
        };
        
        const result = await handler.executeWithRetry(operation, {
            maxRetries: 3,
            initialDelayMs: 10
        });
        
        assertEqual(result, 'success');
        assertEqual(attemptCount, 3);
    });

    await asyncTest('should fail with permanent error on first attempt', async () => {
        const operation = async () => {
            throw { code: 'permission-denied', message: 'Permission denied' };
        };
        
        try {
            await handler.executeWithRetry(operation, { maxRetries: 3 });
            throw new Error('Should have thrown');
        } catch (error) {
            assert(error.code === 'permission-denied');
        }
    });

    await asyncTest('should fail after exhausting retries for retriable error', async () => {
        let attemptCount = 0;
        const operation = async () => {
            attemptCount++;
            throw { code: 'timeout', message: 'Timeout' };
        };
        
        try {
            await handler.executeWithRetry(operation, {
                maxRetries: 2,
                initialDelayMs: 10
            });
            throw new Error('Should have thrown');
        } catch (error) {
            assertEqual(attemptCount, 3); // 1 initial + 2 retries
            assert(error.code === 'timeout');
        }
    });
}

// Tests: Error Handling
console.log('\n--- handleError ---');

test('should classify error with correct properties', () => {
    const error = { code: 'timeout', message: 'Timeout' };
    const context = { operationName: 'firestore-read' };
    
    const classified = handler.handleError(error, context);
    
    assertEqual(classified.code, 'timeout');
    assertEqual(classified.isRetriable, true);
    assertEqual(classified.isPermanent, false);
    assert(classified.userMessage);
});

// Run async tests then print results
runAsyncTests().then(() => {
    console.log('\n=== Test Results ===');
    console.log(`Total: ${testCount}`);
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);

    if (failCount === 0) {
        console.log('\n✓ All tests passed!');
        process.exit(0);
    } else {
        console.log(`\n✗ ${failCount} test(s) failed`);
        process.exit(1);
    }
});

