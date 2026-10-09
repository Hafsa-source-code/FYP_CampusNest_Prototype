import { cn } from '@/utils/cn'

/**
 * CampusNest logo: house mark + name.
 * inverse: white version for dark backgrounds
 * size: md | lg
 */
export function Logo({ inverse = false, size = 'md', onClick }) {
  const boxSize = size === 'lg' ? 32 : 28
  const markSize = boxSize * 0.56

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="CampusNest home"
      className="inline-flex shrink-0 items-center gap-2.5"
    >
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-[7px]',
          inverse ? 'bg-white text-brand-800' : 'bg-brand-700 text-white',
        )}
        style={{ width: boxSize, height: boxSize }}
      >
        <svg
          width={markSize}
          height={markSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 11 12 4l9 7" />
          <path d="M6 9.5V20h12V9.5" />
          <path d="M10 20v-5h4v5" />
        </svg>
      </span>

      <span
        className={cn(
          'font-semibold tracking-tight',
          size === 'lg' ? 'text-title-sm' : 'text-lead',
          inverse ? 'text-white' : 'text-ink',
        )}
      >
        CampusNest
      </span>
    </button>
  )
}
