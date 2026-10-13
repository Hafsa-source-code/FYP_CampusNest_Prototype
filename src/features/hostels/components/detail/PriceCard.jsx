import { Icon } from '@/components/ui'
import { formatPrice } from '@/utils/formatters'
import { ChooseRoomButton } from './ChooseRoomButton'

/** Price box in the right column (computers only), plus a safety tip below it. */
export function PriceCard({ hostel, onChooseRoom }) {
  const rows = [
    { icon: 'bed', label: 'Seats available', value: hostel.freeSeats },
    { icon: 'door', label: 'Room types', value: hostel.roomTypes.length },
    { icon: 'clock', label: 'Owner usually replies', value: hostel.ownerReplyTime },
  ]

  return (
    <>
      <div className="rounded-xl border border-line bg-surface p-6 shadow-card">
        <p className="text-small text-muted">Starting from</p>
        <p className="tabular mt-1 text-display-sm font-semibold leading-none tracking-tight text-brand-700">
          {formatPrice(hostel.startingPrice)}
          <span className="text-body font-normal text-muted"> / seat / month</span>
        </p>

        <div className="mt-5 space-y-3 border-t border-line pt-5 text-body">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-2.5">
              <Icon name={row.icon} size={16} className="text-muted" />
              <span className="text-muted">{row.label}</span>
              <span className="tabular ml-auto font-semibold text-ink">{row.value}</span>
            </div>
          ))}
        </div>

        <ChooseRoomButton
          freeSeats={hostel.freeSeats}
          onClick={onChooseRoom}
          full
          size="lg"
          className="mt-6"
        />
        <p className="mt-3 text-center text-small text-muted">
          You won't be charged. Inquiries are free.
        </p>
      </div>

      <div className="mt-4 flex gap-3 rounded-lg bg-sunken p-4 text-small text-ink-2">
        <Icon name="lock" size={16} className="mt-0.5 text-brand-700" />
        <p>Messages stay on CampusNest. Never pay a deposit before visiting the hostel in person.</p>
      </div>
    </>
  )
}