import { EmptyState } from '@/components/feedback'

/** Shown on a hostel page that has no reviews yet. */
export function NoReviews() {
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-surface">
      <EmptyState
        icon="star"
        title="No reviews yet"
        description="Only students who have moved in can leave a review."
      />
    </div>
  )
}