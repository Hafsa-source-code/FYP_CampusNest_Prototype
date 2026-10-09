import { Select } from '@/components/ui'
import { useOwnerHostels } from '../hooks/useOwnerHostels'

/** Drop-down at the top of the owner's menu to switch between their hostels. */
export function OwnerHostelPicker() {
  const { hostels, selectedId, select } = useOwnerHostels()
  if (hostels.length === 0) return null

  return (
    <div>
      <p className="mb-1.5 text-tiny font-semibold uppercase tracking-[0.12em] text-white/50">
        Property
      </p>
      <Select
        value={selectedId}
        onChange={(event) => select(Number(event.target.value))}
        icon="building"
      >
        {hostels.map((hostel) => (
          <option key={hostel.id} value={hostel.id}>
            {hostel.name}
          </option>
        ))}
      </Select>
    </div>
  )
}
