import { Icon } from '@/components/ui'
import { cn } from '@/utils/cn'

/** Green "3 seats free" or red "Full". */
export function SeatsLabel({ freeSeats }) {
  const open = freeSeats > 0

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium',
        open ? 'text-success' : 'text-danger',
      )}
    >
      <Icon name="bed" size={14} />
      {open ? `${freeSeats} ${freeSeats === 1 ? 'seat' : 'seats'} free` : 'Full'}
    </span>
  )
}