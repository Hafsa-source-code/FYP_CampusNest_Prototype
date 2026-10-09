import { useState } from 'react'
import { useStore } from '../store'
import { cx } from '../lib'
import { Icon } from '../components/icons'
import {
  Avatar,
  Button,
  EmptyState,
  Field,
  IconButton,
  Menu,
  Modal,
  Stars,
  Textarea,
  toast,
} from '../components/ui'
import { ConsoleTitle, PillTabs } from '../components/admin/AdminParts'
const MIN_REPLY = 20
//  Small pieces used only on this page
/** Rating summary: big number + stars, star breakdown, reply stats. */
function RatingSummary({ rating, count, dist, needsReply, replyRate }) {
  const max = Math.max(1, ...dist.map((d) => d.c))
  return (
    <section className="rounded-xl border border-line bg-surface p-5 grid md:grid-cols-[180px_1fr_200px] gap-6 md:items-center">
      <div className="md:pr-6 md:border-r border-line">
        <p className="tracking-tight text-display-lg leading-none font-semibold text-ink tabular">
          {rating.toFixed(1)}
        </p>
        <Stars value={rating} size={16} className="mt-2" />
        <p className="mt-1.5 text-caption text-muted">{count} verified reviews</p>
      </div>

      <div className="space-y-1.5">
        {dist.map((d) => (
          <div key={d.n} className="flex items-center gap-3 text-caption">
            <span className="w-8 inline-flex items-center gap-1 text-muted tabular">
              {d.n}
              <Icon name="star" size={11} filled className="text-star" strokeWidth={1.5} />
            </span>
            <span className="flex-1 h-2 rounded-full bg-sunken overflow-hidden">
              <span
                className="block h-full rounded-full bg-star"
                style={{ width: `${(d.c / max) * 100}%` }}
              />
            </span>
            <span className="w-6 text-right font-semibold text-ink tabular">{d.c}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5">
        <div
          className={cx(
            'rounded-lg p-3 flex items-center gap-2.5',
            needsReply ? 'bg-warning-bg' : 'bg-sunken',
          )}
        >
          <Icon name="message" size={16} className={needsReply ? 'text-warning' : 'text-muted'} />
          <div>
            <p className="text-tiny text-muted">Needs reply</p>
            <p className="text-lead font-semibold text-ink tabular">{needsReply}</p>
          </div>
        </div>
        <div className="rounded-lg bg-success-bg p-3 flex items-center gap-2.5">
          <Icon name="check" size={16} className="text-success" />
          <div>
            <p className="text-tiny text-muted">Reply rate</p>
            <p className="text-lead font-semibold text-ink tabular">{replyRate}%</p>
          </div>
        </div>
      </div>
    </section>
  )
}
/** Tips shown beside the list. */
function ReplyTips() {
  const tips = [
    {
      icon: 'heart',
      text: 'Thank them for staying and taking the time to write.',
    },
    {
      icon: 'check',
      text: 'Address the specific points they raised — what you fixed or will fix.',
    },
    {
      icon: 'shield',
      text: 'Stay professional. Your reply is public and future students read it.',
    },
  ]
  return (
    <aside className="space-y-4 xl:sticky xl:top-24">
      <div className="rounded-xl border border-line bg-surface p-5">
        <p className="flex items-center gap-2 text-small font-semibold text-ink">
          <Icon name="sparkles" size={14} className="text-brand-700" />
          Reply like a pro
        </p>
        <ul className="mt-3 space-y-3">
          {tips.map((t) => (
            <li key={t.icon} className="flex gap-3 text-small text-ink-2">
              <span className="h-7 w-7 shrink-0 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                <Icon name={t.icon} size={13} />
              </span>
              {t.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl bg-charcoal text-white p-5">
        <p className="flex items-center gap-2 text-body font-semibold">
          <Icon name="shieldCheck" size={15} />
          Only real residents
        </p>
        <p className="mt-1.5 text-small text-white/70 leading-relaxed">
          Reviews come only from students you've marked as moved in. Honest negative reviews stay up
          — report only fake or abusive ones.
        </p>
      </div>
    </aside>
  )
}
//  Page
export function OwnerReviews() {
  const s = useStore()
  const h = s.hostel(s.ownerHostelId)
  const all = s.reviews.filter((r) => r.hostelId === s.ownerHostelId)
  const [tab, setTab] = useState('All')
  const [replying, setReplying] = useState(null)
  const [draft, setDraft] = useState('')
  const [reporting, setReporting] = useState(null)
  const [reason, setReason] = useState('')
  // Same filtering + distribution as before
  const list = all.filter((r) => tab === 'All' || (tab === 'Replied' ? !!r.reply : !r.reply))
  const dist = [5, 4, 3, 2, 1].map((n) => ({
    n,
    c: all.filter((r) => r.rating === n).length,
  }))
  const needsReply = all.filter((r) => !r.reply).length
  const replyRate = all.length ? Math.round(((all.length - needsReply) / all.length) * 100) : 0
  if (!h) return null
  const tabs = [
    { key: 'All', label: 'All', icon: 'grid', count: all.length },
    {
      key: 'Needs reply',
      label: 'Needs reply',
      icon: 'message',
      count: needsReply,
    },
    {
      key: 'Replied',
      label: 'Replied',
      icon: 'check',
      count: all.length - needsReply,
    },
  ]
  const startReply = (r) => {
    setDraft(r.reply ?? '')
    setReplying(r.id)
  }
  return (
    <>
      <ConsoleTitle
        icon="star"
        title="Reviews"
        subtitle="Reviews come only from students you've marked as moved in. Replies are public."
      />

      <RatingSummary
        rating={h.rating}
        count={h.reviewCount}
        dist={dist}
        needsReply={needsReply}
        replyRate={replyRate}
      />

      <div className="mt-5 mb-4">
        <PillTabs options={tabs} value={tab} onChange={setTab} />
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        <div className="min-w-0">
          {list.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line-strong bg-surface">
              <EmptyState
                icon={tab === 'Needs reply' ? 'check' : 'star'}
                title={tab === 'Needs reply' ? 'All caught up' : 'Nothing here'}
                description={tab === 'Needs reply' ? "You've replied to every review." : undefined}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((r) => {
                const waiting = !r.reply
                const editing = replying === r.id
                return (
                  <article
                    key={r.id}
                    className={cx(
                      'relative rounded-xl border bg-surface p-5 overflow-hidden',
                      waiting ? 'border-[#EFDDB3]' : 'border-line',
                    )}
                  >
                    {waiting && <span className="absolute left-0 inset-y-0 w-1 bg-warning" />}
                    <div className="flex items-start gap-3">
                      <Avatar name={r.studentName} size={42} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-body font-semibold text-ink">{r.studentName}</p>
                              <span className="inline-flex items-center gap-1 text-tiny text-success">
                                <Icon name="shieldCheck" size={12} />
                                Verified resident
                              </span>
                              {waiting && (
                                <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-warning-bg text-warning text-tiny font-semibold">
                                  <Icon name="message" size={10} />
                                  Needs reply
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 flex items-center gap-2 text-caption text-muted">
                              <Stars value={r.rating} size={12} />
                              <span className="inline-flex items-center gap-1">
                                <Icon name="calendar" size={11} />
                                {r.date}
                              </span>
                            </p>
                          </div>
                          <Menu
                            trigger={(_, t) => (
                              <IconButton
                                icon="more"
                                label="Review options"
                                size="sm"
                                onClick={t}
                              />
                            )}
                            items={[
                              {
                                label: 'Report to moderators',
                                icon: 'flag',
                                onClick: () => {
                                  setReason('')
                                  setReporting(r)
                                },
                              },
                            ]}
                          />
                        </div>

                        <p className="mt-3 text-body-lg leading-relaxed text-ink-2">{r.text}</p>

                        {/* Existing reply */}
                        {r.reply && !editing && (
                          <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50/60 p-4">
                            <div className="flex items-center justify-between gap-2">
                              <p className="flex items-center gap-1.5 text-caption font-semibold text-brand-800">
                                <Icon name="message" size={13} />
                                Your public reply
                              </p>
                              <Button
                                size="sm"
                                variant="ghost"
                                icon="edit"
                                onClick={() => startReply(r)}
                              >
                                Edit
                              </Button>
                            </div>
                            <p className="mt-1 text-body text-ink-2 leading-relaxed">{r.reply}</p>
                          </div>
                        )}

                        {/* Reply editor */}
                        {editing ? (
                          <div className="mt-4 rounded-lg border border-line bg-canvas p-3.5">
                            <Textarea
                              rows={3}
                              autoFocus
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              placeholder="Thank them, address specific points, and keep it professional."
                            />
                            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                              <span className="flex items-center gap-1.5 text-caption text-muted">
                                <Icon name="eye" size={12} />
                                Visible to everyone ·
                                <span
                                  className={cx(
                                    'tabular',
                                    draft.trim().length >= MIN_REPLY ? 'text-success' : '',
                                  )}
                                >
                                  {draft.trim().length} characters
                                </span>
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setReplying(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  icon="send"
                                  disabled={!draft.trim()}
                                  onClick={() => {
                                    s.replyToReview(r.id, draft.trim())
                                    setReplying(null)
                                    toast('Reply published')
                                  }}
                                >
                                  Publish reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          waiting && (
                            <Button
                              className="mt-4"
                              size="sm"
                              icon="message"
                              onClick={() => startReply(r)}
                            >
                              Reply publicly
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <ReplyTips />
      </div>

      {/*  Report  */}
      <Modal
        open={!!reporting}
        onClose={() => setReporting(null)}
        title="Report this review"
        description="Moderators remove reviews that are fake, abusive or not about a real stay. Negative but honest reviews stay up."
        footer={
          <>
            <Button variant="secondary" onClick={() => setReporting(null)}>
              Cancel
            </Button>
            <Button
              icon="flag"
              disabled={!reason.trim()}
              onClick={() => {
                if (reporting)
                  s.createReport({
                    type: 'Reported Review',
                    title: `Review on ${h.name}`,
                    reportReason: reason.trim(),
                    content: reporting.text,
                    reviewId: reporting.id,
                  })
                setReporting(null)
                toast('Report sent to moderators')
              }}
            >
              Send report
            </Button>
          </>
        }
      >
        <span className="mb-4 h-11 w-11 rounded-full bg-warning-bg text-warning flex items-center justify-center">
          <Icon name="flag" size={20} />
        </span>
        <Field label="Reason">
          <Textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. This person never lived here, or the review contains abusive language."
          />
        </Field>
      </Modal>
    </>
  )
}
