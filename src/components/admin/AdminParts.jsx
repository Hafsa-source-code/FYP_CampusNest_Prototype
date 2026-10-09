import { cx } from '../../lib'
import { Icon } from '../icons'
/** Compact console page title: navy icon circle + serif heading + subtitle + optional action. */
export function ConsoleTitle({ icon, title, subtitle, action }) {
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
/** Number tile with an icon circle. tone = Tailwind classes for the circle. */
export function StatTile({ icon, label, value, sub, tone = 'bg-brand-50 text-brand-700' }) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-line bg-surface p-4">
      <span
        className={cx('h-11 w-11 shrink-0 rounded-full flex items-center justify-center', tone)}
      >
        <Icon name={icon} size={19} />
      </span>
      <div className="min-w-0">
        <p className="text-caption text-muted">{label}</p>
        <p className="text-title leading-tight font-semibold text-ink tabular">{value}</p>
        {sub && <p className="text-tiny text-subtle truncate">{sub}</p>}
      </div>
    </div>
  )
}
/** Pill tabs with icons and counts. */
export function PillTabs({ options, value, onChange }) {
  return (
    <div role="tablist" className="flex gap-2 overflow-x-auto pb-1">
      {options.map((o) => {
        const on = value === o.key
        return (
          <button
            key={o.key}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.key)}
            className={cx(
              'h-9 shrink-0 px-3.5 rounded-full border inline-flex items-center gap-2 text-small font-medium transition-colors',
              on
                ? 'border-brand-700 bg-brand-700 text-white'
                : 'border-line-strong bg-surface text-ink-2 hover:border-brand-200',
            )}
          >
            <Icon name={o.icon} size={14} />
            {o.label}
            {o.count !== undefined && (
              <span
                className={cx(
                  'h-5 min-w-5 px-1.5 rounded-full text-tiny font-semibold leading-5 tabular',
                  on ? 'bg-white/20' : 'bg-sunken text-muted',
                )}
              >
                {o.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
/** Icon + grey label + value row (used in detail panels). */
export function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="h-8 w-8 shrink-0 rounded-full bg-sunken text-brand-700 flex items-center justify-center">
        <Icon name={icon} size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-tiny text-muted">{label}</p>
        <div className="text-body font-medium text-ink">{children}</div>
      </div>
    </div>
  )
}
