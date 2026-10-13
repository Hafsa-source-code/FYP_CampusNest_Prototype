import { HostelCard } from './HostelCard'

/** Responsive grid of hostel cards: 1 column on phones up to 4 on wide screens. */
export function HostelGrid({ hostels, showCompare = true }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {hostels.map((hostel) => (
        <HostelCard key={hostel.id} hostel={hostel} showCompare={showCompare} />
      ))}
    </div>
  )
}
