import { cn } from '@/utils/cn'
import { Icon } from './Icon'

/**
 * Checkbox with a label and optional description.
 * onChange receives true/false directly (not the browser event).
 */
export function Checkbox({ checked, onChange, label, description }) {
  return (
    <label className="group flex cursor-pointer select-none items-start gap-2.5">
      <span
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors',
          checked
            ? 'border-charcoal bg-charcoal text-white'
            : 'border-line-strong bg-surface group-hover:border-muted',
        )}
      >
        {checked && <Icon name="check" size={12} strokeWidth={3} />}
      </span>

      {/* Real checkbox, hidden but still usable by keyboard and screen readers */}
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      <span>
        <span className="block text-body text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-small text-muted">{description}</span>}
      </span>
    </label>
  )
}
