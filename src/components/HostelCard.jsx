import { useStore } from '../store'
import { navigate, rs, cx } from '../lib'
import { Icon } from './icons'
import { toast } from './ui'
/**
 * Photo-led listing card used everywhere (landing, search, saved).
 * The photo fills the card; a white info panel floats over its lower edge.
 */
export function HostelCard({ hostel, compare = true, unavailable = false }) {
  const {
    wishlistIds,
    compareIds,
    toggleWishlist,
    toggleCompare,
    freeSeats,
    startingPrice,
    typesFor,
  } = useStore()
  const saved = wishlistIds.includes(hostel.id)
  const comparing = compareIds.includes(hostel.id)
  const free = freeSeats(hostel.id)
  const hasAC = typesFor(hostel.id).some((t) => t.ac)
  const open = () => !unavailable && navigate(`/s/hostel/${hostel.id}`)
  return (
    <article
      onClick={open}
      className={cx(
        'group relative aspect-square min-h-[330px] rounded-xl overflow-hidden bg-sunken',
        unavailable ? 'opacity-70' : 'cursor-pointer',
      )}
    >
      <img
        src={hostel.image}
        alt={hostel.name}
        loading="lazy"
        className={cx(
          'absolute inset-0 h-full w-full object-cover transition-transform duration-500',
          !unavailable && 'group-hover:scale-[1.04]',
          unavailable && 'grayscale',
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/10" />

      {/* Top-left badges */}
      <div className="absolute left-3 top-3 right-14 flex flex-wrap gap-1.5">
        {unavailable ? (
          <span className="rounded-full bg-ink/85 px-2.5 h-6 inline-flex items-center text-tiny font-semibold text-white">
            No longer available
          </span>
        ) : (
          <>
            {hostel.verifiedStays > 0 && (
              <span className="rounded-full bg-charcoal px-2.5 h-6 inline-flex items-center gap-1 text-tiny font-semibold text-white">
                <Icon name="shieldCheck" size={12} />
                {hostel.verifiedStays} verified stays
              </span>
            )}
            <span className="rounded-full bg-white/90 px-2.5 h-6 inline-flex items-center text-tiny font-semibold text-ink">
              {hostel.gender}
            </span>
            {hasAC && (
              <span className="rounded-full bg-white/90 px-2.5 h-6 inline-flex items-center text-tiny font-semibold text-ink">
                AC rooms
              </span>
            )}
          </>
        )}
      </div>

      {/* Save (heart) */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleWishlist(hostel.id)
          toast(saved ? 'Removed from saved' : 'Saved to your list')
        }}
        aria-label={saved ? 'Remove from saved' : 'Save hostel'}
        className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/95 flex items-center justify-center shadow-card hover:scale-105 transition-transform"
      >
        <Icon
          name="heart"
          size={16}
          filled={saved}
          className={saved ? 'text-brand-700' : 'text-ink'}
        />
      </button>

      {/* Floating info panel */}
      <div className="absolute inset-x-3 bottom-3 rounded-lg bg-white/97 backdrop-blur p-4 shadow-pop">
        <div className="flex items-start justify-between gap-3">
          <h3 className="tracking-tight text-title-sm leading-snug font-semibold text-ink">
            {hostel.name}
          </h3>
          {hostel.rating > 0 ? (
            <span className="shrink-0 inline-flex items-center gap-1 text-small font-semibold text-ink tabular">
              <Icon name="star" size={13} filled className="text-star" strokeWidth={1.5} />
              {hostel.rating.toFixed(1)}
              <span className="font-normal text-muted">({hostel.reviewCount})</span>
            </span>
          ) : (
            <span className="shrink-0 text-caption text-muted">New</span>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1 text-small text-muted">
          <Icon name="mapPin" size={13} />
          {hostel.area}, Lahore
        </p>

        <div className="mt-3 pt-3 border-t border-line flex items-center justify-between gap-3">
          <p className="text-lead font-bold text-brand-700 tabular">
            {rs(startingPrice(hostel.id))}
            <span className="text-caption font-normal text-muted"> /seat</span>
          </p>
          <div className="flex items-center gap-3 text-caption text-ink-2 tabular">
            <span className="inline-flex items-center gap-1" title="Distance to campus">
              <Icon name="walk" size={13} className="text-muted" />
              {hostel.distance} km
            </span>
            <span
              className={cx('inline-flex items-center gap-1', free === 0 && 'text-danger')}
              title="Seats available"
            >
              <Icon name="bed" size={13} className={free === 0 ? '' : 'text-muted'} />
              {free > 0 ? free : 'Full'}
            </span>
          </div>
        </div>

        {compare && !unavailable && (
          <label
            onClick={(e) => e.stopPropagation()}
            className="mt-2.5 inline-flex items-center gap-1.5 text-caption text-muted cursor-pointer select-none hover:text-ink"
          >
            <input
              type="checkbox"
              checked={comparing}
              onChange={() => {
                if (!toggleCompare(hostel.id)) toast('You can compare up to 3 hostels')
              }}
              className="h-3.5 w-3.5 accent-[var(--color-brand-700)]"
            />
            Add to compare
          </label>
        )}
      </div>
    </article>
  )
}
