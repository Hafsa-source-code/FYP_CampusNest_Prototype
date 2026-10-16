// What this file does:
// Fixed values for inquiries (a student asking an owner about a specific room).
// The status names must match the backend exactly.

export const INQUIRY_STATUS = {
  PENDING: 'Pending',
  MOVED_IN: 'Moved In',
  DECLINED: 'Declined',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
}

/** Statuses where the conversation is still open (shown under the "Active" filter). */
export const OPEN_STATUSES = [INQUIRY_STATUS.PENDING, INQUIRY_STATUS.MOVED_IN]

/** Who wrote a chat message. */
export const SENDER = { STUDENT: 'student', OWNER: 'owner' }

/** Filter tabs on the student's inquiries page. */
export const INQUIRY_FILTERS = { ALL: 'All', ACTIVE: 'Active', CLOSED: 'Closed' }

/** A pending inquiry with no owner reply expires after this many days. */
export const EXPIRY_DAYS = 14

/** The message to the owner must be at least this long. */
export const MIN_MESSAGE_LENGTH = 10

/** Stay lengths the student can pick, in months. */
export const STAY_MONTHS = [3, 4, 6, 8, 10, 12]

export const DEFAULT_STAY_MONTHS = 6