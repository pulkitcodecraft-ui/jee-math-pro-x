/**
 * Firestore operations for a user's AI Explain history.
 *
 * Documents live at `users/{userId}/history/{questionId}`. Every successful
 * solve is saved here so a logged-in user can revisit or re-run past
 * questions. Files attached to a question are deleted from Storage when the
 * history item is removed.
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { isFirebaseConfigured } from '@/lib/auth/authService';
import { deleteQuestionFile } from './storageService';
import type { HistoryItem, HistoryAttachment } from '@/types/history';

function historyCollection(userId: string) {
  return collection(db, 'users', userId, 'history');
}

function toDate(v: unknown): Date {
  return v && typeof (v as { toDate?: () => Date }).toDate === 'function'
    ? (v as { toDate: () => Date }).toDate()
    : new Date();
}

function mapDocToHistory(id: string, data: Record<string, unknown>): HistoryItem {
  return {
    id,
    question: String(data.question ?? ''),
    solution: data.solution ? String(data.solution) : null,
    attachment: (data.attachment as HistoryAttachment | null) ?? null,
    topic: data.topic ? String(data.topic) : null,
    difficulty: data.difficulty ? String(data.difficulty) : null,
    method: data.method ? String(data.method) : null,
    explanation: data.explanation ?? null,
    createdAt: toDate(data.createdAt),
  };
}

export interface SaveHistoryPayload {
  userId: string;
  questionId: string;
  question: string;
  solution?: string | null;
  attachment?: HistoryAttachment | null;
  topic?: string | null;
  difficulty?: string | null;
  method?: string | null;
  explanation: unknown;
}

/** Create or update a history document (id == questionId). */
export async function saveHistory(payload: SaveHistoryPayload): Promise<void> {
  if (!isFirebaseConfigured) return;
  const refDoc = doc(db, 'users', payload.userId, 'history', payload.questionId);
  await setDoc(refDoc, {
    question: payload.question,
    solution: payload.solution ?? null,
    attachment: payload.attachment ?? null,
    topic: payload.topic ?? null,
    difficulty: payload.difficulty ?? null,
    method: payload.method ?? null,
    explanation: payload.explanation ?? null,
    createdAt: serverTimestamp(),
  });
}

/** List a user's history, newest first. */
export async function getHistory(userId: string): Promise<HistoryItem[]> {
  if (!isFirebaseConfigured) return [];
  const q = query(historyCollection(userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDocToHistory(d.id, d.data()));
}

/** Fetch a single history item. */
export async function getHistoryItem(
  userId: string,
  questionId: string
): Promise<HistoryItem | null> {
  if (!isFirebaseConfigured) return null;
  const snap = await getDoc(doc(db, 'users', userId, 'history', questionId));
  if (!snap.exists()) return null;
  return mapDocToHistory(snap.id, snap.data());
}

/** Delete a history item and its attached file (if any). */
export async function deleteHistory(
  userId: string,
  item: Pick<HistoryItem, 'id' | 'attachment'>
): Promise<void> {
  if (!isFirebaseConfigured) return;
  if (item.attachment?.path) {
    await deleteQuestionFile(item.attachment.path);
  }
  await deleteDoc(doc(db, 'users', userId, 'history', item.id));
}
