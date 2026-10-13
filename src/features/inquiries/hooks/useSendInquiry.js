// Sends a new inquiry for one specific room to the hostel owner, and returns the new inquiry's id.
// TEMPORARY: writes to the demo store; later this calls the backend.

import { useStore } from '@/store'
import { formatDate } from '@/utils/formatters'

export function useSendInquiry() {
  const { createInquiry } = useStore()

  /** moveInDate: "2026-10-01" from the date box; months: stay length */
  return ({ hostelId, roomTypeId, roomId, moveInDate, months, message }) =>
    createInquiry({
      hostelId,
      roomTypeId,
      roomId,
      moveIn: formatDate(moveInDate),
      duration: months,
      message,
    })
}