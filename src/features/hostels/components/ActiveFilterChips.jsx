import { RemovableChip } from '@/components/ui'

/** Row of the filters currently on, each removable, plus "Clear all". */
export function ActiveFilterChips({ chips, onClearAll }) {
  if (chips.length === 0) return null

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <RemovableChip key={chip.label} label={chip.label} onRemove={chip.remove} />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 text-small font-semibold text-brand-700 hover:text-brand-800"
      >
        Clear all
      </button>
    </div>
  )
}
