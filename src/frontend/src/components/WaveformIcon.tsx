interface WaveformIconProps {
  isPlaying: boolean;
  className?: string;
}

export function WaveformIcon({ isPlaying, className = "" }: WaveformIconProps) {
  if (!isPlaying) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M3 10H5M5 6V14M8 4V16M11 7V13M14 5V15M17 8V12M19 10H17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-label="Playing"
    >
      {[3, 6, 9, 12, 15, 18].map((x) => (
        <rect
          key={x}
          x={x - 1}
          y="6"
          width="2"
          height="8"
          rx="1"
          fill="currentColor"
          className="wave-bar"
          style={{ transformOrigin: `${x}px 14px` }}
        />
      ))}
    </svg>
  );
}
