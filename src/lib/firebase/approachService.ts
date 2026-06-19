/**
 * Firestore + Storage operations for community Approach submissions.
 *
 * - submitApproach          → writes a pending approach doc + uploads optional image
 * - getPendingApproaches    → admin: list all pending submissions
 * - getCommunityApproaches  → public: list approved community submissions for a question
 * - reviewApproach          → admin: approve or reject a pending submission
 *
 * When Firebase is not configured (placeholder/no real keys), every function
 * degrades gracefully — reads return empty arrays and writes throw a clear
 * error — so the app never hangs or crashes in logged-out browsing mode.
 */

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { isFirebaseConfigured } from '@/lib/auth/authService';
import type { Approach, ApproachStatus } from '@/types/approach';

const COLLECTION = 'approaches';

/** Convert a Firestore doc (with Timestamp fields) into a typed Approach. */
function mapDocToApproach(id: string, data: Record<string, unknown>): Approach {
  const toDate = (v: unknown): Date =>
    v && typeof (v as { toDate?: () => Date }).toDate === 'function'
      ? (v as { toDate: () => Date }).toDate()
      : new Date();

  return {
    id,
    questionId: String(data.questionId ?? ''),
    label: String(data.label ?? ''),
    content: String(data.content ?? ''),
    status: (data.status as ApproachStatus) ?? 'pending',
    submittedBy: String(data.submittedBy ?? ''),
    imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

/** Upload an image file to Firebase Storage and return its download URL. */
async function uploadApproachImage(
  file: File,
  questionId: string,
  submittedBy: string
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const safe = `${submittedBy}_${Date.now()}.${ext}`;
  const storageRef = ref(storage, `approaches/${questionId}/${safe}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export interface SubmitApproachPayload {
  questionId: string;
  label: string;
  content: string;
  submittedBy: string; // uid
  imageFile?: File | null;
}

/** Submit a community approach. Always saved as "pending". */
export async function submitApproach(
  payload: SubmitApproachPayload
): Promise<string> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Submissions are unavailable in demo mode.');
  }

  let imageUrl: string | undefined;
  if (payload.imageFile) {
    imageUrl = await uploadApproachImage(
      payload.imageFile,
      payload.questionId,
      payload.submittedBy
    );
  }

  const docRef = await addDoc(collection(db, COLLECTION), {
    questionId: payload.questionId,
    label: payload.label,
    content: payload.content,
    status: 'pending' as ApproachStatus,
    submittedBy: payload.submittedBy,
    imageUrl: imageUrl ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/** Admin: fetch all pending community approaches. */
export async function getPendingApproaches(): Promise<Approach[]> {
  if (!isFirebaseConfigured) return [];

  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDocToApproach(d.id, d.data()));
}

/** Public: fetch approved community approaches for a specific question. */
export async function getCommunityApproaches(questionId: string): Promise<Approach[]> {
  if (!isFirebaseConfigured) return [];

  const q = query(
    collection(db, COLLECTION),
    where('questionId', '==', questionId),
    where('status', '==', 'approved'),
    orderBy('createdAt', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDocToApproach(d.id, d.data()));
}

/** Admin: set a pending approach to "approved" or "rejected". */
export async function reviewApproach(
  approachId: string,
  decision: 'approved' | 'rejected'
): Promise<void> {
  if (!isFirebaseConfigured) return;

  await updateDoc(doc(db, COLLECTION, approachId), {
    status: decision,
    updatedAt: serverTimestamp(),
  });
}
