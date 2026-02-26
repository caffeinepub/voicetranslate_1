export interface Language {
  code: string;
  label: string;
  bcp47: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", bcp47: "en-US", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", bcp47: "hi-IN", flag: "🇮🇳" },
  { code: "es", label: "Spanish", bcp47: "es-ES", flag: "🇪🇸" },
  { code: "fr", label: "French", bcp47: "fr-FR", flag: "🇫🇷" },
  { code: "de", label: "German", bcp47: "de-DE", flag: "🇩🇪" },
  { code: "ja", label: "Japanese", bcp47: "ja-JP", flag: "🇯🇵" },
];

export function getLanguageByCode(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<string> {
  if (sourceLang === targetLang) return text;

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Translation request failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || "Translation failed");
  }

  const translated: string = data.responseData?.translatedText;
  if (!translated) {
    throw new Error("No translation returned");
  }

  return translated;
}
