// Collects everything the room page needs for one room type of one hostel:
// the hostel, the room type, and every physical room with its free seats and visible residents.
// Returns null if the hostel or room type can't be shown to students.
// TEMPORARY: built from the demo store; later one backend call returns this.

import { useMemo } from 'react'
import { useStore } from '@/store'
import { useHostelDetail } from './useHostelDetail'

/** The residents of one room: the ones who chose to be visible, how many are private, best match. */
function describeResidents(allResidents) {
  const visible = allResidents.filter((resident) => resident.isPublic)
  const scores = visible.map((resident) => resident.matchScore).filter(Number.isFinite)

  return {
    residents: visible,
    privateCount: allResidents.length - visible.length,
    bestMatch: scores.length ? Math.max(...scores) : undefined,
  }
}

export function useRoomDetail(hostelId, roomTypeId) {
  const hostel = useHostelDetail(hostelId)
  const { roomsFor, residents } = useStore()

  return useMemo(() => {
    const roomType = hostel?.roomTypes.find((type) => type.id === roomTypeId)
    if (!roomType) return null

    const rooms = roomsFor(roomTypeId).map((room) => ({
      ...room,
      ...describeResidents(residents.filter((resident) => resident.roomId === room.id)),
    }))

    return { hostel, roomType, rooms }
  }, [hostel, roomTypeId, roomsFor, residents])
}