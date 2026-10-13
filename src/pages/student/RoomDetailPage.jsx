// What this file does:
// The room page (/student/hostel/:id/room/:type). It only puts the pieces together:
// the header and photos on top, then step 1 (choose a room) on the left and
// step 2 (send an inquiry) on the right.

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '@/components/ui'
import { HostelNotFound } from '@/features/hostels/components/HostelNotFound'
import { RoomHeader } from '@/features/hostels/components/room/RoomHeader'
import { RoomPicker } from '@/features/hostels/components/room/RoomPicker'
import { useRoomDetail } from '@/features/hostels/hooks/useRoomDetail'
import { InquiryForm } from '@/features/inquiries/components/InquiryForm'
import { useRoommateProfile } from '@/features/roommates/hooks/useRoommateProfile'

export function RoomDetailPage() {
  const { id, type } = useParams()
  const detail = useRoomDetail(Number(id), Number(type))
  const { hasProfile } = useRoommateProfile()

  const [selectedRoomId, setSelectedRoomId] = useState(null)

  if (!detail) return <HostelNotFound title="Room not found" icon="bed" />

  const { hostel, roomType, rooms } = detail
  // Until the student picks one, the first room with a free seat is picked for them
  const selectedRoom =
    rooms.find((room) => room.id === selectedRoomId) ?? rooms.find((room) => room.freeSeats > 0)

  return (
    <Container className="pb-16 pt-6">
      <RoomHeader hostel={hostel} roomType={roomType} />

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <RoomPicker
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelect={setSelectedRoomId}
            showMatch={hasProfile}
          />
        </div>

        <aside className="mt-12 lg:col-span-5 lg:mt-0">
          <InquiryForm hostel={hostel} roomType={roomType} room={selectedRoom} />
        </aside>
      </div>
    </Container>
  )
}