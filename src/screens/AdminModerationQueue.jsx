import { useState } from 'react'
import { useStore } from '../store'
import { cx } from '../lib'
import { Icon } from '../components/icons'
import { Button, Checkbox, EmptyState, Field, Photo, Textarea, toast } from '../components/ui'
import { ConsoleTitle, StatTile, PillTabs, InfoRow } from '../components/admin/AdminParts'
const inTab = (t, r) =>
  t === 'All' ||
  (t === 'Verification' && r.type === 'Hostel Verification') ||
  (t === 'Reviews' && r.type === 'Reported Review') ||
  (t === 'Posts' && r.type === 'Reported Post')
// One place for each item type's short name, icon and colour
const TYPE_META = {
  'Hostel Verification': {
    short: 'Verification',
    icon: 'shieldCheck',
    tone: 'bg-brand-50 text-brand-700',
  },
  'Reported Review': {
    short: 'Review',
    icon: 'star',
    tone: 'bg-warning-bg text-warning',
  },
  'Reported Post': {
    short: 'Post',
    icon: 'message',
    tone: 'bg-danger-bg text-danger',
  },
}
function TypePill({ type }) {
  const m = TYPE_META[type]
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-tiny font-semibold',
        m.tone,
      )}
    >
      <Icon name={m.icon} size={12} />
      {m.short}
    </span>
  )
}
// Panels fill the space left under the title, stats and tabs, so the page itself doesn't scroll
const PANEL_H = 'xl:h-[calc(100vh-350px)] xl:min-h-[420px]'
export function AdminModerationQueue() {
  const s = useStore()
  const [tab, setTab] = useState('All')
  const list = s.reports.filter((r) => inTab(tab, r))
  const [selId, setSelId] = useState(null)
  const sel = list.find((r) => r.id === selId) ?? list[0]
  const [called, setCalled] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const reset = () => {
    setCalled(false)
    setRejecting(false)
    setReason('')
  }
  const count = (t) => s.reports.filter((r) => inTab(t, r)).length
  const tabs = [
    { key: 'All', label: 'All', icon: 'grid', count: count('All') },
    {
      key: 'Verification',
      label: 'Verification',
      icon: 'shieldCheck',
      count: count('Verification'),
    },
    { key: 'Reviews', label: 'Reviews', icon: 'star', count: count('Reviews') },
    { key: 'Posts', label: 'Posts', icon: 'message', count: count('Posts') },
  ]
  const isVerify = sel?.type === 'Hostel Verification'
  return (
    <>
      <ConsoleTitle
        icon="shield"
        title="Moderation queue"
        subtitle="Verify new hostels and review reported content. Oldest items first."
      />

      {/*  Platform stats  */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatTile
          icon="building"
          label="Live hostels"
          value={s.hostels.filter((h) => h.status === 'Approved').length}
          sub="verified and visible"
        />
        <StatTile
          icon="users"
          label="Active users"
          value={s.users.filter((u) => u.status === 'Active').length.toLocaleString()}
          sub={`${s.users.filter((u) => u.status === 'Banned').length} suspended`}
          tone="bg-success-bg text-success"
        />
        <StatTile
          icon="inbox"
          label="Open items"
          value={s.reports.length}
          sub="target: cleared within 24 h"
          tone="bg-warning-bg text-warning"
        />
        <StatTile
          icon="shieldCheck"
          label="Waiting verification"
          value={count('Verification')}
          sub="new hostel listings"
        />
      </div>

      <PillTabs
        options={tabs}
        value={tab}
        onChange={(t) => {
          setTab(t)
          setSelId(null)
          reset()
        }}
      />

      {list.length === 0 ? (
        <div className="mt-4 rounded-xl border border-line bg-surface">
          <EmptyState
            icon="shieldCheck"
            title="Queue is clear"
            description="Nothing needs review in this category."
          />
        </div>
      ) : (
        <div className="mt-4 grid xl:grid-cols-[minmax(0,1fr)_440px] gap-5 items-start">
          {/*  Left: item list  */}
          <div
            className={cx(
              'rounded-xl border border-line bg-surface overflow-hidden flex flex-col',
              PANEL_H,
            )}
          >
            <div className="h-12 px-4 flex items-center justify-between border-b border-line shrink-0">
              <p className="text-body font-semibold text-ink">
                {list.length} {list.length === 1 ? 'item' : 'items'}
              </p>
              <span className="flex items-center gap-1.5 text-caption text-muted">
                <Icon name="clock" size={13} />
                Oldest first
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-line">
              {list.map((r) => {
                const m = TYPE_META[r.type]
                const on = sel?.id === r.id
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelId(r.id)
                      reset()
                    }}
                    aria-current={on ? 'true' : undefined}
                    className={cx(
                      'relative w-full text-left px-4 py-3.5 flex items-center gap-3.5 transition-colors',
                      on ? 'bg-brand-50' : 'hover:bg-sunken',
                    )}
                  >
                    {on && (
                      <span className="absolute left-0 inset-y-2 w-1 rounded-r-full bg-brand-700" />
                    )}
                    <span
                      className={cx(
                        'h-10 w-10 shrink-0 rounded-full flex items-center justify-center',
                        m.tone,
                      )}
                    >
                      <Icon name={m.icon} size={17} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-caption font-semibold text-ink-2">{m.short}</span>
                        <span className="text-tiny text-subtle">· {r.date}</span>
                      </div>
                      <p className="text-body font-semibold text-ink truncate">{r.title}</p>
                      <p className="text-caption text-muted truncate">
                        {isVerifyType(r)
                          ? `Submitted by ${r.submittedBy}`
                          : `Reported by ${r.submittedBy} · ${r.reportReason}`}
                      </p>
                    </div>
                    <Icon name="chevronRight" size={16} className="text-subtle shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>

          {/*  Right: detail panel  */}
          {sel && (
            <div
              className={cx(
                'rounded-xl border border-line bg-surface shadow-card flex flex-col overflow-hidden',
                PANEL_H,
              )}
            >
              <div className="p-5 border-b border-line shrink-0">
                <div className="flex items-center gap-2">
                  <TypePill type={sel.type} />
                  <span className="text-caption text-subtle">{sel.date}</span>
                </div>
                <h2 className="mt-2.5 tracking-tight text-title-sm leading-snug font-semibold text-ink">
                  {sel.title}
                </h2>
                <p className="mt-0.5 text-small text-muted">
                  {isVerify ? 'Submitted' : 'Reported'} by{' '}
                  <span className="font-medium text-ink-2">{sel.submittedBy}</span>
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {isVerify ? (
                  <>
                    <div className="divide-y divide-line">
                      <InfoRow icon="mapPin" label="Address">
                        {sel.address}
                      </InfoRow>
                      <InfoRow icon="door" label="Capacity">
                        {sel.rooms}
                      </InfoRow>
                      <InfoRow icon="phone" label="Owner phone">
                        <span className="tabular">{sel.ownerPhone}</span>
                      </InfoRow>
                    </div>

                    <p className="mt-4 mb-2 flex items-center gap-1.5 text-caption font-semibold text-muted">
                      <Icon name="image" size={13} />
                      Submitted photos
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {sel.photos?.map((p, i) => (
                        <Photo key={i} src={p} alt={`Submitted photo ${i + 1}`} ratio="4/3" />
                      ))}
                    </div>

                    {/* Required phone check (Admin spec: call before approving) */}
                    <div
                      className={cx(
                        'mt-5 rounded-lg border-2 p-3.5 transition-colors',
                        called ? 'border-success bg-success-bg' : 'border-line bg-sunken/60',
                      )}
                    >
                      <p
                        className={cx(
                          'mb-2 flex items-center gap-2 text-small font-semibold',
                          called ? 'text-success' : 'text-ink',
                        )}
                      >
                        <Icon name={called ? 'check' : 'phone'} size={15} />
                        Phone verification {called ? 'done' : 'required'}
                      </p>
                      <Checkbox
                        checked={called}
                        onChange={setCalled}
                        label="I called the owner and confirmed the details"
                        description="Required before approving."
                      />
                    </div>

                    {rejecting && (
                      <div className="mt-4">
                        <Field
                          label="Reason for rejection"
                          required
                          hint="Shown to the owner so they can fix and resubmit."
                        >
                          <Textarea
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Photos don't match the address; phone number didn't answer."
                          />
                        </Field>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex gap-2.5 rounded-lg border border-[#EFDDB3] bg-warning-bg p-3.5 text-body text-warning">
                      <Icon name="flag" size={16} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="text-caption font-semibold">Report reason</p>
                        <p className="text-ink-2">{sel.reportReason}</p>
                      </div>
                    </div>
                    <p className="mt-5 mb-2 flex items-center gap-1.5 text-caption font-semibold text-muted">
                      <Icon name="message" size={13} />
                      Reported content
                    </p>
                    <blockquote className="relative rounded-lg border border-line bg-canvas p-4 pl-5 text-body leading-relaxed text-ink-2">
                      <span className="absolute left-0 inset-y-3 w-1 rounded-r-full bg-line-strong" />
                      {sel.content}
                    </blockquote>
                  </>
                )}
              </div>

              {/* Actions pinned to the bottom */}
              <div className="p-4 border-t border-line shrink-0 flex gap-2">
                {isVerify ? (
                  rejecting ? (
                    <>
                      <Button variant="secondary" full onClick={() => setRejecting(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        full
                        icon="x"
                        disabled={!reason.trim()}
                        onClick={() => {
                          s.moderateHostel(sel.id, 'Rejected', reason.trim())
                          reset()
                          toast('Listing rejected — owner notified')
                        }}
                      >
                        Reject listing
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="secondary" full icon="x" onClick={() => setRejecting(true)}>
                        Reject
                      </Button>
                      <Button
                        full
                        icon="check"
                        disabled={!called}
                        onClick={() => {
                          s.moderateHostel(sel.id, 'Approved')
                          reset()
                          toast('Hostel verified and live')
                        }}
                      >
                        Approve
                      </Button>
                    </>
                  )
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      full
                      icon="check"
                      onClick={() => {
                        s.resolveReport(sel.id, 'dismissed')
                        toast('Report dismissed')
                      }}
                    >
                      Keep content
                    </Button>
                    <Button
                      variant="danger"
                      full
                      icon="trash"
                      onClick={() => {
                        s.resolveReport(sel.id, 'removed')
                        toast('Content removed — reporter notified')
                      }}
                    >
                      Remove content
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
function isVerifyType(r) {
  return r.type === 'Hostel Verification'
}
