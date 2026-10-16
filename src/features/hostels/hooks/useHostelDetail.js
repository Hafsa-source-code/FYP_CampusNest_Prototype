import { useMemo } from 'react'
import { useStore } from '@/store'
import { HOSTEL_STATUS } from '@/utils/constants'
import { useHostelSummary } from './useHostelSummaries'

// TEMPORARY demo value. Later the backend works it out from how fast the owner answers inquiries.
const DEMO_OWNER_REPLY_TIME = 'within 2 hours'

/**
 * Everything the hostel page shows about one hostel, or null if students can't see it
 * (doesn't exist, or isn't Verified).
 * Each room type also gets roomCount and freeSeats.
 * TEMPORARY: built from the demo store; later one backend call returns this.
 */
export function useHostelDetail(hostelId) {
  const hostel = useHostelSummary(hostelId)
  const { roomsFor } = useStore()

  return useMemo(() => {
    if (!hostel || hostel.status !== HOSTEL_STATUS.VERIFIED) return null

    const roomTypes = hostel.roomTypes.map((roomType) => {
      const rooms = roomsFor(roomType.id)
      return {
        ...roomType,
        photo: roomType.photoUrls[0],
        roomCount: rooms.length,
        freeSeats: rooms.reduce((total, room) => total + room.freeSeats, 0),
      }
    })

    return { ...hostel, roomTypes, ownerReplyTime: DEMO_OWNER_REPLY_TIME }
  }, [hostel, roomsFor])
}