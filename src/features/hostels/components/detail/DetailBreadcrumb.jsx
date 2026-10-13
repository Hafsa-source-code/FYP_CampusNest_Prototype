import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui'
import { useCampus } from '../../hooks/useCampus'
import { searchLink } from '../../utils/hostelLinks'

/** "← Find a hostel › Model Town › Green Court Hostel" */
export function DetailBreadcrumb({ area, hostelName }) {
  const { campus } = useCampus()

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-small text-muted">
      <Link to={searchLink(campus)} className="inline-flex items-center gap-1.5 hover:text-ink">
        <Icon name="arrowLeft" size={14} />
        Find a hostel
      </Link>
      <Icon name="chevronRight" size={14} className="text-subtle" />
      <span className="hidden sm:inline">{area}</span>
      <Icon name="chevronRight" size={14} className="hidden text-subtle sm:inline" />
      <span className="truncate font-medium text-ink">{hostelName}</span>
    </nav>
  )
}