# VoiceTranslate

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Text input area for users to paste or type text
- OCR-style text extraction via image upload (using browser file input + Tesseract.js or plain text fallback)
- Translation module using MyMemory free REST API (no API key needed), supporting English, Hindi, Spanish, French, German, Japanese
- Emotion detection module: rule-based keyword/sentiment analysis to classify text as Happy, Sad, Angry, Excited, or Neutral
- Text-to-Speech using the browser's Web Speech API with dynamic pitch, rate, and volume adjustments based on detected emotion
- Language selection dropdown
- Toggle to enable/disable auto-speak on translation
- Display panels: Original Text, Translated Text, Detected Emotion
- Buttons: Translate & Speak, Speak Original, Clear
- Clean Material-style UI with modern card layout

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: Store translation history (original text, translated text, target language, emotion) in a simple canister
2. Frontend:
   - Main app layout with header, input card, output card
   - Language selector dropdown (EN, HI, ES, FR, DE, JA)
   - Emotion detector service (rule-based)
   - Translation service (MyMemory REST API via HTTP outcall or direct fetch from frontend)
   - TTS service using Web Speech API with emotion-based prosody
   - Display emotion badge with color coding
   - Action buttons with loading states

## UX Notes
- Emotion badge colors: Happy=green, Sad=blue, Angry=red, Excited=orange, Neutral=gray
- TTS parameters per emotion:
  - Happy: rate=1.1, pitch=1.3
  - Sad: rate=0.8, pitch=0.7
  - Angry: rate=1.2, pitch=0.9
  - Excited: rate=1.3, pitch=1.5
  - Neutral: rate=1.0, pitch=1.0
- Translation via MyMemory API: `https://api.mymemory.translated.net/get?q=TEXT&langpair=SOURCE|TARGET`
- Mobile-friendly responsive layout
