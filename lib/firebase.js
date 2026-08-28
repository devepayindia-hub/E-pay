import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const getEnvVar = (nextKey, coreKey, fallback) => {
  const val = process.env[nextKey] || process.env[coreKey];
  if (val && typeof val === 'string' && !val.includes('your_') && !val.includes('_here')) {
    return val;
  }
  return fallback;
};

export const firebaseConfig = {
  apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY', 'FIREBASE_API_KEY', 'AIzaSyCa9Ay3kJxJ_wNQjwLpTEYk_gHoGkk077U'),
  authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN', 'epay-crm.firebaseapp.com'),
  projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID', 'epay-crm-default'),
  storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET', 'epay-crm-default.appspot.com'),
  messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_MESSAGING_SENDER_ID', '100000000000'),
  appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID', 'FIREBASE_APP_ID', '1:100000000000:web:abcdef123456')
};

let app, auth, db;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('Firebase init fallback:', err?.message || err);
}

export { app, auth, db };
