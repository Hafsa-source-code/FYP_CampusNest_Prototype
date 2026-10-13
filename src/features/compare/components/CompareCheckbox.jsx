import { toast } from '@/components/feedback'
import { MAX_COMPARE } from '../constants'
import { useCompare } from '../hooks/useCompare'

/** Small "Add to compare" tick box on hostel cards. */
export function CompareCheckbox({ hostelId }) {
  const { isComparing, toggle } = useCompare()

  const handleChange = () => {
    const added = toggle(hostelId)
    if (!added) toast(`You can compare up to ${MAX_COMPARE} hostels`)
  }

  return (
    <label
      onClick={(event) => event.stopPropagation()}
      className="mt-2.5 inline-flex cursor-pointer select-none items-center gap-1.5 text-caption text-muted hover:text-ink"
    >
      <input
        type="checkbox"
        checked={isComparing(hostelId)}
        onChange={handleChange}
        className="h-3.5 w-3.5 accent-[var(--color-brand-700)]"
      />
      Add to compare
    </label>
  )
}
