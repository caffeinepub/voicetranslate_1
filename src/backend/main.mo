import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";

actor {
  type LanguageTag = Text;

  type Emotion = {
    #happy;
    #sad;
    #angry;
    #excited;
    #neutral;
  };

  type TranslationRecord = {
    originalText : Text;
    translatedText : Text;
    sourceLanguage : LanguageTag;
    targetLanguage : LanguageTag;
    detectedEmotion : Emotion;
  };

  module TranslationRecord {
    public func new(originalText : Text, translatedText : Text, sourceLanguage : LanguageTag, targetLanguage : LanguageTag, detectedEmotion : Emotion) : TranslationRecord {
      {
        originalText;
        translatedText;
        sourceLanguage;
        targetLanguage;
        detectedEmotion;
      };
    };
  };

  let storage = Map.empty<Nat64, TranslationRecord>();

  func translateTextWithEmotion(text : Text, sourceLang : LanguageTag, targetLang : LanguageTag) : async (Text, Emotion) {
    ("[Translated] " # text, #neutral);
  };

  func addTranslationRecord(originalText : Text, translatedText : Text, sourceLanguage : LanguageTag, targetLanguage : LanguageTag, detectedEmotion : Emotion) : () {
    let record = TranslationRecord.new(originalText, translatedText, sourceLanguage, targetLanguage, detectedEmotion);
    let key = Nat64.fromNat(storage.size().toNat());
    storage.add(key, record);
  };

  public shared ({ caller }) func clearHistory() : async () {
    storage.clear();
  };

  public query ({ caller }) func getTranslationHistory() : async [TranslationRecord] {
    let historyList = List.empty<TranslationRecord>();
    for ((_, record) in storage.entries()) {
      historyList.add(record);
      if (historyList.size() == 50) { return historyList.toArray() };
    };
    historyList.toArray();
  };

  public shared ({ caller }) func saveTranslation(originalText : Text, translatedText : Text, sourceLanguage : LanguageTag, targetLanguage : LanguageTag, detectedEmotion : Emotion) : async () {
    addTranslationRecord(originalText, translatedText, sourceLanguage, targetLanguage, detectedEmotion);
  };

  public shared ({ caller }) func translateAndSave(text : Text, sourceLang : LanguageTag, targetLang : LanguageTag) : async Text {
    let (translation, emotion) = await translateTextWithEmotion(text, sourceLang, targetLang);
    addTranslationRecord(text, translation, sourceLang, targetLang, emotion);
    translation;
  };
};
