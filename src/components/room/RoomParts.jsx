import { cx } from '../../lib'
import { Icon } from '../icons'
import { Avatar } from '../ui'
//  Navigation
/** "Find a hostel › Hostel › Room" trail. Each item with onClick is a link. */
export function Breadcrumb({ items }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 min-w-0 text-small text-muted"
    >
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 min-w-0">
          {i > 0 && <Icon name="chevronRight" size={14} className="text-subtle shrink-0" />}
          {it.onClick ? (
            <button
              onClick={it.onClick}
              className="inline-flex items-center gap-1.5 hover:text-ink truncate"
            >
              {i === 0 && <Icon name="arrowLeft" size={14} />}
              {it.label}
            </button>
          ) : (
            <span className="font-medium text-ink truncate">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
/** Small grey chip with an icon, used under the page title. */
export function InfoChip({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface border border-line text-small font-medium text-ink-2">
      <Icon name={icon} size={14} className="text-brand-700" />
      {children}
    </span>
  )
}
/** Numbered step title: ① Choose your room. Turns into a tick when done. */
export function StepHeading({ n, title, subtitle, done }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cx(
          'mt-0.5 h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-body font-bold',
          done ? 'bg-success text-white' : 'bg-brand-700 text-white',
        )}
      >
        {done ? <Icon name="check" size={15} strokeWidth={3} /> : n}
      </span>
      <div>
        <h2 className="tracking-tight text-title leading-tight font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-small text-muted">{subtitle}</p>}
      </div>
    </div>
  )
}
//  Seats and matching
/** One circle per seat: navy person = taken, green dashed + = free. */
export function SeatIcons({ total, free, size = 26 }) {
  const taken = total - free
  return (
    <span className="inline-flex flex-wrap gap-1.5" aria-label={`${free} of ${total} seats free`}>
      {Array.from({ length: total }).map((_, i) =>
        i < taken ? (
          <span
            key={i}
            className="rounded-full bg-charcoal text-white flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <Icon name="user" size={size * 0.5} />
          </span>
        ) : (
          <span
            key={i}
            className="rounded-full border-2 border-dashed border-success text-success flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <Icon name="plus" size={size * 0.5} strokeWidth={2.5} />
          </span>
        ),
      )}
    </span>
  )
}
/** Legend explaining the seat circles. */
export function SeatLegend() {
  return (
    <div className="flex items-center gap-4 text-caption text-muted">
      <span className="inline-flex items-center gap-1.5">
        <SeatIcons total={1} free={0} size={16} />
        Taken
      </span>
      <span className="inline-flex items-center gap-1.5">
        <SeatIcons total={1} free={1} size={16} />
        Free
      </span>
    </div>
  )
}
/** Circular progress ring with the match % in the middle. */
export function MatchRing({ score, size = 46 }) {
  const r = 18,
    c = 2 * Math.PI * r
  const color =
    score >= 85
      ? 'var(--color-success)'
      : score >= 70
        ? 'var(--color-brand-700)'
        : 'var(--color-muted)'
  return (
    <span
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      aria-label={`${score}% match`}
    >
      <svg viewBox="0 0 44 44" width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--color-line)" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
        />
      </svg>
      <span
        className="font-bold text-ink tabular"
        style={{ fontSize: Math.max(11, Math.round(size * 0.24)) }}
      >
        {score}%
      </span>{' '}
    </span>
  )
}
/** Overlapping resident faces; private residents shown as a grey lock circle. */
function AvatarStack({ names, hidden }) {
  return (
    <span className="flex -space-x-2">
      {names.slice(0, 3).map((n) => (
        <span key={n} className="rounded-full ring-2 ring-surface">
          <Avatar name={n} size={28} />
        </span>
      ))}
      {hidden > 0 && (
        <span
          className="h-7 w-7 rounded-full ring-2 ring-surface bg-sunken text-muted flex items-center justify-center"
          title={`${hidden} private`}
        >
          <Icon name="lock" size={12} />
        </span>
      )}
    </span>
  )
}
//  Room picker tile
export function RoomTile({ number, total, free, shown, hidden, bestMatch, selected, onSelect }) {
  const full = free === 0
  const empty = shown.length + hidden === 0
  return (
    <button
      disabled={full}
      onClick={onSelect}
      aria-pressed={selected}
      className={cx(
        'relative text-left rounded-xl border-2 bg-surface p-4 transition-all',
        selected
          ? 'border-brand-700 shadow-card'
          : 'border-line hover:border-brand-200 hover:-translate-y-0.5',
        full && 'opacity-55 cursor-not-allowed hover:translate-y-0 hover:border-line',
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 h-6 w-6 rounded-full bg-brand-700 text-white flex items-center justify-center">
          <Icon name="check" size={13} strokeWidth={3} />
        </span>
      )}
      {full && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 text-tiny font-semibold text-muted">
          <Icon name="lock" size={12} />
          Full
        </span>
      )}

      <p className="text-tiny font-semibold uppercase tracking-[0.1em] text-muted">Room</p>
      <p className="tracking-tight text-heading leading-none font-semibold text-ink">{number}</p>

      <div className="mt-4">
        <SeatIcons total={total} free={free} />
      </div>
      <p className={cx('mt-2 text-small font-medium', full ? 'text-muted' : 'text-success')}>
        {full ? 'No seats free' : `${free} of ${total} seats free`}
      </p>

      <div className="mt-4 pt-3 border-t border-line flex items-center gap-2 min-h-[44px]">
        {empty ? (
          <span className="inline-flex items-center gap-1.5 text-caption text-muted">
            <Icon name="sparkles" size={13} className="text-brand-700" />
            Be the first resident
          </span>
        ) : (
          <>
            <AvatarStack names={shown.map((r) => r.name)} hidden={hidden} />
            {bestMatch !== undefined && (
              <span className="ml-auto text-caption font-semibold text-success tabular">
                {bestMatch}% match
              </span>
            )}
          </>
        )}
      </div>
    </button>
  )
}
//  Residents of the selected room
export function ResidentPanel({ number, total, free, shown, hidden, showMatch }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lead font-semibold text-ink flex items-center gap-2">
          <Icon name="users" size={17} className="text-brand-700" />
          Who lives in Room {number}
        </h3>
        <SeatIcons total={total} free={free} size={22} />
      </div>

      {shown.length + hidden === 0 ? (
        <p className="mt-4 text-body text-muted">Empty room — you'd be the first resident.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {shown.map((r) => (
            <li key={r.id} className="py-3 first:pt-0 flex items-center gap-3">
              <Avatar name={r.name} size={40} />
              <div className="flex-1 min-w-0">
                <p className="text-body font-semibold text-ink">{r.name}</p>
                <p className="text-small text-muted truncate">
                  {showMatch && r.matchReason ? r.matchReason : `Resident since ${r.movedIn}`}
                </p>
              </div>
              {showMatch && r.matchScore !== undefined && <MatchRing score={r.matchScore} />}
            </li>
          ))}
          {hidden > 0 && (
            <li className="py-3 last:pb-0 flex items-center gap-3 text-small text-muted">
              <span className="h-10 w-10 rounded-full bg-sunken flex items-center justify-center">
                <Icon name="lock" size={15} />
              </span>
              + {hidden} private {hidden === 1 ? 'resident' : 'residents'}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
/** Blue card asking the student to fill the roommate profile (unlocks match scores). */
export function ProfilePrompt({ onCreate }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
      <span className="h-11 w-11 shrink-0 rounded-full bg-brand-700 text-white flex items-center justify-center">
        <Icon name="users" size={19} />
      </span>
      <div className="flex-1">
        <p className="text-body font-semibold text-brand-800">
          See how well you'd match current residents
        </p>
        <p className="text-small text-ink-2">
          Fill in a two-minute roommate profile to see compatibility scores.
        </p>
      </div>
      <button
        onClick={onCreate}
        className="h-9 px-4 rounded-full bg-brand-700 text-white text-small font-semibold hover:bg-brand-800 inline-flex items-center gap-1.5 self-start sm:self-auto"
      >
        Create profile
        <Icon name="chevronRight" size={14} />
      </button>
    </div>
  )
}
