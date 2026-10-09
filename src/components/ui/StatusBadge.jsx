import { Badge } from './Badge'

// Which colour each status gets. Add new statuses here, nowhere else.
const STATUS_TONES = {
  // Inquiry
  Pending: 'warning',
  'Moved In': 'success',
  Declined: 'neutral',
  Cancelled: 'neutral',
  Expired: 'neutral',
  // Hostel
  Verified: 'success',
  Approved: 'success', // TEMPORARY: demo data still says "Approved"; remove after renaming
  Rejected: 'danger',
  Deactivated: 'neutral',
  // User
  Active: 'success',
  Banned: 'danger',
}

/** Badge that picks its colour from the status text. Usage: <StatusBadge status="Pending" /> */
export function StatusBadge({ status }) {
  return (
    <Badge tone={STATUS_TONES[status] ?? 'neutral'} dot>
      {status}
    </Badge>
  )
}
