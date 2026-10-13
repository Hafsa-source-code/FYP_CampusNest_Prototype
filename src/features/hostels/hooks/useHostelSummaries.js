import { useMemo } from 'react'
import { useStore } from '@/store'
import { HOSTEL_STATUS } from '@/utils/constants'
import { normalizeHostel } from '../utils/normalizeHostel'

/**
 * Every hostel with the extra numbers cards and search need:
 * roomTypes, startingPrice, freeSeats, hasAC.
 * TEMPORARY: built from the demo store; later the backend sends these ready-made.
 */
export function useHostelSummaries() {
  const { hostels, typesFor, startingPrice, freeSeats } = useStore()

  return useMemo(
    () =>
      hostels.map((hostel) => {
        const roomTypes = typesFor(hostel.id)
        return {
          ...normalizeHostel(hostel),
          roomTypes,
          startingPrice: startingPrice(hostel.id),
          freeSeats: freeSeats(hostel.id),
          hasAC: roomTypes.some((roomType) => roomType.ac),
        }
      }),
    [hostels, typesFor, startingPrice, freeSeats],
  )
}

/** Only the hostels students are allowed to see. */
export function useVerifiedHostels() {
  const summaries = useHostelSummaries()
  return useMemo(() => summaries.filter((hostel) => hostel.status === HOSTEL_STATUS.VERIFIED), [summaries])
}

/** One hostel's summary by id (or undefined). */
export function useHostelSummary(hostelId) {
  return useHostelSummaries().find((hostel) => hostel.id === hostelId)
}