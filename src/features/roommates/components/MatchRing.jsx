// A round progress ring with the roommate match % in the middle (e.g. 87%).
// Green for a strong match, blue for good, grey for weak.

const STRONG_MATCH = 85
const GOOD_MATCH = 70
const RADIUS = 18
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function ringColor(score) {
  if (score >= STRONG_MATCH) return 'var(--color-success)'
  if (score >= GOOD_MATCH) return 'var(--color-brand-700)'
  return 'var(--color-muted)'
}

/** score: 0–100, size: ring width in px */
export function MatchRing({ score, size = 46 }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={`${score}% match`}
    >
      <svg viewBox="0 0 44 44" width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx="22" cy="22" r={RADIUS} fill="none" stroke="var(--color-line)" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke={ringColor(score)}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
        />
      </svg>
      <span
        className="tabular font-bold text-ink"
        style={{ fontSize: Math.max(11, Math.round(size * 0.24)) }}
      >
        {score}%
      </span>
    </span>
  )
}