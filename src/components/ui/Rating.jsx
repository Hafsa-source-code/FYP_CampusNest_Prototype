import { cn } from '@/utils/cn'
import { Icon } from './Icon'

/** Compact rating: ★ 4.6 (32). Shows "No reviews yet" when there's no rating. */
export function Rating({ value, count, className }) {
  if (!value) {
    return <span className={cn('text-small text-muted', className)}>No reviews yet</span>
  }

  return (
    <span className={cn('inline-flex items-center gap-1 text-small', className)}>
      <Icon name="star" size={13} filled strokeWidth={1.5} className="text-star" />
      <span className="tabular font-semibold text-ink">{value.toFixed(1)}</span>
      {count !== undefined && <span className="tabular text-muted">({count})</span>}
    </span>
  )
}
