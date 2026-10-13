import { HOSTEL_STATUS } from '@/utils/constants'

// TEMPORARY: fixes the old demo data so new code only sees the agreed values.
// Delete this file when the demo data is gone (the backend will send correct values).
//  1. Old status name 'Approved' → our agreed name 'Verified'
//  2. 'AC' is not a hostel facility any more (AC belongs to each room type)

const ROOM_LEVEL_FACILITIES = ['AC']

export function normalizeHostel(hostel) {
  return {
    ...hostel,
    status: hostel.status === 'Approved' ? HOSTEL_STATUS.VERIFIED : hostel.status,
    facilities: (hostel.facilities ?? []).filter(
      (facility) => !ROOM_LEVEL_FACILITIES.includes(facility),
    ),
  }
}