import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useStore } from '../store'
import { navigate, rs, cx } from '../lib'
import { Icon } from '../components/icons'
import { Avatar, Button, EmptyState } from '../components/ui'
import { SeatIcons } from '../components/room/RoomParts'
// Demo history for the last 6 months (unchanged); the current month uses live occupancy
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
const OCC = [78, 84, 81, 86, 90, 91]
const INQ = [9, 13, 7, 11, 16, 12]
const ASPECTS = [
  ['Cleanliness', 4.9],
  ['Management', 4.8],
  ['Location', 4.7],
  ['Water & utilities', 3.9],
]
const ATTENTION_BELOW = 4.2
const axis = { fontSize: 12, fill: 'var(--color-muted)' }
const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}
//  Small pieces used only on this page
function ChartTip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-line bg-surface px-3 py-2 shadow-pop text-small">
      <p className="text-muted">{label} 2026</p>
      <p className="font-semibold text-ink tabular">
        {payload[0].value}
        {unit}
      </p>
    </div>
  )
}
/** White card with an icon heading, optional subtitle and right-side action. */
function Panel({ icon, title, subtitle, action, className, children }) {
  return (
    <section className={cx('rounded-xl border border-line bg-surface p-5', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
            <Icon name={icon} size={15} />
          </span>
          <div>
            <h2 className="text-body-lg font-semibold text-ink">{title}</h2>
            {subtitle && <p className="text-caption text-muted">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
/** KPI card: icon circle, label, big number, optional extra line. */
function Kpi({ icon, label, value, tone = 'bg-brand-50 text-brand-700', highlight, children }) {
  return (
    <div
      className={cx(
        'rounded-xl border bg-surface p-4',
        highlight ? 'border-[#EFDDB3]' : 'border-line',
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cx('h-10 w-10 shrink-0 rounded-full flex items-center justify-center', tone)}
        >
          <Icon name={icon} size={18} />
        </span>
        <p className="text-small font-medium text-muted">{label}</p>
      </div>
      <p className="mt-3 tracking-tight text-heading leading-none font-semibold text-ink tabular">
        {value}
      </p>
      <div className="mt-2 text-caption text-muted">{children}</div>
    </div>
  )
}
//  Page
export function OwnerDashboard() {
  const s = useStore()
  const h = s.hostel(s.ownerHostelId)
  if (!h)
    return (
      <div className="pt-10">
        <EmptyState
          icon="building"
          title="No approved hostel yet"
          description="Once a hostel is verified, its performance appears here."
          action={
            <Button icon="plus" onClick={() => navigate('/o/hostels/new')}>
              Add a hostel
            </Button>
          }
        />
      </div>
    )
  // Live numbers (unchanged)
  const total = s.totalSeats(h.id)
  const free = s.freeSeats(h.id)
  const filled = total - free
  const occPct = total ? Math.round((filled / total) * 100) : 0
  const pending = s.inquiries.filter((i) => i.hostelId === h.id && i.status === 'Pending')
  const freeRooms = s.rooms.filter((r) => r.hostelId === h.id && r.freeSeats > 0)
  const occ = [...OCC.slice(0, 5), occPct]
  const trend = occPct - OCC[4]
  return (
    <>
      {/*  Greeting  */}
      <div className="pt-6 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="tracking-tight text-heading leading-tight font-semibold text-ink">
            {greeting()}, {s.currentUser.name.split(' ')[0]}
          </h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-small text-muted">
            <Icon name="building" size={13} />
            Here's how <span className="font-semibold text-ink-2">{h.name}</span> is doing this
            month.
          </p>
        </div>
        <Button variant="secondary" icon="external" onClick={() => navigate(`/s/hostel/${h.id}`)}>
          View public listing
        </Button>
      </div>

      {/*  KPIs  */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Kpi icon="chart" label="Occupancy" value={`${occPct}%`}>
          <div className="h-1.5 rounded-full bg-sunken overflow-hidden">
            <div className="h-full rounded-full bg-brand-700" style={{ width: `${occPct}%` }} />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="tabular">
              {filled} of {total} seats filled
            </span>
            {trend !== 0 && (
              <span
                className={cx(
                  'inline-flex items-center gap-0.5 font-semibold',
                  trend > 0 ? 'text-success' : 'text-danger',
                )}
              >
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)} pt
              </span>
            )}
          </div>
        </Kpi>
        <Kpi icon="bed" label="Free seats" value={free} tone="bg-success-bg text-success">
          across <span className="font-semibold text-ink-2">{freeRooms.length}</span>{' '}
          {freeRooms.length === 1 ? 'room' : 'rooms'}
        </Kpi>
        <Kpi
          icon="inbox"
          label="Pending inquiries"
          value={pending.length}
          highlight={pending.length > 0}
          tone={pending.length > 0 ? 'bg-warning-bg text-warning' : 'bg-sunken text-muted'}
        >
          {pending.length > 0 ? (
            <button
              onClick={() => navigate('/o/inquiries')}
              className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
            >
              Reply now
              <Icon name="chevronRight" size={12} />
            </button>
          ) : (
            'All caught up'
          )}
        </Kpi>
        <Kpi icon="star" label="Rating" value={h.rating.toFixed(1)} tone="bg-[#FDF3D8] text-star">
          from <span className="font-semibold text-ink-2">{h.reviewCount}</span> verified reviews
        </Kpi>
      </div>

      {/*  Charts  */}
      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        <Panel icon="chart" title="Occupancy" subtitle="Share of seats filled, last 6 months">
          <div className="h-52 -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={MONTHS.map((m, i) => ({ m, v: occ[i] }))}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="occFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-700)" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="var(--color-brand-700)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="m" tick={axis} tickLine={false} axisLine={false} dy={6} />
                <YAxis
                  tick={axis}
                  tickLine={false}
                  axisLine={false}
                  domain={[60, 100]}
                  ticks={[60, 70, 80, 90, 100]}
                  unit="%"
                  width={44}
                />
                <Tooltip
                  content={<ChartTip unit="%" />}
                  cursor={{ stroke: 'var(--color-line-strong)' }}
                />
                <Area
                  dataKey="v"
                  stroke="var(--color-brand-700)"
                  strokeWidth={2}
                  fill="url(#occFill)"
                  dot={{
                    r: 4,
                    fill: 'var(--color-brand-700)',
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel icon="inbox" title="New inquiries" subtitle="Inquiries received per month">
          <div className="h-52 -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MONTHS.map((m, i) => ({ m, v: INQ[i] }))}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                barCategoryGap="38%"
              >
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="m" tick={axis} tickLine={false} axisLine={false} dy={6} />
                <YAxis
                  tick={axis}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={44}
                />
                <Tooltip
                  content={<ChartTip unit=" inquiries" />}
                  cursor={{ fill: 'var(--color-sunken)' }}
                />
                <Bar dataKey="v" fill="var(--color-brand-700)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/*  Pending inquiries + review summary  */}
      <div className="mt-4 grid lg:grid-cols-5 gap-4">
        <Panel
          icon="message"
          title="Waiting for your reply"
          subtitle="Pending inquiries, oldest first"
          className="lg:col-span-3"
          action={
            <Button
              size="sm"
              variant="ghost"
              iconRight="chevronRight"
              onClick={() => navigate('/o/inquiries')}
            >
              All inquiries
            </Button>
          }
        >
          {pending.length === 0 ? (
            <div className="flex items-center gap-3 rounded-lg bg-success-bg p-4 text-body text-success">
              <Icon name="check" size={16} strokeWidth={2.5} />
              You're all caught up.
            </div>
          ) : (
            <ul className="divide-y divide-line -mx-1">
              {[...pending].reverse().map((i) => {
                const st = s.user(i.studentId)
                const type = s.roomTypes.find((t) => t.id === i.roomTypeId)
                return (
                  <li key={i.id}>
                    <button
                      onClick={() => navigate(`/o/inquiries/${i.id}`)}
                      className="w-full flex items-center gap-3 px-1 py-3 text-left rounded-md hover:bg-sunken transition-colors"
                    >
                      <Avatar name={st?.name ?? '?'} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="text-body font-semibold text-ink truncate">{st?.name}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-caption text-muted">
                          <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-sunken text-ink-2">
                            <Icon name="door" size={11} />
                            {type?.name}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Icon name="calendar" size={11} />
                            Move-in {i.moveIn}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-brand-700 text-white text-caption font-semibold">
                        <Icon name="message" size={12} />
                        Reply
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel
          icon="sparkles"
          title="What residents say"
          subtitle={`AI summary of ${h.reviewCount} reviews`}
          className="lg:col-span-2"
        >
          <p className="text-body leading-relaxed text-ink-2">
            Praised for cleanliness, a responsive warden and reliable backup power. The one
            recurring issue is{' '}
            <span className="font-semibold text-ink">low water pressure in the morning</span> —
            fixing it is the clearest way to lift your rating.
          </p>
          <div className="mt-4 pt-4 border-t border-line space-y-3">
            {ASPECTS.map(([k, v]) => {
              const weak = v < ATTENTION_BELOW
              return (
                <div key={k}>
                  <div className="flex items-center justify-between text-caption">
                    <span
                      className={cx(
                        'inline-flex items-center gap-1.5',
                        weak ? 'font-semibold text-ink' : 'text-muted',
                      )}
                    >
                      {k}
                      {weak && (
                        <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded-full bg-warning-bg text-warning text-micro font-semibold">
                          <Icon name="alert" size={10} />
                          Needs attention
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-ink tabular">{v.toFixed(1)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-sunken overflow-hidden">
                    <div
                      className={cx('h-full rounded-full', weak ? 'bg-warning' : 'bg-brand-700')}
                      style={{ width: `${(v / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>

      {/*  Rooms with free seats  */}
      <Panel
        icon="bed"
        title="Rooms with free seats"
        subtitle="Students see these as available right now"
        className="mt-4"
        action={
          <Button
            size="sm"
            variant="ghost"
            iconRight="chevronRight"
            onClick={() => navigate('/o/rooms')}
          >
            Manage rooms
          </Button>
        }
      >
        {freeRooms.length === 0 ? (
          <p className="text-body text-muted">Every seat is filled. Nice work.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
            {freeRooms.map((r) => {
              const t = s.roomTypes.find((x) => x.id === r.roomTypeId)
              return (
                <div key={r.id} className="rounded-lg border border-line p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-tiny font-semibold uppercase tracking-[0.1em] text-muted">
                        Room
                      </p>
                      <p className="tracking-tight text-title leading-none font-semibold text-ink">
                        {r.number}
                      </p>
                    </div>
                    <p className="text-right">
                      <span className="text-body font-bold text-brand-700 tabular">
                        {rs(t.price)}
                      </span>
                      <span className="block text-tiny text-muted">/ seat</span>
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-caption text-muted">
                    {t.name}
                    {t.ac && (
                      <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded-full bg-brand-50 text-brand-700 text-micro font-semibold">
                        <Icon name="snowflake" size={10} />
                        AC
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <SeatIcons total={r.totalSeats} free={r.freeSeats} size={22} />
                  </div>
                  <p className="mt-1.5 text-caption font-medium text-success tabular">
                    {r.freeSeats} of {r.totalSeats} seats free
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </Panel>
    </>
  )
}
