/**
 * Firestore data model for Users.
 *
 * Each user has a role: "student" (default) or "admin".
 * The role determines access to the admin review dashboard (Phase 7).
 */

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
