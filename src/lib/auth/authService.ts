/**
 * Authentication service — thin wrapper around Firebase Auth + Firestore.
 *
 * Handles email/password sign-up, sign-in, sign-out, and the matching
 * user profile document in Firestore (with a role: "student" | "admin").
 *
 * If Firebase env vars are not yet configured, `isFirebaseConfigured` is
 * false and the auth UI surfaces a friendly message instead of crashing.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, UserRole } from '@/types/user';

/**
 * True only when a real (non-placeholder) Firebase API key is present.
 * Used to gate auth actions so the app works in "logged-out" demo mode
 * before the real keys are supplied.
 */
export const isFirebaseConfigured: boolean = (() => {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return Boolean(key) && key !== 'your-api-key-here';
})();

const NOT_CONFIGURED_MESSAGE =
  'Firebase is not configured yet. Add your Firebase keys to .env.local to enable sign in.';

/** Shape stored in Firestore (timestamps are server-generated). */
interface UserDoc {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

function mapDocToUser(data: Record<string, unknown>): User {
  const toDate = (v: unknown): Date =>
    v && typeof (v as { toDate?: () => Date }).toDate === 'function'
      ? (v as { toDate: () => Date }).toDate()
      : new Date();

  return {
    id: String(data.id ?? ''),
    email: String(data.email ?? ''),
    displayName: String(data.displayName ?? ''),
    role: (data.role as UserRole) ?? 'student',
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

/** Fetch the Firestore profile document for a given uid. */
export async function getUserProfile(uid: string): Promise<User | null> {
  if (!isFirebaseConfigured) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return mapDocToUser(snap.data());
}

/** Create the Firestore profile document for a newly registered user. */
async function createUserProfile(
  firebaseUser: FirebaseUser,
  displayName: string
): Promise<void> {
  const profile: UserDoc = {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    displayName,
    role: 'student', // every new account defaults to student
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Register a new email/password account and its profile document. */
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  if (!isFirebaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await createUserProfile(cred.user, displayName);

  const profile = await getUserProfile(cred.user.uid);
  if (profile) return profile;

  // Fallback if the read-after-write hasn't propagated
  return {
    id: cred.user.uid,
    email,
    displayName,
    role: 'student',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/** Sign in with an existing email/password account. */
export async function signIn(email: string, password: string): Promise<void> {
  if (!isFirebaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);
  await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in (or register) with Google popup.
 * Creates a Firestore profile on first sign-in.
 */
export async function signInWithGoogle(): Promise<void> {
  if (!isFirebaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);

  // Create profile doc only if it doesn't exist yet (first Google sign-in)
  const existing = await getUserProfile(cred.user.uid);
  if (!existing) {
    await setDoc(doc(db, 'users', cred.user.uid), {
      id: cred.user.uid,
      email: cred.user.email ?? '',
      displayName: cred.user.displayName ?? 'Student',
      role: 'student',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

/** Sign the current user out. */
export async function signOut(): Promise<void> {
  if (!isFirebaseConfigured) return;
  await firebaseSignOut(auth);
}

/**
 * Translates Firebase auth error codes into human-friendly messages.
 */
export function friendlyAuthError(err: unknown): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code: unknown }).code)
      : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/email-already-in-use':
      return 'An account already exists with that email. Try logging in instead.';
    case 'auth/weak-password':
      return 'Password is too weak — use at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method isn\u2019t enabled yet. In the Firebase console, go to Authentication \u2192 Sign-in method and enable Email/Password (and Google).';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'The sign-in popup was closed before completing. Please try again.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Allow popups for this site and try again.';
    case 'auth/unauthorized-domain':
      return 'This domain isn\u2019t authorized for sign-in. Add it under Authentication \u2192 Settings \u2192 Authorized domains in Firebase.';
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return NOT_CONFIGURED_MESSAGE;
    default:
      if (err instanceof Error && err.message) return err.message;
      return 'Something went wrong. Please try again.';
  }
}
