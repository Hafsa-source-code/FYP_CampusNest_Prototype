import { useState } from 'react'
import { useHostelReviews } from '../hooks/useHostelReviews'
import { NoReviews } from './NoReviews'
import { ReportReviewModal } from './ReportReviewModal'
import { ReviewCard } from './ReviewCard'
import { ReviewSummary } from './ReviewSummary'

/** A hostel's reviews block: AI summary, review cards, and the report pop-up. */
export function HostelReviews({ hostelId, hostelName }) {
  const { reviews, total, summary } = useHostelReviews(hostelId)
  const [reporting, setReporting] = useState(null) // the review being reported

  if (reviews.length === 0) return <NoReviews />

  return (
    <>
      {summary && <ReviewSummary summary={summary} reviewCount={total} />}

      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} onReport={setReporting} />
        ))}
      </div>

      <ReportReviewModal
        review={reporting}
        hostelName={hostelName}
        onClose={() => setReporting(null)}
      />
    </>
  )
}