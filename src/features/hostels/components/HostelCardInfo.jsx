import { Icon } from '@/components/ui'
import { formatPrice } from '@/utils/formatters'
import { HostelRating } from './HostelRating'
import { SeatsLabel } from './SeatsLabel'

/** The white panel at the bottom of a hostel card: name, rating, area, price, distance, seats. */
export function HostelCardInfo({ hostel, children }) {
  return (
    <div className="absolute inset-x-3 bottom-3 rounded-lg bg-white/97 p-4 shadow-pop backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-title-sm font-semibold leading-snug tracking-tight text-ink">
          {hostel.name}
        </h3>
        <span className="shrink-0">
          <HostelRating rating={hostel.rating} reviewCount={hostel.reviewCount} size="sm" />
        </span>
      </div>

      <p className="mt-1 flex items-center gap-1 text-small text-muted">
        <Icon name="mapPin" size={13} />
        {hostel.area}, Lahore
      </p>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
        <p className="tabular text-lead font-bold text-brand-700">
          {formatPrice(hostel.startingPrice)}
          <span className="text-caption font-normal text-muted"> /seat</span>
        </p>
        <div className="tabular flex items-center gap-3 text-caption text-ink-2">
          <span className="inline-flex items-center gap-1" title="Distance to campus">
            <Icon name="walk" size={13} className="text-muted" />
            {hostel.distance} km
          </span>
          <SeatsLabel freeSeats={hostel.freeSeats} compact />
        </div>
      </div>

      {children}
    </div>
  )
}