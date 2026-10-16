// What this file does:
// The student's own review for one stay (one Moved-In inquiry), plus save and delete.
// One review per stay: saving again updates the same review.
// TEMPORARY: reads and writes the demo store; later these call the backend.

import { useStore } from '@/store'

export function useMyReview(inquiryId) {
  const { reviews, submitReview, deleteReview } = useStore()

  return {
    review: reviews.find((review) => review.inquiryId === inquiryId),
    save: (rating, text) => submitReview(inquiryId, rating, text),
    remove: () => deleteReview(inquiryId),
  }
}