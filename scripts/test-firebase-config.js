#!/usr/bin/env node

/**
 * Firebase Configuration Validation Script
 * Tests environment setup and configuration loading
 * Usage: npm run test:firebase-config
 */

require('dotenv').config();

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset}  ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset}  ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset}  ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset}  ${msg}`),
    section: (msg) => console.log(`\n${colors.blue}${msg}${colors.reset}`),
    plain: (msg) => console.log(msg)
};

const requiredFields = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
];

const optionalFields = [
    'FIREBASE_MEASUREMENT_ID'
];

const allFields = [...requiredFields, ...optionalFields];

let hasErrors = false;

// Test 1: Environment Variables Loading
log.section('Test 1: Environment Variables Loading');

const loadedVars = {};
allFields.forEach(field => {
    if (process.env[field]) {
        loadedVars[field] = process.env[field];
    }
});

if (Object.keys(loadedVars).length > 0) {
    log.success(`Loaded ${Object.keys(loadedVars).length} environment variables`);
} else {
    log.error('No Firebase environment variables loaded');
    log.info('Did you run: npm run env:setup');
    hasErrors = true;
}

// Test 2: Required Fields Check
log.section('Test 2: Required Fields Validation');

const missingRequired = requiredFields.filter(field => !process.env[field]);
const missingOptional = optionalFields.filter(field => !process.env[field]);

if (missingRequired.length === 0) {
    log.success('All required fields are set');
} else {
    log.error(`Missing required fields: ${missingRequired.join(', ')}`);
    hasErrors = true;
}

if (missingOptional.length === 0) {
    log.success('All optional fields are set');
} else {
    log.warn(`Missing optional fields: ${missingOptional.join(', ')}`);
}

// Test 3: Field Value Validation
log.section('Test 3: Field Value Validation');

const fieldValidation = {};
let validFieldCount = 0;

requiredFields.forEach(field => {
    const value = process.env[field];
    
    if (!value) {
        fieldValidation[field] = 'missing';
    } else if (value.includes('_placeholder') || value.startsWith('YOUR_')) {
        fieldValidation[field] = 'placeholder';
        log.warn(`${field}: Using placeholder value`);
    } else if (value.length < 5) {
        fieldValidation[field] = 'invalid_length';
        log.error(`${field}: Value too short (${value.length} chars)`);
        hasErrors = true;
    } else {
        fieldValidation[field] = 'valid';
        validFieldCount++;
    }
});

log.info(`Valid fields: ${validFieldCount}/${requiredFields.length}`);

// Test 4: Format Validation
log.section('Test 4: Firebase Configuration Format Validation');

const formatChecks = {
    authDomain: {
        check: () => {
            const domain = process.env.FIREBASE_AUTH_DOMAIN || '';
            return domain.endsWith('.firebaseapp.com');
        },
        message: 'Auth domain should end with .firebaseapp.com'
    },
    projectId: {
        check: () => {
            const id = process.env.FIREBASE_PROJECT_ID || '';
            return /^[a-z0-9-]+$/.test(id);
        },
        message: 'Project ID should contain only lowercase letters, numbers, and hyphens'
    },
    storageBucket: {
        check: () => {
            const bucket = process.env.FIREBASE_STORAGE_BUCKET || '';
            return bucket.endsWith('.appspot.com');
        },
        message: 'Storage bucket should end with .appspot.com'
    },
    messagingSenderId: {
        check: () => {
            const id = process.env.FIREBASE_MESSAGING_SENDER_ID || '';
            return /^\d+$/.test(id);
        },
        message: 'Messaging sender ID should contain only digits'
    }
};

Object.entries(formatChecks).forEach(([field, { check, message }]) => {
    if (process.env[field]) {
        if (check()) {
            log.success(`${field}: Correct format`);
        } else {
            log.error(`${field}: ${message}`);
            hasErrors = true;
        }
    }
});

// Test 5: Configuration Object
log.section('Test 5: Firebase Configuration Object');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || ''
};

log.info('Configuration object:');
log.plain(JSON.stringify(firebaseConfig, null, 2));

// Test 6: Environment Name
log.section('Test 6: Environment Configuration');

const environment = process.env.NODE_ENV || 'development';
log.success(`Current environment: ${environment}`);

const environmentConfigs = {
    development: 'epay-crm-dev',
    staging: 'epay-crm-staging',
    production: 'epay-crm-prod'
};

const projectPrefix = environmentConfigs[environment] || 'epay-crm';
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID.includes(projectPrefix)) {
    log.success(`Project ID matches ${environment} environment`);
} else if (process.env.FIREBASE_PROJECT_ID) {
    log.warn(`Project ID might not match expected ${environment} environment pattern (expected to contain: ${projectPrefix})`);
}

// Test 7: .env File Check
log.section('Test 7: Configuration File Check');

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (fs.existsSync(envPath)) {
    log.success('.env file exists');
} else {
    log.error('.env file not found');
    log.info('Run: npm run env:setup');
    hasErrors = true;
}

if (fs.existsSync(envExamplePath)) {
    log.success('.env.example file exists');
} else {
    log.warn('.env.example file not found (needed as template)');
}

// Test 8: Summary and Recommendations
log.section('Test 8: Summary and Recommendations');

if (!hasErrors && missingRequired.length === 0 && missingOptional.length === 0) {
    log.success('✓ Firebase configuration is valid and complete!');
    log.success('Ready to run: npm start');
} else if (!hasErrors && missingRequired.length === 0) {
    log.success('✓ Firebase configuration is valid (missing optional fields)');
    log.warn('Some optional features may be limited');
    log.success('Ready to run: npm start');
} else {
    log.error('✗ Firebase configuration has errors or is incomplete');
    log.info('To fix:');
    
    if (missingRequired.length > 0) {
        log.plain(`  1. Run: npm run env:setup`);
        log.plain(`  2. Edit .env and add: ${missingRequired.join(', ')}`);
        log.plain(`  3. Get credentials from: https://console.firebase.google.com`);
    }
    
    if (Object.values(fieldValidation).some(v => v === 'placeholder')) {
        log.plain(`  4. Replace placeholder values with real Firebase credentials`);
    }
    
    process.exit(1);
}

// Final status
log.section('Configuration Status');

const summary = {
    environment,
    requiredFields: `${requiredFields.length - missingRequired.length}/${requiredFields.length}`,
    optionalFields: `${optionalFields.length - missingOptional.length}/${optionalFields.length}`,
    hasErrors: hasErrors ? 'Yes' : 'No',
    ready: !hasErrors && missingRequired.length === 0 ? 'Yes' : 'No'
};

Object.entries(summary).forEach(([key, value]) => {
    log.info(`${key}: ${value}`);
});

// Exit with appropriate code
process.exit(hasErrors ? 1 : 0);
