import { Avatar, Icon, IconButton, Menu, Stars } from '@/components/ui'
import { OwnerReply } from './OwnerReply'

/** One review: who wrote it, stars, text, the owner's reply, and a "Report" menu. */
export function ReviewCard({ review, onReport }) {
  return (
    <article className="rounded-xl border border-line bg-surface p-5">
      <div className="flex items-center gap-3">
        <Avatar name={review.studentName} size={42} />
        <div className="min-w-0 flex-1">
          <p className="text-body font-semibold text-ink">{review.studentName}</p>
          <p className="flex items-center gap-1 text-caption text-muted">
            <Icon name="shieldCheck" size={13} className="text-success" />
            Verified resident · {review.date}
          </p>
        </div>
        <Menu
          trigger={(_, toggle) => (
            <IconButton icon="more" label="Review options" size="sm" onClick={toggle} />
          )}
          items={[{ label: 'Report review', icon: 'flag', onClick: () => onReport(review) }]}
        />
      </div>

      <Stars value={review.rating} size={14} className="mt-4" />
      <p className="mt-2 text-body-lg leading-relaxed text-ink-2">{review.text}</p>
      {review.reply && <OwnerReply text={review.reply} />}
    </article>
  )
}