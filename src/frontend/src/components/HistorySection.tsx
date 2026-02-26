import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmotionBadge } from "./EmotionBadge";
import { TranslationRecord } from "../backend";
import { getLanguageByCode } from "../services/translationService";

interface HistorySectionProps {
  history: TranslationRecord[] | undefined;
  isLoading: boolean;
  onClearHistory: () => void;
  isClearingHistory: boolean;
}

export function HistorySection({
  history,
  isLoading,
  onClearHistory,
  isClearingHistory,
}: HistorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasHistory = history && history.length > 0;
  const displayedHistory = history?.slice(0, 10) ?? [];

  return (
    <section className="animate-fade-in-up animate-delay-300">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
          aria-expanded={isExpanded}
        >
          <Clock className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="font-semibold text-base">Translation History</span>
          {hasHistory && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
              {history!.length}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {hasHistory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            disabled={isClearingHistory}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 3 }, (_, i) => i).map((i) => (
              <div
                key={`skeleton-${i}`}
                className="glass-card rounded-xl p-3 flex items-center gap-3"
              >
                <Skeleton className="h-6 w-16 rounded-full bg-secondary/40" />
                <Skeleton className="h-4 flex-1 bg-secondary/40" />
                <Skeleton className="h-4 w-12 bg-secondary/40" />
              </div>
            ))
          ) : !hasHistory ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/60 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">No translations yet</p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Your translation history will appear here
              </p>
            </div>
          ) : (
            displayedHistory.map((record) => {
              const targetLang = getLanguageByCode(record.targetLanguage);
              const snippet =
                record.originalText.length > 60
                  ? record.originalText.slice(0, 60) + "…"
                  : record.originalText;
              const recordKey = `${record.originalText.slice(0, 20)}-${record.targetLanguage}-${record.detectedEmotion}`;

              return (
                <div
                  key={recordKey}
                  className="glass-card rounded-xl p-3 flex items-start gap-3 hover:border-primary/30 transition-colors"
                >
                  <EmotionBadge emotion={record.detectedEmotion} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/90 truncate">{snippet}</p>
                    {record.translatedText && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        → {record.translatedText.slice(0, 60)}
                        {record.translatedText.length > 60 ? "…" : ""}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{targetLang.flag}</span>
                    <span>{targetLang.code.toUpperCase()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
