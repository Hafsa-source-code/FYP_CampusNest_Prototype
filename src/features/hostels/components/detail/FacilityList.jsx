import { IconCircle } from '@/components/ui'
import { DEFAULT_FACILITY_ICON, FACILITY_ICONS } from '../../constants'

/** The hostel's facilities, each with its icon. */
export function FacilityList({ facilities }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
      {facilities.map((facility) => (
        <div key={facility} className="flex items-center gap-3 text-body-lg text-ink-2">
          <IconCircle icon={FACILITY_ICONS[facility] ?? DEFAULT_FACILITY_ICON} size={36} />
          {facility}
        </div>
      ))}
    </div>
  )
}