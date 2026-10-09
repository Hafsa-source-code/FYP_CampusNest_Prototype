import { useEffect, useRef, useState } from 'react'
import { cx } from '../../lib'
import { Icon } from '../icons'
import { Avatar, Photo, StatusBadge } from '../ui'
//  Chat (also used by the owner's inquiries page)
export function ChatThread({ inquiry, me, otherName }) {
  const end = useRef(null)
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' })
  }, [inquiry.chat.length])
  if (inquiry.chat.length === 0)
    return (
      <div className="py-12 flex flex-col items-center text-center">
        <span className="h-12 w-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
          <Icon name="message" size={20} />
        </span>
        <p className="mt-3 text-body font-semibold text-ink">No messages yet</p>
        <p className="mt-1 text-small text-muted">Start the conversation below.</p>
      </div>
    )
  return (
    <div className="space-y-4">
      {inquiry.chat.map((m) => {
        const mine = m.from === me
        return (
          <div key={m.id} className={cx('flex gap-2.5', mine ? 'justify-end' : 'justify-start')}>
            {!mine && <Avatar name={otherName} size={30} className="mt-auto" />}
            <div className="max-w-[80%] sm:max-w-[68%]">
              <div
                className={cx(
                  'rounded-[18px] px-4 py-2.5 text-body leading-relaxed shadow-card',
                  mine
                    ? 'bg-brand-700 text-white rounded-br-[6px]'
                    : 'bg-surface border border-line text-ink rounded-bl-[6px]',
                )}
              >
                {m.text}
              </div>
              <p
                className={cx(
                  'mt-1 flex items-center gap-1 text-tiny text-subtle',
                  mine && 'justify-end',
                )}
              >
                {m.time}
                {mine && <Icon name="check" size={12} className="text-brand-700" />}
              </p>
            </div>
          </div>
        )
      })}
      <div ref={end} />
    </div>
  )
}
/** Rounded message bar with a round send button. Enter sends. */
export function Composer({ onSend, placeholder }) {
  const [text, setText] = useState('')
  const send = () => {
    if (text.trim()) {
      onSend(text.trim())
      setText('')
    }
  }
  return (
    <div className="flex items-center gap-2 rounded-full border border-line-strong bg-surface pl-5 pr-1.5 py-1.5 transition-shadow focus-within:border-brand-700 focus-within:ring-[3px] focus-within:ring-brand-700/15">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
        placeholder={placeholder}
        aria-label="Message"
        className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-subtle outline-none"
      />
      <button
        onClick={send}
        disabled={!text.trim()}
        aria-label="Send message"
        className="h-10 w-10 shrink-0 rounded-full bg-brand-700 text-white flex items-center justify-center hover:bg-brand-800 transition-colors disabled:opacity-40"
      >
        <Icon name="send" size={16} />
      </button>
    </div>
  )
}
//  Inbox list
export function InquiryListItem({
  photo,
  hostelName,
  roomType,
  status,
  date,
  preview,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={cx(
        'relative w-full text-left flex gap-3 px-4 py-3.5 transition-colors',
        active ? 'bg-brand-50' : 'hover:bg-sunken',
      )}
    >
      {active && <span className="absolute left-0 inset-y-2 w-1 rounded-r-full bg-brand-700" />}
      <Photo src={photo} alt="" ratio="1/1" className="w-12 shrink-0 !rounded-full" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-body font-semibold text-ink truncate">{hostelName}</p>
          <span className="shrink-0 text-tiny text-subtle">{date}</span>
        </div>
        <p className="text-caption text-muted truncate">{roomType}</p>
        {preview && <p className="mt-1 text-small text-ink-2 truncate">{preview}</p>}
        <div className="mt-1.5">
          <StatusBadge status={status} />
        </div>
      </div>
    </button>
  )
}
/** Pill tabs with counts: All / Active / Closed. */
export function FilterTabs({ options, value, counts, onChange }) {
  return (
    <div role="tablist" className="inline-flex rounded-full bg-sunken p-1">
      {options.map((o) => (
        <button
          key={o}
          role="tab"
          aria-selected={value === o}
          onClick={() => onChange(o)}
          className={cx(
            'h-9 px-4 rounded-full text-small font-medium inline-flex items-center gap-2 transition-colors',
            value === o ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink',
          )}
        >
          {o}
          <span
            className={cx(
              'min-w-5 h-5 px-1.5 rounded-full text-tiny leading-5 tabular',
              value === o ? 'bg-brand-700 text-white' : 'bg-line text-muted',
            )}
          >
            {counts[o]}
          </span>
        </button>
      ))}
    </div>
  )
}
function StepDot({ state, icon }) {
  const styles = {
    done: 'bg-success text-white',
    current: 'bg-brand-700 text-white ring-4 ring-brand-100',
    stopped: 'bg-danger text-white',
    todo: 'bg-surface text-subtle border-2 border-line-strong',
  }
  const name = state === 'done' ? 'check' : state === 'stopped' ? 'x' : icon
  return (
    <span
      className={cx(
        'h-8 w-8 shrink-0 rounded-full flex items-center justify-center',
        styles[state],
      )}
    >
      <Icon
        name={name}
        size={15}
        strokeWidth={state === 'done' || state === 'stopped' ? 2.75 : 1.75}
      />
    </span>
  )
}
/** Sent → Owner reviewing → Moved in. Closed inquiries stop at step 2 with a red ✕. */
export function StatusTracker({ status }) {
  const closed = status === 'Declined' || status === 'Expired' || status === 'Cancelled'
  const steps = [
    { label: 'Inquiry sent', icon: 'send', state: 'done' },
    {
      label: closed ? status : 'Owner reviewing',
      icon: 'clock',
      state: status === 'Pending' ? 'current' : closed ? 'stopped' : 'done',
    },
    {
      label: 'Moved in',
      icon: 'home',
      state: status === 'Moved In' ? 'done' : 'todo',
    },
  ]
  return (
    <ol className="flex items-center" aria-label={`Inquiry status: ${status}`}>
      {steps.map((st, i) => (
        <li key={st.label} className={cx('flex items-center', i < steps.length - 1 && 'flex-1')}>
          <span className="flex items-center gap-2">
            <StepDot state={st.state} icon={st.icon} />
            <span
              className={cx(
                'hidden sm:inline text-small font-medium whitespace-nowrap',
                st.state === 'todo'
                  ? 'text-subtle'
                  : st.state === 'stopped'
                    ? 'text-danger'
                    : 'text-ink',
              )}
            >
              {st.label}
            </span>
          </span>
          {i < steps.length - 1 && (
            <span
              className={cx(
                'mx-3 h-0.5 flex-1 rounded-full',
                steps[i + 1].state === 'todo'
                  ? 'bg-line'
                  : steps[i + 1].state === 'stopped'
                    ? 'bg-danger/40'
                    : 'bg-brand-700',
              )}
            />
          )}
        </li>
      ))}
    </ol>
  )
}
/** Small tile with icon + label + value (Move-in, Stay length, Rent, Sent). */
export function DetailChip({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3 py-2.5">
      <span className="h-8 w-8 shrink-0 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
        <Icon name={icon} size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-tiny text-muted">{label}</p>
        <p className="text-small font-semibold text-ink truncate">{value}</p>
      </div>
    </div>
  )
}
//  Review stars
const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']
export function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            aria-label={`${i} stars`}
            className="p-1 -m-1 rounded-full hover:bg-sunken transition-transform hover:scale-110"
          >
            <Icon
              name="star"
              size={32}
              filled={i <= value}
              className={i <= value ? 'text-star' : 'text-line-strong'}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      {value > 0 && <span className="text-body font-semibold text-ink">{STAR_LABELS[value]}</span>}
    </div>
  )
}
/** Inbox row for the owner's side: student avatar instead of hostel photo. */
export function StudentListItem({ name, status, roomType, moveIn, preview, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={cx(
        'relative w-full text-left flex gap-3 px-4 py-3.5 transition-colors',
        active ? 'bg-brand-50' : 'hover:bg-sunken',
      )}
    >
      {active && <span className="absolute left-0 inset-y-2 w-1 rounded-r-full bg-brand-700" />}
      <Avatar name={name} size={42} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-body font-semibold text-ink truncate">{name}</p>
          <StatusBadge status={status} />
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-caption text-muted">
          <span className="inline-flex items-center gap-1 truncate">
            <Icon name="door" size={11} />
            {roomType}
          </span>
          <span className="inline-flex items-center gap-1 shrink-0">
            <Icon name="calendar" size={11} />
            {moveIn}
          </span>
        </div>
        {preview && <p className="mt-1 text-small text-ink-2 truncate">{preview}</p>}
      </div>
    </button>
  )
}
