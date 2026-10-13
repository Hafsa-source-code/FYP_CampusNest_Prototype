import { Link } from 'react-router-dom'
import { Button, Icon } from '@/components/ui'
import { toast } from '@/components/feedback'
import { SaveHostelButton } from '@/features/wishlist/components/SaveHostelButton'
import { useCampus } from '../../hooks/useCampus'
import { searchLink } from '../../utils/hostelLinks'
import { HostelRating } from '../HostelRating'

/** "← Find a hostel › Model Town › Green Court Hostel" */
function Breadcrumb({ area, hostelName }) {
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

/** Copies the page address so the student can send it to someone. */
function ShareButton() {
  const share = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast('Link copied')
  }

  return (
    <Button variant="secondary" icon="share" className="rounded-full" onClick={share}>
      Share
    </Button>
  )
}

/** Top of the hostel page: breadcrumb, Share/Save, name, rating, verified stays, address. */
export function HostelHeader({ hostel }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Breadcrumb area={hostel.area} hostelName={hostel.name} />
        <div className="flex shrink-0 gap-2">
          <ShareButton />
          <SaveHostelButton hostelId={hostel.id} variant="pill" />
        </div>
      </div>

      <h1 className="mt-5 text-display-sm font-semibold tracking-tight text-ink sm:text-display">
        {hostel.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-body text-muted">
        <HostelRating rating={hostel.rating} reviewCount={hostel.reviewCount} />
        {hostel.verifiedStays > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <Icon name="shieldCheck" size={15} className="text-success" />
            {hostel.verifiedStays} verified stays
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Icon name="mapPin" size={15} />
          {hostel.address}
        </span>
      </div>
    </>
  )
}