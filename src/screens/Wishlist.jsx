import { useState } from 'react'
import { useStore } from '../store'
import { navigate, rs } from '../lib'
import { Icon } from '../components/icons'
import { Button, Container, Modal } from '../components/ui'
import { HostelCard } from '../components/HostelCard'
import { CompareTray } from './HostelSearch'
//  Small pieces used only on this page
/** Icon + label + value tile for the summary row. */
function SummaryTile({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface border border-line p-4">
      <span className="h-10 w-10 shrink-0 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-caption text-muted">{label}</p>
        <p className="text-lead font-semibold text-ink truncate tabular">{value}</p>
      </div>
    </div>
  )
}
/** Small heading above each group of cards. */
function GroupHeading({ icon, title, count, muted }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-body-lg font-semibold text-ink">
      <Icon name={icon} size={16} className={muted ? 'text-muted' : 'text-success'} />
      {title}
      <span className="h-5 min-w-5 px-1.5 rounded-full bg-sunken text-tiny font-semibold leading-5 text-muted tabular">
        {count}
      </span>
    </h2>
  )
}
/** Shown when nothing is saved yet. */
function EmptySaved() {
  const tips = [
    {
      icon: 'heart',
      text: 'Tap the heart on any hostel card to save it here.',
    },
    { icon: 'columns', text: 'Compare up to 3 saved hostels side by side.' },
    { icon: 'bell', text: 'Come back anytime — your list stays saved.' },
  ]
  return (
    <div className="rounded-xl border border-line bg-surface px-6 py-14 flex flex-col items-center text-center">
      <span className="h-20 w-20 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
        <Icon name="heart" size={34} />
      </span>
      <h2 className="mt-5 tracking-tight text-heading font-semibold text-ink">
        No saved hostels yet
      </h2>
      <p className="mt-2 text-body text-muted max-w-sm">
        Keep hostels you like here while you decide.
      </p>
      <ul className="mt-7 grid sm:grid-cols-3 gap-3 w-full max-w-3xl text-left">
        {tips.map((t) => (
          <li
            key={t.icon}
            className="flex items-start gap-3 rounded-lg bg-sunken p-4 text-small text-ink-2"
          >
            <Icon name={t.icon} size={16} className="mt-0.5 shrink-0 text-brand-700" />
            {t.text}
          </li>
        ))}
      </ul>
      <Button size="lg" icon="search" className="mt-8" onClick={() => navigate('/s/search')}>
        Browse hostels
      </Button>
    </div>
  )
}
//  Page
export function Wishlist() {
  const s = useStore()
  const [confirm, setConfirm] = useState(false)
  const saved = s.wishlistIds.map((id) => s.hostel(id)).filter(Boolean)
  // Split into still-available and no-longer-available (unchanged rule: status must be Approved)
  const available = saved.filter((h) => h.status === 'Approved')
  const gone = saved.filter((h) => h.status !== 'Approved')
  // Summary numbers worked out from the saved list
  const lowest = available.length
    ? Math.min(...available.map((h) => s.startingPrice(h.id)))
    : undefined
  const nearest = available.length ? Math.min(...available.map((h) => h.distance)) : undefined
  const comparing = s.compareIds.length
  return (
    <Container className="pb-28">
      {/*  Title row  */}
      <div className="pt-8 pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="tracking-tight text-display-sm leading-tight font-semibold text-ink flex items-center gap-3">
            <span className="h-11 w-11 rounded-full bg-brand-700 text-white flex items-center justify-center">
              <Icon name="heart" size={20} filled />
            </span>
            Saved hostels
          </h1>
          {saved.length > 0 && (
            <p className="mt-2 text-body text-muted">
              Tap the heart on a card to remove it from your list.
            </p>
          )}
        </div>
        {saved.length > 0 && (
          <Button variant="danger-ghost" icon="trash" onClick={() => setConfirm(true)}>
            Clear all
          </Button>
        )}
      </div>

      {saved.length === 0 ? (
        <EmptySaved />
      ) : (
        <>
          {/*  Summary  */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SummaryTile icon="heart" label="Saved" value={saved.length} />
            <SummaryTile icon="check" label="Still available" value={available.length} />
            <SummaryTile
              icon="tag"
              label="Lowest rent"
              value={lowest !== undefined ? rs(lowest) : '—'}
            />
            <SummaryTile
              icon="walk"
              label="Nearest"
              value={nearest !== undefined ? `${nearest} km` : '—'}
            />
          </div>

          {/*  Compare tip  */}
          {available.length >= 2 && (
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
              <span className="h-9 w-9 shrink-0 rounded-full bg-brand-700 text-white flex items-center justify-center">
                <Icon name="columns" size={16} />
              </span>
              <p className="flex-1 min-w-[200px] text-small text-ink-2">
                {comparing >= 2 ? (
                  <>
                    <span className="font-semibold text-ink">{comparing} hostels</span> ready to
                    compare.
                  </>
                ) : (
                  <>
                    Tick <span className="font-semibold text-ink">Add to compare</span> on 2–3
                    hostels to see them side by side.
                  </>
                )}
              </p>
              {comparing >= 2 && (
                <Button size="sm" iconRight="chevronRight" onClick={() => navigate('/s/compare')}>
                  Compare now
                </Button>
              )}
            </div>
          )}

          {/*  Still available  */}
          {available.length > 0 && (
            <section className="mt-8">
              <GroupHeading icon="check" title="Still available" count={available.length} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {available.map((h) => (
                  <HostelCard key={h.id} hostel={h} />
                ))}
              </div>
            </section>
          )}

          {/*  No longer available  */}
          {gone.length > 0 && (
            <section className="mt-10">
              <GroupHeading icon="ban" title="No longer available" count={gone.length} muted />
              <p className="-mt-2 mb-4 text-small text-muted">
                These hostels were removed or paused by the owner. Tap the heart to clear them.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {gone.map((h) => (
                  <HostelCard key={h.id} hostel={h} unavailable />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <CompareTray />

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        size="sm"
        title="Clear all saved hostels?"
        description="This removes every hostel from your saved list."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              icon="trash"
              onClick={() => {
                s.clearWishlist()
                setConfirm(false)
              }}
            >
              Clear all
            </Button>
          </>
        }
      />
    </Container>
  )
}
