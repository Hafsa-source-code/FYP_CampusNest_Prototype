import { InfoTile } from '@/components/ui'
import { estimateTravel } from '../../utils/estimateTravel'

/** Three boxes: time to campus on foot, by public transport, and by car. */
export function TravelTimes({ distance }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      {estimateTravel(distance).map((option) => (
        <InfoTile
          key={option.mode}
          size="lg"
          icon={option.icon}
          label={`${option.mode} · ${option.note}`}
          value={option.time}
        />
      ))}
    </div>
  )
}