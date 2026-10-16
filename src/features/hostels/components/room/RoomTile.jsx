// What this file does:
// One physical room in the room picker (e.g. "Room 203"): its seats as circles,
// how many are free, and small faces of the residents who chose to be visible.
// A full room can't be picked; the picked room gets a blue border and a tick.

import { Avatar, Icon } from '@/components/ui'
import { cn } from '@/utils/cn'
import { SeatIcons } from '../SeatIcons'

const MAX_FACES = 3

/** Overlapping resident faces, plus a grey lock circle if some residents are private. */
function ResidentFaces({ residents, privateCount }) {
  return (
    <span className="flex -space-x-2">
      {residents.slice(0, MAX_FACES).map((resident) => (
        <span key={resident.id} className="rounded-full ring-2 ring-surface">
          <Avatar name={resident.name} size={28} />
        </span>
      ))}
      {privateCount > 0 && (
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-sunken text-muted ring-2 ring-surface"
          title={`${privateCount} private`}
        >
          <Icon name="lock" size={12} />
        </span>
      )}
    </span>
  )
}

/** room: a room from useRoomDetail; showMatch: show the best match % (student has a profile) */
export function RoomTile({ room, selected, showMatch, onSelect }) {
  const { number, totalSeats, freeSeats, residents, privateCount, bestMatch } = room
  const isFull = freeSeats === 0
  const isEmpty = residents.length + privateCount === 0

  return (
    <button
      type="button"
      disabled={isFull}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'relative rounded-xl border-2 bg-surface p-4 text-left transition-all',
        selected
          ? 'border-brand-700 shadow-card'
          : 'border-line hover:-translate-y-0.5 hover:border-brand-200',
        isFull && 'cursor-not-allowed opacity-55 hover:translate-y-0 hover:border-line',
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-white">
          <Icon name="check" size={13} strokeWidth={3} />
        </span>
      )}
      {isFull && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 text-tiny font-semibold text-muted">
          <Icon name="lock" size={12} />
          Full
        </span>
      )}

      <p className="text-tiny font-semibold uppercase tracking-[0.1em] text-muted">Room</p>
      <p className="text-heading font-semibold leading-none tracking-tight text-ink">{number}</p>

      <div className="mt-4">
        <SeatIcons total={totalSeats} free={freeSeats} />
      </div>
      <p className={cn('mt-2 text-small font-medium', isFull ? 'text-muted' : 'text-success')}>
        {isFull ? 'No seats free' : `${freeSeats} of ${totalSeats} seats free`}
      </p>

      <div className="mt-4 flex min-h-[44px] items-center gap-2 border-t border-line pt-3">
        {isEmpty ? (
          <span className="inline-flex items-center gap-1.5 text-caption text-muted">
            <Icon name="sparkles" size={13} className="text-brand-700" />
            Be the first resident
          </span>
        ) : (
          <>
            <ResidentFaces residents={residents} privateCount={privateCount} />
            {showMatch && bestMatch !== undefined && (
              <span className="tabular ml-auto text-caption font-semibold text-success">
                {bestMatch}% match
              </span>
            )}
          </>
        )}
      </div>
    </button>
  )
}