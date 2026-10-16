// What this file does:
// Small rules for the All / Active / Closed tabs on the inquiries page:
// which inquiries belong under each tab, and how many there are in each.

import { INQUIRY_FILTERS, OPEN_STATUSES } from '../constants'

export const isOpenInquiry = (inquiry) => OPEN_STATUSES.includes(inquiry.status)

const RULES = {
  [INQUIRY_FILTERS.ALL]: () => true,
  [INQUIRY_FILTERS.ACTIVE]: isOpenInquiry,
  [INQUIRY_FILTERS.CLOSED]: (inquiry) => !isOpenInquiry(inquiry),
}

/** Only the inquiries that belong under this tab. */
export const filterInquiries = (inquiries, filter) => inquiries.filter(RULES[filter])

/** { All: 4, Active: 2, Closed: 2 } — the small numbers on the tabs. */
export const countByFilter = (inquiries) =>
  Object.fromEntries(
    Object.values(INQUIRY_FILTERS).map((filter) => [
      filter,
      filterInquiries(inquiries, filter).length,
    ]),
  )
  