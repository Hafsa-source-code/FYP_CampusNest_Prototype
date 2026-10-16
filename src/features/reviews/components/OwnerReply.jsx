// What this file does:
// The hostel owner's one public reply, shown under a review.
// Used on hostel pages (every review) and on the student's own review in their inquiry.

import { Icon } from '@/components/ui'

export function OwnerReply({ text }) {
  return (
    <div className="mt-4 rounded-md bg-sunken p-3.5">
      <p className="flex items-center gap-1.5 text-small font-semibold text-ink">
        <Icon name="message" size={13} />
        Response from the owner
      </p>
      <p className="mt-1 text-body leading-relaxed text-muted">{text}</p>
    </div>
  )
}