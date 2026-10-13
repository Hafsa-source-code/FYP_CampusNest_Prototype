// What this file does:
// The pop-up where a student writes (or edits) the review of their stay:
// pick 1–5 stars and write at least 20 characters, then publish.
// Show it with {open && <WriteReviewModal ... />} so it starts fresh every time it opens.

import { useState } from 'react'
import { Button, Field, Icon, Modal, Textarea } from '@/components/ui'
import { cn } from '@/utils/cn'
import { MIN_REVIEW_LENGTH, STAR_LABELS } from '../constants'

const STAR_NUMBERS = [1, 2, 3, 4, 5]

/** Five big clickable stars, with the word for the picked number ("Very good"). */
function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {STAR_NUMBERS.map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onChange(number)}
            aria-label={`${number} stars`}
            className="-m-1 rounded-full p-1 transition-transform hover:scale-110 hover:bg-sunken"
          >
            <Icon
              name="star"
              size={32}
              filled={number <= value}
              strokeWidth={1.5}
              className={number <= value ? 'text-star' : 'text-line-strong'}
            />
          </button>
        ))}
      </div>
      {value > 0 && <span className="text-body font-semibold text-ink">{STAR_LABELS[value]}</span>}
    </div>
  )
}

/**
 * hostelName: shown in the title
 * review: the existing review when editing (undefined when writing a new one)
 * onSave(rating, text) / onClose()
 */
export function WriteReviewModal({ hostelName, review, onSave, onClose }) {
  const [rating, setRating] = useState(review?.rating ?? 0)
  const [text, setText] = useState(review?.text ?? '')
  const length = text.trim().length
  const isLongEnough = length >= MIN_REVIEW_LENGTH

  return (
    <Modal
      open
      onClose={onClose}
      title={`Review your stay at ${hostelName}`}
      description="Be specific and fair — this helps the next student and the owner."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!rating || !isLongEnough} onClick={() => onSave(rating, text.trim())}>
            {review ? 'Save changes' : 'Publish review'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-small font-medium text-ink">Overall rating</p>
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <Field
          label="Your review"
          hint="Think about cleanliness, management, food, safety and the commute."
        >
          <Textarea
            rows={5}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="What should the next student know?"
          />
        </Field>
        <p
          className={cn(
            'tabular -mt-3 text-caption',
            isLongEnough ? 'text-success' : 'text-muted',
          )}
        >
          {length}/{MIN_REVIEW_LENGTH} characters minimum
        </p>
      </div>
    </Modal>
  )
}