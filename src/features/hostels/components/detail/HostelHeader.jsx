import { Icon } from '@/components/ui'
import { SaveHostelButton } from '@/features/wishlist/components/SaveHostelButton'
import { DetailBreadcrumb } from './DetailBreadcrumb'
import { HostelRating } from './HostelRating'
import { ShareButton } from './ShareButton'

/** Top of the hostel page: breadcrumb, Share/Save, name, rating, verified stays, address. */
export function HostelHeader({ hostel }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <DetailBreadcrumb area={hostel.area} hostelName={hostel.name} />
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