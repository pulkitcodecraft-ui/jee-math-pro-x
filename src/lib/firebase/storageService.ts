/**
 * Firebase Storage operations for user-uploaded question files.
 *
 * Files live at `uploads/{userId}/{questionId}/{filename}` so Storage rules
 * can scope read/write access to the authenticated owner.
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './config';
import { isFirebaseConfigured } from '@/lib/auth/authService';
import type { HistoryAttachment } from '@/types/history';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];
export const ACCEPTED_PDF_TYPE = 'application/pdf';

/** Validate a file's type and size. Returns an error string, or null if ok. */
export function validateFile(file: File): string | null {
  const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type) || file.type.startsWith('image/');
  const isPdf = file.type === ACCEPTED_PDF_TYPE;
  if (!isImage && !isPdf) {
    return 'Unsupported file. Please upload an image (JPG, PNG, WEBP, HEIC) or a PDF.';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return 'File is too large. Maximum size is 10 MB.';
  }
  return null;
}

/** Replace characters that are awkward in Storage paths. */
function sanitizeName(name: string): string {
  return name.replace(/[^\w.\-]+/g, '_').slice(-80);
}

/**
 * Upload a file to `uploads/{userId}/{questionId}/{filename}` and return an
 * attachment record (download URL + metadata for later display/deletion).
 */
export async function uploadQuestionFile(
  file: File,
  userId: string,
  questionId: string
): Promise<HistoryAttachment> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. File uploads are unavailable in demo mode.');
  }
  const name = `${Date.now()}_${sanitizeName(file.name)}`;
  const path = `uploads/${userId}/${questionId}/${name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  const url = await getDownloadURL(storageRef);
  return { url, name, fileType: file.type, path };
}

/** Delete a previously uploaded file by its full Storage path. */
export async function deleteQuestionFile(path: string): Promise<void> {
  if (!isFirebaseConfigured || !path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch {
    // File may already be gone — don't block the surrounding delete flow.
  }
}
