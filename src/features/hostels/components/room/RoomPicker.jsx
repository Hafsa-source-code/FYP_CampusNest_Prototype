// What this file does:
// Step 1 of the room page, "Choose your room": a grid of every physical room of this type.
// The student can show all rooms or only rooms with free seats, pick one, and see who lives there.
// If the student has no roommate profile yet, a blue box invites them to make one (to see match %).

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Icon, IconCircle, SegmentedControl, StepHeading } from '@/components/ui'
import { PATHS } from '@/routes/paths'
import { SeatIcons } from '../SeatIcons'
import { ResidentPanel } from './ResidentPanel'
import { RoomTile } from './RoomTile'

const SHOW_ALL = 'All rooms'
const SHOW_FREE = 'Free seats only'

/** Explains the seat circles: dark = taken, green = free. */
function SeatLegend() {
  return (
    <div className="flex items-center gap-4 text-caption text-muted">
      <span className="inline-flex items-center gap-1.5">
        <SeatIcons total={1} free={0} size={16} />
        Taken
      </span>
      <span className="inline-flex items-center gap-1.5">
        <SeatIcons total={1} free={1} size={16} />
        Free
      </span>
    </div>
  )
}

/** Blue box asking the student to fill in their roommate profile (unlocks match scores). */
function ProfilePrompt() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-brand-200 bg-brand-50 p-4 sm:flex-row sm:items-center">
      <IconCircle icon="users" size={44} tone="solid" />
      <div className="flex-1">
        <p className="text-body font-semibold text-brand-800">
          See how well you'd match current residents
        </p>
        <p className="text-small text-ink-2">
          Fill in a two-minute roommate profile to see compatibility scores.
        </p>
      </div>
      <Button
        size="sm"
        iconRight="chevronRight"
        className="self-start rounded-full sm:self-auto"
        onClick={() => navigate(PATHS.student.roommateProfile)}
      >
        Create profile
      </Button>
    </div>
  )
}

/**
 * rooms: from useRoomDetail
 * selectedRoom / onSelect: the picked room (the page keeps it, because step 2 needs it too)
 * showMatch: the student has a roommate profile
 */
export function RoomPicker({ rooms, selectedRoom, onSelect, showMatch }) {
  const [show, setShow] = useState(SHOW_ALL)
  const visibleRooms = show === SHOW_FREE ? rooms.filter((room) => room.freeSeats > 0) : rooms

  return (
    <>
      <StepHeading
        number={1}
        done={Boolean(selectedRoom)}
        title="Choose your room"
        subtitle="Pick the room you'd like. The owner may offer another room of the same type if needed."
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <SeatLegend />
        <SegmentedControl options={[SHOW_ALL, SHOW_FREE]} value={show} onChange={setShow} />
      </div>

      {!showMatch && (
        <div className="mt-5">
          <ProfilePrompt />
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-3">
        {visibleRooms.map((room) => (
          <RoomTile
            key={room.id}
            room={room}
            selected={room.id === selectedRoom?.id}
            showMatch={showMatch}
            onSelect={() => onSelect(room.id)}
          />
        ))}
      </div>

      {selectedRoom && (
        <div className="mt-5">
          <ResidentPanel room={selectedRoom} showMatch={showMatch} />
        </div>
      )}

      <p className="mt-4 flex items-center gap-2 text-small text-muted">
        <Icon name="lock" size={14} />
        Only residents who chose to be visible are shown, by first name.
      </p>
    </>
  )
}