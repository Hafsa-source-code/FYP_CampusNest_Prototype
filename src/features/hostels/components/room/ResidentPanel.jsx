// What this file does:
// The "Who lives in Room 203" box under the room picker.
// Lists the residents who chose to be visible (first name only). If the student has a
// roommate profile, each resident also shows a match % and the reason for it.

import { Avatar, Icon } from '@/components/ui'
import { MatchRing } from '@/features/roommates/components/MatchRing'
import { SeatIcons } from '../SeatIcons'

/** One visible resident: face, name, and either the match reason or the move-in date. */
function ResidentRow({ resident, showMatch }) {
  const hasScore = showMatch && resident.matchScore !== undefined

  return (
    <li className="flex items-center gap-3 py-3 first:pt-0">
      <Avatar name={resident.name} size={40} />
      <div className="min-w-0 flex-1">
        <p className="text-body font-semibold text-ink">{resident.name}</p>
        <p className="truncate text-small text-muted">
          {showMatch && resident.matchReason
            ? resident.matchReason
            : `Resident since ${resident.movedIn}`}
        </p>
      </div>
      {hasScore && <MatchRing score={resident.matchScore} />}
    </li>
  )
}

/** room: the picked room from useRoomDetail; showMatch: the student has a roommate profile */
export function ResidentPanel({ room, showMatch }) {
  const { number, totalSeats, freeSeats, residents, privateCount } = room
  const isEmpty = residents.length + privateCount === 0

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lead font-semibold text-ink">
          <Icon name="users" size={17} className="text-brand-700" />
          Who lives in Room {number}
        </h3>
        <SeatIcons total={totalSeats} free={freeSeats} size={22} />
      </div>

      {isEmpty ? (
        <p className="mt-4 text-body text-muted">Empty room — you'd be the first resident.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {residents.map((resident) => (
            <ResidentRow key={resident.id} resident={resident} showMatch={showMatch} />
          ))}
          {privateCount > 0 && (
            <li className="flex items-center gap-3 py-3 text-small text-muted last:pb-0">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sunken">
                <Icon name="lock" size={15} />
              </span>
              + {privateCount} private {privateCount === 1 ? 'resident' : 'residents'}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}