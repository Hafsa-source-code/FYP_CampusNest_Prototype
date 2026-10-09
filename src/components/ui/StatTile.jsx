import { cn } from '@/utils/cn'
import { IconCircle } from './IconCircle'

/**
 * Number card for dashboards: icon + label, big number, small note under it.
 * tone: colour of the icon circle (see IconCircle)
 * highlight: amber border to draw attention (e.g. pending items waiting)
 * sub: small text or element under the number
 */
export function StatTile({ icon, label, value, sub, tone = 'brand', highlight = false }) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-surface p-4',
        highlight ? 'border-[#EFDDB3]' : 'border-line',
      )}
    >
      <div className="flex items-center gap-3">
        <IconCircle icon={icon} tone={tone} />
        <p className="text-small font-medium text-muted">{label}</p>
      </div>
      <p className="tabular mt-3 text-heading font-semibold leading-none tracking-tight text-ink">
        {value}
      </p>
      {sub && <div className="mt-2 text-caption text-muted">{sub}</div>}
    </div>
  )
}
