// What this file does:
// The review part of a Moved-In inquiry. Before the student has reviewed: a green box
// "You moved in on …" with a "Write a review" button. After: their review with Edit and Delete.
// Opens the review pop-up for writing or editing.

import { useState } from 'react'
import { Button, Icon, Stars } from '@/components/ui'
import { Notice, toast } from '@/components/feedback'
import { useMyReview } from '../hooks/useMyReview'
import { OwnerReply } from './OwnerReply'
import { WriteReviewModal } from './WriteReviewModal'

/** The student's published review, with Edit / Delete buttons. */
function MyReview({ review, onEdit, onDelete }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-small font-semibold text-ink">
          <Icon name="star" size={14} filled className="text-star" />
          Your review
        </p>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" icon="edit" onClick={onEdit}>
            Edit
          </Button>
          <Button size="sm" variant="danger-ghost" icon="trash" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
      <Stars value={review.rating} size={14} className="mt-1" />
      <p className="mt-2 text-body leading-relaxed text-ink-2">{review.text}</p>
      {review.reply && <OwnerReply text={review.reply} />}
    </div>
  )
}

/** inquiry: a Moved-In inquiry from useMyInquiries (has .hostel and .actualMoveIn) */
export function StayReview({ inquiry }) {
  const { review, save, remove } = useMyReview(inquiry.id)
  const [writing, setWriting] = useState(false)

  const publish = (rating, text) => {
    save(rating, text)
    setWriting(false)
    toast(review ? 'Review updated' : 'Review published')
  }

  const deleteReview = () => {
    remove()
    toast('Review deleted')
  }

  return (
    <>
      {review ? (
        <MyReview review={review} onEdit={() => setWriting(true)} onDelete={deleteReview} />
      ) : (
        <Notice
          tone="success"
          icon="star"
          title={`You moved in on ${inquiry.actualMoveIn}`}
          action={
            <Button size="sm" icon="pen" onClick={() => setWriting(true)}>
              Write a review
            </Button>
          }
        >
          Help the next student decide — your review will be marked as a verified stay.
        </Notice>
      )}

      {writing && (
        <WriteReviewModal
          hostelName={inquiry.hostel.name}
          review={review}
          onSave={publish}
          onClose={() => setWriting(false)}
        />
      )}
    </>
  )
}