import { useState } from 'react'
import { useStore } from '../store'
import { navigate, rs, cx } from '../lib'
import { Icon } from '../components/icons'
import {
  Avatar,
  Button,
  EmptyState,
  Field,
  Input,
  Modal,
  StatusBadge,
  Textarea,
  toast,
} from '../components/ui'
import {
  ChatThread,
  Composer,
  StatusTracker,
  DetailChip,
  StudentListItem,
} from '../components/inquiry/InquiryParts'
import { ConsoleTitle, PillTabs } from '../components/admin/AdminParts'
import { SeatIcons } from '../components/room/RoomParts'
const CLOSED = ['Declined', 'Cancelled', 'Expired']
const inTab = (t, status) =>
  t === 'All' ||
  (t === 'Pending' && status === 'Pending') ||
  (t === 'Moved in' && status === 'Moved In') ||
  (t === 'Closed' && CLOSED.includes(status))
// Inbox fills the space under the title + tabs, so the page itself doesn't scroll
const INBOX_H = 'xl:h-[calc(100vh-250px)] xl:min-h-[520px]'
export function OwnerInquiries({ selectedId }) {
  const s = useStore()
  const h = s.hostel(s.ownerHostelId)
  const all = s.inquiries.filter((i) => i.hostelId === s.ownerHostelId)
  const [tab, setTab] = useState('Pending')
  const list = all.filter((i) => inTab(tab, i.status))
  const sel = all.find((i) => i.id === selectedId) ?? list[0]
  const [moveOpen, setMoveOpen] = useState(false)
  const [declineOpen, setDeclineOpen] = useState(false)
  const [date, setDate] = useState('')
  const [roomId, setRoomId] = useState('')
  const [reason, setReason] = useState('')
  // Data for the open conversation (unchanged)
  const student = sel && s.user(sel.studentId)
  const type = sel && s.roomTypes.find((t) => t.id === sel.roomTypeId)
  const requested = sel && s.rooms.find((r) => r.id === sel.roomId)
  const options = sel
    ? s.rooms.filter((r) => r.roomTypeId === sel.roomTypeId && r.freeSeats > 0)
    : []
  const openMove = () => {
    setRoomId(
      requested && requested.freeSeats > 0 ? String(requested.id) : String(options[0]?.id ?? ''),
    )
    setDate('')
    setMoveOpen(true)
  }
  const tabs = [
    ['Pending', 'clock'],
    ['Moved in', 'home'],
    ['Closed', 'lock'],
    ['All', 'grid'],
  ].map(([key, icon]) => ({
    key,
    label: key,
    icon,
    count: all.filter((i) => inTab(key, i.status)).length,
  }))
  const previewOf = (chat) => {
    const last = chat[chat.length - 1]
    return last ? `${last.from === 'owner' ? 'You: ' : ''}${last.text}` : undefined
  }
  const first = student?.name.split(' ')[0]
  return (
    <>
      <ConsoleTitle
        icon="inbox"
        title="Inquiries"
        subtitle={h ? `Messages from students interested in ${h.name}.` : undefined}
      />
      <PillTabs options={tabs} value={tab} onChange={setTab} />

      {list.length === 0 && !sel ? (
        <div className="mt-4 rounded-xl border border-line bg-surface">
          <EmptyState
            icon="inbox"
            title={tab === 'Pending' ? 'No inquiries waiting' : 'Nothing here'}
            description={
              tab === 'Pending'
                ? "You've replied to everyone. New inquiries appear here and in your notifications."
                : undefined
            }
          />
        </div>
      ) : (
        <div
          className={cx(
            'mt-4 rounded-xl border border-line bg-surface shadow-card overflow-hidden grid xl:grid-cols-[340px_1fr]',
            INBOX_H,
          )}
        >
          {/*  Left: students  */}
          <aside className="xl:border-r border-line flex flex-col min-h-0">
            <div className="h-12 px-4 flex items-center justify-between border-b border-line shrink-0">
              <p className="text-body font-semibold text-ink flex items-center gap-2">
                <Icon name="users" size={15} className="text-brand-700" />
                Students
              </p>
              <span className="text-caption text-muted tabular">{list.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-line max-h-[360px] xl:max-h-none">
              {list.length === 0 ? (
                <p className="p-6 text-center text-small text-muted">
                  No {tab.toLowerCase()} inquiries.
                </p>
              ) : (
                list.map((i) => (
                  <StudentListItem
                    key={i.id}
                    name={s.user(i.studentId)?.name ?? '?'}
                    status={i.status}
                    roomType={s.roomTypes.find((t) => t.id === i.roomTypeId)?.name}
                    moveIn={i.moveIn}
                    preview={previewOf(i.chat)}
                    active={sel?.id === i.id}
                    onClick={() => navigate(`/o/inquiries/${i.id}`)}
                  />
                ))
              )}
            </div>
          </aside>

          {/*  Right: conversation  */}
          {sel && student && type ? (
            <section className="flex flex-col min-h-0 border-t xl:border-t-0 border-line">
              {/* Header + actions */}
              <div className="px-4 sm:px-5 py-3.5 border-b border-line flex flex-wrap items-center gap-3 shrink-0">
                <Avatar name={student.name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-body-lg font-semibold text-ink truncate">{student.name}</p>
                  <p className="flex items-center gap-1 text-caption text-muted">
                    <Icon name="shieldCheck" size={13} className="text-success" />
                    Verified student · {student.email.split('@')[1]}
                  </p>
                </div>
                {sel.status === 'Pending' ? (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      icon="x"
                      onClick={() => {
                        setReason('')
                        setDeclineOpen(true)
                      }}
                    >
                      Decline
                    </Button>
                    <Button icon="home" onClick={openMove}>
                      Mark as moved in
                    </Button>
                  </div>
                ) : (
                  <StatusBadge status={sel.status} />
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {/* Status + details */}
                <div className="p-4 sm:p-5 border-b border-line space-y-4">
                  <StatusTracker status={sel.status} />
                  <div className="grid grid-cols-2 2xl:grid-cols-4 gap-2.5">
                    <DetailChip icon="door" label="Room type" value={type.name} />
                    <DetailChip
                      icon="bed"
                      label="Requested room"
                      value={requested ? `Room ${requested.number}` : '—'}
                    />
                    <DetailChip
                      icon="calendar"
                      label={sel.actualMoveIn ? 'Moved in' : 'Move-in'}
                      value={sel.actualMoveIn ?? sel.moveIn}
                    />
                    <DetailChip
                      icon="clock"
                      label="Stay length"
                      value={`${sel.duration} months · ${rs(type.price * sel.duration)}`}
                    />
                  </div>
                  {sel.status === 'Declined' && (
                    <div className="flex gap-2.5 rounded-lg bg-sunken p-3.5 text-body">
                      <Icon name="x" size={16} className="mt-0.5 shrink-0 text-muted" />
                      <div>
                        <p className="font-semibold text-ink">You declined this inquiry</p>
                        <p className="text-muted">{sel.declineReason || 'No reason given.'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="p-4 sm:p-6 bg-canvas min-h-[220px]">
                  <ChatThread inquiry={sel} me="owner" otherName={student.name} />
                </div>
              </div>

              {/* Message bar */}
              {sel.status === 'Pending' || sel.status === 'Moved In' ? (
                <div className="p-3 sm:p-4 border-t border-line shrink-0">
                  <Composer
                    placeholder={`Reply to ${first}…`}
                    onSend={(t) => s.sendInquiryMessage(sel.id, 'owner', t)}
                  />
                </div>
              ) : (
                <div className="p-4 border-t border-line flex items-center justify-center gap-1.5 text-small text-muted shrink-0">
                  <Icon name="lock" size={13} />
                  This conversation is closed.
                </div>
              )}
            </section>
          ) : (
            <div className="hidden xl:flex items-center justify-center">
              <EmptyState
                icon="message"
                title="Select an inquiry"
                description="Choose a student on the left."
              />
            </div>
          )}
        </div>
      )}

      {/*  Mark as moved in  */}
      <Modal
        open={moveOpen}
        onClose={() => setMoveOpen(false)}
        title={`Confirm ${first} has moved in`}
        description="Pick the actual date and the room they're staying in."
        footer={
          <>
            <Button variant="secondary" onClick={() => setMoveOpen(false)}>
              Cancel
            </Button>
            <Button
              icon="check"
              disabled={!date || !roomId}
              onClick={() => {
                if (!sel) return
                s.markInquiryMovedIn(
                  sel.id,
                  Number(roomId),
                  new Date(date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }),
                )
                setMoveOpen(false)
                toast('Marked as moved in')
              }}
            >
              Confirm move-in
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {requested && requested.freeSeats === 0 && (
            <div className="flex gap-2.5 rounded-lg border border-[#EFDDB3] bg-warning-bg p-3 text-small text-warning">
              <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
              Room {requested.number} is now full — choose another room of the same type.
            </div>
          )}

          <Field label="Actual move-in date" required>
            <Input
              type="date"
              icon="calendar"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>

          <div>
            <p className="mb-1.5 text-small font-medium text-ink">
              Room <span className="text-danger">*</span>
            </p>
            {options.length === 0 ? (
              <p className="text-small text-muted">No rooms of this type have a free seat.</p>
            ) : (
              <div role="radiogroup" className="grid grid-cols-2 gap-2">
                {options.map((r) => {
                  const on = String(r.id) === roomId
                  return (
                    <button
                      key={r.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setRoomId(String(r.id))}
                      className={cx(
                        'relative text-left rounded-lg border-2 p-3 transition-colors',
                        on ? 'border-brand-700 bg-brand-50' : 'border-line hover:border-brand-200',
                      )}
                    >
                      {on && (
                        <span className="absolute right-2 top-2 h-5 w-5 rounded-full bg-brand-700 text-white flex items-center justify-center">
                          <Icon name="check" size={11} strokeWidth={3} />
                        </span>
                      )}
                      <p className="tracking-tight text-title-sm leading-none font-semibold text-ink">
                        {r.number}
                      </p>
                      {r.id === requested?.id && (
                        <p className="mt-1 text-tiny font-semibold text-brand-700">Requested</p>
                      )}
                      <div className="mt-2">
                        <SeatIcons total={r.totalSeats} free={r.freeSeats} size={18} />
                      </div>
                      <p className="mt-1 text-tiny text-success tabular">
                        {r.freeSeats} of {r.totalSeats} free
                      </p>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-sunken p-3.5">
            <p className="text-caption font-semibold text-ink">What happens next</p>
            <ul className="mt-1.5 space-y-1">
              {[
                'Fills a seat in the chosen room',
                'Lists them as a resident of that room',
                'Unlocks their verified review',
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 text-caption text-ink-2">
                  <Icon name="check" size={12} strokeWidth={3} className="text-success" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>

      {/*  Decline  */}
      <Modal
        open={declineOpen}
        onClose={() => setDeclineOpen(false)}
        size="sm"
        title="Decline this inquiry?"
        description="The student is notified and sees your reason."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeclineOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              icon="x"
              onClick={() => {
                if (sel) s.declineInquiry(sel.id, reason.trim())
                setDeclineOpen(false)
                toast('Inquiry declined')
              }}
            >
              Decline
            </Button>
          </>
        }
      >
        <span className="mb-4 h-11 w-11 rounded-full bg-danger-bg text-danger flex items-center justify-center">
          <Icon name="x" size={20} />
        </span>
        <Field label="Reason" optional>
          <Textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. No seats free for those dates."
          />
        </Field>
      </Modal>
    </>
  )
}
