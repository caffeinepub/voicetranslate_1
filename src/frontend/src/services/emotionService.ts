import { Emotion } from "../backend";

const EMOTION_KEYWORDS: Record<Emotion, string[]> = {
  [Emotion.happy]: [
    "happy", "joy", "great", "love", "wonderful", "amazing", "excited",
    "fantastic", "good", "excellent", "laugh", "smile", "glad", "cheerful",
    "delight", "bliss", "pleasure", "celebrate", "awesome", "terrific",
  ],
  [Emotion.sad]: [
    "sad", "cry", "depressed", "unhappy", "miserable", "grief", "lonely",
    "hopeless", "tears", "sorrow", "heartbreak", "miss", "regret", "mourn",
    "melancholy", "gloomy", "despair", "pain", "hurt", "weep",
  ],
  [Emotion.angry]: [
    "angry", "furious", "hate", "rage", "mad", "annoyed", "frustrated",
    "outrage", "infuriated", "disgusted", "stupid", "awful", "terrible",
    "ridiculous", "absurd", "nonsense", "appalled", "enraged",
  ],
  [Emotion.excited]: [
    "excited", "wow", "incredible", "unbelievable", "awesome", "thrilled",
    "ecstatic", "brilliant", "spectacular", "phenomenal", "omg", "insane",
    "crazy", "mind-blowing", "extraordinary", "remarkable", "stunning",
  ],
  [Emotion.neutral]: [],
};

export function detectEmotion(text: string): Emotion {
  const normalized = text.toLowerCase();
  const scores: Record<Emotion, number> = {
    [Emotion.happy]: 0,
    [Emotion.sad]: 0,
    [Emotion.angry]: 0,
    [Emotion.excited]: 0,
    [Emotion.neutral]: 0,
  };

  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS) as [Emotion, string[]][]) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = normalized.match(regex);
      if (matches) {
        scores[emotion] += matches.length;
      }
    }
  }

  // Find highest scoring emotion
  let topEmotion: Emotion = Emotion.neutral;
  let topScore = 0;

  for (const [emotion, score] of Object.entries(scores) as [Emotion, number][]) {
    if (emotion === Emotion.neutral) continue;
    if (score > topScore) {
      topScore = score;
      topEmotion = emotion;
    }
  }

  return topEmotion;
}
