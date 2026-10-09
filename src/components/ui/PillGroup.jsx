import { cn } from '@/utils/cn'
import { Icon } from './Icon'

/** Lets options be plain text ('Male') or objects ({ value, label, icon, count }). */
function normalize(option) {
  return typeof option === 'string'
    ? { value: option, label: option }
    : { label: option.value, ...option }
}

/**
 * Row of rounded pill buttons. The ONE pill picker for the whole app.
 * - Single choice: pass value as a string.
 * - Multiple choice: pass value as an array. onChange gets the clicked option's value;
 *   the page decides whether to add or remove it.
 * options: ['A', 'B'] or [{ value, label, icon, count }]
 * size: sm | md
 */
export function PillGroup({ options, value, onChange, size = 'md' }) {
  const isSelected = (optionValue) =>
    Array.isArray(value) ? value.includes(optionValue) : value === optionValue

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(normalize).map((option) => {
        const selected = isSelected(option.value)
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border text-small font-medium transition-colors',
              size === 'sm' ? 'h-8 px-3' : 'h-9 px-4',
              selected
                ? 'border-charcoal bg-charcoal text-white'
                : 'border-line-strong bg-surface text-ink-2 hover:border-muted',
            )}
          >
            {option.icon && <Icon name={option.icon} size={14} />}
            {option.label}
            {option.count !== undefined && (
              <span
                className={cn(
                  'tabular h-5 min-w-5 rounded-full px-1.5 text-tiny font-semibold leading-5',
                  selected ? 'bg-white/20' : 'bg-sunken text-muted',
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
