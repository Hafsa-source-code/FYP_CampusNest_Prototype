import { Icon } from '@/components/ui'
import { cn } from '@/utils/cn'

/**
 * Free seats with a bed icon. Red "Full" when nothing is free.
 * compact: just the number (hostel cards); otherwise green "3 seats free" (hostel page)
 */
export function SeatsLabel({ freeSeats, compact = false }) {
  const isFull = freeSeats === 0
  const text = compact ? freeSeats : `${freeSeats} ${freeSeats === 1 ? 'seat' : 'seats'} free`

  return (
    <span
      title="Seats available"
      className={cn(
        'inline-flex items-center gap-1',
        !compact && 'gap-1.5 font-medium text-success',
        isFull && 'text-danger',
      )}
    >
      <Icon
        name="bed"
        size={compact ? 13 : 14}
        className={cn(compact && !isFull && 'text-muted')}
      />
      {isFull ? 'Full' : text}
    </span>
  )
}