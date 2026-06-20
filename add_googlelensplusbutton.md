# Cursor Prompt — Add File Upload (+ button) and User History to JEE Math Pro

Copy everything below into Cursor's chat/composer.

---

I'm working on "JEE Math Pro," an app where a user types a math Question + optional Solution, and AI explains it step-by-step (currently powered by Vertex AI, free tier). I need two features added:

## 1. File Upload via a "+" Button

- Add a "+" icon button inside/near the **Question** input box (left of the text area or as a small icon button in the corner, similar to how ChatGPT/Claude's input box has an attach button).
- Clicking "+" opens a small menu with three options:
  - **Take Photo** (opens device camera on mobile, falls back to file picker with `capture="environment"` on the `<input type="file">` for camera access on mobile browsers)
  - **Upload Photo** (opens file picker filtered to image types: jpg, png, webp, heic)
  - **Upload PDF** (opens file picker filtered to `.pdf`)
- Show a thumbnail/file-chip preview (filename + small icon, with an "x" to remove) above the Question box once a file is attached, before the user submits.
- Support multiple file attachments per question if feasible, but a single attachment is fine for v1.
- Validate file size (cap at ~10MB) and type client-side, show a friendly inline error if invalid.

## 2. File Storage — Firebase Storage

- Use **Firebase Storage** to store uploaded files.
- Storage path convention: `uploads/{userId}/{questionId}/{filename}`
- After upload, get the download URL and save a reference to it alongside the question record (see History section below).
- Set up Firebase Storage security rules so only the authenticated owner (`request.auth.uid == userId` in the path) can read/write their own files.
- If Firebase isn't already configured in this project, scaffold the Firebase config (`firebase.ts`/`firebase.js`) using environment variables (`NEXT_PUBLIC_FIREBASE_*` or equivalent) and tell me exactly which values I need to paste in from the Firebase console.

## 3. Use the Uploaded File — Both Modes Available

After a file is uploaded, give the user a clear choice (e.g., two buttons/toggle that appears once a file is attached):

- **"Extract & Fill Question"** — Sends the uploaded image/PDF to Vertex AI (use Gemini's multimodal vision capability, since this is on the free Vertex AI tier) to perform OCR / problem extraction, and auto-populates the **Question** text box (and **Solution** box too, if a handwritten solution is detected in the same image) with the extracted text. Let the user review/edit the extracted text before submitting — don't auto-submit.
- **"Attach as Reference Only"** — The file stays attached to the question as supporting reference material (e.g., a diagram) without overwriting the typed Question/Solution text. It still gets stored and linked to that question in history.

Implement this as a real call to the Vertex AI Gemini API (multimodal — pass image/PDF as inline data or via a signed URL) rather than a separate OCR service, since the project is already using Vertex AI. Use a clear, separate prompt template for extraction, e.g.:
> "Extract the math question and solution (if present) from this image. Return the question text and solution text separately. Preserve mathematical notation as LaTeX where appropriate."

## 4. Login-Based History

- If the app doesn't already have auth, set up **Firebase Authentication** (Google sign-in + email/password as a minimum).
- Once a user is logged in (`auth.currentUser`), every submitted question (text, optional solution, attached file URL(s), selected method/topic/difficulty tags, and the AI-generated explanation) should be saved to **Firestore** under a collection like:
  ```
  users/{userId}/history/{questionId}
  ```
  with fields: `question`, `solution`, `fileUrl` (or array), `fileType`, `topic`, `difficulty`, `method`, `explanation`, `createdAt` (server timestamp).
- Add a **"History"** entry in the top nav (next to "Topics" / "AI Explain") that's only visible/enabled when logged in.
- The History page should:
  - List past questions newest-first, each as a card showing a snippet of the question, topic tag, difficulty tag, timestamp, and a small file icon if a file was attached.
  - Clicking a card loads that full question (with its file, if any) back into the main Question/Solution view so the user can re-view or re-run it.
  - Support basic delete (remove from Firestore + delete the file from Storage if present).
- If the user is not logged in and clicks "History" or tries to attach a file, prompt them to sign in first (file uploads should require auth so storage paths can be scoped per-user).

## Implementation Notes

- First, **inspect the existing project structure** (framework, routing, state management, existing Vertex AI integration code, existing auth if any) and tell me what you find before making changes, so the new code matches existing conventions (TypeScript vs JS, component patterns, styling approach — looks like a dark theme with Tailwind-style utility classes based on the current UI).
- Keep the existing visual style (dark background, purple/violet accent for primary actions, rounded cards) consistent for any new UI you add.
- Write clean, componentized code: e.g., `FileUploadButton`, `FileChip`, `HistoryList`, `HistoryCard`, `useAuth` hook, `useHistory` hook, `firebase.ts` config/init.
- Handle loading and error states for: file upload in progress, Vertex AI extraction in progress, Firestore read/write failures.
- Don't break or remove any existing functionality (Topics, AI Explain, method selection cards, Copy/Regenerate buttons).

Start by showing me the project structure and your plan before writing code.