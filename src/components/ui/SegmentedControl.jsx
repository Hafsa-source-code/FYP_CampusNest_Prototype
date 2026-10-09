import { cn } from '@/utils/cn'

/**
 * Grey track with a white "selected" segment, e.g. All / Active / Closed.
 * Use for switching between VIEWS of one list (PillGroup is for filters/choices).
 * counts: optional { All: 5, Active: 2 } shown as small numbers
 */
export function SegmentedControl({ options, value, onChange, counts }) {
  return (
    <div role="tablist" className="inline-flex rounded-full bg-sunken p-1">
      {options.map((option) => {
        const selected = value === option
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option)}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-full px-4 text-small font-medium transition-colors',
              selected ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink',
            )}
          >
            {option}
            {counts?.[option] !== undefined && (
              <span
                className={cn(
                  'tabular h-5 min-w-5 rounded-full px-1.5 text-tiny leading-5',
                  selected ? 'bg-brand-700 text-white' : 'bg-line text-muted',
                )}
              >
                {counts[option]}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
