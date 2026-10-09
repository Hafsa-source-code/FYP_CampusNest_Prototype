import { useState } from 'react'
import { useStore } from '../store'
import { navigate, cx } from '../lib'
import { Icon } from '../components/icons'
import { Button, Modal, Photo, toast, Menu } from '../components/ui'
import { ConsoleTitle, PillTabs } from '../components/admin/AdminParts'
// One place for each status: label, icon and colour of the pill on the photo
const STATUS_META = {
  Approved: { label: 'Live', icon: 'check', pill: 'bg-success text-white' },
  Pending: { label: 'Pending', icon: 'clock', pill: 'bg-warning text-white' },
  Rejected: { label: 'Rejected', icon: 'x', pill: 'bg-danger text-white' },
  Deactivated: {
    label: 'Deactivated',
    icon: 'eyeOff',
    pill: 'bg-ink/80 text-white',
  },
}
//  Small pieces used only on this page
function MiniStat({ icon, label, children }) {
  return (
    <div className="rounded-md bg-sunken px-2.5 py-2">
      <p className="flex items-center gap-1 text-tiny text-muted">
        <Icon name={icon} size={11} />
        {label}
      </p>
      <div className="mt-0.5 text-body font-semibold text-ink tabular">{children}</div>
    </div>
  )
}
/** Coloured strip explaining a non-live status, with an optional action. */
function StatusBanner({ tone, icon, title, children, action }) {
  return (
    <div className={cx('mx-4 mb-4 rounded-lg p-3 flex gap-2.5 text-small', tone)}>
      <Icon name={icon} size={15} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <p className="opacity-90">{children}</p>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  )
}
function HostelOwnerCard({ h, occupied, total, types, onRooms, onInquiries, onToggle }) {
  const m = STATUS_META[h.status] ?? STATUS_META.Pending
  const pct = total ? Math.round((occupied / total) * 100) : 0
  const menuItems = [
    {
      label: 'Edit details',
      icon: 'edit',
      onClick: () => navigate(`/o/hostels/${h.id}/edit`),
    },
    ...(h.status === 'Approved'
      ? [
          {
            label: 'View public listing',
            icon: 'external',
            onClick: () => navigate(`/s/hostel/${h.id}`),
          },
        ]
      : []),
    ...(h.status === 'Approved' || h.status === 'Deactivated'
      ? [
          'divider',
          h.status === 'Approved'
            ? {
                label: 'Deactivate listing',
                icon: 'ban',
                danger: true,
                onClick: onToggle,
              }
            : { label: 'Reactivate listing', icon: 'check', onClick: onToggle },
        ]
      : []),
  ]
  return (
    <article className="rounded-xl border border-line bg-surface overflow-hidden flex flex-col transition-shadow hover:shadow-card">
      {/* Photo with status + menu */}
      <div className="relative">
        <Photo
          src={h.image}
          alt={h.name}
          ratio="16/9"
          rounded={false}
          className={cx(h.status === 'Deactivated' && 'grayscale')}
        />
        <span
          className={cx(
            'absolute left-3 top-3 inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-caption font-semibold shadow-card',
            m.pill,
          )}
        >
          <Icon name={m.icon} size={12} strokeWidth={2.5} />
          {m.label}
        </span>
        <div className="absolute right-3 top-3">
          <Menu
            trigger={(_, t) => (
              <button
                onClick={t}
                aria-label="Hostel options"
                className="h-8 w-8 rounded-full bg-white/95 text-ink shadow-card flex items-center justify-center hover:bg-white"
              >
                <Icon name="more" size={16} />
              </button>
            )}
            items={menuItems}
          />
        </div>
      </div>

      {/* Name + stats */}
      <div className="p-4">
        <h3 className="tracking-tight text-title-sm leading-snug font-semibold text-ink truncate">
          {h.name}
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-caption text-muted truncate">
          <Icon name="mapPin" size={12} />
          {h.address}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <MiniStat icon="users" label="Occupancy">
            {occupied}/{total}
          </MiniStat>
          <MiniStat icon="door" label="Room types">
            {types}
          </MiniStat>
          <MiniStat icon="star" label="Rating">
            {h.rating > 0 ? h.rating.toFixed(1) : '—'}
          </MiniStat>
        </div>
        {h.status === 'Approved' && (
          <div className="mt-3">
            <div className="h-1.5 rounded-full bg-sunken overflow-hidden">
              <div className="h-full rounded-full bg-brand-700" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-tiny text-muted tabular">{pct}% occupied</p>
          </div>
        )}
      </div>

      {/* Status-specific banners (unchanged messages) */}
      {h.status === 'Pending' && (
        <StatusBanner tone="bg-warning-bg text-warning" icon="phone">
          Our team will call you within 1–2 business days to verify this listing.
        </StatusBanner>
      )}
      {h.status === 'Rejected' && (
        <StatusBanner
          tone="bg-danger-bg text-danger"
          icon="x"
          title="Not approved"
          action={
            <Button
              size="sm"
              variant="secondary"
              icon="edit"
              onClick={() => navigate(`/o/hostels/${h.id}/edit`)}
            >
              Fix and resubmit
            </Button>
          }
        >
          {h.rejectReason}
        </StatusBanner>
      )}
      {h.status === 'Deactivated' && (
        <StatusBanner
          tone="bg-sunken text-ink-2"
          icon="eyeOff"
          action={
            <Button size="sm" variant="secondary" icon="check" onClick={onToggle}>
              Reactivate
            </Button>
          }
        >
          Hidden from students. Reactivate when you're ready to take inquiries again.
        </StatusBanner>
      )}

      {/* Quick links (live hostels only) */}
      {h.status === 'Approved' && (
        <div className="mt-auto grid grid-cols-2 border-t border-line divide-x divide-line">
          <button
            onClick={onRooms}
            className="h-11 inline-flex items-center justify-center gap-2 text-small font-semibold text-ink-2 hover:bg-sunken hover:text-brand-700 transition-colors"
          >
            <Icon name="bed" size={15} />
            Rooms
          </button>
          <button
            onClick={onInquiries}
            className="h-11 inline-flex items-center justify-center gap-2 text-small font-semibold text-ink-2 hover:bg-sunken hover:text-brand-700 transition-colors"
          >
            <Icon name="inbox" size={15} />
            Inquiries
          </button>
        </div>
      )}
    </article>
  )
}
/** Dashed "add another hostel" card at the end of the grid. */
function AddHostelCard() {
  return (
    <button
      onClick={() => navigate('/o/hostels/new')}
      className="min-h-[280px] rounded-xl border-2 border-dashed border-line-strong flex flex-col items-center justify-center gap-3 text-muted hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50/40 transition-colors"
    >
      <span className="h-14 w-14 rounded-full bg-sunken flex items-center justify-center">
        <Icon name="plus" size={24} />
      </span>
      <span className="text-body font-semibold">Add a hostel</span>
      <span className="text-caption text-subtle max-w-[220px] text-center">
        Listing is free. Our team verifies it by phone within 1–2 days.
      </span>
    </button>
  )
}
//  Page
export function OwnerMyHostels() {
  const s = useStore()
  const mine = s.hostels.filter((h) => h.ownerId === s.currentUser.id)
  const [filter, setFilter] = useState('All')
  const [toggle, setToggle] = useState(null)
  const list = mine.filter((h) => filter === 'All' || h.status === filter)
  const tabs = [
    ['All', 'grid'],
    ['Approved', 'check'],
    ['Pending', 'clock'],
    ['Rejected', 'x'],
    ['Deactivated', 'eyeOff'],
  ]
    .map(([key, icon]) => ({
      key: key,
      label: key === 'Approved' ? 'Live' : key,
      icon,
      count: key === 'All' ? mine.length : mine.filter((h) => h.status === key).length,
    }))
    .filter((t) => t.key === 'All' || t.count > 0)
  const deactivating = toggle?.status === 'Approved'
  return (
    <>
      <ConsoleTitle
        icon="building"
        title="My hostels"
        subtitle="Every property you've listed and its verification status."
        action={
          <Button icon="plus" onClick={() => navigate('/o/hostels/new')}>
            Add hostel
          </Button>
        }
      />

      {mine.length > 1 && (
        <div className="mb-4">
          <PillTabs options={tabs} value={filter} onChange={setFilter} />
        </div>
      )}

      <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-4">
        {list.map((h) => (
          <HostelOwnerCard
            key={h.id}
            h={h}
            occupied={s.totalSeats(h.id) - s.freeSeats(h.id)}
            total={s.totalSeats(h.id)}
            types={s.typesFor(h.id).length}
            onRooms={() => {
              s.setOwnerHostelId(h.id)
              navigate('/o/rooms')
            }}
            onInquiries={() => {
              s.setOwnerHostelId(h.id)
              navigate('/o/inquiries')
            }}
            onToggle={() => setToggle(h)}
          />
        ))}
        {filter === 'All' && <AddHostelCard />}
      </div>

      {/*  Deactivate / reactivate  */}
      <Modal
        open={!!toggle}
        onClose={() => setToggle(null)}
        size="sm"
        title={deactivating ? `Deactivate ${toggle?.name}?` : `Reactivate ${toggle?.name}?`}
        description={
          deactivating
            ? 'The listing will be hidden from search and no new inquiries can be sent. Current residents are not affected.'
            : 'The listing will appear in search again straight away.'
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setToggle(null)}>
              Cancel
            </Button>
            <Button
              variant={deactivating ? 'danger' : 'primary'}
              icon={deactivating ? 'ban' : 'check'}
              onClick={() => {
                if (!toggle) return
                s.updateHostel(toggle.id, {
                  status: deactivating ? 'Deactivated' : 'Approved',
                })
                toast(deactivating ? 'Listing deactivated' : 'Listing is live again')
                setToggle(null)
              }}
            >
              {deactivating ? 'Deactivate' : 'Reactivate'}
            </Button>
          </>
        }
      >
        <span
          className={cx(
            'h-11 w-11 rounded-full flex items-center justify-center',
            deactivating ? 'bg-danger-bg text-danger' : 'bg-success-bg text-success',
          )}
        >
          <Icon name={deactivating ? 'ban' : 'check'} size={20} />
        </span>
      </Modal>
    </>
  )
}
