/**
 * Firebase app initialization.
 *
 * Reads configuration from environment variables defined in .env.local.
 * Exports initialized Firebase services: app, db (Firestore), auth, storage.
 *
 * See .env.local.example for the required environment variables.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Real keys present? When false (placeholder/no `.env.local`), we skip
 * `getAuth()` because it throws `auth/invalid-api-key` at module load,
 * which would crash the whole app. All auth usage is gated on this flag
 * (see `isFirebaseConfigured` in `lib/auth`), so the app runs fine in
 * logged-out browsing mode until real keys are supplied.
 */
const hasValidConfig =
  Boolean(firebaseConfig.apiKey) && firebaseConfig.apiKey !== 'your-api-key-here';

// Initialize Firebase — avoid duplicate initialization in dev (hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db: Firestore = getFirestore(app);
// `getAuth` is the only initializer that throws on an invalid key, so guard it.
const auth: Auth = hasValidConfig ? getAuth(app) : (null as unknown as Auth);
const storage: FirebaseStorage = getStorage(app);

export { app, db, auth, storage };
