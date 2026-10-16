import { Badge, Button, Icon, Photo } from '@/components/ui'
import { formatPrice } from '@/utils/formatters'
import { SeatsLabel } from '../SeatsLabel'

/** One room type (e.g. "3-Seater AC Room"): photo, facts, price per seat, "Choose a room". */
export function RoomTypeCard({ roomType, onChoose }) {
  const { name, photo, ac, seatsPerRoom, roomCount, price, freeSeats } = roomType
  const open = freeSeats > 0

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-4 transition-shadow hover:shadow-card sm:flex-row">
      <Photo src={photo} alt={name} ratio="4/3" className="w-full shrink-0 sm:w-44" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-title-sm font-semibold tracking-tight text-ink">{name}</h3>
          {ac && (
            <Badge tone="brand" icon="snowflake">
              AC
            </Badge>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-small text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="users" size={14} />
            {seatsPerRoom} {seatsPerRoom === 1 ? 'person' : 'people'} per room
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="door" size={14} />
            {roomCount} rooms
          </span>
          <SeatsLabel freeSeats={freeSeats} />
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <p>
            <span className="tabular text-title-sm font-bold text-brand-700">
              {formatPrice(price)}
            </span>
            <span className="text-small text-muted"> / seat / month</span>
          </p>
          <Button
            size="sm"
            variant={open ? 'primary' : 'secondary'}
            disabled={!open}
            iconRight={open ? 'chevronRight' : undefined}
            onClick={onChoose}
          >
            {open ? 'Choose a room' : 'Full'}
          </Button>
        </div>
      </div>
    </div>
  )
}