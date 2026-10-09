import { rs, cx } from '../../lib'
import { Icon, FACILITY_ICON } from '../icons'
import { Button, Input, Photo } from '../ui'
//  Shared constants
// Hostel-level facilities from the fixed checklist. AC is NOT here — it's chosen per room type.
export const FACILITIES = [
  'Wi-Fi',
  'Mess',
  'Generator/UPS',
  'Laundry',
  'Security guard',
  'CCTV',
  'Parking',
  'Water cooler',
  'Common study room',
  'Prayer room',
]
export const STEPS = [
  { label: 'Basics', icon: 'info' },
  { label: 'Location', icon: 'mapPin' },
  { label: 'Facilities', icon: 'sparkles' },
  { label: 'Photos', icon: 'image' },
  { label: 'Rooms', icon: 'bed' },
  { label: 'Review', icon: 'check' },
]
export const TYPE_OPTS = [
  { v: 'Single', label: 'Single', seats: 1 },
  { v: 'Twin', label: '2-seater', seats: 2 },
  { v: '3-seater', label: '3-seater', seats: 3 },
  { v: '4-seater+', label: '4-seater', seats: 4 },
]
export const MIN_PHOTOS = 3
export const MAX_PHOTOS = 9
export const PRICE_HINT = 'Similar rooms nearby: Rs 13,500–17,500'
export const emptyDraft = () => ({
  key: Date.now() + Math.random(),
  type: '',
  ac: false,
  price: '',
  from: '',
  to: '',
  numbers: [],
})
export const seatsOf = (r) => TYPE_OPTS.find((t) => t.v === r.type)?.seats ?? 0
//  Layout pieces
/** Icon stepper. Finished steps are green and clickable to go back. */
export function FormStepper({ step, onJump }) {
  return (
    <ol className="flex items-center mb-6 overflow-x-auto pb-1" aria-label="Progress">
      {STEPS.map((st, i) => {
        const done = i < step,
          current = i === step
        return (
          <li
            key={st.label}
            className={cx('flex items-center', i < STEPS.length - 1 && 'flex-1 min-w-[64px]')}
          >
            <button
              type="button"
              disabled={!done}
              onClick={() => onJump(i)}
              aria-current={current ? 'step' : undefined}
              className="flex items-center gap-2 shrink-0 disabled:cursor-default group"
            >
              <span
                className={cx(
                  'h-9 w-9 rounded-full flex items-center justify-center transition-colors',
                  done
                    ? 'bg-success text-white group-hover:bg-[#1f7a4c]'
                    : current
                      ? 'bg-brand-700 text-white ring-4 ring-brand-100'
                      : 'bg-sunken text-muted',
                )}
              >
                <Icon name={done ? 'check' : st.icon} size={16} strokeWidth={done ? 2.75 : 1.75} />
              </span>
              <span
                className={cx(
                  'hidden lg:inline text-small font-medium whitespace-nowrap',
                  current ? 'text-ink' : done ? 'text-ink-2' : 'text-muted',
                )}
              >
                {st.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span
                className={cx(
                  'mx-2 lg:mx-3 h-0.5 flex-1 rounded-full transition-colors',
                  done ? 'bg-success' : 'bg-line',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
/** White card with an icon header for each step. */
export function StepCard({ icon, title, hint, children }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="h-10 w-10 shrink-0 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
          <Icon name={icon} size={18} />
        </span>
        <div>
          <h2 className="tracking-tight text-title leading-tight font-semibold text-ink">
            {title}
          </h2>
          {hint && <p className="mt-0.5 text-small text-muted">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
/** Input with "Rs" written inside on the left. */
export function MoneyInput({ value, onChange, placeholder }) {
  return (
    <span className="relative block">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-small font-semibold text-muted">
        Rs
      </span>
      <Input
        inputMode="numeric"
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        placeholder={placeholder}
      />
    </span>
  )
}
//  Facilities
export function FacilityPicker({ value, onToggle }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
      {FACILITIES.map((f) => {
        const on = value.includes(f)
        return (
          <button
            key={f}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(f)}
            className={cx(
              'relative flex items-center gap-2.5 rounded-lg border-2 px-3 py-2.5 text-left text-small font-medium transition-colors',
              on
                ? 'border-brand-700 bg-brand-50 text-ink'
                : 'border-line text-ink-2 hover:border-brand-200',
            )}
          >
            <span
              className={cx(
                'h-8 w-8 shrink-0 rounded-full flex items-center justify-center',
                on ? 'bg-brand-700 text-white' : 'bg-sunken text-muted',
              )}
            >
              <Icon name={FACILITY_ICON[f] ?? 'check'} size={15} />
            </span>
            {f}
            {on && (
              <Icon name="check" size={14} strokeWidth={3} className="ml-auto text-brand-700" />
            )}
          </button>
        )
      })}
    </div>
  )
}
//  Photos
export function PhotoGrid({ photos, onAdd, onRemove }) {
  const met = photos.length >= MIN_PHOTOS
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-sunken overflow-hidden">
          <div
            className={cx(
              'h-full rounded-full transition-all',
              met ? 'bg-success' : 'bg-brand-700',
            )}
            style={{
              width: `${Math.min(100, (photos.length / MIN_PHOTOS) * 100)}%`,
            }}
          />
        </div>
        <span
          className={cx('text-caption font-semibold tabular', met ? 'text-success' : 'text-muted')}
        >
          {met ? (
            <>
              <Icon name="check" size={11} strokeWidth={3} className="inline mr-0.5" />
              {photos.length} photos
            </>
          ) : (
            `${photos.length} of ${MIN_PHOTOS} minimum`
          )}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((p, i) => (
          <div key={i} className="relative group">
            <Photo src={p} alt={`Upload ${i + 1}`} ratio="4/3" />
            {i === 0 && (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-brand-700 text-white text-tiny font-semibold px-2 h-6">
                <Icon name="star" size={10} filled />
                Cover
              </span>
            )}
            <button
              onClick={() => onRemove(i)}
              aria-label="Remove photo"
              className="absolute right-2 top-2 h-7 w-7 rounded-full bg-white/95 text-ink shadow-card flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-danger transition-opacity"
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            onClick={onAdd}
            className="aspect-[4/3] rounded-lg border-2 border-dashed border-line-strong flex flex-col items-center justify-center gap-2 text-small font-medium text-muted hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50/40 transition-colors"
          >
            <span className="h-10 w-10 rounded-full bg-sunken flex items-center justify-center">
              <Icon name="upload" size={18} />
            </span>
            Upload photo
          </button>
        )}
      </div>
    </div>
  )
}
//  Room type editor
export function RoomTypeEditor({ index, draft: r, canRemove, onChange, onRemove, onAddRange }) {
  const seats = seatsOf(r)
  return (
    <div className="rounded-xl border border-line bg-canvas p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="flex items-center gap-2 text-body font-semibold text-ink">
          <span className="h-6 w-6 rounded-full bg-brand-700 text-white text-tiny font-bold flex items-center justify-center">
            {index + 1}
          </span>
          Room type {index + 1}
        </p>
        {canRemove && (
          <Button size="sm" variant="danger-ghost" icon="trash" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>

      {/* Type tiles */}
      <p className="mb-1.5 text-small font-medium text-ink">
        Type <span className="text-danger">*</span>
      </p>
      <div role="radiogroup" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TYPE_OPTS.map((t) => {
          const on = r.type === t.v
          return (
            <button
              key={t.v}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange({ type: t.v })}
              className={cx(
                'rounded-lg border-2 p-3 text-left transition-colors',
                on
                  ? 'border-brand-700 bg-surface'
                  : 'border-line bg-surface hover:border-brand-200',
              )}
            >
              <span className="flex gap-0.5">
                {Array.from({ length: t.seats }).map((_, i) => (
                  <Icon
                    key={i}
                    name="user"
                    size={13}
                    className={on ? 'text-brand-700' : 'text-muted'}
                  />
                ))}
              </span>
              <p className="mt-1.5 text-body font-semibold text-ink">{t.label}</p>
              <p className="text-tiny text-muted">
                {t.seats} {t.seats === 1 ? 'person' : 'people'} per room
              </p>
            </button>
          )
        })}
      </div>

      {/* Price + AC */}
      <div className="mt-4 grid sm:grid-cols-[1fr_200px] gap-3">
        <div>
          <p className="mb-1.5 text-small font-medium text-ink">
            Rent per seat <span className="text-danger">*</span>
          </p>
          <MoneyInput
            value={r.price}
            onChange={(v) => onChange({ price: v })}
            placeholder="15,500"
          />
          <p className="mt-1.5 inline-flex items-center gap-1.5 h-6 px-2 rounded-full bg-brand-50 text-tiny font-medium text-brand-800">
            <Icon name="sparkles" size={11} />
            {PRICE_HINT}
          </p>
        </div>
        <div>
          <p className="mb-1.5 text-small font-medium text-ink">Air-conditioned</p>
          <button
            type="button"
            aria-pressed={r.ac}
            onClick={() => onChange({ ac: !r.ac })}
            className={cx(
              'w-full h-10 rounded-md border-2 inline-flex items-center justify-center gap-2 text-small font-semibold transition-colors',
              r.ac
                ? 'border-brand-700 bg-brand-50 text-brand-700'
                : 'border-line bg-surface text-muted hover:border-brand-200',
            )}
          >
            <Icon name="snowflake" size={15} />
            {r.ac ? 'Yes, AC rooms' : 'No AC'}
          </button>
        </div>
      </div>

      {/* Room numbers */}
      <p className="mt-4 mb-1.5 text-small font-medium text-ink">
        Room numbers <span className="text-danger">*</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-28">
          <Input
            icon="door"
            value={r.from}
            onChange={(e) => onChange({ from: e.target.value.replace(/\D/g, '') })}
            placeholder="From"
          />
        </div>
        <span className="text-muted text-body">to</span>
        <div className="w-28">
          <Input
            icon="door"
            value={r.to}
            onChange={(e) => onChange({ to: e.target.value.replace(/\D/g, '') })}
            placeholder="To"
          />
        </div>
        <Button variant="secondary" icon="plus" onClick={onAddRange} disabled={!r.from || !r.to}>
          Add rooms
        </Button>
      </div>
      <p className="mt-1.5 text-caption text-muted">
        Add a range like 201 to 210. Remove any number you don't need.
      </p>

      {r.numbers.length > 0 && (
        <>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {r.numbers.map((n) => (
              <span
                key={n}
                className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1 rounded-full bg-surface border border-line text-small font-semibold text-ink tabular"
              >
                {n}
                <button
                  onClick={() => onChange({ numbers: r.numbers.filter((x) => x !== n) })}
                  aria-label={`Remove room ${n}`}
                  className="h-5 w-5 inline-flex items-center justify-center rounded-full text-muted hover:bg-danger-bg hover:text-danger"
                >
                  <Icon name="x" size={11} />
                </button>
              </span>
            ))}
          </div>
          <p className="mt-2 text-caption font-medium text-ink-2 tabular">
            {r.numbers.length} rooms · {r.numbers.length * seats} seats
          </p>
        </>
      )}
    </div>
  )
}
//  Sidebar
/** Card that looks like what students will see. */
export function ListingPreview({ photo, name, address, rooms, seats, from }) {
  return (
    <div className="rounded-xl overflow-hidden border border-line bg-surface">
      <div className="relative">
        <Photo src={photo} alt="" ratio="16/10" rounded={false} />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-white/95 text-tiny font-semibold text-ink">
          <Icon name="eye" size={11} />
          Preview
        </span>
      </div>
      <div className="p-4">
        <p className="tracking-tight text-title-sm leading-snug font-semibold text-ink">
          {name || 'Your hostel name'}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-caption text-muted truncate">
          <Icon name="mapPin" size={12} />
          {address || 'Address'}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-caption">
          <span className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-sunken text-ink-2 tabular">
            <Icon name="door" size={11} />
            {rooms} rooms
          </span>
          <span className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-sunken text-ink-2 tabular">
            <Icon name="bed" size={11} />
            {seats} seats
          </span>
          {from !== undefined && (
            <span className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-brand-50 text-brand-700 font-semibold tabular">
              <Icon name="tag" size={11} />
              from {rs(from)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
/** Navy checklist of steps 1–5. */
export function Checklist({ valid }) {
  return (
    <div className="rounded-xl bg-charcoal text-white p-5">
      <p className="text-body font-semibold">Checklist</p>
      <ul className="mt-3 space-y-2.5">
        {STEPS.slice(0, 5).map((st, i) => (
          <li key={st.label} className="flex items-center gap-2.5 text-body">
            <span
              className={cx(
                'h-6 w-6 rounded-full flex items-center justify-center',
                valid[i] ? 'bg-success' : 'bg-white/10',
              )}
            >
              <Icon
                name={valid[i] ? 'check' : st.icon}
                size={12}
                strokeWidth={valid[i] ? 3 : 1.75}
              />
            </span>
            <span className={valid[i] ? '' : 'text-white/60'}>{st.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
