import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, ArrowRightLeft, Volume2, X, Heart } from "lucide-react";

import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Emotion } from "./backend";
import { detectEmotion } from "./services/emotionService";
import { translateText, getLanguageByCode } from "./services/translationService";
import { speak, stopSpeech } from "./services/ttsService";
import { useTranslationHistory, useSaveTranslation, useClearHistory } from "./hooks/useTranslationHistory";
import { EmotionBadge } from "./components/EmotionBadge";
import { WaveformIcon } from "./components/WaveformIcon";
import { LanguageSelector } from "./components/LanguageSelector";
import { HistorySection } from "./components/HistorySection";

interface TranslationResult {
  originalText: string;
  translatedText: string;
  emotion: Emotion;
  sourceLang: string;
  targetLang: string;
}

export default function App() {
  const [inputText, setInputText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);

  const { data: history, isLoading: isHistoryLoading } = useTranslationHistory();
  const saveTranslation = useSaveTranslation();
  const clearHistory = useClearHistory();

  // Stop speech when component unmounts
  useEffect(() => {
    return () => stopSpeech();
  }, []);

  const swapLanguages = useCallback(() => {
    if (sourceLang === targetLang) return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (result) {
      setInputText(result.translatedText);
      setResult(null);
    }
  }, [sourceLang, targetLang, result]);

  const handleSpeakText = useCallback(
    (text: string, lang: string, emotion: Emotion) => {
      const language = getLanguageByCode(lang);
      stopSpeech();
      speak(
        text,
        emotion,
        language.bcp47,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        (err) => {
          setIsSpeaking(false);
          toast.error(`Speech error: ${err}`);
        },
      );
    },
    [],
  );

  const handleSpeakOriginal = useCallback(() => {
    if (!inputText.trim()) {
      toast.error("Please enter some text first.");
      return;
    }
    const emotion = detectEmotion(inputText);
    handleSpeakText(inputText, sourceLang, emotion);
  }, [inputText, sourceLang, handleSpeakText]);

  const handleTranslateAndSpeak = useCallback(async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text first.");
      return;
    }
    if (sourceLang === targetLang) {
      toast.error("Source and target languages must be different.");
      return;
    }

    setIsTranslating(true);
    stopSpeech();
    setIsSpeaking(false);

    try {
      const emotion = detectEmotion(inputText);
      const translatedText = await translateText(inputText, sourceLang, targetLang);

      const newResult: TranslationResult = {
        originalText: inputText,
        translatedText,
        emotion,
        sourceLang,
        targetLang,
      };

      setResult(newResult);

      // Save to backend (non-blocking)
      saveTranslation.mutate({
        originalText: inputText,
        translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        detectedEmotion: emotion,
      });

      if (autoSpeak) {
        handleSpeakText(translatedText, targetLang, emotion);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Translation failed. Please try again.",
      );
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, sourceLang, targetLang, autoSpeak, saveTranslation, handleSpeakText]);

  const handleClear = useCallback(() => {
    setInputText("");
    setResult(null);
    stopSpeech();
    setIsSpeaking(false);
  }, []);

  const handleStopSpeech = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
  }, []);

  const charCount = inputText.length;
  const maxChars = 500;

  return (
    <div className="min-h-screen mesh-bg">
      <Toaster position="top-right" theme="dark" />

      {/* Header */}
      <header className="relative py-12 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <WaveformIcon isPlaying={isSpeaking} className="text-primary w-5 h-5" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-foreground tracking-tight">
              VoiceTranslate
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base font-medium tracking-wide">
            Translate &amp; Speak with Emotion
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 pb-16 space-y-5">

        {/* Input Card */}
        <section className="glass-card rounded-2xl p-5 sm:p-6 space-y-4 animate-fade-in-up animate-delay-100">

          {/* Textarea */}
          <div className="relative">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste text here..."
              className="min-h-[140px] resize-none bg-secondary/40 border-border text-foreground placeholder:text-muted-foreground text-base leading-relaxed focus:ring-primary/40 focus:border-primary/50 pr-16"
              maxLength={maxChars}
              aria-label="Input text"
            />
            <span
              className={`absolute bottom-3 right-3 text-xs font-mono transition-colors ${
                charCount > maxChars * 0.9 ? "text-primary" : "text-muted-foreground/50"
              }`}
            >
              {charCount}/{maxChars}
            </span>
          </div>

          {/* Language selectors */}
          <div className="flex items-end gap-2">
            <LanguageSelector
              id="source-lang"
              label="From"
              value={sourceLang}
              onChange={setSourceLang}
            />
            <button
              type="button"
              onClick={swapLanguages}
              className="shrink-0 mb-0.5 w-9 h-11 rounded-lg border border-border bg-secondary/60 hover:bg-secondary hover:border-primary/40 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
              aria-label="Swap languages"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
            <LanguageSelector
              id="target-lang"
              label="To"
              value={targetLang}
              onChange={setTargetLang}
            />
          </div>

          {/* Auto-speak toggle */}
          <div className="flex items-center gap-2.5 py-1">
            <Switch
              id="auto-speak"
              checked={autoSpeak}
              onCheckedChange={setAutoSpeak}
              className="data-[state=checked]:bg-primary"
            />
            <Label
              htmlFor="auto-speak"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              Auto-speak after translation
            </Label>
          </div>

          <Separator className="bg-border/60" />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              onClick={handleSpeakOriginal}
              disabled={!inputText.trim() || isSpeaking}
              className="flex-1 sm:flex-none gap-2 border-border bg-secondary/40 text-foreground hover:bg-secondary hover:text-primary hover:border-primary/40"
            >
              <Volume2 className="w-4 h-4" />
              Speak Original
            </Button>

            <Button
              onClick={handleTranslateAndSpeak}
              disabled={isTranslating || !inputText.trim()}
              className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-semibold"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Translating…
                </>
              ) : (
                <>
                  <WaveformIcon isPlaying={false} className="w-4 h-4" />
                  Translate &amp; Speak
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleClear}
              disabled={!inputText && !result}
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          </div>

          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2.5 text-primary">
                <WaveformIcon isPlaying={true} className="w-5 h-5" />
                <span className="text-sm font-medium">Speaking…</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStopSpeech}
                className="text-primary hover:text-primary/80 hover:bg-primary/10 h-7 px-2 text-xs"
              >
                Stop
              </Button>
            </div>
          )}
        </section>

        {/* Output Section */}
        {result && (
          <section className="glass-card rounded-2xl p-5 sm:p-6 space-y-4 animate-fade-in-up">
            {/* Emotion + meta */}
            <div className="flex items-center justify-between">
              <EmotionBadge emotion={result.emotion} />
              <span className="text-xs text-muted-foreground">
                {getLanguageByCode(result.sourceLang).flag}{" "}
                {getLanguageByCode(result.sourceLang).label} →{" "}
                {getLanguageByCode(result.targetLang).flag}{" "}
                {getLanguageByCode(result.targetLang).label}
              </span>
            </div>

            <Separator className="bg-border/60" />

            {/* Original */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Original
              </p>
              <p className="text-foreground/90 text-base leading-relaxed bg-secondary/30 rounded-xl px-4 py-3">
                {result.originalText}
              </p>
            </div>

            {/* Translation */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                Translation
              </p>
              <p className="text-foreground text-base leading-relaxed font-medium bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
                {result.translatedText}
              </p>
            </div>

            {/* Speak translation button */}
            <Button
              variant="outline"
              onClick={() => handleSpeakText(result.translatedText, result.targetLang, result.emotion)}
              disabled={isSpeaking}
              className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
            >
              <Volume2 className="w-4 h-4" />
              Speak Translation
            </Button>
          </section>
        )}

        {/* History Section */}
        <HistorySection
          history={history}
          isLoading={isHistoryLoading}
          onClearHistory={() => clearHistory.mutate()}
          isClearingHistory={clearHistory.isPending}
        />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground/60">
        © 2026. Built with{" "}
        <Heart className="inline w-3 h-3 text-primary fill-primary mx-0.5" /> using{" "}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/70 hover:text-primary underline underline-offset-2 transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
