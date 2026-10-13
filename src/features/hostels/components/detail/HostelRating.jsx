import { Icon } from '@/components/ui'

/** "★ 4.8 (32 reviews)", or "New on CampusNest" when there are no reviews yet. */
export function HostelRating({ rating, reviewCount }) {
  if (!reviewCount) return <span>New on CampusNest</span>

  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
      <Icon name="star" size={15} filled className="text-star" strokeWidth={1.5} />
      {rating.toFixed(1)}
      <span className="font-normal text-muted">({reviewCount} reviews)</span>
    </span>
  )
}