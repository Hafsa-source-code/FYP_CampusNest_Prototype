import { Icon } from '@/components/ui'

/** The owner's one public reply under a review. */
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