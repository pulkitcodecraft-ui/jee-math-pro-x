Add an AI Explain feature using the existing Firebase Vertex AI 
setup (getVertexAI() from vertex.ts). Follow the exact same 
pattern as extractFromFile.ts for multimodal (image + text) calls.

1. Create a new file src/lib/ai/explainSolution.ts:

- Function: explainSolution(questionText, solutionText, imageBase64?, imageMimeType?)
- Use getVertexAI() same as other AI files
- Model: gemini-2.5-flash (same as codebase)
- If image present, send multimodal content exactly like extractFromFile.ts does:
  [{ text: prompt }, { inlineData: { mimeType, data: base64 } }]
- If no image, send text only
- System instruction:
  "You are a friendly JEE Math tutor. Explain in Hinglish (Hindi + English mix). 
  Keep responses 3-5 lines. Label steps as [Step 1][Step 2] etc. 
  If a diagram is provided, describe it first then connect to solution. 
  Be encouraging and friendly."
- Return response as plain text string

2. Create component src/components/AIExplainButton.tsx:
- Small button, bottom-right of solution card, label "Samjhao AI se"
- On click opens AIExplainPanel

3. Create component src/components/AIExplainPanel.tsx:
- Slide-in panel from right, full height, width 384px
- Header with title "AI Tutor" and X close button
- Shows question text at top as context chip
- If solution card has an <img>, detect its src, convert to 
  base64 using FileReader (same pattern as extractFromFile.ts),
  pass to explainSolution()
- On panel open, auto-call explainSolution() immediately
- Show typing indicator (3 animated dots) while loading
- Chat area showing AI messages and user messages
- Quick suggestion buttons after first AI reply:
  "Ye step kaise aaya?" / "Ek example do" / "Phir se samjhao"
  + "Diagram samjhao" only if image was detected
- Input box at bottom with send button, Enter key also works
- Match existing dark theme of the app

4. In the existing solution card component, add:
- position: relative on the card wrapper
- Grab first <img> src inside the card if any
- Render <AIExplainButton> passing questionText, solutionText, imageUrl

Do not create any new Firebase instance. 
Only use getVertexAI() from vertex.ts exactly as other files do.