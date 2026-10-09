import { useEffect, useState } from 'react'
import { rs, cx } from '../../lib'
import { Icon } from '../icons'
import { Avatar, Badge, Button, IconButton, Menu, Photo, Stars } from '../ui'
//  Page structure
/** One content section with a serif heading. scroll-mt keeps the heading visible under the sticky header + tabs. */
export function Section({ id, title, aside, children }) {
  return (
    <section id={id} className="py-10 scroll-mt-32 border-b border-line last:border-b-0">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <h2 className="tracking-tight text-heading leading-tight font-semibold text-ink">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  )
}
/** Returns the id of the section currently in view (drives the blue tab underline). */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -55% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids.join(',')])
  return active
}
/** Tabs that stick under the top menu while scrolling. */
export function SectionTabs({ tabs, active }) {
  return (
    <div className="sticky top-16 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 bg-canvas/95 backdrop-blur border-b border-line">
      <nav className="flex gap-7 overflow-x-auto" aria-label="Page sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth' })}
            className={cx(
              'relative h-14 whitespace-nowrap text-body-lg font-medium transition-colors',
              active === t.id ? 'text-brand-700' : 'text-muted hover:text-ink',
            )}
          >
            {t.label}
            {active === t.id && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-700" />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
/** Rounded button with icon + text (Share / Save). */
export function PillButton({ icon, filled, active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="h-10 px-4 rounded-full border border-line-strong bg-surface inline-flex items-center gap-2 text-body font-medium text-ink hover:bg-sunken transition-colors"
    >
      <Icon name={icon} size={16} filled={filled} className={active ? 'text-brand-700' : ''} />
      {children}
    </button>
  )
}
//  Overview
/** Small box with an icon in a blue circle, a grey label and a bold value. */
export function FactTile({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface border border-line p-4">
      <span className="h-10 w-10 shrink-0 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-caption text-muted">{label}</p>
        <p className="text-body-lg font-semibold text-ink truncate">{value}</p>
      </div>
    </div>
  )
}
export function FacilityItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 text-body-lg text-ink-2">
      <span className="h-9 w-9 shrink-0 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
        <Icon name={icon} size={17} />
      </span>
      {label}
    </div>
  )
}
//  Rooms
export function RoomTypeCard({
  name,
  photo,
  ac,
  seatsPerRoom,
  roomCount,
  price,
  freeSeats,
  onChoose,
}) {
  const open = freeSeats > 0
  return (
    <div className="flex flex-col sm:flex-row gap-5 rounded-xl border border-line bg-surface p-4 hover:shadow-card transition-shadow">
      <Photo src={photo} alt={name} ratio="4/3" className="w-full sm:w-44 shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="tracking-tight text-title-sm font-semibold text-ink">{name}</h3>
          {ac && (
            <Badge tone="brand" icon="snowflake">
              AC
            </Badge>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-small text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="users" size={14} />
            {seatsPerRoom} {seatsPerRoom === 1 ? 'person' : 'people'} per room
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="door" size={14} />
            {roomCount} rooms
          </span>
          <span
            className={cx(
              'inline-flex items-center gap-1.5 font-medium',
              open ? 'text-success' : 'text-danger',
            )}
          >
            <Icon name="bed" size={14} />
            {open ? `${freeSeats} ${freeSeats === 1 ? 'seat' : 'seats'} free` : 'Full'}
          </span>
        </div>
        <div className="mt-auto pt-4 flex flex-wrap items-end justify-between gap-3">
          <p>
            <span className="text-title-sm font-bold text-brand-700 tabular">{rs(price)}</span>
            <span className="text-small text-muted"> / seat / month</span>
          </p>
          <Button
            size="sm"
            variant={open ? 'primary' : 'secondary'}
            disabled={!open}
            iconRight={open ? 'chevronRight' : undefined}
            onClick={onChoose}
          >
            {open ? 'Choose a room' : 'Full'}
          </Button>
        </div>
      </div>
    </div>
  )
}
//  Location
/** Illustrated map: navy pin = hostel, blue cap pin = campus, dashed line = route. */
export function LocationMap({ hostelName, campus }) {
  return (
    <div className="relative h-72 rounded-xl overflow-hidden border border-line bg-[#EEF1EC]">
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 800 256"
        aria-hidden="true"
      >
        <path d="M0 180 C200 160 380 200 800 150" stroke="#fff" strokeWidth="18" fill="none" />
        <path d="M260 0 L300 256" stroke="#fff" strokeWidth="12" />
        <path d="M560 0 C540 90 600 160 580 256" stroke="#fff" strokeWidth="10" fill="none" />
        <path d="M0 70 L800 90" stroke="#fff" strokeWidth="8" />
        <rect x="620" y="20" width="140" height="60" rx="6" fill="#DDE7D8" />
        <path
          d="M300 128 C380 120 470 100 590 55"
          stroke="var(--color-brand-700)"
          strokeWidth="2.5"
          strokeDasharray="6 5"
          fill="none"
        />
      </svg>
      <div className="absolute left-[34%] top-[50%] -translate-x-1/2 -translate-y-full flex flex-col items-center">
        <span className="rounded-full bg-charcoal text-white text-caption font-semibold px-3 py-1.5 shadow-pop whitespace-nowrap">
          {hostelName}
        </span>
        <span className="mt-1 h-8 w-8 rounded-full bg-charcoal text-white ring-4 ring-white flex items-center justify-center">
          <Icon name="mapPin" size={15} />
        </span>
      </div>
      <div className="absolute left-[74%] top-[14%] -translate-x-1/2 flex flex-col items-center">
        <span className="h-8 w-8 rounded-full bg-brand-700 text-white ring-4 ring-white flex items-center justify-center">
          <Icon name="graduation" size={15} />
        </span>
        <span className="mt-1 rounded-full bg-surface text-ink text-caption font-semibold px-3 py-1.5 shadow-card whitespace-nowrap">
          {campus}
        </span>
      </div>
    </div>
  )
}
export function TravelCard({ icon, time, mode, note }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface border border-line p-4">
      <span className="h-11 w-11 shrink-0 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
        <Icon name={icon} size={19} />
      </span>
      <div>
        <p className="text-lead font-semibold text-ink tabular">{time}</p>
        <p className="text-small text-muted">
          {mode} · {note}
        </p>
      </div>
    </div>
  )
}
//  Reviews
export function ReviewSummary({ count }) {
  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50 p-5 mb-8">
      <p className="flex items-center gap-2 text-small font-semibold text-brand-800">
        <span className="h-7 w-7 rounded-full bg-brand-700 text-white flex items-center justify-center">
          <Icon name="sparkles" size={14} />
        </span>
        What residents mention most
      </p>
      <p className="mt-3 text-body-lg leading-relaxed text-ink-2">
        Residents consistently praise the cleanliness, the responsive warden and reliable backup
        power. Most reach campus in under 20 minutes. The recurring complaint is low water pressure
        during the morning rush.
      </p>
      <p className="mt-3 text-caption text-muted">
        AI summary generated from {count} verified reviews.
      </p>
    </div>
  )
}
export function ReviewCard({ name, date, rating, text, reply, onReport }) {
  return (
    <article className="rounded-xl border border-line bg-surface p-5">
      <div className="flex items-center gap-3">
        <Avatar name={name} size={42} />
        <div className="flex-1 min-w-0">
          <p className="text-body font-semibold text-ink">{name}</p>
          <p className="flex items-center gap-1 text-caption text-muted">
            <Icon name="shieldCheck" size={13} className="text-success" />
            Verified resident · {date}
          </p>
        </div>
        <Menu
          trigger={(_, t) => (
            <IconButton icon="more" label="Review options" size="sm" onClick={t} />
          )}
          items={[{ label: 'Report review', icon: 'flag', onClick: onReport }]}
        />
      </div>
      <Stars value={rating} size={14} className="mt-4" />
      <p className="mt-2 text-body-lg leading-relaxed text-ink-2">{text}</p>
      {reply && (
        <div className="mt-4 rounded-md bg-sunken p-3.5">
          <p className="flex items-center gap-1.5 text-small font-semibold text-ink">
            <Icon name="message" size={13} />
            Response from the owner
          </p>
          <p className="mt-1 text-body leading-relaxed text-muted">{reply}</p>
        </div>
      )}
    </article>
  )
}
/** Sticky price card (desktop sidebar). */
export function BookingCard({ price, free, typesCount, onChoose }) {
  const rows = [
    { icon: 'bed', label: 'Seats available', value: String(free) },
    { icon: 'door', label: 'Room types', value: String(typesCount) },
    { icon: 'clock', label: 'Owner usually replies', value: 'within 2 hours' },
  ]
  return (
    <>
      <div className="rounded-xl bg-surface border border-line shadow-card p-6">
        <p className="text-small text-muted">Starting from</p>
        <p className="mt-1 tracking-tight text-display-sm leading-none font-semibold text-brand-700 tabular">
          {rs(price)}
          <span className="font-sans text-body font-normal text-muted"> / seat / month</span>
        </p>
        <div className="mt-5 pt-5 border-t border-line space-y-3 text-body">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-2.5">
              <Icon name={r.icon} size={16} className="text-muted" />
              <span className="text-muted">{r.label}</span>
              <span className="ml-auto font-semibold text-ink tabular">{r.value}</span>
            </div>
          ))}
        </div>
        <Button full size="lg" className="mt-6" disabled={free === 0} onClick={onChoose}>
          {free ? 'Choose a room' : 'Fully booked'}
        </Button>
        <p className="mt-3 text-small text-muted text-center">
          You won't be charged. Inquiries are free.
        </p>
      </div>
      <div className="mt-4 flex gap-3 rounded-lg bg-sunken p-4 text-small text-ink-2">
        <Icon name="lock" size={16} className="mt-0.5 text-brand-700" />
        <p>
          Messages stay on CampusNest. Never pay a deposit before visiting the hostel in person.
        </p>
      </div>
    </>
  )
}
/** Phone-only bar fixed to the bottom of the screen. */
export function MobileBookingBar({ price, free, onChoose }) {
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-surface/95 backdrop-blur border-t border-line px-4 py-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-caption text-muted">From</p>
        <p className="text-lead font-bold text-brand-700 tabular">
          {rs(price)}
          <span className="text-caption font-normal text-muted"> /seat</span>
        </p>
      </div>
      <Button disabled={free === 0} onClick={onChoose}>
        {free ? 'Choose a room' : 'Fully booked'}
      </Button>
    </div>
  )
}
