/**
 * Barrel export for the auth layer.
 */

export { AuthProvider, useAuth } from './AuthContext';
export {
  isFirebaseConfigured,
  friendlyAuthError,
  getUserProfile,
  signInWithGoogle,
  resendVerificationEmail,
} from './authService';
export type { SignUpResult } from './authService';
