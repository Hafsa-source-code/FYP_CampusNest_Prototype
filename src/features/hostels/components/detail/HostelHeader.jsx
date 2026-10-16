// What this file does:
// The top of the hostel page: breadcrumb, Share and Save buttons, hostel name,
// rating, number of verified stays, and address.

import { Button, Icon } from '@/components/ui'
import { toast } from '@/components/feedback'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { SaveHostelButton } from '@/features/wishlist/components/SaveHostelButton'
import { useCampus } from '../../hooks/useCampus'
import { searchLink } from '../../utils/hostelLinks'
import { HostelRating } from '../HostelRating'

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

export function HostelHeader({ hostel }) {
  const { campus } = useCampus()
  const breadcrumb = [
    { label: 'Find a hostel', to: searchLink(campus) },
    { label: hostel.name },
  ]

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Breadcrumb items={breadcrumb} />
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