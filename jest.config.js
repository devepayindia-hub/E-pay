/**
 * Jest Configuration
 * Configures Jest test runner for the ePay CRM project
 */

module.exports = {
    // Test environment
    testEnvironment: 'jsdom',

    // Collect coverage information
    collectCoverageFrom: [
        'services/**/*.js',
        '!services/**/*.test.js',
        '!services/**/*.mock.js',
        '**/*.js',
        '!node_modules/**',
        '!dist/**',
        '!scripts/**',
        '!**/*.config.js'
    ],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },

    // File extensions
    moduleFileExtensions: ['js', 'jsx', 'json'],

    // Test match patterns
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    // Module name mapper (for static assets, CSS, etc.)
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
    },

    // Transform files
    transform: {
        '^.+\\.js$': 'babel-jest'
    },

    // Ignore patterns
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/build/'
    ],

    // Watch plugins
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname'
    ],

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,

    // Max workers for parallel testing
    maxWorkers: '50%',

    // Timeout for tests
    testTimeout: 10000
};
