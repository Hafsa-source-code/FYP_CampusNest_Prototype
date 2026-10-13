// The small "← Find a hostel › Green Court › 3-Seater AC Room" trail at the top of a page.
// Every item except the last is a link; the last one is the page you are on.

import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui'

/** items: [{ label, to }] — leave `to` out on the last item (the current page). */
export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-small text-muted">
      {items.map((item, index) => (
        <span key={index} className="inline-flex min-w-0 items-center gap-1.5">
          {index > 0 && <Icon name="chevronRight" size={14} className="text-subtle" />}
          {item.to ? (
            <Link to={item.to} className="inline-flex items-center gap-1.5 truncate hover:text-ink">
              {index === 0 && <Icon name="arrowLeft" size={14} />}
              {item.label}
            </Link>
          ) : (
            <span className="truncate font-medium text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}