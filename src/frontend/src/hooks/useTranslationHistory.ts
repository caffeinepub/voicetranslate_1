import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TranslationRecord, Emotion, LanguageTag } from "../backend";
import { useActor } from "./useActor";

export function useTranslationHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<TranslationRecord[]>({
    queryKey: ["translation-history"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTranslationHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveTranslation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      originalText,
      translatedText,
      sourceLanguage,
      targetLanguage,
      detectedEmotion,
    }: {
      originalText: string;
      translatedText: string;
      sourceLanguage: LanguageTag;
      targetLanguage: LanguageTag;
      detectedEmotion: Emotion;
    }) => {
      if (!actor) return;
      return actor.saveTranslation(
        originalText,
        translatedText,
        sourceLanguage,
        targetLanguage,
        detectedEmotion,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translation-history"] });
    },
  });
}

export function useClearHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      return actor.clearHistory();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translation-history"] });
    },
  });
}
