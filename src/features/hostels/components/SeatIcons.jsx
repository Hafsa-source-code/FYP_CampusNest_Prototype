// Draws one small circle per seat in a room: a dark person = taken, a green dashed "+" = free.
// Used on the room page (students) and on the owner pages.

import { Icon } from '@/components/ui'
import { cn } from '@/utils/cn'

const TAKEN = 'rounded-full bg-charcoal text-white'
const FREE = 'rounded-full border-2 border-dashed border-success text-success'

/** total: seats in the room, free: how many are empty, size: circle size in px */
export function SeatIcons({ total, free, size = 26 }) {
  const taken = total - free

  return (
    <span className="inline-flex flex-wrap gap-1.5" aria-label={`${free} of ${total} seats free`}>
      {Array.from({ length: total }, (_, index) => {
        const isTaken = index < taken
        return (
          <span
            key={index}
            className={cn('flex items-center justify-center', isTaken ? TAKEN : FREE)}
            style={{ width: size, height: size }}
          >
            <Icon
              name={isTaken ? 'user' : 'plus'}
              size={size * 0.5}
              strokeWidth={isTaken ? undefined : 2.5}
            />
          </span>
        )
      })}
    </span>
  )
}