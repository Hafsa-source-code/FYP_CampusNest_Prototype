import { useState } from 'react'
import { useStore } from '../../store'
import { navigate, rs, cx } from '../../lib'
import { Icon } from '../icons'
import { Avatar, Button, Field, IconButton, Menu, Modal, Photo, Textarea, toast } from '../ui'
export const TYPE_META = {
  Question: {
    label: 'Question',
    icon: 'help',
    tone: 'bg-brand-50 text-brand-700',
  },
  Experience: {
    label: 'Experience',
    icon: 'pen',
    tone: 'bg-success-bg text-success',
  },
  Marketplace: {
    label: 'For sale',
    icon: 'tag',
    tone: 'bg-warning-bg text-warning',
  },
  'Study Partners': {
    label: 'Study partners',
    icon: 'book',
    tone: 'bg-[#EAE6F0] text-[#4D3F66]',
  },
}
export const TYPE_LABEL = Object.fromEntries(
  Object.entries(TYPE_META).map(([k, v]) => [k, v.label]),
)
export function postLink(p) {
  return p.type === 'Marketplace' ? `/s/market/${p.id}` : `/s/community/${p.id}`
}
//  Small pieces
/** Coloured pill showing the post type. */
export function TypePill({ type }) {
  const m = TYPE_META[type]
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-tiny font-semibold',
        m.tone,
      )}
    >
      <Icon name={m.icon} size={12} />
      {m.label}
    </span>
  )
}
/** Seller trust chip from real account age + verified stays (no ID documents). */
export function SellerTrust({ seller }) {
  return seller.stays > 0 ? (
    <span className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-success-bg text-success text-caption font-medium">
      <Icon name="shieldCheck" size={13} />
      Member {seller.months} months · {seller.stays} verified stay
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-warning-bg text-warning text-caption font-medium">
      <Icon name="alert" size={13} />
      New account, no verified stays yet
    </span>
  )
}
/** Grey chip linking to a tagged hostel. */
export function HostelChip({ name, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-sunken text-caption font-medium text-ink-2 hover:text-brand-700"
    >
      <Icon name="building" size={13} />
      {name}
    </button>
  )
}
/** Compact page title: icon circle + serif heading + subtitle + optional action. */
export function PageTitle({ icon, title, subtitle, action }) {
  return (
    <div className="pt-6 pb-5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 shrink-0 rounded-full bg-brand-700 text-white flex items-center justify-center">
          <Icon name={icon} size={18} />
        </span>
        <div>
          <h1 className="tracking-tight text-heading leading-tight font-semibold text-ink">
            {title}
          </h1>
          {subtitle && <p className="text-small text-muted">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}
/** Live character counter that turns green once the minimum is met. */
export function Counter({ n, min }) {
  return (
    <span className={cx('text-caption tabular', n >= min ? 'text-success' : 'text-muted')}>
      {n >= min && <Icon name="check" size={11} className="inline mr-0.5" strokeWidth={3} />}
      {n}/{min}+
    </span>
  )
}
//  Report pop-up (used for posts and comments)
export function ReportModal({ open, onClose, target, onSubmit }) {
  const [reason, setReason] = useState('')
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Report ${target}`}
      description="Tell us what's wrong. Moderators review every report within 24 hours."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            icon="flag"
            disabled={!reason.trim()}
            onClick={() => {
              onSubmit(reason.trim())
              setReason('')
              onClose()
              toast('Report sent to moderators')
            }}
          >
            Send report
          </Button>
        </>
      }
    >
      <Field label="Reason">
        <Textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="For example: shares a phone number, spam, or abusive language."
        />
      </Field>
    </Modal>
  )
}
//  Feed card
export function PostCard({ post, hostelName, onOpen, onHostel, onReport }) {
  const n = post.comments.length
  return (
    <article
      onClick={onOpen}
      className="group rounded-xl border border-line bg-surface p-5 cursor-pointer transition-all hover:border-brand-200 hover:shadow-card"
    >
      <div className="flex items-start gap-3">
        <Avatar name={post.author} size={38} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small">
            <span className="font-semibold text-ink">{post.author}</span>
            <span className="text-subtle">· {post.time}</span>
            <TypePill type={post.type} />
          </div>
          <div className="mt-2 flex gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-lead font-semibold text-ink leading-snug group-hover:text-brand-700 transition-colors">
                {post.title}
              </h3>
              <p className="mt-1 text-body text-muted leading-relaxed line-clamp-2">{post.body}</p>
            </div>
            {post.image && (
              <Photo
                src={post.image}
                alt={post.title}
                ratio="4/3"
                className="w-24 sm:w-32 shrink-0 self-start"
              />
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {post.price && (
              <span className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-brand-700 text-white text-caption font-bold tabular">
                <Icon name="tag" size={12} />
                {rs(post.price)}
              </span>
            )}
            {post.seller && <SellerTrust seller={post.seller} />}
            {hostelName && <HostelChip name={hostelName} onClick={onHostel} />}
            <span className="ml-auto inline-flex items-center gap-1.5 text-small text-muted">
              <Icon name="message" size={14} />
              {n} {n === 1 ? 'reply' : 'replies'}
            </span>
          </div>
        </div>
        <div className="-mr-2 -mt-1">
          <Menu
            trigger={(_, t) => (
              <IconButton icon="more" label="Post options" size="sm" onClick={t} />
            )}
            items={[{ label: 'Report post', icon: 'flag', onClick: onReport }]}
          />
        </div>
      </div>
    </article>
  )
}
//  Sidebar (feed + post detail)
export function CommunitySidebar({ onTopic }) {
  const s = useStore()
  const top = s.hostels
    .filter((h) => h.status === 'Approved')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
  const types = Object.keys(TYPE_META)
  const rules = [
    { icon: 'ban', text: 'No phone numbers or WhatsApp links.' },
    { icon: 'users', text: 'Be respectful to everyone.' },
    {
      icon: 'mapPin',
      text: 'Marketplace deals in public places, ideally on campus.',
    },
  ]
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-xl bg-charcoal text-white p-5">
        <span className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
          <Icon name="message" size={18} />
        </span>
        <p className="mt-3 text-body-lg font-semibold">Ask the people who live there</p>
        <p className="mt-1 text-small text-white/70 leading-relaxed">
          Residents answer most questions within a few hours. Contact details are never shared.
        </p>
        <Button className="mt-4" full icon="plus" onClick={() => navigate('/s/community/new')}>
          Start a post
        </Button>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="px-1 mb-2 text-small font-semibold text-ink">Topics</p>
        <ul>
          {types.map((t) => {
            const m = TYPE_META[t]
            return (
              <li key={t}>
                <button
                  onClick={() => (onTopic ? onTopic(t) : navigate('/s/community'))}
                  className="w-full flex items-center gap-3 px-1 py-2 rounded-md text-body text-ink-2 hover:bg-sunken transition-colors"
                >
                  <span
                    className={cx('h-7 w-7 rounded-full flex items-center justify-center', m.tone)}
                  >
                    <Icon name={m.icon} size={13} />
                  </span>
                  {m.label}
                  <span className="ml-auto h-5 min-w-5 px-1.5 rounded-full bg-sunken text-tiny font-semibold leading-5 text-muted tabular">
                    {s.posts.filter((p) => p.type === t).length}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="px-1 mb-2 text-small font-semibold text-ink">Most talked-about hostels</p>
        <ul className="space-y-1">
          {top.map((h, i) => (
            <li key={h.id}>
              <button
                onClick={() => navigate(`/s/hostel/${h.id}`)}
                className="w-full flex items-center gap-3 px-1 py-1.5 rounded-md text-left hover:bg-sunken transition-colors"
              >
                <span className="relative shrink-0">
                  <Photo src={h.image} alt="" ratio="1/1" className="w-10 !rounded-md" />
                  <span className="absolute -left-1.5 -top-1.5 h-5 w-5 rounded-full bg-brand-700 text-white text-micro font-bold flex items-center justify-center ring-2 ring-surface">
                    {i + 1}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-small font-semibold text-ink truncate">{h.name}</span>
                  <span className="flex items-center gap-1 text-caption text-muted">
                    {h.area} ·{' '}
                    <Icon name="star" size={11} filled className="text-star" strokeWidth={1.5} />
                    {h.rating.toFixed(1)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl bg-sunken p-4">
        <p className="flex items-center gap-2 text-small font-semibold text-ink">
          <Icon name="shield" size={14} className="text-brand-700" />
          Community rules
        </p>
        <ul className="mt-2.5 space-y-2">
          {rules.map((r) => (
            <li key={r.icon} className="flex gap-2 text-caption text-ink-2">
              <Icon name={r.icon} size={13} className="mt-0.5 shrink-0 text-muted" />
              {r.text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
