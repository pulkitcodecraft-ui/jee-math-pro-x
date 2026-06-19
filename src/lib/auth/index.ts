/**
 * Barrel export for the auth layer.
 */

export { AuthProvider, useAuth } from './AuthContext';
export {
  isFirebaseConfigured,
  friendlyAuthError,
  getUserProfile,
  signInWithGoogle,
} from './authService';
