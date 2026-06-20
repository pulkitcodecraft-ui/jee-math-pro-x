/**
 * Firestore data model for a user's saved AI Explain history.
 * Stored at: users/{userId}/history/{questionId}
 */

export interface HistoryAttachment {
  /** Storage download URL */
  url: string;
  /** Stored file name (used to delete from Storage) */
  name: string;
  /** MIME type, e.g. "image/png" or "application/pdf" */
  fileType: string;
  /** Full Storage path, e.g. uploads/{uid}/{qid}/{name} */
  path: string;
}

export interface HistoryItem {
  /** Document id (also the questionId used in the Storage path) */
  id: string;
  question: string;
  solution: string | null;
  /** Single attachment for v1 (null when none) */
  attachment: HistoryAttachment | null;
  /** Active syllabus topic at solve time, if any */
  topic: string | null;
  /** Difficulty from the AI result */
  difficulty: string | null;
  /** Recommended method name from the AI result */
  method: string | null;
  /** Full structured AI explanation (serialized SolveResult) */
  explanation: unknown;
  /** Creation time (resolved to a Date on read) */
  createdAt: Date;
}
