// Step 2 of the room page, "Send an inquiry": shows the picked room, asks for the move-in date,
// stay length and a message to the owner, shows the estimated cost, and sends the inquiry.
// After sending, the student is taken to that inquiry's conversation.

import { useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { Button, Field, Icon, Input, Photo, Select, StepHeading, Textarea } from '@/components/ui'
import { toast } from '@/components/feedback'
import { PATHS } from '@/routes/paths'
import { formatPrice } from '@/utils/formatters'
import { DEFAULT_STAY_MONTHS, MIN_MESSAGE_LENGTH, STAY_MONTHS } from '../constants'
import { useSendInquiry } from '../hooks/useSendInquiry'

/** Grey box: photo + "Room 203 · 3-Seater AC Room", with a tick once a room is picked. */
function SelectedRoom({ room, roomType }) {
  return (
    <div className="mt-5 flex items-center gap-3 rounded-lg bg-sunken p-3">
      <Photo src={roomType.photo} alt="" ratio="1/1" className="w-14 shrink-0" />
      <div className="min-w-0">
        <p className="text-caption text-muted">Selected room</p>
        <p className="truncate text-body-lg font-semibold text-ink">
          {room ? `Room ${room.number} · ${roomType.name}` : 'Choose a room on the left'}
        </p>
      </div>
      {room && <Icon name="check" size={18} strokeWidth={2.5} className="ml-auto text-success" />}
    </div>
  )
}

/** "Rs 15,500 × 6 months = Rs 93,000". A guide only: rent is paid to the owner, not on CampusNest. */
function CostEstimate({ price, months }) {
  const total = formatPrice(price * months)

  return (
    <div className="mt-5 space-y-2 rounded-lg border border-line p-4 text-body">
      <div className="flex justify-between text-muted">
        <span>
          {formatPrice(price)} × {months} months
        </span>
        <span className="tabular text-ink">{total}</span>
      </div>
      <div className="flex justify-between border-t border-line pt-2 font-semibold text-ink">
        <span>Estimated total</span>
        <span className="tabular text-brand-700">{total}</span>
      </div>
    </div>
  )
}

/** hostel / roomType: from useRoomDetail; room: the picked room (or undefined) */
export function InquiryForm({ hostel, roomType, room }) {
  const navigate = useNavigate()
  const sendInquiry = useSendInquiry()
  const [moveInDate, setMoveInDate] = useState('')
  const [months, setMonths] = useState(DEFAULT_STAY_MONTHS)
  const [message, setMessage] = useState('')

  const messageLength = message.trim().length
  const charactersMissing = messageLength > 0 ? MIN_MESSAGE_LENGTH - messageLength : 0
  const canSend =
    room?.freeSeats > 0 && Boolean(moveInDate) && messageLength >= MIN_MESSAGE_LENGTH

  const send = () => {
    const inquiryId = sendInquiry({
      hostelId: hostel.id,
      roomTypeId: roomType.id,
      roomId: room.id,
      moveInDate,
      months,
      message: message.trim(),
    })
    toast('Inquiry sent to the owner')
    navigate(generatePath(PATHS.student.inquiry, { id: inquiryId }))
  }

  return (
    <div className="sticky top-24 rounded-xl border border-line bg-surface p-6 shadow-card">
      <StepHeading
        number={2}
        title="Send an inquiry"
        subtitle={`The owner replies on CampusNest, usually ${hostel.ownerReplyTime}.`}
      />

      <SelectedRoom room={room} roomType={roomType} />

      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Move-in date" required>
            <Input
              type="date"
              icon="calendar"
              value={moveInDate}
              onChange={(event) => setMoveInDate(event.target.value)}
            />
          </Field>
          <Field label="Stay length">
            <Select
              icon="clock"
              value={months}
              onChange={(event) => setMonths(Number(event.target.value))}
            >
              {STAY_MONTHS.map((count) => (
                <option key={count} value={count}>
                  {count} months
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field
          label="Message to the owner"
          required
          hint="Introduce yourself: university, programme, year, and when you'd like to visit."
        >
          <Textarea
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Assalam-o-Alaikum, I'm a second-year BBA student at PU New Campus…"
          />
        </Field>
        {charactersMissing > 0 && (
          <p className="tabular -mt-2 text-caption text-muted">
            {charactersMissing} more characters needed
          </p>
        )}
      </div>

      <CostEstimate price={roomType.price} months={months} />

      <Button full size="lg" icon="send" className="mt-5" disabled={!canSend} onClick={send}>
        Send inquiry
      </Button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-small text-muted">
        <Icon name="shieldCheck" size={14} className="text-success" />
        No payment now. Your contact details stay private.
      </p>
    </div>
  )
}