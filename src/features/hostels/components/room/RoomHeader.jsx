// The top of the room page: breadcrumb, room type name (with an AC badge), which hostel it is in,
// four quick facts (people per room, rooms, free seats, price), and the room photos.

import { Badge, Icon, Photo } from '@/components/ui'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { formatPrice } from '@/utils/formatters'
import { useCampus } from '../../hooks/useCampus'
import { hostelLink, searchLink } from '../../utils/hostelLinks'

/** Small rounded chip with a blue icon, shown under the title. */
function InfoChip({ icon, children }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-small font-medium text-ink-2">
      <Icon name={icon} size={14} className="text-brand-700" />
      {children}
    </span>
  )
}

export function RoomHeader({ hostel, roomType }) {
  const { campus } = useCampus()
  const { name, ac, seatsPerRoom, roomCount, freeSeats, price, photoUrls } = roomType

  const breadcrumb = [
    { label: 'Find a hostel', to: searchLink(campus) },
    { label: hostel.name, to: hostelLink(hostel.id, campus) },
    { label: name },
  ]

  return (
    <>
      <Breadcrumb items={breadcrumb} />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="text-display-sm font-semibold tracking-tight text-ink sm:text-display">
          {name}
        </h1>
        {ac && (
          <Badge tone="brand" icon="snowflake">
            Air-conditioned
          </Badge>
        )}
      </div>
      <p className="mt-1 text-body text-muted">
        at <span className="font-medium text-ink">{hostel.name}</span> · {hostel.area}, Lahore
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <InfoChip icon="users">
          {seatsPerRoom} {seatsPerRoom === 1 ? 'person' : 'people'} per room
        </InfoChip>
        <InfoChip icon="door">{roomCount} rooms</InfoChip>
        <InfoChip icon="bed">{freeSeats} seats free</InfoChip>
        <InfoChip icon="tag">
          <span className="font-semibold text-brand-700">{formatPrice(price)}</span>
          &nbsp;/ seat / month
        </InfoChip>
      </div>

      <div className="mt-6 grid h-[220px] grid-cols-3 gap-2 overflow-hidden rounded-xl sm:h-[340px]">
        <Photo
          src={photoUrls[0]}
          alt={name}
          ratio="auto"
          rounded={false}
          className="col-span-3 h-full sm:col-span-2"
        />
        <div className="hidden grid-rows-2 gap-2 sm:grid">
          <Photo src={photoUrls[1]} alt="" ratio="auto" rounded={false} className="h-full" />
          <Photo src={photoUrls[2]} alt="" ratio="auto" rounded={false} className="h-full" />
        </div>
      </div>
    </>
  )
}