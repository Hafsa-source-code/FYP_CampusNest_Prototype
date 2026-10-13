import { Button, Icon } from '@/components/ui'
import { toast } from '@/components/feedback'
import { cn } from '@/utils/cn'
import { useWishlist } from '../hooks/useWishlist'

/**
 * Save / unsave a hostel.
 * variant "icon": round heart on hostel photos (cards)
 * variant "pill": rounded button with the word Save / Saved (hostel page header)
 */
export function SaveHostelButton({ hostelId, variant = 'icon' }) {
  const { isSaved, toggle } = useWishlist()
  const saved = isSaved(hostelId)

  const handleClick = (event) => {
    event.stopPropagation() // on a card: don't also open the hostel
    toggle(hostelId)
    toast(saved ? 'Removed from saved' : 'Saved to your list')
  }

  const heart = (
    <Icon
      name="heart"
      size={16}
      filled={saved}
      className={cn(saved && 'text-brand-700', variant === 'icon' && !saved && 'text-ink')}
    />
  )

  if (variant === 'pill')
    return (
      <Button variant="secondary" className="rounded-full" aria-pressed={saved} onClick={handleClick}>
        {heart}
        {saved ? 'Saved' : 'Save'}
      </Button>
    )

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? 'Remove from saved' : 'Save hostel'}
      aria-pressed={saved}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-card transition-transform hover:scale-105"
    >
      {heart}
    </button>
  )
}