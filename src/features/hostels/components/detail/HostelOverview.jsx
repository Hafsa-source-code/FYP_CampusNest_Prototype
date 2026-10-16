import { InfoTile } from '@/components/ui'
import { FacilityList } from './FacilityList'

/** "About this hostel": four key facts, the description, and the facilities. */
export function HostelOverview({ hostel }) {
  const facts = [
    { icon: 'users', label: 'Hostel for', value: `${hostel.gender} students` },
    { icon: 'walk', label: 'Distance', value: `${hostel.distance} km to campus` },
    { icon: 'bed', label: 'Seats free', value: hostel.freeSeats },
    { icon: 'calendar', label: 'Listed since', value: hostel.listedOn },
  ]

  return (
    <>
      <div className="mb-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {facts.map((fact) => (
          <InfoTile key={fact.label} size="lg" {...fact} />
        ))}
      </div>

      <p className="max-w-[65ch] text-body-lg leading-relaxed text-ink-2">{hostel.description}</p>

      <h3 className="mb-5 mt-9 text-lead font-semibold text-ink">Facilities</h3>
      <FacilityList facilities={hostel.facilities} />
    </>
  )
}