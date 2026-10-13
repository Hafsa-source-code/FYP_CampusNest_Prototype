import { useStore } from '@/store'

/** Sends a review to the admin moderation queue. TEMPORARY: writes to the demo store. */
export function useReportReview() {
  const { createReport } = useStore()

  return ({ review, hostelName, reason }) =>
    createReport({
      type: 'Reported Review',
      title: `Review on ${hostelName}`,
      reportReason: reason,
      content: review.text,
      reviewId: review.id,
    })
}