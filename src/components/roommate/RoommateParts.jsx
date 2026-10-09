import { cx, rs } from '../../lib'
import { Icon } from '../icons'
import { Avatar, Button } from '../ui'
import { MatchRing } from '../room/RoomParts'
//  Shared
/** Icon in a soft blue circle — used beside headings. */
export function IconDot({ icon, size = 40 }) {
  return (
    <span
      className="shrink-0 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Icon name={icon} size={Math.round(size * 0.45)} />
    </span>
  )
}
/** Tappable pill group with separate value + label. */
export function PillGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cx(
            'h-9 px-4 rounded-full border text-small font-medium transition-colors',
            value === o.value
              ? 'border-brand-700 bg-brand-700 text-white'
              : 'border-line-strong bg-surface text-ink-2 hover:border-brand-200',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
//  Matches page
/** Navy card summarising the student's own profile. */
export function ProfileSummaryCard({ sleep, study, budgetMin, budgetMax, cleanliness, onEdit }) {
  const rows = [
    {
      icon: sleep === 'Early bird' ? 'sun' : 'moon',
      label: 'Sleep',
      value: sleep,
    },
    { icon: 'book', label: 'Study', value: study },
    {
      icon: 'tag',
      label: 'Budget',
      value: `${rs(budgetMin)}–${rs(budgetMax)}`,
    },
    { icon: 'sparkles', label: 'Tidiness', value: `${cleanliness} / 5` },
  ]
  return (
    <div className="rounded-xl bg-charcoal text-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-tiny font-semibold uppercase tracking-[0.12em] text-white/60">
          Your profile
        </p>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-caption font-semibold text-brand-200 hover:text-white"
        >
          <Icon name="pen" size={12} />
          Edit
        </button>
      </div>
      <dl className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 text-body">
            <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name={r.icon} size={14} />
            </span>
            <dt className="text-white/60">{r.label}</dt>
            <dd className="ml-auto font-semibold text-right">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
/** One match: score ring, who they are, shared traits, difference, AI reason, actions. */
export function MatchCard({ m, hostelName, top, onViewRoom, onViewHostel }) {
  return (
    <article
      className={cx(
        'relative rounded-xl border bg-surface p-5 flex flex-col transition-shadow hover:shadow-card',
        top ? 'border-brand-700 ring-1 ring-brand-700' : 'border-line',
      )}
    >
      {top && (
        <span className="absolute -top-3 left-5 inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-brand-700 text-white text-tiny font-semibold">
          <Icon name="star" size={11} filled />
          Top match
        </span>
      )}

      <div className="flex items-start gap-4">
        <MatchRing score={m.score} size={68} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <Avatar name={m.name} size={34} />
            <div className="min-w-0">
              <p className="text-lead font-semibold text-ink">{m.name}</p>
              <p className="text-small text-muted truncate">{m.programme}</p>
            </div>
          </div>
          <button
            onClick={onViewHostel}
            className="mt-3 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-sunken text-caption font-medium text-ink-2 hover:text-brand-700"
          >
            <Icon name="building" size={13} />
            Interested in {hostelName}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-tiny font-semibold uppercase tracking-[0.1em] text-muted">In common</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {m.shared.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-success-bg text-caption font-medium text-success"
            >
              <Icon name="check" size={12} strokeWidth={2.5} />
              {t}
            </span>
          ))}
        </div>
        <p className="mt-3 text-tiny font-semibold uppercase tracking-[0.1em] text-muted">
          Differs
        </p>
        <span className="mt-2 inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-warning-bg text-caption font-medium text-warning">
          <Icon name="alert" size={12} />
          {m.differs}
        </span>
      </div>

      <div className="mt-4 rounded-lg bg-brand-50 border border-brand-200 p-3.5">
        <p className="flex items-center gap-1.5 text-caption font-semibold text-brand-800">
          <Icon name="sparkles" size={13} />
          Why you match
        </p>
        <p className="mt-1.5 text-small leading-relaxed text-ink-2">{m.summary}</p>
      </div>

      <div className="mt-auto pt-4">
        <Button full icon="door" iconRight="chevronRight" onClick={onViewRoom}>
          View room
        </Button>
      </div>
    </article>
  )
}
/** Shown before the student has a profile. */
/** Shown before the student has a profile. Compact so it fits one screen. */
export function MatchGate({ onCreate }) {
  const steps = [
    {
      icon: 'pen',
      title: 'Answer 8 questions',
      text: 'Sleep, study, tidiness, budget and more.',
    },
    {
      icon: 'chart',
      title: 'We score compatibility',
      text: 'Shared habits raise the score.',
    },
    { icon: 'users', title: 'See your matches', text: 'Best match first.' },
  ]
  return (
    <div className="rounded-xl border border-line bg-surface px-6 py-8 flex flex-col items-center text-center">
      <span className="h-14 w-14 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
        <Icon name="users" size={24} />
      </span>
      <h2 className="mt-4 tracking-tight text-title font-semibold text-ink">
        Create your roommate profile first
      </h2>
      <p className="mt-1 text-small text-muted max-w-md">
        We use it to score how well you'd get on with residents and other students.
      </p>

      <ol className="mt-6 grid sm:grid-cols-3 gap-3 w-full max-w-3xl text-left">
        {steps.map((st, i) => (
          <li key={st.title} className="flex items-start gap-3 rounded-lg bg-sunken p-3.5">
            <span className="relative shrink-0">
              <span className="h-9 w-9 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                <Icon name={st.icon} size={16} />
              </span>
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-brand-700 text-white text-micro font-bold flex items-center justify-center">
                {i + 1}
              </span>
            </span>
            <div>
              <p className="text-small font-semibold text-ink">{st.title}</p>
              <p className="text-caption text-muted">{st.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <Button icon="pen" className="mt-6" onClick={onCreate}>
        Create profile
      </Button>
    </div>
  )
}
//  Profile page
/** One card grouping several questions. */
export function QuestionGroup({ icon, title, children }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="flex items-center gap-3 tracking-tight text-title font-semibold text-ink">
        <IconDot icon={icon} size={38} />
        {title}
      </h2>
      <div className="mt-5 divide-y divide-line">{children}</div>
    </section>
  )
}
/** One question inside a group. */
export function Question({ icon, title, hint, children }) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-start gap-2.5 mb-3">
        <Icon name={icon} size={16} className="mt-0.5 text-brand-700 shrink-0" />
        <div>
          <h3 className="text-body font-semibold text-ink">{title}</h3>
          {hint && <p className="mt-0.5 text-small text-muted">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
/** Big option cards with an icon (used for sleep and study). */
export function IconChoice({ options, value, onChange }) {
  return (
    <div role="radiogroup" className="grid grid-cols-3 gap-2.5">
      {options.map((o) => {
        const on = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cx(
              'relative rounded-lg border-2 p-3.5 text-left transition-colors',
              on ? 'border-brand-700 bg-brand-50' : 'border-line hover:border-brand-200',
            )}
          >
            <span
              className={cx(
                'h-9 w-9 rounded-full flex items-center justify-center',
                on ? 'bg-brand-700 text-white' : 'bg-sunken text-ink-2',
              )}
            >
              <Icon name={o.icon} size={17} />
            </span>
            <p className="mt-2.5 text-body font-semibold text-ink">{o.value}</p>
            <p className="text-caption text-muted">{o.hint}</p>
            {on && (
              <span className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full bg-brand-700 text-white flex items-center justify-center">
                <Icon name="check" size={11} strokeWidth={3} />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
/** 1–5 numbered buttons with end labels (used for cleanliness). */
export function ScaleChoice({ value, onChange, low, high }) {
  return (
    <div>
      <div role="radiogroup" className="grid grid-cols-5 gap-2 max-w-md">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            className={cx(
              'h-11 rounded-md border-2 text-body-lg font-bold tabular transition-colors',
              value === n
                ? 'border-brand-700 bg-brand-700 text-white'
                : n < value
                  ? 'border-brand-200 bg-brand-50 text-brand-700'
                  : 'border-line text-muted hover:border-brand-200',
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between max-w-md text-caption text-muted">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  )
}
/** The three-step matching pipeline, as locked in the project spec. */
export function HowMatchingWorks() {
  const steps = [
    {
      icon: 'filter',
      title: 'Hard filters',
      text: 'Budget and deal-breakers like smoking remove poor fits first.',
    },
    {
      icon: 'chart',
      title: 'Weighted score',
      text: 'Sleep, study, tidiness, visitors and noise are compared and weighted.',
    },
    {
      icon: 'sparkles',
      title: 'AI explanation',
      text: 'AI writes a short reason in plain words. It never sets the score.',
    },
  ]
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <p className="text-body font-semibold text-ink">How matching works</p>
      <ol className="mt-4 space-y-4">
        {steps.map((st, i) => (
          <li key={st.title} className="flex gap-3">
            <span className="relative">
              <IconDot icon={st.icon} size={34} />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-brand-700 text-white text-micro font-bold flex items-center justify-center">
                {i + 1}
              </span>
            </span>
            <div>
              <p className="text-small font-semibold text-ink">{st.title}</p>
              <p className="text-caption text-muted leading-relaxed">{st.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 pt-4 border-t border-line flex gap-2 text-caption text-muted">
        <Icon name="lock" size={13} className="mt-0.5 shrink-0" />
        Other students never see your answers — only the score and what you have in common.
      </p>
    </div>
  )
}
