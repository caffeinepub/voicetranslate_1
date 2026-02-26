import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TranslationRecord {
    sourceLanguage: LanguageTag;
    detectedEmotion: Emotion;
    originalText: string;
    targetLanguage: LanguageTag;
    translatedText: string;
}
export type LanguageTag = string;
export enum Emotion {
    sad = "sad",
    happy = "happy",
    angry = "angry",
    excited = "excited",
    neutral = "neutral"
}
export interface backendInterface {
    clearHistory(): Promise<void>;
    getTranslationHistory(): Promise<Array<TranslationRecord>>;
    saveTranslation(originalText: string, translatedText: string, sourceLanguage: LanguageTag, targetLanguage: LanguageTag, detectedEmotion: Emotion): Promise<void>;
    translateAndSave(text: string, sourceLang: LanguageTag, targetLang: LanguageTag): Promise<string>;
}
