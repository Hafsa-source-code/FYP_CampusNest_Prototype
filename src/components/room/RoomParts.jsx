// TEMPORARY BRIDGE
// The room page has been rebuilt; these old screens still import from here:
//   SeatIcons  → OwnerDashboard, OwnerInquiries, OwnerManageRooms   (real file: features/hostels/components/SeatIcons.jsx)
//   MatchRing  → components/roommate/RoommateParts                  (real file: features/roommate/components/MatchRing.jsx)
//   Breadcrumb → CreatePost, PostDetail, MarketplaceItem             (old click-based version, kept
//                until those screens move to components/navigation/Breadcrumb.jsx in Step 5.6)

import { Icon } from '../icons'

export { SeatIcons } from '@/features/hostels/components/SeatIcons'
export { MatchRing } from '@/features/roommates/components/MatchRing'

export function Breadcrumb({ items }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 min-w-0 text-small text-muted"
    >
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 min-w-0">
          {i > 0 && <Icon name="chevronRight" size={14} className="text-subtle shrink-0" />}
          {it.onClick ? (
            <button
              onClick={it.onClick}
              className="inline-flex items-center gap-1.5 hover:text-ink truncate"
            >
              {i === 0 && <Icon name="arrowLeft" size={14} />}
              {it.label}
            </button>
          ) : (
            <span className="font-medium text-ink truncate">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}