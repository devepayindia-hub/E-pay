/**
 * Jest Setup File
 * Configures the test environment and global test utilities
 */

// Disable console methods in tests to reduce noise
global.console = {
    ...console,
    // Keep error and warn for debugging
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn()
};

// Mock Firebase SDK if not available in test environment
global.firebase = global.firebase || {
    initializeApp: jest.fn(),
    apps: [],
    auth: jest.fn(() => ({
        useDeviceLanguage: jest.fn(),
        signInWithEmailAndPassword: jest.fn(),
        signOut: jest.fn(),
        onAuthStateChanged: jest.fn(),
        currentUser: null
    })),
    firestore: jest.fn(() => ({
        settings: jest.fn(),
        enablePersistence: jest.fn().mockResolvedValue(undefined),
        collection: jest.fn(),
        doc: jest.fn()
    })),
    database: jest.fn(() => ({
        ref: jest.fn(),
        goOnline: jest.fn(),
        goOffline: jest.fn()
    })),
    crashlytics: jest.fn(() => ({
        recordError: jest.fn(),
        setCustomKey: jest.fn(),
        log: jest.fn()
    }))
};

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
global.sessionStorage = sessionStorageMock;

// Mock BroadcastChannel
global.BroadcastChannel = jest.fn((channel) => ({
    name: channel,
    postMessage: jest.fn(),
    onmessage: null,
    onmessageerror: null,
    close: jest.fn()
}));

// Mock navigator
Object.defineProperty(global, 'navigator', {
    value: {
        userAgent: 'Mozilla/5.0 (Test) AppleWebKit/537.36'
    },
    writable: true
});

// Mock window.location
delete window.location;
window.location = {
    href: 'http://localhost/test',
    hostname: 'localhost',
    pathname: '/test',
    search: '',
    hash: '',
    protocol: 'http:',
    port: '',
    reload: jest.fn(),
    replace: jest.fn()
};

// Mock fetch API
global.fetch = jest.fn();

// Mock CustomEvent if not available
if (typeof global.CustomEvent !== 'function') {
    global.CustomEvent = class CustomEvent extends Event {
        constructor(event, params) {
            super(event, params);
            this.detail = params && params.detail;
        }
    };
}

// Suppress act warnings in tests
const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('act') ||
                args[0].includes('not wrapped in act'))
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
});
