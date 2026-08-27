#!/usr/bin/env node

/**
 * ePay CRM Build Script
 * Handles environment configuration and build validation for production and Vercel deployments.
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';

console.log(`\n[Build] Starting build for ${environment} environment\n`);

// Required Firebase configuration variables
const requiredVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
];

// Fallback configuration if env variables are missing during deployment
const fallbackConfig = {
    FIREBASE_API_KEY: 'your_firebase_api_key',
    FIREBASE_AUTH_DOMAIN: 'your_project_id.firebaseapp.com',
    FIREBASE_PROJECT_ID: 'your_project_id',
    FIREBASE_STORAGE_BUCKET: 'your_project_id.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: 'your_sender_id',
    FIREBASE_APP_ID: 'your_app_id',
    FIREBASE_MEASUREMENT_ID: 'G-your_analytics_id',
    FIREBASE_DATABASE_URL: 'https://your_project_id-default-rtdb.asia-southeast1.firebasedatabase.app'
};

const missing = requiredVars.filter(v => !process.env[v]);

if (missing.length > 0) {
    console.warn(`[Build] ⚠ Warning: Missing Firebase configuration in environment: ${missing.join(', ')}`);
    console.warn(`[Build] Using fallback configuration. Set environment variables in your deployment settings for production.`);
} else {
    console.log(`[Build] ✓ Firebase configuration validated`);
}

// Create build output directory if it doesn't exist
const rootDir = path.join(__dirname, '..');
const buildDir = path.join(rootDir, 'dist');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
    console.log(`[Build] ✓ Created build directory: ${buildDir}`);
}

// Prepare Firebase Config object
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || fallbackConfig.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || fallbackConfig.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID || fallbackConfig.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || fallbackConfig.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID || fallbackConfig.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || fallbackConfig.FIREBASE_MEASUREMENT_ID,
    databaseUrl: process.env.FIREBASE_DATABASE_URL || fallbackConfig.FIREBASE_DATABASE_URL
};

// Generate Firebase config injection file
const configFile = path.join(buildDir, 'firebase-config-inject.js');
const configInjectionCode = `// Auto-generated Firebase configuration injection
// Generated at: ${new Date().toISOString()}
// Environment: ${environment}

window.__ENV__ = '${environment}';
window.__FIREBASE_CONFIG__ = ${JSON.stringify(firebaseConfig)};

console.log('[Firebase Config Injection] Configuration injected for ${environment} environment');
console.log('[Firebase Config Injection] Project: ${firebaseConfig.projectId}');
`;

fs.writeFileSync(configFile, configInjectionCode);
console.log(`[Build] ✓ Generated configuration injection file: ${configFile}`);

// Generate build manifest
const manifestFile = path.join(buildDir, 'BUILD_MANIFEST.json');
const manifest = {
    buildTime: new Date().toISOString(),
    environment,
    firebaseProject: firebaseConfig.projectId,
    firebaseAuth: firebaseConfig.authDomain,
    version: require('../package.json').version,
    nodeVersion: process.version
};

fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
console.log(`[Build] ✓ Generated build manifest: ${manifestFile}`);

// Helper function to recursively copy directories
function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules' && entry.name !== 'dist' && !entry.name.startsWith('.')) {
                copyDirSync(srcPath, destPath);
            }
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy root static files & asset folders to dist directory
const ignoredNames = new Set(['node_modules', 'dist', '.git', '.vs', '.vscode', '.env', '.env.local', 'scripts']);

const entries = fs.readdirSync(rootDir, { withFileTypes: true });
let copiedCount = 0;

for (const entry of entries) {
    if (ignoredNames.has(entry.name) || entry.name.startsWith('.')) continue;

    const srcPath = path.join(rootDir, entry.name);
    const destPath = path.join(buildDir, entry.name);

    if (entry.isDirectory()) {
        copyDirSync(srcPath, destPath);
        console.log(`[Build] ✓ Copied directory: ${entry.name}`);
    } else if (
        entry.name.endsWith('.html') ||
        entry.name.endsWith('.js') ||
        entry.name.endsWith('.css') ||
        entry.name.endsWith('.json') ||
        entry.name.endsWith('.png') ||
        entry.name.endsWith('.jpg') ||
        entry.name.endsWith('.svg') ||
        entry.name.endsWith('.ico') ||
        entry.name.endsWith('.txt')
    ) {
        fs.copyFileSync(srcPath, destPath);
        copiedCount++;
    }
}

console.log(`[Build] ✓ Copied ${copiedCount} root static files to build directory`);

// Create .env.production file with build configuration
const envProdFile = path.join(buildDir, '.env.production');
const envContent = `# Build-time Firebase configuration (${environment})
NODE_ENV=${environment}
FIREBASE_API_KEY=${firebaseConfig.apiKey}
FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
FIREBASE_APP_ID=${firebaseConfig.appId}
FIREBASE_MEASUREMENT_ID=${firebaseConfig.measurementId}
FIREBASE_DATABASE_URL=${firebaseConfig.databaseUrl}
`;

fs.writeFileSync(envProdFile, envContent);
console.log(`[Build] ✓ Generated build environment file: .env.production`);

// Build summary
console.log(`\n[Build] ✓ Build completed successfully`);
console.log(`[Build] Environment: ${environment}`);
console.log(`[Build] Output directory: ${buildDir}`);
console.log(`[Build] Firebase Project: ${firebaseConfig.projectId}\n`);

process.exit(0);