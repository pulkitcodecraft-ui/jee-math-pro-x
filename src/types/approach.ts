/**
 * Firestore data model for Approaches.
 *
 * An approach is a solution method for a question. It can be:
 * - "official"  — authored by admins, always visible
 * - "pending"   — submitted by a student, awaiting review
 * - "approved"  — reviewed and accepted by an admin, publicly visible
 * - "rejected"  — reviewed and rejected, hidden from public view
 */

export type ApproachStatus = 'official' | 'pending' | 'approved' | 'rejected';

export interface Approach {
  id: string;
  questionId: string;
  label: string;
  content: string;
  status: ApproachStatus;
  /** UID of the user who submitted this approach */
  submittedBy: string;
  /** Optional image URL (Firebase Storage) for handwritten/visual approaches */
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
