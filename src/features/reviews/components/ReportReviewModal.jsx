import { useState } from 'react'
import { Button, Field, Modal, Textarea } from '@/components/ui'
import { toast } from '@/components/feedback'
import { useReportReview } from '../hooks/useReportReview'

/**
 * Pop-up where a student says what's wrong with a review.
 * review: the review being reported, or null when the pop-up is closed
 */
export function ReportReviewModal({ review, hostelName, onClose }) {
  const reportReview = useReportReview()
  const [reason, setReason] = useState('')

  const close = () => {
    setReason('')
    onClose()
  }

  const send = () => {
    reportReview({ review, hostelName, reason: reason.trim() })
    toast('Report sent to moderators')
    close()
  }

  return (
    <Modal
      open={review !== null}
      onClose={close}
      title="Report this review"
      description="Our moderation team reviews every report within 24 hours."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button disabled={!reason.trim()} onClick={send}>
            Send report
          </Button>
        </>
      }
    >
      <Field label="What's wrong with this review?">
        <Textarea
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="For example: the reviewer never lived here, or it contains abusive language."
        />
      </Field>
    </Modal>
  )
}