// What this file does:
// The summary at the top of an open inquiry: the progress line, four facts
// (move-in, stay length, rent, date sent), a coloured note explaining the status,
// and — once the student has moved in — the review section.

import { InfoTile } from '@/components/ui'
import { Notice } from '@/components/feedback'
import { StayReview } from '@/features/reviews/components/StayReview'
import { formatPrice } from '@/utils/formatters'
import { EXPIRY_DAYS, INQUIRY_STATUS } from '../constants'
import { InquiryStatusTracker } from './InquiryStatusTracker'

/** The coloured note for closed inquiries. Pending has no note; Moved In shows the review section. */
function ClosedNotice({ inquiry }) {
  switch (inquiry.status) {
    case INQUIRY_STATUS.DECLINED:
      return (
        <Notice tone="danger" title="The owner declined this inquiry">
          {inquiry.declineReason ?? 'No reason was given.'}
        </Notice>
      )
    case INQUIRY_STATUS.EXPIRED:
      return (
        <Notice tone="neutral" icon="clock" title="This inquiry expired">
          The owner didn't respond within {EXPIRY_DAYS} days. You can send a new inquiry from the
          hostel page.
        </Notice>
      )
    case INQUIRY_STATUS.CANCELLED:
      return <Notice tone="neutral" icon="x" title="You cancelled this inquiry" />
    default:
      return null
  }
}

/** inquiry: from useMyInquiries */
export function InquiryOverview({ inquiry }) {
  const facts = [
    { icon: 'calendar', label: 'Move-in', value: inquiry.actualMoveIn ?? inquiry.moveIn },
    { icon: 'clock', label: 'Stay length', value: `${inquiry.duration} months` },
    { icon: 'tag', label: 'Rent', value: `${formatPrice(inquiry.roomType.price)} / seat` },
    { icon: 'send', label: 'Sent', value: inquiry.date },
  ]

  return (
    <div className="space-y-5 border-b border-line p-4 sm:p-5">
      <InquiryStatusTracker status={inquiry.status} />

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {facts.map((fact) => (
          <InfoTile key={fact.label} {...fact} />
        ))}
      </div>

      <ClosedNotice inquiry={inquiry} />
      {inquiry.status === INQUIRY_STATUS.MOVED_IN && <StayReview inquiry={inquiry} />}
    </div>
  )
}