import { Emotion } from "../backend";

interface VoiceParams {
  rate: number;
  pitch: number;
  volume: number;
}

const EMOTION_PARAMS: Record<Emotion, VoiceParams> = {
  [Emotion.happy]: { rate: 1.1, pitch: 1.3, volume: 1.0 },
  [Emotion.sad]: { rate: 0.8, pitch: 0.7, volume: 0.9 },
  [Emotion.angry]: { rate: 1.2, pitch: 0.9, volume: 1.0 },
  [Emotion.excited]: { rate: 1.3, pitch: 1.5, volume: 1.0 },
  [Emotion.neutral]: { rate: 1.0, pitch: 1.0, volume: 1.0 },
};

export function isSpeechSupported(): boolean {
  return "speechSynthesis" in window;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeech(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function speak(
  text: string,
  emotion: Emotion,
  bcp47Lang: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: string) => void,
): void {
  if (!isSpeechSupported()) {
    onError?.("Speech synthesis is not supported in your browser.");
    return;
  }

  stopSpeech();

  const params = EMOTION_PARAMS[emotion];
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = bcp47Lang;
  utterance.rate = params.rate;
  utterance.pitch = params.pitch;
  utterance.volume = params.volume;

  // Try to find a voice for the requested language
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find((v) => v.lang.startsWith(bcp47Lang.split("-")[0]));
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };
  utterance.onerror = (e) => {
    currentUtterance = null;
    onError?.(e.error || "Speech error occurred");
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function isCurrentlySpeaking(): boolean {
  return window.speechSynthesis?.speaking ?? false;
}
