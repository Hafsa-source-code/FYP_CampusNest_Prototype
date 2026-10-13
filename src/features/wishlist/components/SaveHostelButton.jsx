import { Icon } from '@/components/ui'
import { toast } from '@/components/feedback'
import { useWishlist } from '../hooks/useWishlist'

/** Round heart button on hostel photos: save / unsave. */
export function SaveHostelButton({ hostelId, className }) {
  const { isSaved, toggle } = useWishlist()
  const saved = isSaved(hostelId)

  const handleClick = (event) => {
    event.stopPropagation() // don't also open the hostel
    toggle(hostelId)
    toast(saved ? 'Removed from saved' : 'Saved to your list')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? 'Remove from saved' : 'Save hostel'}
      aria-pressed={saved}
      className={
        className ??
        'flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-card transition-transform hover:scale-105'
      }
    >
      <Icon
        name="heart"
        size={16}
        filled={saved}
        className={saved ? 'text-brand-700' : 'text-ink'}
      />
    </button>
  )
}
