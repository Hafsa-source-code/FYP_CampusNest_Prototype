import { Icon } from '@/components/ui'
import { cn } from '@/utils/cn'

const SIZES = {
  sm: { icon: 13, text: 'text-small', count: (n) => `(${n})`, none: 'New' },
  md: { icon: 15, text: '', count: (n) => `(${n} reviews)`, none: 'New on CampusNest' },
}

/**
 * Star rating with review count: "★ 4.8 (32)". Shows "New" when there are no reviews.
 * size: sm (hostel cards) | md (hostel page)
 */
export function HostelRating({ rating, reviewCount, size = 'md' }) {
  const s = SIZES[size]

  if (!reviewCount) return <span className={cn('text-muted', s.text)}>{s.none}</span>

  return (
    <span className={cn('tabular inline-flex items-center gap-1 font-semibold text-ink', s.text)}>
      <Icon name="star" size={s.icon} filled className="text-star" strokeWidth={1.5} />
      {rating.toFixed(1)}
      <span className="font-normal text-muted">{s.count(reviewCount)}</span>
    </span>
  )
}