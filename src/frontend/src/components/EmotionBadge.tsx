import { Emotion } from "../backend";

interface EmotionBadgeProps {
  emotion: Emotion;
  size?: "sm" | "md";
}

const EMOTION_CONFIG: Record<Emotion, { label: string; icon: string; className: string }> = {
  [Emotion.happy]: {
    label: "Happy",
    icon: "😊",
    className: "bg-emotion-happy/20 text-emotion-happy border-emotion-happy/30",
  },
  [Emotion.sad]: {
    label: "Sad",
    icon: "😢",
    className: "bg-emotion-sad/20 text-emotion-sad border-emotion-sad/30",
  },
  [Emotion.angry]: {
    label: "Angry",
    icon: "😡",
    className: "bg-emotion-angry/20 text-emotion-angry border-emotion-angry/30",
  },
  [Emotion.excited]: {
    label: "Excited",
    icon: "🤩",
    className: "bg-emotion-excited/20 text-emotion-excited border-emotion-excited/30",
  },
  [Emotion.neutral]: {
    label: "Neutral",
    icon: "😐",
    className: "bg-emotion-neutral/20 text-emotion-neutral border-emotion-neutral/30",
  },
};

export function EmotionBadge({ emotion, size = "md" }: EmotionBadgeProps) {
  const config = EMOTION_CONFIG[emotion];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5 gap-1" : "text-sm px-3 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClass} ${config.className}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
