import { IconCircle } from '@/components/ui'

/** Blue box with the AI-written summary of a hostel's reviews. */
export function ReviewSummary({ summary, reviewCount }) {
  return (
    <div className="mb-8 rounded-xl border border-brand-200 bg-brand-50 p-5">
      <p className="flex items-center gap-2 text-small font-semibold text-brand-800">
        <IconCircle icon="sparkles" size={28} tone="solid" />
        What residents mention most
      </p>
      <p className="mt-3 text-body-lg leading-relaxed text-ink-2">{summary}</p>
      <p className="mt-3 text-caption text-muted">
        AI summary generated from {reviewCount} verified reviews.
      </p>
    </div>
  )
}