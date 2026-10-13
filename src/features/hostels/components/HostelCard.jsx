import { generatePath, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { CompareCheckbox } from '@/features/compare/components/CompareCheckbox'
import { SaveHostelButton } from '@/features/wishlist/components/SaveHostelButton'
import { PATHS } from '@/routes/paths'
import { HostelCardBadges } from './HostelCardBadges'
import { HostelCardInfo } from './HostelCardInfo'

/**
 * Photo-led hostel card (search, saved list, landing page).
 * hostel: a hostel summary (from useHostelSummaries)
 * showCompare: show the "Add to compare" tick box
 * unavailable: greyed out, can't be opened (e.g. a saved hostel that was deactivated)
 */
export function HostelCard({ hostel, showCompare = true, unavailable = false }) {
  const navigate = useNavigate()
  const open = () => !unavailable && navigate(generatePath(PATHS.student.hostel, { id: hostel.id }))

  return (
    <article
      onClick={open}
      className={cn(
        'group relative aspect-square min-h-[330px] overflow-hidden rounded-xl bg-sunken',
        unavailable ? 'opacity-70' : 'cursor-pointer',
      )}
    >
      <img
        src={hostel.image}
        alt={hostel.name}
        loading="lazy"
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-transform duration-500',
          unavailable ? 'grayscale' : 'group-hover:scale-[1.04]',
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/10" />

      <div className="absolute left-3 right-14 top-3 flex flex-wrap gap-1.5">
        <HostelCardBadges hostel={hostel} unavailable={unavailable} />
      </div>

      <div className="absolute right-3 top-3">
        <SaveHostelButton hostelId={hostel.id} />
      </div>

      <HostelCardInfo hostel={hostel}>
        {showCompare && !unavailable && <CompareCheckbox hostelId={hostel.id} />}
      </HostelCardInfo>
    </article>
  )
}
