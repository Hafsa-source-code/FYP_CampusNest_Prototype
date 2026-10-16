// What this file does:
// The logged-in student's inquiries, newest first, each with what the inquiries page shows:
// the hostel (id, name, photo), room type (name, price), room number, and the last message.
// TEMPORARY: built from the demo store; later one backend call returns this.

import { useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useStore } from '@/store'
import { SENDER } from '../constants'

/** "You: Thank you, see you Thursday" — the grey line under each inquiry in the list. */
function previewOf(chat) {
  const last = chat[chat.length - 1]
  if (!last) return undefined
  return `${last.from === SENDER.STUDENT ? 'You: ' : ''}${last.text}`
}

export function useMyInquiries() {
  const { user } = useAuth()
  const { inquiries, hostel, roomTypes, rooms } = useStore()

  return useMemo(
    () =>
      inquiries
        .filter((inquiry) => inquiry.studentId === user.id)
        .map((inquiry) => {
          const roomId = inquiry.assignedRoomId ?? inquiry.roomId // owner may change the room
          return {
            ...inquiry,
            hostel: hostel(inquiry.hostelId),
            roomType: roomTypes.find((type) => type.id === inquiry.roomTypeId),
            roomNumber: rooms.find((room) => room.id === roomId)?.number,
            preview: previewOf(inquiry.chat),
          }
        })
        .filter((inquiry) => inquiry.hostel && inquiry.roomType),
    [inquiries, hostel, roomTypes, rooms, user.id],
  )
}