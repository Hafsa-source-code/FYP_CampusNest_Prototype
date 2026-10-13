import { Icon } from '@/components/ui'

const PILL = 'inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-tiny font-semibold'

/** Small labels on the top-left of a hostel photo. */
export function HostelCardBadges({ hostel, unavailable }) {
  if (unavailable)
    return <span className={`${PILL} bg-ink/85 text-white`}>No longer available</span>

  return (
    <>
      {hostel.verifiedStays > 0 ? (
        <span className={`${PILL} bg-charcoal text-white`}>
          <Icon name="shieldCheck" size={12} />
          {hostel.verifiedStays} verified stays
        </span>
      ) : (
        <span className={`${PILL} bg-charcoal text-white`}>Newly listed</span>
      )}
      <span className={`${PILL} bg-white/90 text-ink`}>{hostel.gender}</span>
      {hostel.hasAC && <span className={`${PILL} bg-white/90 text-ink`}>AC rooms</span>}
    </>
  )
}
