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
  sendEmailVerification,
  reload,
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

/**
 * Where Firebase sends the user after they click the verification link.
 * The link opens Firebase's "email verified" handler, which then shows a
 * Continue button back to this URL. The domain must be listed under
 * Authentication → Settings → Authorized domains in the Firebase console.
 */
function verificationSettings() {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? '';
  return {
    url: `${origin}/login?verified=1`,
    handleCodeInApp: false,
  };
}

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

/** Result returned after a successful sign-up. */
export interface SignUpResult {
  /** Always true for email/password sign-up — the user must verify before login. */
  needsVerification: boolean;
  email: string;
}

/** Build an Error carrying a Firebase-style code so friendlyAuthError can map it. */
function codedError(code: string, message: string): Error {
  const err = new Error(message) as Error & { code: string };
  err.code = code;
  return err;
}

/**
 * Register a new email/password account, create its profile document, send a
 * verification email, then sign the user back out.
 *
 * We intentionally do NOT keep the user signed in: they must click the link in
 * their inbox first. This is what guarantees the email address actually exists —
 * a fake/non-existent address never receives the link, so the account can never
 * be used to log in.
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<SignUpResult> {
  if (!isFirebaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);

  let cred;
  try {
    cred = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    // If the email already exists but was never verified (e.g. an abandoned
    // earlier sign-up), don't dead-end the user — quietly resend the link and
    // send them to the verify screen, provided the password matches.
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      String((err as { code: unknown }).code) === 'auth/email-already-in-use'
    ) {
      try {
        const existing = await signInWithEmailAndPassword(auth, email, password);
        await reload(existing.user);
        if (existing.user.emailVerified) {
          // Genuinely registered & verified — they should just log in.
          await firebaseSignOut(auth);
          throw codedError(
            'auth/email-already-in-use',
            'An account already exists with that email. Try logging in instead.'
          );
        }
        // Exists but unverified: resend and route to the verify panel.
        await sendEmailVerification(existing.user, verificationSettings());
        await firebaseSignOut(auth);
        return { needsVerification: true, email };
      } catch (innerErr) {
        // Wrong password (or some other issue) — surface the original message.
        if (
          typeof innerErr === 'object' &&
          innerErr !== null &&
          'code' in innerErr &&
          String((innerErr as { code: unknown }).code) === 'auth/email-already-in-use'
        ) {
          throw innerErr;
        }
        throw err;
      }
    }
    throw err;
  }

  await updateProfile(cred.user, { displayName });
  await createUserProfile(cred.user, displayName);

  // Send the confirmation link, then sign out until they verify.
  await sendEmailVerification(cred.user, verificationSettings());
  await firebaseSignOut(auth);

  return { needsVerification: true, email };
}

/**
 * Sign in with an existing email/password account.
 * Rejects (and signs back out) if the email has not been verified yet.
 */
export async function signIn(email: string, password: string): Promise<void> {
  if (!isFirebaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);
  const cred = await signInWithEmailAndPassword(auth, email, password);

  // Make sure we have the freshest verification status.
  await reload(cred.user);

  if (!cred.user.emailVerified) {
    await firebaseSignOut(auth);
    throw codedError(
      'auth/email-not-verified',
      'Please verify your email before logging in.'
    );
  }
}

/**
 * Re-send the verification email for an account that exists but is unverified.
 * Signs in temporarily to obtain the user, sends the link, then signs out.
 */
export async function resendVerificationEmail(
  email: string,
  password: string
): Promise<void> {
  if (!isFirebaseConfigured) throw new Error(NOT_CONFIGURED_MESSAGE);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await reload(cred.user);

  if (cred.user.emailVerified) {
    // Already verified — nothing to resend.
    await firebaseSignOut(auth);
    return;
  }

  await sendEmailVerification(cred.user, verificationSettings());
  await firebaseSignOut(auth);
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
    case 'auth/email-not-verified':
      return 'Please verify your email first. Check your inbox for the confirmation link.';
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
