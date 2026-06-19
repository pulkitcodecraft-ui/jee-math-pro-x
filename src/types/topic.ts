/**
 * Firestore data model for Topics.
 *
 * Each topic belongs to a subject (v1 = Mathematics only).
 * The `subject` field is included to make adding Physics/Chemistry
 * straightforward in a future version.
 */

export type Subject = 'Mathematics' | 'Physics' | 'Chemistry';

export interface Topic {
  id: string;
  name: string;
  subject: Subject;
  subtopics: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
