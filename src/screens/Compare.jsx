import { useStore } from '../store'
import { navigate, rs, cx } from '../lib'
import { Icon } from '../components/icons'
import { Button, Container, Photo, Rating } from '../components/ui'
// Hostel-level facilities from the fixed checklist (AC is per room, handled separately below)
const FACILITIES = ['Wi-Fi', 'Mess', 'Generator/UPS', 'Laundry', 'Security guard', 'Parking']
const MAX = 3
//  Small pieces used only on this page
/** Green ✓ or grey ✕ in a circle. */
function YesNo({ yes }) {
  return yes ? (
    <span className="inline-flex items-center gap-2 text-small font-medium text-success">
      <span className="h-6 w-6 rounded-full bg-success-bg flex items-center justify-center">
        <Icon name="check" size={13} strokeWidth={3} />
      </span>
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 text-small text-subtle">
      <span className="h-6 w-6 rounded-full bg-sunken flex items-center justify-center">
        <Icon name="x" size={12} strokeWidth={2.5} />
      </span>
      No
    </span>
  )
}
/** Row label with an icon (left column). */
function RowLabel({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-small font-medium text-ink-2">
      <Icon name={icon} size={16} className="text-brand-700" />
      {children}
    </span>
  )
}
/** Top of each column: photo, rating chip, remove button, name, area, winner badge. */
function HostelHeader({ h, wins, onRemove }) {
  return (
    <div>
      <div className="relative">
        <Photo src={h.image} alt={h.name} ratio="3/2" className="!rounded-lg" />
        {h.rating > 0 && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-white/95 text-caption font-semibold text-ink shadow-card">
            <Icon name="star" size={12} filled className="text-star" strokeWidth={1.5} />
            {h.rating.toFixed(1)}
          </span>
        )}
        <button
          onClick={onRemove}
          aria-label={`Remove ${h.name}`}
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/95 text-ink shadow-card flex items-center justify-center hover:bg-white hover:text-danger transition-colors"
        >
          <Icon name="x" size={15} />
        </button>
      </div>
      {wins > 0 && (
        <span className="mt-3 inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-brand-700 text-white text-tiny font-semibold">
          <Icon name="sparkles" size={12} />
          Best in {wins}
        </span>
      )}
      <p className="mt-2 tracking-tight text-title-sm leading-snug font-semibold text-ink">
        {h.name}
      </p>
      <p className="mt-0.5 flex items-center gap-1 text-small text-muted">
        <Icon name="mapPin" size={13} />
        {h.area}, Lahore
      </p>
    </div>
  )
}
/** Dashed slot inviting the student to add another hostel. */
function AddSlot() {
  return (
    <button
      onClick={() => navigate('/s/search')}
      className="w-full aspect-[3/2] rounded-lg border-2 border-dashed border-line-strong flex flex-col items-center justify-center gap-2 text-small font-medium text-muted hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50/50 transition-colors"
    >
      <span className="h-11 w-11 rounded-full bg-sunken flex items-center justify-center">
        <Icon name="plus" size={20} />
      </span>
      Add a hostel
    </button>
  )
}
function EmptyCompare() {
  return (
    <div className="rounded-xl border border-line bg-surface px-6 py-14 flex flex-col items-center text-center">
      <span className="h-20 w-20 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
        <Icon name="columns" size={32} />
      </span>
      <h2 className="mt-5 tracking-tight text-heading font-semibold text-ink">
        Nothing to compare yet
      </h2>
      <p className="mt-2 text-body text-muted max-w-md">
        Tick “Add to compare” on up to three hostels in search results or your saved list.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button size="lg" icon="search" onClick={() => navigate('/s/search')}>
          Browse hostels
        </Button>
        <Button size="lg" variant="secondary" icon="heart" onClick={() => navigate('/s/wishlist')}>
          Saved hostels
        </Button>
      </div>
    </div>
  )
}
export function Compare() {
  const s = useStore()
  const list = s.compareIds.map((id) => s.hostel(id)).filter(Boolean)
  const slots = [...list, ...Array(Math.max(0, MAX - list.length)).fill(null)]
  // "Best" rules (unchanged)
  const minPrice = Math.min(...list.map((h) => s.startingPrice(h.id)))
  const minDist = Math.min(...list.map((h) => h.distance))
  const maxRating = Math.max(...list.map((h) => h.rating))
  const rows = [
    {
      icon: 'tag',
      label: 'Starting price',
      render: (h) => (
        <>
          <span className="text-lead font-bold text-brand-700 tabular">
            {rs(s.startingPrice(h.id))}
          </span>
          <span className="text-small text-muted"> / seat</span>
        </>
      ),
      best: (h) => s.startingPrice(h.id) === minPrice,
    },
    {
      icon: 'walk',
      label: 'Distance to campus',
      render: (h) => <span className="font-semibold tabular">{h.distance} km</span>,
      best: (h) => h.distance === minDist,
    },
    {
      icon: 'star',
      label: 'Rating',
      render: (h) => <Rating value={h.rating} count={h.reviewCount} />,
      best: (h) => h.rating === maxRating && h.rating > 0,
    },
    {
      icon: 'door',
      label: 'Room types',
      render: (h) => (
        <span className="text-small">
          {s
            .typesFor(h.id)
            .map((t) => t.name.replace(' Room', ''))
            .join(', ')}
        </span>
      ),
    },
    {
      icon: 'bed',
      label: 'Seats free',
      render: (h) => <span className="font-semibold tabular">{s.freeSeats(h.id)}</span>,
    },
    { icon: 'users', label: 'Hostel for', render: (h) => h.gender },
  ]
  // How many "best" rows each hostel wins (only meaningful with 2+ hostels)
  const winsOf = (h) => (list.length > 1 ? rows.filter((r) => r.best?.(h)).length : 0)
  const topWins = Math.max(0, ...list.map(winsOf))
  const clearAll = () => list.forEach((h) => s.toggleCompare(h.id))
  return (
    <Container className="pb-16">
      {/*  Header  */}
      <nav aria-label="Breadcrumb" className="pt-6 flex items-center gap-1.5 text-small text-muted">
        <button
          onClick={() => navigate('/s/search')}
          className="inline-flex items-center gap-1.5 hover:text-ink"
        >
          <Icon name="arrowLeft" size={14} />
          Find a hostel
        </button>
        <Icon name="chevronRight" size={14} className="text-subtle" />
        <span className="font-medium text-ink">Compare</span>
      </nav>

      <div className="pt-4 pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="tracking-tight text-display-sm leading-tight font-semibold text-ink flex items-center gap-3">
            <span className="h-11 w-11 rounded-full bg-brand-700 text-white flex items-center justify-center">
              <Icon name="columns" size={20} />
            </span>
            Compare hostels
          </h1>
          <p className="mt-2 text-body text-muted">
            Side by side, up to three hostels. The best value in each row is highlighted in green.
          </p>
        </div>
        {list.length > 0 && (
          <Button variant="danger-ghost" icon="trash" onClick={clearAll}>
            Clear all
          </Button>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyCompare />
      ) : (
        <div className="rounded-xl border border-line bg-surface shadow-card overflow-x-auto">
          <table className="w-full min-w-[820px] text-body table-fixed">
            <colgroup>
              <col className="w-[210px]" />
              {slots.map((_, i) => (
                <col key={i} />
              ))}
            </colgroup>

            {/* Hostel headers */}
            <thead>
              <tr>
                <th className="p-5 align-bottom text-left">
                  <p className="text-caption font-semibold uppercase tracking-[0.1em] text-muted">
                    {list.length} of {MAX} selected
                  </p>
                </th>
                {slots.map((h, i) => (
                  <th key={i} className="p-5 align-top text-left font-normal border-l border-line">
                    {h ? (
                      <HostelHeader
                        h={h}
                        wins={winsOf(h) === topWins ? topWins : 0}
                        onRemove={() => s.toggleCompare(h.id)}
                      />
                    ) : (
                      <AddSlot />
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Key numbers */}
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-line">
                  <th className="px-5 py-4 text-left font-normal">
                    <RowLabel icon={r.icon}>{r.label}</RowLabel>
                  </th>
                  {slots.map((h, i) => {
                    const best = !!h && list.length > 1 && !!r.best?.(h)
                    return (
                      <td
                        key={i}
                        className={cx(
                          'px-5 py-4 border-l border-line text-ink',
                          best && 'bg-success-bg/70',
                        )}
                      >
                        {h ? (
                          <span className="inline-flex flex-wrap items-center gap-2">
                            {r.render(h)}
                            {best && (
                              <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-success text-white text-micro font-bold uppercase tracking-wide">
                                <Icon name="check" size={10} strokeWidth={3} />
                                Best
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-subtle">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {/* Facilities group */}
              <tr className="border-t border-line bg-sunken/70">
                <th colSpan={MAX + 1} className="px-5 py-3 text-left">
                  <span className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.1em] text-ink-2">
                    <Icon name="sparkles" size={14} className="text-brand-700" />
                    Facilities
                  </span>
                </th>
              </tr>
              <tr className="border-t border-line">
                <th className="px-5 py-3.5 text-left font-normal">
                  <RowLabel icon="snowflake">AC rooms</RowLabel>
                </th>
                {slots.map((h, i) => (
                  <td key={i} className="px-5 py-3.5 border-l border-line">
                    {h ? (
                      <YesNo yes={s.typesFor(h.id).some((t) => t.ac)} />
                    ) : (
                      <span className="text-subtle">—</span>
                    )}
                  </td>
                ))}
              </tr>
              {FACILITIES.map((f) => (
                <tr key={f} className="border-t border-line">
                  <th className="px-5 py-3.5 text-left font-normal">
                    <RowLabel icon="check">{f}</RowLabel>
                  </th>
                  {slots.map((h, i) => (
                    <td key={i} className="px-5 py-3.5 border-l border-line">
                      {h ? (
                        <YesNo yes={h.facilities.includes(f)} />
                      ) : (
                        <span className="text-subtle">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Actions */}
              <tr className="border-t border-line">
                <th />
                {slots.map((h, i) => (
                  <td key={i} className="p-5 border-l border-line">
                    {h && (
                      <Button
                        full
                        iconRight="chevronRight"
                        onClick={() => navigate(`/s/hostel/${h.id}`)}
                      >
                        View hostel
                      </Button>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Container>
  )
}
