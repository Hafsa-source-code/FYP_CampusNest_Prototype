import { Icon } from './Icon'

/** Pale blue chip with an ✕, e.g. an active filter. Clicking it removes it. */
export function RemovableChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${label}`}
      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 pl-3 pr-2 text-small font-medium text-brand-800 transition-colors hover:bg-brand-100"
    >
      {label}
      <Icon name="x" size={13} />
    </button>
  )
}
