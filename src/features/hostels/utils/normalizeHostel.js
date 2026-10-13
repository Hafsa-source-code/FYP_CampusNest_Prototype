import { HOSTEL_STATUS } from '@/utils/constants'

// TEMPORARY: the old demo data says 'Approved'; our agreed name is 'Verified'.
// Every hostel passes through here so new code only ever sees 'Verified'.
// Delete this when the demo data (or the backend) uses 'Verified'.
export function normalizeHostel(hostel) {
  return hostel.status === 'Approved' ? { ...hostel, status: HOSTEL_STATUS.VERIFIED } : hostel
}
