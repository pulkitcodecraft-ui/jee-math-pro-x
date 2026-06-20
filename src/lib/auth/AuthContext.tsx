'use client';

/**
 * Auth state management via React Context.
 *
 * Wraps the app, subscribes to Firebase Auth state, and loads the matching
 * Firestore profile (with role). Exposes a `useAuth()` hook for components.
 *
 * Degrades gracefully: if Firebase is not configured, it stays in a
 * logged-out, non-loading state so the rest of the app works normally.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/types/user';
import {
  getUserProfile,
  signIn as svcSignIn,
  signUp as svcSignUp,
  signOut as svcSignOut,
  signInWithGoogle as svcSignInWithGoogle,
  resendVerificationEmail as svcResendVerification,
  isFirebaseConfigured,
  type SignUpResult,
} from './authService';

interface AuthContextValue {
  /** Raw Firebase auth user, or null when logged out */
  firebaseUser: FirebaseUser | null;
  /** Firestore profile (with role), or null when logged out */
  profile: User | null;
  /** True while the initial auth state is being resolved */
  loading: boolean;
  /** Whether Firebase keys are present */
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<SignUpResult>;
  signInWithGoogle: () => Promise<void>;
  resendVerification: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      // Block email/password accounts that haven't verified their email yet.
      // (Google accounts always come back as verified.) This also kicks out any
      // stale, previously-created unverified sessions.
      if (fbUser && !fbUser.emailVerified) {
        const isPasswordUser = fbUser.providerData.some(
          (p) => p.providerId === 'password'
        );
        if (isPasswordUser) {
          await svcSignOut().catch(() => {});
          setFirebaseUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
      }

      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const p = await getUserProfile(fbUser.uid);
          setProfile(p);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await svcSignIn(email, password);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      // Sign-up sends a verification email and signs the user back out, so we
      // don't set a profile here — they log in after verifying.
      return svcSignUp(email, password, displayName);
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    await svcSignInWithGoogle();
  }, []);

  const resendVerification = useCallback(
    async (email: string, password: string) => {
      await svcResendVerification(email, password);
    },
    []
  );

  const signOut = useCallback(async () => {
    await svcSignOut();
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        loading,
        isConfigured: isFirebaseConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        resendVerification,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
