import { cn } from '@/utils/cn'

/**
 * Row of pill buttons. Works as single-select (value is a string)
 * or multi-select (value is an array).
 * NOTE: will be merged with the other pill pickers in Step 3c.
 */
export function Choice({ options, value, onChange, size = 'md' }) {
  const isSelected = (option) => (Array.isArray(value) ? value.includes(option) : value === option)

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={isSelected(option)}
          onClick={() => onChange(option)}
          className={cn(
            'rounded-full border font-medium transition-colors',
            size === 'sm' ? 'h-8 px-3 text-small' : 'h-9 px-4 text-body',
            isSelected(option)
              ? 'border-charcoal bg-charcoal text-white'
              : 'border-line-strong bg-surface text-ink-2 hover:border-muted',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
